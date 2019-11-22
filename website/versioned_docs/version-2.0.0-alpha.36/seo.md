---
id: seo
title: SEO
keywords:
  - docusaurus
  - seo
---

Docusaurus takes care of both site level SEO and page specific SEO based on the content of your site.

Site SEO helps users reach your site. Page specific SEO helps your users find answers to their questions quickly.

## Site level SEO

Docusaurus' classic theme generates the essential meta tags for SEO using the site meta information you provide in `docusaurus.config.js`. For site level SEO to work correctly, make sure that you provide the following fields correctly:

```js
// docusaurus.config.js
module.exports = {
  /**
   * the following two fields are used for title as well as image alt
   * - `${title} · ${tagline}`
   * - `Image for ${title} · ${tagline}`
   */
  title: 'Docusaurus',
  tagline: 'Easy to Maintain Open Source Documentation Websites',
  /**
   * The following fields are used for `og:image` and `twitter:image`
   */
  baseUrl: '/',
  siteUrl: 'https://docusaurus.io',
  themeConfig: {
    /**
     * relative to your site's "static" directory
     * cannot be svg
     */
    image: 'img/docusaurus.png',
  },
};
```

## Document Page specific SEO

To add SEO to your doc, use the following fields in your doc's front matter:

```yaml
---
keywords:
  - docs
  - docusaurus
description: How do I find you when I cannot solve this problem
image: https://i.imgur.com/mErPwqL.png
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

## Customize SEO

To add customized SEO, use the `Head` component from `@docusaurus/Head`.

Example:

```js
import Head from '@docusaurus/Head';

const MySEO = () => (
  <>
    <Head>
      <meta property="og:description" content={'My custom description'} />
    </Head>
  </>
);
```
