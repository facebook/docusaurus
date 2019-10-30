---
id: configuration
title: Configuration
---

Docusaurus has a unique take on configurations. We encourage you to congregate information of your site into one place. We will guard the fields of this file, and facilitate making this data object accessible across your site.

Keeping a well-maintained `docusaurus.config.js` helps you, your collaborators, and your open source contributors be able to focus on documentation while still being able to easily customize fields.

## What goes into `docusaurus.config.js`?

You should not have to write your `docusaurus.config.js` from scratch even if you are developing your site. All templates come with a `docusaurus.config.js` at root that includes the necessary data for the initial site.

However, it can be helpful if you have a high-level understanding of how the configurations are designed and implemented.

The high-level overview of Docusaurus configuration can be categorized into:

- [Site Metadata](#site-metadata)
- [Deployment Configurations](#deployment-configurations)
- [Themes, Plugins, and Presets configurations](#themes-plugins-and-presets-configurations)
- [Custom Configurations](#custom-configurations)

For exact reference to each of the configurable fields, you may refer to [**docusaurus.config.js API reference**](docusaurus.config.js.md).

### Site metadata

Site metadata contains the essential global metadata such as `title`, `url`, `baseUrl` and `favicon`.

They are used in a number of places such as your site's title and headings, browser tab icon, social sharing (Facebook, Twitter) information or even to generate the correct path to serve your static files.

### Deployment configurations

Deployment configurations such as `projectName` and `organizationName` are used when you deploy your site with Docusaurus' `deploy` command.

It is recommended to check the [deployment docs](deployment.md) for more information.

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

```js {3-6}
// docusaurus.config.js
module.exports = {
  customFields: {
    image: '',
    keywords: [],
  },
};
```

## Accessing configuration from components

Your configuration object will be made available to all the components of your site. And you may access them via React context as `siteConfig`.

Basic Example:

```jsx {2,5-6}
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const Hello = () => {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const {title, tagline} = siteConfig;

  return <div>{`${title} · ${tagline}`}</div>;
};
```

> If you just want to use those fields on the client side, you could create your own JS files and import them as ES6 modules, there is no need to put them in `docusaurus.config.js`.
