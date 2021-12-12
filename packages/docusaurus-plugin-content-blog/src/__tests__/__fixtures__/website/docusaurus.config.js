/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const config = {
  title: 'Simple Blog',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'ignore',
  themes: ['@docusaurus/theme-classic'],
  plugins: [
    ['@docusaurus/plugin-content-blog',
      {
        path: 'blog'
      },
    ],
  ],
};

module.exports = config;
