/*
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: {
    Docusaurus: [
      'introduction',
      /*'motivation', */ 'design-principles',
      'contributing',
    ],
    'Getting Started': ['installation', 'configuration'],
    Guides: [
      'creating-pages',
      'styling-layout',
      {
        type: 'category',
        label: 'Docs',
        items: ['markdown-features', 'sidebar', 'static-assets'],
      },
      'blog',
      'reaching-users',
      'using-plugins',
      'using-themes',
      'deployment',
    ],
    'Advanced Guides': [
      'advanced-plugins',
      'advanced-themes',
      'advanced-presets',
    ],
    'API Reference': [
      'cli',
      'docusaurus-core',
      'docusaurus.config.js',
      'plugins-api',
    ],
  },
};
