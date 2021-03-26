---
id: plugin-pwa
title: '📦 plugin-pwa'
slug: '/api/plugins/@docusaurus/plugin-pwa'
---

Docusaurus Plugin to add PWA support using [Workbox](https://developers.google.com/web/tools/workbox). This plugin generates a [Service Worker](https://developers.google.com/web/fundamentals/primers/service-workers) in production build only, and allows you to create fully PWA-compliant documentation site with offline and installation support.

## Installation {#installation}

```bash npm2yarn
npm install --save @docusaurus/plugin-pwa
```

## Configuration {#configuration}

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

## Progressive Web App {#progressive-web-app}

Having a service worker installed is not enough to make your application a PWA. You'll need to at least include a [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) and have the correct tags in `<head>` ([Options > pwaHead](#pwahead)).

After deployment, you can use [Lighthouse](https://developers.google.com/web/tools/lighthouse) to run an audit on your site.

For a more exhaustive list of what it takes for your site to be a PWA, refer to the [PWA Checklist](https://developers.google.com/web/progressive-web-apps/checklist)

## App installation support {#app-installation-support}

If your browser supports it, you should be able to install a Docusaurus site as an app.

![pwa_install.gif](/img/pwa_install.gif)

## Offline mode (precaching) {#offline-mode-precaching}

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

## Options {#options}

### `debug` {#debug}

- Type: `boolean`
- Default: `false`

Turn debug mode on:

- Workbox logs
- Additional Docusaurus logs
- Unoptimized SW file output
- Source maps

### `offlineModeActivationStrategies` {#offlinemodeactivationstrategies}

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

### `injectManifestConfig` {#injectmanifestconfig}

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

### `reloadPopup` {#reloadpopup}

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

The default theme includes an implementation for the reload popup and uses [Infima Alerts](https://infima.dev/docs/components/alert).

![pwa_reload.gif](/img/pwa_reload.gif)

### `pwaHead` {#pwahead}

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

### `swCustom` {#swcustom}

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

### `swRegister` {#swregister}

- Type: `string | false`
- Default: `'docusaurus-plugin-pwa/src/registerSW.js'`

Adds an entry before the Docusaurus app so that registration can happen before the app runs. The default `registerSW.js` file is enough for simple registration.

Passing `false` will disable registration entirely.
