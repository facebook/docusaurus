---
slug: /
tags: [a, b, c, some tag]
---

# Docs tests

This Docusaurus docs plugin instance is meant to test fancy edge-cases that regular unit tests don't really cover.

## Testing sidebar class names

The sidebar class name is a seemingly simple yet very ad-hoc feature, so it's necessary to test all possible use-cases.

### Link class names

- [Through `sidebars.js` hardcoded `doc` item](index.md)
- [Through `sidebars.js` category link `generated-index` config](/tests/docs/category/tests)
- [Through `sidebars.js` category link `doc` config](./toc/toc-test.md)
- [Through `_category_.json` category link `generated-index` config](/tests/docs/category-links-generated-index-slug)
  <!-- TODO The link below would replace the link text instead of the link URL. This shouldn't happen. This also causes the actual link URL to fail to be replaced. Should be solved when migrating to Remark plugin -->
  <!-- [./tests/category-links/explicit-doc-index/sample-doc.md](./tests/category-links/explicit-doc-index/sample-doc.md) -->
- [Through `_category_.json` category link `doc` config](./tests/category-links/explicit-doc-index/sample-doc.md)
- [Through doc front matter `sidebar_class_name` of a hardcoded `doc` item](./tests/category-links/with-category-name-doc/sample-doc.md)
- [Through doc front matter `sidebar_class_name` of an autogen normal doc](./tests/category-links/with-category-name-doc/sample-doc.md)
- [Through doc front matter `sidebar_class_name` of an autogen category index doc](./tests/category-links/with-index-doc/index.md)

### Category class names

You can't actually see these because of how the `red` CSS selector is defined (I don't want to make another dogfooding class name just for this purpose). Open dev tools to check them.

- Through `sidebars.js` hardcoded `category` item: "Huge sidebar category"
- Through `_category_.json` category `className` config: "Tests > Category Links"
