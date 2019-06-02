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

```ts
interface DocusaurusConfig {
  baseUrl: string;
  favicon: string;
  tagline: string;
  title: string;
  url: string;

  organizationName?: string;
  projectName?: string;
  githubHost?: string;

  plugins?: any[];
  presets?: any[];
  themeConfig?: {
    [key: string]: any;
  };

  customFields?: string[];
  [key: string]: any;
}
```

## Required fields

### `title`

- Type: `string`

Title is used in a number of places in your site including the title for the web page, major headings, etc.

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

If you use an official template, your site will be generated with the following directory, and your generated `docusaurus.config.js` will contain this field `favicon: 'img/favicon.ico'`.

```bash
.
├── README.md
├ # ... other files in root directory
└─ static
    └── img
        └── favicon.ico
```

Favicon URL relative to the `static` directory of your site.

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

The GitHub user or organization that owns the repository. If you are the owner, it is your GitHub username. In the case of Docusaurus, it is "_facebook_" which is the GitHub organization that owns Docusaurus.

```js
// docusaurus.config.js
module.exports = {
  organizationName: 'facebook',
};
```

### `projectName`

- Type: `string`

The name of the GitHub repository. For example, the repository name for Docusaurus is "docusaurus", so the project name is "docusaurus".

```js
// docusaurus.config.js
module.exports = {
  projectName: 'docusaurus',
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
        {to: 'blog', label: 'Blog', position: 'right'},
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
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

- Type: `any[]`

```js
// docusaurus.config.js
module.exports = {
  plugins: [],
};
```

### `presets`

- Type: `any[]`

<!-- TODO: explain that preset configurations will be used to define presets of the site, and link to doc -->

```js
// docusaurus.config.js
module.exports = {
  presets: [],
};
```

### `customFields`

- Type: `string[]`

```js
// docusaurus.config.js
module.exports = {
  customFields: ['seo'],
  seo: // ... the actual custom field
};
```
