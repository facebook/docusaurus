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
        {
          Docs: [
            'guides/docs/introduction',
            'guides/docs/create-doc',
            'guides/docs/sidebar',
            'guides/docs/versioning',
            'guides/docs/markdown-features',
            'guides/docs/multi-instance',
          ],
        },
        'blog',
        {
          type: 'category',
          label: 'Markdown Features',
          items: [
            'guides/markdown-features/introduction',
            'guides/markdown-features/react',
            'guides/markdown-features/tabs',
            'guides/markdown-features/code-blocks',
            'guides/markdown-features/admonitions',
            'guides/markdown-features/headings',
            'guides/markdown-features/inline-toc',
            'guides/markdown-features/assets',
            'guides/markdown-features/plugins',
          ],
        },
        'styling-layout',
        'static-assets',
        'search',
        'deployment',
        {
          type: 'category',
          label: 'Internationalization',
          items: [
            {
              type: 'doc',
              id: 'i18n/introduction',
              label: 'Introduction',
            },
            {
              type: 'doc',
              id: 'i18n/tutorial',
              label: 'Tutorial',
            },
            {
              type: 'doc',
              id: 'i18n/git',
              label: 'Using Git',
            },
            {
              type: 'doc',
              id: 'i18n/crowdin',
              label: 'Using Crowdin',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Advanced Guides',
      items: ['using-plugins', 'using-themes', 'presets'],
    },
    {
      type: 'category',
      label: 'Migrating from v1 to v2',
      items: [
        'migration/migration-overview',
        'migration/migration-automated',
        'migration/migration-manual',
        'migration/migration-versioned-sites',
        'migration/migration-translated-sites',
      ],
    },
  ],
  api: [
    'cli',
    'docusaurus-core',
    'api/docusaurus.config.js',
    'lifecycle-apis',
    {
      type: 'category',
      label: 'Plugins',
      items: [
        'api/plugins/plugins-overview',
        'api/plugins/plugin-content-docs',
        'api/plugins/plugin-content-blog',
        'api/plugins/plugin-content-pages',
        'api/plugins/plugin-client-redirects',
        'api/plugins/plugin-debug',
        'api/plugins/plugin-google-analytics',
        'api/plugins/plugin-google-gtag',
        'api/plugins/plugin-ideal-image',
        'api/plugins/plugin-pwa',
        'api/plugins/plugin-sitemap',
      ],
    },
    {
      type: 'category',
      label: 'Themes',
      items: [
        'api/themes/themes-overview',
        'api/themes/theme-configuration',
        'api/themes/theme-classic',
        'api/themes/theme-bootstrap',
        'api/themes/theme-live-codeblock',
        'api/themes/theme-search-algolia',
      ],
    },
  ],
};
