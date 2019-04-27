/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'Docusaurus',
  tagline: '⚡️ Painless static site generator',
  organizationName: 'facebook',
  projectName: 'docusaurus',
  baseUrl: '/',
  url: 'https://docusaurus-2.netlify.com',
  headerLinks: [
    {url: 'docs/installation', label: 'Docs'},
    {url: 'blog', label: 'Blog'},
    {url: 'feedback/', label: 'Feedback'},
  ],
  headerIcon: 'img/docusaurus.svg',
  favicon: 'img/docusaurus.ico',
  algolia: {
    apiKey: '47ecd3b21be71c5822571b9f59e52544',
    indexName: 'docusaurus-2',
    algoliaOptions: {},
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '../docs',
          sidebarPath: require.resolve('./sidebars.json'),
        },
        blog: {
          path: '../website-1.x/blog',
        },
      },
    ],
  ],
};
