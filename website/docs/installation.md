---
id: installation
title: Installation
---

The easiest way to install Docusaurus is to use the command line tool that helps you scaffold a Docusaurus site skeleton. You can run this command anywhere in a new empty repository or within an existing repository, it will create a new directory containing the scaffolded files.

```bash
npx @docusaurus/core@next init
```

It will then prompt you for the `name` and the `template` for your Docusaurus site. We recommend the `classic` template so that you can get started quickly. The `classic` template comes with standard documentation, blog and custom pages features.

## Project Structure

Assuming you chose the classic template and named your site `my-website`, you will see the following files generated under a new directory `my-website/`:

```sh
my-website
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

## Running the Development Server

```bash
cd my-website
npm start
```

A browser window will open at http://localhost:3000.

Congratulations! You have just created your first Docusaurus site! Browse around the site to see what's available.
