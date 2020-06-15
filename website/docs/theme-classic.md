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
  // ...
  themeConfig: {
    disableDarkMode: false,
    // ...
  },
};
```

With the enabled `defaultDarkMode` option you could set dark mode by default. However, in this case, the user's preference will not be taken into account until they manually sets the desired mode via toggle in the navbar.

```js {4} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    defaultDarkMode: true,
    // ...
  },
};
```

### Meta image

You can configure a default image that will be used for your meta tag, in particular `og:image` and `twitter:image`.

```js {4-6} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    // Relative to your site's "static" directory.
    // Cannot be SVGs. Can be external URLs too.
    image: 'img/docusaurus.png',
    // ...
  },
};
```

### Announcement bar

Sometimes you want to announce something in your website. Just for such a case, you can add an announcement bar. This is a non-fixed and dismissable panel above the navbar.

```js {4-10} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    announcementBar: {
      id: 'support_us', // Any value that will identify this message.
      content:
        'We are looking to revamp our docs, please fill <a target="_blank" rel="noopener noreferrer" href="#">this survey</a>',
      backgroundColor: '#fafbfc', // Defaults to `#fff`.
      textColor: '#091E42', // Defaults to `#000`.
    },
    // ...
  },
};
```

## Hooks

### `useThemeContext`

React hook to access theme context. This context contains functions for setting light and dark mode and boolean property, indicating which mode is currently in use.

Usage example:

```jsx
import React from 'react';
// highlight-next-line
import useThemeContext from '@theme/hooks/useThemeContext';

const Example = () => {
  // highlight-next-line
  const {isDarkTheme, setLightTheme, setDarkTheme} = useThemeContext();

  return <h1>Dark mode is now {isDarkTheme ? 'on' : 'off'}</h1>;
};
```

:::note

The component calling `useThemeContext` must be a child of the `Layout` component.

```jsx
function ExamplePage() {
  return (
    <Layout>
      <Example />
    </Layout>
  );
}
```

:::

## Navbar

### Navbar title & logo

You can add a logo and title to the navbar via `themeConfig.navbar`. Logo can be placed in [static folder](static-assets.md). Logo URL is set to base URL of your site by default. Although you can specify your own URL for the logo, if it is an external link, it will open in a new tab. In addition, you can override a value for the target attribute of logo link, it can come in handy if you are hosting docs website in a subdirectory of your main website, and in which case you probably do not need a link in the logo to the main website will open in a new tab.

To improve dark mode support, you can also set a different logo for this mode.

```js {5-11} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    navbar: {
      title: 'Site Title',
      logo: {
        alt: 'Site Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo_dark.svg', // Default to `logo.src`.
        href: 'https://v2.docusaurus.io/', // Default to `siteConfig.baseUrl`.
        target: '_self', // By default, this value is calculated based on the `href` attribute (the external link will open in a new tab, all others in the current one).
      },
    },
    // ...
  },
};
```

### Navbar links

You can add links to the navbar via `themeConfig.navbar.links`:

```js {5-15} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    navbar: {
      links: [
        {
          // Client-side routing, used for navigating within the website.
          // The baseUrl will be automatically prepended to this value.
          to: 'docs/introduction',
          // A full-page navigation, used for navigating outside of the website.
          // You should only use either `to` or `href`.
          href: 'https://www.facebook.com',
          // Prepends the baseUrl to href values.
          prependBaseUrlToHref: true,
          // The string to be shown.
          label: 'Introduction',
          // Left or right side of the navbar.
          position: 'left', // or 'right'
          // To apply the active class styling on all
          // routes starting with this path.
          // This usually isn't necessary
          activeBasePath: 'docs',
          // Alternative to activeBasePath if required.
          activeBaseRegex: 'docs/(next|v8)',
          // Custom CSS class (for styling any item).
          className: '',
        },
        // ... other links
      ],
    },
    // ...
  },
};
```

React Router should automatically apply active link styling to links, but you can use `activeBasePath` in edge cases. For cases in which a link should be active on several different paths (such as when you have multiple doc folders under the same sidebar), you can use `activeBaseRegex`. `activeBaseRegex` is a more flexible alternative to `activeBasePath` and takes precedence over it -- Docusaurus parses it into a regular expression that is tested against the current URL.

Outbound (external) links automatically get `target="_blank" rel="noopener noreferrer"` attributes.

### Navbar dropdown

Navbar items can also be dropdown items by specifying the `items`, an inner array of navbar links.

```js {9-19} title="docusaurus.config.js"
module.exports = {
  // ...
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
    // ...
  },
};
```

### Auto-hide sticky navbar

You can enable this cool UI feature that automatically hides the navbar when a user starts scrolling down the page, and show it again when the user scrolls up.

```js {5} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    navbar: {
      hideOnScroll: true,
    },
    // ...
  },
};
```

<!--

## Footer

TODO.

-->

## CodeBlock

Docusaurus uses [Prism React Renderer](https://github.com/FormidableLabs/prism-react-renderer) to highlight code blocks.

### Theme

By default, we use [Palenight](https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/themes/palenight.js) as syntax highlighting theme. You can specify a custom theme from the [list of available themes](https://github.com/FormidableLabs/prism-react-renderer/tree/master/src/themes). If you want to use a different syntax highlighting theme when the site is in dark mode, you may also do so.

```js {5-6} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    // ...
  },
};
```

:::note

If you use the line highlighting Markdown syntax, you might need to specify a different highlight background color for the dark mode syntax highlighting theme. Refer to the [docs for guidance](markdown-features.mdx#line-highlighting).

:::

### Default language

You can set a default language for code blocks if no language is added after the opening triple backticks (i.e. ```). Note that a valid [language name](https://prismjs.com/#supported-languages) must be passed, e.g.:

```js {5} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    prism: {
      defaultLanguage: 'javascript',
    },
    // ...
  },
};
```
