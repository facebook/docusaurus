---
id: introduction
title: i18n - Introduction
sidebar_label: Introduction
slug: /i18n/introduction
---

It is **easy to translate a Docusaurus website** with its internationalization ([i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization)) support.

:::caution

i18n is a new feature (released early 2021), please report any bug you find.

:::

:::caution

i18n requires Node 13+ to build or Node 12 with [full-icu](https://www.npmjs.com/package/full-icu).

:::

## Goals {#goals}

It is important to understand the **design decisions** behind the Docusaurus i18n support.

For more context, you can read the initial [RFC](https://github.com/facebook/docusaurus/issues/3317) and [PR](https://github.com/facebook/docusaurus/pull/3325).

### i18n goals {#i18n-goals}

The goals of the Docusaurus i18n system are:

- **Simple**: just put the translated files in the correct file-system location
- **Flexible translation workflows**: based on Git (monorepo, forks or submodules), SaaS software, FTP
- **Flexible deployment options**: single or multiple domains
- **Modular**: allow plugin author to provide i18n support
- **Low-overhead runtime**: documentation is mostly static and does not require a heavy JS library or polyfills
- **Acceptable build-times**: allow building and deploying localized sites independently
- **Localize assets**: an image of your site might contain text that should be translated
- **No coupling**: not forced to use any SaaS, yet the integration is possible
- **Easy to use with [Crowdin](https://crowdin.com/)**: multiple Docusaurus v1 sites use Crowdin, and should be able to migrate to v2
- **Good SEO defaults**: setting useful SEO headers like [`hreflang`](https://developers.google.com/search/docs/advanced/crawling/localized-versions) for you
- **RTL support**: locales reading right-to-left (Arabic, Hebrew, etc.) should be easy to use
- **Default translations**: classic theme labels are translated for you in [many languages](https://github.com/facebook/docusaurus/tree/master/packages/docusaurus-theme-classic/codeTranslations).

### i18n non-goals {#i18n-non-goals}

We don't provide support for:

- **Automatic locale detection**: opinionated, and best done on the [server](../deployment.mdx)
- **Translation SaaS software**: you are responsible to understand the external tools of your choice
- **Translation of slugs**: technically complicated, little SEO value

## Translation workflow {#translation-workflow}

### Overview {#overview}

Overview of the workflow to create a translated Docusaurus website:

- **Configure**: declare the default locale and alternative locales in `docusaurus.config.js`
- **Translate**: put the translation files at the correct file-system location
- **Deploy**: build and deploy your site using a single or multi-domain strategy

### Translation files {#translation-files}

You will have to work with 2 kind of translation files.

#### Markdown files {#markdown-files}

This is the main content of your Docusaurus website.

Markdown and MDX documents are translated as a whole, to fully preserve the translation context, instead of splitting each sentence as a separate string.

#### JSON files {#json-files}

JSON is used to translate:

- your React code: using the `<Translate>` component
- your theme: the navbar, footer
- your plugins: the docs sidebar category labels

The JSON format used is called **Chrome i18n**:

```json
{
  "myTranslationKey1": {
    "message": "Translated message 1",
    "description": "myTranslationKey1 is used on the homepage"
  },
  "myTranslationKey2": {
    "message": "Translated message 2",
    "description": "myTranslationKey2 is used on the FAQ page"
  }
}
```

The choice was made for 2 reasons:

- **Description attribute**: to help translators with additional context
- **Widely supported**: [Chrome extensions](https://developer.chrome.com/docs/extensions/mv2/i18n-messages/), [Crowdin](https://support.crowdin.com/file-formats/chrome-json/), [Transifex](https://docs.transifex.com/formats/chrome-json), [Phrase](https://help.phrase.com/help/chrome-json-messages), [Applanga](https://www.applanga.com/docs/formats/chrome_i18n_json)

### Translation files location {#translation-files-location}

The translation files should be created at the correct file-system location.

Each locale and plugin has its own `i18n` subfolder:

```
website/i18n/<locale>/<pluginName>/...
```

:::note

For multi-instance plugins, the path is `website/i18n/<locale>/<pluginName>-<pluginId>/...`.

:::

Translating a very simple Docusaurus site in French would lead to the following tree:

```bash
website/i18n
└── fr
    ├── code.json
    │
    ├── docusaurus-plugin-content-blog
    │   └── 2020-01-01-hello.md
    │
    ├── docusaurus-plugin-content-docs
    │   ├── current #
    │   │   ├── doc1.md
    │   │   └── doc2.mdx
    │   └── current.json
    │
    └── docusaurus-theme-classic
        ├── footer.json
        └── navbar.json
```

The JSON files are initialized with the [`docusaurus write-translations`](../cli.md#docusaurus-write-translations) CLI command.

The `code.json` file is extracted from React components using the `<Translate>` API.

:::info

Notice that the `docusaurus-plugin-content-docs` plugin has a `current` subfolder and a `current.json` file, useful for the **docs versioning feature**.

:::

Each content plugin or theme is different, and **define its own translation files location**:

- [Docs i18n](../api/plugins/plugin-content-docs.md#i18n)
- [Blog i18n](../api/plugins/plugin-content-blog.md#i18n)
- [Pages i18n](../api/plugins/plugin-content-pages.md#i18n)
- [Themes i18n](../api/themes/theme-configuration.md#i18n)
