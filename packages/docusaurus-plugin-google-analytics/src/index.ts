/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import type {LoadContext, Plugin, HtmlTags} from '@docusaurus/types';
import type {ThemeConfig} from '@docusaurus/plugin-google-analytics';

export default function pluginGoogleAnalytics(context: LoadContext): Plugin {
  const {
    siteConfig: {themeConfig},
  } = context;
  const {googleAnalytics} = themeConfig as ThemeConfig;

  if (!googleAnalytics) {
    throw new Error(
      `You need to specify "googleAnalytics" object in "themeConfig" with "trackingId" field in it to use docusaurus-plugin-google-analytics.`,
    );
  }

  const {trackingID, anonymizeIP} = googleAnalytics;

  if (!trackingID) {
    throw new Error(
      'You specified the "googleAnalytics" object in "themeConfig" but the "trackingID" field was missing. ' +
        'Please ensure this is not a mistake.',
    );
  }

  const isProd = process.env.NODE_ENV === 'production';

  return {
    name: 'docusaurus-plugin-google-analytics',

    getClientModules() {
      return isProd ? [path.resolve(__dirname, './analytics')] : [];
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
        ] as HtmlTags,
      };
    },
  };
}
