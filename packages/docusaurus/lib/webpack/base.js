/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const fs = require('fs-extra');
const isWsl = require('is-wsl');
const {getBabelLoader, getCacheLoader, getStyleLoaders} = require('./utils');

const CSS_REGEX = /\.css$/;
const CSS_MODULE_REGEX = /\.module\.css$/;

module.exports = function createBaseConfig(props, isServer) {
  const {
    outDir,
    siteDir,
    baseUrl,
    generatedFilesDir,
    cliOptions: {cacheLoader},
  } = props;

  const isProd = process.env.NODE_ENV === 'production';
  const themeFallback = path.resolve(__dirname, '../client/theme-fallback');
  return {
    mode: isProd ? 'production' : 'development',
    output: {
      path: outDir,
      filename: isProd ? '[name].[chunkhash].js' : '[name].js',
      chunkFilename: isProd ? '[name].[chunkhash].js' : '[name].js',
      publicPath: baseUrl,
    },
    // Don't throw warning when asset created is over 250kb
    performance: {
      hints: false,
    },
    devtool: !isProd && 'cheap-module-eval-source-map',
    resolve: {
      symlinks: true,
      alias: {
        // https://stackoverflow.com/a/55433680/6072730
        ejs: 'ejs/ejs.min.js',
        // These alias can be overriden in plugins. However, these components are essential
        // (e.g: react-loadable requires Loading component) so we alias it here first as fallback.
        '@theme/Layout': path.join(themeFallback, 'Layout'),
        '@theme/Loading': path.join(themeFallback, 'Loading'),
        '@theme/NotFound': path.join(themeFallback, 'NotFound'),
        '@site': siteDir,
        '@generated': generatedFilesDir,
        '@docusaurus': path.resolve(__dirname, '../client/exports'),
      },
      modules: [
        'node_modules',
        path.resolve(fs.realpathSync(process.cwd()), 'node_modules'),
      ],
    },
    optimization: {
      // Only minimize client bundle in production because server bundle is only used for static site generation
      minimize: isProd && !isServer,
      minimizer: [
        new TerserPlugin({
          cache: true,
          // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
          // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
          parallel: !isWsl,
          sourceMap: true,
          terserOptions: {
            ecma: 6,
            mangle: true,
            output: {
              comments: false,
            },
          },
        }),
      ],
      splitChunks: {
        maxInitialRequests: Infinity,
        maxAsyncRequests: Infinity,
        cacheGroups: {
          // disable the built-in cacheGroups
          default: false,
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 20,
            // create chunk regardless of the size of the chunk
            enforce: true,
          },
          common: {
            name: 'common',
            chunks: 'all',
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude(modulePath) {
            // always transpile our own library
            if (modulePath.startsWith(path.join(__dirname, '..'))) {
              return false;
            }

            // Don't transpile node_modules
            return /node_modules/.test(modulePath);
          },
          use: [
            cacheLoader && getCacheLoader(isServer),
            getBabelLoader(isServer),
          ].filter(Boolean),
        },
        {
          test: CSS_REGEX,
          exclude: CSS_MODULE_REGEX,
          use: getStyleLoaders(isServer, {
            importLoaders: 1,
            sourceMap: !isProd,
            minimize: true,
          }),
        },
        // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
        // using the extension .module.css
        {
          test: CSS_MODULE_REGEX,
          use: getStyleLoaders(isServer, {
            modules: true,
            importLoaders: 1,
            localIdentName: `[local]_[hash:base64:8]`,
            sourceMap: !isProd,
            minimize: true,
          }),
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[chunkhash].css' : '[name].css',
        chunkFilename: isProd ? '[name].[chunkhash].css' : '[name].css',
      }),
    ],
  };
};
