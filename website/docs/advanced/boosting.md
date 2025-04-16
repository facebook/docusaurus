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

Each Algolia index has several configuration options. The section to configure for page boosting is **Index** → **Configuration** → **Relevance Essentials** → **Ranking and Sorting** → **Custom Ranking**

If **`weight.pageRank`** is not in the list of custom ranking attributes, add it with **Add custom ranking attribute**.  

## Configure the Algolia Crawler

The Algolia Crawler configuration is edited in your Algolia account. Access the crawler editor from the Algolia dashboard for your Algolia application at **Data sources** → **Crawler** by choosing the name of the crawler, and then **Editor**.

There are three edits to be made:

### Modify the `recordExtractor` function


:::tip
In the JavaScript snippets the `$` is the Cheerio instance, and allows you to manipulate the `DOM`. Links are in the **More information** section at the end of this doc.
:::

The `recordExtractor` needs access to the Cheerio instance to extract the metadata from the `DOM`.

Verify that the `recordExtractor` function includes the Cheerio instance as a parameter. Your record extractor function may have the `$`, if so you can skip this step. Your record extractor may also have other parameters listed, you should not remove parameters.

```js
recordExtractor: ({ $, helpers }) => {
```

### Extract the `pageBoost` metadata

Within the `recordExtractor` function add the highlighted line to extract the `pageBoost` metadata into `const pageBoost`, with a default value of 0 if no metadata is present in the page.

```js
recordExtractor: ({ $, helpers }) => {
  // highlight-start
  // Extract metadata
  const pageBoost = $("meta[name='pageBoost']").attr("content") || "0";
  // highlight-end
```

### Assign the `pageRank`

```js
foo
```

## Testing

![Algolia test URL records](/img/boost/boost_algolia_test_url_records.png)

![Algolia search UI page rank](/img/boost/boost_algolia_page_rank_search_ui.png)



## More information

[Adding metadata](../guides/markdown-features/markdown-features-head-metadata.mdx)

Configuring [Search](../search.mdx)

Algolia Crawler [record extractor](https://docsearch.algolia.com/docs/record-extractor)




