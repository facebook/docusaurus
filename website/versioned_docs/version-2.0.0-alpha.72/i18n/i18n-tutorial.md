---
id: tutorial
title: i18n - Tutorial
sidebar_label: Tutorial
slug: /i18n/tutorial
---

This tutorial will walk you through the basis of the **Docusaurus i18n system**.

We will add **French** translations to a **newly initialized English Docusaurus website**.

Initialize a new site with `npx @docusaurus/init@latest init website classic` (like [this one](https://github.com/facebook/docusaurus/tree/master/examples/classic)).

## Configure your site {#configure-your-site}

Modify `docusaurus.config.js` to add the i18n support for the French language.

### Site configuration {#site-configuration}

Use the [site i18n configuration](./../api/docusaurus.config.js.md#i18n) to declare the i18n locales:

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

### Theme configuration {#theme-configuration}

Add a **navbar item** of type `localeDropdown` so that users can select the locale they want:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'localeDropdown',
          position: 'left',
        },
        // highlight-end
      ],
    },
  },
};
```

### Start your site {#start-your-site}

Start your localized site in dev mode, using the locale of your choice:

```bash npm2yarn
npm run start -- --locale fr
```

Your site is accessible at **`http://localhost:3000/fr/`**.

We haven't provided any translation, and the site is **mostly untranslated**.

:::tip

Docusaurus provides **default translations** for generic theme labels, such as "Next" and "Previous" for the pagination.

