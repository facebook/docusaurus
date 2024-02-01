/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import logger from '@docusaurus/logger';
import {DOCUSAURUS_VERSION, mapAsyncSequential} from '@docusaurus/utils';
import {load, loadContext, type LoadContextOptions} from '../server';
import {handleBrokenLinks} from '../server/brokenLinks';

import {createBuildClientConfig} from '../webpack/client';
import createServerConfig from '../webpack/server';
import {
  executePluginsConfigurePostCss,
  executePluginsConfigureWebpack,
  compile,
} from '../webpack/utils';
import {loadI18n} from '../server/i18n';
import {generateStaticFiles} from '../ssg';
import ssrDefaultTemplate from '../webpack/templates/ssr.html.template';
import type {Manifest} from 'react-loadable-ssr-addon-v5-slorber';
import type {Configuration} from 'webpack';
import type {LoadedPlugin, Props} from '@docusaurus/types';
import type {SiteCollectedData} from '../types';

export type BuildCLIOptions = Pick<
  LoadContextOptions,
  'config' | 'locale' | 'outDir'
> & {
  bundleAnalyzer?: boolean;
  minify?: boolean;
  dev?: boolean;
};

export async function build(
  siteDirParam: string = '.',
  cliOptions: Partial<BuildCLIOptions> = {},
  // When running build, we force terminate the process to prevent async
  // operations from never returning. However, if run as part of docusaurus
  // deploy, we have to let deploy finish.
  // See https://github.com/facebook/docusaurus/pull/2496
  forceTerminate: boolean = true,
): Promise<string> {
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

  async function tryToBuildLocale({
    locale,
    isLastLocale,
  }: {
    locale: string;
    isLastLocale: boolean;
  }) {
    try {
      return await buildLocale({
        siteDir,
        locale,
        cliOptions,
        forceTerminate,
        isLastLocale,
      });
    } catch (err) {
      throw new Error(
        logger.interpolate`Unable to build website for locale name=${locale}.`,
        {
          cause: err,
        },
      );
    }
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
  if (cliOptions.locale) {
    return tryToBuildLocale({locale: cliOptions.locale, isLastLocale: true});
  }
  if (i18n.locales.length > 1) {
    logger.info`Website will be built for all these locales: ${i18n.locales}`;
  }

  // We need the default locale to always be the 1st in the list. If we build it
  // last, it would "erase" the localized sites built in sub-folders
  const orderedLocales: [string, ...string[]] = [
    i18n.defaultLocale,
    ...i18n.locales.filter((locale) => locale !== i18n.defaultLocale),
  ];

  const results = await mapAsyncSequential(orderedLocales, (locale) => {
    const isLastLocale =
      orderedLocales.indexOf(locale) === orderedLocales.length - 1;
    return tryToBuildLocale({locale, isLastLocale});
  });
  return results[0]!;
}

async function buildLocale({
  siteDir,
  locale,
  cliOptions,
  forceTerminate,
  isLastLocale,
}: {
  siteDir: string;
  locale: string;
  cliOptions: Partial<BuildCLIOptions>;
  forceTerminate: boolean;
  isLastLocale: boolean;
}): Promise<string> {
  // Temporary workaround to unlock the ability to translate the site config
  // We'll remove it if a better official API can be designed
  // See https://github.com/facebook/docusaurus/issues/4542
  process.env.DOCUSAURUS_CURRENT_LOCALE = locale;

  logger.info`name=${`[${locale}]`} Creating an optimized production build...`;

  const props: Props = await load({
    siteDir,
    outDir: cliOptions.outDir,
    config: cliOptions.config,
    locale,
    localizePath: cliOptions.locale ? false : undefined,
  });

  // Apply user webpack config.
  const {outDir, plugins} = props;

  // We can build the 2 configs in parallel
  const [{clientConfig, clientManifestPath}, {serverConfig}] =
    await Promise.all([
      buildPluginsClientConfig({
        plugins,
        props,
        minify: cliOptions.minify,
        bundleAnalyzer: cliOptions.bundleAnalyzer,
      }),
      buildPluginsServerConfig({
        plugins,
        props,
      }),
    ]);

  // Make sure generated client-manifest is cleaned first so we don't reuse
  // the one from previous builds.
  if (await fs.pathExists(clientManifestPath)) {
    await fs.unlink(clientManifestPath);
  }

  // Run webpack to build JS bundle (client) and static html files (server).
  await compile([clientConfig, serverConfig]);

  const manifest: Manifest = await fs.readJSON(clientManifestPath, 'utf-8');

  // TODO return this path from "createServerConfig"?
  const serverBundlePath = path.join(
    outDir,
    serverConfig.output?.filename as string,
  );

  console.time('handleSSG');
  const {collectedData} = await handleSSG({
    props,
    serverBundlePath,
    manifest,
  });
  console.timeEnd('handleSSG');

  // Remove server.bundle.js because it is not needed.
  if (typeof serverConfig.output?.filename === 'string') {
    if (await fs.pathExists(serverBundlePath)) {
      await fs.unlink(serverBundlePath);
    }
  }

  // Plugin Lifecycle - postBuild.
  await executePluginsPostBuild({plugins, props, collectedData});

  // TODO execute this in parallel to postBuild?
  await executeBrokenLinksCheck({props, collectedData});

  logger.success`Generated static files in path=${path.relative(
    process.cwd(),
    outDir,
  )}.`;

  if (isLastLocale) {
    logger.info`Use code=${'npm run serve'} command to test your build locally.`;
  }

  if (forceTerminate && isLastLocale && !cliOptions.bundleAnalyzer) {
    process.exit(0);
  }

  return outDir;
}

// TODO refactor
async function handleSSG({
  props,
  serverBundlePath,
  manifest,
}: {
  props: Props;
  serverBundlePath: string;
  manifest: Manifest;
}) {
  return generateStaticFiles({
    pathnames: props.routesPaths,
    serverBundlePath,
    serverEntryParams: {
      trailingSlash: props.siteConfig.trailingSlash,
      outDir: props.outDir,
      baseUrl: props.baseUrl,
      manifest,
      headTags: props.headTags,
      preBodyTags: props.preBodyTags,
      postBodyTags: props.postBodyTags,
      ssrTemplate: props.siteConfig.ssrTemplate ?? ssrDefaultTemplate,
      noIndex: props.siteConfig.noIndex,
      DOCUSAURUS_VERSION,
    },
  });
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
  const head = _.mapValues(collectedData, (d) => d.headTags);
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

async function buildPluginsClientConfig({
  plugins,
  props,
  minify,
  bundleAnalyzer,
}: {
  plugins: LoadedPlugin[];
  props: Props;
  minify?: boolean;
  bundleAnalyzer?: boolean;
}) {
  const clientConfigResult = await createBuildClientConfig({
    props,
    minify,
    bundleAnalyzer,
  });
  // TODO awkward ESLint issue, refactor
  const {clientManifestPath} = clientConfigResult;
  let {clientConfig} = clientConfigResult;
  clientConfig = executePluginsConfigureWebpack({
    plugins,
    config: clientConfig,
    isServer: false,
    jsLoader: props.siteConfig.webpack?.jsLoader,
  });
  return {clientConfig, clientManifestPath};
}

async function buildPluginsServerConfig({
  plugins,
  props,
}: {
  plugins: LoadedPlugin[];
  props: Props;
}) {
  let serverConfig: Configuration = await createServerConfig({
    props,
  });
  serverConfig = executePluginsConfigurePostCss({
    plugins,
    config: serverConfig,
  });
  serverConfig = executePluginsConfigureWebpack({
    plugins,
    config: serverConfig,
    isServer: true,
    jsLoader: props.siteConfig.webpack?.jsLoader,
  });
  return {serverConfig};
}
