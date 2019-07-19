---
id: seo
title: SEO
keywods:
  - docusaurus
  - svg
description: Adding SEO to docs
image: 'https://i.imgur.com/mErPwqL.png'
---

SEO helps your users reach your site. Page-specific SEO helps your users to have a higher chance of finding answers to their questions quickly.

## Site SEO

Your site title and logo are by default used in each page of your docs.

## Page specific SEO

To add SEO to your doc, use the following fields in your doc's front matter:

```yaml
---
keywords:
  - docs
  - docusaurus
description: 'How do I find you when I cannot solve this problem'
image: 'https://i.imgur.com/mErPwqL.png'
---

```

### `keywords`

- Type: `string[]`

You may provide an array of keywords in a bullet list. Consider putting searchable terms that summarizes key information of the page to help your users find the correct page.

### `description`

- Type: `string`

If you provide a description to this page, we will use this description for SEO.

Consider putting key information about this page, error messages, searchable terms, etc., inside description to help your users land on your doc page.

### `image`

- Type: `string`

`image` is used by search engines and Twitter for a cover or thumbnail image when displaying the link to your post.

Note that the file of this image cannot be SVG.
