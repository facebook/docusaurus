---
id: advanced-themes
title: Themes
---

Under the hood, Themes are plugins with exactly the same lifecycle methods, but most likely they would not use `loadContent`. They exist to add component aliases by extending the webpack config. And they are run after all existing plugins.

<!--

Advanced guide on:
- customizing themes
- creating your own themes
- swizzling components

Related pieces
---
- [Guides – Themes](using-themes.md)
- [API - Themes](api-themes.md)

References
---
- [classic themes](packages/docusaurus-theme-classic/src/index.js)
- [using plugins doc](using-plugins.md)
- [vuepress docs on themes](https://v1.vuepress.vuejs.org/theme/)

-->
