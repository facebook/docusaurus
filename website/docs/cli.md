---
id: cli
title: CLI
---

Docusaurus provides a set of scripts to help you generate, serve, and deploy your website. 

Once your website is generated, your website package will contain the Docusaurus scripts that you may invoke with your package manager:

```json
// package.json
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

### `docusaurus init`

The `docusaurus init` command is intended to be used with `docusaurus` installed globally:

```shell
$ yarn global add docusaurus
# or
$ npm install --global docusaurus
```

<!-- TODO: init docs after the init command is implemented -->

### `docusaurus start`

Builds and serves the static site with [Webpack Dev Server](https://webpack.js.org/configuration/dev-server).

**options**

|Options|Default|Description|
|-|-|-|
|`--port`|`3000`|Specifies the port of the dev server|
|`--host`|`localhost`|Specifie a host to use. E.g., if you want your server to be accessible externally, you can use `--host 0.0.0.0`|
|`--no-watch`|`false`|<!-- TODO verify how this works --> Disables watching files for hot reload|
|`--hot-only`|`false`|Enables Hot Module Replacement without page refresh as fallback in case of build failures. More information [here](https://webpack.js.org/configuration/dev-server/#devserverhotonly).|

### `docusaurus build`

Compiles your site for production.

**options**

|Options|Default|Description|
|-|-|-|
|`--bundle-analyzer`||Starts [bundle analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)|


### `docusaurus swizzle`


You may shadow any Docusaurus Theme components with your own component with `docusaurus swizzle`.

```shell
$ docusaurus swizzle $swizzleComponent $pathToNewComponent
```

**params**

- `$swizzleComponent`: name of the component to be shadowed
- `$pathToNewComponent`: relative path to the desired location to the new component

Running the above command will copy the swizzle component to the path you indicated. You may then make any changes to the copied component and Docusaurus will use that component from then on.

<!-- TODO a separate section for swizzle tutorial -->
To learn more about swizzling, check [here](#).

<!-- TODO is there a way to "unswizzle" a component? -->

### `docusaurus deploy`

Deploys your site with [GitHub Pages](https://pages.github.com/).