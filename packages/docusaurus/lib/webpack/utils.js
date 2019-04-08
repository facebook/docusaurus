/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const cacheLoaderVersion = require('cache-loader/package.json').version;
const merge = require('webpack-merge');

// Utility method to get style loaders
function getStyleLoaders(isServer, cssOptions) {
  const isProd = process.env.NODE_ENV === 'production';
  const loaders = [
    !isServer &&
      isProd && {
        loader: MiniCssExtractPlugin.loader,
      },
    !isServer && !isProd && require.resolve('style-loader'),
    {
      loader: isServer
        ? require.resolve('css-loader/locals')
        : require.resolve('css-loader'),
      options: cssOptions,
    },
  ].filter(Boolean);
  return loaders;
}

function getCacheLoader(isServer, cacheOptions) {
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

function getBabelLoader(isServer, babelOptions) {
  return {
    loader: require.resolve('babel-loader'),
    options: Object.assign(
      {
        babelrc: false,
        configFile: false,
        presets: ['@babel/env', '@babel/react'],
        plugins: [
          'react-hot-loader/babel',
          isServer ? 'dynamic-import-node' : '@babel/syntax-dynamic-import',
          'react-loadable/babel',
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
function applyConfigureWebpack(configureWebpack, config, isServer) {
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

module.exports = {
  getBabelLoader,
  getCacheLoader,
  getStyleLoaders,
  applyConfigureWebpack,
};
