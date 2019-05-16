/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function preset(context, opts = {}) {
  return {
    themes: [
      {
        name: '@docusaurus/theme-classic',
      },
      {
        name: '@docusaurus/theme-search-algolia',
      },
    ],
    plugins: [
      {
        name: '@docusaurus/plugin-content-docs',
        options: opts.docs,
      },
      {
        name: '@docusaurus/plugin-content-blog',
        options: opts.blog,
      },
      {
        name: '@docusaurus/plugin-content-pages',
        options: opts.pages,
      },
      {
        name: '@docusaurus/plugin-sitemap',
        options: opts.sitemap,
      },
    ],
  };
};
