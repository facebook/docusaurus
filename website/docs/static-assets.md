---
id: static-assets
title: Static Assets
---

In general, every website needs assets: images, stylesheets, favicons and etc. In such cases, you can create a directory named `static` at the root of your project. Every file you put into that directory will be copied into the the root of the generated `build` folder with the directory hierarchy preserved. E.g. if you add a file named `sun.jpg` to the static folder, it’ll be copied to `build/sun.jpg`.

This means that if the site's `baseUrl` is `/`, an image in `/static/img/docusaurus_keytar.svg` is available at `/img/docusaurus_keytar.svg`.

## Referencing assets with respect to `baseUrl`

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

## Types of static assets

Sometimes you want to link to static assets directly from markdown files, and it is convenient to co-locate the asset next to the markdown file using it.

We have setup Webpack loaders to handle most common file types, so that when you import a file, you get its url, and the asset is automatically copied to the output folder.

Let's imagine the following file structure:

```
# Your doc
/website/docs/myFeature.mdx

# Some assets you want to use
/website/docs/assets/docusaurus-asset-example-banner.png
/website/docs/assets/docusaurus-asset-example-pdf.pdf
/website/docs/assets/docusaurus-asset-example.xyz
```

### Image assets

You can use images by requiring them and using an image tag through MDX:

```mdx
# My markdown page

<img src={require('./assets/docusaurus-asset-example-banner.png').default} />

or

![](./assets/docusaurus-asset-example-banner.png)
```

The ES imports syntax also works:

```mdx
# My markdown page

import myImageUrl from './assets/docusaurus-asset-example-banner.png';

<img src={myImageUrl)}/>
```

This results in displaying the image:

![](./assets/docusaurus-asset-example-banner.png)

:::note

If you are using [@docusaurus/plugin-ideal-image](./using-plugins.md#docusaurusplugin-ideal-image), you need to use the dedicated image component, as documented.

:::

### Common assets

In the same way, you can link to existing assets by requiring them and using the returned url in videos, links etc...

```mdx
# My markdown page

<a
  target="_blank"
  href={require('./assets/docusaurus-asset-example-pdf.pdf').default}>
  Download this PDF !!!
</a>

or 

[Download this PDF using Markdown !!!](./assets/docusaurus-asset-example-pdf.pdf)
```

<a
  target="_blank"
  href={require('./assets/docusaurus-asset-example-pdf.pdf').default}>
  Download this PDF !!!
</a>


[Download this PDF using Markdown !!!](./assets/docusaurus-asset-example-pdf.pdf)

### Unknown assets

This require behavior is not supported for all file extensions, but as an escape hatch you can use the special Webpack syntax to force the `file-loader` to kick-in:

```mdx
# My markdown page

<a
  target="_blank"
  href={require('!file-loader!./assets/docusaurus-asset-example.xyz').default}>
  Download this unknown file !!!
</a>

or

[Download this unknown file using Markdown](!file-loader!./assets/docusaurus-asset-example.xyz)
```

<a
  target="_blank"
  href={require('!file-loader!./assets/docusaurus-asset-example.xyz').default}>
  Download this unknown file !!!
</a>

[Download this unknown file using Markdown !!!](!file-loader!./assets/docusaurus-asset-example.xyz)


```md
[![](./assets/docusaurus-asset-example-banner.png)](./assets/docusaurus-asset-example-pdf.pdf)
```

[![](./assets/docusaurus-asset-example-banner.png)](./assets/docusaurus-asset-example-pdf.pdf)

### Caveats

Keep in mind that:

- By default, none of the files in `static` folder will be post-processed or minified.
- Missing files references via hardcoded absolute paths will not be detected at compilation time, and will result in a 404 error.
- By default, GitHub Pages runs published files through [Jekyll](https://jekyllrb.com/). Since Jekyll will discard any files that begin with `_`, it is recommended that you disable Jekyll by adding an empty file named `.nojekyll` file to your `static` directory if you are using GitHub pages for hosting.
