---
id: plugin-content-docs
title: '📦 plugin-content-docs'
slug: '/api/plugins/@docusaurus/plugin-content-docs'
---

Provides the [Docs](../../guides/docs/docs-introduction.md) functionality and is the default docs plugin for Docusaurus.

## Installation {#installation}

```bash npm2yarn
npm install --save @docusaurus/plugin-content-docs
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency. You can also configure it through the [classic preset options](presets.md#docusauruspreset-classic) instead of doing it like below.

:::

## Configuration {#configuration}

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
         * Base url to edit your site.
         * Docusaurus will compute the final editUrl with "editUrl + relativeDocPath"
         */
        editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
        /**
         * For advanced cases, compute the edit url for each markdown file yourself.
         */
        editUrl: function ({
          locale,
          version,
          versionDocsDirPath,
          docPath,
          permalink,
        }) {
          return `https://github.com/facebook/docusaurus/edit/master/website/${versionDocsDirPath}/${docPath}`;
        },
        /**
         * Useful if you commit localized files to git.
         * When markdown files are localized, the edit url will target the localized file,
         * instead of the original unlocalized file.
         * Note: this option is ignored when editUrl is a function
         */
        editLocalizedFiles: false,
        /**
         * Useful if you don't want users to submit doc pull-requests to older versions.
         * When docs are versioned, the edit url will link to the doc
         * in current version, instead of the versioned doc.
         * Note: this option is ignored when editUrl is a function
         */
        editCurrentVersion: false,
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
         * You may not like that default version
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

## Markdown Frontmatter {#markdown-frontmatter}

Markdown documents can use the following markdown frontmatter metadata fields, enclosed by a line `---` on either side:

- `id`: A unique document id. If this field is not present, the document's `id` will default to its file name (without the extension)
- `title`: The title of your document. If this field is not present, the document's `title` will default to its `id`
- `hide_title`: Whether to hide the title at the top of the doc. By default it is `false`
- `hide_table_of_contents`: Whether to hide the table of contents to the right. By default it is `false`
- `sidebar_label`: The text shown in the document sidebar and in the next/previous button for this document. If this field is not present, the document's `sidebar_label` will default to its `title`
- `custom_edit_url`: The URL for editing this document. If this field is not present, the document's edit URL will fall back to `editUrl` from options fields passed to `docusaurus-plugin-content-docs`
- `keywords`: Keywords meta tag for the document page, for search engines
- `description`: The description of your document, which will become the `<meta name="description" content="..."/>` and `<meta property="og:description" content="..."/>` in `<head>`, used by search engines. If this field is not present, it will default to the first line of the contents
- `image`: Cover or thumbnail image that will be used when displaying the link to your post
- `slug`: Allows to customize the document url

Example:

```yml
---
id: doc-markdown
title: Markdown Features
hide_title: false
hide_table_of_contents: false
sidebar_label: Markdown :)
custom_edit_url: https://github.com/facebook/docusaurus/edit/master/docs/api-doc-markdown.md
description: How do I find you when I cannot solve this problem
keywords:
  - docs
  - docusaurus
image: https://i.imgur.com/mErPwqL.png
slug: /myDoc
---
My Document Markdown content
```

## i18n {#i18n}

Read the [i18n introduction](../../i18n/i18n-introduction.md) first.

### Translation files location {#translation-files-location}

- **Base path**: `website/i18n/<locale>/docusaurus-plugin-content-docs`
- **Multi-instance path**: `website/i18n/<locale>/docusaurus-plugin-content-docs-<pluginId>`
- **JSON files**: extracted with [`docusaurus write-translations`](../../cli.md#docusaurus-write-translations)
- **Markdown files**: `website/i18n/<locale>/docusaurus-plugin-content-docs/<version>`

### Example file-system structure {#example-file-system-structure}

```bash
website/i18n/<locale>/docusaurus-plugin-content-docs
│
│ # translations for website/docs
├── current
│   ├── api
│   │   └── config.md
│   └── getting-started.md
├── current.json
│
│ # translations for website/versioned_docs/version-1.0.0
├── version-1.0.0
│   ├── api
│   │   └── config.md
│   └── getting-started.md
└── version-1.0.0.json
```
