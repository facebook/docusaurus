---
sidebar_position: 7
id: plugin-google-gtag
title: '📦 plugin-google-gtag'
slug: '/api/plugins/@docusaurus/plugin-google-gtag'
---

import APITable from '@site/src/components/APITable';

The default [Global Site Tag (gtag.js)](https://developers.google.com/analytics/devguides/collection/gtagjs/) plugin. It is a JavaScript tagging framework and API that allows you to send event data to Google Analytics, Google Ads, and Google Marketing Platform. This section describes how to configure a Docusaurus site to enable global site tag for Google Analytics.

:::tip

You can use [Google's Tag Assistant](https://tagassistant.google.com/) tool to check if your gtag is set up correctly!

:::

:::caution production only

This plugin is always inactive in development and **only active in production** to avoid polluting the analytics statistics.

:::

## Installation {#installation}

```bash npm2yarn
npm install --save @docusaurus/plugin-google-gtag
```

:::tip

If you use the preset `@docusaurus/preset-classic`, you don't need to install this plugin as a dependency.

You can configure this plugin through the preset options.

:::

## Configuration {#configuration}

Accepted fields:

<APITable>

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `trackingID` | `string` | **Required** | The tracking ID of your gtag service. |
| `anonymizeIP` | `boolean` | `false` | Whether the IP should be anonymized when sending requests. |

</APITable>

### Example configuration {#ex-config}

You can configure this plugin through preset options or plugin options.

:::tip

Most Docusaurus users configure this plugin through the preset options.

:::

```js config-tabs
// preset option name: gtag
// plugin name: @docusaurus/plugin-google-gtag

const config = {
  trackingID: '141789564',
  anonymizeIP: true,
};
```
