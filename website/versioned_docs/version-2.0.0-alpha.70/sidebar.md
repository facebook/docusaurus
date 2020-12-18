---
id: docs-sidebar
title: Sidebar
slug: /sidebar
---

To generate a sidebar to your Docusaurus site:

1. Define a file that exports a [sidebar object](#sidebar-object).
1. Pass this object into the `@docusaurus/plugin-docs` plugin directly or via `@docusaurus/preset-classic`.

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

## Sidebar object

A sidebar object contains [sidebar items](#understanding-sidebar-items) and it is defined like this:

```typescript
type Sidebar = {
  [sidebarId: string]:
    | {
        [sidebarCategory: string]: SidebarItem[];
      }
    | SidebarItem[];
};
```

For example:

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

In this example, notice the following:

- The key `docs` is the id of the sidebar. The id can be any value, not necessarily `docs`.
- `Getting Started` is a category within the sidebar.
- `greeting` and `doc1` are both [sidebar item](#sidebar-item).

Shorthand notation can also be used:

```js title="sidebars.js"
module.exports = {
  docs: {
    'Getting started': ['greeting'],
    Docusaurus: ['doc1'],
  },
};
```

:::note Shorthand notation relies on the iteration order of JavaScript object keys for the category name. When using this notation, keep in mind that EcmaScript does not guarantee `Object.keys({a,b}) === ['a','b']`, yet this is generally true. :::

## Using multiple sidebars

You can have multiple sidebars for different Markdown files by adding more top-level keys to the exported object.

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

By default, the doc page the user is reading will display the sidebar that it is part of. This can be customized with the [sidebar type](#understanding-sidebar-items).

For example, with the above example, when displaying the `doc2` page, the sidebar will contain the items of `secondSidebar` only. Another example of multiple sidebars is the `API` and `Docs` sections on the Docusaurus website.

For more information about sidebars and how they relate to doc pages, see [Navbar doc link](./api/themes/theme-configuration.md#navbar-doc-link).

## Understanding sidebar items

As the name implies, `SidebarItem` is an item defined in a Sidebar. A sibarItem as a `type` that defines what the item links to.

`type` supports the following values

- [Doc](#linking-to-a-doc-page)
- [Link](#creating-a-generic-link)
- [Ref](#creating-a-link-to-page-without-sidebar)
- [Category](#creating-a-hierachy)

### Linking to a doc page

Set `type` to `doc` to link to a documentation page. This is the default type.

```typescript
type SidebarItemDoc =
  | string
  | {
      type: 'doc';
      id: string;
    };
```

Example:

```js
{
  type: 'doc',
  id: 'doc1', // string - document id
}
```

Using just the [Document ID](#document-id) is also valid, the following is equivalent to the above:

```js
'doc1'; // string - document id
```

Using this type will bind the linked doc to current sidebar. This means that if you access the `doc1` page, the sidebar displayed will be the sidebar that contains this doc page.

In the example below, `doc1` is bound to `firstSidebar`.

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

### Creating a generic link

Set `type` to `link` to link to a non-documentation page. For example, to create an external link.

```typescript
type SidebarItemLink = {
  type: 'link';
  label: string;
  href: string;
};
```

Example:

```js
{
  type: 'link',
  label: 'Custom Label', // The label that should be displayed (string).
  href: 'https://example.com' // The target URL (string).
}
```

### Creating a link to page without sidebar

Set `type` to `ref` to link to a documentation page without binding it to a sidebar. This means the sidebar dissapears when the user displays the linked page.

```typescript
type SidebarItemRef = {
  type: 'ref';
  id: string;
};
```

Example:

```js
{
  type: 'ref',
  id: 'doc1', // Document id (string).
}
```

### Creating a hierachy

The Sidebar item type that creates a hierarchy in the sidebar. Set `type` to `category`.

```typescript
type SidebarItemCategory = {
  type: 'category';
  label: string; // Sidebar label text.
  items: SidebarItem[]; // Array of sidebar items.
  collapsed: boolean; // Set the category to be collapsed or open by default
};
```

Example:

```js title="sidebars.js"
module.exports = {
  docs: [
    {
      ...
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/creating-pages',
        {
          Docs: ['docs-introduction', 'docs-sidebar', 'markdown-features', 'versioning'],
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
        Docs: [
          'docs-introduction',
          'docs-sidebar',
          'markdown-features',
          'versioning',
        ],
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

## Hideable sidebar

Using the enabled `themeConfig.hideableSidebar` option, you can make the entire sidebar hidden, allowing you to better focus your users on the content. This is especially useful when content consumption on medium screens (e.g. on tablets).

```js {4} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    hideableSidebar: true,
    // ...
  },
};
```

## Passing custom props

To pass in custom props to a swizzled sidebar item, add the optional `customProps` object to any of the items:

```js
{
  type: 'doc';
  id: 'doc1';
  customProps: {
    /* props */
  }
}
```
