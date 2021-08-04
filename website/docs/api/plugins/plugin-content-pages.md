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

Accepted fields:

<small>

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `path` | `string` | `'src/pages'` | Path to data on filesystem relative to site dir. Components in this directory will be automatically converted to pages. |
| `routeBasePath` | `string` | `'/'` | URL route for the docs section of your site. **DO NOT** include a trailing slash. |
| `include` | `string[]` | `['**/*.{js,jsx,ts,tsx,md,mdx}']` | Matching files will be included and processed. |
| `exclude` | `string[]` | _See example configuration_ | No route will be created for matching files. |
| `mdxPageComponent` | `string` | `'@theme/MDXPage'` | Component used by each MDX page. |
| `remarkPlugins` | `[]` | `any[]` | Remark plugins passed to MDX. |
| `rehypePlugins` | `[]` | `any[]` | Rehype plugins passed to MDX. |
| `beforeDefaultRemarkPlugins` | `any[]` | `[]` | Custom Remark plugins passed to MDX before the default Docusaurus Remark plugins. |
| `beforeDefaultRehypePlugins` | `any[]` | `[]` | Custom Rehype plugins passed to MDX before the default Docusaurus Rehype plugins. |

</small>

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-content-pages',
      {
        path: 'src/pages',
        routeBasePath: '',
        include: ['**/*.{js,jsx,ts,tsx,md,mdx}'],
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/_*/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/__tests__/**',
        ],
        mdxPageComponent: '@theme/MDXPage',
        remarkPlugins: [require('remark-math')],
        rehypePlugins: [],
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
- **JSON files**: extracted with [`docusaurus write-translations`](../../cli.md#docusaurus-write-translations-sitedir)
- **Markdown files**: `website/i18n/<locale>/docusaurus-plugin-content-pages`

### Example file-system structure {#example-file-system-structure}

```bash
website/i18n/<locale>/docusaurus-plugin-content-pages
│
│ # translations for website/src/pages
├── first-markdown-page.md
└── second-markdown-page.md
```
