---
id: advanced-plugins
title: Writing Plugins
---

In this doc, we talk about the design intention of plugins and how you may write your own plugins.

Docusaurus Plugins are very similar to [Gatsby Plugins](https://www.gatsbyjs.org/plugins/) and [VuePress Plugins](https://v1.vuepress.vuejs.org/plugin/). The main difference here is that Docusaurus plugins don't allow plugins to include another plugins. Docusaurus provides [presets](presets.md) to bundle plugins that are meant to work together.

## Plugins design

Docusaurus' implementation of the plugins system provides us with a convenient way to hook into the website's lifecycle to modify what goes on during development/build, which involves (but not limited to) extending the webpack config, modifying the data being loaded and creating new components to be used in a page.

## Creating plugins

A plugin is a module which exports a function that takes two parameters and returns an object when executed.

### Module definition

The exported modules for plugins are called with two parameters: `context` and `options` and returns a JavaScript object with defining the [lifecycle APIs](./lifecycle-apis.md).

```js
// Example contents of a Docusaurus plugin.
module.exports = function(context, options) {
  // ...
  return {
    name: 'my-docusaurus-plugin',
    async loadContent() { ... },
    async contentLoaded({content, actions}) { ... },
    /* other lifecycle api */
  };
};
```

#### `context`

`context` is plugin-agnostic and the same object will be passed into all plugins used for a Docusaurus website. The `context` object contains the following fields:

```js
interface LoadContext {
  siteDir: string;
  generatedFilesDir: string;
  siteConfig: DocusaurusConfig;
  outDir: string;
  baseUrl: string;
}
```

#### `options`

`options` are the [second optional parameter when the plugins are used](using-plugins.md#configuring-plugins). `options` is plugin-specific and are specified by the user when they use it in `docusaurus.config.js` or if preset contains the plugin. The preset will then be in-charge of passing the correct options into the plugin. It is up to individual plugins to define what options it takes.

#### Return value

The returned object value should implement the [lifecycle APIs](./lifecycle-apis.md).

## Official plugins

Find the list of official Docusaurus plugins [here](https://github.com/facebook/docusaurus/tree/master/packages).

### `@docusaurus/plugin-content-blog`

The default blog plugin for Docusaurus. The classic template ships with this plugin with default configurations. This plugin provides [Blog](blog.md) functionality.

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

### `@docusaurus/plugin-content-docs`

The default docs plugin for Docusaurus. The classic template ships with this plugin with default configurations. This plugin provides [Docs](markdown-features.mdx) functionality.

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
         * URL for editing docs, example: 'https://github.com/facebook/docusaurus/edit/master/website/docs/'
         */
        editUrl: 'https://github.com/repo/project/website/docs/',
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
        /**
         * Whether to display the author who last updated the doc.
         */
        showLastUpdateAuthor: false,
        /**
         * Whether to display the last date the doc was updated.
         */
        showLastUpdateTime: false,
      },
    ],
  ],
};
```

### `@docusaurus/plugin-content-pages`

The default pages plugin for Docusaurus. The classic template ships with this plugin with default configurations. This plugin provides [creating pages](creating-pages.md) functionality.

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
$ npm install --save @docusaurus/plugin-google-analytics
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
  },
};
```

### `@docusaurus/plugin-google-gtag`

The default [Global Site Tag (gtag.js)](https://developers.google.com/analytics/devguides/collection/gtagjs/) plugin.

**Installation**

```shell
$ npm install --save @docusaurus/plugin-google-gtag
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
  },
};
```

### `@docusaurus/plugin-sitemap`

The classic template ships with this plugin. This plugin creates sitemap for your site so that search engine crawlers can crawl your site better.

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
