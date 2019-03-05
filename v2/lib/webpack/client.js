/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const cleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const webpackNiceLog = require('webpack-nicelog');
const {StatsWriterPlugin} = require('webpack-stats-plugin');
const {ReactLoadablePlugin} = require('react-loadable/webpack');

const createBaseConfig = require('./base');
const {applyChainWebpack} = require('./utils');

module.exports = function createClientConfig(props) {
  const config = createBaseConfig(props);
  config.entry('main').add(path.resolve(__dirname, '../core/clientEntry.js'));

  const {outDir} = props;
  // Remove/clean build folders before building bundles.
  config
    .plugin('clean')
    .use(cleanWebpackPlugin, [outDir, {verbose: false, allowExternal: true}]);
  // Write webpack stats object so we can pickup correct client bundle path in server.
  config
    .plugin('clientStats')
    .use(StatsWriterPlugin, [{filename: 'client.stats.json'}]);
  config
    .plugin('reactLoadableStats')
    .use(ReactLoadablePlugin, [
      {filename: path.join(outDir, 'react-loadable.json')},
    ]);

  // Show compilation progress bar and build time.
  const isProd = process.env.NODE_ENV === 'production';
  config
    .plugin('niceLog')
    .use(webpackNiceLog, [{name: 'Client', skipBuildTime: isProd}]);

  // User-extended webpack-chain config.
  applyChainWebpack(props.siteConfig.chainWebpack, config, false);

  return config;
};
