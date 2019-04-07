/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const cacheLoaderVersion = require('cache-loader/package.json').version;
const merge = require('webpack-merge');

// Modify the generated webpack config with normal webpack config.
function applyConfigureWebpack(userConfig, config, isServer) {
  if (typeof userConfig === 'object') {
    return merge(config, userConfig);
  }
  if (typeof userConfig === 'function') {
    const res = userConfig(config, isServer);
    if (res && typeof res === 'object') {
      return merge(config, res);
    }
  }
  return config;
}

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

module.exports = {
  getBabelLoader,
  getCacheLoader,
  getStyleLoaders,
  applyConfigureWebpack,
};
