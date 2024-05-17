/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {md5Hash, getFileLoaderUtils} from '@docusaurus/utils';
import {
  getCustomizableJSLoader,
  getStyleLoaders,
  getCustomBabelConfigFilePath,
} from './utils';
import {getMinimizer} from './minification';
import {loadThemeAliases, loadDocusaurusAliases} from './aliases';
import type {Configuration} from 'webpack';
import type {Props} from '@docusaurus/types';

const CSS_REGEX = /\.css$/i;
const CSS_MODULE_REGEX = /\.module\.css$/i;
export const clientDir = path.join(__dirname, '..', 'client');

const LibrariesToTranspile = [
  'copy-text-to-clipboard', // Contains optional catch binding, incompatible with recent versions of Edge
];

const LibrariesToTranspileRegex = new RegExp(
  LibrariesToTranspile.map((libName) => `(node_modules/${libName})`).join('|'),
);

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
}: {
  props: Props;
  isServer: boolean;
  minify: boolean;
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

  const fileLoaderUtils = getFileLoaderUtils();

  const name = isServer ? 'server' : 'client';
  const mode = isProd ? 'production' : 'development';

  const themeAliases = await loadThemeAliases({siteDir, plugins});

  return {
    mode,
    name,
    cache: {
      type: 'filesystem',
      // Can we share the same cache across locales?
      // Exploring that question at https://github.com/webpack/webpack/issues/13034
      // name: `${name}-${mode}`,
      name: `${name}-${mode}-${props.i18n.currentLocale}`,
      // When version string changes, cache is evicted
      version: [
        siteMetadata.docusaurusVersion,
        // Webpack does not evict the cache correctly on alias/swizzle change,
        // so we force eviction.
        // See https://github.com/webpack/webpack/issues/13627
        md5Hash(JSON.stringify(themeAliases)),
      ].join('-'),
      // When one of those modules/dependencies change (including transitive
      // deps), cache is invalidated
      buildDependencies: {
        config: [
          __filename,
          path.join(__dirname, isServer ? 'server.js' : 'client.js'),
          // Docusaurus config changes can affect MDX/JSX compilation, so we'd
          // rather evict the cache.
          // See https://github.com/questdb/questdb.io/issues/493
          siteConfigPath,
        ],
      },
    },
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
      unsafeCache: false, // Not enabled, does not seem to improve perf much
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
      removeAvailableModules: false,
      // Only minimize client bundle in production because server bundle is only
      // used for static site generation
      minimize: minimizeEnabled,
      minimizer: minimizeEnabled ? getMinimizer() : undefined,
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
        fileLoaderUtils.rules.fonts(),
        fileLoaderUtils.rules.media(),
        fileLoaderUtils.rules.svg(),
        fileLoaderUtils.rules.otherAssets(),
        {
          test: /\.[jt]sx?$/i,
          exclude: excludeJS,
          use: [
            getCustomizableJSLoader(siteConfig.webpack?.jsLoader)({
              isServer,
              babelOptions: await getCustomBabelConfigFilePath(siteDir),
            }),
          ],
        },
        {
          test: CSS_REGEX,
          exclude: CSS_MODULE_REGEX,
          use: getStyleLoaders(isServer, {
            importLoaders: 1,
            sourceMap: !isProd,
          }),
        },
        // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
        // using the extension .module.css
        {
          test: CSS_MODULE_REGEX,
          use: getStyleLoaders(isServer, {
            modules: {
              localIdentName: isProd
                ? `[local]_[contenthash:base64:4]`
                : `[local]_[path][name]`,
              exportOnlyLocals: isServer,
            },
            importLoaders: 1,
            sourceMap: !isProd,
          }),
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
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
    ],
  };
}
