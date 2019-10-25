---
id: presets
title: Presets
---

Presets are collections of plugins and themes.

## Using Presets

A preset is usually a npm package, so you install them like other npm packages using npm.

```bash
npm install --save docusaurus-preset-name
```

Then you add it in your site's `docusaurus.config.js`'s `presets` option:

```jsx
// docusaurus.config.js
module.exports = {
  presets: ['@docusaurus/preset-xxxx'],
};
```

You can also load presets from your local directory, you can do something like the following:

```jsx
// docusaurus.config.js
const path = require('path');

module.exports = {
  presets: [path.resolve(__dirname, '/path/to/docusaurus-local-presets')],
};
```

## Presets -> Themes and Plugins

Presets in some way is a shorthand function to add plugins and themes to your docusaurus config. For example, a presets that is defined like this:

```js
module.exports = function preset(context, opts = {}) {
  return {
    themes: ['@docusaurus/themes-cool', '@docusaurus/themes-bootstrap'],
    plugins: ['@docusaurus/plugin-blog'],
  };
};
```

And added like this in docusaurus config:

```jsx
// docusaurus.config.js
module.exports = {
  presets: ['@docusaurus/preset-a'],
};
```

Is just an equivalent thing of doing

```jsx
// docusaurus.config.js
module.exports = {
  themes: ['@docusaurus/themes-cool', '@docusaurus/themes-bootstrap'],
  plugins: ['@docusaurus/plugin-blog'],
};
```

## Official Presets

### `@docusaurus/preset-classic`

The classic preset that is usually shipped by default to new docusaurus website. It is a set of plugins and themes.

| Themes | Plugins |
| --- | --- |
| @docusaurus/theme-classic | @docusaurus/plugin-content-docs |
| @docusaurus/theme-search-algolia | @docusaurus/plugin-content-blog |
| | @docusaurus/plugin-content-pages |
|  | @docusaurus/plugin-google-analytics |
| | @docusaurus/plugin-google-gtag |
|  | @docusaurus/plugin-sitemap |

To specify plugin options individually, you can provide the neccesary fields to certain plugins, i.e. `customCss` for `@docusaurus/theme-classic`, pass them in the preset field, like this:

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
        // Will be passed to @docusaurus/plugin-content-docs
        docs: {},
        // Will be passed to @docusaurus/plugin-content-blog
        blog: {},
        // Will be passed to @docusaurus/plugin-content-pages
        pages: {},
        // Will be passed to @docusaurus/plugin-content-sitemap
        sitemap: {},
      },
    ],
  ],
};
```

<!--

Advanced guide on using and configuring presets

References
---
- [classic themes](/packages/docusaurus-preset-classic/src/index.js)
- [babel docs on presets](https://babeljs.io/docs/en/presets)

-->
