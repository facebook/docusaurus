---
id: search
title: Search
keywords:
  - algolia
  - search
---

Docusaurus' own `@docusaurus/preset-classic` supports a search integration.

There are two main options, you can use [Algolia DocSearch](https://community.algolia.com/docsearch/) or bring in your own `SearchBar` component.

## Using Algolia DocSearch

Algolia DocSearch works by crawling the content of your website every 24 hours and putting all the content in an Algolia index. This content is then queried directly from your front-end using the Algolia API. Note that your website needs to be publicly available for this to work (i.e., not behind a firewall). The service is free.

### Connecting Algolia

To connect your docs with Algolia, add an `algolia` field in your `themeConfig`. Note that you will need algolia API key and algolia index. You can [apply for DocSearch here](https://community.algolia.com/docsearch/).

```jsx {3-8} title="docusaurus.config.js"
themeConfig: {
    // ...
    algolia: {
      appId: 'app-id',
      apiKey: 'api-key',
      indexName: 'index-name',
      algoliaOptions: {}, // Optional, if provided by Algolia
    },
  },
```

### Customizing the Algolia search bar

If you prefer to customize Algolia's search bar React component, swizzle the `SearchBar` component in `@docusaurus/theme-search-algolia`:

```bash npm2yarn
npm run swizzle @docusaurus/theme-search-algolia SearchBar
```

## Using your own search

To use your own search, swizzle the `SearchBar` component in `@docusaurus/theme-classic`

```bash npm2yarn
npm run swizzle @docusaurus/theme-classic SearchBar
```

This will create a `src/themes/SearchBar` file in your project folder. Restart your dev server and edit the component, you will see that Docusaurus uses your own `SearchBar` component now.

**Notes**: You can alternatively [swizzle from Algolia SearchBar](#customizing-the-algolia-search-bar) and create your own search component from there.
