/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from 'path';
import {Configuration} from 'webpack';
import merge from 'webpack-merge';
import WebpackNiceLog from 'webpack-nicelog';

import {Props} from '@docusaurus/types';
import {createBaseConfig} from './base';
import ChunkManifestPlugin from './plugins/ChunkManifestPlugin';

export function createClientConfig(props: Props): Configuration {
  const isProd = process.env.NODE_ENV === 'production';
  const config = createBaseConfig(props, false);

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
      // Generate chunk-map.json (mapping of chunk names to their corresponding chunk assets)
      new ChunkManifestPlugin({
        filename: 'chunk-map.json',
        manifestVariable: '__chunkMapping',
        inlineManifest: !isProd,
      }),
      // Show compilation progress bar and build time.
      new WebpackNiceLog({
        name: 'Client',
        skipBuildTime: isProd,
      }),
    ],
  });

  return clientConfig;
}
