/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import {readDefaultCodeTranslationMessages} from '@docusaurus/theme-translations';
import type {
  LoadContext,
  Plugin,
  OptionValidationContext,
} from '@docusaurus/types';
import type {PluginOptions} from '@docusaurus/plugin-ideal-image';

export default function pluginIdealImage(
  context: LoadContext,
  options: PluginOptions,
): Plugin<void> {
  const {
    i18n: {currentLocale},
  } = context;

  return {
    name: 'docusaurus-plugin-ideal-image',

    getThemePath() {
      return '../lib/theme';
    },

    getTypeScriptThemePath() {
      return '../src/theme';
    },

    getDefaultCodeTranslationMessages() {
      return readDefaultCodeTranslationMessages({
        locale: currentLocale,
        name: 'plugin-ideal-image',
      });
    },

    configureWebpack(_config, isServer) {
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
              test: /\.(?:png|jpe?g)$/i,
              // We don't want to use the image loader for non-React source code
              // ie we don't want to use ideal image loader for CSS files...
              // See https://github.com/facebook/docusaurus/issues/10862
              issuer: {
                and: [/\.(?:tsx?|jsx?|mdx?)$/i],
              },
              use: [
                require.resolve('@docusaurus/lqip-loader'),
                {
                  loader: require.resolve('@docusaurus/responsive-loader'),
                  options: {
                    // Don't emit for server-side rendering
                    emitFile: !isServer,
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
}: OptionValidationContext<PluginOptions, PluginOptions>): PluginOptions {
  const pluginOptionsSchema = Joi.object<PluginOptions>({
    disableInDev: Joi.boolean().default(true),
  }).unknown();
  return validate(pluginOptionsSchema, options);
}
