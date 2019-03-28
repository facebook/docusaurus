---
id: version-1.3.x-installation
title: Installation
original_id: installation
---

Docusaurus was designed from the ground up to be easily installed and used to get your website up and running quickly. 

## Installing Docusaurus

We have created an easy script that will get all of the infrastructure set up for you:

1.  Ensure you have the latest version of [Node](https://nodejs.org/en/download/) installed. We also recommend you install [Yarn](https://yarnpkg.com/en/docs/install) as well.

    > You have to be on Node >= 8.x and Yarn >= 1.5.

1.  Create a project, if none exists, and change your the directory to this project's root.

    You will be creating the docs in this directory. The root directory may
    contain other files. The Docusaurus installation script will create two new
    directories: `docs-examples-from-docusaurus` and `website`.

    > Commonly, either an existing or newly created GitHub project will be the location for your Docusaurus site, but that is not mandatory to use Docusaurus.

1.  Run the Docusaurus installation script: `npx docusaurus-init`.

    > If you don't have Node 8.2+ or if you prefer to install Docusaurus globally, run `yarn global add docusaurus-init` or `npm install --global docusaurus-init`. After that, run `docusaurus-init`.

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

## Running the example website

After running the Docusaurus initialization script, `docusaurus-init` as
described in the [Installation](#installing-docusaurus) section, you will have a
runnable, example website to use as your site's base. To run:

1.  In your root, rename `docs-examples-from-docusaurus` to `docs`.
1.  `cd website`
1.  Rename `blog-examples-from-docusaurus` to `blog`.
1.  From within the `website` directory, run the local webserver using 
    `yarn start` or `npm start`.
1.  Load the example site at http://localhost:3000 if it did not already open
    automatically.
    
    You should see the example site loaded in your web browser. There's also a LiveReload server running and any changes made to the docs and files in the `website` directory will cause the page to refresh.

![](/img/getting-started-preparation-verify.png)

### Launching the server behind a proxy

If you are behind a corporate proxy, you need to disable it for the development server requests. It can be done using the `NO_PROXY` environment variable.

```sh
SET NO_PROXY=localhost
yarn start (or npm run start)
```

## Updating Your Docusaurus Version

At any time after Docusaurus is installed, you can check your current version of Docusaurus by going into the `website` directory and typing `yarn outdated docusaurus` or `npm outdated docusaurus`. 

You will see something like this:

```
$ yarn outdated
Using globally installed version of Yarn
yarn outdated v1.5.1
warning package.json: No license field
warning No license field
info Color legend : 
 "<red>"    : Major Update backward-incompatible updates 
 "<yellow>" : Minor Update backward-compatible features 
 "<green>"  : Patch Update backward-compatible bug fixes
Package    Current Wanted Latest Package Type    URL                                          
docusaurus 1.0.9   1.2.0  1.2.0  devDependencies https://github.com/facebook/Docusaurus#readme
✨  Done in 0.41s.
```

> If there is no noticeable version output from the `outdated` commands, then you are up-to-date.

You can update to the [latest version](https://www.npmjs.com/package/docusaurus) of Docusaurus by:

```
yarn upgrade docusaurus --latest
```

or

```
npm update docusaurus
```

> If you are finding that you are getting errors after your upgrade, try to either clear your Babel cache (usually it's in a [temporary directory](https://babeljs.io/docs/en/babel-register/#environment-variables) or run the Docusaurus server (e.g., `yarn start`) with the `BABEL_DISABLE_CACHE=1` environment configuration.
