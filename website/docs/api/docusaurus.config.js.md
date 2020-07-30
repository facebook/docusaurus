---
id: docusaurus.config.js
title: docusaurus.config.js
description: API reference for Docusaurus configuration file.
slug: /docusaurus.config.js
---

## Overview

`docusaurus.config.js` contains configurations for your site and is placed in the root directory of your site.

## Required fields

### `title`

- Type: `string`

Title for your website.

```js title="docusaurus.config.js"
module.exports = {
  title: 'Docusaurus',
};
```

### `favicon`

- Type: `string`

URL for site favicon. Example:

```js title="docusaurus.config.js"
module.exports = {
  favicon: 'https://v2.docusaurus.io/favicon.ico',
};
```

You can also use the favicon URL relative to the `static` directory of your site. For example, your site has the following directory structure:

```bash
.
├── README.md
├ # ... other files in root directory
└─ static
    └── img
        └── favicon.ico
```

So you can refer it like below:

```js title="docusaurus.config.js"
module.exports = {
  favicon: 'img/favicon.ico',
};
```

### `url`

- Type: `string`

URL for your website. This can also be considered the top-level hostname. For example, `https://facebook.github.io` is the URL of https://facebook.github.io/metro/, and `https://docusaurus.io` is the URL for https://docusaurus.io. This field is related to the [baseUrl](#baseurl) field.

```js title="docusaurus.config.js"
module.exports = {
  url: 'https://docusaurus.io',
};
```

### `baseUrl`

- Type: `string`

Base URL for your site. This can also be considered the path after the host. For example, `/metro/` is the baseUrl of https://facebook.github.io/metro/. For URLs that have no path, the baseUrl should be set to `/`. This field is related to the [url](#url) field.

```js title="docusaurus.config.js"
module.exports = {
  baseUrl: '/',
};
```

## Optional fields

### `onBrokenLinks`

- Type: `'ignore' | 'log' | 'error' | 'throw'`

The behavior of Docusaurus, when it detects any broken link.

By default, it throws an error, to ensure you never ship any broken link, but you can lower this security if needed.

:::note

The broken links detection is only available for a production build (`docusaurus build`).

:::

### `onDuplicateRoutes`

- Type: `'ignore' | 'log' | 'warn' | 'throw'`

The behavior of Docusaurus when it detects any [duplicate routes](/guides/creating-pages.md#duplicate-routes).

By default, it displays warning after you run `yarn start` or `yarn build`.

### `tagline`

- Type: `string`

The tagline for your website.

```js title="docusaurus.config.js"
module.exports = {
  tagline:
    'Docusaurus makes it easy to maintain Open Source documentation websites.',
};
```

### `organizationName`

- Type: `string`

The GitHub user or organization that owns the repository. Used by the deployment command.

```js title="docusaurus.config.js"
module.exports = {
  // Docusaurus' organization is facebook
  organizationName: 'facebook',
};
```

### `projectName`

- Type: `string`

The name of the GitHub repository. Used by the deployment command.

```js title="docusaurus.config.js"
module.exports = {
  projectName: 'docusaurus',
};
```

### `githubHost`

- Type: `string`

The hostname of your server. Useful if you are using GitHub Enterprise.

```js title="docusaurus.config.js"
module.exports = {
  githubHost: 'github.com',
};
```

### `themeConfig`

- Type: `Object`

<!-- TODO: explain that theme configurations will be consumed by the theme, and link to theme doc -->

An object containing data needed by the theme you use.<!--, see [theme configurations](#).-->

For Docusaurus' default theme _classic_, we use `themeConfig` to customize your navbar and footer links:

Example:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      title: 'Site Title',
      logo: {
        alt: 'Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/docusaurus.config.js',
          activeBasePath: 'docs',
          label: 'docusaurus.config.js',
          position: 'left',
        },
        // ... other links
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: 'docs/doc1',
            },
          ],
        },
        // ... other links
      ],
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'https://docusaurus.io/img/oss_logo.png',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`, // You can also put own HTML here
    },
  },
};
```

### `plugins`

<!-- TODO: configuration for plugins -->

- Type: `any[]`

```js title="docusaurus.config.js"
module.exports = {
  plugins: [],
};
```

### `themes`

<!-- TODO: configuration for plugins -->

- Type: `any[]`

```js title="docusaurus.config.js"
module.exports = {
  themes: [],
};
```

### `presets`

<!-- TODO: configuration for presets -->

- Type: `any[]`

```js title="docusaurus.config.js"
module.exports = {
  presets: [],
};
```

### `customFields`

Docusaurus guards `docusaurus.config.js` from unknown fields. To add a custom field, define it on `customFields`.

- Type: `Object`

```js title="docusaurus.config.js"
module.exports = {
  customFields: {
    admin: 'endi',
    superman: 'lol',
  },
};
```

Attempting to add unknown field in the config will lead to error in build time:

```bash
Error: The field(s) 'foo', 'bar' are not recognized in docusaurus.config.js
```

### `scripts`

An array of scripts to load. The values can be either strings or plain objects of attribute-value maps. The `<script>` tags will be inserted in the HTML `<head>`.

Note that `<script>` added here are render-blocking so you might want to add `async: true`/`defer: true` to the objects.

- Type: `(string | Object)[]`

Example:

```js title="docusaurus.config.js"
module.exports = {
  scripts: [
    // String format.
    'https://docusaurus.io/script.js',
    // Object format.
    {
      src:
        'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
      async: true,
    },
  ],
};
```

### `stylesheets`

An array of CSS sources to load. The values can be either strings or plain objects of attribute-value maps. The `<link>` tags will be inserted in the HTML `<head>`.

- Type: `(string | Object)[]`

Example:

```js title="docusaurus.config.js"
module.exports = {
  stylesheets: [
    // String format.
    'https://docusaurus.io/style.css',
    // Object format.
    {
      href: 'http://mydomain.com/style.css',
      type: 'text/css',
    },
  ],
};
```
