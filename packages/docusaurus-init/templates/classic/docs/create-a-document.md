---
title: Create a Document
---

Documents are pages with a **sidebar**, a **previous/next navigation** and many other useful features.

## Create a Document

Create a markdown file at `docs/my-doc.md`:

```mdx title="docs/hello.md"
---
title: Hello, World!
---

## Hello, World!

This is your first document in **Docusaurus**, Congratulations!
```

A new document is now available at `http://localhost:3000/docs/hello`.

## Add your document to the sidebar

Add `hello` to the `sidebars.js` file:

```diff title="sidebars.js"
module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Docusaurus Tutorial',
-     items: ['getting-started', 'create-a-doc', ...],
+     items: ['getting-started', 'create-a-doc', 'hello', ...],
    },
  ],
};
```
