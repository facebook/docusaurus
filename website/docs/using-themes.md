---
id: using-themes
title: Themes
sidebar_label: Introduction
---

Like plugins, themes are designed to add functionality to your Docusaurus site. As a good rule of thumb, themes are mostly focused on client-side, where plugins are more focused on server-side functionalities. Themes are also designed to be easily replace-able with other themes.

## Using themes

To use themes, specify the themes in your `docusaurus.config.js`. You may use multiple themes:

```js {4}
// docusaurus.config.js
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

```js
// docusaurus.config.js
{
  theme: ['theme-blog'],
  plugins: ['plugin-content-blog'],
}
```

and if you want to use Bootstrap styling, you can swap out the theme with `theme-blog-bootstrap` (fictitious non-existing theme):

```js
// docusaurus.config.js
{
  theme: ['theme-blog-bootstrap'],
  plugins: ['plugin-content-blog'],
}
```

The content plugin remains the same and the only thing you need to change is the theme.

## Swizzling theme components

Docusaurus Themes' components are designed to be easily replaceable. To make it easier for you, we created a command for you to replace theme components called `swizzle`.

To swizzle a component for a theme, run the following command in your doc site:

```shell
$ docusaurus swizzle [theme name] [component name]
```

As an example, to swizzle the `<Footer />` component in `@docusaurus/theme-classic` for your site, run:

```shell
$ npm swizzle @docusaurus/theme-classic Footer
```

This will copy the current `<Footer />` component used by the theme to a `src/theme/Footer` directory under the root of your site, which is where Docusaurus will look for swizzled components. Docusaurus will then use swizzled component in place of the original one from the theme.

**Note**: You need to restart your dev server for Docusaurus to pick up the new component.

## Official themes by Docusaurus

- [@docusaurus/theme-classic](https://github.com/facebook/docusaurus/tree/master/packages/docusaurus-theme-classic)
- [@docusaurus/theme-search-algolia](https://github.com/facebook/docusaurus/tree/master/packages/docusaurus-theme-search-algolia)
- [@docusaurus/theme-live-codeblock](https://github.com/facebook/docusaurus/tree/master/packages/docusaurus-theme-live-codeblock)

<!--

Outline
---
High-level overview about themes:
- how to use a theme
- how to pass theme configurations
- how to swizzle components and the power of it

Related pieces
---

- [Advanced Guides – Themes](advanced-themes.md)
- [Lifecycle APIs](lifecycle-apis.md)

References
---
- [themes RFC](https://github.com/facebook/docusaurus/issues/1438)
- [how classic template uses themes](/packages/docusaurus/templates/classic/docusaurus.config.js)
- [using plugins doc](using-plugins.md)
- [vuepress docs on themes](https://v1.vuepress.vuejs.org/theme/)

-->
