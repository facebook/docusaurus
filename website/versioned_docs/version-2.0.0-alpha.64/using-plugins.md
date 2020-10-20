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

## Multi-instance plugins and plugin ids

It is possible to use multiple times the same plugin, on the same Docusaurus website.

In this case, you it is required to assign a unique id to each plugin instance.

By default, the plugin id is `default`.

```js {6,13} title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-xxx',
      {
        id: 'plugin-xxx-1',
        // other options
      },
    ],
    [
      '@docusaurus/plugin-xxx',
      {
        id: 'plugin-xxx-2',
        // other options
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
module.exports = function (context, options) {
  // ...
  return {
    name: 'my-docusaurus-plugin',
    async loadContent() {
      /* ... */
    },
    async contentLoaded({content, actions}) {
      /* ... */
    },
    /* other lifecycle API */
  };
};
```

The `my-plugin` folder could also be a fully fledged package with it's own package.json and a `src/index.js` file for example

#### `context`

`context` is plugin-agnostic and the same object will be passed into all plugins used for a Docusaurus website. The `context` object contains the following fields:

```ts
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
         * Blog page meta description for better SEO
         */
        blogDescription: 'Blog',
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
         * By default, versioning is enabled on versioned sites.
         * This is a way to explicitly disable the versioning feature.
         */
        disableVersioning: false,
        /**
         * Skip the next release docs when versioning is enabled.
         * This will not generate HTML files in the production build for documents
         * in `/docs/next` directory, only versioned docs.
         */
        excludeNextVersionDocs: false,
        /**
         * The last version is the one we navigate to in priority on versioned sites
         * It is the one displayed by default in docs navbar items
         * By default, the last version is the first one to appear in versions.json
         * By default, the last version is at the "root" (docs have path=/docs/myDoc)
         * Note: it is possible to configure the path and label of the last version
         * Tip: using lastVersion: 'current' make sense in many cases
         */
        lastVersion: undefined,
        /**
         * The docusaurus versioning defaults don't make sense for all projects
         * This gives the ability customize the label and path of each version
         * You may not like that default versin
         */
        versions: {
          /*
          Example configuration: 
          current: {
            label: 'Android SDK v2.0.0 (WIP)',
            path: 'android-2.0.0',
          },
          '1.0.0': {
            label: 'Android SDK v1.0.0',
            path: 'android-1.0.0',
          },
          */
        },
        /**
         * Sometimes you only want to include a subset of all available versions.
         * Tip: limit to 2 or 3 versions to improve startup and build time in dev and deploy previews
         */
        onlyIncludeVersions: undefined, // ex: ["current", "1.0.0", "2.0.0"]
      },
    ],
  ],
};
```

### `@docusaurus/plugin-content-pages`

The default pages plugin for Docusaurus. The classic template ships with this plugin with default configurations. This plugin provides [creating pages](guides/creating-pages.md) functionality.

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
        include: ['**/*.{js,jsx,ts,tsx,md,mdx}'],
        /**
         * No Route will be created for matching files
         */
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/*.test.{js,ts}',
          '**/__tests__/**',
        ],
        /**
         * Theme component used by markdown pages.
         */
        mdxPageComponent: '@theme/MDXPage',
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
        trailingSlash: false,
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

### `@docusaurus/plugin-pwa`

Docusaurus Plugin to add PWA support using [Workbox](https://developers.google.com/web/tools/workbox). This plugin generates a [Service Worker](https://developers.google.com/web/fundamentals/primers/service-workers) in production build only, and allows you to create fully PWA-compliant documentation site with offline and installation support.

```bash npm2yarn
npm install --save @docusaurus/plugin-pwa
```

Create a [PWA manifest](https://web.dev/add-manifest/) at `./static/manifest.json`.

Modify `docusaurus.config.js` with a minimal PWA config, like:

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true,
        offlineModeActivationStrategies: ['appInstalled', 'queryString'],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/docusaurus.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json', // your PWA manifest
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: 'rgb(37, 194, 160)',
          },
        ],
      },
    ],
  ],
};
```

#### Progressive Web App

Having a service worker installed is not enough to make your application a PWA. You'll need to at least include a [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) and have the correct tags in `<head>` ([Options > pwaHead](#pwahead)).

After deployment, you can use [Lighthouse](https://developers.google.com/web/tools/lighthouse) to run an audit on your site.

For a more exhaustive list of what it takes for your site to be a PWA, refer to the [PWA Checklist](https://developers.google.com/web/progressive-web-apps/checklist)

#### App installation support

If your browser supports it, you should be able to install a Docusaurus site as an app.

![pwa_install.gif](/img/pwa_install.gif)

#### Offline mode (precaching)

We enable users to browse a Docusaurus site offline, by using service-worker precaching.

> ### [What is Precaching?](https://developers.google.com/web/tools/workbox/modules/workbox-precaching)
>
> One feature of service workers is the ability to save a set of files to the cache when the service worker is installing. This is often referred to as "precaching", since you are caching content ahead of the service worker being used.
>
> The main reason for doing this is that it gives developers control over the cache, meaning they can determine when and how long a file is cached as well as serve it to the browser without going to the network, meaning it can be used to create web apps that work offline.
>
> Workbox takes a lot of the heavy lifting out of precaching by simplifying the API and ensuring assets are downloaded efficiently.

By default, offline mode is enabled when the site is installed as an app. See the `offlineModeActivationStrategies` option for details.

After the site has been precached, the service worker will serve cached responses for later visits. When a new build is deployed along with a new service worker, the new one will begin installing and eventually move to a waiting state. During this waiting state, a reload popup will show and ask the user to reload the page for new content. Until the user either clears the application cache or clicks the `reload` button on the popup, the service worker will continue serving the old content.

:::caution

Offline mode / precaching requires downloading all the static assets of the site ahead of time, and can consume unnecessary bandwidth. It may not be a good idea to activate it for all kind of sites.

:::

##### Options

##### `debug`

- Type: `boolean`
- Default: `false`

Turn debug mode on:

- Workbox logs
- Additional Docusaurus logs
- Unoptimized SW file output
- Source maps

##### `offlineModeActivationStrategies`

- Type: `Array<'appInstalled' | 'mobile' | 'saveData'| 'queryString' | 'always'>`
- Default: `['appInstalled','queryString']`

Strategies used to turn the offline mode on:

- `appInstalled`: activates for users having installed the site as an app
- `queryString`: activates if queryString contains `offlineMode=true` (convenient for PWA debugging)
- `mobile`: activates for mobile users (width <= 940px)
- `saveData`: activates for users with `navigator.connection.saveData === true`
- `always`: activates for all users

:::caution

Use this carefully: some users may not like to be forced to use the offline mode.

:::

##### `injectManifestConfig`

[Workbox options](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.injectManifest) to pass to `workbox.injectManifest()`. This gives you control over which assets will be precached, and be available offline.

- Type: `InjectManifestOptions`
- Default: `{}`

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        injectManifestConfig: {
          manifestTransforms: [
            //...
          ],
          modifyURLPrefix: {
            //...
          },
          // We already add regular static assets (html, images...) to be available offline
          // You can add more files according to your needs
          globPatterns: ['**/*.{pdf,docx,xlsx}'],
          // ...
        },
      },
    ],
  ],
};
```

