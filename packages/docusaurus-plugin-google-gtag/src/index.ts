/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {Joi} from '@docusaurus/utils-validation';
import type {
  LoadContext,
  Plugin,
  OptionValidationContext,
  ValidationResult,
  ThemeConfig,
  ThemeConfigValidationContext,
} from '@docusaurus/types';
import type {PluginOptions} from '@docusaurus/plugin-google-gtag';

export default function pluginGoogleGtag(
  context: LoadContext,
  options: PluginOptions,
): Plugin {
  const {anonymizeIP, trackingID} = options;
  const isProd = process.env.NODE_ENV === 'production';

  return {
    name: 'docusaurus-plugin-google-gtag',

    async contentLoaded({actions}) {
      actions.setGlobalData(options);
    },

    getClientModules() {
      return isProd ? [path.resolve(__dirname, './gtag')] : [];
    },

    injectHtmlTags() {
      if (!isProd) {
        return {};
      }
      return {
        // Gtag includes GA by default, so we also preconnect to google-analytics.
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: 'https://www.google-analytics.com',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: 'https://www.googletagmanager.com',
            },
          },
          // https://developers.google.com/analytics/devguides/collection/gtagjs/#install_the_global_site_tag
          {
            tagName: 'script',
            attributes: {
              async: true,
              src: `https://www.googletagmanager.com/gtag/js?id=${trackingID}`,
            },
          },
          {
            tagName: 'script',
            innerHTML: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${trackingID}', { ${
              anonymizeIP ? "'anonymize_ip': true" : ''
            } });`,
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
}: OptionValidationContext<PluginOptions>): ValidationResult<PluginOptions> {
  return validate(pluginOptionsSchema, options);
}

export function validateThemeConfig({
  themeConfig,
}: ThemeConfigValidationContext<ThemeConfig>): ValidationResult<ThemeConfig> {
  if (themeConfig.gtag) {
    throw new Error(
      'The "gtag" field in themeConfig should now be specified as option for plugin-google-gtag. More information at https://github.com/facebook/docusaurus/pull/5832.',
    );
  }
  return themeConfig;
}
