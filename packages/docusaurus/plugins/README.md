# Docusaurus Plugins

Plugins are one of the best ways to add functionality to our Docusaurus. Plugins allow third-party developers to extend or modify the default functionality that Docusaurus provides.

## Installing a Plugin

A plugin is usually a dependency, so you install them like other packages in node using NPM. However, you don't need to install official plugin provided by Docusaurus team because it comes by default.

```bash
yarn add docusaurus-plugin-name
```

Then you add it in your site's `docusaurus.config.js` plugin arrays:

```js
module.exports = {
  plugins: [
    {
      name: 'docusaurus-plugin-content-pages',
    },
    {
      // Plugin with options
      name: 'docusaurus-plugin-content-blog',
      options: {
        include: ['*.md', '*.mdx'],
        path: '../v1/website/blog',
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
  constructor(options, context) {
      
    // options are the plugin options set on config file
    this.options = {...options};
    
    // context are provided from docusaurus. Example: siteConfig can be accessed from context
    this.context = context;
  }

  getName() {
    // plugin name identifier
  }

  async loadContents() {
    // Content loading hook that runs the first time plugin is loaded
    // expect a content data structure to be returned
  }

  async generateRoutes({metadata, actions}) {
    // This is routes generation hook
  }

  getPathsToWatch() {
    // path to watch
  }
}
```
