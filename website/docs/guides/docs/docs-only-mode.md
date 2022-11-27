---
id: docs-only-mode
description: Make docs/ a root of a Docusaurus site.
slug: /docs-only-mode
---

# Docs-only mode {#docs-only-mode}

If you only need the docs, use the Docs-only mode. This way you will skip the landing page and the docs will be served from the root.

To enter the Docs-only mode, you need to take three steps: (1) update the config, (2) create a new root, and (3) delete the old root.

## 1. Change config

Assume that you have the following in your configuration:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    '@docusaurus/preset-classic',
    {
      docs: {
        /* docs plugin options */
      },
      blog: {
        /* blog plugin options */
      },
      // ...
    },
  ],
};
```

To enter docs-only mode, change it to like this:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    '@docusaurus/preset-classic',
    {
      docs: {
        // highlight-next-line
        **routeBasePath: '/', // Serve the docs at the site's root**
        /* other docs plugin options */
      },
      // highlight-next-line
      **blog: false, // Optional: disable the blog plugin**
      // ...
    },
  ],
};
```

## 2. Add a slug to create new root

Next, you need to create a new root. Add 'slug: /' to the to the front matter of (for example) docs/intro.md:

```md title="docs/intro.md"
---
# highlight-next-line
slug: /
---
```

## 3. Delete old root

After adding `slug: /` to a doc, **delete** the existing homepage at `./src/pages/index.js`. Otherwise there will be two files mapping to the same route!

Now, the site's structure will be like the following:

```
example.com/                       -> generated from `docs/intro.md`
example.com/tutorial-basics/...    -> generated from `docs/tutorial-basics/...`
...
```

Note that you **don't necessarily have to give up on using the blog** or other plugins; all that `routeBasePath: '/'` does is that instead of serving the docs through `https://example.com/docs/some-doc`, they are now at the site root: `https://example.com/some-doc`. The blog, if enabled, can still be accessed through the `blog/` subroute.

:::tip

There's also a "blog-only mode" for those who only want to use the blog feature of Docusaurus 2. You can use the same method detailed above. Follow the setup instructions on [Blog-only mode](../../blog.mdx#blog-only-mode).

:::

---

## Resources

https://youtu.be/Rc6mdSRaikE?t=792
