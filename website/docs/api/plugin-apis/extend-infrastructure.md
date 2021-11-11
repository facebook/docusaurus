---
sidebar_position: 2
---

# Extending infrastructure

Docusaurus has some infrastructure like hot reloading, CLI, and swizzling that can be extended by external plugins.

## `getPathsToWatch()` {#getPathsToWatch}

Specifies the paths to watch for plugins and themes. The paths are watched by the dev server so that the plugin lifecycles are reloaded when contents in the watched paths change. Note that the plugins and themes modules are initially called with `context` and `options` from Node, which you may use to find the necessary directory information about the site.

Example:

```js {5-7} title="docusaurus-plugin/src/index.js"
const path = require('path');
module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin',
    getPathsToWatch() {
      const contentPath = path.resolve(context.siteDir, options.path);
      return [`${contentPath}/**/*.{ts,tsx}`];
    },
  };
};
```

## `extendCli(cli)` {#extendCli}

Register an extra command to enhance the CLI of Docusaurus. `cli` is [commander](https://www.npmjs.com/package/commander) object.

Example:

```js {4-11} title="docusaurus-plugin/src/index.js"
module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin',
    extendCli(cli) {
      cli
        .command('roll')
        .description('Roll a random number between 1 and 1000')
        .action(() => {
          console.log(Math.floor(Math.random() * 1000 + 1));
        });
    },
  };
};
```

## `getThemePath()` {#getThemePath}

Returns the path to the directory where the theme components can be found. When your users calls `swizzle`, `getThemePath` is called and its returned path is used to find your theme components.

If you use the folder directory above, your `getThemePath` can be:

```js {6-8} title="my-theme/src/index.js"
const path = require('path');

module.exports = function (context, options) {
  return {
    name: 'name-of-my-theme',
    getThemePath() {
      return path.resolve(__dirname, './theme');
    },
  };
};
```

## `getTypeScriptThemePath()` {#getTypeScriptThemePath}

Similar to `getThemePath()`, it should return the path to the directory where the source code of TypeScript theme components can be found. Theme components under this path will **not** be resolved by Webpack. Therefore, it is not a replacement of `getThemePath()`. Instead, this path is purely for swizzling TypeScript theme components.

If you want to support TypeScript component swizzling for your theme, you can make the path returned by `getTypeScriptThemePath()` be your source directory, and make path returned by `getThemePath()` be the compiled JavaScript output.

Example:

```js {6-13} title="my-theme/src/index.js"
const path = require('path');

module.exports = function (context, options) {
  return {
    name: 'name-of-my-theme',
    getThemePath() {
      // Where compiled JavaScript output lives
      return path.join(__dirname, '..', 'lib', 'theme');
    },
    getTypeScriptThemePath() {
      // Where TypeScript source code lives
      return path.resolve(__dirname, './theme');
    },
  };
};
```

## `getSwizzleComponentList()` {#getSwizzleComponentList}

**This is a static method not attached to any plugin instance.**

Returns a list of stable component that are considered as safe for swizzling. These components will be listed in swizzle component without `--danger`. All the components are considers unstable by default. If an empty array is returned then all components are considered unstable, if `undefined` is returned then all component are considered stable.

```js {0-12} title="my-theme/src/index.js"
const swizzleAllowedComponents = [
  'CodeBlock',
  'DocSidebar',
  'Footer',
  'NotFound',
  'SearchBar',
  'hooks/useTheme',
  'prism-include-languages',
];

module.exports.getSwizzleComponentList = () => swizzleAllowedComponents;
```
