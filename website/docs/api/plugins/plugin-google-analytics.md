---
sidebar_position: 6
id: plugin-google-analytics
title: '📦 plugin-google-analytics'
slug: '/api/plugins/@docusaurus/plugin-google-analytics'
---

```mdx-code-block
import APITable from '@site/src/components/APITable';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The default [Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/) plugin. It is a JavaScript library for measuring how users interact with your website **in the production build**. If you are using Google Analytics 4 you might need to consider using [plugin-google-gtag](./plugin-google-gtag.md) instead.

:::info production only

This plugin is always inactive in development and **only active in production** to avoid polluting the analytics statistics.

:::

## Installation {#installation}

```bash npm2yarn
npm install --save @docusaurus/plugin-google-analytics
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
| `trackingID` | `string` | **Required** | The tracking ID of your analytics service. |
| `anonymizeIP` | `boolean` | `false` | Whether the IP should be anonymized when sending requests. |

</APITable>

## Example configuration {#ex-config}

You can configure this plugin through preset options or plugin options.

:::tip

Most Docusaurus users configure this plugin through the preset options.

:::

<Tabs>
<TabItem value="Preset Options">

If you use a preset, configure this plugin through the [preset options](presets.md#docusauruspreset-classic):

```js title="docusaurus.config.js"
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // highlight-start
        googleAnalytics: {
          trackingID: 'UA-141789564-1',
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
      '@docusaurus/plugin-google-analytics',
      // highlight-start
      {
        trackingID: 'UA-141789564-1',
        anonymizeIP: true,
      },
      // highlight-end
    ],
  ],
};
```

</TabItem>
</Tabs>
