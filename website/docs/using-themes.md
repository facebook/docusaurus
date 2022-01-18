---
id: using-themes
title: Themes
---

Like plugins, themes are designed to add functionality to your Docusaurus site. As a good rule of thumb, themes are mostly focused on the client-side, whereas plugins are more focused on server-side functionalities. Themes are also designed to be replaceable with other themes.

**Themes are for providing UI components to present the content.** Most content plugins need to be paired with a theme in order to be actually useful. The UI is a separate layer from the data schema, which makes swapping designs easy.

For example, a Docusaurus blog consists of a blog plugin and a blog theme.

:::note

This is a contrived example: in practice, `@docusaurus/theme-classic` provides the theme for docs, blog, and layouts.

:::

```js title="docusaurus.config.js"
module.exports = {
  themes: ['theme-blog'],
  plugins: ['plugin-content-blog'],
};
```

And if you want to use Bootstrap styling, you can swap out the theme with `theme-blog-bootstrap` (another fictitious non-existing theme):

```js title="docusaurus.config.js"
module.exports = {
  themes: ['theme-blog-bootstrap'],
  plugins: ['plugin-content-blog'],
};
```

## Available themes {#available-themes}

We maintain a [list of official themes](./api/themes/overview.md).

## Using themes {#using-themes}

To use themes, specify the themes in your `docusaurus.config.js`. You may use multiple themes:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  // highlight-next-line
  themes: ['@docusaurus/theme-classic', '@docusaurus/theme-live-codeblock'],
};
```

## Theme components {#theme-components}

Most of the time, theme is used to provide a set of React components, e.g. `Navbar`, `Layout`, `Footer`.

Users can use these components in their code by importing them using the `@theme` webpack alias:

```js
import Navbar from '@theme/Navbar';
```

The alias `@theme` can refer to a few directories, in the following priority:

1. A user's `website/src/theme` directory, which is a special directory that has the higher precedence.
2. A Docusaurus theme package's `theme` directory.
3. Fallback components provided by Docusaurus core (usually not needed).

## Swizzling theme components {#swizzling-theme-components}

```mdx-code-block
import SwizzleWarning from "./_partials/swizzleWarning.mdx"

<SwizzleWarning/>
```

Docusaurus Themes' components are designed to be replaceable. To make it easier for you, we created a command for you to replace theme components called `swizzle`. Given the following structure:

```
website
├── node_modules
│   └── docusaurus-theme
│       └── theme
│           └── Navbar.js
└── src
    └── theme
        └── Navbar.js
```

`website/src/theme/Navbar.js` takes precedence whenever `@theme/Navbar` is imported. This behavior is called component swizzling. In iOS, method swizzling is the process of changing the implementation of an existing selector (method). In the context of a website, component swizzling means providing an alternative component that takes precedence over the component provided by the theme.

To swizzle a component for a theme, run the following command in your doc site:

```bash npm2yarn
npm run swizzle <theme name> [component name]
```

As an example, to swizzle the `<Footer />` component in `@docusaurus/theme-classic` for your site, run:

```bash npm2yarn
npm run swizzle @docusaurus/theme-classic Footer
```

This will copy the current `<Footer />` component used by the theme to an `src/theme/Footer` directory under the root of your site, which is where Docusaurus will look for swizzled components. Docusaurus will then use the swizzled component in place of the original one from the theme.

Although we highly discourage swizzling of all components, if you wish to do that, run:

```bash npm2yarn
npm run swizzle @docusaurus/theme-classic
```

**Note**: You need to restart your webpack dev server in order for Docusaurus to know about the new component.

## Wrapping theme components {#wrapping-theme-components}

Sometimes, you just want to wrap an existing theme component with additional logic, and it can be a pain to have to maintain an almost duplicate copy of the original theme component.

In this case, you should swizzle the component you want to wrap, but import the original theme component in your customized version to wrap it.

### For site owners {#for-site-owners}

The `@theme-original` alias allows you to import the original theme component.

Here is an example to display some text just above the footer, with minimal code duplication.

```js title="src/theme/Footer.js"
// Note: importing from "@theme/Footer" would fail due to the file importing itself
import OriginalFooter from '@theme-original/Footer';
import React from 'react';

export default function Footer(props) {
  return (
    <>
      <div>Before footer</div>
      <OriginalFooter {...props} />
    </>
  );
}
```

### For plugin authors {#for-plugin-authors}

One theme can wrap a component from another theme, by importing the component from the initial theme, using the `@theme-init` import.

Here's an example of using this feature to enhance the default theme `CodeBlock` component with a `react-live` playground feature.

```js
import InitialCodeBlock from '@theme-init/CodeBlock';
import React from 'react';

