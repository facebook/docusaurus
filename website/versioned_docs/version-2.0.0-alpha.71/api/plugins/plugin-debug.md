---
id: plugin-debug
title: '📦 plugin-debug'
slug: '/api/plugins/@docusaurus/plugin-debug'
---

The debug plugin will display useful debug information at [http://localhost:3000/\_\_docusaurus/debug](http://localhost:3000/__docusaurus/debug).

It is mostly useful for plugin authors, that will be able to inspect more easily the content of the `.docusaurus` folder (like the creates routes), but also be able to inspect data structures that are never written to disk, like the plugin data loaded through the `contentLoaded` lifecycle.

:::note

If you report a bug, we will probably ask you to have this plugin turned on in the production, so that we can inspect your deployment config more easily.

If you don't have any sensitive information, you can keep it on in production [like we do](http://docusaurus.io/__docusaurus/debug).

:::

## Installation {#installation}

```bash npm2yarn
npm install --save @docusaurus/plugin-debug
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency. You can also configure it through the [classic preset options](presets.md#docusauruspreset-classic) instead of doing it like below.

By default, it's enabled in dev, and disabled in prod, to avoid exposing potentially sensitive information.

:::

## Configuration {#configuration}

```js title="docusaurus.config.js"
module.exports = {
  plugins: ['@docusaurus/plugin-debug'],
};
```
