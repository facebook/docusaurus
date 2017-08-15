---
id: api-pages
title: Pages and Styles
---

Docusaurus provides support for writing pages as React components inside the `pages` folder which will share the same header, footer, and styles as the rest of the site.

## Urls for Pages

Any files in `pages` will be rendered to static html with the path of the file after "pages". For example, with a baseUrl of `"/docusaurus/"`:

A page for `pages/en/help.js` will be found at the url `/docusaurus/en/help.js`.

A page for `pages/mypage.js` will be found at the url `/docusaurus/mypage.js`.

The only exception to this is that any files in `pages/en` will also get copied out into `pages` and will override any of the files of the same name in `pages`. i.e.,

`/docusaurus/help.js` will be the same as `/docusaurus/en/help.js` if a `pages/en/help.js` file exists, even if `pages/help.js` is different.


## Page Require Paths

Docusaurus provides a few useful React components for users to write their own pages, found in the `CompLibrary` module. This module is provided as part of Docusaurus in `node_modules/docusaurus`, so to access it, pages in the `pages` folder are temporarily copied into `node_modules/docusaurus` when rendering to static html. As seen in the example files, this means that a user page at `pages/en/index.js` uses a require path to `"../../core/CompLibrary.js"` to import the provided components.

What this means to the user is that if you wish to use the `CompLibrary` module, make sure the require path is set correctly. For example, a page at `page/mypage.js` would use a path `"../core/CompLibrary.js"`.

If you wish to use your own components inside the website folder, use `process.cwd()` which will refer to the `website` folder to construct require paths. For example, if you add a component to `website/core/mycomponent.js`, you can use the require path, `"process.cwd() + /core/mycomponent.js"`.

## Provided Components

Docusaurus provides the following components in `CompLibrary`:

### `CompLibrary.Marked` 

A React component that parses Markdown to html.

Example:

```jsx
const Marked = CompLibrary.Marked;

<Marked>[Markdown syntax for a link](http://www.example.com)</Marked>
```

### `CompLibrary.Container`

A React container component using Docusaurus styles. Has optional padding and background color attributes that you can configure.

Padding choices: `all`, `bottom`, `left`, `right`, `top`.  
Background choices: `dark`, `highlight`, `light`.

Example:

```jsx
<Container padding={["bottom", "top"]} background="light">
  ...         
</Container>
```

### `CompLibrary.GridBlock`

A React component to organize text and images. 

The `align` attribute determines text alignment. Text alignment defaults to `left` and can be set to `center` or `right`.

The `layout` attribute determines number of column sections per GridBlock. `layout` defaults to `twoColumn` and can be set to `threeColumn` or `fourColumn` as well.

The `contents` attribute is an array containing the contents of each section of the GridBlock. Each content object can have the following fields: 

- `content` for the text of this section, which is parsed from markdown
- `image` for the path to an image to display 
- `imageAlign` field for image alignment relative to the text, which defaults to `top` and can be set to `bottom`, `left`, or `right`
- `title` for the title to display for this section, which is parsed from markdown
- `imageLink` for a link destination from clicking the image

Example:

```
<GridBlock
  align="center"
  contents={[
    {
      content: "Learn how to use this project",
      image: siteConfig.baseUrl + "img/learn.png",
      title: `[Learn](${siteConfig.baseUrl}docs/tutorial.html)`,
      imageLink: siteConfig.baseUrl + "docs/tutorial.html"
    },
    {
      content: "Questions gathered from the community",
      image: siteConfig.baseUrl + "img/faq.png",
      imageAlign: "top",
      title: "Frequently Asked Questions"
    },
    {
      content: "Lots of documentation is on this site",
      title: "More"
    }
  ]}
  layout="threeColumn"
/>
```

More examples of how these components are used can be found in the [generated example files](getting-started-preparation.md) as well as in Docusaurus's own repo for its website set-up.

## Translating Strings

When translations are enabled, any pages inside `pages/en` will be translated for all enabled languages. Urls for non-English pages will use their language codes as specified in the `languages.js` file. E.g. The url for a French page of `pages/en/help.js` would be found at `docusaurus/fr/help.html`.

When writing pages that you wish to translate, wrap any strings to be translated inside a `<translate>` tag. e.g.,

```jsx
<p><translate>I like translations</translate></p>
```

You can also provide an optional description attribute to provide context for translators. e.g,

```jsx
<p><translate desc="statement made to reader">I like translations</translate></p>
```

Add the following require statement as well:

```js
const translate = require("../../server/translate.js").translate;
```

Note that this path is valid for files inside `pages/en` and should be adjusted accordingly if files are in different locations, as discussed [above](#page-require-paths).

## Using Static Assets

Static assets should be placed into the `website/static` folder. They can be accesssed by their paths, excluding "static". For example, if the site's `baseUrl` is "/docusaurus/", an image in `website/static/img/logo.png` is available at `/docusaurus/img/logo.png`.


## Styles

You should configure your site's primary, secondary, and Prism colors using the `colors` field in `siteConfig` as specified [here](site-config.md). You can also configure other colors in the same way as described in the `siteConfig` doc.

You can provide your own custom styles by adding them anywhere in the `website/static` folder. Any `.css` files you provide in the `static` folder will get concatenated to the end of Docusaurus's provided styles, allowing you to add to or override Docusaurus default styles as you wish.

An easy way to figure out what classes you wish to override or add to is to start your server locally and use your browser's inspect element tool.

## Adding Static Pages

It is not encouraged to do so, but it is also possible to provide static `.html` files to use. These can be added to the `static` folder in the same way as other static assets. Alternatively, they can be placed in the `pages` folder and would be served as-is instead of being rendered from React. They will not include Docusaurus's header, footer, or styles by default.

If you wish to use Docusaurus's stylesheet, you can access it at `${baseUrl}css/main.css`. If you wish to use separate css for these static pages, you can exclude them from being concatenated to Docusaurus's styles by adding them into the `siteConfig.separateCss` field.
