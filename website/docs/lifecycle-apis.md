---
id: lifecycle-apis
title: Lifecycle APIs
---

:::caution

This section is a work in progress.

:::

Lifecycle APIs are shared by Themes and Plugins.

## `validateOptions({options, validate})` {#validateoptionsoptions-validate}

Return validated and normalized options for the plugin. This method is called before the plugin is initialized.You must return options since the returned options will be passed to plugin during initialization.

### `options` {#options}

`validateOptions` is called with `options` passed to plugin for validation and normalization.

### `validate` {#validate}

`validateOptions` is called with `validate` function which takes a **[Joi](https://www.npmjs.com/package/joi)** schema and options as argument, returns validated and normalized options. `validate` will automatically handle error and validation config.

:::tip

[Joi](https://www.npmjs.com/package/joi) is recommended for validation and normalization of options.

To avoid mixing Joi versions, use `const {Joi} = require("@docusaurus/utils-validation")`

:::

If you don't use **[Joi](https://www.npmjs.com/package/joi)** for validation you can throw an Error in case of invalid options and return options in case of success.

```js {8-11} title="my-plugin/src/index.js"
module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin',
    // rest of methods
  };
};

module.exports.validateOptions = ({options, validate}) => {
  const validatedOptions = validate(myValidationSchema, options);
  return validationOptions;
};
```

You can also use ES modules style exports.

```ts {8-11} title="my-plugin/src/index.ts"
export default function (context, options) {
  return {
    name: 'docusaurus-plugin',
    // rest of methods
  };
}

export function validateOptions({options, validate}) {
  const validatedOptions = validate(myValidationSchema, options);
  return validationOptions;
}
```

## `validateThemeConfig({themeConfig, validate})` {#validatethemeconfigthemeconfig-validate}

Return validated and normalized configuration for the theme.

### `themeConfig` {#themeconfig}

`validateThemeConfig` is called with `themeConfig` provided in `docusaurus.config.js` for validation and normalization.

### `validate` {#validate-1}

`validateThemeConfig` is called with `validate` function which takes a **[Joi](https://www.npmjs.com/package/joi)** schema and `themeConfig` as argument, returns validated and normalized options. `validate` will automatically handle error and validation config.

:::tip

[Joi](https://www.npmjs.com/package/joi) is recommended for validation and normalization of theme config.

To avoid mixing Joi versions, use `const {Joi} = require("@docusaurus/utils-validation")`

:::

If you don't use **[Joi](https://www.npmjs.com/package/joi)** for validation you can throw an Error in case of invalid options.

```js {8-11} title="my-theme/src/index.js"
module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin',
    // rest of methods
  };
};

module.exports.validateThemeConfig = ({themeConfig, validate}) => {
  const validatedThemeConfig = validate(myValidationSchema, options);
  return validatedThemeConfig;
};
```

You can also use ES modules style exports.

```ts {8-11} title="my-theme/src/index.ts"
export default function (context, options) {
  return {
    name: 'docusaurus-plugin',
    // rest of methods
  };
}

export function validateThemeConfig({themeConfig, validate}) {
  const validatedThemeConfig = validate(myValidationSchema, options);
  return validatedThemeConfig;
}
```

## `getPathsToWatch()` {#getpathstowatch}

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

## `async loadContent()` {#async-loadcontent}

Plugins should use this lifecycle to fetch from data sources (filesystem, remote API, headless CMS, etc) or doing some server processing.

For example, this plugin below return a random integer between 1 to 10 as content;

```js {5-6} title="docusaurus-plugin/src/index.js"
const path = require('path');
module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin',
    async loadContent() {
      return 1 + Math.floor(Math.random() * 10);
    },
  };
};
```

## `async contentLoaded({content, actions})` {#async-contentloadedcontent-actions}

Plugins should use the data loaded in `loadContent` and construct the pages/routes that consume the loaded data (optional).

### `content` {#content}

`contentLoaded` will be called _after_ `loadContent` is done, the return value of `loadContent()` will be passed to `contentLoaded` as `content`.

### `actions` {#actions}

`actions` contain two functions:

- `addRoute(config: RouteConfig): void`

Create a route to add to the website.

```typescript
interface RouteConfig {
  path: string;
  component: string;
  modules?: RouteModule;
  routes?: RouteConfig[];
  exact?: boolean;
  priority?: number;
}
interface RouteModule {
  [module: string]: Module | RouteModule | RouteModule[];
}
type Module =
  | {
      path: string;
      __import?: boolean;
      query?: ParsedUrlQueryInput;
    }
  | string;
```

- `createData(name: string, data: any): Promise<string>`

A function to help you create static data (generally json or string), that you can provide to your routes as props.

For example, this plugin below create a `/friends` page which display `Your friends are: Yangshun, Sebastien`:

```jsx title="website/src/components/Friends.js"
import React from 'react';

export default function FriendsComponent({friends}) {
  return <div>Your friends are {friends.join(',')}</div>;
}
```

```js {4-23} title="docusaurus-friends-plugin/src/index.js"
export default function friendsPlugin(context, options) {
  return {
    name: 'docusaurus-friends-plugin',
    async contentLoaded({content, actions}) {
      const {createData, addRoute} = actions;
      // Create friends.json
      const friends = ['Yangshun', 'Sebastien'];
      const friendsJsonPath = await createData(
        'friends.json',
        JSON.stringify(friends),
      );

      // Add the '/friends' routes, and ensure it receives the friends props
      addRoute({
        path: '/friends',
        component: '@site/src/components/Friends.js',
        modules: {
          // propName -> JSON file path
          friends: friendsJsonPath,
        },
        exact: true,
      });
    },
  };
}
```

- `setGlobalData(data: any): void`

This function permits to create some global plugin data, that can be read from any page, including the pages created by other plugins, and your theme layout.

This data become accessible to your client-side/theme code, through the [`useGlobalData`](./docusaurus-core.md#useglobaldata) and [`usePluginData`](./docusaurus-core.md#useplugindatapluginname-string-pluginid-string).

One this data is created, you can access it with the global data hooks APIs.

:::caution

Global data is... global: its size affects the loading time of all pages of your site, so try to keep it small.

Prefer `createData` and page-specific data whenever possible.

:::

For example, this plugin below create a `/friends` page which display `Your friends are: Yangshun, Sebastien`:

```jsx title="website/src/components/Friends.js"
import React from 'react';
import {usePluginData} from '@docusaurus/useGlobalData';

export default function FriendsComponent() {
  const {friends} = usePluginData('my-friends-plugin');
  return <div>Your friends are {friends.join(',')}</div>;
}
```

```js {4-14} title="docusaurus-friends-plugin/src/index.js"
export default function friendsPlugin(context, options) {
  return {
    name: 'docusaurus-friends-plugin',
    async contentLoaded({content, actions}) {
      const {setGlobalData, addRoute} = actions;
      // Create friends global data
      setGlobalData({friends: ['Yangshun', 'Sebastien']});

      // Add the '/friends' routes
      addRoute({
        path: '/friends',
        component: '@site/src/components/Friends.js',
        exact: true,
      });
    },
  };
}
```

## `configureWebpack(config, isServer, utils)` {#configurewebpackconfig-isserver-utils}

Modifies the internal webpack config. If the return value is a JavaScript object, it will be merged into the final config using [`webpack-merge`](https://github.com/survivejs/webpack-merge). If it is a function, it will be called and receive `config` as the first argument and an `isServer` flag as the argument argument.

### `config` {#config}

`configureWebpack` is called with `config` generated according to client/server build. You may treat this as the base config to be merged with.

### `isServer` {#isserver}

`configureWebpack` will be called both in server build and in client build. The server build receives `true` and the client build receives `false` as `isServer`.

### `utils` {#utils}

The initial call to `configureWebpack` also receives a util object consists of three functions:

- `getStyleLoaders(isServer: boolean, cssOptions: {[key: string]: any}): Loader[]`
- `getCacheLoader(isServer: boolean, cacheOptions?: {}): Loader | null`
- `getBabelLoader(isServer: boolean, babelOptions?: {}): Loader`

You may use them to return your webpack configures conditionally.

For example, this plugin below modify the webpack config to transpile `.foo` file.

```js title="docusaurus-plugin/src/index.js"
module.exports = function (context, options) {
  return {
    name: 'custom-docusaurus-plugin',
    // highlight-start
    configureWebpack(config, isServer, utils) {
      const {getCacheLoader} = utils;
      return {
        module: {
          rules: [
            {
              test: /\.foo$/,
              use: [getCacheLoader(isServer), 'my-custom-webpack-loader'],
            },
          ],
        },
      };
    },
    // highlight-end
  };
};
```

### Merge strategy {#merge-strategy}

We merge the Webpack configuration parts of plugins into the global Webpack config using [webpack-merge](https://github.com/survivejs/webpack-merge).

It is possible to specify the merge strategy. For example, if you want a webpack rule to be prepended instead of appended:

```js title="docusaurus-plugin/src/index.js"
module.exports = function (context, options) {
  return {
    name: 'custom-docusaurus-plugin',
    configureWebpack(config, isServer, utils) {
      return {
        // highlight-start
        mergeStrategy: {'module.rules': 'prepend'},
        module: {rules: [myRuleToPrepend]},
        // highlight-end
      };
    },
  };
};
```

Read the [webpack-merge strategy doc](https://github.com/survivejs/webpack-merge#merging-with-strategies) for more details.

## `configurePostCss(options)` {#configurepostcssoptions}

Modifies [`postcssOptions` of `postcss-loader`](https://webpack.js.org/loaders/postcss-loader/#postcssoptions) during the generation of the client bundle.

Should return the mutated `postcssOptions`.

By default, `postcssOptions` looks like this:

```js
const postcssOptions = {
  ident: 'postcss',
  plugins: [require('autoprefixer')],
};
```

Example:

```js title="docusaurus-plugin/src/index.js"
module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin',
    // highlight-start
    configurePostCss(postcssOptions) {
      // Appends new PostCSS plugin.
      postcssOptions.plugins.push(require('postcss-import'));
      return postcssOptions;
    },
    // highlight-end
  };
};
```

## `postBuild(props)` {#postbuildprops}

Called when a (production) build finishes.

```ts
type Props = {
  siteDir: string;
  generatedFilesDir: string;
  siteConfig: DocusaurusConfig;
  outDir: string;
  baseUrl: string;
  headTags: string;
  preBodyTags: string;
  postBodyTags: string;
  routesPaths: string[];
  plugins: Plugin<any>[];
  stats: Stats.ToJsonOutput;
};
```

Example:

```js {4-11} title="docusaurus-plugin/src/index.js"
module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin',
    async postBuild({siteConfig = {}, routesPaths = [], outDir, stats}) {
      // Print out to console all the rendered routes.
      routesPaths.map((route) => {
        console.log(route);
      });
      // Print out to console all the webpack stats.
      console.log(stats);
    },
  };
};
```

## `extendCli(cli)` {#extendclicli}

Register an extra command to enhance the CLI of docusaurus. `cli` is [commander](https://www.npmjs.com/package/commander) object.

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

## `injectHtmlTags()` {#injecthtmltags}

Inject head and/or body HTML tags to Docusaurus generated HTML.

```typescript
function injectHtmlTags(): {
  headTags?: HtmlTags;
  preBodyTags?: HtmlTags;
  postBodyTags?: HtmlTags;
};

type HtmlTags = string | HtmlTagObject | (string | HtmlTagObject)[];

interface HtmlTagObject {
  /**
   * Attributes of the HTML tag
   * E.g. `{'disabled': true, 'value': 'demo', 'rel': 'preconnect'}`
   */
  attributes?: {
    [attributeName: string]: string | boolean;
  };
  /**
   * The tag name e.g. `div`, `script`, `link`, `meta`
   */
  tagName: string;
  /**
   * The inner HTML
   */
  innerHTML?: string;
}
```

Example:

```js title="docusaurus-plugin/src/index.js"
module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin',
    // highlight-start
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: 'https://www.github.com',
            },
          },
        ],
        preBodyTags: [
          {
            tagName: 'script',
            attributes: {
              charset: 'utf-8',
              src: '/noflash.js',
            },
          },
        ],
        postBodyTags: [`<div> This is post body </div>`],
      };
    },
    // highlight-end
  };
};
```

## `getThemePath()` {#getthemepath}

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

## `getTypeScriptThemePath()` {#gettypescriptthemepath}

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

## `getSwizzleComponentList()` {#getswizzlecomponentlist}

Return a list of stable component that are considered as safe for swizzling. These components will be listed in swizzle component without `--danger`. All the components are considers unstable by default. If an empty array is returned then all components are considered unstable, if `undefined` is returned then all component are considered stable.

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

## `getClientModules()` {#getclientmodules}

Returns an array of paths to the modules that are to be imported in the client bundle. These modules are imported globally before React even renders the initial UI.

As an example, to make your theme load a `customCss` or `customJs` file path from `options` passed in by the user:

```js {7-9} title="my-theme/src/index.js"
const path = require('path');

module.exports = function (context, options) {
  const {customCss, customJs} = options || {};
  return {
    name: 'name-of-my-theme',
    getClientModules() {
      return [customCss, customJs];
    },
  };
};
```

<!--
For example, the in docusaurus-plugin-content-docs:

    In loadContent, it loads the doc Markdown files based on the specified directory in options (defaulting to docs).
    In contentLoaded, for each doc Markdown file, a route is created: /doc/installation, /doc/getting-started, etc.
 -->

## i18n lifecycles {#i18n-lifecycles}

### `getTranslationFiles({content})` {#get-translation-files}

Plugins declare the JSON translation files they want to use.

Returns translation files `{path: string, content: ChromeI18nJSON}`:

- Path: relative to the plugin localized folder `i18n/<locale>/pluginName`. Extension `.json` is not necessary.
- Content: using the Chrome i18n JSON format

These files will be written by the [`write-translations` CLI](./cli.md#docusaurus-write-translations-sitedir) to the plugin i18n subfolder, and will be read in the appropriate locale before calling [`translateContent()`](#translate-content) and [`translateThemeConfig()`](#translate-theme-config)

Example:

```js
module.exports = function (context, options) {
  return {
    name: 'my-plugin',
    // highlight-start
    async getTranslationFiles({content}) {
      return [
        {
          path: 'sidebar-labels',
          content: {
            someSidebarLabel: {
              message: 'Some Sidebar Label',
              description: 'A label used in my plugin in the sidebar',
            },
            someLabelFromContent: content.myLabel,
          },
        },
      ];
    },
    // highlight-end
  };
};
```

### `translateContent({content,translationFiles})` {#translate-content}

Translate the plugin content, using the localized translation files.

Returns the localized plugin content.

The `contentLoaded()` lifecycle will be called with the localized plugin content returned by `translateContent()`.

Example:

```js
module.exports = function (context, options) {
  return {
    name: 'my-plugin',
    // highlight-start
    translateContent({content, translationFiles}) {
      const myTranslationFile = translationFiles.find(
        (f) => f.path === 'myTranslationFile',
      );
      return {
        ...content,
        someContentLabel: myTranslationFile.someContentLabel.message,
      };
    },
    // highlight-end
  };
};
```

### `translateThemeConfig({themeConfig,translationFiles})` {#translate-theme-config}

Translate the site `themeConfig` labels, using the localized translation files.

Returns the localized `themeConfig`.

Example:

```js
module.exports = function (context, options) {
  return {
    name: 'my-theme',
    // highlight-start
    translateThemeConfig({themeConfig, translationFiles}) {
      const myTranslationFile = translationFiles.find(
        (f) => f.path === 'myTranslationFile',
      );
      return {
        ...themeConfig,
        someThemeConfigLabel: myTranslationFile.someThemeConfigLabel.message,
      };
    },
    // highlight-end
  };
};
```

### `async getDefaultCodeTranslationMessages()` {#get-default-code-translation-messages}

Themes using the `<Translate>` API can provide default code translation messages.

It should return messages in `Record<string,string`>, where keys are translation ids and values are messages (without the description) localized using the site current locale.

Example:

```js
module.exports = function (context, options) {
  return {
    name: 'my-theme',
    // highlight-start
    async getDefaultCodeTranslationMessages() {
      return readJsonFile(`${context.i18n.currentLocale}.json`);
    },
    // highlight-end
  };
};
```

## Example {#example}

Here's a mind model for a presumptuous plugin implementation.

```jsx
const DEFAULT_OPTIONS = {
  // Some defaults.
};

// A JavaScript function that returns an object.
// `context` is provided by Docusaurus. Example: siteConfig can be accessed from context.
// `opts` is the user-defined options.
module.exports = function (context, opts) {
  // Merge defaults with user-defined options.
  const options = {...DEFAULT_OPTIONS, ...options};

  return {
    // A compulsory field used as the namespace for directories to cache
    // the intermediate data for each plugin.
    // If you're writing your own local plugin, you will want it to
    // be unique in order not to potentially conflict with imported plugins.
    // A good way will be to add your own project name within.
    name: 'docusaurus-my-project-cool-plugin',

    async loadContent() {
      // The loadContent hook is executed after siteConfig and env has been loaded.
      // You can return a JavaScript object that will be passed to contentLoaded hook.
    },

    async contentLoaded({content, actions}) {
      // The contentLoaded hook is done after loadContent hook is done.
      // `actions` are set of functional API provided by Docusaurus (e.g. addRoute)
    },

    async postBuild(props) {
      // After docusaurus <build> finish.
    },

    // TODO
    async postStart(props) {
      // docusaurus <start> finish
    },

    // TODO
    afterDevServer(app, server) {
      // https://webpack.js.org/configuration/dev-server/#devserverbefore
    },

    // TODO
    beforeDevServer(app, server) {
      // https://webpack.js.org/configuration/dev-server/#devserverafter
    },

    configureWebpack(config, isServer) {
      // Modify internal webpack config. If returned value is an Object, it
      // will be merged into the final config using webpack-merge;
      // If the returned value is a function, it will receive the config as the 1st argument and an isServer flag as the 2nd argument.
    },

    getPathsToWatch() {
      // Paths to watch.
    },

    getThemePath() {
      // Returns the path to the directory where the theme components can
      // be found.
    },

    getClientModules() {
      // Return an array of paths to the modules that are to be imported
      // in the client bundle. These modules are imported globally before
      // React even renders the initial UI.
    },

    extendCli(cli) {
      // Register an extra command to enhance the CLI of Docusaurus
    },

    injectHtmlTags() {
      // Inject head and/or body HTML tags.
    },

    async getTranslationFiles() {
      // Return translation files
    },

    translateContent({content, translationFiles}) {
      // translate the plugin content here
    },

    translateThemeConfig({themeConfig, translationFiles}) {
      // translate the site themeConfig here
    },

    async getDefaultCodeTranslationMessages() {
      // return default theme translations here
    },
  };
};
```
