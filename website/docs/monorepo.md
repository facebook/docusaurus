---
id: monorepo
title: Monorepo
---

In this guide, we will configure Docusaurus for a Monorepo.
Our configuration will enable the following directory structure.
```
. (project root)
|_ docs (this is where the Monorepo's main docs go)
|_ packages
   |_ package1
      |- README.md
      |- docs (package1 docs)
      |- ...
   |_ package2
      |- README.md
      |- docs (package2 docs)
      |- ...
   |_ package3
      |- README.md
      |- docs (package3 docs)
      |- ...
```

### docusaurus.config.js
First let's update the configuration and set the docs path to the root of the
project. We will also set Docusaurus' router base path to 
begin from the project root (empty string). 
```js
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '.',
          routeBasePath: '',
          include: [
            'docs/**/*.md',
            'docs/**/*.mdx',
            'packages/**/*.md',
            'packages/**/*.mdx',
          ],
          exclude: [
            // exclude the 'blog' directory because this plugin will look
            // for markdown files anywhere from the root of the project.
            /blog/,
            
            // this plugin will look for markdown files anywhere from the root 
            // of the project, so let's exclude generated files from processing.
            /node_modules/,
          ]
        },
        blog: {
          path: 'blog',
          postsPerPage: 3,
        },
      },
    ],
  ],
  // ...
};
```
With this configuration, we can reference our markdown files
relative from the root of the project. For example.
```js
module.exports = {
  docs: {
    Docusaurus: [
      'docs/introduction',
      'docs/contributing',
    ],
    Packages: [
      {
        type: 'category',
        label: 'Package 1',
        items: [
          'packages/package1/README',
          'packages/package1/docs/introduction',
          'packages/package1/docs/usage',
        ],
      },
      {
        type: 'category',
        label: 'Package 2',
        items: [
          'packages/package2/README',
          'packages/package2/docs/introduction',
          'packages/package2/docs/usage',
        ],
      },
      // etc...
  },
};
```