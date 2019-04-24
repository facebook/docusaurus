/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const nodeExternals = require('webpack-node-externals');
const path = require('path');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const WebpackNiceLog = require('webpack-nicelog');
const merge = require('webpack-merge');
const createBaseConfig = require('./base');
const WaitPlugin = require('./plugins/WaitPlugin');

module.exports = function createServerConfig(props) {
  const {baseUrl, routesPaths, outDir} = props;
  const config = createBaseConfig(props, true);
  const isProd = process.env.NODE_ENV === 'production';

  const serverConfig = merge(config, {
    entry: {
      main: path.resolve(__dirname, '../client/serverEntry.js'),
    },
    output: {
      filename: 'server.bundle.js',
      libraryTarget: 'commonjs2',
      // Workaround for Webpack 4 Bug (https://github.com/webpack/webpack/issues/6522)
      globalObject: 'this',
    },
    target: 'node',
    // No need to bundle its node_modules dependencies since we're bundling for static html generation (backend)
    externals: [nodeExternals()],
    plugins: [
      // Wait until manifest from client bundle is generated
      new WaitPlugin({
        filepath: path.join(outDir, 'client-manifest.json'),
      }),

      // Static site generator webpack plugin.
      new StaticSiteGeneratorPlugin({
        entry: 'main',
        locals: {
          baseUrl,
          outDir,
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
