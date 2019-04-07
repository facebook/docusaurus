/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const WebpackNiceLog = require('webpack-nicelog');
const {StatsWriterPlugin} = require('webpack-stats-plugin');
const {ReactLoadablePlugin} = require('react-loadable/webpack');
const merge = require('webpack-merge');

const createBaseConfig = require('./base');

module.exports = function createClientConfig(props) {
  const isProd = process.env.NODE_ENV === 'production';
  const config = createBaseConfig(props);
  const {generatedFilesDir} = props;

  const clientConfig = merge(config, {
    entry: {
      main: path.resolve(__dirname, '../core/clientEntry.js'),
    },
    resolve: {
      alias: {
        // https://github.com/gaearon/react-hot-loader#react--dom
        'react-dom': '@hot-loader/react-dom',
      },
    },
    plugins: [
      // Write webpack stats object so we can pickup correct client bundle path in server.
      new StatsWriterPlugin({
        filename: 'client.stats.json',
      }),
      // React-loadable manifests
      new ReactLoadablePlugin({
        filename: path.join(generatedFilesDir, 'react-loadable.json'),
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
