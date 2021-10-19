---
id: version-1.9.x-tutorial-create-pages
title: Create Pages
original_id: tutorial-create-pages
---

In this section, we will learn about creating two types of pages in Docusaurus: a regular page and a documentation page.

<img alt="Docusaurus MacBook" src="/img/undraw_docusaurus_tree.svg" class="docImage"/>

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

2. Go to http://localhost:3000/hello-world and you should be able to see the new page.
1. Change the text within the `<p>...</p>` to "I can write JSX here!". The browser should refresh automatically to reflect the changes.

```diff
- <p>This is my first page!</p>
+ <p>I can write JSX here!</p>
```

React is being used as a templating engine for rendering static markup. You can leverage on the expressibility of React to build rich web content. Learn more about creating pages [here](custom-pages).

<img alt="Docusaurus React" src="/img/undraw_docusaurus_react.svg" class="docImage"/>

## Create a Documentation Page

1. Create a new file in the `docs` folder called `doc4.md`. The `docs` folder is in the root of your Docusaurus project, one level above `website`.
1. Paste the following contents:

```
---
id: doc4
title: This is Doc 4
---

I can write content using [GitHub-flavored Markdown syntax](https://github.github.com/gfm/).

## Markdown Syntax

**Bold** _italic_ `code` [Links](#url)

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

* Hey
* Ho
* Let's Go
```

3. The `sidebars.json` is where you specify the order of your documentation pages, so open `website/sidebars.json` and add `"doc4"` after `"doc1"`. This ID should be the same one as in the metadata for the Markdown file above, so if you gave a different ID in Step 2, just make sure to use the same ID in the sidebar file.

```diff
{
  "docs": {
    "Docusaurus": [
      "doc1",
+     "doc4"
    ],
    "First Category": ["doc2"],
    "Second Category": ["doc3"]
  },
  "docs-other": {
    "First Category": ["doc4", "doc5"]
  }
}
```

4. A server restart is needed to pick up sidebar changes, so kill your dev server (<kbd>Cmd</kbd> + <kbd>C</kbd> or <kbd>Ctrl</kbd> + <kbd>C</kbd>) and restart it with `npm run start`.
1. Navigate to http://localhost:3000/docs/doc4.

You've created your first documentation page on Docusaurus!

Learn more about creating docs pages [here](navigation).
