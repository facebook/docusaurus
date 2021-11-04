---
id: seo
title: Search engine optimization (SEO)
sidebar_label: SEO
keywords:
  - seo
  - positioning
---

Docusaurus supports search engine optimization in a variety of ways.

## Global metadata {#global-metadata}

Provide global meta attributes for the entire site through the [site configuration](./configuration.md#site-metadata). The metadatas will all be rendered in the HTML `<head>` using the key-value pairs as the prop name and value.

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    metadatas: [{name: 'keywords', content: 'cooking, blog'}],
    // This would become <meta name="keywords" content="cooking, blog"> in the generated HTML
  },
};
```

To read more about types of meta tags, visit [the MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta).

## Single page metadata {#single-page-metadata}

Similar to [global metadata](#global-metadata), Docusaurus also allows for the addition of meta-information to individual pages. Follow [this guide](./guides/markdown-features/markdown-features-head-metadatas.mdx) for configuring the `<head>` tag.

## Static HTML generation {#static-html-generation}

Docusaurus is a static site generator—HTML files are statically generated for every URL route, which helps search engines discover your content easier.

## Image meta description {#image-meta-description}

Docusaurus supports alt tags for your images, see [this section](./guides/markdown-features/markdown-features-assets.mdx#images) for more details.

## Rich search information {#rich-search-information}

Docusaurus blogs support [rich search results](https://search.google.com/test/rich-results) out-of-the-box to get maximum search engine experience. The information is created depending on your meta information in blog/global configuration. In order to get the benefits of the rich search information, fill in the information about the post's publish date, authors, and image, etc. Read more about the meta-information [here](./blog.mdx).

## Robots file {#robots-file}

To add a `robots.txt` file that regulates search engines' behavior about which should be displayed and which shouldn't, provide it as [static asset](./static-assets.md). The following would allow access to all sub-pages from all requests:

```text title="static/robots.txt"
User-agent: *
Disallow:
```

Read more about the robots file in [the Google documentation](https://developers.google.com/search/docs/advanced/robots/intro).

:::caution

**Important**: the `robots.txt` file does **not** prevent HTML pages from being indexed. Use `<meta name="robots" content="noindex">` as [page metadata](#single-page-metadata) to prevent it from appearing in search results entirely.

:::

## Sitemap file {#sitemap-file}

Docusaurus provides the [`@docusaurus/plugin-sitemap`](./api/plugins/plugin-sitemap.md) plugin, which is shipped with `preset-classic` by default. It autogenerates a `sitemap.xml` file which will be available at `https://example.com/<baseUrl>/sitemap.xml` after the production build. This sitemap metadata helps search engine crawlers crawl your site more accurately.

## Human readable links {#human-readable-links}

Docusaurus uses your file names as links, but you can always change that using slugs, see this [tutorial](./guides/docs/docs-introduction.md#document-id) for more details.

## Structured content {#structured-content}

Search engines rely on the HTML markup such as `<h2>`, `<table>`, etc., to understand the structure of your webpage. When Docusaurus renders your pages, semantic markup, e.g. `<aside>`, `<nav>`, `<main>`, are used to divide the different sections of the page, helping the search engine to locate parts like sidebar, navbar, and the main page content.

Most [CommonMark](https://spec.commonmark.org/0.30/#atx-headings) syntax have their corresponding HTML tags. By using Markdown consistently in your project, you will make it easier for search engines to understand your page content.
