---
id: sidebar
title: Sidebar
---

To generate a sidebar to your Docusaurus site, you need to define a file that exports a sidebar object and pass that into the `@docusaurus/plugin-docs` plugin directly or via `@docusaurus/preset-classic`.

```js {9-10}
// docusaurus.config.js
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // Sidebars filepath relative to the site dir.
          sidebarPath: require.resolve('./sidebars.js'),
        },
        ...
      },
    ],
  ],
};
```

## Sidebar object

A sidebar object looks like the following. The key `docs` is the name of the sidebar (can be renamed to something else) and `Getting Started` is a category within the sidebar. `greeting` and `doc1` is just a [Sidebar Item](#sidebar-item).

```js
// sidebars.js
module.exports = {
  docs: {
    'Getting started': ['greeting'],
    Docusaurus: ['doc1'],
  },
};
```

If you don't want to rely on iteration order of JavaScript object keys for the category name, the following sidebar object is also equivalent of the above.

```js
// sidebars.js
module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['greeting'],
    },
    {
      type: 'category',
      label: 'Docusaurus',
      items: ['doc1'],
    },
  ],
};
```

You can also have multiple sidebars for different Markdown files by adding more top-level keys to the exported object.

Example:

```js
// sidebars.js
module.exports = {
  firstSidebar: {
    'Category A': ['doc1'],
  },
  secondSidebar: {
    'Category A': ['doc2'],
    'Category B': ['doc3'],
  },
};
```

## Document ID

Every document has a unique `id`. By default, a document `id` is the name of the document (without the extension) relative to the root docs directory.

For example, `greeting.md` id is `greeting` and `guide/hello.md` id is `guide/hello`.

```bash
website # root directory of your site
└── docs
   ├── greeting.md
   └── guide
      └── hello.md
```

However, the last part of the `id` can be defined by user in the frontmatter. For example, if `guide/hello.md` content is defined as below, it's final `id` is `guide/part1`.

```yml
---
id: part1
---
Lorem ipsum
```

## Sidebar item

As the name implies, `SidebarItem` is an item defined in a Sidebar. There are a few types we support:

- Doc
- Link
- Ref
- Category

### Doc

Sidebar item type that links to a doc page. Example:

```js
{
  type: 'doc',
  id: 'doc1', // string - document id
}
```

Using just the [Document ID](#document-id) is perfectly valid as well, the following is equivalent to the above:

```js
'doc1'; // string - document id
```

Note that using this type will bind the linked doc to current sidebar, this means that if you access `doc1` page, the sidebar displayed will be the sidebar this item is on. For below case, `doc1` is bounded to `firstSidebar`.

```js
// sidebars.js
module.exports = {
  firstSidebar: {
    'Category A': ['doc1'],
  },
  secondSidebar: {
    'Category A': ['doc2'],
    'Category B': ['doc3'],
  },
};
```

### Link

Sidebar item type that links to a non-document page. Example:

```js
{
  type: 'link',
  label: 'Custom Label', // string - the label that should be displayed.
  href: 'https://example.com' // string - the target URL.
}
```

### Ref

Sidebar item type that links to doc without bounding it to the sidebar. Example:

```js
{
  type: 'ref',
  id: 'doc1', // string - document id
}
```

### Category

This is used to add hierarchies to the sidebar:

```js
{
  type: 'category',
  label: string, // Sidebar label text.
  items: SidebarItem[], // Array of sidebar items.
}
```

As an example, here's how we created the subcategory for "Docs" under "Guides" in this site:

```js
// sidebars.js
module.exports = {
  docs: {
    Guides: [
      'creating-pages',
      {
        type: 'category',
        label: 'Docs',
        items: ['markdown-features', 'sidebar'],
      },
    ],
  },
};
```
