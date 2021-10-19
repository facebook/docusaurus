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

  const debug =
    typeof opts.debug !== 'undefined' ? Boolean(opts.debug) : !isProd;

  return {
    themes: [
      [require.resolve('@docusaurus/theme-classic'), opts.theme],
      // Don't add this if algolia config is not defined.
      algolia && require.resolve('@docusaurus/theme-search-algolia'),
    ],
    plugins: [
      opts.docs !== false && [
        require.resolve('@docusaurus/plugin-content-docs'),
        opts.docs,
      ],
      opts.blog !== false && [
        require.resolve('@docusaurus/plugin-content-blog'),
        opts.blog,
      ],
      opts.pages !== false && [
        require.resolve('@docusaurus/plugin-content-pages'),
        opts.pages,
      ],
      isProd &&
        googleAnalytics &&
        require.resolve('@docusaurus/plugin-google-analytics'),
      debug && require.resolve('@docusaurus/plugin-debug'),
      isProd && gtag && require.resolve('@docusaurus/plugin-google-gtag'),
      isProd &&
        opts.sitemap !== false && [
          require.resolve('@docusaurus/plugin-sitemap'),
          opts.sitemap,
        ],
    ],
  };
};
