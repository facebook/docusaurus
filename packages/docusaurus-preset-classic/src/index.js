/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function preset(context, opts = {}) {
  const {siteConfig = {}} = context;
  const {themeConfig} = siteConfig;
  const {algolia, googleAnalytics, gtag} = themeConfig;
  const isProd = process.env.NODE_ENV === 'production';

  return {
    themes: [
      ['@docusaurus/theme-classic', opts.theme],
      ['@docusaurus/theme-hooks'],
      // Don't add this if algolia config is not defined.
      algolia && '@docusaurus/theme-search-algolia',
    ],
    plugins: [
      ['@docusaurus/plugin-content-docs', opts.docs],
      ['@docusaurus/plugin-content-blog', opts.blog],
      ['@docusaurus/plugin-content-pages', opts.pages],
      isProd && googleAnalytics && '@docusaurus/plugin-google-analytics',
      isProd && gtag && '@docusaurus/plugin-google-gtag',
      isProd && ['@docusaurus/plugin-sitemap', opts.sitemap],
    ],
  };
};
