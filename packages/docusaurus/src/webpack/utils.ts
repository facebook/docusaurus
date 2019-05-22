/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import merge from 'webpack-merge';
import {Configuration, Loader} from 'webpack';

import {version as cacheLoaderVersion} from 'cache-loader/package.json';

// Utility method to get style loaders
export function getStyleLoaders(
  isServer: Boolean,
  cssOptions: {
    [key: string]: any;
  } = {},
): Loader[] {
  if (isServer) {
    return [
      cssOptions.modules
        ? {
            loader: require.resolve('css-loader'),
            options: cssOptions,
          }
        : require.resolve('null-loader'),
    ];
  }

  const isProd = process.env.NODE_ENV === 'production';
  const loaders = [
    isProd && {
      loader: MiniCssExtractPlugin.loader,
    },
    !isProd && require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
  ].filter(Boolean) as Loader[];
  return loaders;
}

export function getCacheLoader(isServer: Boolean, cacheOptions?: {}): Loader {
  return {
    loader: require.resolve('cache-loader'),
    options: Object.assign(
      {
        cacheIdentifier: `cache-loader:${cacheLoaderVersion}${isServer}`,
      },
      cacheOptions,
    ),
  };
}

export function getBabelLoader(isServer: Boolean, babelOptions?: {}): Loader {
  return {
    loader: require.resolve('babel-loader'),
    options: Object.assign(
      {
        babelrc: false,
        configFile: false,
        presets: ['@babel/env', '@babel/react'],
        plugins: [
          isServer ? 'dynamic-import-node' : '@babel/syntax-dynamic-import',
        ],
      },
      babelOptions,
    ),
  };
}

/**
 * Helper function to modify webpack config
 * @param {Object | Function} configureWebpack a webpack config or a function to modify config
 * @param {Object} config initial webpack config
 * @param {Boolean} isServer indicates if this is a server webpack configuration
 * @returns {Object} final/ modified webpack config
 */
export function applyConfigureWebpack(
  configureWebpack: any,
  config: Configuration,
  isServer: Boolean,
): Configuration {
  if (typeof configureWebpack === 'object') {
    return merge(config, configureWebpack);
  }

  // Export some utility functions
  const utils = {
    getStyleLoaders,
    getCacheLoader,
    getBabelLoader,
  };
  if (typeof configureWebpack === 'function') {
    const res = configureWebpack(config, isServer, utils);
    if (res && typeof res === 'object') {
      return merge(config, res);
    }
  }
  return config;
}
