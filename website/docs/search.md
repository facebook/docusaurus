---
id: search
title: Search
keywords:
  - docusaurus
  - search
---

Docusaurus's own `@docusaurus/preset-classic` supports easy search integration.
There are two main choices, you can use [Algolia DocSearch](https://community.algolia.com/docsearch/) or bring in your own SearchBar component.

## Algolia DocSearch

DocSearch works by crawling the content of your website every 24 hours and putting all the content in an Algolia index. This content is then queried directly from your front-end using the Algolia API. Note that your website needs to be publicly available for this to work (ie. not behind a firewall). This service is free.

### Enabling the Search Bar

To add search bar with Algolia, just add algolia field in your themeConfig. Note that you will need algolia API key and algolia index. You can [apply for DocSearch here](https://community.algolia.com/docsearch/).

```jsx
// docusaurus.config.js
themeConfig: {
    // ....
    algolia: {
      apiKey: 'api-key',
      indexName: 'index-namw',
      algoliaOptions: {}, // Optional, if provided by Algolia
    },
  },
  ```

### Customizing the Algolia Search Bar

If you wanted to use/customize the algolia search bar React component. Simply swizzle it

```bash
yarn swizzle @docusaurus/theme-search-algolia SearchBar
```

## Custom SearchBar Component

In order to bring your own search bar component, you need to provide a SearchBar as theme component. The easiest way to do that is

```bash
yarn swizzle @docusaurus/theme-classic SearchBar
```

It will create a `src/themes/SearchBar` file in your project folder. Try to edit that file, save it and you can see that we're customizing the SearchBar.