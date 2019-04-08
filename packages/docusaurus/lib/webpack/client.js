/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const WebpackNiceLog = require('webpack-nicelog');
const ReactLoadableSSRAddon = require('react-loadable-ssr-addon');
const merge = require('webpack-merge');

const createBaseConfig = require('./base');

module.exports = function createClientConfig(props) {
  const isProd = process.env.NODE_ENV === 'production';
  const config = createBaseConfig(props);

  const clientConfig = merge(config, {
    entry: {
      main: path.resolve(__dirname, '../core/clientEntry.js'),
    },
    plugins: [
      // Generate manifests file
      new ReactLoadableSSRAddon({
        filename: 'assets-manifest.json',
      }),
      // Show compilation progress bar and build time.
      new WebpackNiceLog({
        name: 'Client',
        skipBuildTime: isProd,
      }),
    ],
  });

  return clientConfig;
};
