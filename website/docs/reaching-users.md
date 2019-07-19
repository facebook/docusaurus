---
id: reaching-users
title: Reaching Users
keywords:
  - docusaurus
  - seo
  - analytics
---

## Search

_This section is a work in progress. [Welcoming PRs](https://github.com/facebook/docusaurus/issues/1640)._

<!--

References
---
- [Docusaurus v1 search](https://docusaurus.io/docs/en/search)
- [Algolia documentation](https://www.algolia.com/doc/)
-->

## SEO

Docusaurus takes care of both site level SEO and page specific SEO based on the content of your site.

Site SEO helps users reach your site. Page specific SEO helps your users find answers to their questions quickly.

### Site level SEO

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
  siteUrl: 'https://docusaurus.io/',
  themeConfig: {
    /**
     * relative to your site's "static" directory
     * cannot be svg
     */
    image: 'img/docusaurus.png',
  },
};
```

### Page specific SEO

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

#### `keywords`

- Type: `string[]`

You may provide an array of keywords in a bullet list. Consider putting searchable terms that summarizes key information of the page to help your users find the correct page.

#### `description`

- Type: `string`

If you provide a description to this page, we will use this description for SEO.

Consider putting key information about this page, error messages, searchable terms, etc., inside description to help your users land on your doc page.

#### `image`

- Type: `string`

`image` is used by search engines and Twitter for a cover or thumbnail image when displaying the link to your post.

Note that the file of this image cannot be SVG.

### Customize SEO

To add customized SEO, use the `Head` component from `@docusaurus/HEAD`.

```js
// your component
import Head from '@docusaurus/HEAD';

const MySEO = () => (
  <React.Fragment>
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width" />
    </Head>
  </React.Fragment>
);
```

## Analytics

_This section is a work in progress. [Welcoming PRs](https://github.com/facebook/docusaurus/issues/1640)._

<!--

Cover actual usage guidelines of adding analytics to sites.

References
---
- [source code](packages/docusaurus-plugin-google-analytics/src/index.js)
- [plugins](plugins.md)

-->
