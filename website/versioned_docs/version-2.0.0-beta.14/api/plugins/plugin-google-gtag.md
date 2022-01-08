---
sidebar_position: 7
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

Accepted fields:

<small>

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `trackingID` | `string` | **Required** | The tracking ID of your gtag service. |
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
        gtag: {
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
      '@docusaurus/plugin-google-gtag',
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
