---
id: configuration
title: Configuration
---

Docusaurus has a unique take on configurations. We encourage you to congregate information of your site into one place. We will guard the fields of this file, and facilitate making this data object accessible across your site.

Keeping a well-maintained `docusaurus.config.js` helps you, your collaborators, and your open source contributors be able to focus on documentation while still being able to easily customize fields.

For reference to each of the configurable fields, you may refer to the API reference of [docusaurus.config.js](docusaurus.config.js.md).

## What goes into `docusaurus.config.js`?

You should not have to write your `docusaurus.config.js` from scratch even if you are developing your site. All templates come with a `docusaurus.config.js` at root that includes the necessary data for the initial site.

However, it can be helpful if you have a high-level understanding of how the configurations are designed and implemented.

The configurations can be categorized into:

- [Site Metadata](#site-metadata)
- [Deployment Configurations](#deployment-configurations)
- [Theme Configurations, Plugins, and Presets](#theme-plugins-and-presets-configurations)
- [Custom Configurations](#custom-configurations)

### Site metadata

Site metadata contains the essential global metadata such as titles and `favicon`.

They are used by your website in a number of places such as your site's title and headings, browser tab icon, social sharing (Facebook, Twitter) information and for search engine optimization (SEO).

### Deployment configurations

Deployment configurations are used when you deploy your site with Docusaurus' `deploy` command. The related fields are:

<!-- TODO: if we use monospace for the field names, they no longer look like a link -->

<!-- TODO: currently these fields are only used in GH Pages, what about other deployment services such as Netlify -->

You may also check the [deployment docs](deployment.md) for more information about the fields.

### Themes, Plugins, and Presets configurations

_This section is a work in progress. [Welcoming PRs](https://github.com/facebook/docusaurus/issues/1640)._

<!--

TODO:
- briefly introduce how to pass configurations to themes, plugins, and presets
- throw in links to them respectively
- make sure the logic flows nicely

[themes](using-themes.md)
[plugins](using-plugins.md)
[presets](presets.md)

-->

### Custom configurations

Docusaurus guards `docusaurus.config.js` from unknown fields. To add a custom field, define it on `customFields`

Example:

```js
// docusaurus.config.js
module.exports = {
  customFields: {
    image: '',
    keywords: [],
  },
};
```

## Accessing configuration from components

Your configuration object will be made available to all the components of your site. And you may access them via context as `siteConfig`:

```jsx
import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const Layout = props => {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const {title, tagline, seo} = siteConfig;

  return (
    <React.Fragment>
      <Head defaultTitle={`${defaultTitle} · ${tagline}`}>
        {description && <meta name="description" content={seo.description} />}
      </Head>
      <h1>{title}</h1>
      <h2>{tagline}</h2>
    </React.Fragment>
  );
};
```

> If you just want to use those fields on the client side, you could create your own JS files and import them as ES6 modules, there is no need to put them in `docusaurus.config.js`.
