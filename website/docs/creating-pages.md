---
id: creating-pages
title: Creating Pages
---

In this section, we will learn about creating a regular page in Docusaurus using React.

1. Start your development server:

```bash
yarn start # opens http://localhost:3000
```

<!-- TODO: What will the user see if pages/ is empty? -->

2. Go to the `pages` directory and create a file called `hello.js` with the following contents:

```js
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

Once you save the file, the development server will automatically reload the changes. Now open http://localhost:3000/hello, you can see the hello page you just created. 

Any file you create under `pages/` directory will be automatically converted to a page. For example, `pages/test.js` will be available at http://localhost:3000/test

React is used as a templating engine to create pages. You can leverage on the expressibility of React to build rich web content. 
