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
  url: 'https://v2.docusaurus.io',
  favicon: 'img/docusaurus.ico',
  themes: ['@docusaurus/theme-live-codeblock'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          path: '../website-1.x/blog',
          postsPerPage: 3,
        },
        theme: {
          customCss: require.resolve('./css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    gtag: {
      trackingID: 'UA-141789564-1',
    },
    // googleAnalytics: {
    //   trackingID: 'UA-141789564-1',
    // },
    algolia: {
      apiKey: '47ecd3b21be71c5822571b9f59e52544',
      indexName: 'docusaurus-2',
      algoliaOptions: {},
    },
    navbar: {
      title: 'Docusaurus',
      logo: {
        alt: 'Docusaurus Logo',
        src: 'img/docusaurus.svg',
      },
      links: [
        {to: 'docs/introduction', label: 'Docs', position: 'left'},
        {to: 'blog', label: 'Blog', position: 'left'},
        {to: 'feedback', label: 'Feedback', position: 'left'},
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: 'docs/introduction',
            },
            {
              label: 'Themes',
              to: 'docs/themes',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Feedback',
              to: 'feedback',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
      ],
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'https://docusaurus.io/img/oss_logo.png',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`,
    },
  },
};
