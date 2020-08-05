---
id: creating-pages
title: Creating Pages
slug: /creating-pages
---

In this section, we will learn about creating ad-hoc pages in Docusaurus using React. This is most useful for creating one-off standalone pages like a showcase page, playground page or support page.

The functionality of pages is powered by `@docusaurus/plugin-content-pages`.

You can use React components, or Markdown.

## Add a React page

Create a file `/src/pages/helloReact.js`:

```jsx title="/src/pages/helloReact.js"
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

Once you save the file, the development server will automatically reload the changes. Now open `http://localhost:3000/helloReact`, you will see the new page you just created.

Each page doesn't come with any styling. You will need to import the `Layout` component from `@theme/Layout` and wrap your contents within that component if you want the navbar and/or footer to appear.

:::tip

You can also create TypeScript pages with the `.tsx` extension (`helloReact.tsx`).

:::

## Add a Markdown page

Create a file `/src/pages/helloMarkdown.md`:

```mdx title="/src/pages/helloMarkdown.md"
---
title: my hello page title
description: my hello page description
---

# Hello

How are you?
```

In the same way, a page will be created at `http://localhost:3000/helloMarkdown`.

Markdown pages allow you to use [markdown features](markdown-features.mdx) in your pages, which may be more convenient than creating React pages. However, markdown pages are less flexible than React pages, because they always use the theme layout.

Here's an [example markdown page](/examples/markdownPageExample).

:::tip

You can use the full power of React in Markdown pages too, refer to the [MDX](https://mdxjs.com/) documentation.

:::

## Routing

If you are familiar with other static site generators like Jekyll and Next, this routing approach will feel familiar to you. Any JavaScript file you create under `/src/pages/` directory will be automatically converted to a website page, following the `/src/pages/` directory hierarchy. For example:

- `/src/pages/index.js` → `<baseUrl>`
- `/src/pages/foo.js` → `<baseUrl>/foo`
- `/src/pages/foo/test.js` → `<baseUrl>/foo/test`
- `/src/pages/foo/index.js` → `<baseUrl>/foo/`

In this component-based development era, it is encouraged to co-locate your styling, markup and behavior together into components. Each page is a component, and if you need to customize your page design with your own styles, we recommend co-locating your styles with the page component in its own directory. For example, to create a "Support" page, you could do one of the following:

- Add a `/src/pages/support.js` file
- Create a `/src/pages/support/` directory and a `/src/pages/support/index.js` file.

The latter is preferred as it has the benefits of letting you put files related to the page within that directory. For example, a CSS module file (`styles.module.css`) with styles meant to only be used on the "Support" page. **Note:** this is merely a recommended directory structure and you will still need to manually import the CSS module file within your component module (`support/index.js`).

```sh
my-website
├── src
│   └── pages
│       ├── styles.module.css
│       ├── index.js
│       └── support
│           ├── index.js
│           └── styles.module.css
.
```

:::caution

All JavaScript/TypeScript files within the `src/pages/` directory will have corresponding website paths generated for them. Do not put reusable components or test files (ending with `.test.js`) into that directory otherwise they will be turned into pages, which might not be intended.

:::

## Using React

React is used as the UI library to create pages. Every page component should export a React component, and you can leverage on the expressiveness of React to build rich and interactive content.

## Duplicate Routes

You may accidentally create multiple pages that are meant to be accessed on the same route. When this happens, Docusaurus will warn you about duplicate routes when you run `yarn start` or `yarn build`, but the site will still be built successfully. The page that was created last will be accessible, but it will override other conflicting pages. To resolve this issue, you should modify or remove any conflicting routes.