Please help us complete those **[default translations](https://github.com/facebook/docusaurus/tree/master/packages/docusaurus-theme-classic/codeTranslations)**.

:::

:::caution

Each locale is a **distinct standalone single-page-application**: it is not possible to start the Docusaurus sites in all locales at the same time.

:::

## Translate your site {#translate-your-site}

The French translations will be added in `website/i18n/fr`.

Docusaurus is modular, and each content plugin has its own subfolder.

:::note

After copying files around, restart your site with `npm run start -- --locale fr`.

Hot-reload will work better when editing existing files.

:::

### Use the translation APIs {#use-the-translation-apis}

Open the homepage, and use the [translation APIs](../docusaurus-core.md#translate):

```jsx title="src/pages/index.js"
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

// highlight-start
import Translate, {translate} from '@docusaurus/Translate';
// highlight-end

export default function Home() {
  return (
    <Layout>
      <h1>
        {/* highlight-start */}
        <Translate>Welcome to my website</Translate>
        {/* highlight-end */}
      </h1>
      <main>
        {/* highlight-start */}
        <Translate
          id="homepage.visitMyBlog"
          description="The homepage message to ask the user to visit my blog"
          values={{blog: <Link to="https://docusaurus.io/blog">blog</Link>}}>
          {'You can also visit my {blog}'}
        </Translate>
        {/* highlight-end */}

        <input
          type="text"
          placeholder={
            // highlight-start
            translate({
              message: 'Hello',
              description: 'The homepage input placeholder',
            })
            // highlight-end
          }
        />
      </main>
    </Layout>
  );
}
```

:::caution

Docusaurus provides a **very small and lightweight translation runtime** on purpose, and only supports basic [placeholders interpolation](../docusaurus-core.md#interpolate), using a subset of the [ICU Message Format](https://formatjs.io/docs/core-concepts/icu-syntax/).

Most documentation websites are generally **static** and don't need advanced i18n features (**plurals**, **genders**, etc.). Use a library like [react-intl](https://www.npmjs.com/package/react-intl) for more advanced use-cases.

:::

### Translate JSON files {#translate-json-files}

JSON translation files are used for everything that is not contained in a Markdown document:

- React/JSX code
- Layout navbar and footer labels
- Docs sidebar category labels
- ...

Run the [write-translations](../cli.md#docusaurus-write-translations) command:

```bash npm2yarn
npm run write-translations -- --locale fr
```

It will extract and initialize the JSON translation files that you need to translate.

The homepage translations are statically extracted from React source code:

```json title="i18n/fr/code.json"
{
  "Welcome to my website": {
    "message": "Welcome to my website",
    "description": "The homepage welcome message"
  },
  "Hello": {
    "message": "Hello",
    "description": "The homepage input placeholder"
  }
}
```

Plugins and themes will also write their own **JSON translation files**, such as:

```json title="i18n/fr/docusaurus-theme-classic/navbar.json"
{
  "title": {
    "message": "My Site",
    "description": "The title in the navbar"
  },
  "item.label.Docs": {
    "message": "Docs",
    "description": "Navbar item with label Docs"
  },
  "item.label.Blog": {
    "message": "Blog",
    "description": "Navbar item with label Blog"
  },
  "item.label.GitHub": {
    "message": "GitHub",
    "description": "Navbar item with label GitHub"
  }
}
```

Translate the `message` attribute in the JSON files of `i18n/fr`, and your site layout and homepage should now be translated.

### Translate Markdown files {#translate-markdown-files}

Official Docusaurus content plugins extensively use Markdown/MDX files, and allow you to translate them.

#### Translate the docs {#translate-the-docs}

Copy your docs Markdown files to `i18n/fr/docusaurus-plugin-content-docs/current`, and translate them:

```bash
mkdir -p i18n/fr/docusaurus-plugin-content-docs/current
cp -r docs/** i18n/fr/docusaurus-plugin-content-docs/current
```

:::info

`current` is needed for the docs versioning feature: each docs version has its own subfolder.

:::

#### Translate the blog {#translate-the-blog}

Copy your blog Markdown files to `i18n/fr/docusaurus-plugin-content-blog`, and translate them:

```bash
mkdir -p i18n/fr/docusaurus-plugin-content-blog
cp -r blog/** i18n/fr/docusaurus-plugin-content-blog
```

#### Translate the pages {#translate-the-pages}

Copy your pages Markdown files to `i18n/fr/docusaurus-plugin-content-pages`, and translate them:

```bash
mkdir -p i18n/fr/docusaurus-plugin-content-pages
cp -r pages/**.md i18n/fr/docusaurus-plugin-content-pages
cp -r pages/**.mdx i18n/fr/docusaurus-plugin-content-pages
```

:::caution

We only copy `.md` and `.mdx` files, as pages React components are translated through JSON translation files already.

:::

### Use explicit heading ids {#use-explicit-heading-ids}

By default, a Markdown heading `### Hello World` will have a generated id `hello-world`.

Other documents can target it with `[link](#hello-world)`.

The translated heading becomes `### Bonjour le Monde`, with id `bonjour-le-monde`.

Generated ids are not always a good fit for localized sites, as it requires you to localize all the anchor links:

```diff
- [link](#hello-world).
+ [link](#bonjour-le-monde)
```

:::tip

For localized sites, it is recommended to use **[explicit heading ids](../guides/markdown-features/markdown-features-headings.mdx#explicit-ids)**.

:::

## Deploy your site {#deploy-your-site}

You can choose to deploy your site under a **single domain**, or use **multiple (sub)domains**.

### Single-domain deployment {#single-domain-deployment}

Run the following command:

```bash npm2yarn
npm run build
```

Docusaurus will build **one single-page application per locale**:

- `website/build`: for the default, English language
- `website/build/fr`: for the French language

You can now [deploy](../deployment.mdx) the `build` folder to the static hosting solution of your choice.

:::note

The Docusaurus v2 website use this strategy:

- [https://docusaurus.io](https://docusaurus.io)
- [https://docusaurus.io/fr](https://docusaurus.io/fr)

:::

:::tip

Static hosting providers generally redirect `/unknown/urls` to `/404.html` by convention, always showing an **English 404 page**.

**Localize your 404 pages** by configuring your host to redirect `/fr/*` to `/fr/404.html`.

This is not always possible, and depends on your host: GitHub Pages can't do this, [Netlify](https://docs.netlify.com/routing/redirects/redirect-options/#custom-404-page-handling) can.

:::

### Multi-domain deployment {#multi-domain-deployment}

You can also build your site for a single locale:

```bash npm2yarn
npm run build -- --locale fr
```

Docusaurus will not add the `/fr/` URL prefix.

On your [static hosting provider](../deployment.mdx):

- create one deployment per locale
- configure the appropriate build command, using the `--locale` option
- configure the (sub)domain of your choice for each deployment

:::caution

This strategy is **not possible** with Github Pages, as it is only possible to **have a single deployment**.

:::

### Hybrid {#hybrid}

It is possible to have some locales using sub-paths, and others using subdomains.

It is also possible to deploy each locale as a separate subdomain, assemble the subdomains in a single unified domain at the CDN level:

- Deploy your site as `fr.docusaurus.io`
- Configure a CDN to serve it from `docusaurus.io/fr`
