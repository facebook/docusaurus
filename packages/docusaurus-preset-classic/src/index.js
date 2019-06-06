/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function preset(context, opts = {}) {
  const {siteConfig = {}} = context;
  const {themeConfig} = siteConfig;
  const {algolia} = themeConfig;

  return {
    themes: [
      ['@docusaurus/theme-classic', opts.theme],
      // Don't add this if algolia config is not defined
      algolia && '@docusaurus/theme-search-algolia',
    ],
    plugins: [
      ['@docusaurus/plugin-content-docs', opts.docs],
      ['@docusaurus/plugin-content-blog', opts.blog],
      ['@docusaurus/plugin-content-pages', opts.pages],
      ['@docusaurus/plugin-sitemap', opts.sitemap],
    ],
  };
};
