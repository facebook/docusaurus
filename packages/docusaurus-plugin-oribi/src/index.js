/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function (context) {
  const {siteConfig} = context;
  const {themeConfig} = siteConfig;
  const {googleAnalytics} = themeConfig || {};

  if (!googleAnalytics) {
    throw new Error(
      `You need to specify 'googleAnalytics' object in 'themeConfig' with 'trackingId' field in it to use docusaurus-plugin-oribi`,
    );
  }

  const {trackingID} = googleAnalytics;

  if (!trackingID) {
    throw new Error(
      'You specified the `googleAnalytics` object in `themeConfig` but the `trackingID` field was missing. ' +
        'Please ensure this is not a mistake.',
    );
  }

  const isProd = process.env.NODE_ENV === 'production';

  return {
    name: 'docusaurus-plugin-oribi',
    injectHtmlTags() {
      if (!isProd) {
        return {};
      }

      return {
        headTags: [
          {
            tagName: 'script',
            async: true,
            innerHTML: `(function (b, o, n, g, s, r, c) {
              if (b[s]) return;
              b[s] = {};
              b[s].scriptToken = "${trackingID}";
              b[s].callsQueue = [];
              b[s].api = function () {
                b[s].callsQueue.push(arguments);
              };
              r = o.createElement(n);
              c = o.getElementsByTagName(n)[0];
              r.async = 1;
              r.src = g;
              r.id = s + n;
              c.parentNode.insertBefore(r, c);
            })(
              window,
              document,
              "script",
              "https://cdn.oribi.io/${trackingID}/oribi.js",
              "ORIBI"
            );`,
          },
        ],
      };
    },
  };
};
