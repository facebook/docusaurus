---
id: introduction
title: i18n introduction
sidebar_label: Introduction
slug: /i18n/introduction
---

It is possible to translate a Docusaurus website through its internationalization support (abbreviated as [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization)).

:::caution

i18n is a new feature (released early 2021), please report any bug you find.

:::

## Goals

This section should help you understand the design decisions behind the Docusaurus i18n support.

For more context, you can read the initial [RFC](https://github.com/facebook/docusaurus/issues/3317) and [PR](https://github.com/facebook/docusaurus/pull/3325).

### i18n goals

The goals of the Docusaurus i18n system are:

- **Simple**: just put the translated files in the correct file-system location.

- **Flexible translation workflows**: based on Git (monorepo, forks or submodules), SaaS software, FTP...

- **Flexible deployment options**: single domain (`docusaurus.io/fr`), or multiple domains (`fr.docusaurus.io` or `docusaurus.fr`).

- **Modular**: allow plugin author to provide i18n support

- **Low-overhead runtime**: static json/markdown content does not require a heavy i18n JS library.

- **Acceptable build-times**: allow building and deploying localized sites independently.

- **Localize assets**: an image of your site might contain text that should be translated.

- **No coupling**: not forced to use any SaaS, yet the integration is possible.

- **Easy to use with [Crowdin](http://crowdin.com/)**: multiple Docusaurus v1 sites use Crowdin, and should be able to migrate to v2.

### i18n goals (TODO)

Features that are **not yet implemented**:

- **Good SEO defaults**: setting useful html meta headers like `hreflang` for you.

- **RTL support**: one locale should not be harder to use than another.

- **Contextual translations**: reduce friction to contribute to the translation effort.

- **Anchor links**: linking should not break when you localize headings.

### i18n non-goals

- **Support automatic locale detection/redirection**: a Docusaurus site can be deployed to any simple static hosting solution.

- **Support for any translation SaaS software**: we provide integration documentation for some translation SaaS like Crowdin, but in the end you have to read the documentation of the external tools to understand them, and contact their support if you need help. These are living software with their own releases, bugs and very advanced features.

- **Support translation of page slugs**: it is technically complicated, for little SEO value.

## Translation workflow

### Overview

Overview of the workflow to create a translated Docusaurus website:

- **Configure**: declare the default locale and alternative locales in `docusaurus.config.js`
- **Translate**: put the translated files at the correct file-system location
- **Deploy**: build and deploy your site using the strategy of your choice

### Translated files

You will have to work with 2 kind of translated files.

#### Markdown files

This is the main content of your Docusaurus website.

Markdown and MDX documents are translated as a whole, to fully preserve the translation context, instead of splitting each sentance as a separate string.

#### JSON files

JSON is used to translate:

- your React code: using the `<Translate>` component
- your theme: the navbar, footer...
- your plugins: the docs sidebar category labels...

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

- **Description attribute**: to help translators with additional context.
- **Widely supported**: [Chrome extensions](https://developer.chrome.com/docs/extensions/mv2/i18n-messages/), [Crowdin](https://support.crowdin.com/file-formats/chrome-json/), [Transifex](https://docs.transifex.com/formats/chrome-json), [Phrase](https://help.phrase.com/help/chrome-json-messages), [Applanga](https://www.applanga.com/docs/formats/chrome_i18n_json)...
