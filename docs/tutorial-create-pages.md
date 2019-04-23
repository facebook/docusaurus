---
id: tutorial-create-pages
title: Create Pages
---

In this section we will learn about creating two new types of pages in Docusaurus, a regular page and a documentation page.

<img alt="Docusaurus process" src="/img/undraw_docusaurus_process.svg" style="max-width: 400px; margin: 3rem auto"/>

## Creating a Regular Page

1. Go into the `pages/en` directory and create a file called `hello-world.js` with the following contents:

```
const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function HelloWorld(props) {
  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <h1>Hello World!</h1>
        <p>This is my first page!</p>
      </Container>
    </div>
  );
}

module.exports = HelloWorld;
```

2. Go to http://localhost:3000/hello-world (TODO) and you should be able to see the new page.
1. Change the text within the `<p>...</p>` to "I'm at F8!". The browser should refresh automatically to reflect the changes.

React is being used as a templating engine for rendering static markup. You can leverage on the expressability of React to build rich web content. Learn more about creating pages [here](custom-pages).

![Docusaurus React](/img/undraw_docusaurus_react.svg)

## Create a Documentation Page

1. Create a new file in the `docs` folder called `f8.md`.
1. Paste the following contents:

```
---
id: f8
title: Hello F8
---

Hello F8! I'm at the Docusaurus classroom session!

## Using Docusaurus to Create Open Source Websites

In this session, we learned how Docusaurus makes it really simple to create a website for open source project documentation and get hands on by creating a Docusaurus website.
```

3. Go to `sidebars.json` and add `"f8"` after `"doc1"`.

```diff
{
  "docs": {
+    "Docusaurus": ["doc1", "f8"],
-    "Docusaurus": ["doc1"],
    "First Category": ["doc2"],
    "Second Category": ["doc3"]
  },
  "docs-other": {
    "First Category": ["doc4", "doc5"]
  }
}
```

4. Navigate to http://localhost:3000/docs/f8. (TODO)

You've created your first documentation page on Docusaurus! The `sidebars.json` is where you specify the order of your documentation pages and in the front matter of the Markdown file is where you provide metadata about that page.

Learn more about creating docs pages [here](navigation).
