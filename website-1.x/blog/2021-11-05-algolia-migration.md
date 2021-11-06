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

Docusaurus v1 sites should upgrade too or search will stop working.

<!--truncate-->

From now on, it is required to use an `appId` in your Docusaurus v1 site configuration:

```js
const siteConfig = {
  algolia: {
    appId: '...', // Now required!
    apiKey: '...',
  },
};

module.exports = siteConfig;
```

You should have received an `appId` + `apiKey` by email with an invitation to join the Algolia SaaS application.

If you didn't receive any email, please reach out to the Algolia DocSearch support team and they'll invite you.

Further information will be provided on the Docusaurus v2 blog.
