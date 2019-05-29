---
id: installation
title: Installation
---

The easiest way to install Docusaurus is to use the command line tool that helps you scaffold a templated Docusaurus site.

```bash
npx @docusaurus/core@next init
```

It will then prompt you for the `name` and the `template` for your Docusaurus site. We recommend `classic` for the template so that you can quickly get started. 

## Project Structure

Assuming you choose the classic template and name your site `docusaurus`, you will see the following files generated under a new directory `docusaurus/`:

```md
docusaurus
├── docs
│   ├── doc1.md
│   ├── doc2.md
│   ├── doc3.md
│   ├── exampledoc4.md
│   └── exampledoc5.md
├── blog
│   ├── 2019-05-29-hello-world.md
│   └── 2020-05-30-welcome.md
├── package.json
├── pages
│   └── index.js
├── sidebars.json
├── docusaurus.config.js
├── static
│   └── img
└── yarn.lock
```

## Running the development server

```bash
cd docusaurus
yarn start
```

A browser window will open at http://localhost:3000.

Congratulations, you have just created your first Docusaurus site! 
Browse around the site to see what's available.
