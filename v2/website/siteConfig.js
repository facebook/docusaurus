/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'docusaurus',
  tagline: '📝⚡️ Transform your document (문서) to a website',
  organizationName: 'facebook',
  projectName: 'docusaurus',
  baseUrl: '/',
  customDocsPath: '../docs',
  url: 'https://docusaurus.io',
  headerLinks: [
    {doc: 'installation', label: 'Docs'},
    {page: 'youtube', label: 'Youtube'},
    {blog: true, label: 'Blog'},
    {
      href: 'https://github.com/facebook/docusaurus',
      label: 'GitHub',
    },
  ],
  headerIcon: 'img/docusaurus.svg',
  favicon: 'img/docusaurus.ico',
  algolia: {
    apiKey: '3eb9507824b8be89e7a199ecaa1a9d2c',
    indexName: 'docusaurus',
    algoliaOptions: {},
  },
};
