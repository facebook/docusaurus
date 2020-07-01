---
id: using-plugins
title: Plugins
---

Plugins are the building blocks of features in a Docusaurus 2 site. Each plugin handles its own individual feature. Plugins may work and be distributed as part of bundle via [presets](presets.md).

## Installing a plugin

A plugin is usually a npm package, so you install them like other npm packages using npm.

```bash npm2yarn
npm install --save docusaurus-plugin-name
```

Then you add it in your site's `docusaurus.config.js`'s `plugins` option:

```jsx {3} title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: ['@docusaurus/plugin-content-pages'],
};
```

Docusaurus can also load plugins from your local directory, you can do something like the following:

```jsx {5} title="docusaurus.config.js"
const path = require('path');

module.exports = {
  // ...
  plugins: [path.resolve(__dirname, '/path/to/docusaurus-local-plugin')],
};
```

## Configuring plugins

For the most basic usage of plugins, you can provide just the plugin name or the absolute path to the plugin.

However, plugins can have options specified by wrapping the name and an options object in an array inside your config. This style is usually called `Babel Style`.

```js {4-9} title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: [
    [
      '@docusaurus/plugin-xxx',
      {
        /* options */
      },
    ],
  ],
};
```

Example:

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    // Basic usage.
    '@docusaurus/plugin-google-analytics',

    // With options object (babel style)
    [
      '@docusaurus/plugin-sitemap',
      {
        cacheTime: 600 * 1000,
      },
    ],
  ],
};
```

## Plugins design

Docusaurus' implementation of the plugins system provides us with a convenient way to hook into the website's lifecycle to modify what goes on during development/build, which involves (but not limited to) extending the webpack config, modifying the data being loaded and creating new components to be used in a page.

## Creating plugins

A plugin is a module which exports a function that takes two parameters and returns an object when executed.

### Module definition

The exported modules for plugins are called with two parameters: `context` and `options` and returns a JavaScript object with defining the [lifecycle APIs](./lifecycle-apis.md).

For example if you have a reference to a local folder such as this in your `docusaurus.config.js`:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: [path.resolve(__dirname, 'my-plugin')],
};
```

Then in the folder `my-plugin` you can create an index.js such as this

```js title="index.js"
module.exports = function(context, options) {
  // ...
  return {
    name: 'my-docusaurus-plugin',
    async loadContent() { ... },
    async contentLoaded({content, actions}) { ... },
    /* other lifecycle API */
  };
};
```

The `my-plugin` folder could also be a fully fledged package with it's own package.json and a `src/index.js` file for example

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

The returned object value should implement the [lifecycle APIs](lifecycle-apis.md).

## Official plugins

