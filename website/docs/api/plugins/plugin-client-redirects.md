---
id: plugin-client-redirects
title: '📦 plugin-client-redirects'
slug: '/api/plugins/@docusaurus/plugin-client-redirects'
---

Docusaurus Plugin to generate **client-side redirects**.

This plugin will write additional HTML pages to your static site, that redirects the user to your existing Docusaurus pages with JavaScript.

:::note

This plugin only create redirects for the production build.

:::

:::caution

It is better to use server-side redirects whenever possible.

Before using this plugin, you should look if your hosting provider doesn't offer this feature.

:::

## Installation

```bash npm2yarn
npm install --save @docusaurus/plugin-client-redirects
```

## Configuration

Main usecase: you have `/myDocusaurusPage`, and you want to redirect to this page from `/myDocusaurusPage.html`:

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html'],
      },
    ],
  ],
};
```

Second usecase: you have `/myDocusaurusPage.html`, and you want to redirect to this page from `/myDocusaurusPage`.

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        toExtensions: ['html'],
      },
    ],
  ],
};
```

For custom redirect logic, provide your own `createRedirects` function.

Let's imagine you change the url of an existing page, you might want to make sure the old url still works:

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/docs/newDocPath', // string
            from: ['/docs/oldDocPathFrom2019', '/docs/legacyDocPathFrom2016'], // string | string[]
          },
        ],
      },
    ],
  ],
};
```

It's possible to use a function to create the redirects for each existing path:

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        createRedirects: function (existingPath) {
          if (existingPath === '/docs/newDocPath') {
            return ['/docs/oldDocPathFrom2019', '/docs/legacyDocPathFrom2016']; // string | string[]
          }
        },
      },
    ],
  ],
};
```

Finally, it's possible to use all options at the same time:

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html', 'htm'],
        toExtensions: ['exe', 'zip'],
        redirects: [
          {
            to: '/docs/newDocPath',
            from: '/docs/oldDocPath',
          },
        ],
        createRedirects: function (existingPath) {
          if (existingPath === '/docs/newDocPath2') {
            return ['/docs/oldDocPath2'];
          }
        },
      },
    ],
  ],
};
```
