---
id: plugin-google-analytics
title: '📦 plugin-google-analytics'
slug: '/api/plugins/@docusaurus/plugin-google-analytics'
---

The default [Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/) plugin. It is a JavaScript library for measuring how users interact with your website.

## Installation

```bash npm2yarn
npm install --save @docusaurus/plugin-google-analytics
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency.

:::

## Configuration

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
