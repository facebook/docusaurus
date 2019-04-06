/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CSSExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
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

// Modify the generated webpack config with webpack-chain API.
function applyChainWebpack(userChainWebpack, config, isServer) {
  if (userChainWebpack) {
    userChainWebpack(config, isServer);
  }
}

// Utility method to add styling-related rule to Webpack config.
function applyStyle(styleRule, {cssOptions, isServer, isProd}) {
  if (!isServer) {
    if (isProd) {
      styleRule.use('extract-css-loader').loader(CSSExtractPlugin.loader);
    } else {
      styleRule.use('style-loader').loader('style-loader');
    }
  }

  styleRule
    .use('css-loader')
    .loader(isServer ? 'css-loader/locals' : 'css-loader')
    .options(cssOptions);

  return styleRule;
}

function applyCacheLoader(
  rule,
  {cacheLoader, siteDir, cacheLoaderVersion, isServer},
) {
  if (cacheLoader) {
    rule
      .use('cache-loader')
      .loader('cache-loader')
      .options({
        cacheDirectory: path.resolve(siteDir, '.cache-loader'),
        cacheIdentifier: `cache-loader:${cacheLoaderVersion}${isServer}`,
      });
  }
}

function applyBabel(rule, {isServer}) {
  rule
    .use('babel')
    .loader('babel-loader')
    .options({
      // ignore local project babel config (.babelrc)
      babelrc: false,
      // ignore local project babel config (babel.config.js)
      configFile: false,
      presets: ['@babel/env', '@babel/react'],
      plugins: [
        'react-hot-loader/babel', // To enable react-hot-loader
        isServer ? 'dynamic-import-node' : '@babel/syntax-dynamic-import',
        'react-loadable/babel',
      ],
    });
}

module.exports = {
  applyBabel,
  applyCacheLoader,
  applyConfigureWebpack,
  applyChainWebpack,
  applyStyle,
};
