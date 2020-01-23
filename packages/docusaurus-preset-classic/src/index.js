/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const admonitions = require('remark-admonitions');

const addAdmonitions = pluginOptions => {
  if (pluginOptions == null) {
    return {
      remarkPlugins: [admonitions],
    };
  }
  if (pluginOptions.admonitions === false) {
    return pluginOptions;
  }
  const admonitionsOptions = {
    remarkPlugins: (pluginOptions.remarkPlugins || []).concat([
      admonitions,
      pluginOptions.admonitions || {},
    ]),
  };
  return {
    ...pluginOptions,
    ...admonitionsOptions,
  };
};

module.exports = function preset(context, opts = {}) {
  const {siteConfig = {}} = context;
  const {themeConfig} = siteConfig;
  const {algolia, googleAnalytics, gtag} = themeConfig;

  const docs = addAdmonitions(opts.docs);
  const blog = addAdmonitions(opts.blog);

  const isProd = process.env.NODE_ENV === 'production';
  return {
    themes: [
      ['@docusaurus/theme-classic', opts.theme],
      // Don't add this if algolia config is not defined
      algolia && '@docusaurus/theme-search-algolia',
    ],
    plugins: [
      ['@docusaurus/plugin-content-docs', docs],
      ['@docusaurus/plugin-content-blog', blog],
      ['@docusaurus/plugin-content-pages', opts.pages],
      isProd && googleAnalytics && '@docusaurus/plugin-google-analytics',
      isProd && gtag && '@docusaurus/plugin-google-gtag',
      isProd && ['@docusaurus/plugin-sitemap', opts.sitemap],
    ],
  };
};
