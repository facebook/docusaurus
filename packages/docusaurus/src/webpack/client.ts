/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from 'path';
import {Configuration} from 'webpack';
import merge from 'webpack-merge';

import {Props} from '@docusaurus/types';
import {createBaseConfig} from './base';
import ChunkManifestPlugin from './plugins/ChunkManifestPlugin';
import LogPlugin from './plugins/LogPlugin';

export function createClientConfig(props: Props): Configuration {
  const isProd = process.env.NODE_ENV === 'production';
  const config = createBaseConfig(props, false);

  const clientConfig = merge(config, {
    entry: [
      // Include an alternative client for WebpackDevServer. A client's job is to
      // connect to WebpackDevServer by a socket and get notified about changes.
      // When you save a file, the client will either apply hot updates (in case
      // of CSS changes), or refresh the page (in case of JS changes). When you
      // make a syntax error, this client will display a syntax error overlay.
      // Note: instead of the default WebpackDevServer client, we use a custom one
      // to bring better experience for Create React App users. You can replace
      // the line below with these two lines if you prefer the stock client:
      // require.resolve('webpack-dev-server/client') + '?/',
      // require.resolve('webpack/hot/dev-server'),
      !isProd && require.resolve('react-dev-utils/webpackHotDevClient'),
      path.resolve(__dirname, '../client/clientEntry.js'),
    ].filter(Boolean) as string[],
    optimization: {
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true,
    },
    plugins: [
      // Generate chunk-map.json (mapping of chunk names to their corresponding chunk assets)
      new ChunkManifestPlugin({
        filename: 'chunk-map.json',
        outputPath: props.generatedFilesDir,
        manifestVariable: '__chunkMapping',
        inlineManifest: !isProd,
      }),
      // Show compilation progress bar and build time.
      new LogPlugin({
        name: 'Client',
      }),
    ],
  });

  return clientConfig;
}
