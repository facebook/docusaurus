---
id: using-plugins
title: Using Plugins
---

<!-- A plugin is a package that exports a class which can be instantiated with configurable options (provided by the user) and its various lifecycle methods will be invoked by the Docusaurus runtime. -->

Plugins are the building blocks for Docusaurus 2 sites' features. Each plugin handles its own individual feature. Plugins may work together as [presets](./presets.md).

Docusaurus 2 provides a few essential plugins such as [sitemap](#docusaurus-plugin-content-sitemap), [analytics](#docusaurus-plugin-content-analytics). And you may write your own plugins for customized features.

In this doc, we talk about how to use plugins with Docusaurus' official plugins. To learn about the design implementation and how to write your own plugins, check out [Advanced Guides: Plugins](./plugins.md). For API reference, check out [API Reference: Plugins]('./plugins-api.md).

## Using plugins

To use a plugin, add the plugin to the `plugins` field of your `docusaurus.config.js`.

For some plugins, providing just the plugin name is sufficient. For plugins that require options, specify the plugin in a `['plugin-name', options]` array.

```js
// docusaurus.config.js
module.exports = {
  plugins: [
    '@docusaurus/plugin-google-analytics',
    ['@docusaurus/plugin-sitemap', opts.sitemap],
  ],
};
```

## Passing options to Docusaurus plugins

Docusaurus' classic template is scaffolded with the classic preset, which in turn includes the following official plugins. You may read more about the configurations of these plugins in our [Advanced Guides: Plugins](./plugins.md).

- `@docusaurus/plugin-content-blog`
- `@docusaurus/plugin-content-docs`
- `@docusaurus/plugin-content-pages`
- `@docusaurus/plugin-content-analytics`
- `@docusaurus/plugin-content-gtag`
- `@docusaurus/plugin-content-sitemap`

If you initialized your site using the classic template, you do not have to specify them individually in your `docusaurus.config.js`. To provide the neccesary fields to certain plugins, i.e. `trackingID` of `@docusaurus/plugin-content-analytics`, pass them in the preset field.

```js
// docusaurus.config.js
module.exports = {
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
        googleAnalytics: {
          trackingID: 'UA-000000-2',
        },
      },
    ],
  ],
};
```
