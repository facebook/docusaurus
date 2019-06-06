---
id: configuration
title: Configuration
---

<!-- Goal: To explain the intention and best practices for configurations -->

Docusaurus has a unique take on configurations. We encourage you to congregate information of your site into one place. We will guard the fields of this file, and facilitate making this data object accessible across your site.

Keeping a well-maintained `docusaurus.config.js` helps you, your collaborators, and your open source contributors be able to focus on docs while having certain fields easy to customize.

For reference to each of the configurable fields, you may refer to the API reference of [docusaurus.config.js](/docs/docusaurus.config.js).

## What goes into `docusaurus.config.js`?

You should not have to write your `docusaurus.config.js` from scratch even if you are developing your site. All templates come with a `docusaurus.config.js` at root that includes the necessary data for the initial site.

However, it can be helpful if you have a high-level understanding of how the configurations are designed and implemented.

The configurations can be categorized into:

- [Site meta](#site-meta)
- [Deployment configurations](#deployment-configurations)
- [Theme configurations, plugins, and presets](#theme-plugins-and-presets-configurations)
- [Custom configurations](#custom-configurations)

### Site meta

Site meta contains the essential meta information such as titles and `favicon`.

They are used by your site app in a number of places such as your site's title and headings, browser tab icon, and SEO.

- [title](docusaurus.config.js.md#title)
- [tagline](docusaurus.config.js.md#tagline)
- [favicon](docusaurus.config.js.md#favicon)

### Deployment configurations

Deployment configurations are used when you deploy your site with Docusaurus' deploy command. The related fields are:

<!-- TODO: if we use monospace for the field names, they no longer look like a link -->

<!-- TODO: currently these fields are only used in GH Pages, what about other deployment services such as Netlify -->

- [url](docusaurus.config.js.md#url)
- [baseUrl](docusaurus.config.js.md#baseurl)
- [organizationName](docusaurus.config.js.md#organizationname)
- [projectName](docusaurus.config.js.md#projectname)

You may also check the doc for [Deployment](deployment.md) for more information about the fields.

### Theme, plugins, and presets configurations

<!-- TODO: More explanation from these docs, respectively -->

- [themeConfig](docusaurus.config.js.md#themeconfig)
- [presets](docusaurus.config.js.md#presets)
- [plugins](docusaurus.config.js.md#plugins)

### Custom configurations

Docusaurus guards `docusaurus.config.js` from unknown fields. To add a custom field, define it on `customFields`

- [customFields](docusaurus.config.js.md#customfields)

Example:

```js
// docusaurus.config.js
module.exports = {
  customFields: {
    'image': '',
    'keywords': []
  }
};
```


## Accessing configuration from your site

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

## Customized configurations
