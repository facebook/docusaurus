---
id: using-plugins
title: Plugins
---

Plugins are the building blocks of features in a Docusaurus 2 site. Each plugin handles its own individual feature. Plugins may work and be distributed as part of a bundle via [presets](presets.md).

## Available plugins {#available-plugins}

We maintain a [list of official plugins](./api/plugins/overview.md), but the community has also created some [unofficial plugins](/community/resources#community-plugins).

## Installing a plugin {#installing-a-plugin}

A plugin is usually an npm package, so you install them like other npm packages using npm.

```bash npm2yarn
npm install --save docusaurus-plugin-name
```

Then you add it in your site's `docusaurus.config.js`'s `plugins` option:

```jsx {3} title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: ['@docusaurus/plugin-content-pages'],
};
```

Docusaurus can also load plugins from your local directory, you can do something like the following:

```jsx {5} title="docusaurus.config.js"
const path = require('path');

module.exports = {
  // ...
  plugins: [path.resolve(__dirname, '/path/to/docusaurus-local-plugin')],
};
```

## Configuring plugins {#configuring-plugins}

For the most basic usage of plugins, you can provide just the plugin name or the absolute path to the plugin.

However, plugins can have options specified by wrapping the name and an options object in an array inside your config. This style is usually called `Babel Style`.

```js {4-9} title="docusaurus.config.js"
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

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    // Basic usage.
    '@docusaurus/plugin-google-analytics',

    // With options object (babel style)
    [
      '@docusaurus/plugin-sitemap',
      {
        changefreq: 'weekly',
      },
    ],
  ],
};
```

## Multi-instance plugins and plugin ids {#multi-instance-plugins-and-plugin-ids}

All Docusaurus content plugins can support multiple plugin instances.

The Docs plugin has [additional multi-instance documentation](./guides/docs/docs-multi-instance.mdx)

It is required to assign a unique id to each plugin instance.

By default, the plugin id is `default`.

```js {6,13} title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-xxx',
      {
        id: 'plugin-xxx-1',
        // other options
      },
    ],
    [
      '@docusaurus/plugin-xxx',
      {
        id: 'plugin-xxx-2',
        // other options
      },
    ],
  ],
};
```

:::note

At most one plugin instance can be the "default plugin instance", by omitting the `id` attribute, or using `id: 'default'`.

:::

## Plugins design {#plugins-design}

Docusaurus' implementation of the plugins system provides us with a convenient way to hook into the website's lifecycle to modify what goes on during development/build, which involves (but is not limited to) extending the webpack config, modifying the data loaded, and creating new components to be used in a page.

## Creating plugins {#creating-plugins}

A plugin is a function that takes two parameters: `context` and `options`. It returns a plugin instance object (or a promise). You can create plugins as functions or modules. For more information, refer to the [plugin method references section](./api/plugin-methods/README.md).

### Functional definition {#functional-definition}

You can use a plugin as a function directly included in the Docusaurus config file:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: [
    // highlight-start
    async function myPlugin(context, options) {
      // ...
      return {
        name: 'my-plugin',
        async loadContent() {
          // ...
        },
        async contentLoaded({content, actions}) {
          // ...
        },
        /* other lifecycle API */
      };
    },
    // highlight-end
  ],
};
```

### Module definition {#module-definition}

You can use a plugin as a module path referencing a separate file or NPM package:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: [
    // without options:
    './my-plugin',
    // or with options:
    ['./my-plugin', options],
  ],
};
```

Then in the folder `my-plugin`, you can create an `index.js` such as this:

```js title="my-plugin.js"
module.exports = async function myPlugin(context, options) {
  // ...
  return {
    name: 'my-plugin',
    async loadContent() {
      /* ... */
    },
    async contentLoaded({content, actions}) {
      /* ... */
    },
    /* other lifecycle API */
  };
};
```
