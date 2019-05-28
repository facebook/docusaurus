---
id: installation
title: Installation
---

The easiest way to install Docusaurus is to use the command line tool that help you scaffold a Docusaurus site with some example templates.

```bash
npx @docusaurus/core@next init
```

It will then prompt you for `name` and `template` for your docusaurus site. We recommend `classic` for the template so that you can quickly get started. 

## Project Structure

If you choose the classic template and name your site `docusaurus`. There would be some example documentation and blog pages generated

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

A browser window will open up at http://localhost:3000.

Congratulations, you have just made your first Docusaurus site! 
Click around the pages generated for you to see what's available.
