/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function() {
  return {
    name: 'plugin-both-tags',
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
        ],
        bodyTags: [
          {
            tagName: 'div',
            innerHTML: 'Test content',
          },
        ],
      };
    },
  };
};
