---
id: api-pages
title: Pages and Styles
---

Docusaurus provides support for writing pages as React components inside the `website/pages` directory which will share the same header, footer, and styles as the rest of the site.

## Provided Props

Docusaurus provides your [siteConfig.js](api-site-config.md) as a `config` props. Hence, you can access `baseUrl` or `title` through this props.

Example

```js
const React = require('react');

class MyPage extends React.Component {
  render() {
    const siteConfig = this.props.config;
    return <div>{siteConfig.title}</div>;
  }
}

module.exports = MyPage;
```

## URLs for Pages

Any `.js` files in `website/pages` will be rendered to static HTML using the path of the file after `pages`. Files in `website/pages/en` will also get copied out into `pages` and will OVERRIDE any files of the same name in `pages`. For example, the page for the `website/pages/en/help.js` file will be found at the URL `${baseUrl}en/help.js` as well as the URL `${baseUrl}help.js`, where `${baseUrl}` is the `baseUrl` fieldset in your [siteConfig.js file](api-site-config.md).

## Titles for Pages

By default, the title of your page is `<title> • <tagline>` where `title` and `tagline` fields are set in [`siteConfig.js`](api-site-config.md). You can exclude the tagline in the title by setting `disableTitleTagline` to `true`. If you want to set a specific title for your custom pages, add a `title` class property on your exported React component.

Example:

```js
const React = require('react');

class MyPage extends React.Component {
  render() {
    // ... your rendering code
  }
}

MyPage.title = 'My Custom Title';

module.exports = MyPage;
```

## Description for Pages

By default, the description your page is `tagline` set in [`siteConfig.js`](api-site-config.md). If you want to set a specific description for your custom pages, add a `description` class property on your exported React component.

Example:

```js
const React = require('react');

class MyPage extends React.Component {
  render() {
    // ... your rendering code
  }
}

MyPage.description = 'My Custom Description';

module.exports = MyPage;
```

This will be translated to a description metadata tag on the generated HTML.

```html
<meta property="og:description" content="My Custom Description" />
<meta name="description" content="My Custom Description" />
```

## Page Require Paths

Docusaurus provides a few useful React components for users to write their own pages, found in the `CompLibrary` module. This module is provided as part of Docusaurus in `node_modules/docusaurus`, so to access it, pages in the `pages` directory are temporarily copied into `node_modules/docusaurus` when rendering to static HTML. As seen in the example files, this means that a user page at `pages/en/index.js` uses a require path to `'../../core/CompLibrary.js'` to import the provided components.

What this means to the user is that if you wish to use the `CompLibrary` module, make sure the require path is set correctly. For example, a page at `page/mypage.js` would use a path `'../core/CompLibrary.js'`.

If you wish to use your own components inside the website directory, use `process.cwd()` which will refer to the `website` directory to construct require paths. For example, if you add a component to `website/core/mycomponent.js`, you can use the require path, `'process.cwd() + /core/mycomponent.js'`.

There is a special import for custom items `@theme-original`. The `theme-original` alias (just like using `theme` alias) will not get the theme component from the plugin's code. While the `init-theme` alias refers to the proper (theme) component (from the theme itself, where it is first defined). Therefore the `theme-original` is for the user and `theme-initial` is for the plugins.

## Provided Components

Docusaurus provides the following components in `CompLibrary`:

### `CompLibrary.MarkdownBlock`

A React component that parses markdown and renders to HTML.

Example:

```jsx
const MarkdownBlock = CompLibrary.MarkdownBlock;

<MarkdownBlock>
  [Markdown syntax for a link](http://www.example.com)
</MarkdownBlock>;
```

### `CompLibrary.Container`

A React container component using Docusaurus styles. Has optional padding and background color props that you can configure.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `padding` | Array of `'all'`, `'bottom'`, `'left'`, `'right'`, `'top'` | `[]` | Positions of the padding. |
| `background` | One of `'dark'`, `'highlight'`, `'light'` | `null` | Background styling of the element. |
| `className` | String | - | Custom class to add to the element. |

