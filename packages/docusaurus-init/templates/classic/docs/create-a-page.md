---
title: Create a Page
---

This page will help you to create standalone pages in Docusaurus, either with React or Markdown.

## Creating a React Page

Create a file: `/src/pages/react.js`

```jsx title="/src/pages/react.js"
import React from "react";

function HelloWorld() {
    return (
        <div>
            <h1>Hello, World!</h1>
        </div>
    )
}
```

Save the file, and the development server will automatically reload the changes. Open `http://localhost:3000/react`, to see the page that you just created with React. 

## Creating a Markdown Page

Create a file: `/src/pages/markdown.md`

```mdx title="/src/pages/markdown.md"
---
title: Hello, World!
description: This is a page created with Markdown
hide_table_of_contents: true
---

# Hello, World!

```

Save the file, and the development server will automatically reload the changes. Open `http://localhost:3000/markdown`, to see the page that you just created with Markdown. 

## Routing

Any JavaScript (React) or Markdown files that you create under `/src/pages` directory will be automatically converted into a website page.

Here are some examples:

- `/src/pages/index.js` -> `<baseUrl>`
- `/src/pages/foo.js` -> `<baseUrl>/foo`
- `/src/pages/foo/bar.js` -> `<baseUrl>/foo/bar`