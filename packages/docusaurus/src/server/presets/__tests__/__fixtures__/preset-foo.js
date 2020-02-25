/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function preset(context, opts = {}) {
  return {
    plugins: [
      ['@docusaurus/plugin-content-pages', opts.pages],
      ['@docusaurus/plugin-sitemap', opts.sitemap],
    ],
  };
};