**Example**

```jsx
<Container
  padding={['bottom', 'top']}
  background="light"
  className="myCustomClass">
  ...
</Container>
```

### `CompLibrary.GridBlock`

A React component to organize text and images.

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | One of `'left'`, `'center'`, `'right'` | `'left'` | Text alignment of content. |
| `layout` | One of `'twoColumn'`, `'threeColumn'`, `'fourColumn'` | `'twoColumn'` | Number of column sections in the `GridBlock`. |
| `className` | String | - | Custom class to add to the element. |
| `contents` | Array of content objects | `[]` | Contents of each section of the GridBlock. Refer to the next table for the fields available on a content object. |

**Content Object**

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | String | - | The display title of this section, which is parsed using Markdown |
| `content` | String | - | The text of this section, which is parsed using Markdown |
| `image` | String | - | The path of the display image |
| `imageAlt` | String | - | The text that will be shown in case the image is not available |
| `imageAlign` | One of `'top'`, `'left'`, `'bottom'`, `'right'` | `'left'` | Image alignment relative to the text |
| `imageLink` | String | - | Link destination from clicking the image |

**Example**

```jsx
<GridBlock
  align="center"
  layout="threeColumn"
  className="myCustomClass"
  contents={[
    {
      title: `[Learn](${siteConfig.baseUrl}${siteConfig.docsUrl}/tutorial.html)`,
      content: 'Learn how to use this project',
      image: siteConfig.baseUrl + 'img/learn.png',
      imageAlt: 'Learn how to use this project',
      imageLink: siteConfig.baseUrl + 'docs/tutorial.html',
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Questions gathered from the community',
      image: siteConfig.baseUrl + 'img/faq.png',
      imageAlign: 'top',
    },
    {
      title: 'More',
      content: 'Lots of documentation is on this site',
    },
  ]}
/>
```

More examples of how these components are used can be found in the [generated example files](getting-started-preparation.md) as well as in Docusaurus' own repository for its website set-up.

## Translating Strings

When translations are enabled, any pages inside `website/pages/en` will be translated for all enabled languages. URLs for non-English pages will use their language tags as specified in the `languages.js` file. E.g. The URL for a French page of `website/pages/en/help.js` would be found at `${baseUrl}fr/help.html`.

When writing pages that you wish to translate, wrap any strings to be translated inside a `<translate>` tag. e.g.,

```jsx
<p>
  <translate>I like translations</translate>
</p>
```

You can also provide an optional description attribute to provide context for translators. e.g,

```jsx
<a href="/community">
  <translate desc="Footer link to page referring to community GitHub and Slack">
    Community
  </translate>
</a>
```

Add the following require statement as well:

```js
const translate = require('../../server/translate.js').translate;
```

Note that this path is valid for files inside `pages/en` and should be adjusted accordingly if files are in different locations, as discussed [above](#page-require-paths).

## Using Static Assets

Static assets should be placed into the `website/static` directory. They can be accessed by their paths, excluding `static`. For example, if the site's `baseUrl` is `/docusaurus/`, an image in `website/static/img/logo.png` is available at `/docusaurus/img/logo.png`.

## Styles

You should configure your site's primary, secondary, and code block colors using the `colors` field in `siteConfig` as specified [here](api-site-config.md). You can also configure other colors in the same way as described in the `siteConfig` doc.

There are several ways to access the default styles provided for your site. If you have started developing your website and executed the `docusaurus-init` or `yarn install` command, your default styles can be found at `website/node_modules/docusaurus/lib/static/css/main.css`. Alternatively, the `main.css` file may be inspected directly at the [Docusarus GitHub repository](https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-1.x/lib/static/css/main.css).

You can provide your own custom styles by adding them anywhere in the `website/static` directory. Any `.css` files you provide in the `static` directory will get concatenated to the end of Docusaurus' provided styles, allowing you to add to or override Docusaurus default styles as you wish.

One way to figure out what classes you wish to override or add to is to [start your server locally](api-commands.md) and use your browser's inspect element tool.
