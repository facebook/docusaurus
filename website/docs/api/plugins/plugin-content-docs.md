---
id: plugin-content-docs
title: '📦 plugin-content-docs'
slug: '/api/plugins/@docusaurus/plugin-content-docs'
---

Provides the [Docs](markdown-features.mdx) functionality and is the default docs plugin for Docusaurus.

## Installation

```bash npm2yarn
npm install --save @docusaurus/plugin-content-docs
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency. You can also configure it through the [classic preset options](presets.md#docusauruspreset-classic) instead of doing it like below.

:::

## Configuration

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: 'docs',
        /**
         * URL for editing a doc in the website repo.
         * Example: 'https://github.com/facebook/docusaurus/edit/master/website/'
         */
        editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
        /**
         * URL route for the docs section of your site.
         * *DO NOT* include a trailing slash.
         * INFO: It is possible to set just `/` for shipping docs without base path.
         */
        routeBasePath: 'docs',
        include: ['**/*.md', '**/*.mdx'], // Extensions to include.
        /**
         * Path to sidebar configuration for showing a list of markdown pages.
         * Warning: will change
         */
        sidebarPath: '',
        /**
         * Theme components used by the docs pages
         */
        docLayoutComponent: '@theme/DocPage',
        docItemComponent: '@theme/DocItem',
        /**
         * Remark and Rehype plugins passed to MDX
         */
        remarkPlugins: [
          /* require('remark-math') */
        ],
        rehypePlugins: [],
        /**
         * Custom Remark and Rehype plugins passed to MDX before
         * the default Docusaurus Remark and Rehype plugins.
         */
        beforeDefaultRemarkPlugins: [],
        beforeDefaultRehypePlugins: [],
        /**
         * Whether to display the author who last updated the doc.
         */
        showLastUpdateAuthor: false,
        /**
         * Whether to display the last date the doc was updated.
         */
        showLastUpdateTime: false,
        /**
         * By default, versioning is enabled on versioned sites.
         * This is a way to explicitly disable the versioning feature.
         */
        disableVersioning: false,
        /**
         * Skip the next release docs when versioning is enabled.
         * This will not generate HTML files in the production build for documents
         * in `/docs/next` directory, only versioned docs.
         */
        excludeNextVersionDocs: false,
        /**
         * The last version is the one we navigate to in priority on versioned sites
         * It is the one displayed by default in docs navbar items
         * By default, the last version is the first one to appear in versions.json
         * By default, the last version is at the "root" (docs have path=/docs/myDoc)
         * Note: it is possible to configure the path and label of the last version
         * Tip: using lastVersion: 'current' make sense in many cases
         */
        lastVersion: undefined,
        /**
         * The docusaurus versioning defaults don't make sense for all projects
         * This gives the ability customize the label and path of each version
         * You may not like that default versin
         */
        versions: {
          /*
          Example configuration: 
          current: {
            label: 'Android SDK v2.0.0 (WIP)',
            path: 'android-2.0.0',
          },
          '1.0.0': {
            label: 'Android SDK v1.0.0',
            path: 'android-1.0.0',
          },
          */
        },
        /**
         * Sometimes you only want to include a subset of all available versions.
         * Tip: limit to 2 or 3 versions to improve startup and build time in dev and deploy previews
         */
        onlyIncludeVersions: undefined, // ex: ["current", "1.0.0", "2.0.0"]
      },
    ],
  ],
};
```
