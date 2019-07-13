---
id: creating-pages
title: Creating Pages
---

In this section, we will learn about creating ad-hoc pages in Docusaurus using React. This is most useful for creating one-off standalone pages like a showcase page, playground page or support page.

## Adding a new page

<!-- TODO: What will the user see if pages/ is empty? -->

In the `/src/pages/` directory, create a file called `hello.js` with the following contents:

```jsx
import React from 'react';
import Layout from '@theme/Layout';

function Hello() {
  return (
    <Layout title="Hello">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '20px',
        }}>
        <p>
          Edit <code>pages/hello.js</code> and save to reload.
        </p>
      </div>
    </Layout>
  );
}

export default Hello;
```

Once you save the file, the development server will automatically reload the changes. Now open http://localhost:3000/hello, you will see the new page you just created.

## Routing

If you are familiar with other static site generators like Jekyll and Next, this routing approach will feel familiar to you. Any JavaScript file you create under `/src/pages/` directory will be automatically converted to a website page, following the `/src/pages/` directory hierarchy. For example:

- `/src/pages/index.js` → `<baseUrl>/`
- `/src/pages/test.js` → `<baseUrl>/test`
- `/src/pages/foo/test.js` → `<baseUrl>/foo/test`
- `/src/pages/foo/index.js` → `<baseUrl>/foo`

In this era of components, if you need to customize your page design with your own styles, we recommend co-locating your styles with the page component in its own directory. For example, to create a new support page, you could:

1. Add a `/src/pages/support.js` file
1. Create a `/src/pages/support/` directory and a `/src/pages/support/index.js` file. This has the benefits of letting you create a CSS module file (`styles.module.css`) for `support.js` that is near where it's being used. **Note:** you will have to manually import the CSS module file within your component module.

```sh
my-website
├── src
│   └── pages
│       ├── styles.module.css
│       └── index.js
│           └── support
│               ├── index.js
│               └── styles.module.css
.
```

## Using React

React is used as the UI library to create pages. Every page component should export a React component and you can leverage on the expressibility of React to build rich and interactive content.

<!--
TODO:
- Explain that each page needs to be wrapped with `@theme/Layout`.
- That v2 is different from v1, users can write interactive components with lifecycles.

-->
