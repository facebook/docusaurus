---
title: Deploy your site
---

Docusaurus is a **static-site-generator** (also called [Jamstack](https://jamstack.org/)), and builds your site as **static HTML, JavaScript and CSS files**.

## Build your site

Build your site **for production**:

```bash
npm run build
```

The static files are generated in the `build` directory.

## Deploy your site

Test your production build locally:

```bash
npm run serve
```

The `build` folder is now served at `http://localhost:3000/`.

You can now deploy the `build` folder **almost anywhere** easily, **for free** or very small cost (read the **[Deployment Guide](https://v2.docusaurus.io/docs/deployment)**).
