/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = require('./data/users');

const siteConfig = {
  title: 'Docusaurus',
  tagline: 'Easy to Maintain Open Source Documentation Websites',
  url: 'https://docusaurus.io',
  baseUrl: '/',
  organizationName: 'facebook',
  projectName: 'Docusaurus',
  cname: 'docusaurus.io',
  noIndex: false,
  users,
  editUrl: 'https://github.com/facebook/docusaurus/edit/master/docs/',
  headerLinks: [
    {doc: 'installation', label: 'Docs'},
    {href: '/docs/en/next/tutorial-setup', label: 'Tutorial'},
    {page: 'users', label: 'Users'},
    {blog: true, label: 'Blog'},
    {
      href: 'https://github.com/facebook/docusaurus',
      label: 'GitHub',
    },
  ],
  headerIcon: 'img/docusaurus.svg',
  footerIcon: 'img/docusaurus_monochrome.svg',
  favicon: 'img/docusaurus.ico',
  algolia: {
    apiKey: '3eb9507824b8be89e7a199ecaa1a9d2c',
    indexName: 'docusaurus',
    algoliaOptions: {
      facetFilters: ['language:LANGUAGE', 'version:VERSION'],
    },
  },
  colors: {
    primaryColor: '#2E8555',
    secondaryColor: '#205C3B',
  },
  translationRecruitingLink: 'https://crowdin.com/project/docusaurus',
  copyright: `Copyright © ${new Date().getFullYear()} Facebook Inc.`,
  usePrism: ['jsx'],
  highlight: {
    theme: 'atom-one-dark',
  },
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/js/code-blocks-buttons.js',
  ],
  gaTrackingId: 'UA-44373548-31',
  facebookAppId: '199138890728411',
  facebookComments: true,
  twitter: 'true',
  twitterUsername: 'docusaurus',
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',
  onPageNav: 'separate',
  cleanUrl: true,
  scrollToTop: true,
  scrollToTopOptions: {
    zIndex: 100,
  },
  enableUpdateTime: true,
  enableUpdateBy: true,
  docsSideNavCollapsible: true,
};

module.exports = siteConfig;
