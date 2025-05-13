/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {getCustomBabelConfigFilePath} from '@docusaurus/babel';
import {
  createJsLoaderFactory,
  getCSSExtractPlugin,
  getMinimizers,
} from '@docusaurus/bundler';

import {getFileLoaderUtils, md5Hash} from '@docusaurus/utils';
import {loadDocusaurusAliases, loadThemeAliases} from './aliases';
import {BundlerCPUProfilerPlugin} from './plugins/BundlerCPUProfilerPlugin';
import type {Configuration} from 'webpack';
import type {
  ConfigureWebpackUtils,
  FasterConfig,
  Props,
} from '@docusaurus/types';

const CSS_REGEX = /\.css$/i;
const CSS_MODULE_REGEX = /\.module\.css$/i;
export const clientDir = path.join(__dirname, '..', 'client');

const LibrariesToTranspile = [
  'copy-text-to-clipboard', // Contains optional catch binding, incompatible with recent versions of Edge
];

const LibrariesToTranspileRegex = new RegExp(
  LibrariesToTranspile.map((libName) => `(node_modules/${libName})`).join('|'),
);

function getReactAliases(siteDir: string): Record<string, string> {
  // Escape hatch
  if (process.env.DOCUSAURUS_NO_REACT_ALIASES) {
    return {};
  }
  const resolveSitePkg = (id: string) =>
    require.resolve(id, {paths: [siteDir]});
  return {
    react: path.dirname(resolveSitePkg('react/package.json')),
    'react-dom': path.dirname(resolveSitePkg('react-dom/package.json')),
    '@mdx-js/react': path.dirname(resolveSitePkg('@mdx-js/react')),
  };
}

export function excludeJS(modulePath: string): boolean {
  // Always transpile client dir
  if (modulePath.startsWith(clientDir)) {
    return false;
  }
  // Don't transpile node_modules except any docusaurus npm package
  return (
    modulePath.includes('node_modules') &&
    !/docusaurus(?:(?!node_modules).)*\.jsx?$/.test(modulePath) &&
    !LibrariesToTranspileRegex.test(modulePath)
  );
}

