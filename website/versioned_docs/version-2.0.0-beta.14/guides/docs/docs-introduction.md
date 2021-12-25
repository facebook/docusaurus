---
id: introduction
title: Docs Introduction
sidebar_label: Introduction
slug: /docs-introduction
---

The docs feature provides users with a way to organize Markdown files in a hierarchical format.

:::info

Check the [Docs Plugin API Reference documentation](./../../api/plugins/plugin-content-docs.md) for an exhaustive list of options.

:::

## Document ID {#document-id}

Every document has a unique `id`. By default, a document `id` is the name of the document (without the extension) relative to the root docs directory.

For example, `greeting.md` id is `greeting` and `guide/hello.md` id is `guide/hello`.

```bash
website # Root directory of your site
└── docs
   ├── greeting.md
   └── guide
      └── hello.md
```

However, the **last part** of the `id` can be defined by user in the front matter. For example, if `guide/hello.md`'s content is defined as below, its final `id` is `guide/part1`.

```yml
---
id: part1
---
Lorem ipsum
```

If you want more control over the last part of the document URL, it is possible to add a `slug` (defaults to the `id`).

```yml
---
id: part1
slug: part1.html
---
Lorem ipsum
```

:::note

It is possible to use:

- absolute slugs: `slug: /mySlug`, `slug: /`...
- relative slugs: `slug: mySlug`, `slug: ./../mySlug`...

:::

## Home page docs {#home-page-docs}

If you want a document to be available at the root, and have a path like `https://docusaurus.io/docs/`, you can use the slug frontmatter:

```yml
---
id: my-home-doc
slug: /
---
Lorem ipsum
```

## Docs-only mode {#docs-only-mode}

A freshly initialized Docusaurus site has the following structure:

```
example.com/                                -> generated from `src/pages/index.js`

example.com/docs/intro                      -> generated from `docs/intro.md`
example.com/docs/tutorial-basics/...        -> generated from `docs/tutorial-basics/...`
...

example.com/blog/2021/08/26/welcome         -> generated from `blog/2021-08-26-welcome/index.md`
example.com/blog/2021/08/01/mdx-blog-post   -> generated from `blog/2021-08-01-mdx-blog-post.mdx`
...
```

All docs will be served under the subroute `docs/`. But what if **your site only has docs**, or you want to prioritize your docs by putting it at the root?

Assume that you have the following in your configuration:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    '@docusaurus/preset-classic',
    {
      docs: {
        /* docs plugin options */
      },
      blog: {
        /* blog plugin options */
      },
      // ...
    },
  ],
};
```

To enter docs-only mode, change it to like this:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    '@docusaurus/preset-classic',
    {
      docs: {
        // highlight-next-line
        routeBasePath: '/', // Serve the docs at the site's root
        /* other docs plugin options */
      },
      // highlight-next-line
      blog: false, // Optional: disable the blog plugin
      // ...
    },
  ],
};
```

Note that you **don't necessarily have to give up on using blog** or other plugins; all that `routeBasePath: '/'` does is that instead of serving the docs through `https://example.com/docs/some-doc`, they are now at the site root: `https://example.com/some-doc`. The blog, if enabled, can still be accessed through the `blog/` subroute.

Don't forget to put some page at the root (`https://example.com/`) through adding the front matter:

```yml title="docs/intro.md"
---
# highlight-next-line
slug: /
---
This page will be the home page when users visit https://example.com/.
```

:::caution

If you added `slug: /` to a doc to make it the homepage, you should delete the existing homepage at `./src/pages/index.js`, or else there will be two files mapping to the same route!

:::

Now, the site's structure will be like the following:

```
example.com/                       -> generated from `docs/intro.md`
example.com/tutorial-basics/...    -> generated from `docs/tutorial-basics/...`
...
```

:::tip

There's also a "blog-only mode" for those who only want to use the blog feature of Docusaurus 2. You can use the same method detailed above. Follow the setup instructions on [Blog-only mode](../../blog.mdx#blog-only-mode).

:::
