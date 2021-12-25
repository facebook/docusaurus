---
sidebar_position: 7
id: plugin-google-gtag
title: '📦 plugin-google-gtag'
slug: '/api/plugins/@docusaurus/plugin-google-gtag'
---

```mdx-code-block
import APITable from '@site/src/components/APITable';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The default [Global Site Tag (gtag.js)](https://developers.google.com/analytics/devguides/collection/gtagjs/) plugin. It is a JavaScript tagging framework and API that allows you to send event data to Google Analytics, Google Ads, and Google Marketing Platform. This section describes how to configure a Docusaurus site to enable global site tag for Google Analytics.

:::tip

You can use [Google's Tag Assistant](https://tagassistant.google.com/) tool to check if your gtag is set up correctly!

:::

:::info production only

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

## Example configuration {#ex-config}

You can configure this plugin through preset options or plugin options.

:::tip

Most Docusaurus users configure this plugin through the preset options.

:::

<Tabs>
<TabItem value="Preset Options">

```js title="docusaurus.config.js"
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // highlight-start
        gtag: {
          trackingID: '141789564',
          anonymizeIP: true,
        },
        // highlight-end
      },
    ],
  ],
};
```

</TabItem>
<TabItem value="Plugin Options">

If you are using a standalone plugin, provide options directly to the plugin:

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-google-gtag',
      // highlight-start
      {
        trackingID: '141789564',
        anonymizeIP: true,
      },
      // highlight-end
    ],
  ],
};
```

</TabItem>
</Tabs>
