---
id: cli
title: CLI
---

Docusaurus provides a set of scripts to help you generate, serve, and deploy your website.

Once your website is bootstrapped, the website source will contain the Docusaurus scripts that you can invoke with your package manager:

```json title="package.json"
{
  // ...
  "scripts": {
    "docusaurus": "docusaurus",
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy",
    "clear": "docusaurus clear",
    "serve": "docusaurus serve",
    "write-translations": "docusaurus write-translations",
    "write-heading-ids": "docusaurus write-heading-ids"
  }
}
```

## Index {#index}

import TOCInline from "@theme/TOCInline"

<TOCInline toc={toc[1].children}/>

## Docusaurus CLI commands {#docusaurus-cli-commands}

Below is a list of Docusaurus CLI commands and their usages:

### `docusaurus start [siteDir]` {#docusaurus-start-sitedir}

Builds and serves a preview of your site locally with [Webpack Dev Server](https://webpack.js.org/configuration/dev-server).

#### Options {#options}

| Name | Default | Description |
| --- | --- | --- |
| `--port` | `3000` | Specifies the port of the dev server. |
| `--host` | `localhost` | Specify a host to use. For example, if you want your server to be accessible externally, you can use `--host 0.0.0.0`. |
| `--hot-only` | `false` | Enables Hot Module Replacement without page refresh as fallback in case of build failures. More information [here](https://webpack.js.org/configuration/dev-server/#devserverhotonly). |
| `--no-open` | `false` | Do not open automatically the page in the browser. |
| `--config` | `undefined` | Path to docusaurus config file, default to `[siteDir]/docusaurus.config.js` |
| `--poll [optionalIntervalMs]` | `false` | Use polling of files rather than watching for live reload as a fallback in environments where watching doesn't work. More information [here](https://webpack.js.org/configuration/watch/#watchoptionspoll). |

:::important

Please note that some functionality (for example, anchor links) will not work in development. The functionality will work as expected in production.

:::

#### Enabling HTTPS` {#enabling-https}

There are multiple ways to obtain a certificate. We will use [mkcert](https://github.com/FiloSottile/mkcert) as an example.

1. Run `mkcert localhost` to generate `localhost.pem` + `localhost-key.pem`

2. Run `mkcert -install` to install the cert in your trust store, and restart your browser

3. Start the app with Docusaurus HTTPS env variables:

```shell
HTTPS=true SSL_CRT_FILE=localhost.pem SSL_KEY_FILE=localhost-key.pem yarn start
```

4. Open `https://localhost:3000/`

### `docusaurus build [siteDir]` {#docusaurus-build-sitedir}

Compiles your site for production.

#### Options {#options-1}

| Name | Default | Description |
| --- | --- | --- |
| `--bundle-analyzer` | `false` | Analyze your bundle with the [webpack bundle analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer). |
| `--out-dir` | `build` | The full path for the new output directory, relative to the current workspace. |
| `--config` | `undefined` | Path to docusaurus config file, default to `[siteDir]/docusaurus.config.js` |
| `--no-minify` | `false` | Build website without minimizing JS/CSS bundles. |

:::info

For advanced minification of CSS bundle, we use the [advanced cssnano preset](https://github.com/cssnano/cssnano/tree/master/packages/cssnano-preset-advanced) (along with additional several PostCSS plugins) and [level 2 optimization of clean-css](https://github.com/jakubpawlowicz/clean-css#level-2-optimizations). If as a result of this advanced CSS minification you find broken CSS, build your website with the environment variable `USE_SIMPLE_CSS_MINIFIER=true` to minify CSS with the [default cssnano preset](https://github.com/cssnano/cssnano/tree/master/packages/cssnano-preset-default). **Please [fill out an issue](https://github.com/facebook/docusaurus/issues/new?labels=bug%2C+needs+triage&template=bug.md) if you experience CSS minification bugs.**

:::

### `docusaurus swizzle [siteDir]` {#docusaurus-swizzle-sitedir}

:::caution

We highly discourage swizzling of components until we've reached a Beta stage. The components APIs have been changing rapidly and are likely to keep changing until we reach Beta. Stick with the default appearance for now if possible to save yourself some potential pain in future.

:::

Change any Docusaurus theme components to your liking with `npm run swizzle`.

```bash npm2yarn
npm run swizzle [themeName] [componentName] [siteDir]

# Example (leaving out the siteDir to indicate this directory)
npm run swizzle @docusaurus/theme-classic DocSidebar
```

Running the command will copy the relevant theme files to your site folder. You may then make any changes to it and Docusaurus will use it instead of the one provided from the theme.

`npm run swizzle` without `themeName` lists all the themes available for swizzling similarly `npm run swizzle <themeName>` without `componentName` lists all the components available for swizzling.

#### Options {#options-2}

| Name               | Description                            |
| ------------------ | -------------------------------------- |
| `themeName`        | The name of the theme you are using.   |
| `swizzleComponent` | The name of the component to swizzle.  |
| `--danger`         | Allow swizzling of unstable components |
| `--typescript`     | Swizzle TypeScript components          |

An example to use `--danger` flag let's consider the below code:

```bash npm2yarn
npm run swizzle @docusaurus/theme-classic Logo -- --danger
```

:::caution

Unstable Components: components that have a higher risk of breaking changes due to internal refactorings.

:::

To unswizzle a component, simply delete the files of the swizzled component.

<!--
TODO a separate section for swizzle tutorial.
To learn more about swizzling, check [here](#).
-->

### `docusaurus deploy [siteDir]` {#docusaurus-deploy-sitedir}

Deploys your site with [GitHub Pages](https://pages.github.com/). Check out the docs on [deployment](deployment.mdx#deploying-to-github-pages) for more details.

#### Options {#options-3}

| Name | Default | Description |
| --- | --- | --- |
| `--out-dir` | `build` | The full path for the new output directory, relative to the current workspace. |
| `--skip-build` | `false` | Deploy website without building it. This may be useful when using custom deploy script. |
| `--config` | `undefined` | Path to docusaurus config file, default to `[siteDir]/docusaurus.config.js` |

### `docusaurus serve [siteDir]` {#docusaurus-serve-sitedir}

Serve your built website locally.

| Name | Default | Description |
| --- | --- | --- |
| `--port` | `3000` | Use specified port |
| `--dir` | `build` | The full path for the output directory, relative to the current workspace |
| `--build` | `false` | Build website before serving |
| `--config` | `undefined` | Path to docusaurus config file, default to `[siteDir]/docusaurus.config.js` |
| `--host` | `localhost` | Specify a host to use. For example, if you want your server to be accessible externally, you can use `--host 0.0.0.0`. |

### `docusaurus clear [siteDir]` {#docusaurus-clear-sitedir}

Clear a Docusaurus site's generated assets, caches, build artifacts.

We recommend running this command before reporting bugs, after upgrading versions, or anytime you have issues with your Docusaurus site.

### `docusaurus write-translations [siteDir]` {#docusaurus-write-translations-sitedir}

Write the JSON translation files that you will have to translate.

By default, the files are written in `website/i18n/<defaultLocale>/...`.

| Name | Default | Description |
| --- | --- | --- |
| `--locale` | `<defaultLocale>` | Define which locale folder you want to write translations the JSON files in |
| `--override` | `false` | Override existing translation messages |
| `--config` | `undefined` | Path to docusaurus config file, default to `[siteDir]/docusaurus.config.js` |
| `--messagePrefix` | `''` | Allows to add a prefix to each translation message, to help you highlight untranslated strings |

### `docusaurus write-heading-ids [siteDir]` {#docusaurus-write-heading-ids-sitedir}

Add [explicit heading ids](./guides/markdown-features/markdown-features-headings.mdx#explicit-ids) to the Markdown documents of your site.
