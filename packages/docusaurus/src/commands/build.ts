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
import {loadSite, loadContext, type LoadContextParams} from '../server/site';
import {handleBrokenLinks} from '../server/brokenLinks';

import {createBuildClientConfig} from '../webpack/client';
import createServerConfig from '../webpack/server';
import {executePluginsConfigureWebpack} from '../webpack/configure';
import {compile} from '../webpack/utils';
import {PerfLogger} from '../utils';

import {loadI18n} from '../server/i18n';
import {
  generateHashRouterEntrypoint,
  generateStaticFiles,
  loadAppRenderer,
} from '../ssg';
import {
  compileSSRTemplate,
  renderHashRouterTemplate,
} from '../templates/templates';
import defaultSSRTemplate from '../templates/ssr.html.template';
import type {SSGParams} from '../ssg';

import type {Manifest} from 'react-loadable-ssr-addon-v5-slorber';
import type {LoadedPlugin, Props, RouterType} from '@docusaurus/types';
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
      const isLastLocale = locales.indexOf(locale) === locales.length - 1;
      await tryToBuildLocale({locale});
      if (isLastLocale) {
        logger.info`Use code=${'npm run serve'} command to test your build locally.`;
      }

      // TODO do we really need this historical forceTerminate exit???
      if (forceTerminate && isLastLocale && !cliOptions.bundleAnalyzer) {
        process.exit(0);
      }
    }),
  );
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
}): Promise<string> {
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

  // We can build the 2 configs in parallel
  const [{clientConfig, clientManifestPath}, {serverConfig, serverBundlePath}] =
    await PerfLogger.async('Creating webpack configs', () =>
      Promise.all([
        getBuildClientConfig({
          props,
          cliOptions,
        }),
        getBuildServerConfig({
          props,
        }),
      ]),
    );

  // Run webpack to build JS bundle (client) and static html files (server).
  await PerfLogger.async('Bundling with Webpack', () => {
    if (router === 'hash') {
      return compile([clientConfig]);
    } else {
      return compile([clientConfig, serverConfig]);
    }
  });

  const {collectedData} = await PerfLogger.async('SSG', () =>
    executeSSG({
      props,
      serverBundlePath,
      clientManifestPath,
      router,
    }),
  );

  // Remove server.bundle.js because it is not needed.
  await PerfLogger.async('Deleting server bundle', () =>
    ensureUnlink(serverBundlePath),
  );

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

  return outDir;
}

async function executeSSG({
  props,
  serverBundlePath,
  clientManifestPath,
  router,
}: {
  props: Props;
  serverBundlePath: string;
  clientManifestPath: string;
  router: RouterType;
}): Promise<{collectedData: SiteCollectedData}> {
  const manifest: Manifest = await PerfLogger.async(
    'Read client manifest',
    () => fs.readJSON(clientManifestPath, 'utf-8'),
  );

  const ssrTemplate = await PerfLogger.async('Compile SSR template', () =>
    compileSSRTemplate(props.siteConfig.ssrTemplate ?? defaultSSRTemplate),
  );

  const params: SSGParams = {
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
  };

  if (router === 'hash') {
    PerfLogger.start('Generate Hash Router entry point');
    const content = renderHashRouterTemplate({params});
    await generateHashRouterEntrypoint({content, params});
    PerfLogger.end('Generate Hash Router entry point');
    return {collectedData: {}};
  }

  const renderer = await PerfLogger.async('Load App renderer', () =>
    loadAppRenderer({
      serverBundlePath,
    }),
  );

  const ssgResult = await PerfLogger.async('Generate static files', () =>
    generateStaticFiles({
      pathnames: props.routesPaths,
      renderer,
      params,
    }),
  );

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
