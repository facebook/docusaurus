---
id: plugin-sitemap
title: '📦 plugin-sitemap'
slug: '/api/plugins/@docusaurus/plugin-sitemap'
---

This plugin creates sitemap for your site so that search engine crawlers can crawl your site more accurately.

## Installation

```bash npm2yarn
npm install --save @docusaurus/plugin-sitemap
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency. You can also configure it through the [classic preset options](presets.md#docusauruspreset-classic) instead of doing it like below.

:::

## Configuration

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
