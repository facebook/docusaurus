/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import path from 'path';
import type {Configuration} from 'webpack';
import merge from 'webpack-merge';

import type {Props} from '@docusaurus/types';
import {createBaseConfig} from './base';
import ChunkAssetPlugin from './plugins/ChunkAssetPlugin';
import LogPlugin from './plugins/LogPlugin';

export default async function createClientConfig(
  props: Props,
  minify: boolean = true,
): Promise<Configuration> {
  const isBuilding = process.argv[2] === 'build';
  const config = await createBaseConfig(props, false, minify);

  const clientConfig = merge(config, {
    // useless, disabled on purpose (errors on existing sites with no
    // browserslist config)
    // target: 'browserslist',
    entry: path.resolve(__dirname, '../client/clientEntry.js'),
    optimization: {
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true,
    },
    plugins: [
      new ChunkAssetPlugin(),
      // Show compilation progress bar and build time.
      new LogPlugin({
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
            logger.error(
              'Client bundle compiled with errors therefore further build is impossible.',
            );
            process.exit(1);
          }
        });
      },
    });
  }

  return clientConfig;
}
