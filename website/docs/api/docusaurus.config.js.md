---
sidebar_position: 0
id: docusaurus.config.js
description: API reference for Docusaurus configuration file.
slug: /api/docusaurus-config
---

# `docusaurus.config.js`

## Overview {#overview}

`docusaurus.config.js` contains configurations for your site and is placed in the root directory of your site.

It usually exports a site configuration object:

```js title="docusaurus.config.js"
module.exports = {
  // site config...
};
```

<details>
<summary>Config files also support config creator functions and async code.</summary>

```js title="docusaurus.config.js"
module.exports = function configCreator() {
  return {
    // site config...
  };
};
```

```js title="docusaurus.config.js"
module.exports = async function configCreatorAsync() {
  return {
    // site config...
  };
};
```

```js title="docusaurus.config.js"
module.exports = Promise.resolve({
  // site config...
});
```

</details>

## Required fields {#required-fields}

### `title` {#title}

- Type: `string`

Title for your website.

```js title="docusaurus.config.js"
module.exports = {
  title: 'Docusaurus',
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

Base URL for your site. This can also be considered the path after the host. For example, `/metro/` is the base URL of https://facebook.github.io/metro/. For URLs that have no path, the baseUrl should be set to `/`. This field is related to the [url](#url) field.

```js title="docusaurus.config.js"
module.exports = {
  baseUrl: '/',
};
```

## Optional fields {#optional-fields}

### `favicon` {#favicon}

- Type: `string | undefined`

Path to your site favicon. For example, if your favicon is in `static/img/favicon.ico`:

```js title="docusaurus.config.js"
module.exports = {
  favicon: '/img/favicon.ico',
};
```

### `trailingSlash` {#trailing-slash}

- Type: `boolean | undefined`

Allow to customize the presence/absence of a trailing slash at the end of URLs/links, and how static HTML files are generated:

- `undefined` (default): keeps URLs untouched, and emit `/docs/myDoc/index.html` for `/docs/myDoc.md`
- `true`: add trailing slashes to URLs/links, and emit `/docs/myDoc/index.html` for `/docs/myDoc.md`
- `false`: remove trailing slashes from URLs/links, and emit `/docs/myDoc.html` for `/docs/myDoc.md`

:::tip

Each static hosting provider serves static files differently (this behavior may even change over time).

Refer to the [deployment guide](../deployment.mdx) and [slorber/trailing-slash-guide](https://github.com/slorber/trailing-slash-guide) to choose the appropriate setting.

:::

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
- `direction`: `ltr` (default) or `rtl` (for [right-to-left languages](https://developer.mozilla.org/en-US/docs/Glossary/rtl) like Arabic, Hebrew, etc.)

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

### `deploymentBranch` {#deploymentbranch}

- Type: `string`

The name of the branch to deploy the static files to. Used by the deployment command.

```js title="docusaurus.config.js"
module.exports = {
  deploymentBranch: 'gh-pages',
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

### `githubPort` {#githubPort}

- Type: `string`

The port of your server. Useful if you are using GitHub Enterprise.

```js title="docusaurus.config.js"
module.exports = {
  githubPort: '22',
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
        width: 32,
        height: 32,
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
        width: 160,
        height: 51,
      },
      copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`, // You can also put own HTML here
    },
  },
};
```

### `plugins` {#plugins}

- Type: `PluginConfig[]`

```ts
type PluginConfig = string | [string, any] | PluginModule | [PluginModule, any];
```

See [plugin method references](./plugin-methods/README.md) for the shape of a `PluginModule`.

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    'docusaurus-plugin-awesome',
    ['docusuarus-plugin-confetti', {fancy: false}],
    () => ({
      postBuild() {
        console.log('Build finished');
      },
    }),
  ],
};
```

### `themes` {#themes}

- Type: `PluginConfig[]`

```js title="docusaurus.config.js"
module.exports = {
  themes: ['@docusaurus/theme-classic'],
};
```

### `presets` {#presets}

- Type: `PresetConfig[]`

```ts
type PresetConfig = string | [string, any];
```

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

Attempting to add unknown fields in the config will lead to errors during build time:

```bash
Error: The field(s) 'foo', 'bar' are not recognized in docusaurus.config.js
```

### `staticDirectories` {#staticdirectories}

An array of paths, relative to the site's directory or absolute. Files under these paths will be copied to the build output as-is.

- Type: `string[]`

Example:

```js title="docusaurus.config.js"
module.exports = {
  staticDirectories: ['static'],
};
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
      src: 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
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

See also: [`getClientModules()`](./plugin-methods/lifecycle-apis.md#getClientModules).

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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="Docusaurus v<%= it.version %>">
    <% if (it.noIndex) { %>
      <meta name="robots" content="noindex, nofollow" />
    <% } %>
    <%~ it.headTags %>
    <% it.metaAttributes.forEach((metaAttribute) => { %>
      <%~ metaAttribute %>
    <% }); %>
    <% it.stylesheets.forEach((stylesheet) => { %>
      <link rel="stylesheet" href="<%= it.baseUrl %><%= stylesheet %>" />
    <% }); %>
    <% it.scripts.forEach((script) => { %>
      <link rel="preload" href="<%= it.baseUrl %><%= script %>" as="script">
    <% }); %>
  </head>
  <body <%~ it.bodyAttributes %>>
    <%~ it.preBodyTags %>
    <div id="__docusaurus">
      <%~ it.appHtml %>
    </div>
    <% it.scripts.forEach((script) => { %>
      <script src="<%= it.baseUrl %><%= script %>"></script>
    <% }); %>
    <%~ it.postBodyTags %>
  </body>
</html>`,
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

This banner needs to inline CSS / JS in case all asset loading fails due to wrong base URL.

If you have a strict [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), you should rather disable it.

:::
