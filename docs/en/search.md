---
id: search
title: Documentation Search
layout: docs
category: Docusaurus
permalink: docs/en/search.html
previous: translation
---

## Algolia Search Integration

Docusaurus supports search using [Algolia DocSearch](https://community.algolia.com/docsearch/). Once you have set up your site, you can use the link above to have Algolia crawl your website's documentation pages. Algolia will then send you an API key and index name for your site.

Enter your search-only API key and index name into `siteConfig.js` in the `algolia` section to enable search for your site. The search bar will be in the header navigation bar in between internal links and external links. To disable the search bar, delete the `algolia` section in the `siteConfig.js` file.

```js
const siteConfig = {
  ...
  algolia: {
    apiKey: "my-search-only-api-key-1234",
    indexName: "my-index-name"
  },
  ...
}
```

