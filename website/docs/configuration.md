---
id: configuration
title: Configuration
---

Docusaurus asks for only a few fields to configure your site.

## `docusaurus.config.js`

When you create your site using `docusaurus init`, the `docusaurus.config.js` file is initialized alongside the template.

### Configurable fields

`docusaurus.config.js` contains configurable fields for:

- Meta data of your site
  - `title: string`
  - `tagline: string`
  - `favicon: string` relative url to your site's logo
- Deployment fields for GitHub Pages, see [deployment configurations](/docs/deployment#docusaurusconfigjs-settings)
  <!-- TODO: explain that theme configurations will be consumed by the theme, and link to theme doc -->
- Theme configurations, see [theme configurations](#)
  <!-- TODO: explain that preset configurations will be used to define presets of the site, and link to doc -->
- Preset configurations, see [preset configurations](#)

```js
module.exports = {
  // Site meta
  title: 'Docusaurus',
  tagline: '⚡️ Painless static site generator',
  favicon: 'img/docusaurus.ico',

  // Deployment fields
  organizationName: 'facebook',
  projectName: 'docusaurus',
  baseUrl: '/',
  url: 'https://v2.docusaurus.io',

  themeConfig: {
    // theme specific configurations
  },
  presets: [
    // presets configurations
  ],
};
```

**Note**: `docusaurus.config.js` is not to be extended.

(Why?)

<!-- TODO: Explain why here -->

Docusaurus will guard the config file at build time. Including unknown fields will result in build time error:

```bash
Error: The field(s) 'unknownField' are not recognized in docusaurus.config.js
```

### Accessing configured data from your site

The exported data object from `docusaurus.config.js` is consumed at build time and will be accessible via context as `siteConfig` in any theme components.

```jsx
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const Layout = props => {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const {title, tagline} = siteConfig;
  return (
    <React.Fragment>
      <h1>{title}</h1>
      <h2>{tagline}</h2>
    </React.Fragment>
  );
};
```
