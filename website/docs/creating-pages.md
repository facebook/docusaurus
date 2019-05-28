---
id: creating-pages
title: Creating Pages
---

In this section, we will learn about creating a regular page in Docusaurus using React.

1. Go into the `pages` directory and create a file called `hello.js` with the following contents:

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

Make sure your development server is run (if you haven't already)

```bash
yarn start # open up http://localhost:3000
```

If you open http://localhost:3000/hello, you can see that there is the page that we just created. 

React is being used as a templating engine to create a page. You can leverage on the expressibility of React to build rich web content. If you create a new file `pages/test.js`, it will also be available at http://localhost:3000/test
