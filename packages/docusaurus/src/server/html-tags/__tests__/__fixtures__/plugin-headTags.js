/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function() {
  return {
    name: 'plugin-headTags-only',
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: 'www.google-analytics.com',
            },
          },
          `<meta name="generator" content="docusaurus">`,
        ],
      };
    },
  };
};
