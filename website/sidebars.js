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
      items: ['installation', 'configuration', 'typescript-support'],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/creating-pages',
        'styling-layout',
        'static-assets',
        {
          Docs: ['docs-introduction', 'markdown-features', 'versioning'],
        },
        'blog',
        'search',
        'deployment',
        'guides/migrating-from-v1-to-v2',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Guides',
      items: ['using-plugins', 'using-themes', 'presets'],
    },
  ],
  api: [
    'cli',
    'docusaurus-core',
    'api/docusaurus.config.js',
    'lifecycle-apis',
    'theme-classic',
    {
      type: 'category',
      label: 'Plugins',
      items: [
        'api/plugins/plugins-overview',
        {
          type: 'category',
          label: 'Content plugins',
          items: [
            'api/plugins/plugin-content-docs',
            'api/plugins/plugin-content-blog',
            'api/plugins/plugin-content-pages',
          ],
        },
        {
          type: 'category',
          label: 'Behavior plugins',
          items: [
            'api/plugins/plugin-client-redirects',
            'api/plugins/plugin-debug',
            'api/plugins/plugin-google-analytics',
            'api/plugins/plugin-google-gtag',
            'api/plugins/plugin-ideal-image',
            'api/plugins/plugin-pwa',
            'api/plugins/plugin-sitemap',
          ],
        },
      ],
    },
  ],
};
