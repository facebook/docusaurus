---
id: using-themes
title: Themes
---

Like plugins, themes are designed to add functionality to your Docusaurus site. As a good rule of thumb, themes are mostly focused on client-side, where plugins are more focused on server-side functionalities. Themes are also designed to be replace-able with other themes.

## Using themes

To use themes, specify the themes in your `docusaurus.config.js`. You may use multiple themes:

```js {3} title="docusaurus.config.js"
module.exports = {
  // ...
  themes: ['@docusaurus/theme-classic', '@docusaurus/theme-live-codeblock'],
};
```

## Theme components

Most of the time, theme is used to provide a set of React components, e.g. `Navbar`, `Layout`, `Footer`.

Users can use these components in their code by importing them using the `@theme` webpack alias:

```js
import Navbar from '@theme/Navbar';
```

The alias `@theme` can refer to a few directories, in the following priority:

1. A user's `website/src/theme` directory, which is a special directory that has the higher precedence.
1. A Docusaurus theme packages's `theme` directory.
1. Fallback components provided by Docusaurus core (usually not needed).

Given the following structure

```
website
├── node_modules
│   └── docusaurus-theme
│       └── theme
│           └── Navbar.js
└── src
    └── theme
        └── Navbar.js
```

`website/src/theme/Navbar.js` takes precedence whenever `@theme/Navbar` is imported. This behavior is called component swizzling. In iOS, method swizzling is the process of changing the implementation of an existing selector (method). In the context of a website, component swizzling means providing an alternative component that takes precedence over the component provided by the theme.

**Themes are for providing UI components to present the content.** Most content plugins need to be paired with a theme in order to be actually useful. The UI is a separate layer from the data schema, so it makes it easy to swap out the themes for other designs (i.e., Bootstrap).

For example, a Docusaurus blog consists of a blog plugin and a blog theme.

```js title="docusaurus.config.js"
{
  theme: ['theme-blog'],
  plugins: ['plugin-content-blog'],
}
```

And if you want to use Bootstrap styling, you can swap out the theme with `theme-blog-bootstrap` (fictitious non-existing theme):

```js title="docusaurus.config.js"
{
  theme: ['theme-blog-bootstrap'],
  plugins: ['plugin-content-blog'],
}
```

The content plugin remains the same and the only thing you need to change is the theme.

## Swizzling theme components

:::caution

We would like to discourage swizzling of components until we've minimally reached a Beta stage. The components APIs have been changing rapidly and are likely to keep changing until we reach Beta. Stick with the default appearance for now if possible to save yourself some potential pain in future.

:::

Docusaurus Themes' components are designed to be replaceable. To make it easier for you, we created a command for you to replace theme components called `swizzle`.

To swizzle a component for a theme, run the following command in your doc site:

```shell
docusaurus swizzle <theme name> [component name]
```

As an example, to swizzle the `<Footer />` component in `@docusaurus/theme-classic` for your site, run:

```bash npm2yarn
npm run swizzle @docusaurus/theme-classic Footer
```

This will copy the current `<Footer />` component used by the theme to a `src/theme/Footer` directory under the root of your site, which is where Docusaurus will look for swizzled components. Docusaurus will then use swizzled component in place of the original one from the theme.

Although we highly discourage swizzling of all components, if you wish to do that, run:

```bash npm2yarn
npm run swizzle @docusaurus/theme-classic
```

**Note**: You need to restart your webpack dev server in order for Docusaurus to know about the new component.

## Official themes by Docusaurus

### `@docusaurus/theme-classic`

The classic theme for Docusaurus. You can refer to [classic theme configuration](theme-classic.md) for more details on the configuration.

```bash npm2yarn
npm install --save @docusaurus/theme-classic
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency.

:::

### `@docusaurus/theme-bootstrap`

The bootstrap theme for Docusaurus. You can refer to [bootstrap theme configuration](theme-bootstrap.md) for more details on the configuration.

```bash npm2yarn
npm install --save @docusaurus/theme-bootstrap
```

:::tip

If you have installed `@docusaurus/preset-bootstrap`, you don't need to install it as a dependency.

:::

:::caution

This theme is a work in progress.

:::

### `@docusaurus/theme-search-algolia`

This theme provides a `@theme/SearchBar` component that integrates with Algolia DocSearch easily. Combined with `@docusaurus/theme-classic`, it provides a very easy search integration. You can read more on [search](search.md) documentation.

```bash npm2yarn
npm install --save @docusaurus/theme-search-algolia
```

This theme also adds search page available at `/search` path with OpenSearch support.

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency.

:::

### `@docusaurus/theme-live-codeblock`

This theme provides a `@theme/CodeBlock` component that is powered by react-live. You can read more on [interactive code editor](markdown-features.mdx#interactive-code-editor) documentation.

```bash npm2yarn
npm install --save @docusaurus/theme-live-codeblock
```

## Themes design

While themes share the exact same lifecycle methods with plugins, their implementations can look very different from those of plugins based on themes' designed objectives.

Themes are designed to complete the build of your Docusaurus site and supply the components used by your site, plugins, and the themes themselves. So a typical theme implementation would look like a `src/index.js` file that hooks it up to the lifecycle methods. Most likely they would not use `loadContent`, which plugins would use. And it is typically accompanied by a `src/theme` directory full of components.

To summarize:

- Themes share the same lifecycle methods with Plugins
- Themes are run after all existing Plugins
- Themes exist to add component aliases by extending the webpack config

## Writing customized Docusaurus themes

A Docusaurus theme normally includes an `index.js` file where you hook up to the lifecycle methods, alongside with a `theme/` directory of components. A typical Docusaurus `theme` folder looks like this:

```shell {5-7}
website
├── package.json
└── src
    ├── index.js
    └── theme
        ├── MyThemeComponent
        └── AnotherThemeComponent.js
```

There are two lifecycle methods that are essential to theme implementation:

- [`getThemePath()`](lifecycle-apis.md#getthemepath)
- [`getClientModules()`](lifecycle-apis.md#getclientmodules)

These lifecycle method are not essential but recommended:

- [`validateThemeConfig({themeConfig, validate})`](lifecycle-apis.md#validatethemeconfigthemeconfig-validate)
- [`validateOptions({options, validate})`](lifecycle-apis.md#validateoptionsoptions-validate)

<!--

Outline
---
High-level overview about themes:
- how to use a theme
- how to pass theme configurations
- how to swizzle components and the power of it

Related pieces
---

- [Advanced Guides – Themes](using-themes.md)
- [Lifecycle APIs](lifecycle-apis.md)

References
---
- [themes RFC](https://github.com/facebook/docusaurus/issues/1438)
- [how classic template uses themes](/packages/docusaurus/templates/classic/docusaurus.config.js)
- [using plugins doc](using-plugins.md)
- [vuepress docs on themes](https://v1.vuepress.vuejs.org/theme/)

-->
