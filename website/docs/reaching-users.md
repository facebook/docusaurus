---
id: reaching-users
title: Reaching Users
keywords:
  - docusaurus
  - seo
  - analytics
---

## Search

_This section is a work in progress. [Welcoming PRs](https://github.com/facebook/docusaurus/issues/1640)._

<!--

References
---
- [Docusaurus v1 search](https://docusaurus.io/docs/en/search)
- [Algolia documentation](https://www.algolia.com/doc/)
-->

## Analytics

_This section is a work in progress. [Welcoming PRs](https://github.com/facebook/docusaurus/issues/1640)._

Docusaurus supports analytics tracking via [Global site tag](https://developers.google.com/gtagjs/). To enable gtag, specify your `trackingID` via `themeConfig` in `docusaurus.config.js`:

```js
// docusaurus.config.js
module.exports = {
  themeConfig: {
    gtag: {
      trackingID: 'UA-142857-1',
    },
  },
};
```
