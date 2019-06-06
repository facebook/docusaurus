/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'Sakura',
  tagline: 'This is not an ordinary site',
  organizationName: 'endiliey',
  projectName: 'sakura',
  baseUrl: '/sakura/',
  url: 'https://docusaurus.io',
  favicon: 'img/docusaurus.ico',
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        path: '../docs',
        sidebarPath: require.resolve('./sidebars.json'),
      },
    ],
    '@docusaurus/plugin-content-pages',
  ],
};
