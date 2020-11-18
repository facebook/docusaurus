/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function (context, options) {
  const { trackingID, trackingDEV = false } = options;
  if (!trackingID) {
    throw new Error(
      'docusaurus-plugin-baidu-analytics: Baidu Analytic trackingID is not defined, please check your plugins options!'
    );
  }
  const isProd = process.env.NODE_ENV === 'production';
  const traking = isProd ? true : trackingDEV;

  return {
    name: 'plugin-baidu-analytics',
    injectHtmlTags() {
      if (!traking) {
        return {};
      }
      return {
        headTags: [
          {
            tagName: 'script',
            attributes: {
              async: true,
              src: `https://hm.baidu.com/hm.js?${trackingID}`,
            },
          },
        ],
      };
    },
  };
};
