---
id: custom-pages
title: Custom Pages
---

## Customizing Your Home Page

The easiest way to get started customizing your home page is to use the [examples generated previously](getting-started-site-creation.md). You can start your local server and go to `http://localhost:3000` to see what the example home page looks like. From there, edit the `website/pages/en/index.js` file and its various components to use the images and text you want for your project.

## Adding Other Custom Pages

Docusaurus provides some simple example pages (`index.js`, `users.js`, `help.js`), but of course you're also free to write your own pages however you want. It is strongly suggested that you at least have an index page, but none of the pages are mandatory to include. More information on how to use the provided components or include your own can be found [here](api-pages.md). Information on how to link to your different pages in the header navigation bar can be found [here](guides-navigation.md).

## Customizing Your Site Footer

Starting from the example `core/Footer.js` file you [generated before](getting-started-site-creation.md), edit the footer to include any links to pages on your site or elsewhere that you wish to have. 

The example provided has three columns with a footer image on the left and Facebook's open source logo and copyright at the bottom. If your project is not a Facebook open source project, remove the logo and copyright. Otherwise, feel free to get creative with your footer and make it look however you'd like!

Some suggestions for links you may want to provide: documentation, API, Twitter, Discord, Facebook groups, Stack Overflow, GitHub, etc.

Your footer will automatically get applied to all pages on your site, including docs and blog posts. The sole exception to this is any static html pages you include.

If you don't want a footer for your site, change the `render` function of `core/Footer.js` to return `null`. e.g.,
```jsx
const React = require("react");

class Footer extends React.Component {
  render() {
    return null;
  }
}

module.exports = Footer;
```
