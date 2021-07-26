---
id: theme-configuration
title: 'Theme configuration'
slug: '/api/themes/configuration'
---

This configuration applies to all [main themes](./overview.md).

## Common {#common}

### Color mode {#color-mode---dark-mode}

The classic theme provides by default light and dark mode support, with a navbar switch for the user.

It is possible to customize the color mode support within the `colorMode` object.

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `defaultMode` | <code>'light' &#124; 'dark' </code> | The color mode when user first visits the site. | `'light'` |
| `disableSwitch` | `boolean` | Hides the switch in the navbar. Useful if you want to support a single color mode. | `false` |
| `respectPrefersColorScheme` | `boolean` | Whether to use the `prefers-color-scheme` media-query, using user system preferences, instead of the hardcoded `defaultMode`. | `false` |
| `switchConfig` | _See below_ | Dark/light switch icon options. | _See below_ |
| `switchConfig.darkIcon` | `string` | Icon for the switch while in dark mode. | `'🌜'` |
| `switchConfig.darkIconStyle` | JSX style object (see [documentation](https://reactjs.org/docs/dom-elements.html#style)) | CSS to apply to dark icon. | `{}` |
| `switchConfig.lightIcon` | `string` | Icon for the switch while in light mode. | `'🌞'` |
| `switchConfig.lightIconStyle` | JSX style object | CSS to apply to light icon. | `{}` |

</small>

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    // highlight-start
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
      switchConfig: {
        darkIcon: '🌙',
        darkIconStyle: {
          marginLeft: '2px',
        },
        // Unicode icons such as '\u2600' will work
        // Unicode with 5 chars require brackets: '\u{1F602}'
        lightIcon: '\u{1F602}',
        lightIconStyle: {
          marginLeft: '1px',
        },
      },
    },
    // highlight-end
  },
};
```

:::caution

With `respectPrefersColorScheme: true`, the `defaultMode` is overridden by user system preferences.

If you only want to support one color mode, you likely want to ignore user system preferences.

:::

### Meta image {#meta-image}

You can configure a default image that will be used for your meta tag, in particular `og:image` and `twitter:image`.

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `image` | `string` | The meta image URL for the site. Relative to your site's "static" directory. Cannot be SVGs. Can be external URLs too. | `undefined` |

</small>

Example configuration:

```js {4-6} title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    // highlight-next-line
    image: 'img/docusaurus.png',
  },
};
```

### Metadatas {#metadatas}

You can configure additional html metadatas (and override existing ones).

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `metadatas` | `Metadata[]` | Any field will be directly passed to the `<meta />` tag. Possible fields include `id`, `name`, `property`, `content`, `itemprop`, etc. | `[]` |

</small>

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    // highlight-next-line
    metadatas: [{name: 'twitter:card', content: 'summary'}],
  },
};
```

### Announcement bar {#announcement-bar}

Sometimes you want to announce something in your website. Just for such a case, you can add an announcement bar. This is a non-fixed and optionally dismissable panel above the navbar. All configuration are in the `announcementBar` object.

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `id` | `string` | Any value that will identify this message. | `'announcement-bar'` |
| `content` | `string` | The text content of the announcement. HTML will be interpolated. | `''` |
| `backgroundColor` | `string` | Background color of the entire bar. | `'#fff'` |
| `textColor` | `string` | Announcement text color. | `'#000'` |
| `isCloseable` | `boolean` | Whether this announcement can be dismissed with a '×' button. | `true` |

</small>

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    // highlight-start
    announcementBar: {
      id: 'support_us',
      content:
        'We are looking to revamp our docs, please fill <a target="_blank" rel="noopener noreferrer" href="#">this survey</a>',
      backgroundColor: '#fafbfc',
      textColor: '#091E42',
      isCloseable: false,
    },
    // highlight-end
  },
};
```

## Navbar {#navbar}

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `title` | `string` | Title for the navbar. | `undefined` |
| `logo` | _See below_ | Customization of the logo object. | `undefined` |
| `items` | `NavbarItem[]` | A list of navbar items. See specification below. | `[]` |
| `hideOnScroll` | `boolean` | Whether the navbar is hidden when the user scrolls down. | `false` |
| `style` | <code>'primary' &#124; 'dark' </code> | Sets the navbar style, ignoring the dark/light theme. | Same as theme |

</small>

### Navbar logo {#navbar-logo}

The logo can be placed in [static folder](static-assets.md). Logo URL is set to base URL of your site by default. Although you can specify your own URL for the logo, if it is an external link, it will open in a new tab. In addition, you can override a value for the target attribute of logo link, it can come in handy if you are hosting docs website in a subdirectory of your main website, and in which case you probably do not need a link in the logo to the main website will open in a new tab.

To improve dark mode support, you can also set a different logo for this mode.

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `alt` | `string` | Alt tag for the logo image. | `undefined` |
| `src` | `string` | URL to the logo image. Base URL is appended by default. | **Required** |
| `srcDark` | `string` | An alternative image URL to use in dark mode. | `logo.src` |
| `href` | `string` | Link to navigate to when the logo is clicked. | `siteConfig.baseUrl` |
| `target` | `string` | The `target` attribute of the link; controls whether the link is opened in a new tab, the current one, or otherwise. | Calculated based on `href` (external links will open in a new tab, all others in the current one). |

</small>

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      title: 'Site Title',
      // highlight-start
      logo: {
        alt: 'Site Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo_dark.svg',
        href: 'https://docusaurus.io/',
        target: '_self',
      },
      // highlight-end
    },
  },
};
```

