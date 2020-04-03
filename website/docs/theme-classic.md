---
id: theme-classic
title: '@docusaurus/theme-classic'
---

:::caution

This section is a work in progress.

:::

## Common

### Dark mode

To remove the ability to switch on dark mode, there is an option `themeConfig.disableDarkMode`, which is implicitly set to `false`.

```js {4} title="docusaurus.config.js"
module.exports = {
  ...
  themeConfig: {
    disableDarkMode: false,
    ...
  },
};
```

### Meta image

You can configure a default image that will be used for your meta tag, in particular `og:image` and `twitter:image`.

```js {4-6} title="docusaurus.config.js"
module.exports = {
  ...
  themeConfig: {
    // Relative to your site's "static" directory.
    // Cannot be SVGs. Can be external URLs too.
    image: 'img/docusaurus.png',
    ...
  },
}
```

### Announcement bar

Sometimes you want to announce something in your website. Just for such a case, you can add an announcement bar. This is a non-fixed and dismissable panel above the navbar.

```js {4-9} title="docusaurus.config.js"
module.exports = {
  ...
  themeConfig: {
    announcementBar: {
      id: 'support_us', // Any value that will identify this message
      content: 'We are looking to revamp our docs, please fill <a target="_blank" rel="noopener noreferrer" href="#">this survey</a>',
      backgroundColor: '#fafbfc', // Defaults to `#fff`
      textColor: '#091E42', // Defaults to `#000`
    },
    ...
  },
}
```

## Hooks

### `useThemeContext`

React hook to access theme context. This context contains functions for setting light and dark mode and boolean property, indicating which mode is currently in use.

Usage example:

```jsx
import React from 'react';
// highlight-next-line
import useThemeContext from '@theme/hooks/useThemeContext';

const Test = () => {
  // highlight-next-line
  const {isDarkTheme, setLightTheme, setDarkTheme} = useThemeContext();

  return <h1>Dark mode is now {isDarkTheme ? 'on' : 'off'}</h1>;
};
```

## Navbar

### Navbar Title & Logo

You can add a logo and title to the navbar via `themeConfig.navbar`. Logo can be placed in [static folder](static-assets.md). Logo URL is set to base URL of your site by default. Although you can specify your own URL for the logo, if it is an external link, it will open in a new tab. In addition, you can override a value for the target attribute of logo link, it can come in handy if you are hosting docs website in a subdirectory of your main website, and in which case you probably do not need a link in the logo to the main website will open in a new tab.

To improve dark mode support, you can also set a different logo for this mode.

```js {5-11} title="docusaurus.config.js"
module.exports = {
  ...
  themeConfig: {
    navbar: {
      title: 'Site Title',
      logo: {
        alt: 'Site Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo_dark.svg', // default to logo.src
        href: 'https://v2.docusaurus.io/', // default to siteConfig.baseUrl
        target: '_self', // by default, this value is calculated based on the `href` attribute (the external link will open in a new tab, all others in the current one)
      },
    },
    ...
  },
}
```

### Navbar Links

You can add links to the navbar via `themeConfig.navbar.links`:

```js {5-15} title="docusaurus.config.js"
module.exports = {
  ...
  themeConfig: {
    navbar: {
      links: [
        {
          to: 'docs/introduction',
          label: 'Introduction',
          position: 'left', // or 'right'
          // To apply the active class styling on all
          // routes starting with this path.
          activeBasePath: 'docs',
        },
        // ... other links
      ],
    },
    ...
  },
}
```

Outbound links automatically get `target="_blank" rel="noopener noreferrer"` attributes.

### Navbar Dropdown

Navbar items can also be dropdown items by specifying the `items`, an inner array of navbar links.

```js {9-19} title="docusaurus.config.js"
module.exports = {
  ...
  themeConfig: {
    navbar: {
      links: [
        {
          label: 'Community',
          position: 'left', // or 'right'
          items: [
            {
              label: 'Facebook',
              href: '...',
            },
            {
              label: 'GitHub',
              href: '...',
            },
            // ... more items
          ],
        },
      ],
    },
    ...
  },
}
```

### Auto-hide sticky navbar

You can enable this cool UI feature that automatically hides the navbar when a user starts scrolling down the page, and show it again when the user scrolls up.

```js {5} title="docusaurus.config.js"
module.exports = {
  ...
  themeConfig: {
    navbar: {
      hideOnScroll: true,
    },
    ...
  },
}
```

## Footer

## `CodeBlock`

Docusaurus uses [Prism React Renderer](https://github.com/FormidableLabs/prism-react-renderer) to highlight code blocks.

### Theme

By default, we use [Palenight](https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/themes/palenight.js) as syntax highlighting theme. You can specify a custom theme from the [list of available themes](https://github.com/FormidableLabs/prism-react-renderer/tree/master/src/themes). If you want to use a different syntax highlighting theme when the site is in dark mode, you may also do so.

```js {4-5} title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
  },
};
```

**Note:** If you use the line highlighting Markdown syntax, you might need to specify a different highlight background color for the dark mode syntax highlighting theme. Refer to the [docs for guidance](markdown-features.mdx#line-highlighting).

### Default language

You can set a default language for code blocks if no language is added after the opening triple backticks (i.e. ```). Note that a valid [language name](https://prismjs.com/#supported-languages) must be passed, e.g.:

```js {5} title="docusaurus.config.js"
module.exports = {
  ...
  themeConfig: {
    prism: {
      defaultLanguage: 'javascript',
    },
    ...
  },
};
```
