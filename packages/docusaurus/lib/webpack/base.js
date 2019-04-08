/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const isWsl = require('is-wsl');
const {getBabelLoader, getCacheLoader, getStyleLoaders} = require('./utils');

const CSS_REGEX = /\.css$/;
const CSS_MODULE_REGEX = /\.module\.css$/;

module.exports = function createBaseConfig(props, isServer) {
  const {
    outDir,
    themePath,
    siteDir,
    baseUrl,
    generatedFilesDir,
    cliOptions: {cacheLoader},
  } = props;

  const isProd = process.env.NODE_ENV === 'production';
  return {
    mode: isProd ? 'production' : 'development',
    output: {
      path: outDir,
      filename: isProd ? '[name].[chunkhash].js' : '[name].js',
      chunkFilename: isProd ? '[name].[chunkhash].js' : '[name].js',
      publicPath: baseUrl,
    },
    devtool: !isProd && 'cheap-module-eval-source-map',
    resolve: {
      symlinks: true,
      alias: {
        'react-dom': isProd ? 'react-dom' : '@hot-loader/react-dom',
        ejs: 'ejs/ejs.min.js',
        '@theme': themePath,
        '@site': siteDir,
        '@build': outDir,
        '@generated': generatedFilesDir,
        '@core': path.resolve(__dirname, '../core'),
        '@docusaurus': path.resolve(__dirname, '../docusaurus'),
      },
      modules: [
        'node_modules',
        path.resolve(__dirname, '../../node_modules'),
        path.resolve(siteDir, 'node_modules'),
        path.resolve(process.cwd(), 'node_modules'),
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
          exclude: /node_modules/,
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
