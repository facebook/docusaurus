---
id: themes-overview
title: 'Docusaurus themes'
sidebar_label: Themes overview
slug: '/api/themes'
---

We provide official Docusaurus themes.

## Main themes {#main-themes}

The main themes implement the user interface for the [docs](../plugins/plugin-content-docs.md), [blog](../plugins/plugin-content-blog.md) and [pages](../plugins/plugin-content-pages.md) plugins.

- [@docusaurus/theme-classic](./theme-classic.md)
- [@docusaurus/theme-bootstrap](./theme-bootstrap.md) 🚧

:::caution

The goal is to have all themes share the exact same features, user-experience and configuration.

Only the UI design and underlying styling framework should change, and you should be able to change theme easily.

We are not there yet: only the classic theme is production ready.

:::

## Enhancement themes {#enhancement-themes}

These themes will enhance the existing main themes with additional user-interface related features.

- [@docusaurus/theme-live-codeblock](./theme-live-codeblock.md)
- [@docusaurus/theme-search-algolia](./theme-search-algolia.md)
