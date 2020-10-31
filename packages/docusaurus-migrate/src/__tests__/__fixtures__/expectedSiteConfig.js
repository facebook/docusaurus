/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'Docusaurus',
  tagline: 'Easy to Maintain Open Source Documentation Websites',
  url: 'https://docusaurus.io',
  baseUrl: '/',
  organizationName: 'facebook',
  projectName: 'docusaurus',
  noIndex: true,
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/js/code-blocks-buttons.js',
  ],
  favicon: 'img/docusaurus.ico',
  customFields: {
    users: {
      caption: 'DevSpace',
      image: '/img/users/devspace.svg',
      infoLink: 'https://devspace.cloud/docs/',
      fbOpenSource: false,
      pinned: false,
    },
    translationRecruitingLink: 'https://crowdin.com/project/docusaurus',
    facebookAppId: '199138890728411',
  },
  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'log',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          homePageId: 'installation',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/docs/',
        },
        blog: {},
        theme: {},
      },
    ],
  ],
  plugins: [],
  themeConfig: {
    navbar: {
      title: 'Docusaurus',
      logo: {src: 'img/docusaurus.svg'},
      items: [
        {to: 'docs/', label: 'Docs', position: 'left'},
        {to: 'docs/tutorial-setup', label: 'Tutorial', position: 'left'},
        {to: '/users', label: 'Users', position: 'left'},
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'left',
        },
      ],
    },
    image: 'img/docusaurus.png',
    footer: {
      links: [
        {
          title: 'Community',
          items: [{label: 'Twitter', to: 'https://twitter.com/docusaurus'}],
        },
      ],
      copyright: 'Copyright © 2020 Facebook Inc.',
      logo: {src: 'img/docusaurus_monochrome.svg'},
    },
    algolia: {
      apiKey: '3eb9507824b8be89e7a199ecaa1a9d2c',
      indexName: 'docusaurus',
      algoliaOptions: {facetFilters: ['language:LANGUAGE', 'version:VERSION']},
    },
    gtag: {trackingID: 'UA-44373548-31'},
  },
};
