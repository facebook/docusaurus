---
id: presets
title: Presets
---

Presets are collections of plugins and themes.

## Using presets {#using-presets}

A preset is usually an npm package, so you install them like other npm packages using npm.

```bash npm2yarn
npm install --save @docusaurus/preset-classic
```

Then, add it in your site's `docusaurus.config.js`'s `presets` option:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  // highlight-next-line
  presets: ['@docusaurus/preset-classic'],
};
```

To load presets from your local directory, specify how to resolve them:

```js title="docusaurus.config.js"
const path = require('path');

module.exports = {
  // ...
  // highlight-next-line
  presets: [path.resolve(__dirname, '/path/to/docusaurus-local-presets')],
};
```

## Presets -> themes and plugins {#presets---themes-and-plugins}

Presets are a shorthand function to add plugins and themes to your Docusaurus config. For example, you can specify a preset that includes the following themes and plugins,

```js
module.exports = function preset(context, opts = {}) {
  return {
    themes: ['@docusaurus/theme-cool', opts.cool],
    plugins: ['@docusaurus/plugin-blog', opts.blog],
  };
};
```

then in your Docusaurus config, you may configure the preset instead:

```js title="docusaurus.config.js"
module.exports = {
  presets: [
    // highlight-start
    [
      '@docusaurus/preset-my-own',
      {cool: {hello: 'world'}, blog: {path: '/blog'}},
    ],
    // highlight-end
  ],
};
```

This is equivalent of doing:

```js title="docusaurus.config.js"
module.exports = {
  themes: ['@docusaurus/themes-cool', {hello: 'world'}],
  plugins: ['@docusaurus/plugin-blog', {path: '/blog'}],
};
```

This is especially useful when some plugins and themes are intended to be used together.

## Official presets {#official-presets}

### `@docusaurus/preset-classic` {#docusauruspreset-classic}

The classic preset that is usually shipped by default to new Docusaurus website. It is a set of plugins and themes.

| Themes | Plugins |
| --- | --- |
| [`@docusaurus/theme-classic`](./api/themes/theme-configuration.md) | [`@docusaurus/plugin-content-docs`](./api/plugins/plugin-content-docs.md) |
| [`@docusaurus/theme-search-algolia`](./api/themes/theme-search-algolia.md) | [`@docusaurus/plugin-content-blog`](./api/plugins/plugin-content-blog.md) |
|  | [`@docusaurus/plugin-content-pages`](./api/plugins/plugin-content-pages.md) |
|  | [`@docusaurus/plugin-debug`](./api/plugins/plugin-debug.md) |
|  | [`@docusaurus/plugin-google-analytics`](./api/plugins/plugin-google-analytics.md) |
|  | [`@docusaurus/plugin-google-gtag`](./api/plugins/plugin-google-gtag.md) |
|  | [`@docusaurus/plugin-sitemap`](./api/plugins/plugin-sitemap.md) |

To specify plugin options individually, you can provide the necessary fields to certain plugins, i.e. `customCss` for `@docusaurus/theme-classic`, pass them in the preset field, like this:

```js title="docusaurus.config.js"
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // Debug defaults to true in dev, false in prod
        debug: undefined,
        // Will be passed to @docusaurus/theme-classic.
        theme: {
          customCss: [require.resolve('./src/css/custom.css')],
        },
        // Will be passed to @docusaurus/plugin-content-docs (false to disable)
        docs: {},
        // Will be passed to @docusaurus/plugin-content-blog (false to disable)
        blog: {},
        // Will be passed to @docusaurus/plugin-content-pages (false to disable)
        pages: {},
        // Will be passed to @docusaurus/plugin-content-sitemap (false to disable)
        sitemap: {},
        // Will be passed to @docusaurus/plugin-google-gtag (only enabled when explicitly specified)
        gtag: {},
        // Will be passed to @docusaurus/plugin-google-analytics (only enabled when explicitly specified)
        googleAnalytics: {},
      },
    ],
  ],
};
```

In addition to these plugins and themes, `@docusaurus/theme-classic` adds [`remark-admonitions`](https://github.com/elviswolcott/remark-admonitions) as a remark plugin to `@docusaurus/plugin-content-blog` and `@docusaurus/plugin-content-docs`.

The `admonitions` key will be passed as the [options](https://github.com/elviswolcott/remark-admonitions#options) to `remark-admonitions`. Passing `false` will prevent the plugin from being added to MDX.

```js title="docusaurus.config.js"
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // options for remark-admonitions
          admonitions: {},
        },
      },
    ],
  ],
};
```
