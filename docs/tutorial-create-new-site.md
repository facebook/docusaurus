---
id: tutorial-create-new-site
title: Create a New Site
---

In this section, we'll get our Docusaurus site up and running for local development. The process only takes a few minutes.

<img alt="Docusaurus browser" src="/img/undraw_docusaurus_browser.svg" class="docImage"/>

## Scaffold the Site

1. `cd` to the directory of your local repository.

```sh
cd docusaurus-tutorial
```

2. Execute the `docusaurus-init` command in your terminal.

```sh
docusaurus-init
```

> The `Linking dependencies...` step might take a while, but it will finish eventually.

The following contents will be created in your current directory. Some example documentation pages (under `docs`) and blog posts (under `website/blog`) are included.

```sh
├── Dockerfile
├── docker-compose.yml
├── docs
│   ├── doc1.md
│   ├── doc2.md
│   ├── doc3.md
│   ├── exampledoc4.md
│   └── exampledoc5.md
└── website
    ├── README.md
    ├── blog
    │   ├── 2016-03-11-blog-post.md
    │   ├── 2017-04-10-blog-post-two.md
    │   ├── 2017-09-25-testing-rss.md
    │   ├── 2017-09-26-adding-rss.md
    │   └── 2017-10-24-new-version-1.0.0.md
    ├── core
    │   └── Footer.js
    ├── package.json
    ├── pages
    │   └── en
    │       ├── help.js
    │       ├── index.js
    │       └── users.js
    ├── sidebars.json
    ├── siteConfig.js
    ├── static
    │   ├── css
    │   │   └── custom.css
    │   └── img
    │       ├── docusaurus.svg
    │       ├── favicon
    │       │   └── favicon.ico
    │       ├── favicon.png
    │       └── oss_logo.png
    └── yarn.lock
```


2. Run `cd website` to go into the `website` directory.
1. Run `npm start` or `yarn start`.

A browser window will open up at http://localhost:3000/docusaurus-tutorial/.

Congratulations, you have just made your first Docusaurus site! Click around the pages to get a feel for it.
