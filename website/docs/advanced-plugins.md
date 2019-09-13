---
id: advanced-plugins
title: Plugins
---

<!-- TODO
- move the list of plugins (maybe to links to each plugin's READMEs)
- add guides on how to create plugins
-->

In this doc, we talk about the design intention of plugins and how you may write your own plugins.

Docusaurus Plugins are very similar to [Gatsby Plugins](https://www.gatsbyjs.org/plugins/) and [VuePress Plugins](https://v1.vuepress.vuejs.org/plugin/). The main difference here is that Docusaurus plugins don't allow using other plugins. Docusaurus provides [presets](./presets.md) to bundle plugins that are meant to work together.

## Plugins design

Docusaurus' implementation of the plugins system provides us a unified way to participate in the website's build process and create components in a systematic way.

A plugin can provide React components to be used together with the non-UI functionality. You can also specify a resolution rule for the plugin to find its components to call, which you then supply with a [theme](./advanced-themes.md).

<!--

A plugin is a package that exports a class which can be instantiated with configurable options (provided by the user) and its various lifecycle methods invoked by the Docusaurus runtime.

Plugins are one of the best ways to add functionalities to our Docusaurus. Plugins allow third-party developers to extend or modify the default functionality that Docusaurus provides.

In most cases, plugins are there to fetch data and create routes. A plugin could take in components as part of its options and to act as the wrapper for the page.
-->

<!--

outline:
- jump start a plugin
- refer to lifecycle APIs
- describe mindset how plugins should work

Plugins are modules which export a function that takes in the context, options and returns a plain JavaScript object that has some properties defined.

-->

## Creating plugins

A plugin is a module which exports a function that takes two parameters and returns an object.

We need to specify for our plugin:

- which files to watch
- generate which pages from those files
- in those pages, which components to call and with what props

We'll use [@docusaurus/plugin-content-blog](https://github.com/facebook/docusaurus/tree/master/packages/docusaurus-plugin-content-blog) as an example to explain how to create a plugin.

### Module definition

The exported modules for plugins are called with two parameters: `context` and `options`:

<!-- packages/docusaurus/src/server/types.ts -->

```js
module.exports = function(context, options) {
  // ...
};
```

`context` contains the following fields:

```js
interface LoadContext {
  siteDir: string;
  generatedFilesDir: string;
  siteConfig: DocusaurusConfig;
  cliOptions: CLIOptions;
  outDir: string;
  baseUrl: string;
}

interface CLIOptions {
  [option: string]: any;
}
```

And `options` are optionally the [second parameter when the plugins are used](/docs/using-plugins#configuring-plugins).

### Paths to watch

To specify which paths to watch for your plugin, implement `getPathsToWatch()` in your return object:

```js
module.exports = function(context, opts) {
  const options = {...DEFAULT_OPTIONS, ...opts};
  const contentPath = path.resolve(context.siteDir, options.path);

  return {
    name: 'docusaurus-plugin-content-blog',

    getPathsToWatch() {
      const {include = []} = options;
      const globPattern = include.map(pattern => `${contentPath}/${pattern}`);
      return [...globPattern];
    },

    // ...
  };
};
```

## Official plugins

Find the list of official Docusaurus plugins [here](https://github.com/facebook/docusaurus/tree/master/packages).

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
