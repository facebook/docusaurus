---
id: configuration
title: Configuration
---

Docusaurus has a unique take on configurations. We encourage you to congregate information of your site into one place. We will guard the fields of this file, and facilitate making this data object accessible across your site.

Keeping a well-maintained `docusaurus.config.js` helps you, your collaborators, and your open source contributors be able to focus on documentation while still being able to customize fields.

## What goes into `docusaurus.config.js`?

You should not have to write your `docusaurus.config.js` from scratch even if you are developing your site. All templates come with a `docusaurus.config.js` at root that includes the necessary data for the initial site.

However, it can be helpful if you have a high-level understanding of how the configurations are designed and implemented.

The high-level overview of Docusaurus configuration can be categorized into:

- [Site Metadata](#site-metadata)
- [Deployment Configurations](#deployment-configurations)
- [Theme, Plugin, and Preset Configurations](#theme-plugin-and-preset-configurations)
- [Custom Configurations](#custom-configurations)

For exact reference to each of the configurable fields, you may refer to [**docusaurus.config.js API reference**](docusaurus.config.js.md).

### Site metadata

Site metadata contains the essential global metadata such as `title`, `url`, `baseUrl` and `favicon`.

They are used in a number of places such as your site's title and headings, browser tab icon, social sharing (Facebook, Twitter) information or even to generate the correct path to serve your static files.

### Deployment configurations

Deployment configurations such as `projectName` and `organizationName` are used when you deploy your site with Docusaurus' `deploy` command.

It is recommended to check the [deployment docs](deployment.md) for more information.

### Theme, plugin, and preset configurations

List the installed [themes](using-themes.md), [plugins](using-plugins.md), and [presets](presets.md) for your site in the `themes`, `plugins`, and `presets` fields, respectively. These are typically npm packages:

```js
// docusaurus.config.js
module.exports = {
  // ...
  plugins: [
    '@docusaurus/plugin-content-blog',
    '@docusaurus/plugin-content-pages',
  ],
  themes: ['@docusaurus/theme-classic'],
};
```

They can also be loaded from local directories:

```js
// docusaurus.config.js
const path = require('path');

module.exports = {
  // ...
  themes: [path.resolve(__dirname, '/path/to/docusaurus-local-theme')],
};
```

To specify options for a plugin or theme, replace the name of the plugin or theme in the config file with an array containing the name and an options object:

```js
// docusaurus.config.js
module.exports = {
  // ...
  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        path: 'blog',
        routeBasePath: 'blog',
        include: ['*.md', '*.mdx'],
        // ...
      },
    ],
    '@docusaurus/plugin-content-pages',
  ],
};
```

To specify options for a plugin or theme that is bundled in a preset, pass the options through the `presets` field. In this example, `docs` refers to `@docusaurus/plugin-content-docs` and `theme` refers to `@docusaurus/theme-classic`.

```js
//docusaurus.config.js
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
```

For further help configuring themes, plugins, and presets, see [Using Themes](using-themes.md), [Using Plugins](using-plugins.md), and [Using Presets](presets.md).

### Custom configurations

Docusaurus guards `docusaurus.config.js` from unknown fields. To add a custom field, define it on `customFields`

Example:

```js {3-6}
// docusaurus.config.js
module.exports = {
  customFields: {
    image: '',
    keywords: [],
  },
};
```

## Accessing configuration from components

Your configuration object will be made available to all the components of your site. And you may access them via React context as `siteConfig`.

Basic Example:

```jsx {2,5-6}
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const Hello = () => {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const {title, tagline} = siteConfig;

  return <div>{`${title} · ${tagline}`}</div>;
};
```

:::tip

If you just want to use those fields on the client side, you could create your own JS files and import them as ES6 modules, there is no need to put them in `docusaurus.config.js`.

:::

## Docs-only mode

You can run your Docusaurus 2 site without a landing page and instead have a page from your documentation as the index page.

Set the `routeBasePath` to indicate that it’s the root path.

**Note**: Make sure there’s no `index.js` page in `src/pages` or there will be two files mapped to the same route!

```js {9}
// docusaurus.config.js
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/', // Set this value to '/'.
        },
      },
    ],
  ],
};
```

You can apply the same principle for blogs with the [Blog-only mode](blog.md#blog-only-mode).
