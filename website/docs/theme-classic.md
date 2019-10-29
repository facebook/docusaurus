---
id: theme-classic
title: Classic Theme Configuration
---

_This section is a work in progress._

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