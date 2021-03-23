---
id: docusaurus.config.js
title: docusaurus.config.js
description: API reference for Docusaurus configuration file.
slug: /docusaurus.config.js
---

## Overview {#overview}

`docusaurus.config.js` contains configurations for your site and is placed in the root directory of your site.

## Required fields {#required-fields}

### `title` {#title}

- Type: `string`

Title for your website.

```js title="docusaurus.config.js"
module.exports = {
  title: 'Docusaurus',
};
```

### `favicon` {#favicon}

- Type: `string`

URL for site favicon. Example:

```js title="docusaurus.config.js"
module.exports = {
  favicon: 'https://docusaurus.io/favicon.ico',
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

### `url` {#url}

- Type: `string`

URL for your website. This can also be considered the top-level hostname. For example, `https://facebook.github.io` is the URL of https://facebook.github.io/metro/, and `https://docusaurus.io` is the URL for https://docusaurus.io. This field is related to the [baseUrl](#baseurl) field.

```js title="docusaurus.config.js"
module.exports = {
  url: 'https://docusaurus.io',
};
```

### `baseUrl` {#baseurl}

- Type: `string`

Base URL for your site. This can also be considered the path after the host. For example, `/metro/` is the baseUrl of https://facebook.github.io/metro/. For URLs that have no path, the baseUrl should be set to `/`. This field is related to the [url](#url) field.

```js title="docusaurus.config.js"
module.exports = {
  baseUrl: '/',
};
```

## Optional fields {#optional-fields}

### `i18n` {#i18n}

- Type: `Object`

The i18n configuration object to [localize your site](../i18n/i18n-introduction.md).

Example:

```js title="docusaurus.config.js"
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      },
      fr: {
        label: 'Français',
        direction: 'ltr',
      },
    },
  },
};
```

- `label`: the label to use for this locale
- `direction`: `ltr` (default) or `rtl` (for [right-to-left languages](https://developer.mozilla.org/en-US/docs/Glossary/rtl) like Araric, Hebrew, etc.)

### `noIndex` {#noindex}

- Type: `boolean`

This option adds `<meta name="robots" content="noindex, nofollow">` in pages, to tell search engines to avoid indexing your site (more information [here](https://moz.com/learn/seo/robots-meta-directives)).

Example:

```js title="docusaurus.config.js"
module.exports = {
  noIndex: true, // Defaults to `false`
};
```

### `onBrokenLinks` {#onbrokenlinks}

- Type: `'ignore' | 'log' | 'warn' | 'error' | 'throw'`

The behavior of Docusaurus, when it detects any broken link.

By default, it throws an error, to ensure you never ship any broken link, but you can lower this security if needed.

:::note

The broken links detection is only available for a production build (`docusaurus build`).

:::

### `onBrokenMarkdownLinks` {#onbrokenmarkdownlinks}

- Type: `'ignore' | 'log' | 'warn' | 'error' | 'throw'`

The behavior of Docusaurus, when it detects any broken markdown link.

By default, it prints a warning, to let you know about your broken markdown link, but you can change this security if needed.

### `onDuplicateRoutes` {#onduplicateroutes}

- Type: `'ignore' | 'log' | 'warn' | 'error' | 'throw'`

The behavior of Docusaurus when it detects any [duplicate routes](/guides/creating-pages.md#duplicate-routes).

By default, it displays a warning after you run `yarn start` or `yarn build`.

### `tagline` {#tagline}

- Type: `string`

The tagline for your website.

```js title="docusaurus.config.js"
module.exports = {
  tagline:
    'Docusaurus makes it easy to maintain Open Source documentation websites.',
};
```

### `organizationName` {#organizationname}

- Type: `string`

The GitHub user or organization that owns the repository. Used by the deployment command.

```js title="docusaurus.config.js"
module.exports = {
  // Docusaurus' organization is facebook
  organizationName: 'facebook',
};
```

### `projectName` {#projectname}

- Type: `string`

The name of the GitHub repository. Used by the deployment command.

```js title="docusaurus.config.js"
module.exports = {
  projectName: 'docusaurus',
};
```

### `githubHost` {#githubhost}

- Type: `string`

The hostname of your server. Useful if you are using GitHub Enterprise.

```js title="docusaurus.config.js"
module.exports = {
  githubHost: 'github.com',
};
```

### `themeConfig` {#themeconfig}

- Type: `Object`

The [theme configuration](./themes/theme-configuration.md) object, to customize your site UI like navbar, footer.

Example:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    hideableSidebar: false,
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

### `plugins` {#plugins}

<!-- TODO: configuration for plugins -->

- Type: `any[]`

```js title="docusaurus.config.js"
module.exports = {
  plugins: [],
};
```

### `themes` {#themes}

<!-- TODO: configuration for plugins -->

- Type: `any[]`

```js title="docusaurus.config.js"
module.exports = {
  themes: [],
};
```

### `presets` {#presets}

<!-- TODO: configuration for presets -->

- Type: `any[]`

```js title="docusaurus.config.js"
module.exports = {
  presets: [],
};
```

### `customFields` {#customfields}

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

### `scripts` {#scripts}

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

### `clientModules` {#clientmodules}

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

### `ssrTemplate` {#ssrtemplate}

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

### `stylesheets` {#stylesheets}

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

### `titleDelimiter` {#titledelimiter}

- Type: `string`

A string that will be used as title delimiter in the generated `<title>` tag.

Example:

```js title="docusaurus.config.js"
module.exports = {
  titleDelimiter: '🦖', // Defaults to `|`
};
```

### `baseUrlIssueBanner` {#baseurlissuebanner}

- Type: `boolean`

When enabled, will show a banner in case your site can't load its CSS or JavaScript files, which is a very common issue, often related to a wrong `baseUrl` in site config.

Example:

```js title="docusaurus.config.js"
module.exports = {
  baseUrlIssueBanner: true, // Defaults to `true`
};
```

![baseUrlIssueBanner](/img/baseUrlIssueBanner.png)

:::caution

This banner need to inline CSS / JS.

If you have a strict [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), you should rather disable it.

:::
