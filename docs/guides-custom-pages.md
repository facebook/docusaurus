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
root-directory
├── docs
└── website
    ├── blog
    ├── core
    │   └── Footer.js
    ├── package.json
    ├── pages
    │   ├── index.js
    │   ├── users.js
    │   └── help.js
    ├── sidebars.json
    ├── siteConfig.js
    └── static
```

Of course, you are also free to write your own pages. It is strongly suggested that you at least have an index page, but none of the pages provided are mandatory to include in your site. More information on how to use the provided components or include your own can be found [here](api-pages.md). Information on how to link to your different pages in the header navigation bar can be found [here](guides-navigation.md).

> If you want your page to show up in your navigation header, you will need to update `siteConfig.js` to add to the `headerLinks` element. e.g., `{ page: 'about-slash', label: 'About/' }`,

## Adding Static Pages

Static `.html` files can also be used, but they will not include Docusaurus' header, footer, or styles by default. These can be added to the `static` directory in the same way as other [static assets](api-pages.md#using-static-assets). Alternatively, they can be placed in the `pages` directory and would be served as-is instead of being rendered from React.

If you wish to use Docusaurus' stylesheet, you can access it at `${baseUrl}css/main.css`. If you wish to use separate css for these static pages, you can exclude them from being concatenated to Docusaurus' styles by adding them into the `siteConfig.separateCss` field in `siteConfig.js`.

> You can set the [`$wrapPagesHTML` site config option](api-site-config.md#optional-fields) in order to wrap raw HTML fragments with the Docusaurus site styling, header and footer.

## Customizing Your Site Footer

Starting from the example `core/Footer.js` file that was [created](getting-started-site-creation.md) when you ran the [Docusaurus initialization script](getting-started-installation.md), edit the footer to include any links to pages on your site or other sites that you wish to have.

The example provided has three columns with a footer image on the left and Facebook's open source logo and copyright at the bottom. If your project is not a Facebook open source project, remove the logo and copyright. Otherwise, feel free to get creative with your footer and make it look however you'd like!

Some suggestions for links you may want to provide: documentation, API, Twitter, Discord, Facebook groups, Stack Overflow, GitHub, etc.

Your footer will automatically get applied to all pages on your site, including docs and blog posts. The sole exception to this is any static HTML pages you include.

If you do not want a footer for your site, change the `render` function of `core/Footer.js` to return `null`. e.g.,

```jsx
const React = require('react');

class Footer extends React.Component {
  render() {
    return null;
  }
}

module.exports = Footer;
```
## Custom Copy to Clipboard Button

Under `static/js`, create a file called `code-block-buttons.js` with the following:

```js
// Turn off ESLint for this file because it's sent down to users as-is.
/* eslint-disable */
window.addEventListener('load', function() {
  function button(label, ariaLabel, icon, className) {
    const btn = document.createElement('button');
    btn.classList.add('btnIcon', className);
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', ariaLabel);
    btn.innerHTML =
      '<div class="btnIcon__body">' +
      icon +
      '<strong class="btnIcon__label">' +
      label +
      '</strong>' +
      '</div>';
    return btn;
  }

  function addButtons(codeBlockSelector, btn) {
    document.querySelectorAll(codeBlockSelector).forEach(function(code) {
      code.parentNode.appendChild(btn.cloneNode(true));
    });
  }

  const copyIcon =
    '<svg width="12" height="12" viewBox="340 364 14 15" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M342 375.974h4v.998h-4v-.998zm5-5.987h-5v.998h5v-.998zm2 2.994v-1.995l-3 2.993 3 2.994v-1.996h5v-1.995h-5zm-4.5-.997H342v.998h2.5v-.997zm-2.5 2.993h2.5v-.998H342v.998zm9 .998h1v1.996c-.016.28-.11.514-.297.702-.187.187-.422.28-.703.296h-10c-.547 0-1-.452-1-.998v-10.976c0-.546.453-.998 1-.998h3c0-1.107.89-1.996 2-1.996 1.11 0 2 .89 2 1.996h3c.547 0 1 .452 1 .998v4.99h-1v-2.995h-10v8.98h10v-1.996zm-9-7.983h8c0-.544-.453-.996-1-.996h-1c-.547 0-1-.453-1-.998 0-.546-.453-.998-1-.998-.547 0-1 .452-1 .998 0 .545-.453.998-1 .998h-1c-.547 0-1 .452-1 .997z" fill-rule="evenodd"/></svg>';

  addButtons(
    '.hljs',
    button('Copy', 'Copy code to clipboard', copyIcon, 'btnClipboard'),
  );

  const clipboard = new ClipboardJS('.btnClipboard', {
    target: function(trigger) {
      return trigger.parentNode.querySelector('code');
    },
  });

  clipboard.on('success', function(event) {
    event.clearSelection();
    const textEl = event.trigger.querySelector('.btnIcon__label');
    textEl.textContent = 'Copied';
    setTimeout(function() {
      textEl.textContent = 'Copy';
    }, 2000);
  });
});
```

Under `static/css`, create a file called `code-block-buttons.css` and add the following:


```css
/* "Copy" code block button */
pre {
  position: relative;
}

pre .btnIcon {
  position: absolute;
  top: 4px;
  z-index: 2;
  cursor: pointer;
  border: 1px solid transparent;
  padding: 0;
  color: #fff;
  background-color: transparent;
  height: 30px;
  transition: all .25s ease-out;
}

pre .btnIcon:hover {
  text-decoration: none;
}

.btnIcon__body {
  align-items: center;
  display: flex;
}

.btnIcon svg {
  fill: currentColor;
  margin-right: .4em;
}

.btnIcon__label {
  font-size: 11px;
}

.btnClipboard {
  right: 10px;
}
```

Add the following to `siteConfig.js`:

```js
scripts: [
  'https://buttons.github.io/buttons.js',
  'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
  '/js/code-blocks-buttons.js',
],
stylesheets: ['/css/code-blocks-buttons.css']
```

Your copy to clipboard buttons should now appear at the upper right of every fenced code block.
