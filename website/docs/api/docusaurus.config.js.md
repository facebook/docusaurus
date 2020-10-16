---
id: docusaurus.config.js
title: docusaurus.config.js
description: API reference for Docusaurus configuration file.
slug: /docusaurus.config.js
---

## Overview

`docusaurus.config.js` contains configurations for your site and is placed in the root directory of your site.

## Required fields

### `title`

- Type: `string`

Title for your website.

```js title="docusaurus.config.js"
module.exports = {
  title: 'Docusaurus',
};
```

### `favicon`

- Type: `string`

URL for site favicon. Example:

```js title="docusaurus.config.js"
module.exports = {
  favicon: 'https://v2.docusaurus.io/favicon.ico',
};
```

You can also use the favicon URL relative to the `static` directory of your site. For example, your site has the following directory structure:

```bash
.
├── README.md
├ # ... other files in root directory
└─ static
    └── img
        └── favicon.ico
```

So you can refer it like below:

```js title="docusaurus.config.js"
module.exports = {
  favicon: 'img/favicon.ico',
};
```

### `url`

- Type: `string`

URL for your website. This can also be considered the top-level hostname. For example, `https://facebook.github.io` is the URL of https://facebook.github.io/metro/, and `https://docusaurus.io` is the URL for https://docusaurus.io. This field is related to the [baseUrl](#baseurl) field.

```js title="docusaurus.config.js"
module.exports = {
  url: 'https://docusaurus.io',
};
```

### `baseUrl`

- Type: `string`

Base URL for your site. This can also be considered the path after the host. For example, `/metro/` is the baseUrl of https://facebook.github.io/metro/. For URLs that have no path, the baseUrl should be set to `/`. This field is related to the [url](#url) field.

```js title="docusaurus.config.js"
module.exports = {
  baseUrl: '/',
};
```

## Optional fields

### `noIndex`

- Type: `boolean`

This option adds `<meta name="robots" content="noindex, nofollow">` in pages, to tell search engines to avoid indexing your site (more information [here](https://moz.com/learn/seo/robots-meta-directives)).

Example:

```js title="docusaurus.config.js"
module.exports = {
  noIndex: true, // Defaults to `false`
};
```

### `onBrokenLinks`

- Type: `'ignore' | 'log' | 'warn' | 'error' | 'throw'`

The behavior of Docusaurus, when it detects any broken link.

By default, it throws an error, to ensure you never ship any broken link, but you can lower this security if needed.

:::note

The broken links detection is only available for a production build (`docusaurus build`).

:::

### `onDuplicateRoutes`

- Type: `'ignore' | 'log' | 'warn' | 'error' | 'throw'`

The behavior of Docusaurus when it detects any [duplicate routes](/guides/creating-pages.md#duplicate-routes).

By default, it displays a warning after you run `yarn start` or `yarn build`.

### `tagline`

- Type: `string`

The tagline for your website.

```js title="docusaurus.config.js"
module.exports = {
  tagline:
    'Docusaurus makes it easy to maintain Open Source documentation websites.',
};
```

### `organizationName`

- Type: `string`

The GitHub user or organization that owns the repository. Used by the deployment command.

```js title="docusaurus.config.js"
module.exports = {
  // Docusaurus' organization is facebook
  organizationName: 'facebook',
};
```

### `projectName`

- Type: `string`

The name of the GitHub repository. Used by the deployment command.

```js title="docusaurus.config.js"
module.exports = {
  projectName: 'docusaurus',
};
```

### `githubHost`

- Type: `string`

The hostname of your server. Useful if you are using GitHub Enterprise.

```js title="docusaurus.config.js"
module.exports = {
  githubHost: 'github.com',
};
```

### `themeConfig`

- Type: `Object`

<!-- TODO: explain that theme configurations will be consumed by the theme, and link to theme doc -->

An object containing data needed by the theme you use.<!--, see [theme configurations](#).-->

For Docusaurus' default theme _classic_, we use `themeConfig` to customize your navbar and footer links:

Example:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
      switchConfig: {
        darkIcon: '🌙',
        lightIcon: '\u2600',
        // React inline style object
        // see https://reactjs.org/docs/dom-elements.html#style
        darkIconStyle: {
          marginLeft: '2px',
        },
        lightIconStyle: {
          marginLeft: '1px',
        },
      },
    },
    navbar: {
      title: 'Site Title',
      logo: {
        alt: 'Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/docusaurus.config.js',
          activeBasePath: 'docs',
          label: 'docusaurus.config.js',
          position: 'left',
        },
        // ... other links
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: 'docs/doc1',
            },
          ],
        },
        // ... other links
      ],
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'https://docusaurus.io/img/oss_logo.png',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`, // You can also put own HTML here
    },
  },
};
```

