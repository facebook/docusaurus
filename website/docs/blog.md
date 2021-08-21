---
id: blog
title: Blog
---

The blog feature enables you to deploy in no time a full-featured blog.

:::info

Check the [Blog Plugin API Reference documentation](./api/plugins/plugin-content-blog.md) for an exhaustive list of options.

:::

## Initial setup {#initial-setup}

To setup your site's blog, start by creating a `blog` directory.

Then, add an item link to your blog within `docusaurus.config.js`:

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

## Adding posts {#adding-posts}

To publish in the blog, create a Markdown file within the blog directory.

For example, create a file at `my-website/blog/2019-09-05-hello-docusaurus-v2.md`:

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
hide_table_of_contents: false
---
Welcome to this blog. This blog is created with [**Docusaurus 2**](https://docusaurus.io/).

<!--truncate-->

This is my first post on Docusaurus 2.

A whole bunch of exploration to follow.
```

:::note

Docusaurus will extract a `YYYY-MM-DD` date from a file/folder name such as `YYYY-MM-DD-my-blog-post-title.md`.

This naming convention is optional, and you can provide the date as FrontMatter.

<details>
<summary>Example supported patterns</summary>

- `2021-05-28-my-blog-post-title.md`
- `2021-05-28-my-blog-post-title.mdx`
- `2021-05-28-my-blog-post-title/index.md`
- `2021-05-28/my-blog-post-title.md`
- `2021/05/28/my-blog-post-title.md`
- `2021/05-28-my-blog-post-title.md`
- `2021/05/28/my-blog-post-title/index.md`
- ...

</details>

:::

:::tip

Using a folder can be convenient to co-locate blog post images alongside the Markdown file.

:::

The only required field in the front matter is `title`; however, we provide options to add more metadata to your blog post, for example, author information. For all possible fields, see [the API documentation](api/plugins/plugin-content-blog.md#markdown-frontmatter).

## Blog list {#blog-list}

The blog's index page (by default, it is at `/blog`) is the _blog list page_, where all blog posts are collectively displayed.

Use the `<!--truncate-->` marker in your blog post to represent what will be shown as the summary when viewing all published blog posts. Anything above `<!--truncate-->` will be part of the summary. For example:

```yml
---
title: Truncation Example
---
All these will be part of the blog post summary.

Even this.

<!--truncate-->

But anything from here on down will not be.

Not this.

Or this.
```

By default, 10 posts are shown on each blog list page, but you can control pagination with the `postsPerPage` option in the plugin configuration. If you set `postsPerPage: 'ALL'`, pagination will be disabled and all posts will be displayed on the first page. You can also add meta description to the blog list page for better SEO:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        blog: {
          // highlight-start
          blogTitle: 'Docusaurus blog!',
          blogDescription: 'A Docusaurus powered blog!',
          postsPerPage: 'ALL',
          // highlight-end
        },
      },
    ],
  ],
};
```

## Blog sidebar {#blog-sidebar}

The blog sidebar displays recent blog posts. The default number of items shown is 5, but you can customize with the `blogSidebarCount` option in the plugin configuration. By setting `blogSidebarCount: 0`, the sidebar will be completely disabled, with the container removed as well. This will increase the width of the main container. Specially, if you have set `blogSidebarCount: 'ALL'`, _all_ posts will be displayed.

You can also alter the sidebar heading text with the `blogSidebarTitle` option. For example, if you have set `blogSidebarCount: 'ALL'`, instead of the default "Recent posts", you may would rather make it say "All posts":

```js title="docusaurus.config.js"
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        blog: {
          // highlight-start
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
          // highlight-end
        },
      },
    ],
  ],
};
```

:::note

Because the sidebar title is hard-coded in the configuration file, it is currently untranslatable.

:::

## Feed {#feed}

You can generate RSS/Atom feed by passing feedOptions. By default, RSS and Atom feeds are generated. To disable feed generation, set `feedOptions.type` to `null`.

```ts
type BlogOptions = {
  feedOptions?: {
    type?: 'rss' | 'atom' | 'all' | null;
    title?: string;
    description?: string;
    copyright: string;
    language?: string; // possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
  };
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

## Advanced topics {#advanced-topics}

### Blog-only mode {#blog-only-mode}

You can run your Docusaurus 2 site without a landing page and instead have your blog's post list page as the index page. Set the `routeBasePath` to be `'/'` to indicate it's the root path.

```js {10} title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: false,
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

### Multiple blogs {#multiple-blogs}

By default, the classic theme assumes only one blog per website and hence includes only one instance of the blog plugin. If you would like to have multiple blogs on a single website, it's possible too! You can add another blog by specifying another blog plugin in the `plugins` option for `docusaurus.config.js`.

Set the `routeBasePath` to the URL route that you want your second blog to be accessed on. Note that the `routeBasePath` here has to be different from the first blog or else there could be a collision of paths! Also, set `path` to the path to the directory containing your second blog's entries.

As documented for [multi-instance plugins](./using-plugins.md#multi-instance-plugins-and-plugin-ids), you need to assign a unique id to the plugins.

```js title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        /**
         * Required for any multi-instance plugin
         */
        id: 'second-blog',
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

As an example, we host a second blog [here](/tests/blog).
