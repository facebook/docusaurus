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
import {mapAsyncSequential} from '@docusaurus/utils';
import {loadSite, loadContext, type LoadContextParams} from '../server/site';
import {handleBrokenLinks} from '../server/brokenLinks';
import {createBuildClientConfig} from '../webpack/client';
import createServerConfig from '../webpack/server';
import {
  createConfigureWebpackUtils,
  executePluginsConfigureWebpack,
} from '../webpack/configure';
import {loadI18n} from '../server/i18n';
import {executeSSG} from '../ssg/ssgExecutor';
import type {
  ConfigureWebpackUtils,
  LoadedPlugin,
  Props,
} from '@docusaurus/types';
import type {SiteCollectedData} from '../common';

export type BuildCLIOptions = Pick<
  LoadContextParams,
  'config' | 'locale' | 'outDir'
> & {
  bundleAnalyzer?: boolean;
  minify?: boolean;
  dev?: boolean;
};

export async function build(
  siteDirParam: string = '.',
  cliOptions: Partial<BuildCLIOptions> = {},
): Promise<void> {
  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';
  process.env.DOCUSAURUS_CURRENT_LOCALE = cliOptions.locale;
  if (cliOptions.dev) {
    logger.info`Building in dev mode`;
    process.env.BABEL_ENV = 'development';
    process.env.NODE_ENV = 'development';
  }

  const siteDir = await fs.realpath(siteDirParam);

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => process.exit());
  });

  async function tryToBuildLocale({locale}: {locale: string}) {
    try {
      await PerfLogger.async(`${logger.name(locale)}`, () =>
        buildLocale({
          siteDir,
          locale,
          cliOptions,
        }),
      );
    } catch (err) {
      throw new Error(
        logger.interpolate`Unable to build website for locale name=${locale}.`,
        {
          cause: err,
        },
      );
    }
  }

  const locales = await PerfLogger.async('Get locales to build', () =>
    getLocalesToBuild({siteDir, cliOptions}),
  );

  if (locales.length > 1) {
    logger.info`Website will be built for all these locales: ${locales}`;
  }

  await PerfLogger.async(`Build`, () =>
    mapAsyncSequential(locales, async (locale) => {
      await tryToBuildLocale({locale});
    }),
  );

  logger.info`Use code=${'npm run serve'} command to test your build locally.`;
}

async function getLocalesToBuild({
  siteDir,
  cliOptions,
}: {
  siteDir: string;
  cliOptions: BuildCLIOptions;
}): Promise<[string, ...string[]]> {
  if (cliOptions.locale) {
    return [cliOptions.locale];
  }

  const context = await loadContext({
    siteDir,
    outDir: cliOptions.outDir,
    config: cliOptions.config,
    locale: cliOptions.locale,
    localizePath: cliOptions.locale ? false : undefined,
  });
  const i18n = await loadI18n(context.siteConfig, {
    locale: cliOptions.locale,
  });
  if (i18n.locales.length > 1) {
    logger.info`Website will be built for all these locales: ${i18n.locales}`;
  }

  // We need the default locale to always be the 1st in the list. If we build it
  // last, it would "erase" the localized sites built in sub-folders
  return [
    i18n.defaultLocale,
    ...i18n.locales.filter((locale) => locale !== i18n.defaultLocale),
  ];
}

async function buildLocale({
  siteDir,
  locale,
  cliOptions,
}: {
  siteDir: string;
  locale: string;
  cliOptions: Partial<BuildCLIOptions>;
}): Promise<void> {
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
      localizePath: cliOptions.locale ? false : undefined,
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
  const head = _.mapValues(collectedData, (d) => d.helmet);
  await Promise.all(
    plugins.map(async (plugin) => {
      if (!plugin.postBuild) {
        return;
      }
      await plugin.postBuild({
        ...props,
        head,
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
