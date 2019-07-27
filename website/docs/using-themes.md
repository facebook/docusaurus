---
id: using-themes
title: Using Themes
---

In Docusaurus 2, themes are there to finish the build step of your site by supplying the components used by your site, your plugins, and the themes themselves. Furthermore, you may easily swap out components from themes by _swizzling_ them with your own components.

In this document, we discuss the basic usages of themes. You will learn how to use a theme and how to swizzle a component. To grasp a deeper understanding of themes, and / or to learn how you may implement your own themes, check out our [advanced guide on themes](advanced-themes.md).

## Using themes

To use themes, specify the themes in your `docusaurus.config.js`. You may use multiple themes:

```js
// docusaurus.config.js
module.exports = {
  themes: ['@docusaurus/theme-classic', '@docusaurus/theme-live-codeblock'],
};
```

## Swizzling theme components

Themes are all about components. Docusaurus Themes' components are designed to be easily replaceable. We created a command for you to replace the components called `swizzle`.

To swizzle a component for a theme, run the following command in your doc site:

```shell
$ docusaurus swizzle [theme name] [component name]
```

As an example, to swizzle the `<Footer />` component in `@docusaurus/theme-classic` for your site, run:

```shell
$ npm swizzle @docusaurus/theme-classic Footer
```

This will copy the current `<Footer />` component used by the theme to a `theme/Footer` directory under the root of your site, which is where Docusaurus will look for swizzled components. Docusaurus will then use swizzled component in place of the original one from the theme.

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