### Navbar items {#navbar-items}

You can add items to the navbar via `themeConfig.navbar.items`.

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      // highlight-start
      items: [
        {
          type: 'doc',
          position: 'left',
          docId: 'introduction',
          label: 'Docs',
        },
        {to: 'blog', label: 'Blog', position: 'left'},
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/facebook/docusaurus',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
      // highlight-end
    },
  },
};
```

The items can have different behaviors based on the `type` field. The sections below will introduce you to all the types of navbar items available.

### Navbar link {#navbar-link}

By default, Navbar items are regular links (internal or external).

React Router should automatically apply active link styling to links, but you can use `activeBasePath` in edge cases. For cases in which a link should be active on several different paths (such as when you have multiple doc folders under the same sidebar), you can use `activeBaseRegex`. `activeBaseRegex` is a more flexible alternative to `activeBasePath` and takes precedence over it -- Docusaurus parses it into a regular expression that is tested against the current URL.

Outbound (external) links automatically get `target="_blank" rel="noopener noreferrer"` attributes.

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `label` | `string` | The name to be shown for this item. | **Required** |
| `to` | `string` | Client-side routing, used for navigating within the website. The baseUrl will be automatically prepended to this value. | **Required** |
| `href` | `string` | A full-page navigation, used for navigating outside of the website. **Only one of `to` or `href` should be used.** | **Required** |
| `prependBaseUrlToHref` | `boolean` | Prepends the baseUrl to `href` values. | `false` |
| `position` | <code>'left' &#124; 'right'</code> | The side of the navbar this item should appear on. | `'left'` |
| `activeBasePath` | `string` | To apply the active class styling on all routes starting with this path. This usually isn't necessary. | `to` / `href` |
| `activeBaseRegex` | `string` | Alternative to `activeBasePath` if required. | `undefined` |
| `className` | `string` | Custom CSS class (for styling any item). | `''` |

</small>

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          to: 'docs/introduction',
          // Only one of "to" or "href" should be used
          // href: 'https://www.facebook.com',
          label: 'Introduction',
          position: 'left',
          activeBaseRegex: 'docs/(next|v8)',
        },
        // highlight-end
      ],
    },
  },
};
```

### Navbar dropdown {#navbar-dropdown}

Navbar items of the type `dropdown` has the additional `items` field, an inner array of navbar items.

Navbar dropdown items only accept the following **"link-like" item types**:

- [Navbar link](#navbar-link)
- [Navbar doc link](#navbar-doc-link)
- [Navbar doc version](#navbar-doc-version)

Note that the dropdown base item is a clickable link as well, so this item can receive any of the props of a [plain navbar link](#navbar-link).

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `label` | `string` | The name to be shown for this item. | **Required** |
| `items` | <code>[LinkLikeItem](#navbar-dropdown)[]</code> | The items to be contained in the dropdown. | **Required** |
| `position` | <code>'left' &#124; 'right'</code> | The side of the navbar this item should appear on. | `'left'` |

</small>

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'dropdown',
          label: 'Community',
          position: 'left',
          items: [
            {
              label: 'Facebook',
              href: 'https://www.facebook.com',
            },
            {
              type: 'doc',
              label: 'Social',
              docId: 'social',
            },
            // ... more items
          ],
        },
        // highlight-end
      ],
    },
  },
};
```

### Navbar doc link {#navbar-doc-link}

If you want to link to a specific doc, this special navbar item type will render the link to the doc of the provided `docId`. It will get the class `navbar__link--active` as long as you browse a doc of the same sidebar.

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `docId` | `string` | The ID of the doc that this item links to. | **Required** |
| `label` | `string` | The name to be shown for this item. | `docId` |
| `position` | <code>'left' &#124; 'right'</code> | The side of the navbar this item should appear on. | `'left'` |
| `activeSidebarClassName` | `string` | The CSS class name to apply when this doc's sidebar is active. | `'navbar__link--active'` |
| `docsPluginId` | `string` | The ID of the docs plugin that the doc belongs to. | `'default'` |

</small>

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'doc',
          position: 'left',
          docId: 'introduction',
          label: 'Docs',
        },
        // highlight-end
      ],
    },
  },
};
```

