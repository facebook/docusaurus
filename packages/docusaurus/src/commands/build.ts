/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import logger from '@docusaurus/logger';
import {mapAsyncSequential} from '@docusaurus/utils';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ReactLoadableSSRAddon from 'react-loadable-ssr-addon-v5-slorber';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import {load, loadContext, type LoadContextOptions} from '../server';
import {handleBrokenLinks} from '../server/brokenLinks';

import createClientConfig from '../webpack/client';
import createServerConfig from '../webpack/server';
import {
  applyConfigurePostCss,
  applyConfigureWebpack,
  compile,
} from '../webpack/utils';
import CleanWebpackPlugin from '../webpack/plugins/CleanWebpackPlugin';
import {loadI18n} from '../server/i18n';
import type {HelmetServerState} from 'react-helmet-async';
import type {Configuration} from 'webpack';
import type {Props} from '@docusaurus/types';

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
  const {
    outDir,
    generatedFilesDir,
    plugins,
    siteConfig: {
      baseUrl,
      onBrokenLinks,
      staticDirectories: staticDirectoriesOption,
    },
    routes,
  } = props;

  const clientManifestPath = path.join(
    generatedFilesDir,
    'client-manifest.json',
  );
  let clientConfig: Configuration = merge(
    await createClientConfig(props, cliOptions.minify, true),
    {
      plugins: [
        // Remove/clean build folders before building bundles.
        new CleanWebpackPlugin({verbose: false}),
        // Visualize size of webpack output files with an interactive zoomable
        // tree map.
        cliOptions.bundleAnalyzer && new BundleAnalyzerPlugin(),
        // Generate client manifests file that will be used for server bundle.
        new ReactLoadableSSRAddon({
          filename: clientManifestPath,
        }),
      ].filter(<T>(x: T | undefined | false): x is T => Boolean(x)),
    },
  );

  const allCollectedLinks: {[location: string]: string[]} = {};
  const headTags: {[location: string]: HelmetServerState} = {};

  let serverConfig: Configuration = await createServerConfig({
    props,
    onLinksCollected: (staticPagePath, links) => {
      allCollectedLinks[staticPagePath] = links;
    },
    onHeadTagsCollected: (staticPagePath, tags) => {
      headTags[staticPagePath] = tags;
    },
  });

  // The staticDirectories option can contain empty directories, or non-existent
  // directories (e.g. user deleted `static`). Instead of issuing an error, we
  // just silently filter them out, because user could have never configured it
  // in the first place (the default option should always "work").
  const staticDirectories = (
    await Promise.all(
      staticDirectoriesOption.map(async (dir) => {
        const staticDir = path.resolve(siteDir, dir);
        if (
          (await fs.pathExists(staticDir)) &&
          (await fs.readdir(staticDir)).length > 0
        ) {
          return staticDir;
        }
        return '';
      }),
    )
  ).filter(Boolean);

  if (staticDirectories.length > 0) {
    serverConfig = merge(serverConfig, {
      plugins: [
        new CopyWebpackPlugin({
          patterns: staticDirectories.map((dir) => ({
            from: dir,
            to: outDir,
            toType: 'dir',
          })),
        }),
      ],
    });
  }

  // Plugin Lifecycle - configureWebpack and configurePostCss.
  plugins.forEach((plugin) => {
    const {configureWebpack, configurePostCss} = plugin;

    if (configurePostCss) {
      clientConfig = applyConfigurePostCss(
        configurePostCss.bind(plugin),
        clientConfig,
      );
    }

    if (configureWebpack) {
      clientConfig = applyConfigureWebpack(
        configureWebpack.bind(plugin), // The plugin lifecycle may reference `this`.
        clientConfig,
        false,
        props.siteConfig.webpack?.jsLoader,
        plugin.content,
      );

      serverConfig = applyConfigureWebpack(
        configureWebpack.bind(plugin), // The plugin lifecycle may reference `this`.
        serverConfig,
        true,
        props.siteConfig.webpack?.jsLoader,
        plugin.content,
      );
    }
  });

  // Make sure generated client-manifest is cleaned first so we don't reuse
  // the one from previous builds.
  if (await fs.pathExists(clientManifestPath)) {
    await fs.unlink(clientManifestPath);
  }

  // Run webpack to build JS bundle (client) and static html files (server).
  await compile([clientConfig, serverConfig]);

  // Remove server.bundle.js because it is not needed.
  if (typeof serverConfig.output?.filename === 'string') {
    const serverBundle = path.join(outDir, serverConfig.output.filename);
    if (await fs.pathExists(serverBundle)) {
      await fs.unlink(serverBundle);
    }
  }

  // Plugin Lifecycle - postBuild.
  await Promise.all(
    plugins.map(async (plugin) => {
      if (!plugin.postBuild) {
        return;
      }
      await plugin.postBuild({
        ...props,
        head: headTags,
        content: plugin.content,
      });
    }),
  );

  await handleBrokenLinks({
    allCollectedLinks,
    routes,
    onBrokenLinks,
    outDir,
    baseUrl,
  });

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
