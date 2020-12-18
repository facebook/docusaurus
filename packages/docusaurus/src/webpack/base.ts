/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import PnpWebpackPlugin from 'pnp-webpack-plugin';
import path from 'path';
import {Configuration, Loader} from 'webpack';
import {Props} from '@docusaurus/types';
import {
  getBabelLoader,
  getCacheLoader,
  getStyleLoaders,
  getFileLoaderUtils,
  getCustomBabelConfigFilePath,
  getMinimizer,
} from './utils';

const CSS_REGEX = /\.css$/;
const CSS_MODULE_REGEX = /\.module\.css$/;
export const clientDir = path.join(__dirname, '..', 'client');

export function excludeJS(modulePath: string): boolean {
  // always transpile client dir
  if (modulePath.startsWith(clientDir)) {
    return false;
  }
  // Don't transpile node_modules except any docusaurus npm package
  return (
    /node_modules/.test(modulePath) &&
    !/(docusaurus)((?!node_modules).)*\.jsx?$/.test(modulePath)
  );
}

export function getDocusaurusAliases(): Record<string, string> {
  const dirPath = path.resolve(__dirname, '../client/exports');
  const extensions = ['.js', '.ts', '.tsx'];

  const aliases = {};

  fs.readdirSync(dirPath)
    .filter((fileName) => extensions.includes(path.extname(fileName)))
    .forEach((fileName) => {
      const fileNameWithoutExtension = path.basename(
        fileName,
        path.extname(fileName),
      );
      const aliasName = `@docusaurus/${fileNameWithoutExtension}`;
      aliases[aliasName] = path.resolve(dirPath, fileName);
    });

  return aliases;
}

export function createBaseConfig(
  props: Props,
  isServer: boolean,
  minify: boolean = true,
): Configuration {
  const {outDir, siteDir, baseUrl, generatedFilesDir, routesPaths} = props;

  const totalPages = routesPaths.length;
  const isProd = process.env.NODE_ENV === 'production';
  const minimizeEnabled = minify && isProd && !isServer;
  const useSimpleCssMinifier = process.env.USE_SIMPLE_CSS_MINIFIER === 'true';

  const fileLoaderUtils = getFileLoaderUtils();

  return {
    mode: isProd ? 'production' : 'development',
    output: {
      // Use future version of asset emitting logic, which allows freeing memory of assets after emitting.
      futureEmitAssets: true,
      pathinfo: false,
      path: outDir,
      filename: isProd ? '[name].[contenthash:8].js' : '[name].js',
      chunkFilename: isProd ? '[name].[contenthash:8].js' : '[name].js',
      publicPath: baseUrl,
    },
    // Don't throw warning when asset created is over 250kb
    performance: {
      hints: false,
    },
    devtool: isProd ? false : 'cheap-module-eval-source-map',
    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      symlinks: true,
      alias: {
        '@site': siteDir,
        '@generated': generatedFilesDir,

        // Note: a @docusaurus alias would also catch @docusaurus/theme-common,
        // so we use fine-grained aliases instead
        // '@docusaurus': path.resolve(__dirname, '../client/exports'),
        ...getDocusaurusAliases(),
      },
      // This allows you to set a fallback for where Webpack should look for modules.
      // We want `@docusaurus/core` own dependencies/`node_modules` to "win" if there is conflict
      // Example: if there is core-js@3 in user's own node_modules, but core depends on
      // core-js@2, we should use core-js@2.
      modules: [
        path.resolve(__dirname, '..', '..', 'node_modules'),
        'node_modules',
        path.resolve(fs.realpathSync(process.cwd()), 'node_modules'),
      ],
      plugins: [PnpWebpackPlugin],
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)],
      modules: ['node_modules', path.join(siteDir, 'node_modules')],
    },
    optimization: {
      removeAvailableModules: false,
      // Only minimize client bundle in production because server bundle is only used for static site generation
      minimize: minimizeEnabled,
      minimizer: minimizeEnabled
        ? getMinimizer(useSimpleCssMinifier)
        : undefined,
      splitChunks: isServer
        ? false
        : {
            // Since the chunk name includes all origin chunk names it’s recommended for production builds with long term caching to NOT include [name] in the filenames
            name: false,
            cacheGroups: {
              // disable the built-in cacheGroups
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
                test: /\.css$/,
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
        fileLoaderUtils.rules.media(),
        fileLoaderUtils.rules.svg(),
        fileLoaderUtils.rules.otherAssets(),
        {
          test: /\.(j|t)sx?$/,
          exclude: excludeJS,
          use: [
            getCacheLoader(isServer),
            getBabelLoader(isServer, getCustomBabelConfigFilePath(siteDir)),
          ].filter(Boolean) as Loader[],
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
                ? `[local]_[hash:base64:4]`
                : `[local]_[path]`,
            },
            importLoaders: 1,
            sourceMap: !isProd,
            onlyLocals: isServer,
          }),
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash:8].css' : '[name].css',
        chunkFilename: isProd ? '[name].[contenthash:8].css' : '[name].css',
        // remove css order warnings if css imports are not sorted alphabetically
        // see https://github.com/webpack-contrib/mini-css-extract-plugin/pull/422 for more reasoning
        ignoreOrder: true,
      }),
    ],
  };
}