Find the list of official Docusaurus plugins [here](https://github.com/facebook/docusaurus/tree/master/packages).

### `@docusaurus/plugin-content-blog`

Provides the [Blog](blog.md) feature and is the default blog plugin for Docusaurus.

**Installation**

```bash npm2yarn
npm install --save @docusaurus/plugin-content-blog
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency. You can also configure it through the [classic preset options](presets.md#docusauruspreset-classic) instead of doing it like below.

:::

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: 'blog',
        /**
         * URL for editing a blog post.
         * Example: 'https://github.com/facebook/docusaurus/edit/master/website/blog/'
         */
        editUrl:
          'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        /**
         * URL route for the blog section of your site.
         * *DO NOT* include a trailing slash.
         */
        routeBasePath: 'blog',
        include: ['*.md', '*.mdx'],
        postsPerPage: 10,
        /**
         * Theme components used by the blog pages.
         */
        blogListComponent: '@theme/BlogListPage',
        blogPostComponent: '@theme/BlogPostPage',
        blogTagsListComponent: '@theme/BlogTagsListPage',
        blogTagsPostsComponent: '@theme/BlogTagsPostsPage',
        /**
         * Remark and Rehype plugins passed to MDX.
         */
        remarkPlugins: [
          /* require('remark-math') */
        ],
        rehypePlugins: [],
        /**
         * Custom Remark and Rehype plugins passed to MDX before
         * the default Docusaurus Remark and Rehype plugins.
         */
        beforeDefaultRemarkPlugins: [],
        beforeDefaultRehypePlugins: [],
        /**
         * Truncate marker, can be a regex or string.
         */
        truncateMarker: /<!--\s*(truncate)\s*-->/,
        /**
         * Show estimated reading time for the blog post.
         */
        showReadingTime: true,
        /**
         * Blog feed.
         * If feedOptions is undefined, no rss feed will be generated.
         */
        feedOptions: {
          type: '', // required. 'rss' | 'feed' | 'all'
          title: '', // default to siteConfig.title
          description: '', // default to  `${siteConfig.title} Blog`
          copyright: '',
          language: undefined, // possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        },
      },
    ],
  ],
};
```

### `@docusaurus/plugin-content-docs`

Provides the [Docs](markdown-features.mdx) functionality and is the default docs plugin for Docusaurus.

**Installation**

```bash npm2yarn
npm install --save @docusaurus/plugin-content-docs
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency. You can also configure it through the [classic preset options](presets.md#docusauruspreset-classic) instead of doing it like below.

:::

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: 'docs',
        /**
         * URL for editing a doc in the website repo.
         * Example: 'https://github.com/facebook/docusaurus/edit/master/website/'
         */
        editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
        /**
         * URL route for the docs section of your site.
         * *DO NOT* include a trailing slash.
         */
        routeBasePath: 'docs',
        homePageId: '_index', // Document id for docs home page.
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
        remarkPlugins: [
          /* require('remark-math') */
        ],
        rehypePlugins: [],
        /**
         * Custom Remark and Rehype plugins passed to MDX before
         * the default Docusaurus Remark and Rehype plugins.
         */
        beforeDefaultRemarkPlugins: [],
        beforeDefaultRehypePlugins: [],
        /**
         * Whether to display the author who last updated the doc.
         */
        showLastUpdateAuthor: false,
        /**
         * Whether to display the last date the doc was updated.
         */
        showLastUpdateTime: false,
        /**
         * Skip the next release docs when versioning is enabled.
         * This will not generate HTML files in the production build for documents
         * in `/docs/next` directory, only versioned docs.
         */
        excludeNextVersionDocs: false,
      },
    ],
  ],
};
```

### `@docusaurus/plugin-content-pages`

The default pages plugin for Docusaurus. The classic template ships with this plugin with default configurations. This plugin provides [creating pages](creating-pages.md) functionality.

**Installation**

```bash npm2yarn
npm install --save @docusaurus/plugin-content-pages
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency. You can also configure it through the [classic preset options](presets.md#docusauruspreset-classic) instead of doing it like below.

:::

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-content-pages',
      {
        /**
         * Path to data on filesystem
         * relative to site dir
         * components in this directory will be automatically converted to pages
         */
        path: 'src/pages',
        /**
         * URL route for the page section of your site
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

The default [Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/) plugin. It is a JavaScript library for measuring how users interact with your website.

**Installation**

```bash npm2yarn
npm install --save @docusaurus/plugin-google-analytics
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency.

:::

**Configuration**

```js title="docusaurus.config.js"
module.exports = {
  plugins: ['@docusaurus/plugin-google-analytics'],
  themeConfig: {
    googleAnalytics: {
      trackingID: 'UA-141789564-1',
      // Optional fields.
      anonymizeIP: true, // Should IPs be anonymized?
    },
  },
};
```

### `@docusaurus/plugin-google-gtag`

The default [Global Site Tag (gtag.js)](https://developers.google.com/analytics/devguides/collection/gtagjs/) plugin. It is a JavaScript tagging framework and API that allows you to send event data to Google Analytics, Google Ads, and Google Marketing Platform. This section describes how to configure a Docusaurus site to enable global site tag for Google Analytics.

**Installation**

```bash npm2yarn
npm install --save @docusaurus/plugin-google-gtag
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency.

:::

**Configuration**

```js title="docusaurus.config.js"
module.exports = {
  plugins: ['@docusaurus/plugin-google-gtag'],
  themeConfig: {
    gtag: {
      trackingID: 'UA-141789564-1',
      // Optional fields.
      anonymizeIP: true, // Should IPs be anonymized?
    },
  },
};
```

### `@docusaurus/plugin-sitemap`

This plugin creates sitemap for your site so that search engine crawlers can crawl your site more accurately.

**Installation**

```bash npm2yarn
npm install --save @docusaurus/plugin-sitemap
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency. You can also configure it through the [classic preset options](presets.md#docusauruspreset-classic) instead of doing it like below.

:::

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-sitemap',
      {
        cacheTime: 600 * 1000, // 600 sec - cache purge period
        changefreq: 'weekly',
        priority: 0.5,
      },
    ],
  ],
};
```

### `@docusaurus/plugin-ideal-image`

Docusaurus Plugin to generate an almost ideal image (responsive, lazy-loading, and low quality placeholder) **in the production builds**.

```bash npm2yarn
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

