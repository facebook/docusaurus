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

  const {generatedFilesDir} = props;
  const clientConfig = merge(config, {
    entry: {
      main: path.resolve(__dirname, '../client/clientEntry.js'),
    },
    optimization: {
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true,
    },
    plugins: [
      // Generate manifests file
      new ReactLoadableSSRAddon({
        filename: path.resolve(generatedFilesDir, 'assets-manifest.json'),
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
