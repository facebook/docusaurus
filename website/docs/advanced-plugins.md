---
id: advanced-plugins
title: Plugins
---

In this doc, we talk about the design intention of plugins, the lifecycle methods, how you may write your own plugins, etc.

A plugin is a package that exports a class which can be instantiated with configurable options (provided by the user) and its various lifecycle methods will be invoked by the Docusaurus runtime.

Plugins are one of the best ways to add functionality to our Docusaurus. Plugins allow third-party developers to extend or modify the default functionality that Docusaurus provides.

Docusaurus Plugins are very similar to [Gatsby Plugins](https://www.gatsbyjs.org/plugins/) and [VuePress Plugins](https://v1.vuepress.vuejs.org/plugin/)<!-- TODO: is this the correct link? -->. The main difference here is that Docusaurus plugins don't allow using other plugins. Docusaurus provides [presets](./presets.md) for the use scenarios for plugins that are meant to work together.

In most cases, plugins are there to fetch data and create routes. A plugin could take in components as part of its options and to act as the wrapper for the page.

## How to create plugins

_This section is a work in progress._

<!--

outline:
- jump start a plugin
- refer to lifecycle APIs
- describe mindset how plugins should work

Plugins are modules which export a function that takes in the context, options and returns a plain JavaScript object that has some properties defined.

-->

## Official plugins

List of [official plugins](https://github.com/facebook/docusaurus/tree/master/packages) created by Docusaurus.

### `@docusaurus/plugin-content-blog`

The default blog plugin for Docusaurus. The classic template ships with this plugin with default configurations.

```js
// docusaurus.config.js
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        /**
         * Path to data on filesystem
         * relative to site dir
         */
        path: 'blog',
        /**
         * URL route for the blog section of your site
         * do not include trailing slash
         */
        routeBasePath: 'blog',
        include: ['*.md', '*.mdx'],
        postsPerPage: 10,
        /**
         * Theme components used by the blog pages
         */
        blogListComponent: '@theme/BlogListPage',
        blogPostComponent: '@theme/BlogPostPage',
        blogTagsListComponent: '@theme/BlogTagsListPage',
        blogTagsPostsComponent: '@theme/BlogTagsPostsPage',
        /**
         * Remark and Rehype plugins passed to MDX
         */
        remarkPlugins: [],
        rehypePlugins: [],
      },
    ],
  ],
};
```

<!--
#### Options
| Option | Default | Notes |
| :-- | :-- | :-- |
| `path` | `'blog'` | Path to data on filesystem, relative to site dir |
| `routeBasePath` | `'blog'` | URL Route |
| `include` | `['*.md', '*.mdx']` | Extensions to include |
| `postsPerPage` | `10` | How many posts per page |
| `blogListComponent` | `'@theme/BlogListPage'` | Theme component used for the blog listing page |
| `blogPostComponent` | `'@theme/BlogPostPage'` | Theme component used for the blog post page |
| `blogTagsListComponent` | `'@theme/BlogTagsListPage'` | Theme component used for the blog tags list page |
| `blogTagsPostsComponent` | `'@theme/BlogTagsPostsPage'` | Theme component used for the blog tags post page |
| `remarkPlugins` | `[]` | Plugins for remark |
| `rehypePlugins` | `[]` | Plugins for rehype |
commenting out because charts look less direct than code example
-->

### `@docusaurus/plugin-content-docs`

The default docs plugin for Docusaurus. The classic template ships with this plugin with default configurations.

```js
// docusaurus.config.js
module.exports = {
  plugins: [
    [
      '@docuaurus/plugin-content-docs',
      {
        /**
         * Path to data on filesystem
         * relative to site dir
         */
        path: 'docs',
        /**
         * URL route for the blog section of your site
         * do not include trailing slash
         */
        routeBasePath: 'docs',
        include: ['**/*.md', '**/*.mdx'], // Extensions to include.
        /**
         * Path to sidebar configuration for showing a list of markdown pages.
         * Warning: will change
         */
        sidebarPath: '',
        /**
         * Theme components used by the docs pages
         */
        docLayoutComponent: '@theme/DocPage',
        docItemComponent: '@theme/DocItem',
        /**
         * Remark and Rehype plugins passed to MDX
         */
        remarkPlugins: [],
        rehypePlugins: [],
      },
    ],
  ],
};
```

### `@docusaurus/plugin-content-pages`

The default pages plugin for Docusaurus. The classic template ships with this plugin with default configurations.

```js
// docusaurus.config.js
module.exports = {
  plugins: [
    [
      '@docuaurus/plugin-content-pages',
      {
        /**
         * Path to data on filesystem
         * relative to site dir
         * components in this directory will be automatically converted to pages
         */
        path: 'src/pages',
        /**
         * URL route for the blog section of your site
         * do not include trailing slash
         */
        routeBasePath: '',
        include: ['**/*.{js,jsx}'],
      },
    ],
  ],
};
```

### `@docusaurus/plugin-google-analytics`

The default [Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/) plugin.

**Installation**

```shell
$ yarn add @docusaurus/plugin-google-analytics
```

**Configuration**

```js
// docusaurus.config.js
module.exports = {
  plugins: ['@docusaurus/plugin-google-analytics'],
  themeConfig: {
    googleAnalytics: {
      trackingID: 'UA-141789564-1',
    },
  }
};
```

### `@docusaurus/plugin-google-gtag`

The default [Global Site Tag (gtag.js)](https://developers.google.com/analytics/devguides/collection/gtagjs/) plugin.

**Installation**

```shell
$ yarn add @docusaurus/plugin-google-gtag
```

**Configuration**

```js
// docusaurus.config.js
module.exports = {
  plugins: ['@docusaurus/plugin-google-gtag'],
  themeConfig: {
    gtag: {
      trackingID: 'UA-141789564-1',
    },
  }
};
```

### `@docusaurus/plugin-sitemap`

The classic template ships with this plugin.

```js
// docusaurus.config.js
module.exports = {
  plugins: [
    '@docusaurus/plugin-sitemap',
    {
      cacheTime: 600 * 1000, // 600 sec - cache purge period
      changefreq: 'weekly',
      priority: 0.5,
    },
  ],
};
```
