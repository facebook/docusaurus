/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import path from 'path';
import fs from 'fs-extra';
import {Configuration} from 'webpack';
import {getBabelLoader, getCacheLoader, getStyleLoaders} from './utils';
import {Props} from '../server';

const CSS_REGEX = /\.css$/;
const CSS_MODULE_REGEX = /\.module\.css$/;

export function createBaseConfig(
  props: Props,
  isServer: Boolean,
): Configuration {
  const {
    outDir,
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
          parallel: true,
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
          exclude: modulePath => {
            // Don't transpile node_modules except any docusaurus package
            return (
              /node_modules/.test(modulePath) && !/docusaurus/.test(modulePath)
            );
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
}
