---
title: Translate your site
---

In this page we would cover translate .md files. We are going to translate the
`Getting Started` page in the `Docusaurus Tutorial section` to French - "fr".

### Site Configuration
Use the [site i18n configuration](https://v2.docusaurus.io/docs/next/docusaurus.config.js#i18n) to add the fr locale"

```js title="docusaurus.config.js"
module.exports = {
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
};
```

### Translate the page
To Transte the `getting-started.md` page, copy `docs/getting-started.md` to `i18n/fr/plugin-docs/getting-started.md`. Replace the content in the i118n  folder with the French locale content.


### Start your site
Start your localized site in dev mode, using the fr local.

```bash 
npm run start -- --locale fr
```

Your site is accessible at **`http://localhost:3000/fr/`**.
