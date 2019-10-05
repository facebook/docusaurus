---
id: using-plugins
title: Using Plugins
description: A plugin is a package that exports a class which can be instantiated with configurable options (provided by the user) and its various lifecycle methods will be invoked by the Docusaurus runtime.
---

Plugins are the building blocks which add features to a Docusaurus 2 site. Each plugin handles its own individual feature. Plugins may work be bundled together and distributed via [presets](advanced-presets.md).

Docusaurus 2 provides a few essential plugins such as [Google Analytics](advanced-plugins.md#docusaurusplugin-google-analytics) and [Sitemap](advanced-plugins.md#docusaurusplugin-sitemap). You may also write your own plugins for customized features.

In this doc, we talk about how to use plugins with Docusaurus' official plugins. To learn about the design implementation and how to write your own plugins, check out [Advanced Guides: Plugins](advanced-plugins.md).

## Installing a plugin

A plugin is an npm package, so you install them like other npm packages using npm.

```bash
npm install --save docusaurus-plugin-name
```

Then you add it in your site's `docusaurus.config.js`'s `plugins` option:

```jsx
// docusaurus.config.js
module.exports = {
  plugins: ['@docusaurus/plugin-content-pages'],
};
```

Docusaurus can also load plugins from your local directory, you can do something like the following:

```jsx
// docusaurus.config.js
const path = require('path');

module.exports = {
  plugins: [path.resolve(__dirname, '/path/to/docusaurus-local-plugin')],
};
```

## Configuring plugins

To use a plugin, add the plugin to the `plugins` field of your `docusaurus.config.js`.

For the most basic usage of plugins, you can providing just the plugin name or the absolute path to the plugin. For plugins that require options, specify the plugin as an array where the first value is the plugin name/path and second value is an options object, e.g. `['plugin-name', { path: 'foo/bar' }]` array.

```js
// docusaurus.config.js
module.exports = {
  plugins: [
    // Basic usage.
    '@docusaurus/plugin-google-analytics',

    // With options object.
    [
      '@docusaurus/plugin-sitemap',
      {
        cacheTime: 600 * 1000,
      },
    ],
  ],
};
```

## Passing options to Docusaurus plugins via preset

If you initialized your site using the classic template, you do not have to specify plugin options individually in your `docusaurus.config.js`. To provide the neccesary fields to certain plugins, i.e. `customCss` for `@docusaurus/theme-classic`, pass them in the preset field, like this:

```js
// docusaurus.config.js
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // Will be passed to @docusaurus/theme-classic.
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        ...
      },
    ],
  ],
};
```

## Official plugins by Docusaurus

Docusaurus' classic template is scaffolded with the classic preset, which includes the following official plugins. You may read more about the configurations of these plugins in our [Advanced Guides: Plugins](advanced-plugins.md).

- [@docusaurus/plugin-content-blog](https://github.com/facebook/docusaurus/tree/master/packages/docusaurus-plugin-content-blog)
- [@docusaurus/plugin-content-docs](https://github.com/facebook/docusaurus/tree/master/packages/docusaurus-plugin-content-docs-legacy)
- [@docusaurus/plugin-content-pages](https://github.com/facebook/docusaurus/tree/master/packages/docusaurus-plugin-content-pages)
- [@docusaurus/plugin-google-analytics](https://github.com/facebook/docusaurus/tree/master/packages/docusaurus-plugin-google-analytics)
- [@docusaurus/plugin-google-gtag](https://github.com/facebook/docusaurus/tree/master/packages/docusaurus-plugin-google-gtag)
- [@docusaurus/plugin-sitemap](https://github.com/facebook/docusaurus/tree/master/packages/docusaurus-plugin-sitemap)
- [@docusaurus/plugin-ideal-image](https://github.com/facebook/docusaurus/tree/master/packages/docusaurus-plugin-ideal-image)