export async function createBaseConfig({
  props,
  isServer,
  minify,
  faster,
  configureWebpackUtils,
}: {
  props: Props;
  isServer: boolean;
  minify: boolean;
  faster: FasterConfig;
  configureWebpackUtils: ConfigureWebpackUtils;
}): Promise<Configuration> {
  const {
    outDir,
    siteDir,
    siteConfig,
    siteConfigPath,
    baseUrl,
    generatedFilesDir,
    routesPaths,
    siteMetadata,
    plugins,
  } = props;
  const totalPages = routesPaths.length;
  const isProd = process.env.NODE_ENV === 'production';
  const minimizeEnabled = minify && isProd;

  const fileLoaderUtils = getFileLoaderUtils(isServer);

  const name = isServer ? 'server' : 'client';
  const mode = isProd ? 'production' : 'development';

  const themeAliases = await loadThemeAliases({siteDir, plugins});

  const createJsLoader = await createJsLoaderFactory({siteConfig});

  const CSSExtractPlugin = await getCSSExtractPlugin({
    currentBundler: props.currentBundler,
  });

  // Can we share the same cache across locales?
  // Exploring that question at https://github.com/webpack/webpack/issues/13034
  function getCacheName() {
    return `${name}-${mode}-${props.i18n.currentLocale}`;
  }

  // When the version string changes, the cache is evicted
  function getCacheVersion() {
    // Because Webpack does not evict the cache on alias/swizzle changes,
    // See https://github.com/webpack/webpack/issues/13627
    const themeAliasesHash = md5Hash(JSON.stringify(themeAliases));
    return `${siteMetadata.docusaurusVersion}-${themeAliasesHash}`;
  }

  // When one of those modules/dependencies change (including transitive
  // deps), cache is invalidated
  function getCacheBuildDependencies(): string[] {
    return [
      __filename,
      path.join(__dirname, isServer ? 'server.js' : 'client.js'),
      // Docusaurus config changes can affect MDX/JSX compilation, so we'd
      // rather evict the cache.
      // See https://github.com/questdb/questdb.io/issues/493
      siteConfigPath,
    ];
  }

  function getCache(): Configuration['cache'] {
    // Use default: memory cache in dev, nothing in prod
    // See https://rspack.dev/config/cache#cache
    const disabledPersistentCacheValue = undefined;

    if (process.env.DOCUSAURUS_NO_PERSISTENT_CACHE) {
      return disabledPersistentCacheValue;
    }
    if (props.currentBundler.name === 'rspack') {
      if (props.siteConfig.future.experimental_faster.rspackPersistentCache) {
        // Use cache: true + experiments.cache.type: "persistent"
        // See https://rspack.dev/config/experiments#persistent-cache
        return true;
      } else {
        return disabledPersistentCacheValue;
      }
    }

    return {
      type: 'filesystem',
      name: getCacheName(),
      version: getCacheVersion(),
      buildDependencies: {
        config: getCacheBuildDependencies(),
      },
    };
  }

  function getExperiments(): Configuration['experiments'] {
    if (props.currentBundler.name === 'rspack') {
      const PersistentCacheAttributes = process.env
        .DOCUSAURUS_NO_PERSISTENT_CACHE
        ? {}
        : {
            cache: {
              type: 'persistent',
              // Rspack doesn't have "cache.name" like Webpack
              // This is not ideal but work around is to merge name/version
              // See https://github.com/web-infra-dev/rspack/pull/8920#issuecomment-2658938695
              version: `${getCacheName()}-${getCacheVersion()}`,
              buildDependencies: getCacheBuildDependencies(),
            },
          };

      // TODO find a way to type this
      return {
        // This is mostly useful in dev
        // See https://rspack.dev/config/experiments#experimentsincremental
        // Produces warnings in production builds
        // See https://github.com/web-infra-dev/rspack/pull/8311#issuecomment-2476014664
        // We use the same integration as Rspress, with ability to disable
        // See https://github.com/web-infra-dev/rspress/pull/1631
        // See https://github.com/facebook/docusaurus/issues/10646
        // @ts-expect-error: Rspack-only, not available in Webpack typedefs
        incremental: !isProd && !process.env.DISABLE_RSPACK_INCREMENTAL,

        ...PersistentCacheAttributes,
      };
    }
    return undefined;
  }

  return {
    mode,
    name,
    cache: getCache(),
    experiments: getExperiments(),
    output: {
      pathinfo: false,
      path: outDir,
      filename: isProd ? 'assets/js/[name].[contenthash:8].js' : '[name].js',
      chunkFilename: isProd
        ? 'assets/js/[name].[contenthash:8].js'
        : '[name].js',
      publicPath:
        siteConfig.future.experimental_router === 'hash' ? 'auto' : baseUrl,
      hashFunction: 'xxhash64',
    },
    // Don't throw warning when asset created is over 250kb
    performance: {
      hints: false,
    },
    devtool: isProd ? undefined : 'eval-cheap-module-source-map',
    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      symlinks: true, // See https://github.com/facebook/docusaurus/issues/3272
      roots: [
        // Allow resolution of url("/fonts/xyz.ttf") by webpack
        // See https://webpack.js.org/configuration/resolve/#resolveroots
        // See https://github.com/webpack-contrib/css-loader/issues/1256
        ...siteConfig.staticDirectories.map((dir) =>
          path.resolve(siteDir, dir),
        ),
        siteDir,
        process.cwd(),
      ],
      alias: {
        ...getReactAliases(siteDir),
        '@site': siteDir,
        '@generated': generatedFilesDir,
        ...(await loadDocusaurusAliases()),
        ...themeAliases,
      },
      // This allows you to set a fallback for where Webpack should look for
      // modules. We want `@docusaurus/core` own dependencies/`node_modules` to
      // "win" if there is conflict. Example: if there is core-js@3 in user's
      // own node_modules, but core depends on core-js@2, we should use
      // core-js@2.
      modules: [
        path.resolve(__dirname, '..', '..', 'node_modules'),
        'node_modules',
        path.resolve(await fs.realpath(process.cwd()), 'node_modules'),
      ],
    },
    resolveLoader: {
      modules: ['node_modules', path.join(siteDir, 'node_modules')],
    },
    optimization: {
      // The optimizations.concatenateModules is expensive
      // - On the server, it's not useful to run it at all
      // - On the client, it leads to a ~3% JS assets total size decrease
      //   Let's keep it by default, but large sites may prefer faster builds
      // See also https://github.com/facebook/docusaurus/pull/11176
      concatenateModules: !isServer,

      // The optimizations.mergeDuplicateChunks is expensive
      // - On the server, it's not useful to run it at all
      // - On the client, we compared assets/js before/after and see 0 change
      //   `du -sk js-before js-after` => the JS assets have the exact same size
      // See also https://github.com/facebook/docusaurus/pull/11176
      mergeDuplicateChunks: false,

      // Only minimize client bundle in production because server bundle is only
      // used for static site generation
      minimize: minimizeEnabled,
      minimizer: minimizeEnabled
        ? await getMinimizers({faster, currentBundler: props.currentBundler})
        : undefined,
      splitChunks: isServer
        ? false
        : {
            // Since the chunk name includes all origin chunk names it's
            // recommended for production builds with long term caching to NOT
            // include [name] in the filenames
            name: false,
            cacheGroups: {
              // Disable the built-in cacheGroups
              default: false,
              common: {
                name: 'common',
                minChunks: totalPages > 2 ? totalPages * 0.5 : 2,
                priority: 40,
              },
              // Only create one CSS file to avoid
              // problems with code-split CSS loading in different orders
              // causing inconsistent/non-deterministic styling
              // See https://github.com/facebook/docusaurus/issues/2006
              styles: {
                name: 'styles',
                type: 'css/mini-extract',
                chunks: `all`,
                enforce: true,
                priority: 50,
              },
            },
          },
    },
    module: {
      rules: [
        fileLoaderUtils.rules.images(),
        fileLoaderUtils.rules.svgs(),
        fileLoaderUtils.rules.fonts(),
        fileLoaderUtils.rules.media(),
        fileLoaderUtils.rules.otherAssets(),
        {
          test: /\.[jt]sx?$/i,
          exclude: excludeJS,
          use: [
            createJsLoader({
              isServer,
              babelOptions: await getCustomBabelConfigFilePath(siteDir),
            }),
          ],
        },
        {
          test: CSS_REGEX,
          exclude: CSS_MODULE_REGEX,
          use: configureWebpackUtils.getStyleLoaders(isServer, {
            importLoaders: 1,
            sourceMap: !isProd,
          }),
        },
        // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
        // using the extension .module.css
        {
          test: CSS_MODULE_REGEX,
          use: configureWebpackUtils.getStyleLoaders(isServer, {
            modules: {
              // Using the same CSS Module class pattern in dev/prod on purpose
              // See https://github.com/facebook/docusaurus/pull/10423
              localIdentName: `[local]_[contenthash:base64:4]`,
              exportOnlyLocals: isServer,
            },
            importLoaders: 1,
            sourceMap: !isProd,
          }),
        },
      ],
    },
    plugins: [
      new CSSExtractPlugin({
        filename: isProd
          ? 'assets/css/[name].[contenthash:8].css'
          : '[name].css',
        chunkFilename: isProd
          ? 'assets/css/[name].[contenthash:8].css'
          : '[name].css',
        // Remove css order warnings if css imports are not sorted
        // alphabetically. See https://github.com/webpack-contrib/mini-css-extract-plugin/pull/422
        // for more reasoning
        ignoreOrder: true,
      }),
      process.env.DOCUSAURUS_BUNDLER_CPU_PROFILE &&
        new BundlerCPUProfilerPlugin(),
    ].filter(Boolean),
  };
}
