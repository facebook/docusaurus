/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: {
    Docusaurus: ['introduction', 'design-principles', 'contributing'],
    'Getting Started': ['installation', 'configuration'],
    Guides: [
      'creating-pages',
      'styling-layout',
      'static-assets',
      {
        type: 'category',
        label: 'Docs',
        items: ['markdown-features', 'sidebar', 'versioning'],
      },
      'blog',
      'search',
      'deployment',
      'migrating-from-v1-to-v2',
    ],
    'Advanced Guides': ['using-plugins', 'using-themes', 'presets'],
    'API Reference': [
      'cli',
      'docusaurus-core',
      'docusaurus.config.js',
      'lifecycle-apis',
      'theme-classic',
    ],
  },
};
