---
id: version-1.1.x-installation
title: Installation
original_id: installation
---

Docusaurus was designed from the ground up to be easily installed and used to get your website up and running quickly. To install Docusaurus, we have created an easy script that will get all of the infrastructure set up for you:

1. Ensure you have the latest version of [Node](https://nodejs.org/en/download/) installed. We also recommend you install [Yarn](https://yarnpkg.com/en/docs/install) as well.

    > While we recommend Node 8.x or greater, your Node version must at least 6.x.

1. Go into the root of your GitHub repo directory where you will be creating the docs.
1. `npx docusaurus-init`

    > If you don't have Node 8.2+ or if you prefer to install Docusaurus globally, run `yarn global add docusaurus-init` or `npm install --global docusaurus-init`. After that, run `docusaurus-init`.

After Docusaurus is installed, moving forward, you can check your current version of Docusaurus by going into the `website` directory and typing `yarn outdated docusaurus` or `npm outdated docusaurus`. You can update to the [latest version](https://www.npmjs.com/package/docusaurus) of Docusaurus by typing `yarn upgrade docusaurus --latest` or `npm update docusaurus`.

## Verifying Installation

Along with previously existing files and directories, your root directory will now contain a structure similar to:

```bash
root-directory
├── docs-examples-from-docusaurus
│   ├── doc1.md
│   ├── doc2.md
│   ├── doc3.md
│   ├── exampledoc4.md
│   └── exampledoc5.md
└── website
    ├── blog-examples-from-docusaurus
    │   ├── 2016-03-11-blog-post.md
    │   ├── 2017-04-10-blog-post-two.md
    │   ├── 2017-09-25-testing-rss.md
    │   ├── 2017-09-26-adding-rss.md
    │   └── 2017-10-24-new-version-1.0.0.md
    ├── core
    │   └── Footer.js
    ├── package.json
    ├── pages
    ├── sidebars.json
    ├── siteConfig.js
    └── static
```

Running the Docusaurus initialization script, `docusaurus-init`, produces a runnable, example website to base your site upon.

1. In your root, rename `docs-examples-from-docusaurus` to `docs`.
1. `cd website`
1. Rename `blog-examples-from-docusaurus` to `blog`.
1. Run the local web server via `yarn start` or `npm start`.
1. Load the example site at http://localhost:3000. You should see the example site loaded in your web browser.

![](/img/getting-started-preparation-verify.png)

### Launching the server behind a proxy

If you are behind a corporate proxy, you need to disable it for the development server requests. It can be done using the `NO_PROXY` environment variable.

```sh
SET NO_PROXY=localhost
yarn start (or npm run start)
```
