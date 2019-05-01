---
id: plugins-api
title: Plugins
---

Plugins are one of the best ways to add functionality to our Docusaurus. Plugins allow third-party developers to extend or modify the default functionality that Docusaurus provides. 

## Installing a Plugin

A plugin is usually a dependency, so you install them like other packages in node using NPM.

```bash
yarn add docusaurus-plugin-name
```

Then you add it in your site's `docusaurus.config.js` plugin arrays:

```js
module.exports = {
  plugins: [
    {
      name: '@docusaurus/plugin-content-pages',
    },
    {
      // Plugin with options
      name: '@docusaurus/plugin-content-blog',
      options: {
        include: ['*.md', '*.mdx'],
        path: 'blog',
      },
    },
  ],
};
```

Docusaurus can also load plugins from your local folder, you can do something like below:

```js
module.exports = {
  plugins: [
    {
      path: '/path/to/docusaurus-local-plugin',
    },
  ],
}
```

## Basic Plugin Architecture

For examples, please refer to several official plugins created.

```js
// A JavaScript class
class DocusaurusPlugin {
  constructor(context, options) {
    // Initialization hook
      
    // options are the plugin options set on config file
    this.options = {...options};
    
    // context are provided from docusaurus. Example: siteConfig can be accessed from context
    this.context = context;
  }

  getName() {
    // plugin name identifier
  }


  async loadContent()) {
    // The loadContent hook is executed after siteConfig and env has been loaded
    // You can return a JavaScript object that will be passed to contentLoaded hook
  }

  async contentLoaded({content, actions}) {
    // contentLoaded hook is done after loadContent hook is done
    // actions are set of functional API provided by Docusaurus. e.g: addRoute
  }

  async postBuild(props) {
    // after docusaurus <build> finish
  }

  // TODO
  async postStart(props) {
    // docusaurus <start> finish
  }

  // TODO
  afterDevServer(app, server) {
    // https://webpack.js.org/configuration/dev-server/#devserverbefore
  }

  // TODO
  beforeDevServer(app, server) {
    // https://webpack.js.org/configuration/dev-server/#devserverafter

  }

  configureWebpack(config, isServer) {
    // Modify internal webpack config. If returned value is an Object, it will be merged into the final config using webpack-merge; If returned value is a function, it will receive the config as the 1st argument and an isServer flag as the 2nd argument.
  }

  getPathsToWatch() {
    // path to watch
  }
}
```


#### References

- https://v1.vuepress.vuejs.org/plugin/option-api.html
