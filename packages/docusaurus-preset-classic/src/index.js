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
        module: '@docusaurus/theme-classic',
      },
      {
        module: '@docusaurus/theme-search-algolia',
      },
    ],
    plugins: [
      {
        module: '@docusaurus/plugin-content-docs',
        options: opts.docs,
      },
      {
        module: '@docusaurus/plugin-content-blog',
        options: opts.blog,
      },
      {
        module: '@docusaurus/plugin-content-pages',
        options: opts.pages,
      },
      {
        module: '@docusaurus/plugin-sitemap',
        options: opts.sitemap,
      },
    ],
  };
};
