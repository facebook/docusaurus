---
id: installation
title: Installation
---

Docusaurus was designed from the ground up to be easily installed and used to get your website up and running quickly. To install Docusaurus, we have created an easy script that will get all of the infrastructure setup for you:

1. Ensure you have the latest version of [Node](https://nodejs.org/en/download/) installed. We also recommend you install [Yarn](https://yarnpkg.com/en/docs/install) as well.

    > While we recommend Node 8.x or greater, your Node version must at least 6.x.
    
1. Go into the root of your GitHub repo directory where you will be creating the docs.
1. `yarn global add docusaurus-init` or `npm install --global docusaurus-init`
1. `docusaurus-init`

> After docusaurus is installed, moving forward, you can check your current version of Docusaurus by going into the `website` directory and typing `npm list docusaurus`. You can update to the [latest version](https://www.npmjs.com/package/docusaurus) of Docusaurus by typeing `npm update`.

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

> If you do not want to install the init script globally, you can install it locally and then run it via `npx docusaurus-init` or from the `node_modules` directory that is created via `./node_modules/.bin/docusaurus-init`. You may want to remove the created `package.json` file and `node_modules` directory after you run the script.

## Verifying Installation

Running the Docusaurus initialization script, `docusaurus-init`, produces a runnable, example website to base your site upon.

1. In your root, rename `docs-examples-from-docusaurus` to `docs`.
1. `cd website`
1. Rename `blog-examples-from-docusaurus` to `blog`.
1. Run the local webserver via `yarn start` or `npm start`.
1. Load the example site at http://localhost:3000. You should see the example site loaded in your web browser.

![](/img/getting-started-preparation-verify.png)
