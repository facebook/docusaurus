/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Docusaurus',
      items: ['introduction', 'design-principles', 'contributing'],
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: ['installation', 'configuration'],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'creating-pages',
        'styling-layout',
        'static-assets',
        {
          Docs: ['docs-introduction', 'markdown-features', 'versioning'],
        },
        'blog',
        'search',
        'deployment',
        'migrating-from-v1-to-v2',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Guides',
      items: ['using-plugins', 'using-themes', 'presets'],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'cli',
        'docusaurus-core',
        'docusaurus.config.js',
        'lifecycle-apis',
        'theme-classic',
      ],
    },
  ],
  community: [
    'support',
    'team',
    'resources',
    {
      type: 'link',
      href: '/showcase',
      label: 'Showcase',
    },
    {
      type: 'link',
      href: '/feedback',
      label: 'Feedback',
    },
  ],
};
