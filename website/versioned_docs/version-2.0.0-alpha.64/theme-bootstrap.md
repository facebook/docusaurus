---
id: theme-bootstrap
title: '@docusaurus/theme-bootstrap'
---

:::caution

This section is a work in progress.

:::

## Hooks

### `useLogo`

React hook to access the logo asset.

Usage example:

```jsx
import React from 'react';
// highlight-next-line
import useLogo from '@theme/hooks/useLogo';

const Example = () => {
  // highlight-next-line
  const {logoLink, logoLinkProps, logoImageUrl, logoAlt} = useLogo();

  return (
    <Link to={logoLink} {...logoLinkProps}>
      {logoImageUrl != null && <img src={logoImageUrl} alt={logoAlt} />}
    </Link>
  );
};
```

## Navbar

### Navbar title & logo

You can add a logo and title to the navbar via `themeConfig.navbar`. Logo can be placed in [static folder](static-assets.md). Logo URL is set to base URL of your site by default. Although you can specify your own URL for the logo, if it is an external link, it will open in a new tab. In addition, you can override a value for the target attribute of logo link, it can come in handy if you are hosting docs website in a subdirectory of your main website, and in which case you probably do not need a link in the logo to the main website will open in a new tab.

```js {5-11} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    navbar: {
      title: 'Site Title',
      logo: {
        alt: 'Site Logo',
        src: 'img/logo.svg',
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

## Footer

You can add logo and a copyright to the footer via `themeConfig.footer`. Logo can be placed in [static folder](static-assets.md). Logo URL works in the same way of the navbar logo.

```js {5-15} title="docusaurus.config.js"
  // ...
  footer: {
    logo: {
      alt: 'Facebook Open Source Logo',
      src: 'img/oss_logo.png',
      href: 'https://opensource.facebook.com',
    },
    copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
  }
```

## Footer Links

You can add links to the navbar via `themeConfig.footer.links`:

```js {5-15} title="docusaurus.config.js"
module.exports = {
  // ...
  footer: {
    links: [
      {
        // Label of the section of these links
        title: 'Docs',
        items: [
          {
            // Label of the link
            label: 'Style Guide',
            // Client-side routing, used for navigating within the website.
            // The baseUrl will be automatically prepended to this value.
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
            // A full-page navigation, used for navigating outside of the website.
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
            //Renders the html pass-through instead of a simple link
            html: `
                <a href="https://www.netlify.com" target="_blank" rel="noreferrer noopener" aria-label="Deploys by Netlify">
                  <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" />
                </a>
              `,
          },
        ],
      },
    ],
  },
};
```
