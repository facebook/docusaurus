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

However, the last part of the `id` can be defined by user in the front matter. For example, if `guide/hello.md`'s content is defined as below, its final `id` is `guide/part1`.

```yml
---
id: part1
---
Lorem ipsum
```

## Home page docs

Using the `homePageId` property, you can create a home page of your docs. To do this, you can create a new document, especially for this purpose with the id as `_index`, or you could specify an existing document id.

```js {8} title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          homePageId: 'getting-started', // Defaults to `_index`
          // ...
        },
      },
    ],
  ],
  // ...
};
```

Given the example above, now when you navigate to the path `/docs` you will see that the document content with id is `getting-started`. This functionality also works for docs with versioning enabled.

:::important

The document id of `_index` is reserved exclusively for the home doc page, so it will not work as a standalone route. If left to the default, the page will not show a sidebar. If you wish to have a sidebar for this page, its ID must be renamed to, for example, `index` or `introduction`.

:::

:::note

The page `docs` that you created (eg. `src/pages/docs.js`) will take precedence over the route generated via the `homePageId` option.

:::

## Sidebar

To generate a sidebar to your Docusaurus site, you need to define a file that exports a sidebar object and pass that into the `@docusaurus/plugin-docs` plugin directly or via `@docusaurus/preset-classic`.

```js {8-9} title="docusaurus.config.js"
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
        // ...
      },
    ],
  ],
};
```

### Sidebar object

A sidebar object is defined like this:

```typescript
type Sidebar = {
  [sidebarId: string]:
    | {
        [sidebarCategory: string]: SidebarItem[];
      }
    | SidebarItem[];
};
```

Below is an example of a sidebar object. The key `docs` is the id of the sidebar (can be renamed to something else) and `Getting Started` is a category within the sidebar. `greeting` and `doc1` are both [sidebar item](#sidebar-item).

```js title="sidebars.js"
module.exports = {
  docs: {
    'Getting started': ['greeting'],
    Docusaurus: ['doc1'],
  },
};
```

Keep in mind that EcmaScript does not guarantee `Object.keys({a,b}) === ['a','b']` (yet, this is generally true). If you don't want to rely on iteration order of JavaScript object keys for the category name, the following sidebar object is also equivalent of the above shorthand syntax.

```js title="sidebars.js"
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

```js title="sidebars.js"
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

#### Sidebar item

As the name implies, `SidebarItem` is an item defined in a Sidebar. There are a few types we support:

- [Doc](#doc)
- [Link](#link)
- [Ref](#ref)
- [Category](#category)

#### Doc

```typescript
type SidebarItemDoc =
  | string
  | {
      type: 'doc';
      id: string;
    };
```

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

```js title="sidebars.js"
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

#### Link

```typescript
type SidebarItemLink = {
  type: 'link';
  label: string;
  href: string;
};
```

Sidebar item type that links to a non-document page. Example:

```js
{
  type: 'link',
  label: 'Custom Label', // The label that should be displayed (string).
  href: 'https://example.com' // The target URL (string).
}
```

#### Ref

```typescript
type SidebarItemRef = {
  type: 'ref';
  id: string;
};
```

Sidebar item type that links to doc without bounding it to the sidebar. Example:

```js
{
  type: 'ref',
  id: 'doc1', // Document id (string).
}
```

#### Category

This is used to add hierarchies to the sidebar:

```typescript
type SidebarItemCategory = {
  type: 'category';
  label: string; // Sidebar label text.
  items: SidebarItem[]; // Array of sidebar items.
  collapsed: boolean; // Set the category to be collapsed or open by default
};
```

As an example, here's how we created the subcategory for "Docs" under "Guides" in this site:

```js title="sidebars.js"
module.exports = {
  docs: {
    Guides: [
      'creating-pages',
      {
        type: 'category',
        label: 'Docs',
        items: ['markdown-features', 'sidebar', 'versioning'],
      },
    ],
  },
};
```

**Note**: it's possible to use the shorthand syntax to create nested categories:

```js title="sidebars.js"
module.exports = {
  docs: {
    Guides: [
      'creating-pages',
      {
        Docs: ['markdown-features', 'sidebar', 'versioning'],
      },
    ],
  },
};
```

#### Collapsible categories

For sites with a sizable amount of content, we support the option to expand/collapse a category to toggle the display of its contents. Categories are collapsible by default. If you want them to be always expanded, set `themeConfig.sidebarCollapsible` to `false`:

```js {4} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    sidebarCollapsible: false,
    // ...
  },
};
```

#### Expanded categories by default

For docs that have collapsible categories, you may want more fine-grain control over certain categories. If you want specific categories to be always expanded, you can set `collapsed` to `false`:

```js title="sidebars.js"
module.exports = {
  docs: {
    Guides: [
      'creating-pages',
      {
        type: 'category',
        label: 'Docs',
        collapsed: false,
        items: ['markdown-features', 'sidebar', 'versioning'],
      },
    ],
  },
};
```

## Docs-only mode

If you just want the documentation feature, you can enable "docs-only mode".

To achieve this, set the `routeBasePath` property of the `docs` object in `@docusaurus/preset-classic` in `docusaurus.config.js` to the root of your site, and also in that object set the `homePageId` property with the value of the document ID that you show as root of the docs.

:::note

More details on functionality of home page for docs can be found in [appropriate section](#home-page-docs).

:::

```js {8-9} title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/', // Set this value to '/'.
          homePageId: 'getting-started', // Set to existing document id.
          // ...
        },
      },
    ],
  ],
  // ...
};
```

Now, when visiting your site, it will show your initial document instead of a landing page.

:::tip

There's also a "blog-only mode", for those who only want to use the blog component of Docusaurus 2. You can use the same method detailed above, except that you need to delete the `/src/pages/index.js` file. Follow the setup instructions on [Blog-only mode](blog.md#blog-only-mode).

:::
