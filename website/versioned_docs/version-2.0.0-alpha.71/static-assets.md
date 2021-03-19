---
id: static-assets
title: Static Assets
---

Every website needs assets: images, stylesheets, favicons etc. In such cases, you can create a directory named `static` at the root of your project.

Every file you put into **that directory will be copied** into the root of the generated `build` folder with the directory hierarchy preserved. E.g. if you add a file named `sun.jpg` to the static folder, it will be copied to `build/sun.jpg`.

This means that:

- for site `baseUrl: '/'`, the image `/static/img/docusaurus.png` will be served at `/img/docusaurus.png`.
- for site `baseUrl: '/subpath/'`, the image `/static/img/docusaurus.png` will be served at `/subpath/img/docusaurus.png`.

## Referencing your static asset {#referencing-your-static-asset}

You can reference assets from the `static` folder in your code using absolute paths, but this is not ideal because changing the site `baseUrl` will **break those link**s.

You can `import` / `require()` the static asset (recommended), or use the `useBaseUrl` utility function: both prepend the `baseUrl` to paths for you.

### JSX example {#jsx-example}

```jsx title="MyComponent.js"
import DocusaurusImageUrl from '@site/static/img/docusaurus.png';

<img src={DocusaurusImageUrl} />;
```

```jsx title="MyComponent.js"
<img src={require('@site/static/img/docusaurus.png').default} />
```

```jsx title="MyComponent.js"
import useBaseUrl from '@docusaurus/useBaseUrl';

<img src={useBaseUrl('/img/docusaurus.png')} />;
```

You can also import SVG files: they will be transformed into React components.

```jsx title="MyComponent.js"
import DocusaurusLogoWithKeytar from '@site/static/img/docusaurus_keytar.svg';

<DocusaurusLogoWithKeytar title="Docusaurus Logo" className="logo" />;
```

### Markdown example {#markdown-example}

Markdown links and images referencing assets of the static folder will be converted to `require("@site/static/assetName.png")"`, and **the site baseUrl will be automatically prepended** for you.

```md title="my-doc.md"
![Docusaurus](/img/docusaurus.png)
```

Thanks to MDX, you can also use `useBaseUrl` utility function in Markdown files! You'd have to use html tags like `<img>` instead of the Markdown image syntax though. The syntax is exactly the same as in JSX.

```jsx title="my-doc.mdx"
---
id: my-doc
title: My Doc
---

// Add to the top of the file below the front matter.
import useBaseUrl from '@docusaurus/useBaseUrl';

...

<img alt="Docusaurus with Keytar" src={useBaseUrl('/img/docusaurus_keytar.svg')} />
```

### Caveats {#caveats}

Keep in mind that:

- By default, none of the files in `static` folder will be post-processed, hashed or minified.
- Missing files referenced via hardcoded absolute paths will not be detected at compilation time, and will result in a 404 error.
- By default, GitHub Pages runs published files through [Jekyll](https://jekyllrb.com/). Since Jekyll will discard any files that begin with `_`, it is recommended that you disable Jekyll by adding an empty file named `.nojekyll` file to your `static` directory if you are using GitHub pages for hosting.
