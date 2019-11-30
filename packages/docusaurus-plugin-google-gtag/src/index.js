/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

module.exports = function(context) {
  const {siteConfig} = context;
  const {themeConfig} = siteConfig;
  const {gtag} = themeConfig || {};

  if (!gtag) {
    throw new Error(
      `You need to specify 'gtag' object in 'themeConfig' with 'trackingId' field in it to use docusaurus-plugin-google-gtag`,
    );
  }

  const {trackingID} = gtag;

  if (!trackingID) {
    throw new Error(
      'You specified the `gtag` object in `themeConfig` but the `trackingID` field was missing. ' +
        'Please ensure this is not a mistake.',
    );
  }

  return {
    name: 'docusaurus-plugin-google-gtag',

    getClientModules() {
      return [path.resolve(__dirname, './gtag')];
    },

    injectHtmlTags() {
      const innerHTML = `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', ${trackingID});`;

      return {
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
          {
            tagName: 'script',
            attributes: {
              async: true,
              src: `https://www.googletagmanager.com/gtag/js?id=${trackingID}`,
            },
          },
          {
            tagName: 'script',
            innerHTML,
          },
        ],
      };
    },
  };
};
