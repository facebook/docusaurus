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

At the top of the file, specify the `id` and `title` of your document. The purpose is so that Docusaurus can identify your document when generating your site. After that you can start adding your document's content.

```mdx
---
id: hello 
title: Hello, World! 
---

## Hello, World!

This is your first document in **Docusaurus**, Congratulations!
```

:::note

By default, id of the document is the `filename` of the document. So, you can omit it if your filename already resembles the id.

:::



After creating and saving the file, run your development server and go to `http://localhost:3000/docs/hello` in your browser.

## Adding your document to the sidebar

You can add `hello.md` to the sidebar by adding it to `sidebars.js`

Open `sidebars.js` and add the `id` of `hello.md` which is `hello` to the items in docs sidebar.

```js
module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Docusaurus Tutorial',
      items: ['getting-started', 'markdown-features', 'create-a-doc', 'hello'],
    },
  ],
};
```

Check your sidebar now, and you can access `hello.md` from the docs sidebar now!


## Making your document as the home page

If you want to make `hello.md` as your docs home page, then you can add `slug` to the header fields.

```mdx
---
id: hello
title: Hello, World! 
slug: /
---

Hello, World!
```