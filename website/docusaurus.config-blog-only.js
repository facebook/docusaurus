/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'Docusaurus blog only!',
  tagline: 'Build optimized websites quickly, focus on your content',
  organizationName: 'facebook',
  projectName: 'docusaurus',
  baseUrl: '/blog-only/',
  url: 'https://v2.docusaurus.io',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/docusaurus.ico',
  themes: ['@docusaurus/theme-live-codeblock'],
  plugins: [],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: false,
        pages: false,
        blog: {
          routeBasePath: '/',
          path: '../website-1.x/blog',
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website-1.x/',
          postsPerPage: 3,
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`,
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    image: 'img/docusaurus-soc.png',
    navbar: {
      hideOnScroll: true,
      title: 'Docusaurus',
      logo: {
        alt: 'Docusaurus Logo',
        src: 'img/docusaurus.svg',
        srcDark: 'img/docusaurus_keytar.svg',
      },
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'img/oss_logo.png',
        href: 'https://opensource.facebook.com',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc. Built with Docusaurus.`,
    },
  },
};
