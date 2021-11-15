---
id: plugin-google-gtag
title: '📦 plugin-google-gtag'
slug: '/api/plugins/@docusaurus/plugin-google-gtag'
---

The default [Global Site Tag (gtag.js)](https://developers.google.com/analytics/devguides/collection/gtagjs/) plugin. It is a JavaScript tagging framework and API that allows you to send event data to Google Analytics, Google Ads, and Google Marketing Platform, **in the production build**. This section describes how to configure a Docusaurus site to enable global site tag for Google Analytics.

:::tip

You can use [Google's Tag Assistant](https://tagassistant.google.com/) tool to check if your gtag is set up correctly!

:::

## Installation {#installation}

```bash npm2yarn
npm install --save @docusaurus/plugin-google-gtag
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency.

:::

## Configuration {#configuration}

```js title="docusaurus.config.js"
module.exports = {
  plugins: ['@docusaurus/plugin-google-gtag'],
  themeConfig: {
    gtag: {
      // You can also use your "G-" Measurement ID here.
      trackingID: 'UA-141789564-1',
      // Optional fields.
      anonymizeIP: true, // Should IPs be anonymized?
    },
  },
};
```
