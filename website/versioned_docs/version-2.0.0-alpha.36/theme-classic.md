---
id: theme-classic
title: Classic Theme Configuration
---

> :warning: _This section is a work in progress._

## Common

### Dark mode

To remove the ability to switch on dark mode, there is an option `themeConfig.disableDarkMode`, which is implicitly set to `false`.

## Navbar

### Navbar Title & Logo

You can add a logo and title to the navbar via `themeConfig.navbar`. Logo can be placed in [static folder](static-assets.md).

```js
// docusaurus.config.js
module.exports = {
  themeConfig: {
    navbar: {
      title: 'Site Title',
      logo: {
        alt: 'Site Logo',
        src: 'img/logo.svg',
      },
    }
}
```

### Navbar Links

You can add links to the navbar via `themeConfig.navbar.links`:

```js
// docusaurus/config.js
module.exports = {
  themeConfig: {
    navbar: {
      links: [
        {
          to: 'docs/docusaurus.config.js',
          label: 'docusaurus.config.js',
          position: 'left',
        },
        // ... other links
      ],
    }
}
```

Outbound links automatically get `target="_blank" rel="noopener noreferrer"`.

## Footer

## `CodeBlock`

Docusaurus uses [Prism React Renderer](https://github.com/FormidableLabs/prism-react-renderer) to highlight code blocks.

### Theme

By default, we use [Palenight](https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/themes/palenight.js) as syntax highlighting theme. You can specify a custom theme from the [list of available themes](https://github.com/FormidableLabs/prism-react-renderer#theming), e.g.:

```js
// docusaurus/config.js
module.exports = {
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/dracula'),
    },
  },
};
```

### Default language

You can set a default language for code blocks if no language is added after the opening triple backticks (i.e. ```). Note that a valid [language name](https://prismjs.com/#supported-languages) must be passed, e.g.:

```js
// docusaurus/config.js
module.exports = {
  themeConfig: {
    prism: {
      defaultLanguage: 'javascript',
    },
  },
};
```
