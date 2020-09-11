---
id: theme-classic
title: '@docusaurus/theme-classic'
---

:::caution

This section is a work in progress.

:::

## Common

### Color mode - dark mode

The classic theme provides by default light and dark mode support, with a navbar switch for the user.

It is possible to customize the color mode support with the following configuration:

```js {6-35} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    // ...
    colorMode: {
      // "light" | "dark"
      defaultMode: 'light',

      // Hides the switch in the navbar
      // Useful if you want to support a single color mode
      disableSwitch: false,

      // Should we use the prefers-color-scheme media-query,
      // using user system preferences, instead of the hardcoded defaultMode
      respectPrefersColorScheme: false,

      // Dark/light switch icon options
      switchConfig: {
        // Icon for the switch while in dark mode
        darkIcon: '🌙',

        // CSS to apply to dark icon,
        // React inline style object
        // see https://reactjs.org/docs/dom-elements.html#style
        darkIconStyle: {
          marginLeft: '2px',
        },

        // Unicode icons such as '\u2600' will work
        // Unicode with 5 chars require brackets: '\u{1F602}'
        lightIcon: '\u{1F602}'

        lightIconStyle: {
          marginLeft: '1px',
        },
      },
    },
    // ...
  },
  // ...
};
```

:::caution

With `respectPrefersColorScheme: true`, the `defaultMode` is overridden by user system preferences.

If you only want to support one color mode, you likely want to ignore user system preferences.

:::

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

Sometimes you want to announce something in your website. Just for such a case, you can add an announcement bar. This is a non-fixed and optionally dismissable panel above the navbar.

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
      isCloseable: false, // Defaults to `true`.
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

### Navbar items

You can add items to the navbar via `themeConfig.navbar.items`.

By default, Navbar items are regular links (internal or external).

```js {5-15} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    navbar: {
      items: [
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
        // ... other items
      ],
    },
    // ...
  },
};
```

React Router should automatically apply active link styling to links, but you can use `activeBasePath` in edge cases. For cases in which a link should be active on several different paths (such as when you have multiple doc folders under the same sidebar), you can use `activeBaseRegex`. `activeBaseRegex` is a more flexible alternative to `activeBasePath` and takes precedence over it -- Docusaurus parses it into a regular expression that is tested against the current URL.

Outbound (external) links automatically get `target="_blank" rel="noopener noreferrer"` attributes.

### Navbar dropdown

Navbar items can also be dropdown items by specifying the `items`, an inner array of navbar items.

```js {9-19} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    navbar: {
      items: [
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

### Navbar docs version dropdown

If you use docs with versioning, this special navbar item type that will render a dropdown with all your site's available versions. The user will be able to switch from one version to another, while staying on the same doc (as long as the doc id is constant across versions).

```js {5-8} title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'left',
        },
      ],
    },
  },
};
```

### Navbar docs version

If you use docs with versioning, this special navbar item type will link to the active/browsed version of your doc (depends on the current url), and fallback to the latest version.

```js {5-10} title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      items: [
        {
          type: 'docsVersion',
          position: 'left',
          // to: "/path // by default, link to active/latest version
          // label: "label" // by default, show active/latest version label
        },
      ],
    },
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

### Navbar style

You can set the static Navbar style without disabling the theme switching ability. The selected style will always apply no matter which theme user have selected.

Currently, there are two possible style options: `dark` and `primary` (based on the `--ifm-color-primary` color). You can see the styles preview in the [Infima documentation](https://facebookincubator.github.io/infima/docs/components/navbar/).

```js {5} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    navbar: {
      style: 'primary',
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
