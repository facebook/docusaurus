---
sidebar_position: 10
id: plugin-sitemap
title: '📦 plugin-sitemap'
slug: '/api/plugins/@docusaurus/plugin-sitemap'
---

```mdx-code-block
import APITable from '@site/src/components/APITable';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This plugin creates sitemaps for your site so that search engine crawlers can crawl your site more accurately.

:::info production only

This plugin is always inactive in development and **only active in production** because it works on the build output.

:::

## Installation {#installation}

```bash npm2yarn
npm install --save @docusaurus/plugin-sitemap
```

:::tip

If you use the preset `@docusaurus/preset-classic`, you don't need to install this plugin as a dependency.

You can configure this plugin through the [preset options](#ex-config-preset).

:::

## Configuration {#configuration}

Accepted fields:

<APITable>

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `changefreq` | `string` | `'weekly'` | See [sitemap docs](https://www.sitemaps.org/protocol.html#xmlTagDefinitions) |
| `priority` | `number` | `0.5` | See [sitemap docs](https://www.sitemaps.org/protocol.html#xmlTagDefinitions) |

</APITable>

### Example configuration {#ex-config}

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
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
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
      '@docusaurus/plugin-sitemap',
      // highlight-start
      {
        changefreq: 'weekly',
        priority: 0.5,
      },
      // highlight-end
    ],
  ],
};
```

</TabItem>
</Tabs>
