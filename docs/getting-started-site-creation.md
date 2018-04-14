---
id: site-creation
title: Creating your site
---

Docusaurus was created to hopefully make it super simple for you to create a site and documentation for your open source project.

After [installation](getting-started-installation.md) and [preparation](getting-started-preparation.md), much of the work to create a basic site for your docs is already complete.

## Site Structure

Your site structure looks like the following:

```bash
root-of-repo
├── docs
└── website
│   └── blog
│   └── core
│       └── Footer.js
│   └── node_modules
│   └── package.json
│   └── pages
│   └── sidebars.json
│   └── siteConfig.js
│   └── static
```

> This assumes that you removed the example `.md` files that were installed with the [initialization](getting-started-installation.md) script.

All of your documentation files should be placed inside the `docs` folder as markdown `.md` files. Any blog posts should be inside the `blog` folder.

> The blog posts must be formatted as `YYYY-MM-DD-your-file-name.md`

## Create Your Basic Site

To create a fully functional site, you only need to do a few steps:

1. Add your documentation to the `/docs` folder as `.md` files, ensuring you have the proper [header](api-doc-markdown.md#documents) in each file. The simplest header would be the following, where `id` is the link name (e.g., `docs/intro.html`) and the `title`, is, of course, the title of the browser page.

    ```
    ---
    id: intro
    title: Getting Started
    ---

    My *new content* here..
    ```

1. Add zero or more docs to the [`sidebars.json`](guides-navigation.md#adding-docs-to-a-sidebar) file so that your documentation is rendered in a sidebar, if you choose them to be.

  > If you do not add your documentation to the `sidebars.json` file, the docs will be rendered, but they can only be linked to from other documentation and visited with the known URL.

3. Modify the `website/siteConfig.js` file to [configure your site](api-site-config.md), following the comments included in the [docs](api-site-config.md) and the `website/siteConfig.js` to guide you.
1. Create any [custom pages](guides-custom-pages.md#customizing-your-site-footer) and/or [customize](guides-custom-pages.md#customizing-your-site-footer) the `website/core/Footer.js` file that provides the footer for your site.
1. Place assets, such as images, in the `website/static/` folder.
1. Run the site to see the results of your changes.  

  ```
  cd website
  yarn run start # or `npm run start`
  # navigate to http://localhost:3000
  ```
