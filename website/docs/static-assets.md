---
id: static-assets
title: Static Assets
---

In general, every website needs assets: images, stylesheets, favicons and etc. In such cases, you can create a directory named `static` at the root of your project. Every file you put into that directory will be copied into the the root of the generated `build` folder with the directory hierarchy preserved. E.g. if you add a file named `sun.jpg` to the static folder, it’ll be copied to `build/sun.jpg`.

This means that if the site's `baseUrl` is `/`, an image in `/static/img/docusaurus_keytar.svg` is available at `/img/docusaurus_keytar.svg`.

<!-- TODO: Yangshun: This is inaccurate for sites with a non '/' baseUrl -->

## Referencing your static asset

You can reference assets from the `static` folder in your code. You could use hardcoded absolute paths, i.e. starting with a slash /, but remember to include the `baseUrl` if it is not `/`. However, this will break if you change your `baseUrl` in the config.

A better way would be to use the `withBaseUrl` utility function which appends the `baseUrl` to paths for you.

### JSX example

```
// MyComponent.js
import withBaseUrl from '@docusaurus/withBaseUrl';

<img
  alt="Docusaurus with Keytar"
  src={withBaseUrl('img/docusaurus_keytar.svg')}
/>;
```

### Markdown example

Unfortunately you can't use the `withBaseUrl` utility function in Markdown files yet. You'd have to write the paths as plain strings.

```markdown
<!-- reference static/img/docusaurus.png -->

![Docusaurus logo](/img/docusaurus.png)
```

### Caveats

Keep in mind that:

- None of the files in `static` folder will be post-processed or minified.
- Missing files references via hardcoded absolute paths will not be detected at compilation time, and will result in a 404 error.