##### `reloadPopup`

- Type: `string | false`
- Default: `'@theme/PwaReloadPopup'`

Module path to reload popup component. This popup is rendered when a new service worker is waiting to be installed, and we suggest a reload to the user.

Passing `false` will disable the popup, but this is not recommended: users won't have a way to get up-to-date content.

A custom component can be used, as long as it accepts `onReload` as a prop. The `onReload` callback should be called when the `reload` button is clicked. This will tell the service worker to install the waiting service worker and reload the page.

```ts
interface PwaReloadPopupProps {
  onReload: () => void;
}
```

The default theme includes an implementation for the reload popup and uses [Infima Alerts](https://facebookincubator.github.io/infima/docs/components/alert).

![pwa_reload.gif](/img/pwa_reload.gif)

##### `pwaHead`

- Type: `Array<{ tagName: string } & Record<string,string>>`
- Default: `[]`

Array of objects containing `tagName` and key-value pairs for attributes to inject into the `<head>` tag. Technically you can inject any head tag through this, but it's ideally used for tags to make your site PWA compliant. Here's a list of tag to make your app fully compliant:

```js
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/docusaurus.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: 'rgb(37, 194, 160)',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#000',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: '/img/docusaurus.png',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: '/img/docusaurus.svg',
            color: 'rgb(37, 194, 160)',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: '/img/docusaurus.png',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#000',
          },
        ],
      },
    ],
  ],
};
```

##### `swCustom`

- Type: `string | undefined`
- Default: `undefined`

Useful for additional Workbox rules. You can do whatever a service worker can do here, and use the full power of workbox libraries. The code is transpiled, so you can use modern ES6+ syntax here.

For example, to cache files from external routes:

```js
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';

// default fn export receiving some useful params
export default function swCustom(params) {
  const {
    debug, // :boolean
    offlineMode, // :boolean
  } = params;

  // Cache responses from external resources
  registerRoute((context) => {
    return [
      /graph\.facebook\.com\/.*\/picture/,
      /netlify\.com\/img/,
      /avatars1\.githubusercontent/,
    ].some((regex) => context.url.href.match(regex));
  }, new StaleWhileRevalidate());
}
```

The module should have a `default` function export, and receives some params.

##### `swRegister`

- Type: `string | false`
- Default: `'docusaurus-plugin-pwa/src/registerSW.js'`

Adds an entry before the Docusaurus app so that registration can happen before the app runs. The default `registerSW.js` file is enough for simple registration.

Passing `false` will disable registration entirely.

### `@docusaurus/plugin-debug`

The debug plugin will display useful debug informations at [http://localhost:3000/\_\_docusaurus/debug](http://localhost:3000/__docusaurus/debug).

It is mostly useful for plugin authors, that will be able to inspect more easily the content of the `.docusaurus` folder (like the creates routes), but also be able to inspect data structures that are never written to disk, like the plugin data loaded through the `contentLoaded` lifecycle.

:::note

If you report a bug, we will probably ask you to have this plugin turned on in the production, so that we can inspect your deployment config more easily.

If you don't have any sensitive information, you can keep it on in production [like we do](http://v2.docusaurus.io/__docusaurus/debug).

:::

**Installation**

```bash npm2yarn
npm install --save @docusaurus/plugin-debug
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency. You can also configure it through the [classic preset options](presets.md#docusauruspreset-classic) instead of doing it like below.

By default, it's enabled in dev, and disabled in prod, to avoid exposing potentially sensitive informations.

:::

```js title="docusaurus.config.js"
module.exports = {
  plugins: ['@docusaurus/plugin-debug'],
};
```
