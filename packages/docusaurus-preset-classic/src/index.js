/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const admonitions = require('remark-admonitions');

module.exports = function preset(context, opts = {}) {
  const {siteConfig = {}} = context;
  const {themeConfig} = siteConfig;
  const {algolia, googleAnalytics, gtag} = themeConfig;

  // add the admonitions settings to the options for docs and blog unless admonitions === false
  opts.docs = opts.docs || {};
  opts.blog = opts.blog || {};

  if (opts.docs.admonitions !== false) {
    opts.docs.remarkPlugins = (opts.docs.remarkPlugins || []).concat([admonitions, opts.docs.admonitions || {}])
  }

  if (opts.blog.admonitions !== false) {
    opts.blog.remarkPlugins = (opts.blog.remarkPlugins || []).concat([admonitions, opts.blog.admonitions || {}])
  }

  const isProd = process.env.NODE_ENV === 'production';
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
      isProd && googleAnalytics && '@docusaurus/plugin-google-analytics',
      isProd && gtag && '@docusaurus/plugin-google-gtag',
      isProd && ['@docusaurus/plugin-sitemap', opts.sitemap],
    ],
  };
};
