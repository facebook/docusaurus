---
id: custom-pages
title: Custom Pages
---

You can add pages to your site that are not part of the standard docs or blog markdown files. You can do this by adding `.js` files to the `website/pages` directory. These files are [React](https://reactjs.org/) components and the `render()` is called to create them, backed by CSS classes, etc.

## Customizing Your Home Page

The easiest way to get started customizing your home page is to use the example site that was [created](getting-started-site-creation.md) when you ran the [Docusaurus initialization script](getting-started-installation.md).

You can [start](getting-started-preparation.md#verifying-installation) your local server and go to `http://localhost:3000` to see what the example home page looks like. From there, edit the `website/pages/en/index.js` file and its various components to use the images and text you want for your project.

## Adding Other Custom Pages

Docusaurus provides some simple example pages in the `website/pages/en` directory, including `index.js`, `users.js`, and `help.js`. These are good examples to showcase how to create a custom page for Docusaurus.

```bash
root-of-repo
├── docs
├── website
│   ├── blog
│   ├── core
│   │   └── Footer.js
│   ├── node_modules
│   ├── package.json
│   ├── pages
│   │   ├── index.js
│   │   ├── users.js
│   │   └── help.js
│   ├── sidebars.json
│   ├── siteConfig.js
│   └── static
```

Of course, you are also free to write your own pages. It is strongly suggested that you at least have an index page, but none of the pages provided are mandatory to include in your site. More information on how to use the provided components or include your own can be found [here](api-pages.md). Information on how to link to your different pages in the header navigation bar can be found [here](guides-navigation.md).

> If you want your page to show up in your navigation header, you will need to update `siteConfig.js` to add to the `headerLinks` element. e.g., `{ page: "about-slash", label: "About/"}`,

## Adding Static Pages

Static `.html` files can also be used, but they will not include Docusaurus' header, footer, or styles by default. These can be added to the `static` folder in the same way as other [static assets](api-pages.md#using-static-assets). Alternatively, they can be placed in the `pages` folder and would be served as-is instead of being rendered from React.

If you wish to use Docusaurus's stylesheet, you can access it at `${baseUrl}css/main.css`. If you wish to use separate css for these static pages, you can exclude them from being concatenated to Docusaurus's styles by adding them into the `siteConfig.separateCss` field in `siteConfig.js`.

> You can set the [`$wrapPagesHTML` site config option](api-site-config.md#optional-fields) in order to wrap raw HTML fragments with the Docusaurus site styling, header and footer.

## Customizing Your Site Footer

Starting from the example `core/Footer.js` file that was [created](getting-started-site-creation.md) when you ran the [Docusaurus initialization script](getting-started-installation.md), edit the footer to include any links to pages on your site or other sites that you wish to have.

The example provided has three columns with a footer image on the left and Facebook's open source logo and copyright at the bottom. If your project is not a Facebook open source project, remove the logo and copyright. Otherwise, feel free to get creative with your footer and make it look however you'd like!

Some suggestions for links you may want to provide: documentation, API, Twitter, Discord, Facebook groups, Stack Overflow, GitHub, etc.

Your footer will automatically get applied to all pages on your site, including docs and blog posts. The sole exception to this is any static html pages you include.

If you do not want a footer for your site, change the `render` function of `core/Footer.js` to return `null`. e.g.,

```jsx
const React = require("react");

class Footer extends React.Component {
  render() {
    return null;
  }
}

module.exports = Footer;
```
