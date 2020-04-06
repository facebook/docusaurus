# `@docusaurus/plugin-pwa`

Docusaurus Plugin to add PWA support using [Workbox](https://developers.google.com/web/tools/workbox). This plugin generates a [Service Worker](https://developers.google.com/web/fundamentals/primers/service-workers) in production and allows you to create fully PWA-compliant documentation site with offline and installation support.

## Installation

```sh
yarn add @docusaurus/plugin-pwa
```

Modify your `docusaurus.config.js`

```js
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-pwa'
      {
        // Additional configuration options to pass to `workbox.injectManifest()`
        injectManifestConfig: {},
        // Header tags to inject in HTML for PWA compliance
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
        ],
        // Custom service worker code to run after precache manifest is registered
        swCustom: path.resolve(__dirname, 'src/sw.js'),
        // File added before Docusaurus entry to register service worker before app runs
        swRegister: path.resolve(__dirname, 'src/registerSw.js'),
      },
    ],
  ],
}
```

### Progressive Web App

Having a service worker installed is not enough to make your application a PWA. You'll need to at least include a [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) and have the correct tags in `<head>` ([Options > pwaHead](#pwahead)).

After deployment, you can use [Lighthouse](https://developers.google.com/web/tools/lighthouse) to run an audit on your site.

For a more exhaustive list of what it takes for your site to be PWA, refer to the [PWA Checklist](https://developers.google.com/web/progressive-web-apps/checklist)

### Options

#### `injectManifestConfig`

- Type: `InjectManifestOptions`

[Workbox options](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.injectManifest) to pass to `workbox.injectManifest()`

```js
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-pwa'
      {
        manifestTransforms: [...],
        modifyURLPrefix: {...},
        ...
      },
    ],
  ],
}
```

#### `pwaHead`

- Type: `Array<{ tagName: string, [key: string]: string }>`
- Default: `[]`

Array of objects containing `tagName` and key-value pairs for attributes to inject into the `<head>` tag. Technically you can inject any head tag through this, but it's ideally used for tags to make your site PWA compliant. Here's a list of tag to make your app fully compliant:

```js
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-pwa'
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
}
```

#### `swCustom`

- Type: `string`
- Default: `''`

Module to import and run after the precache manifest is registered. Useful for additional Workbox rules. For example, to cache files from external routes:

```js
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';

export default function customSW() {
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

The module should have a `default` export and it should be a function.

#### `swRegister`

- Type: `string | boolean`
- Default: `'docusaurus-plugin-pwa/src/registerSW.js'`

Adds an entry that before the Docusaurus app so that registration can happen before the app runs. The default service worker is enough for simple registration.

Passing an empty string `''` or `false` will disable registration entirely.

The default code registering the service worker looks like this:

```js
(() => {
  if (typeof window === 'undefined') {
    return;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    if ('serviceWorker' in navigator) {
      const {Workbox} = await import('workbox-window');

      const wb = new Workbox(process.env.SERVICE_WORKER);

      if (process.env.PWA_POPUP) {
        const {default: renderPopup} = await import('./renderPopup');

        wb.addEventListener('waiting', () => {
          renderPopup({
            onRefresh() {
              wb.addEventListener('controlling', () => {
                window.location.reload();
              });

              wb.messageSW({type: 'SKIP_WAITING'});
            },
          });
        });
      }

      wb.register();
    }
  });
})();
```
