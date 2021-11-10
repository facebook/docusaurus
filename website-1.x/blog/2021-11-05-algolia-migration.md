---
title: Algolia DocSearch Migration
author: Sébastien Lorber
authorTitle: Docusaurus maintainer
authorURL: https://sebastienlorber.com
authorImageURL: https://github.com/slorber.png
authorTwitter: sebastienlorber
tags: [algolia]
image: /img/blog/2021-05-12-announcing-docusaurus-two-beta/social-card.png
---

Algolia DocSearch is migrating to a new system.

Docusaurus v1 sites should upgrade their configuration.

<!--truncate-->

Algolia will stop crawling and updating your existing index soon, potentially leading to stale search results.

From now on, it will be required to use an `appId` in your Docusaurus v1 site configuration:

```js
const siteConfig = {
  algolia: {
    appId: '...', // Now required!
    apiKey: '...',
  },
};

module.exports = siteConfig;
```

The migration will roll out in batches, and you should receive a new `appId` and `apiKey` by email soon, with an invitation to join the Algolia SaaS application.

More information can be found in on the [DocSearch migration page](https://docsearch.algolia.com/docs/migrating-from-legacy) and we will publish a [Docusaurus v2 blog post](https://v2.docusaurus.io/blog).
