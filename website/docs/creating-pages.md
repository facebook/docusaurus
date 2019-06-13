---
id: creating-pages
title: Creating Pages
---

In this section, we will learn about creating ad-hoc pages in Docusaurus using React. This is most useful for creating one-off standalone pages.

### Creating Pages

<!-- TODO: What will the user see if pages/ is empty? -->

In the `pages` directory, create a file called `hello.js` with the following contents:

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

Any file you create under `pages` directory will be automatically converted to a page, converting the directory hierarchy into paths. For example:

- `pages/index.js` → `<baseUrl>/`
- `pages/test.js` → `<baseUrl>/test`
- `pages/foo/test.js` → `<baseUrl>/foo/test`
- `pages/foo/index.js` → `<baseUrl>/foo`

### Using React

React is used as the UI library to create pages. You can leverage on the expressibility of React to build rich web content.

<!--
TODO:
- Explain that each page needs to be wrapped with `@theme/Layout`.
- That v2 is different from v1, users can write interactive components with lifecycles.

-->
