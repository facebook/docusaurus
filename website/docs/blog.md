---
id: blog
title: Blog
---

## Initial setup

To setup your site's blog, start by creating a `blog` directory.

Then, add a navbar link to your blog within `docusaurus.config.js`:

```js
links: [
  ...
  {to: 'blog', label: 'Blog', position: 'left'}, // or position: 'right'
  ...
]
```

## Adding posts

To publish in the blog, create a file within the blog directory with a formatted name of `YYYY-MM-DD-my-blog-post-title.md`. The post date is extracted from the file name.

For example, at `my-website/blog/2019-09-05-hello-docusaurus-v2.md`:

```md
---
title: Welcome Docusaurus v2
author: Dattatreya Tripathy
authorTitle: Contributor of Docusaurus 2
authorURL: https://github.com/dt97
authorTwitter: CuriousDT
tags: [hello, docusaurus-v2]
---

Welcome to this blog. This blog is created with [**Docusaurus 2 alpha**](https://v2.docusaurus.io/).

<!--truncate-->

This is my first post on Docusaurus 2.

A whole bunch of exploration to follow.
```

## Header options

The only required field is `title`; however, we provide options to add author information to your blog post as well along with other options.

- `author` - The author name to be displayed.
- `authorURL` - The URL that the author's name will be linked to. This could be a GitHub, Twitter, Facebook account URL, etc.
- `authorImageURL` - The URL to the author's image. (Note: If you use both `authorFBID` and `authorImageURL`, `authorFBID` will take precedence. Don't include `authorFBID` if you want `authorImageURL` to appear.)
- `title` - The blog post title.
- `tags` - A list of strings to tag to your post.

## Summary truncation

Use the `<!--truncate-->` marker in your blog post to represent what will be shown as the summary when viewing all published blog posts. Anything above `<!--truncate-->` will be part of the summary. For example:

```md {9}
---
title: Truncation Example
---

All this will be part of the blog post summary.

Even this.

<!--truncate-->

But anything from here on down will not be.

Not this.

Or this.
```

## Feed

You can generate RSS/ Atom feed by passing feedOptions.

```ts
feedOptions?: {
  type: 'rss' | 'atom' | 'all';
  title?: string;
  description?: string;
  copyright: string;
  language?: string; // possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
};
```

Example usage:

```js {9-12}
// docusaurus.config.js
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        blog: {
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`
          },
        },
      },
    ],
  ],
};
```

Accessing the feed:

The feed for RSS can be found at

```text
https://{your-domain}/blog/rss.xml
```

and for atom

```text
https://{your-domain}/blog/atom.xml
```

## Advanced topics

### Blog-only mode

You can run your Docusaurus 2 site without a landing page and instead have your blog's post list page as the index page. Set the `routeBasePath` to be `'/'` to indicate it's the root path.

**Note:** Make sure there's no `index.js` page in `src/pages` or else there will be two files mapping to the same route!

```js {10}
// docusaurus.config.js
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        blog: {
          path: './blog',
          routeBasePath: '/', // Set this value to '/'.
        },
      },
    ],
  ],
};
```

<!--

Adding a blog using the blog plugin.

References
---
- [source code](/packages/docusaurus-plugin-content-blog/src/index.js)
- [v1 doc](https://docusaurus.io/docs/en/next/adding-blog)

-->
