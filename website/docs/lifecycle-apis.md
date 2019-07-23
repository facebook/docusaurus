---
id: lifecycle-apis
title: Lifecycle APIs
---

Lifecycle APIs are shared by Themes and Plugins.

<!-- TODO: explain lifecycle methods -->

- `loadContent` - Plugins should fetch from data sources (filesystem, remote API, etc)
- `contentLoaded` - Plugins should use the data loaded in loadContent and construct the pages/routes that consume the data
- `configureWebpack` - To extend the webpack config via webpack-merge.

<!--
For example, the in docusaurus-plugin-content-docs:

    In loadContent, it loads the doc Markdown files based on the specified directory in options (defaulting to docs).
    In contentLoaded, for each doc Markdown file, a route is created: /doc/installation, /doc/getting-started, etc.
 -->

```jsx
const DEFAULT_OPTIONS = {
  // Some defaults.
};

// A JavaScript function that returns an object.
// `context` is provided by Docusaurus. Example: siteConfig can be accessed from context.
// `opts` is the user-defined options.
module.exports = function(context, opts) {
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
      // The loadContent hook is executed after siteConfig and env has been loaded
      // You can return a JavaScript object that will be passed to contentLoaded hook
    },

    async contentLoaded({content, actions}) {
      // contentLoaded hook is done after loadContent hook is done
      // actions are set of functional API provided by Docusaurus. e.g: addRoute
    },

    async postBuild(props) {
      // after docusaurus <build> finish
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
      // Path to watch
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
  };
};
```
