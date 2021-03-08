---
title: Create a Document 
---

This page will help you to create your first document with Docusaurus.

## Creating a simple document 

Create a markdown file `docs/hello.md`.

```md
website # root directory of your site
├── docs
│   └── hello.md
├── src
│   └── pages
├── docusaurus.config.js
├── ...
```

Copy the example below to the file that you've just created:

```mdx
---
id: hello 
title: Hello, World! 
---

## Hello, World!

This is your first document in **Docusaurus**, Congratulations!
```

:::note

By default, the id of the document is the `filename` of the document. So, you can omit it if your filename already resembles the id.

:::

After creating and saving the file, run your development server and go to `http://localhost:3000/docs/hello` in your browser.

## Adding your document to the sidebar

Open `sidebars.js` and add the `id` of `hello.md` (`hello`) to the items in the docs sidebar.

```diff
module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Docusaurus Tutorial',
-      items: ['getting-started', 'markdown-features', 'create-a-doc'],
+      items: ['getting-started', 'markdown-features', 'create-a-doc', 'hello'],
    },
  ],
};
```