### `plugins`

<!-- TODO: configuration for plugins -->

- Type: `any[]`

```js title="docusaurus.config.js"
module.exports = {
  plugins: [],
};
```

### `themes`

<!-- TODO: configuration for plugins -->

- Type: `any[]`

```js title="docusaurus.config.js"
module.exports = {
  themes: [],
};
```

### `presets`

<!-- TODO: configuration for presets -->

- Type: `any[]`

```js title="docusaurus.config.js"
module.exports = {
  presets: [],
};
```

### `customFields`

Docusaurus guards `docusaurus.config.js` from unknown fields. To add a custom field, define it on `customFields`.

- Type: `Object`

```js title="docusaurus.config.js"
module.exports = {
  customFields: {
    admin: 'endi',
    superman: 'lol',
  },
};
```

Attempting to add unknown field in the config will lead to error in build time:

```bash
Error: The field(s) 'foo', 'bar' are not recognized in docusaurus.config.js
```

### `scripts`

An array of scripts to load. The values can be either strings or plain objects of attribute-value maps. The `<script>` tags will be inserted in the HTML `<head>`.

Note that `<script>` added here are render-blocking so you might want to add `async: true`/`defer: true` to the objects.

- Type: `(string | Object)[]`

Example:

```js title="docusaurus.config.js"
module.exports = {
  scripts: [
    // String format.
    'https://docusaurus.io/script.js',
    // Object format.
    {
      src:
        'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
      async: true,
    },
  ],
};
```

### `clientModules`

An array of client modules to load globally on your site:

Example:

```js title="docusaurus.config.js"
module.exports = {
  clientModules: [
    require.resolve('./mySiteGlobalJs.js'),
    require.resolve('./mySiteGlobalCss.css'),
  ],
};
```

See also: [`getClientModules()`](lifecycle-apis.md#getclientmodules).

### `ssrTemplate`

An HTML template written in [Eta's syntax](https://eta.js.org/docs/syntax#syntax-overview) that will be used to render your application. This can be used to set custom attributes on the `body` tags, additional `meta` tags, customize the `viewport`, etc. Please note that Docusaurus will rely on the template to be correctly structured in order to function properly, once you do customize it, you will have to make sure that your template is compliant with the requirements from `upstream`.

- Type: `string`

Example:

```js title="docusaurus.config.js"
module.exports = {
  ssrTemplate: `<!DOCTYPE html>
<html <%~ it.htmlAttributes %>>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=3.0, minimum-scale=0.86">
    <meta name="generator" content="Docusaurus v<%= it.version %>">
    <%~ it.headTags %>
    <% it.metaAttributes.forEach((metaAttribute) => { %>
      <%~ metaAttribute %>
    <% }); %>
    <% it.stylesheets.forEach((stylesheet) => { %>
      <link rel="stylesheet" type="text/css" href="<%= it.baseUrl %><%= stylesheet %>" />
    <% }); %>
    <% it.scripts.forEach((script) => { %>
      <link rel="preload" href="<%= it.baseUrl %><%= script %>" as="script">
    <% }); %>
  </head>
  <body <%~ it.bodyAttributes %> itemscope="" itemtype="http://schema.org/Organization">
    <%~ it.preBodyTags %>
    <div id="__docusaurus">
      <%~ it.appHtml %>
    </div>
    <div id="outside-docusaurus">
      <span>Custom markup</span>
    </div>
    <% it.scripts.forEach((script) => { %>
      <script type="text/javascript" src="<%= it.baseUrl %><%= script %>"></script>
    <% }); %>
    <%~ it.postBodyTags %>
  </body>
</html>
};
```

### `stylesheets`

An array of CSS sources to load. The values can be either strings or plain objects of attribute-value maps. The `<link>` tags will be inserted in the HTML `<head>`.

- Type: `(string | Object)[]`

Example:

```js title="docusaurus.config.js"
module.exports = {
  stylesheets: [
    // String format.
    'https://docusaurus.io/style.css',
    // Object format.
    {
      href: 'http://mydomain.com/style.css',
      type: 'text/css',
    },
  ],
};
```

### `titleDelimiter`

- Type: `string`

A string that will be used as title delimiter in the generated `<title>` tag.

Example:

```js title="docusaurus.config.js"
module.exports = {
  titleDelimiter: '🦖', // Defaults to `|`
};
```
