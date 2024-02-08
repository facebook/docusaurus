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
import {PerfLogger} from '../utils';

import {loadI18n} from '../server/i18n';
import {generateStaticFiles, loadAppRenderer} from '../ssg';
import {compileSSRTemplate} from '../templates/templates';
import defaultSSRTemplate from '../templates/ssr.html.template';

import type {Manifest} from 'react-loadable-ssr-addon-v5-slorber';
import type {LoadedPlugin, Props} from '@docusaurus/types';
import type {SiteCollectedData} from '../common';

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

  async function tryToBuildLocale({
    locale,
    isLastLocale,
  }: {
    locale: string;
    isLastLocale: boolean;
  }) {
    try {
      PerfLogger.start(`Building site for locale ${locale}`);
      await buildLocale({
        siteDir,
        locale,
        cliOptions,
        forceTerminate,
        isLastLocale,
      });
      PerfLogger.end(`Building site for locale ${locale}`);
    } catch (err) {
      throw new Error(
        logger.interpolate`Unable to build website for locale name=${locale}.`,
        {
          cause: err,
        },
      );
    }
  }

  PerfLogger.start(`Get locales to build`);
  const locales = await getLocalesToBuild({siteDir, cliOptions});
  PerfLogger.end(`Get locales to build`);

  if (locales.length > 1) {
    logger.info`Website will be built for all these locales: ${locales}`;
  }

  PerfLogger.start(`Building ${locales.length} locales`);
  await mapAsyncSequential(locales, (locale) => {
    const isLastLocale = locales.indexOf(locale) === locales.length - 1;
    return tryToBuildLocale({locale, isLastLocale});
  });
  PerfLogger.end(`Building ${locales.length} locales`);
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

  PerfLogger.start('Loading site');
  const props: Props = await load({
    siteDir,
    outDir: cliOptions.outDir,
    config: cliOptions.config,
    locale,
    localizePath: cliOptions.locale ? false : undefined,
  });
  PerfLogger.end('Loading site');

  // Apply user webpack config.
  const {outDir, plugins} = props;

  // We can build the 2 configs in parallel
  PerfLogger.start('Creating webpack configs');
  const [{clientConfig, clientManifestPath}, {serverConfig, serverBundlePath}] =
    await Promise.all([
      getBuildClientConfig({
        props,
        cliOptions,
      }),
      getBuildServerConfig({
        props,
      }),
    ]);
  PerfLogger.end('Creating webpack configs');

  // Make sure generated client-manifest is cleaned first, so we don't reuse
  // the one from previous builds.
  // TODO do we really need this? .docusaurus folder is cleaned between builds
  PerfLogger.start('Deleting previous client manifest');
  await ensureUnlink(clientManifestPath);
  PerfLogger.end('Deleting previous client manifest');

  // Run webpack to build JS bundle (client) and static html files (server).
  PerfLogger.start('Bundling');
  await compile([clientConfig, serverConfig]);
  PerfLogger.end('Bundling');

  PerfLogger.start('Executing static site generation');
  const {collectedData} = await executeSSG({
    props,
    serverBundlePath,
    clientManifestPath,
  });
  PerfLogger.end('Executing static site generation');

  // Remove server.bundle.js because it is not needed.
  PerfLogger.start('Deleting server bundle');
  await ensureUnlink(serverBundlePath);
  PerfLogger.end('Deleting server bundle');

  // Plugin Lifecycle - postBuild.
  PerfLogger.start('Executing postBuild()');
  await executePluginsPostBuild({plugins, props, collectedData});
  PerfLogger.end('Executing postBuild()');

  // TODO execute this in parallel to postBuild?
  PerfLogger.start('Executing broken links checker');
  await executeBrokenLinksCheck({props, collectedData});
  PerfLogger.end('Executing broken links checker');

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

async function executeSSG({
  props,
  serverBundlePath,
  clientManifestPath,
}: {
  props: Props;
  serverBundlePath: string;
  clientManifestPath: string;
}) {
  PerfLogger.start('Reading client manifest');
  const manifest: Manifest = await fs.readJSON(clientManifestPath, 'utf-8');
  PerfLogger.end('Reading client manifest');

  PerfLogger.start('Compiling SSR template');
  const ssrTemplate = await compileSSRTemplate(
    props.siteConfig.ssrTemplate ?? defaultSSRTemplate,
  );
  PerfLogger.end('Compiling SSR template');

  PerfLogger.start('Loading App renderer');
  const renderer = await loadAppRenderer({
    serverBundlePath,
  });
  PerfLogger.end('Loading App renderer');

  PerfLogger.start('Generate static files');
  const ssgResult = await generateStaticFiles({
    pathnames: props.routesPaths,
    renderer,
    params: {
      trailingSlash: props.siteConfig.trailingSlash,
      outDir: props.outDir,
      baseUrl: props.baseUrl,
      manifest,
      headTags: props.headTags,
      preBodyTags: props.preBodyTags,
      postBodyTags: props.postBodyTags,
      ssrTemplate,
      noIndex: props.siteConfig.noIndex,
      DOCUSAURUS_VERSION,
    },
  });
  PerfLogger.end('Generate static files');

  return ssgResult;
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
}: {
  props: Props;
  cliOptions: BuildCLIOptions;
}) {
  const {plugins} = props;
  const result = await createBuildClientConfig({
    props,
    minify: cliOptions.minify ?? true,
    bundleAnalyzer: cliOptions.bundleAnalyzer ?? false,
  });
  let {config} = result;
  config = executePluginsConfigureWebpack({
    plugins,
    config,
    isServer: false,
    jsLoader: props.siteConfig.webpack?.jsLoader,
  });
  return {clientConfig: config, clientManifestPath: result.clientManifestPath};
}

async function getBuildServerConfig({props}: {props: Props}) {
  const {plugins} = props;
  const result = await createServerConfig({
    props,
  });
  let {config} = result;
  config = executePluginsConfigurePostCss({
    plugins,
    config,
  });
  config = executePluginsConfigureWebpack({
    plugins,
    config,
    isServer: true,
    jsLoader: props.siteConfig.webpack?.jsLoader,
  });
  return {serverConfig: config, serverBundlePath: result.serverBundlePath};
}

async function ensureUnlink(filepath: string) {
  if (await fs.pathExists(filepath)) {
    await fs.unlink(filepath);
  }
}