### Navbar docs version dropdown {#navbar-docs-version-dropdown}

If you use docs with versioning, this special navbar item type that will render a dropdown with all your site's available versions.

The user will be able to switch from one version to another, while staying on the same doc (as long as the doc id is constant across versions).

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `position` | <code>'left' &#124; 'right'</code> | The side of the navbar this item should appear on. | `'left'` |
| `dropdownItemsBefore` | <code>[LinkLikeItem](#navbar-dropdown)[]</code> | Add additional dropdown items at the beginning of the dropdown. | `[]` |
| `dropdownItemsAfter` | <code>[LinkLikeItem](#navbar-dropdown)[]</code> | Add additional dropdown items at the end of the dropdown. | `[]` |
| `docsPluginId` | `string` | The ID of the docs plugin that the doc versioning belongs to. | `'default'` |
| `dropdownActiveClassDisabled` | `boolean` | Do not add the link active class when browsing docs. | `false` |

</small>

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'docsVersionDropdown',
          position: 'left',
          dropdownItemsAfter: [{to: '/versions', label: 'All versions'}],
          dropdownActiveClassDisabled: true,
        },
        // highlight-end
      ],
    },
  },
};
```

### Navbar docs version {#navbar-docs-version}

If you use docs with versioning, this special navbar item type will link to the active/browsed version of your doc (depends on the current URL), and fallback to the latest version.

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `label` | `string` | The name to be shown for this item. | The active/latest version label. |
| `to` | `string` | The internal link that this item points to. | The active/latest version. |
| `position` | <code>'left' &#124; 'right'</code> | The side of the navbar this item should appear on. | `'left'` |
| `docsPluginId` | `string` | The ID of the docs plugin that the doc versioning belongs to. | `'default'` |

</small>

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'docsVersion',
          position: 'left',
          to: '/path',
          label: 'label',
        },
        // highlight-end
      ],
    },
  },
};
```

### Navbar locale dropdown {#navbar-locale-dropdown}

If you use the [i18n feature](../../i18n/i18n-introduction.md), this special navbar item type will render a dropdown with all your site's available locales.

The user will be able to switch from one locale to another, while staying on the same page.

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `position` | <code>'left' &#124; 'right'</code> | The side of the navbar this item should appear on. | `'left'` |
| `dropdownItemsBefore` | <code>[LinkLikeItem](#navbar-dropdown)[]</code> | Add additional dropdown items at the beginning of the dropdown. | `[]` |
| `dropdownItemsAfter` | <code>[LinkLikeItem](#navbar-dropdown)[]</code> | Add additional dropdown items at the end of the dropdown. | `[]` |

</small>

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'localeDropdown',
          position: 'left',
          dropdownItemsAfter: [
            {
              to: 'https://my-site.com/help-us-translate',
              label: 'Help us translate',
            },
          ],
        },
        // highlight-end
      ],
    },
  },
};
```

### Navbar search {#navbar-search}

If you use the [search](../../search.md), the search bar will be the rightmost element in the navbar.

However, with this special navbar item type, you can change the default location.

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `position` | <code>'left' &#124; 'right'</code> | The side of the navbar this item should appear on. | `'left'` |

</small>

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'search',
          position: 'right',
        },
        // highlight-end
      ],
    },
  },
};
```

### Auto-hide sticky navbar {#auto-hide-sticky-navbar}

You can enable this cool UI feature that automatically hides the navbar when a user starts scrolling down the page, and show it again when the user scrolls up.

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      // highlight-next-line
      hideOnScroll: true,
    },
  },
};
```

### Navbar style {#navbar-style}

You can set the static Navbar style without disabling the theme switching ability. The selected style will always apply no matter which theme user have selected.

Currently, there are two possible style options: `dark` and `primary` (based on the `--ifm-color-primary` color). You can see the styles preview in the [Infima documentation](https://infima.dev/docs/components/navbar/).

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      // highlight-next-line
      style: 'primary',
    },
  },
};
```

## CodeBlock {#codeblock}

