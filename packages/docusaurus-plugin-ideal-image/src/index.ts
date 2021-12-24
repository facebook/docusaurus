/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {LoadContext, Plugin} from '@docusaurus/types';
import type {PluginOptions} from '@docusaurus/plugin-ideal-image';
import {Configuration} from 'webpack';
import {readDefaultCodeTranslationMessages} from '@docusaurus/theme-translations';

import path from 'path';

export default function (
  context: LoadContext,
  options: PluginOptions,
): Plugin<void> {
  const {
    i18n: {currentLocale},
  } = context;

  return {
    name: 'docusaurus-plugin-ideal-image',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    getDefaultCodeTranslationMessages() {
      return readDefaultCodeTranslationMessages({
        locale: currentLocale,
        name: 'plugin-ideal-image',
      });
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
