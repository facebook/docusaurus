---
id: installation
title: Installation
---

Docusaurus was designed from the ground up to be easily installed and used to get your website up an running quickly. To install Docusaurus, we have created an easy script that will get all of the infrastructure setup for you:

1. Go into the root of your GitHub repo directory where you will be creating the docs.
1. `yarn global add docusaurus-init` or `npm install --global docusaurus-init`
1. `docusaurus-init`

Along with previously existing files and directories, your root directory will now contain a structure similar to:

```bash
root-of-repo
├── docs-examples-from-docusaurus
│   └── doc1.md
│   └── doc2.md
│   └── doc3.md
│   └── exampledoc4.md
│   └── exampledoc5.md
└── website
│   └── blog-examples-from-docusaurus
│       └── 2016-03-11-blog-post.md
│       └── 2017-04-10-blog-post-two.md
│   └── core
│       └── Footer.js
│   └── node_modules
│   └── package.json
│   └── pages
│   └── sidebars.json
│   └── siteConfig.js
│   └── static
```

> If you do not want to install the init script globally, you can install it locally and then run it from the `node_modules` directory that is created via `./node_modules/.bin/docusaurus-init`. You may want to remove the created `package.json` file and `node_modules` directory after you run the script.
