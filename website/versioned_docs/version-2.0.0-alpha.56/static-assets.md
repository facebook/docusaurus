---
id: static-assets
title: Static Assets
---

In general, every website needs assets: images, stylesheets, favicons and etc. In such cases, you can create a directory named `static` at the root of your project. Every file you put into that directory will be copied into the the root of the generated `build` folder with the directory hierarchy preserved. E.g. if you add a file named `sun.jpg` to the static folder, it’ll be copied to `build/sun.jpg`.

This means that if the site's `baseUrl` is `/`, an image in `/static/img/docusaurus_keytar.svg` is available at `/img/docusaurus_keytar.svg`.

## Referencing your static asset

You can reference assets from the `static` folder in your code. You could use hardcoded absolute paths, i.e. starting with a slash /, but remember to include the `baseUrl` if it is not `/`. However, this will break if you change your `baseUrl` in the config.

A better way would be to use the `useBaseUrl` utility function which appends the `baseUrl` to paths for you.

### JSX example

```jsx title="MyComponent.js"
import useBaseUrl from '@docusaurus/useBaseUrl';

<img
  alt="Docusaurus with Keytar"
  src={useBaseUrl('img/docusaurus_keytar.svg')}
/>;
```

You can also import SVG images, which will be transformed into React components.

```jsx title="MyComponent.js"
import DocusaurusLogoWithKeytar from '@site/static/img/docusaurus_keytar.svg';

<DocusaurusLogoWithKeytar title="Docusaurus Logo" className="logo" />;
```

### Markdown example

Thanks to MDX, you can also use `useBaseUrl` utility function in Markdown files! You'd have to use `<img>` tags instead of the Markdown image syntax though. The syntax is exactly the same as in JSX.

```jsx title="my-doc.mdx"
---
id: my-doc
title: My Doc
---

// Add to the top of the file below the front matter.
import useBaseUrl from '@docusaurus/useBaseUrl';

...

<img alt="Docusaurus with Keytar" src={useBaseUrl('img/docusaurus_keytar.svg')} />
```

You could also just use Markdown image syntax, but you would have to manually maintain the image paths yourself and isn't recommended.

```md title="my-doc.md"
![Docusaurus with Keytar](/img/docusaurus_keytar.png)
```

### Caveats

Keep in mind that:

- By default, none of the files in `static` folder will be post-processed or minified.
- Missing files references via hardcoded absolute paths will not be detected at compilation time, and will result in a 404 error.
