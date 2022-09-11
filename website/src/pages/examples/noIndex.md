# No Index Page example

<head>
  <meta name="robots" content="nOiNdeX, NoFolLoW" />
</head>

This page will not be indexed by search engines because it contains the page following [page metadata](/docs/seo#single-page-metadata) markup:

```html
<head>
  <meta name="robots" content="noindex, nofollow" />
</head>
```

:::tip

The sitemap plugin filters pages containing a `noindex` content value. This page doesn't appear in Docusaurus [sitemap.xml](pathname:///sitemap.xml) file.

:::

:::note

Robots directives are [case-insensitive](https://developers.google.com/search/docs/advanced/robots/robots_meta_tag#directives).

:::