Docusaurus uses [Prism React Renderer](https://github.com/FormidableLabs/prism-react-renderer) to highlight code blocks. All configuration are in the `prism` object.

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `theme` | `PrismTheme` | The Prism theme to use for light-theme code blocks. | `palenight` |
| `darkTheme` | `PrismTheme` | The Prism theme to use for dark-theme code blocks. | `palenight` |
| `defaultLanguage` | `string` | The side of the navbar this item should appear on. | `undefined` |

</small>

### Theme {#theme}

By default, we use [Palenight](https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/themes/palenight.js) as syntax highlighting theme. You can specify a custom theme from the [list of available themes](https://github.com/FormidableLabs/prism-react-renderer/tree/master/src/themes). You may also use a different syntax highlighting theme when the site is in dark mode.

Example configuration:

```js {5-6} title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    prism: {
      // highlight-start
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
      // highlight-end
    },
  },
};
```

:::note

If you use the line highlighting Markdown syntax, you might need to specify a different highlight background color for the dark mode syntax highlighting theme. Refer to the [docs for guidance](../../guides/markdown-features/markdown-features-code-blocks.mdx#line-highlighting).

:::

### Default language {#default-language}

You can set a default language for code blocks if no language is added after the opening triple backticks (i.e. ```). Note that a valid [language name](https://prismjs.com/#supported-languages) must be passed.

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    prism: {
      // highlight-next-line
      defaultLanguage: 'javascript',
    },
  },
};
```

## Footer {#footer-1}

You can add logo and a copyright to the footer via `themeConfig.footer`. Logo can be placed in [static folder](static-assets.md). Logo URL works in the same way of the navbar logo.

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `logo` | `Logo` | Customization of the logo object. See [Navbar logo](/docs/api/configuration#navbar-logo) for details. | `undefined` |
| `copyright` | `string` | The copyright message to be displayed at the bottom. | `undefined` |
| `style` | <code>'dark' &#124; 'light'</code> | The color theme of the footer component. | `'light'` |
| `items` | `FooterItem[]` | The link groups to be present. | `[]` |

</small>

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    // highlight-start
    footer: {
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'img/oss_logo.png',
        href: 'https://opensource.facebook.com',
      },
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    // highlight-end
  },
};
```

### Footer Links {#footer-links}

You can add links to the footer via `themeConfig.footer.links`.

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `title` | `string` | Label of the section of these links. | `undefined` |
| `items` | `FooterLink[]` | Links in this section. | `[]` |

</small>

Accepted fields of each item in `items`:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `label` | `string` | Text to be displayed for this link. | **Required** |
| `to` | `string` | Client-side routing, used for navigating within the website. The baseUrl will be automatically prepended to this value. | **Required** |
| `href` | `string` | A full-page navigation, used for navigating outside of the website. **Only one of `to` or `href` should be used.** | **Required** |
| `html` | `string` | Renders the html pass-through instead of a simple link. In case `html` is used, no other options should be provided. | `undefined` |

</small>

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  footer: {
    // highlight-start
    links: [
      {
        title: 'Docs',
        items: [
          {
            label: 'Style Guide',
            to: 'docs/',
          },
          {
            label: 'Second Doc',
            to: 'docs/doc2/',
          },
        ],
      },
      {
        title: 'Community',
        items: [
          {
            label: 'Stack Overflow',
            href: 'https://stackoverflow.com/questions/tagged/docusaurus',
          },
          {
            label: 'Discord',
            href: 'https://discordapp.com/invite/docusaurus',
          },
          {
            label: 'Twitter',
            href: 'https://twitter.com/docusaurus',
          },
          {
            html: `
                <a href="https://www.netlify.com" target="_blank" rel="noreferrer noopener" aria-label="Deploys by Netlify">
                  <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" />
                </a>
              `,
          },
        ],
      },
    ],
    // highlight-end
  },
};
```

## Hooks {#hooks}

### `useThemeContext` {#usethemecontext}

React hook to access theme context. This context contains functions for setting light and dark mode and exposes boolean variable, indicating which mode is currently in use.

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

## i18n {#i18n}

Read the [i18n introduction](../../i18n/i18n-introduction.md) first.

### Translation files location {#translation-files-location}

- **Base path**: `website/i18n/<locale>/docusaurus-theme-<themeName>`
- **Multi-instance path**: N/A
- **JSON files**: extracted with [`docusaurus write-translations`](../../cli.md#docusaurus-write-translations-sitedir)
- **Markdown files**: N/A

### Example file-system structure {#example-file-system-structure}

```bash
website/i18n/<locale>/docusaurus-theme-classic
│
│ # translations for the theme
├── navbar.json
└── footer.json
```
