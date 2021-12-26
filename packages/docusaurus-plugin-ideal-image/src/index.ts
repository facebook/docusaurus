/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  LoadContext,
  Plugin,
  OptionValidationContext,
  ValidationResult,
} from '@docusaurus/types';
import type {PluginOptions} from '@docusaurus/plugin-ideal-image';
import type {Configuration} from 'webpack';
import {Joi} from '@docusaurus/utils-validation';

import path from 'path';

export default function pluginIdealImage(
  _context: LoadContext,
  options: PluginOptions,
): Plugin<void> {
  return {
    name: 'docusaurus-plugin-ideal-image',

    getThemePath() {
      return path.resolve(__dirname, '../lib/theme');
    },

    getTypeScriptThemePath() {
      return path.resolve(__dirname, '../src/theme');
    },

    configureWebpack(_config: Configuration, isServer: boolean) {
      const {disableInDev, ...loaderOptions} = options;
      if (disableInDev && process.env.NODE_ENV !== 'production') {
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
                    ...loaderOptions,
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

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<PluginOptions>): ValidationResult<PluginOptions> {
  const pluginOptionsSchema = Joi.object({
    disableInDev: Joi.boolean().default(true),
  }).unknown();
  return validate(pluginOptionsSchema, options);
}
