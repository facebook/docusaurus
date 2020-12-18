---
id: docs-introduction
title: Docs Introduction
sidebar_label: Introduction
---

The docs feature provides users with a way to organize Markdown files in a hierarchical format.

## Document ID

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

## Home page docs

If you want a document to be available at the root, and have a path like `https://v2.docusaurus.io/docs/`, you can use the slug frontmatter:

```yml
---
id: my-home-doc
slug: /
---
Lorem ipsum
```

## Docs-only mode

If you only want the documentation feature, you can run your Docusaurus 2 site without a landing page and display your documentation page as the index page instead.

To enable docs-only mode, set the docs plugin `routeBasePath: '/'`, and use the frontmatter `slug: /` on the document that should be the index page ([more infos](#home-page-docs)).

:::caution

You should delete the existing homepage at `./src/pages/index.js`, or else there will be two files mapping to the same route!

:::

:::tip

There's also a "blog-only mode" for those who only want to use the blog feature of Docusaurus 2. You can use the same method detailed above. Follow the setup instructions on [Blog-only mode](blog.md#blog-only-mode).

:::
