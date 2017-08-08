---
id: search
title: Enabling Search
---

Docusaurus supports search using [Algolia DocSearch](https://community.algolia.com/docsearch/). Once you have set up your site, [enter your site information](https://community.algolia.com/docsearch/) to have Algolia crawl your website's documentation pages. Algolia will then send you an API key and index name for your site.

### Enabling the Search Bar

Enter your search-only API key and index name into `siteConfig.js` in the `algolia` section to enable search for your site.

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

### Controlling the Location of the Search Bar

By default, the search bar will be the rightmost element in the top navigation bar.

If you want to change the default location, add the `searchBar` flag in the `headerLinks` field of `siteConfig.js` in your desired location. For example, you may want the search bar in between your internal and external links.

```js
const siteConfig = {
  ...
  headerLinks: [
    {...}
    {...}
    { search: true }
    {...}
    {...}
  ],
  ...
}
```

### Disabling the Search Bar

To disable the search bar, comment out (recommended) or delete the `algolia` section in the `siteConfig.js` file.

Also, if you have customized the location of the search bar in `headerLinks`, set `search: false`.
