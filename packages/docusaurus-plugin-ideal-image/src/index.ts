/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {LoadContext, Plugin} from '@docusaurus/types';
import type {PluginOptions} from '@docusaurus/plugin-ideal-image';
import type {Configuration} from 'webpack';

export default function (
  _context: LoadContext,
  options: PluginOptions,
): Plugin<void> {
  return {
    name: 'docusaurus-plugin-ideal-image',

    getThemePath() {
      return new URL('./theme', import.meta.url).pathname;
    },

    configureWebpack(_config: Configuration, isServer: boolean) {
      if (process.env.NODE_ENV !== 'production') {
        return {};
      }

      return {
        mergeStrategy: {
          'module.rules': 'prepend',
        },
        module: {
          rules: [
            {
              test: /\.(png|jpe?g|gif)$/i,
              use: [
                require.resolve('@docusaurus/lqip-loader'),
                {
                  loader: require.resolve('@docusaurus/responsive-loader'),
                  options: {
                    emitFile: !isServer, // don't emit for server-side rendering
                    // eslint-disable-next-line global-require
                    adapter: require('@docusaurus/responsive-loader/sharp'),
                    name: 'assets/ideal-img/[name].[hash:hex:7].[width].[ext]',
                    ...options,
                  },
                },
              ],
            },
          ],
        },
      };
    },
  };
}
