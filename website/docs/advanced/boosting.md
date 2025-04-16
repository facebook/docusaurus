# Boosting pages in Algolia Docsearch

Algolia DocSearch is a popular choice for Docusaurus sites. Algolia provides methods for boosting the ranking of pages in the search, and this guide covers a method using metadata added to pages and edits to the default Algolia crawler configuration.

## Steps

1. Configure Docusaurus to use Algolia DocSearch. To get started with DocSearch see [Search](../search.mdx).
2. Add metadata to pages that you would like to boost.
3. Configure your Algolia index to adjust page ranking based on the added metadata.
4. Configure the Algolia Crawler to use the added metadata.

## Add metadata

Here is an example of the desired metadata in a page to be boosted by 100 in the page ranking:

```html
<meta data-rh="true" name="pageBoost" content="100">
```

Adding metadata, other than `description` and `keywords`, is done by adding HTML within your Markdown/MDX files.

This is the edit to a Markdown/MDX file:

```md
---
title: Page name
---

<!-- highlight-start -->
<head>
  <meta name="pageBoost" content="100"/>
</head>
<!-- highlight-end -->

## Overview
```
## Configure the Algolia index

## Configure the Algolia Crawler

## Testing

## More information

[Adding metadata](../guides/markdown-features/markdown-features-head-metadata.mdx)

Configuring [Search](../search.mdx)
