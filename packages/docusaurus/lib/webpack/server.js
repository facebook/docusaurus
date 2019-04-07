/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const WebpackNiceLog = require('webpack-nicelog');
const merge = require('webpack-merge');
const createBaseConfig = require('./base');

module.exports = function createServerConfig(props) {
  const {baseUrl, routesPaths} = props;
  const config = createBaseConfig(props, true);
  const isProd = process.env.NODE_ENV === 'production';

  const serverConfig = merge(config, {
    entry: {
      main: path.resolve(__dirname, '../core/serverEntry.js'),
    },
    output: {
      filename: 'server.bundle.js',
      libraryTarget: 'commonjs2',
      // Workaround for Webpack 4 Bug (https://github.com/webpack/webpack/issues/6522)
      globalObject: 'this',
    },
    target: 'node',
    resolve: {
      alias: {
        ejs: 'ejs/ejs.min.js',
      },
    },
    plugins: [
      // Static site generator webpack plugin.
      new StaticSiteGeneratorPlugin({
        entry: 'main',
        locals: {
          baseUrl,
        },
        paths: routesPaths,
      }),

      // Show compilation progress bar.
      new WebpackNiceLog({
        name: 'Server',
        color: 'yellow',
        skipBuildTime: isProd,
      }),
    ],
  });
  return serverConfig;
};
