---
id: cli
title: CLI
---

Docusaurus provides a set of scripts to help you generate, serve, and deploy your website.

Once your website is generated, your website package will contain the Docusaurus scripts that you may invoke with your package manager:

```json title="package.json"
{
  // ...
  "scripts": {
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy"
  }
}
```

## Docusaurus CLI commands

Below is a list of Docusaurus CLI commands and their usages:

<!-- TODO: init docs after the init command is implemented

### `docusaurus init`

The `docusaurus init` command is intended to be used with `docusaurus` installed globally:

```shell
$ yarn global add docusaurus
# or
$ npm install --global docusaurus
```
-->

### `docusaurus start`

Builds and serves the static site with [Webpack Dev Server](https://webpack.js.org/configuration/dev-server).

**options**

| Options | Default | Description |
| --- | --- | --- |
| `--port` | `3000` | Specifies the port of the dev server |
| `--host` | `localhost` | Specify a host to use. E.g., if you want your server to be accessible externally, you can use `--host 0.0.0.0` |
| `--hot-only` | `false` | Enables Hot Module Replacement without page refresh as fallback in case of build failures. More information [here](https://webpack.js.org/configuration/dev-server/#devserverhotonly). |
| `--no-open` | `false` | Do not open automatically the page in the browser. |

:::important

Please note that some functionality (for example, anchor links) will not work in dev server. When building the website, all the functionality will work as expected.

:::

### `docusaurus build`

Compiles your site for production.

**options**

| Options | Default | Description |
| --- | --- | --- |
| `--bundle-analyzer` |  | Analyze your bundle with [bundle analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) |
| `--out-dir` | `build` | The full path for the new output directory, relative to the current workspace. |
| `--no-minify` | `false` | Build website without minimizing JS/CSS bundles. |

### `docusaurus swizzle`

:::caution

We would like to discourage swizzling of components until we've minimally reached a Beta stage. The components APIs have been changing rapidly and are likely to keep changing until we reach Beta. Stick with the default appearance for now if possible to save yourself some potential pain in future.

:::

Swizzle any Docusaurus Theme components with your own component with `docusaurus swizzle`.

```shell
docusaurus swizzle <themeName> [componentName] [siteDir]
```

**params**

- `themeName`: name of the theme you are using
- `swizzleComponent`: name of the component to be swizzled

Running the above command will copy the relevant theme files to your site folder. You may then make any changes to it and Docusaurus will use it instead of the one provided from the theme.

To unswizzle a component, simply delete the files of the swizzled component.

<!-- TODO a separate section for swizzle tutorial -->

To learn more about swizzling, check [here](#).

### `docusaurus deploy`

Deploys your site with [GitHub Pages](https://pages.github.com/).

**options**

| Options | Default | Description |
| --- | --- | --- |
| `--out-dir` | `build` | The full path for the new output directory, relative to the current workspace. |
