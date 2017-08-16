---
id: site-creation
title: Creating your site
---

Docusaurus' primary purpose of existence is to make it super simple for you to create documentation for your project and have a site to house those docs.

After [installation](getting-started-installation.md) and [preparation](getting-started-preparation.md), much of the work to create a basic site for your docs is already complete.

## Load the Example Site

[Preparation](getting-started-preparation.md) created a sample site for you to see Docusaurus in action. However, it also provided the infrastructure that will be used as you are developing your own site.

## Site Structure

After loading the example site, you should see a structure in your repo that looks similar to:

```
project-repo/
  docs/
    doc1.md
  website/
    blog/
      2017-05-06-blog-post.md
```

All of your documentation files should be placed inside the `docs` folder as markdown `.md` files. Any blog posts should be inside the `blog` folder.

> The blog posts must be formatted as yyyy-mm-dd-your-file-name.md

## Create Your Basic Site

To create a fully functional site, you only need to do a few steps:

1. Add your documentation to the `/docs` folder as `.md` files, ensuring you have the proper [header](api-doc-markdown.md) in each file.
1. Add zero or more docs to the [`sidebars.json`](guides-navigation.md) file so that your documentation is rendered in a sidebar, if you choose them to be.

  > If you do not add your documentation to the `sidebars.json` file, the docs will be rendered, but they can only be linked to from other documentation and visited with the known URL.

1. Modify the `website/siteConfig.js` file to [configure your site](api-site-config.md), following the comments included in that file to guide you.
1. [Customize](LINK_HERE_TO_CUSTOMIZATION) the `website/core/Footer.js` file that provides the footer for your site.
1. Place assets, such as images, in the `website/static/` folder.
1. Run the site to see the results of your changes.  

  ```
  cd website
  yarn run start # or - npm run start
  # navigate to http://localhost:3000
  ```
