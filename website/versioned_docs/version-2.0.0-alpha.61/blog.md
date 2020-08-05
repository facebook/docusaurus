---
id: blog
title: Blog
---

## Initial setup

To setup your site's blog, start by creating a `blog` directory.

Then, add a item link to your blog within `docusaurus.config.js`:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    // ...
    navbar: {
      items: [
        // ...
        // highlight-next-line
        {to: 'blog', label: 'Blog', position: 'left'}, // or position: 'right'
      ],
    },
  },
};
```

## Adding posts

To publish in the blog, create a file within the blog directory with a formatted name of `YYYY-MM-DD-my-blog-post-title.md`. The post date is extracted from the file name.

For example, at `my-website/blog/2019-09-05-hello-docusaurus-v2.md`:

```yml
---
title: Welcome Docusaurus v2
author: Joel Marcey
author_title: Co-creator of Docusaurus 1
author_url: https://github.com/JoelMarcey
author_image_url: https://graph.facebook.com/611217057/picture/?height=200&width=200
tags: [hello, docusaurus-v2]
description: This is my first post on Docusaurus 2.
image: https://i.imgur.com/mErPwqL.png
---
Welcome to this blog. This blog is created with [**Docusaurus 2 alpha**](https://v2.docusaurus.io/).

<!--truncate-->

This is my first post on Docusaurus 2.

A whole bunch of exploration to follow.
```

## Header options

The only required field is `title`; however, we provide options to add author information to your blog post as well along with other options.

- `author` - The author name to be displayed.
- `author_url` - The URL that the author's name will be linked to. This could be a GitHub, Twitter, Facebook profile URL, etc.
- `author_image_url` - The URL to the author's thumbnail image.
- `author_title` - A description of the author.
- `title` - The blog post title.
- `tags` - A list of strings to tag to your post.
- `draft` - A boolean flag to indicate that the blog post is work in process and therefore should not be published yet. However, draft blog posts will be displayed during development.
- `description`: The description of your post, which will become the `<meta name="description" content="..."/>` and `<meta property="og:description" content="..."/>` in `<head>`, used by search engines. If this field is not present, it will default to the first line of the contents.
- `image`: Cover or thumbnail image that will be used when displaying the link to your post.

## Summary truncation

Use the `<!--truncate-->` marker in your blog post to represent what will be shown as the summary when viewing all published blog posts. Anything above `<!--truncate-->` will be part of the summary. For example:

```yml
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

```js {8-11} title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        blog: {
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`,
          },
        },
      },
    ],
  ],
};
```

Accessing the feed:

The feed for RSS can be found at:

```text
https://{your-domain}/blog/rss.xml
```

and for Atom:

```text
https://{your-domain}/blog/atom.xml
```

## Advanced topics

### Blog-only mode

You can run your Docusaurus 2 site without a landing page and instead have your blog's post list page as the index page. Set the `routeBasePath` to be `'/'` to indicate it's the root path.

```js {9} title="docusaurus.config.js"
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

:::caution

Don't forget to delete the existing homepage at `./src/pages/index.js` or else there will be two files mapping to the same route!

:::

You can also add meta description to the blog list page for better SEO:

```js {8} title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        blog: {
          blogDescription: 'A docusaurus powered blog!',
        },
      },
    ],
  ],
};
```

### Multiple blogs

By default, the classic theme assumes only one blog per website and hence includes only one instance of the blog plugin. If you would like to have multiple blogs on a single website, it's possible too! You can add another blog by specifying another blog plugin in the `plugins` option for `docusaurus.config.js`.

Set the `routeBasePath` to the URL route that you want your second blog to be accessed on. Note that the `routeBasePath` here has to be different from the first blog or else there could be a collision of paths! Also, set `path` to the path to the directory containing your second blog's entries.

```js title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        /**
         * URL route for the blog section of your site.
         * *DO NOT* include a trailing slash.
         */
        routeBasePath: 'my-second-blog',
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: './my-second-blog',
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
