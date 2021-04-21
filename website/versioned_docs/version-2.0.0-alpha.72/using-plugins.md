---
id: using-plugins
title: Plugins
---

Plugins are the building blocks of features in a Docusaurus 2 site. Each plugin handles its own individual feature. Plugins may work and be distributed as part of bundle via [presets](presets.md).

## Available plugins {#available-plugins}

We maintain a [list of official plugins](./api/plugins/overview.md), but the community has also created some [unofficial plugins](/community/resources#community-plugins).

## Installing a plugin {#installing-a-plugin}

A plugin is usually a npm package, so you install them like other npm packages using npm.

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

Docusaurus' implementation of the plugins system provides us with a convenient way to hook into the website's lifecycle to modify what goes on during development/build, which involves (but not limited to) extending the webpack config, modifying the data being loaded and creating new components to be used in a page.

## Creating plugins {#creating-plugins}

A plugin is a module which exports a function that takes two parameters and returns an object when executed.

### Module definition {#module-definition}

The exported modules for plugins are called with two parameters: `context` and `options` and returns a JavaScript object with defining the [lifecycle APIs](./lifecycle-apis.md).

For example if you have a reference to a local folder such as this in your `docusaurus.config.js`:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: [path.resolve(__dirname, 'my-plugin')],
};
```

Then in the folder `my-plugin` you can create an index.js such as this

```js title="index.js"
module.exports = function (context, options) {
  // ...
  return {
    name: 'my-docusaurus-plugin',
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

The `my-plugin` folder could also be a fully fledged package with it's own package.json and a `src/index.js` file for example

#### `context` {#context}

`context` is plugin-agnostic and the same object will be passed into all plugins used for a Docusaurus website. The `context` object contains the following fields:

```ts
interface LoadContext {
  siteDir: string;
  generatedFilesDir: string;
  siteConfig: DocusaurusConfig;
  outDir: string;
  baseUrl: string;
}
```

#### `options` {#options}

`options` are the [second optional parameter when the plugins are used](using-plugins.md#configuring-plugins). `options` are plugin-specific and are specified by users when they use them in `docusaurus.config.js`. Alternatively, if preset contains the plugin, the preset will then be in charge of passing the correct options into the plugin. It is up to individual plugin to define what options it takes.

#### Return value {#return-value}

The returned object value should implement the [lifecycle APIs](lifecycle-apis.md).
