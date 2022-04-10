# Using Plugins

**The Docusaurus core doesn't provide any feature of its own.** All features are delegated to individual plugins: the [docs](./guides/docs/docs-introduction.md) feature provided by the [docs plugin](./api/plugins/plugin-content-docs.md); the [blog](./blog.mdx) feature provided by the [blog plugin](./api/plugins/plugin-content-blog.md); or individual [pages](./guides/creating-pages.md) provided by the [pages plugin](./api/plugins/plugin-content-pages.md). If there are no plugins installed, the site won't contain any routes.

You may not need to install common plugins one-by-one though: they can be distributed as a bundle in a [preset](#using-presets). For most users, plugins are configured through the preset configuration.

We maintain a [list of official plugins](./api/plugins/overview.md), but the community has also created some [unofficial plugins](/community/resources#community-plugins). If you want to add any feature: autogenerating doc pages, executing custom scripts, integrating other services... be sure to check out the list: someone may have implemented it for you!

If you are feeling energetic, you can also read [the plugin guide](./advanced/plugins.md) or [plugin method references](./api/plugin-methods/README.md) for how to make a plugin yourself.

## Installing a plugin {#installing-a-plugin}

A plugin is usually an npm package, so you install them like other npm packages using npm.

```bash npm2yarn
npm install --save docusaurus-plugin-name
```

Then you add it in your site's `docusaurus.config.js`'s `plugins` option:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  // highlight-next-line
  plugins: ['@docusaurus/plugin-content-pages'],
};
```

Docusaurus can also load plugins from your local directory, with something like the following:

```js title="docusaurus.config.js"
const path = require('path');

module.exports = {
  // ...
  // highlight-next-line
  plugins: [path.resolve(__dirname, '/path/to/docusaurus-local-plugin')],
};
```

## Configuring plugins {#configuring-plugins}

For the most basic usage of plugins, you can provide just the plugin name or the absolute path to the plugin.

However, plugins can have options specified by wrapping the name and an options object in a two-member tuple inside your config. This style is usually called "Babel Style".

```js title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: [
    // highlight-start
    [
      '@docusaurus/plugin-xxx',
      {
        /* options */
      },
    ],
    // highlight-end
  ],
};
```

Example:

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    // Basic usage.
    '@docusaurus/plugin-debug',

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

All Docusaurus content plugins can support multiple plugin instances. For example, it may be useful to have [multiple docs plugin instances](./guides/docs/docs-multi-instance.mdx) or [multiple blogs](./blog.mdx#multiple-blogs). It is required to assign a unique id to each plugin instance, and by default, the plugin id is `default`.

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        // highlight-next-line
        id: 'docs-1',
        // other options
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        // highlight-next-line
        id: 'docs-2',
        // other options
      },
    ],
  ],
};
```

:::note

At most one plugin instance can be the "default plugin instance", by omitting the `id` attribute, or using `id: 'default'`.

:::

## Using themes {#using-themes}

Themes are loaded in the exact same way as plugins—the line between them is blurry. From the consumer perspective, the `themes` and `plugins` entries are interchangeable when installing and configuring a plugin. The only nuance is that themes are loaded after plugins, and it's possible for [a theme to override a plugin's default theme components](./swizzling.md#theme-aliases).

:::tip

The `themes` and `plugins` options lead to different [shorthand resolutions](#module-shorthands), so if you want to take advantage of shorthands, be sure to use the right entry!

:::

```js title="docusaurus.config.js"
module.exports = {
  // ...
  // highlight-next-line
  themes: ['@docusaurus/theme-classic', '@docusaurus/theme-live-codeblock'],
};
```

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
  presets: [path.resolve(__dirname, '/path/to/docusaurus-local-preset')],
};
```

Presets are a shorthand function to add plugins and themes to your Docusaurus config. For example, you can specify a preset that includes the following themes and plugins:

```js title="/path/to/docusaurus-local-preset"
module.exports = function preset(context, opts = {}) {
  return {
    themes: [['docusaurus-theme-awesome', opts.theme]],
    plugins: [
      // Using three docs plugins at the same time!
      // Assigning a unique ID for each without asking the user to do it
      ['@docusaurus/plugin-content-docs', {...opts.docs1, id: 'docs1'}],
      ['@docusaurus/plugin-content-docs', {...opts.docs2, id: 'docs2'}],
      ['@docusaurus/plugin-content-docs', {...opts.docs3, id: 'docs3'}],
    ],
  };
};
```

then in your Docusaurus config, you may configure the preset instead:

```js title="docusaurus.config.js"
module.exports = {
  presets: [
    // highlight-start
    [
      path.resolve(__dirname, '/path/to/docusaurus-local-preset'),
      {
        theme: {hello: 'world'},
        docs1: {path: '/docs'},
        docs2: {path: '/community'},
        docs3: {path: '/api'},
      },
    ],
    // highlight-end
  ],
};
```

This is equivalent of doing:

```js title="docusaurus.config.js"
module.exports = {
  themes: [['docusaurus-theme-awesome', {hello: 'world'}]],
  plugins: [
    ['@docusaurus/plugin-content-docs', {id: 'docs1', path: '/docs'}],
    ['@docusaurus/plugin-content-docs', {id: 'docs2', path: '/community'}],
    ['@docusaurus/plugin-content-docs', {id: 'docs3', path: '/api'}],
  ],
};
```

This is especially useful when some plugins and themes are intended to be used together. You can even link their options together, e.g. pass one option to multiple plugins.

### `@docusaurus/preset-classic` {#docusauruspreset-classic}

The classic preset is shipped by default to new Docusaurus website created with [`create-docusaurus`](./installation.md#scaffold-project-website). It is a set of plugins and themes.

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

## Module shorthands {#module-shorthands}

Docusaurus supports shorthands for plugins, themes, and presets. When it sees a plugin / theme / preset name, it tries to load one of the following, in that order:

- `[name]`
- `@docusaurus/[moduleType]-[name]`
- `docusaurus-[moduleType]-[name]`,

where `moduleType` is one of `'preset'`, `'theme'`, `'plugin'`, depending on which field the module name is declared in. The first module name that's successfully found is loaded.

If the name is scoped (beginning with `@`), the name is first split into scope and package name by the first slash:

```
@scope
^----^
 scope  (no name!)

@scope/awesome
^----^ ^-----^
 scope   name

@scope/awesome/main
^----^ ^----------^
 scope     name
```

If the name is not specified, `{scope}/docusaurus-{type}` is loaded. Otherwise, the following are attempted:

- `[scope]/[name]`
- `[scope]/docusaurus-[moduleType]-[name]`

Below are some examples, for a plugin registered in the `plugins` field. Note that unlike [ESLint](https://eslint.org/docs/user-guide/configuring/plugins#configuring-plugins) or [Babel](https://babeljs.io/docs/en/options#name-normalization) where a consistent naming convention for plugins is mandated, Docusaurus permits greater naming freedom, so the resolutions are not certain, but follows the priority defined above.

| Declaration | May be resolved as |
| --- | --- |
| `awesome` | `docusaurus-plugin-awesome` |
| `sitemap` | [`@docusaurus/plugin-sitemap`](./api/plugins/plugin-sitemap.md) |
| `@my-company` | `@my-company/docusaurus-plugin` (the only possible resolution!) |
| `@my-company/awesome` | `@my-company/docusaurus-plugin-awesome` |
| `@my-company/awesome/web` | `@my-company/docusaurus-plugin-awesome/web` |
