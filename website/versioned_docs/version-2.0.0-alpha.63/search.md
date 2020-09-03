---
id: search
title: Search
keywords:
  - algolia
  - search
---

Docusaurus' own `@docusaurus/preset-classic` supports a search integration.

There are two main options, you can use [Algolia DocSearch](https://docsearch.algolia.com) or bring in your own `SearchBar` component.

## Using Algolia DocSearch

Algolia DocSearch works by crawling the content of your website every 24 hours and putting all the content in an Algolia index. This content is then queried directly from your front-end using the Algolia API. Note that your website needs to be publicly available for this to work (i.e., not behind a firewall). The service is free.

### Connecting Algolia

To connect your docs with Algolia, add an `algolia` field in your `themeConfig`. **[Apply for DocSearch](https://docsearch.algolia.com/apply/)** to get your Algolia index and API key.

```jsx title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    // ...
    // highlight-start
    algolia: {
      apiKey: 'YOUR_API_KEY',
      indexName: 'YOUR_INDEX_NAME',
      searchParameters: {}, // Optional (if provided by Algolia)
    },
    // highlight-end
  },
};
```

:::info

The `searchParameters` option used to be named `algoliaOptions` in Docusaurus v1.

:::

### Styling your Algolia search

By default, DocSearch comes with a fine-tuned theme that was designed for accessibility, making sure that colors and contrasts respect standards.

Still, you can reuse the [Infima CSS variables](styling-layout#styling-your-site-with-infima) from Docusaurus to style DocSearch by editing the `/src/css/custom.css` file.

```css title="/src/css/custom.css"
html[data-theme='light'] .DocSearch {
  /* --docsearch-primary-color: var(--ifm-color-primary); */
  /* --docsearch-text-color: var(--ifm-font-color-base); */
  --docsearch-muted-color: var(--ifm-color-secondary-darkest);
  --docsearch-container-background: rgba(94, 100, 112, 0.7);
  /* Modal */
  --docsearch-modal-background: var(--ifm-color-secondary-lighter);
  /* Search box */
  --docsearch-searchbox-background: var(--ifm-color-secondary);
  --docsearch-searchbox-focus-background: var(--ifm-color-white);
  /* Hit */
  --docsearch-hit-color: var(--ifm-font-color-base);
  --docsearch-hit-active-color: var(--ifm-color-white);
  --docsearch-hit-background: var(--ifm-color-white);
  /* Footer */
  --docsearch-footer-background: var(--ifm-color-white);
}

html[data-theme='dark'] .DocSearch {
  --docsearch-text-color: var(--ifm-font-color-base);
  --docsearch-muted-color: var(--ifm-color-secondary-darkest);
  --docsearch-container-background: rgba(47, 55, 69, 0.7);
  /* Modal */
  --docsearch-modal-background: var(--ifm-background-color);
  /* Search box */
  --docsearch-searchbox-background: var(--ifm-background-color);
  --docsearch-searchbox-focus-background: var(--ifm-color-black);
  /* Hit */
  --docsearch-hit-color: var(--ifm-font-color-base);
  --docsearch-hit-active-color: var(--ifm-color-white);
  --docsearch-hit-background: var(--ifm-color-emphasis-100);
  /* Footer */
  --docsearch-footer-background: var(--ifm-background-surface-color);
  --docsearch-key-gradient: linear-gradient(
    -26.5deg,
    var(--ifm-color-emphasis-200) 0%,
    var(--ifm-color-emphasis-100) 100%
  );
}
```

### Customizing the Algolia search behavior

<!-- TODO: update options link once the documentation is available on the DocSearch website -->

Algolia DocSearch supports a [list of options](https://autocomplete-experimental.netlify.app/docs/DocSearchModal#reference) that you can pass to the `algolia` field in the `docusaurus.config.js` file.

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    // ...
    algolia: {
      apiKey: 'YOUR_API_KEY',
      indexName: 'YOUR_INDEX_NAME',
      // Options...
    },
  },
};
```

### Editing the Algolia search component

If you prefer to edit the Algolia search React component, swizzle the `SearchBar` component in `@docusaurus/theme-search-algolia`:

```bash npm2yarn
npm run swizzle @docusaurus/theme-search-algolia SearchBar
```

## Using your own search

To use your own search, swizzle the `SearchBar` component in `@docusaurus/theme-classic`

```bash npm2yarn
npm run swizzle @docusaurus/theme-classic SearchBar
```

This will create a `src/themes/SearchBar` file in your project folder. Restart your dev server and edit the component, you will see that Docusaurus uses your own `SearchBar` component now.

**Notes**: You can alternatively [swizzle from Algolia SearchBar](#editing-the-algolia-search-component) and create your own search component from there.
