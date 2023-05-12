/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import logger from '@docusaurus/logger';
import merge from 'webpack-merge';
import WebpackBar from 'webpackbar';
import {DefinePlugin} from 'webpack';
import {createBaseConfig} from './base';
import ChunkAssetPlugin from './plugins/ChunkAssetPlugin';
import {formatStatsErrorMessage} from './utils';
import type {Props} from '@docusaurus/types';
import type {Configuration} from 'webpack';

export default async function createClientConfig(
  props: Props,
  minify: boolean = true,
  hydrate: boolean = true,
): Promise<Configuration> {
  const isBuilding = process.argv[2] === 'build';
  const config = await createBaseConfig(props, false, minify);

  const clientConfig = merge(config, {
    // Useless, disabled on purpose (errors on existing sites with no
    // browserslist config)
    // target: 'browserslist',
    entry: path.resolve(__dirname, '../client/clientEntry.js'),
    optimization: {
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true,
    },
    plugins: [
      new DefinePlugin({
        'process.env.HYDRATE_CLIENT_ENTRY': JSON.stringify(hydrate),
      }),
      new ChunkAssetPlugin(),
      // Show compilation progress bar and build time.
      new WebpackBar({
        name: 'Client',
      }),
    ],
  });

  // When building, include the plugin to force terminate building if errors
  // happened in the client bundle.
  if (isBuilding) {
    clientConfig.plugins?.push({
      apply: (compiler) => {
        compiler.hooks.done.tap('client:done', (stats) => {
          if (stats.hasErrors()) {
            const errorsWarnings = stats.toJson('errors-warnings');
            logger.error(
              `Client bundle compiled with errors therefore further build is impossible.\n${formatStatsErrorMessage(
                errorsWarnings,
              )}`,
            );
            process.exit(1);
          }
        });
      },
    });
  }

  return clientConfig;
}
