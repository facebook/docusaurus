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
Note that you don't necessarily have to give up on using blog; all that <code>routeBasePath: '/'</code> does is that instead of serving the docs through <code>https://example.com/docs/some-doc</code>, they are now at the site root: <code>https://example.com/some-doc</code>.
Don't forget to put some page at the root (<code>https://example.com/) through adding the front matter:

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

You are looking for docs-only mode. I assume you have the following in your <code>docusaurus.config.js</code>:
```
presets: [
  '@docusaurus/preset-classic',
  {
    docs: {/* ... */},
    blog: {/* ... */},
    // ...
  },
],
```
To enter docs-only mode, change it to like this:
```
presets: [
  '@docusaurus/preset-classic',
  {
    docs: {
      routeBasePath: '/',
      // ...
    },
    blog: false,
    // ...
  },
],
```
::: Note 
  You don't necessarily have to give up on using blog; all that <code>routeBasePath: '/'</code> does is that instead of serving the docs through <code>https://example.com/docs/some-doc</code>, they are now at the site root: <code>https://example.com/some-doc</code>.
  Don't forget to put some page at the root (<code>https://example.com/</code>) through adding the front matter:
  ```
  ---
  sidebar_position: 0
  slug: /
  ---
  # Home
  
  This page will appear as the home page.
  ```


:::caution

You should delete the existing homepage at `./src/pages/index.js`, or else there will be two files mapping to the same route!

:::

:::tip

There's also a "blog-only mode" for those who only want to use the blog feature of Docusaurus 2. You can use the same method detailed above. Follow the setup instructions on [Blog-only mode](../../blog.mdx#blog-only-mode).

:::