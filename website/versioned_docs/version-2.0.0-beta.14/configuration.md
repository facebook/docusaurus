---
id: configuration
title: Configuration
---

import TOCInline from '@theme/TOCInline';

Docusaurus has a unique take on configurations. We encourage you to congregate information of your site into one place. We guard the fields of this file, and facilitate making this data object accessible across your site.

Keeping a well-maintained `docusaurus.config.js` helps you, your collaborators, and your open source contributors be able to focus on documentation while still being able to customize the site.

## What goes into a `docusaurus.config.js`? {#what-goes-into-a-docusaurusconfigjs}

You should not have to write your `docusaurus.config.js` from scratch even if you are developing your site. All templates come with a `docusaurus.config.js` that includes defaults for the common options.

However, it can be helpful if you have a high-level understanding of how the configurations are designed and implemented.

The high-level overview of Docusaurus configuration can be categorized into:

<TOCInline toc={toc} minHeadingLevel={3} maxHeadingLevel={3} />

For exact reference to each of the configurable fields, you may refer to [**`docusaurus.config.js` API reference**](api/docusaurus.config.js.md).

### Site metadata {#site-metadata}

Site metadata contains the essential global metadata such as `title`, `url`, `baseUrl` and `favicon`.

They are used in a number of places such as your site's title and headings, browser tab icon, social sharing (Facebook, Twitter) information or even to generate the correct path to serve your static files.

### Deployment configurations {#deployment-configurations}

Deployment configurations such as `projectName`, `organizationName`, and optionally `deploymentBranch` are used when you deploy your site with the `deploy` command.

It is recommended to check the [deployment docs](deployment.mdx) for more information.

### Theme, plugin, and preset configurations {#theme-plugin-and-preset-configurations}

List the [theme](using-themes.md), [plugins](using-plugins.md), and [presets](presets.md) for your site in the `themes`, `plugins`, and `presets` fields, respectively. These are typically npm packages:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: [
    '@docusaurus/plugin-content-blog',
    '@docusaurus/plugin-content-pages',
  ],
  themes: ['@docusaurus/theme-classic'],
};
```

:::tip

Docusaurus supports **module shorthands**, allowing you to simplify the above configuration as:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: ['content-blog', 'content-pages'],
  themes: ['classic'],
};
```

<details>

<summary>How are shorthands resolved?</summary>

When it sees a plugin / theme / preset name, it tries to load one of the following, in that order:

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

- `{scope}/{name}`
- `{scope}/docusaurus-{type}-{name}`

Below are some examples, for a plugin registered in the `plugins` field. Note that unlike [ESLint](https://eslint.org/docs/user-guide/configuring/plugins#configuring-plugins) or [Babel](https://babeljs.io/docs/en/options#name-normalization) where a consistent naming convention for plugins is mandated, Docusaurus permits greater naming freedom, so the resolutions are not certain, but follows the priority defined above.

| Declaration | May be resolved as |
| --- | --- |
| `awesome` | `docusaurus-plugin-awesome` |
| `sitemap` | [`@docusaurus/plugin-sitemap`](./api/plugins/plugin-sitemap.md) |
| `@mycompany` | `@mycompany/docusaurus-plugin` (the only possible resolution!) |
| `@mycompany/awesome` | `@mycompany/docusaurus-plugin-awesome` |
| `@mycompany/awesome/web` | `@mycompany/docusaurus-plugin-awesome/web` |

</details>

:::

They can also be loaded from local directories:

```js title="docusaurus.config.js"
const path = require('path');

module.exports = {
  // ...
  themes: [path.resolve(__dirname, '/path/to/docusaurus-local-theme')],
};
```

To specify options for a plugin or theme, replace the name of the plugin or theme in the config file with an array containing the name and an options object:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: [
    [
      'content-blog',
      {
        path: 'blog',
        routeBasePath: 'blog',
        include: ['*.md', '*.mdx'],
        // ...
      },
    ],
    'content-pages',
  ],
};
```

To specify options for a plugin or theme that is bundled in a preset, pass the options through the `presets` field. In this example, `docs` refers to `@docusaurus/plugin-content-docs` and `theme` refers to `@docusaurus/theme-classic`.

```js title="docusaurus.config.js"
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
          customCss: [require.resolve('./src/css/custom.css')],
        },
      },
    ],
  ],
};
```

:::tip

The `presets: [['classic', {...}]]` shorthand works as well.

:::

For further help configuring themes, plugins, and presets, see [Using Themes](using-themes.md), [Using Plugins](using-plugins.md), and [Using Presets](presets.md).

### Custom configurations {#custom-configurations}

Docusaurus guards `docusaurus.config.js` from unknown fields. To add custom fields, define them in `customFields`.

Example:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  // highlight-start
  customFields: {
    image: '',
    keywords: [],
  },
  // highlight-end
  // ...
};
```

## Accessing configuration from components {#accessing-configuration-from-components}

Your configuration object will be made available to all the components of your site. And you may access them via React context as `siteConfig`.

Basic example:

```jsx
import React from 'react';
// highlight-next-line
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const Hello = () => {
  // highlight-start
  const {siteConfig} = useDocusaurusContext();
  // highlight-end
  const {title, tagline} = siteConfig;

  return <div>{`${title} · ${tagline}`}</div>;
};
```

:::tip

If you just want to use those fields on the client side, you could create your own JS files and import them as ES6 modules, there is no need to put them in `docusaurus.config.js`.

:::

## Customizing Babel Configuration {#customizing-babel-configuration}

For new Docusaurus projects, we automatically generated a `babel.config.js` in project root.

```js title="babel.config.js"
module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
};
```

Most of the times, this configuration will work just fine. If you want to customize it, you can directly edit this file to customize babel configuration. For your changes to take effect, you need to restart Docusaurus devserver.
