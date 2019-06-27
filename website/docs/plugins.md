---
id: plugins
title: Plugins
---

A plugin is a package that exports a class which can be instantiated with configurable options (provided by the user) and its various lifecycle methods will be invoked by the Docusaurus runtime.

In this doc, we talk about the design intention of plugins, the lifecycle methods, how you may write your own plugins, etc.

Docusaurus Plugins are very similar to [Gatsby Plugins](https://www.gatsbyjs.org/plugins/) and [VuePress Plugins](https://v1.vuepress.vuejs.org/plugin/)<!-- TODO: is this the correct link? -->. The main difference here is that Docusaurus plugins don't allow using other plugins. Docusaurus provides [presets](./presets.md) for the use scenarios for plugins that are meant to work together.

In most cases, plugins are there to fetch data and create routes. A plugin could take in components as part of its options and to act as the wrapper for the page.

## Lifecycle methods

<!-- TODO: explain lifecycle methods -->

- `loadContent` - Plugins should fetch from data sources (filesystem, remote API, etc)
- `contentLoaded` - Plugins should use the data loaded in loadContent and construct the pages/routes that consume the data
- `configureWebpack` - To extend the webpack config via webpack-merge.

<!--
For example, the in docusaurus-plugin-content-docs:

    In loadContent, it loads the doc Markdown files based on the specified directory in options (defaulting to docs).
    In contentLoaded, for each doc Markdown file, a route is created: /doc/installation, /doc/getting-started, etc.
 -->

## How to create plugins

<!-- TODO: explain creating plugins using an example -->

## Official plugins

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

### `@docusaurus/plugin-content-analytics`

The classic template ships with this plugin for Google Analytics. To use this analytics, specify the plugin in the `plugins` field, and provide your Google Analytics configuration in [theme config](./using-themes.md).

```js
// docusaurus.config.js
module.exports = {
  plugins: ['@docusaurus/plugin-content-analytics'],
};
```

### `@docusaurus/plugin-content-gtag`

<!-- TODO -->

### `@docusaurus/plugin-content-sitemap`

The classic template ships with this plugin.

```js
// docusaurus.config.js
module.exports = {
  plugins: [
    '@docusaurus/plugin-content-sitemap',
    {
      cacheTime: 600 * 1000, // 600 sec - cache purge period
      changefreq: 'weekly',
      priority: 0.5,
    },
  ],
};
```