export default function CodeBlock(props) {
  return props.live ? (
    <ReactLivePlayground {...props} />
  ) : (
    <InitialCodeBlock {...props} />
  );
}
```

Check the code of `@docusaurus/theme-live-codeblock` for details.

:::caution

Unless you want to publish a re-usable "theme enhancer" (like `@docusaurus/theme-live-codeblock`), you likely don't need `@theme-init`.

:::

<details>

<summary>How are theme aliases resolved?</summary>

It can be quite hard to wrap your mind around these aliases. Let's imagine the following case with a super convoluted setup with three themes/plugins and the site itself all trying to define the same component. Internally, Docusaurus loads these themes as a "stack".

```text
+-------------------------------------------------+
|        `website/src/theme/CodeBlock.js`         | <-- `@theme/CodeBlock` always points to the top
+-------------------------------------------------+
| `theme-live-codeblock/theme/CodeBlock/index.js` | <-- `@theme-original/CodeBlock` points to the topmost non-swizzled component
+-------------------------------------------------+
|  `plugin-awesome-codeblock/theme/CodeBlock.js`  |
+-------------------------------------------------+
|     `theme-classic/theme/CodeBlock/index.js`    | <-- `@theme-init/CodeBlock` always points to the bottom
+-------------------------------------------------+
```

The components in this "stack" are pushed in the order of `preset plugins > preset themes > plugins > themes > site`, so the swizzled component in `website/src/theme` always comes out on top because it's loaded last.

`@theme/*` always points to the topmost component—when `CodeBlock` is swizzled, all other components requesting `@theme/CodeBlock` receive the swizzled version.

`@theme-original/*` always points to the topmost non-swizzled component. That's why you can import `@theme-original/CodeBlock` in the swizzled component—it points to the next one in the "component stack", a theme-provided one. Plugin authors should not try to use this because your component could be the topmost component and cause a self-import.

`@theme-init/*` always points to the bottommost component—usually, this comes from the theme or plugin that first provides this component. Individual plugins / themes trying to enhance code block can safely use `@theme-init/CodeBlock` to get its basic version. Site creators should generally not use this because you likely want to enhance the _topmost_ instead of the _bottommost_ component. It's also possible that the `@theme-init/CodeBlock` alias does not exist at all—Docusaurus only creates it when it points to a different one from `@theme-original/CodeBlock`, i.e. when it's provided by more than one theme. We don't waste aliases!

</details>

## Wrapping your site with `<Root>` {#wrapper-your-site-with-root}

A `<Root>` theme component is rendered at the very top of your Docusaurus site. It allows you to wrap your site with additional logic, by creating a file at `src/theme/Root.js`:

```js title="website/src/theme/Root.js"
import React from 'react';

// Default implementation, that you can customize
function Root({children}) {
  return <>{children}</>;
}

export default Root;
```

This component is applied above the router and the theme `<Layout>`, and will **never unmount**.

:::tip

Use this component to render React Context providers and global stateful logic.

:::

## Themes design {#themes-design}

While themes share the exact same lifecycle methods with plugins, their implementations can look very different from those of plugins based on themes' designed objectives.

Themes are designed to complete the build of your Docusaurus site and supply the components used by your site, plugins, and the themes themselves. So a typical theme implementation would look like a `src/index.js` file that hooks it up to the lifecycle methods. Most likely they would not use `loadContent`, which plugins would use. And it is typically accompanied by an `src/theme` directory full of components.

To summarize:

- Themes share the same lifecycle methods with Plugins
- Themes are run after all existing Plugins
- Themes exist to add component aliases by extending the webpack config

## Writing customized Docusaurus themes {#writing-customized-docusaurus-themes}

A Docusaurus theme normally includes an `index.js` file where you hook up to the lifecycle methods, alongside a `theme/` directory of components. A typical Docusaurus `theme` folder looks like this:

```bash
website
├── package.json
└── src
    ├── index.js
    # highlight-start
    └── theme
        ├── MyThemeComponent
        └── AnotherThemeComponent.js
    # highlight-end
```

There are two lifecycle methods that are essential to theme implementation:

- [`getThemePath()`](./api/plugin-methods/extend-infrastructure.md#getThemePath)
- [`getClientModules()`](./api/plugin-methods/lifecycle-apis.md#getClientModules)

These lifecycle methods are not essential but recommended:

- [`validateThemeConfig({themeConfig, validate})`](./api/plugin-methods/static-methods.md#validateThemeConfig)
- [`validateOptions({options, validate})`](./api/plugin-methods/static-methods.md#validateOptions)
