/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import {compile} from '@docusaurus/bundler';
import logger, {PerfLogger} from '@docusaurus/logger';
import {loadSite} from '../../server/site';
import {handleBrokenLinks} from '../../server/brokenLinks';
import {createBuildClientConfig} from '../../webpack/client';
import createServerConfig from '../../webpack/server';
import {
  createConfigureWebpackUtils,
  executePluginsConfigureWebpack,
} from '../../webpack/configure';
import {executeSSG} from '../../ssg/ssgExecutor';
import type {
  ConfigureWebpackUtils,
  LoadedPlugin,
  Props,
} from '@docusaurus/types';
import type {SiteCollectedData} from '../../common';
import {BuildCLIOptions} from './build';

export type BuildLocaleParams = {
  siteDir: string;
  locale: string;
  cliOptions: Partial<BuildCLIOptions>;
};

export async function buildLocale({
  siteDir,
  locale,
  cliOptions,
}: BuildLocaleParams): Promise<void> {
  // Temporary workaround to unlock the ability to translate the site config
  // We'll remove it if a better official API can be designed
  // See https://github.com/facebook/docusaurus/issues/4542
  process.env.DOCUSAURUS_CURRENT_LOCALE = locale;

  logger.info`name=${`[${locale}]`} Creating an optimized production build...`;

  const site = await PerfLogger.async('Load site', () =>
    loadSite({
      siteDir,
      outDir: cliOptions.outDir,
      config: cliOptions.config,
      locale,
      localizePath: cliOptions.locale?.length === 1 ? false : undefined,
    }),
  );

  const {props} = site;
  const {outDir, plugins, siteConfig} = props;

  const router = siteConfig.future.experimental_router;

  const configureWebpackUtils = await createConfigureWebpackUtils({siteConfig});

  // We can build the 2 configs in parallel
  const [{clientConfig, clientManifestPath}, {serverConfig, serverBundlePath}] =
    await PerfLogger.async(
      `Creating ${props.currentBundler.name} bundler configs`,
      () =>
        Promise.all([
          getBuildClientConfig({
            props,
            cliOptions,
            configureWebpackUtils,
          }),
          getBuildServerConfig({
            props,
            configureWebpackUtils,
          }),
        ]),
    );

  // Run webpack to build JS bundle (client) and static html files (server).
  await PerfLogger.async(`Bundling with ${props.currentBundler.name}`, () => {
    return compile({
      configs:
        // For hash router we don't do SSG and can skip the server bundle
        router === 'hash' ? [clientConfig] : [clientConfig, serverConfig],
      currentBundler: configureWebpackUtils.currentBundler,
    });
  });

  const {collectedData} = await PerfLogger.async('SSG', () =>
    executeSSG({
      props,
      serverBundlePath,
      clientManifestPath,
      router,
    }),
  );

  await cleanupServerBundle(serverBundlePath);

  // Plugin Lifecycle - postBuild.
  await PerfLogger.async('postBuild()', () =>
    executePluginsPostBuild({plugins, props, collectedData}),
  );

  // TODO execute this in parallel to postBuild?
  await PerfLogger.async('Broken links checker', () =>
    executeBrokenLinksCheck({props, collectedData}),
  );

  logger.success`Generated static files in path=${path.relative(
    process.cwd(),
    outDir,
  )}.`;
}

async function executePluginsPostBuild({
  plugins,
  props,
  collectedData,
}: {
  plugins: LoadedPlugin[];
  props: Props;
  collectedData: SiteCollectedData;
}) {
  const head = props.siteConfig.future.v4.removeLegacyPostBuildHeadAttribute
    ? {}
    : _.mapValues(collectedData, (d) => d.metadata.helmet!);

  const routesBuildMetadata = _.mapValues(
    collectedData,
    (d) => d.metadata.public,
  );

  await Promise.all(
    plugins.map(async (plugin) => {
      if (!plugin.postBuild) {
        return;
      }
      await plugin.postBuild({
        ...props,
        head,
        routesBuildMetadata,
        content: plugin.content,
      });
    }),
  );
}

async function executeBrokenLinksCheck({
  props: {
    routes,
    siteConfig: {onBrokenLinks, onBrokenAnchors},
  },
  collectedData,
}: {
  props: Props;
  collectedData: SiteCollectedData;
}) {
  const collectedLinks = _.mapValues(collectedData, (d) => ({
    links: d.links,
    anchors: d.anchors,
  }));
  await handleBrokenLinks({
    collectedLinks,
    routes,
    onBrokenLinks,
    onBrokenAnchors,
  });
}

async function getBuildClientConfig({
  props,
  cliOptions,
  configureWebpackUtils,
}: {
  props: Props;
  cliOptions: BuildCLIOptions;
  configureWebpackUtils: ConfigureWebpackUtils;
}) {
  const {plugins} = props;
  const result = await createBuildClientConfig({
    props,
    minify: cliOptions.minify ?? true,
    faster: props.siteConfig.future.experimental_faster,
    configureWebpackUtils,
    bundleAnalyzer: cliOptions.bundleAnalyzer ?? false,
  });
  let {config} = result;
  config = executePluginsConfigureWebpack({
    plugins,
    config,
    isServer: false,
    configureWebpackUtils,
  });
  return {clientConfig: config, clientManifestPath: result.clientManifestPath};
}

async function getBuildServerConfig({
  props,
  configureWebpackUtils,
}: {
  props: Props;
  configureWebpackUtils: ConfigureWebpackUtils;
}) {
  const {plugins} = props;
  const result = await createServerConfig({
    props,
    configureWebpackUtils,
  });
  let {config} = result;
  config = executePluginsConfigureWebpack({
    plugins,
    config,
    isServer: true,
    configureWebpackUtils,
  });
  return {serverConfig: config, serverBundlePath: result.serverBundlePath};
}

// Remove /build/server server.bundle.js because it is not needed.
async function cleanupServerBundle(serverBundlePath: string) {
  if (process.env.DOCUSAURUS_KEEP_SERVER_BUNDLE === 'true') {
    logger.warn(
      "Will NOT delete server bundle because DOCUSAURUS_KEEP_SERVER_BUNDLE is set to 'true'",
    );
  } else {
    await PerfLogger.async('Deleting server bundle', async () => {
      // For now we assume server entry is at the root of the server out dir
      const serverDir = path.dirname(serverBundlePath);
      await fs.rm(serverDir, {recursive: true, force: true});
    });
  }
}
