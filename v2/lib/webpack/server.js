/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const webpackNiceLog = require('webpack-nicelog');
const createBaseConfig = require('./base');
const {applyChainWebpack} = require('./utils');

module.exports = function createServerConfig(props) {
  const config = createBaseConfig(props, true);

  config.entry('main').add(path.resolve(__dirname, '../core/serverEntry.js'));
  config.target('node');
  config.output.filename('server.bundle.js').libraryTarget('commonjs2');

  // Workaround for Webpack 4 Bug (https://github.com/webpack/webpack/issues/6522)
  config.output.globalObject('this');

  const {siteConfig, routesPaths} = props;

  // Static site generator webpack plugin.
  config.plugin('siteGenerator').use(StaticSiteGeneratorPlugin, [
    {
      entry: 'main',
      locals: {
        baseUrl: siteConfig.baseUrl,
      },
      paths: routesPaths,
    },
  ]);

  // Show compilation progress bar.
  const isProd = process.env.NODE_ENV === 'production';
  config
    .plugin('niceLog')
    .use(webpackNiceLog, [
      {name: 'Server', color: 'yellow', skipBuildTime: isProd},
    ]);

  // User-extended webpack-chain config.
  applyChainWebpack(props.siteConfig.chainWebpack, config, true);

  return config;
};
