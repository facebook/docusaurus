/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chalk from 'chalk';
import path from 'path';
import {Configuration} from 'webpack';
import merge from 'webpack-merge';

import {Props} from '@docusaurus/types';
import {createBaseConfig} from './base';
import ChunkAssetPlugin from './plugins/ChunkAssetPlugin';
import LogPlugin from './plugins/LogPlugin';

export function createClientConfig(props: Props): Configuration {
  const isProd = process.env.NODE_ENV === 'production';
  const config = createBaseConfig(props, false);

  const clientConfig = merge(config, {
    entry: [
      // Instead of the default WebpackDevServer client, we use a custom one
      // like CRA to bring better experience.
      !isProd && require.resolve('react-dev-utils/webpackHotDevClient'),
      path.resolve(__dirname, '../client/clientEntry.js'),
    ].filter(Boolean) as string[],
    optimization: {
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true,
    },
    plugins: [
      // Plugin to force terminate building if errors happened in the client bundle
      {
        apply: compiler => {
          compiler.hooks.done.tap('client:done', stats => {
            if (stats.hasErrors()) {
              console.log(
                chalk.red(
                  'Client bundle compiled with errors therefore further build is impossible.',
                ),
              );

              stats.toJson('errors-only').errors.forEach(e => {
                console.error(e);
              });

              process.exit(1);
            }
          });
        },
      },
      new ChunkAssetPlugin(),
      // Show compilation progress bar and build time.
      new LogPlugin({
        name: 'Client',
      }),
    ],
  });

  return clientConfig;
}
