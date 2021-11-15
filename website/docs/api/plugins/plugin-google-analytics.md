---
sidebar_position: 6
id: plugin-google-analytics
title: '📦 plugin-google-analytics'
slug: '/api/plugins/@docusaurus/plugin-google-analytics'
---

The default [Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/) plugin. It is a JavaScript library for measuring how users interact with your website **in the production build**. If you are using Google Analytics 4 you might need to consider using [plugin-google-gtag](./plugin-google-gtag.md) instead.

## Installation {#installation}

```bash npm2yarn
npm install --save @docusaurus/plugin-google-analytics
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency.

:::

## Configuration {#configuration}

Accepted fields:

<small>

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `trackingID` | `string` | **Required** | The tracking ID of your analytics service. |
| `anonymizeIP` | `boolean` | `false` | Whether the IP should be anonymized when sending requests. |

</small>

## Example configuration {#ex-config}

Here's an example configuration object.

You can provide it as [preset options](#ex-config-preset) or [plugin options](#ex-config-plugin).

:::tip

Most Docusaurus users configure this plugin through the [preset options](#ex-config-preset).

:::

```js
const config = {
  trackingID: 'UA-141789564-1',
  anonymizeIP: true,
};
```

### Preset options {#ex-config-preset}

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

### Plugin options {#ex-config-plugin}

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
