---
id: tutorial
title: i18n tutorial
sidebar_label: Tutorial
slug: /i18n/tutorial
---

This tutorial will walk you through the translation of a new Docusaurus website (initialized with `npx @docusaurus/init@latest init my-website classic`, like [this one](https://github.com/facebook/docusaurus/tree/master/examples/classic)).

## Configuration

Declare the locales and their respective configuration:

```js title="docusaurus.config.js"
module.exports = {
  title: 'Docusaurus',
  // ...
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      fr: {
        label: 'Français',
      },
    },
  },
  // ..
};
```

TODO link to ref api for exhaustive list of option and move underlying note

:::note

We will add more configuration options in the future.

:::

## Translate
