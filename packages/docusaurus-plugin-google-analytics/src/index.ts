/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import type {
  LoadContext,
  Plugin,
  OptionValidationContext,
  ThemeConfig,
  ThemeConfigValidationContext,
} from '@docusaurus/types';
import type {PluginOptions, Options} from './options';

export default function pluginGoogleAnalytics(
  context: LoadContext,
  options: PluginOptions,
): Plugin {
  const {trackingID, anonymizeIP} = options;
  const isProd = process.env.NODE_ENV === 'production';

  return {
    name: 'docusaurus-plugin-google-analytics',

    getClientModules() {
      return isProd ? ['./analytics'] : [];
    },

    injectHtmlTags() {
      if (!isProd) {
        return {};
      }
      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: 'https://www.google-analytics.com',
            },
          },
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/#alternative_async_tag
          {
            tagName: 'script',
            innerHTML: `
              window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
              ga('create', '${trackingID}', 'auto');
              ${anonymizeIP ? "ga('set', 'anonymizeIp', true);\n" : ''}
              ga('send', 'pageview');
            `,
          },
          {
            tagName: 'script',
            attributes: {
              async: true,
              src: 'https://www.google-analytics.com/analytics.js',
            },
          },
        ],
      };
    },
  };
}

const pluginOptionsSchema = Joi.object<PluginOptions>({
  trackingID: Joi.string().required(),
  anonymizeIP: Joi.boolean().default(false),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  return validate(pluginOptionsSchema, options);
}

export function validateThemeConfig({
  themeConfig,
}: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig {
  if ('googleAnalytics' in themeConfig) {
    throw new Error(
      'The "googleAnalytics" field in themeConfig should now be specified as option for plugin-google-analytics. More information at https://github.com/facebook/docusaurus/pull/5832.',
    );
  }
  return themeConfig;
}

export type {PluginOptions, Options};
