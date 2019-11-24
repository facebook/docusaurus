---
id: using-plugins
title: Plugins
sidebar_label: Introduction
---

Plugins are the building blocks of features in a Docusaurus 2 site. Each plugin handles its own individual feature. Plugins may work and be distributed as part of bundle via [presets](presets.md).

In this doc, we talk about how to use plugins with Docusaurus' official plugins. To learn about the design implementation and how to write your own plugins, check out [Advanced Guides: Plugins](advanced-plugins.md).

## Installing a plugin

A plugin is usually a npm package, so you install them like other npm packages using npm.

```bash
npm install --save docusaurus-plugin-name
```

Then you add it in your site's `docusaurus.config.js`'s `plugins` option:

```jsx {4}
// docusaurus.config.js
module.exports = {
  // ...
  plugins: ['@docusaurus/plugin-content-pages'],
};
```

Docusaurus can also load plugins from your local directory, you can do something like the following:

```jsx {6}
// docusaurus.config.js
const path = require('path');

module.exports = {
  // ...
  plugins: [path.resolve(__dirname, '/path/to/docusaurus-local-plugin')],
};
```

## Configuring plugins

For the most basic usage of plugins, you can provide just the plugin name or the absolute path to the plugin.

However, plugins can have options specified by wrapping the name and an options object in an array inside your config. This style is usually called `Babel Style`.

```js {5-10}
// docusaurus.config.js
module.exports = {
  // ...
  plugins: [
    [
      '@docusaurus/plugin-xxx',
      {
        /* options */
      },
    ],
  ],
};
```

Example:

```js
// docusaurus.config.js
module.exports = {
  plugins: [
    // Basic usage.
    '@docusaurus/plugin-google-analytics',

    // With options object (babel style)
    [
      '@docusaurus/plugin-sitemap',
      {
        cacheTime: 600 * 1000,
      },
    ],
  ],
};
```
