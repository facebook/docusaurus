---
id: advanced-plugins
title: Writing Plugins
---

In this doc, we talk about the design intention of plugins and how you may write your own plugins.

Docusaurus Plugins are very similar to [Gatsby Plugins](https://www.gatsbyjs.org/plugins/) and [VuePress Plugins](https://v1.vuepress.vuejs.org/plugin/). The main difference here is that Docusaurus plugins don't allow plugins to include another plugin. Docusaurus provides [presets](presets.md) to bundle plugins that are meant to work together.

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

`options` are the [second optional parameter when the plugins are used](using-plugins.md#configuring-plugins). `options` are plugin-specific and are specified by users when they use them in `docusaurus.config.js`. Alternatively, if preset contains the plugin, the preset will then be in charge of passing the correct options into the plugin. It is up to individual plugin to define what options it takes.

#### Return value

The returned object value should implement the [lifecycle APIs](./lifecycle-apis.md).

## Official plugins

Find the list of official Docusaurus plugins [here](https://github.com/facebook/docusaurus/tree/master/packages).

### `@docusaurus/plugin-content-blog`

Provides the [Blog](blog.md) feature and is the default blog plugin for Docusaurus. The classic template ships with this plugin with default configurations.

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
        /**
         * Truncate marker, can be a regex or string.
         */
        truncateMarker: /<!--\s*(truncate)\s*-->/
         /**
         * Blog feed
         * If feedOptions is undefined, no rss feed will be generated
         */
        feedOptions: {
          type: '', // required. 'rss' | 'feed' | 'all'
          title: '', // default to siteConfig.title
          description: '', // default to  `${siteConfig.title} Blog`
          copyright: '',
          language: undefined; // possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        };
      },
    ],
  ],
};
```

### `@docusaurus/plugin-content-docs`

Provides the [Docs](markdown-features.mdx) functionality and is the default docs plugin for Docusaurus. The classic template ships with this plugin with default configurations.

```js
// docusaurus.config.js
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
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

The classic template ships with this plugin. This plugin creates sitemap for your site so that search engine crawlers can crawl your site more accurately.

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

### `@docusaurus/plugin-ideal-image`

Docusaurus Plugin to generate an almost ideal image (responsive, lazy-loading, and low quality placeholder)

```sh
npm install --save @docusaurus/plugin-ideal-image
```

Modify your `docusaurus.config.js`

```diff
module.exports = {
  ...
+ plugins: ['@docusaurus/plugin-ideal-image'],
  ...
}
```

## Usage

This plugin supports png, gif and jpg only

```jsx
import Image from '@theme/IdealImage';
import thumbnail from './path/to/img.png';

// your react code
<Image img={thumbnail} />

// or
<Image img={require('./path/to/img.png')} />
```

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | `ideal-img/[name].[hash:hex:7].[width].[ext]` | Filename template for output files. |
| `sizes` | `array` | _original size_ | Specify all widths you want to use. If a specified size exceeds the original image's width, the latter will be used (i.e. images won't be scaled up). You may also declare a default `sizes` array in the loader options in your `webpack.config.js`. |
| `size` | `integer` | _original size_ | Specify one width you want to use; if the specified size exceeds the original image's width, the latter will be used (i.e. images won't be scaled up) |
| `min` | `integer` |  | As an alternative to manually specifying `sizes`, you can specify `min`, `max` and `steps`, and the sizes will be generated for you. |
| `max` | `integer` |  | See `min` above |
| `steps` | `integer` | `4` | Configure the number of images generated between `min` and `max` (inclusive) |
| `quality` | `integer` | `85` | JPEG compression quality |
