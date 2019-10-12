---
id: docusaurus.config.js
title: docusaurus.config.js
---

<!--
  Goal: To serve as a manual for all configurations in docusaurus.config.js
  Should keep the titles to themselves for cleaner link
-->

## Overview

`docusaurus.config.js` contains configurations for your site and is placed in the root directory of your site.

## Required fields

### `title`

- Type: `string`

Title is used in a number of places in your site including the title for the web page, headings, etc.

```js
// docusaurus.config.js
module.exports = {
  title: 'Docusaurus',
};
```

### `tagline`

- Type: `string`

Tagline is used in a number of places in your site including the title for the web page, sub headings, etc.

```js
// docusaurus.config.js
module.exports = {
  tagline:
    'Docusaurus makes it easy to maintain Open Source documentation websites.',
};
```

### `favicon`

- Type: `string`

If you use an official template, your site will be generated with the following directory

```bash
.
├── README.md
├ # ... other files in root directory
└─ static
    └── img
        └── favicon.ico
```

And your generated `docusaurus.config.js` will contain this the field for your favicon URL relative to the `static` directory of your site.

```js
// docusaurus.config.js
module.exports = {
  favicon: 'img/favicon.ico',
};
```

**Note**: It does accept external nor absolute url.

### `url`

<!-- TODO: where else is this used other than GH Pages? -->

- Type: `string`

If you use GitHub Pages, this will be the URL for your GitHub Page's user/organization page, commonly https://_username_.github.io.

```js
// docusaurus.config.js
module.exports = {
  url: 'https://docusaurus.io',
};
```

### `baseUrl`

- Type: `string`

Base URL for your project. For projects hosted on GitHub pages, it follows the format "/_projectName_/". For https://github.com/facebook/docusaurus, `baseUrl` is `/docusaurus/`.

```js
// docusaurus.config.js
module.exports = {
  baseUrl: '/',
};
```

## Optional fields

### `organizationName`

- Type: `string`

The GitHub user or organization that owns the repository. Used by the deployment command.

```js
// docusaurus.config.js
module.exports = {
  // Docusaurus's organization is facebook
  organizationName: 'facebook',
};
```

### `projectName`

- Type: `string`

The name of the GitHub repository. Used by the deployment command.

```js
// docusaurus.config.js
module.exports = {
  projectName: 'docusaurus',
};
```

### `githubHost`

- Type: `string`

The hostname of your server. Useful if you are using GitHub Enterprise.

```js
// docusaurus.config.js
module.exports = {
  githubHost: 'github.com',
};
```

### `themeConfig`

- Type: `Object`

<!-- TODO: explain that theme configurations will be consumed by the theme, and link to theme doc -->

An object containing data needed by the theme you use.<!--, see [theme configurations](#).-->

For Docusaurus' default theme _classic_, we use `themeConfig` to customize your navbar and footer links:

```js
// docusaurus.config.js
module.exports = {
  themeConfig: {
    navbar: {
      title: 'Site Title',
      logo: {
        alt: 'Site Logo',
        src: 'img/logo.svg',
      },
      links: [
        {
          to: 'docs/docusaurus.config.js',
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
      copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`,
    },
  },
};
```

### `plugins`

<!-- TODO: configuration for plugins -->

- Type: `any[]`

```js
// docusaurus.config.js
module.exports = {
  plugins: [],
};
```

### `themes`

<!-- TODO: configuration for plugins -->

- Type: `any[]`

```js
// docusaurus.config.js
module.exports = {
  themes: [],
};
```

### `presets`

<!-- TODO: configuration for presets -->

- Type: `any[]`

```js
// docusaurus.config.js
module.exports = {
  presets: [],
};
```

### `customFields`

Docusaurus guards `docusaurus.config.js` from unknown fields. To add a custom field, define it on `customFields`

- Type: `Object`

```jsx
// docusaurus.config.js
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

```js
// docusaurus.config.js
module.exports = {
  scripts: [
    // String format.
    'https://docusaurus.io/script.js',
    // Object format.
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
      async: true,
    },
  ],
};
```

### `stylesheets`

An array of CSS sources to load. The values can be either strings or plain objects of attribute-value maps. The `<link>` tags will be inserted in the HTML `<head>`.

- Type: `(string | Object)[]`

Example:

```js
// docusaurus.config.js
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