#### Usage

This plugin supports the PNG, GIF and JPG formats only.

```jsx
import Image from '@theme/IdealImage';
import thumbnail from './path/to/img.png';

// your React code
<Image img={thumbnail} />

// or
<Image img={require('./path/to/img.png')} />
```

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | `ideal-img/[name].[hash:hex:7].[width].[ext]` | Filename template for output files. |
| `sizes` | `array` | _original size_ | Specify all widths you want to use. If a specified size exceeds the original image's width, the latter will be used (i.e. images won't be scaled up). |
| `size` | `integer` | _original size_ | Specify one width you want to use; if the specified size exceeds the original image's width, the latter will be used (i.e. images won't be scaled up) |
| `min` | `integer` |  | As an alternative to manually specifying `sizes`, you can specify `min`, `max` and `steps`, and the sizes will be generated for you. |
| `max` | `integer` |  | See `min` above |
| `steps` | `integer` | `4` | Configure the number of images generated between `min` and `max` (inclusive) |
| `quality` | `integer` | `85` | JPEG compression quality |

### `@docusaurus/plugin-client-redirects`

Docusaurus Plugin to generate **client-side redirects**.

This plugin will write additional HTML pages to your static site, that redirects the user to your existing Docusaurus pages with JavaScript.

:::note

This plugin only create redirects for the production build.

:::

:::caution

It is better to use server-side redirects whenever possible.

Before using this plugin, you should look if your hosting provider doesn't offer this feature.

:::

**Installation**

```bash npm2yarn
npm install --save @docusaurus/plugin-client-redirects
```

**Configuration**

Main usecase: you have `/myDocusaurusPage`, and you want to redirect to this page from `/myDocusaurusPage.html`:

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html'],
      },
    ],
  ],
};
```

Second usecase: you have `/myDocusaurusPage.html`, and you want to redirect to this page from `/myDocusaurusPage`.

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        toExtensions: ['html'],
      },
    ],
  ],
};
```

For custom redirect logic, provide your own `createRedirects` function.

Let's imagine you change the url of an existing page, you might want to make sure the old url still works:

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/docs/newDocPath', // string
            from: ['/docs/oldDocPathFrom2019', '/docs/legacyDocPathFrom2016'], // string | string[]
          },
        ],
      },
    ],
  ],
};
```

It's possible to use a function to create the redirects for each existing path:

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        createRedirects: function (existingPath) {
          if (existingPath === '/docs/newDocPath') {
            return ['/docs/oldDocPathFrom2019', '/docs/legacyDocPathFrom2016']; // string | string[]
          }
        },
      },
    ],
  ],
};
```

Finally, it's possible to use all options at the same time:

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html', 'htm'],
        toExtensions: ['exe', 'zip'],
        redirects: [
          {
            to: '/docs/newDocPath',
            from: '/docs/oldDocPath',
          },
        ],
        createRedirects: function (existingPath) {
          if (existingPath === '/docs/newDocPath2') {
            return ['/docs/oldDocPath2'];
          }
        },
      },
    ],
  ],
};
```
