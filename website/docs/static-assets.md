---
id: static-assets
title: Static Assets
---

In general, every website needs assets: images, stylesheets, favicons and etc. In such cases, you can create a directory named `static` at the root of your project. Every file you put into that directory will be copied into the the root of the generated `build` folder with the directory hierarchy preserved. E.g. if you add a file named `sun.jpg` to the static folder, it’ll be copied to `build/sun.jpg`.

This means that if the site's `baseUrl` is `/`, an image in `/static/img/docusaurus_keytar.svg` is available at `<baseUrl>/docusaurus_keytar.svg`.

<!-- TODO: Yangshun: This is inaccurate for sites with a non '/' baseUrl -->

## Referencing your static asset

You can reference assets from the static folder in your code with absolute path, i.e. starting with a slash /.

### Markdown example

```markdown
<!-- reference static/img/docusaurus.png -->

![Docusaurus logo](/img/docusaurus.png)
```

Result:

![Docusaurus logo](/img/docusaurus.png)

### JSX example

```jsx
// reference static/img/slash-birth.png
<img src="/img/slash-birth.png" alt="docusaurus mascot" />
```

Result:

<img src="/img/slash-birth.png" alt="docusaurus mascot" />

Keep in mind that:

- None of the files in static folder will be post-processed or minified.
- Missing files will not be called at compilation time, and will result in a 404 error.
