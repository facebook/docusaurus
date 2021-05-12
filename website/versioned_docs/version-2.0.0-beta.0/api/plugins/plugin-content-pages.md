---
id: plugin-content-pages
title: '📦 plugin-content-pages'
slug: '/api/plugins/@docusaurus/plugin-content-pages'
---

The default pages plugin for Docusaurus. The classic template ships with this plugin with default configurations. This plugin provides [creating pages](guides/creating-pages.md) functionality.

## Installation {#installation}

```bash npm2yarn
npm install --save @docusaurus/plugin-content-pages
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency. You can also configure it through the [classic preset options](presets.md#docusauruspreset-classic) instead of doing it like below.

:::

## Configuration {#configuration}

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-content-pages',
      {
        /**
         * Path to data on filesystem
         * relative to site dir
         * components in this directory will be automatically converted to pages
         */
        path: 'src/pages',
        /**
         * URL route for the page section of your site
         * do not include trailing slash
         */
        routeBasePath: '',
        include: ['**/*.{js,jsx,ts,tsx,md,mdx}'],
        /**
         * No Route will be created for matching files
         */
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/*.test.{js,ts}',
          '**/__tests__/**',
        ],
        /**
         * Theme component used by markdown pages.
         */
        mdxPageComponent: '@theme/MDXPage',
        /**
         * Remark and Rehype plugins passed to MDX
         */
        remarkPlugins: [],
        rehypePlugins: [],
        /**
         * Custom Remark and Rehype plugins passed to MDX before
         * the default Docusaurus Remark and Rehype plugins.
         */
        beforeDefaultRemarkPlugins: [],
        beforeDefaultRehypePlugins: [],
      },
    ],
  ],
};
```

## i18n {#i18n}

Read the [i18n introduction](../../i18n/i18n-introduction.md) first.

### Translation files location {#translation-files-location}

- **Base path**: `website/i18n/<locale>/docusaurus-plugin-content-pages`
- **Multi-instance path**: `website/i18n/<locale>/docusaurus-plugin-content-pages-<pluginId>`
- **JSON files**: extracted with [`docusaurus write-translations`](../../cli.md#docusaurus-write-translations)
- **Markdown files**: `website/i18n/<locale>/docusaurus-plugin-content-pages`

### Example file-system structure {#example-file-system-structure}

```bash
website/i18n/<locale>/docusaurus-plugin-content-pages
│
│ # translations for website/src/pages
├── first-markdown-page.md
└── second-markdown-page.md
```
