---
id: analytics
title: Analytics
keywords:
  - docusaurus
  - analytics
---

This page describes how to configure a Docusaurus site to enable Google's libraries and SDKs for tracking.

## `@docusaurus/plugin-google-analytics`

[Google's analytics.js library](https://developers.google.com/analytics/devguides/collection/analyticsjs/) is a JavaScript library for measuring how users interact with your website. This section explains how to configure a Docusaurus site to enable Google Analytics.

If you generalized your site using Docusaurus' classic template, you may enable the analytics plugin directly by specifying the Google Analytics tracking id via the `themeConfig` field:

```js
// docusaurus.config.js
module.exports = {
  themeConfig: {
    googleAnalytics: {
      trackingID: 'UA-142857148-5',
    },
  },
};
```

To learn how to manually set up the Google Analytics plugin for Docusaurus sites not generated from the classic template, refer to [Advanced Guides: Plugins – `@docusaurus/plugin-google-analytics`](advanced-plugins.md#docusaurusplugin-google-analytics).

## `@docusaurus/plugin-google-gtag`

Google's [Global Site Tag (gtag.js)](https://developers.google.com/analytics/devguides/collection/gtagjs/) is a JavaScript tagging framework and API that allows you to send event data to Google Analytics, Google Ads, and Google Marketing Platform. This section describes how to configure a Docusaurus site to enable global site tag for Google Analytics.

If you generalized your site using Docusaurus' classic template, you may enable the gtag plugin directly by specifying the gtag tracking id via the `themeConfig` field:

```js
// docusaurus.config.js
module.exports = {
  themeConfig: {
    gtag: {
      trackingID: 'UA-142857148-5',
    },
  },
};
```

To learn how to manually set up the gtag plugin for Docusaurus sites not generated from the classic template, refer to [Advanced Guides: Plugins – `@docusaurus/plugin-google-gtag`](advanced-plugins.md#docusaurusplugin-google-gtag).
