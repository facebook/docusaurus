---
description: Customize your site's appearance through creating your own theme components
slug: /using-themes
---

# Swizzling

In this section, we will introduce how customization of layout is done in Docusaurus.

> Déja vu...?

This section is similar to [Styling and Layout](../styling-layout.md), but this time, we are going to write more code and go deeper into the internals instead of playing with stylesheets. We will talk about a central concept in Docusaurus customization: **swizzling**, from how to swizzle, to how it works under the hood.

We know you are busy, so we will start with the "how" before going into the "why".

## Swizzling

```mdx-code-block
import SwizzleWarning from "../_partials/swizzleWarning.mdx"

<SwizzleWarning/>
```

Docusaurus Themes' components are designed to be replaceable. The replacing is called "swizzle" (for why it's called that, you have to understand [how theme components are resolved](#theme-aliases)). To help you get started, we created a command called `docusaurus swizzle`.

### Ejecting theme components

To eject a component provided by the theme, run the following command in your doc site:

```bash npm2yarn
npm run swizzle [theme name] [component name]
```

As an example, to swizzle the `<Footer />` component in `@docusaurus/theme-classic` for your site, run:

```bash npm2yarn
npm run swizzle @docusaurus/theme-classic Footer
```

This will copy the current `<Footer />` component used by Docusaurus to an `src/theme/Footer` directory under the root of your site, which is where Docusaurus will look for swizzled components. Docusaurus will then use the swizzled component in place of the original one from the theme.

:::note

You need to restart your webpack dev server in order for Docusaurus to know about the new component.

:::

If you run `swizzle` without `component name` or `theme name`, the command will give you a list to choose from. To only list available components, run with the `--list` option:

```bash npm2yarn
npm run swizzle @docusaurus/theme-classic --list
```

"Swizzle" is a central concept in Docusaurus, and is a natural product of our [layered theme architecture](#theme-aliases). Note that the command `docusaurus swizzle` is only an automated way to help you swizzle the component: you can still do it manually by creating the `src/theme/Footer.js` file, and Docusaurus will pick that one up when resolving theme components. There's no internal magic behind this command!

### Wrapping theme components {#wrapping-theme-components}

Ejecting a component is risky. It means you have to maintain an almost duplicate copy of the original theme component. Also, it's likely that we will change internal implementations in future versions and break your component, even if you never touched that part of the code.

In this case, you are still going to swizzle the component—but not from scratch and re-implementing a self-sustained component. Instead, you can delegate most of the logic and layout to the original theme component, only wrapping it with additional logic. The `@theme-original` alias allows you to import the original theme component.

Here is an example to display some text just above the footer, with minimal code duplication.

```js title="src/theme/Footer.js"
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

Should you be wondering why we have to use `'@theme-original/Footer'` instead of `'@theme/Footer'`, a short explanation is that once you have the swizzled component, the `'@theme/Footer'` alias will now point to your swizzled component, and thus cause a self-import. For a more in-depth explanation, see [theme aliases](#theme-aliases).

## Theme design

When plugins have loaded their content, the data is made available to the client side through actions like [`createData` + `addRoute`](../api/plugin-methods/lifecycle-apis.md#addRoute) or [`setGlobalData`](../api/plugin-methods/lifecycle-apis.md#setglobaldatadata-any-void). This data has to be _serialized_ to plain strings, because [plugins and themes run in different environments](./architecture.md). Once the data arrives on the client side, the rest becomes familiar to React developers: data is passed along components, components are bundled with Webpack, and rendered to the window through `ReactDOM.render`...

**Themes provide the set of UI components to render the content.** Most content plugins need to be paired with a theme in order to be actually useful. The UI is a separate layer from the data schema, which makes swapping designs easy.

For example, a Docusaurus blog may consist of a blog plugin and a blog theme.

:::note

This is a contrived example: in practice, `@docusaurus/theme-classic` provides the theme for docs, blog, and layouts.

:::

```js title="docusaurus.config.js"
module.exports = {
  // highlight-next-line
  themes: ['theme-blog'],
  plugins: ['plugin-content-blog'],
};
```

And if you want to use Bootstrap styling, you can swap out the theme with `theme-blog-bootstrap` (another fictitious non-existing theme):

```js title="docusaurus.config.js"
module.exports = {
  // highlight-next-line
  themes: ['theme-blog-bootstrap'],
  plugins: ['plugin-content-blog'],
};
```

Now, although the theme receives the same data from the plugin, how the theme chooses to _render_ the data as UI can be drastically different.

While themes share the exact same lifecycle methods with plugins, themes' implementations can look very different from those of plugins based on themes' designed objectives.

Themes are designed to complete the build of your Docusaurus site and supply the components used by your site, plugins, and the themes themselves. A theme still acts like a plugin and exposes some lifecycle methods, but most likely they would not use [`loadContent`](../api/plugin-methods/lifecycle-apis.md#loadContent), since they only receive data from plugins, but don't generate data themselves; themes are typically also accompanied by an `src/theme` directory full of components, which are made known to the core through the [`getThemePath`](../api/plugin-methods/extend-infrastructure#getThemePath) lifecycle.

To summarize:

- Themes share the same lifecycle methods with Plugins
- Themes are run after all existing Plugins
- Themes add component aliases by providing `getThemePath`. We will talk about theme aliases right next.

## Theme aliases

As aforementioned, a theme works by exporting a set of components, e.g. `Navbar`, `Layout`, `Footer`. Docusaurus and users use these components by importing them using the `@theme` webpack alias:

```js
import Navbar from '@theme/Navbar';
```

The alias `@theme` can refer to a few directories, in the following priority:

1. A user's `website/src/theme` directory, which is a special directory that has the higher precedence.
2. A Docusaurus theme package's `theme` directory.
3. Fallback components provided by Docusaurus core (usually not needed).

This is called a _layered architecture_: a higher-priority layer providing the component would shadow a lower-priority layer, making swizzling possible. Given the following structure:

```
website
├── node_modules
│   └── @docusaurus/theme-classic
│       └── theme
│           └── Navbar.js
└── src
    └── theme
        └── Navbar.js
```

`website/src/theme/Navbar.js` takes precedence whenever `@theme/Navbar` is imported. This behavior is called component swizzling. In iOS, method swizzling is the process of changing the implementation of an existing selector (method). **In the context of a website, component swizzling means providing an alternative component that takes precedence over the component provided by the theme.**

We already talked about how the "userland theme" in `src/theme` can re-use a theme component through the [`@theme-original`](#wrapping-theme-components) alias. One theme package can also wrap a component from another theme, by importing the component from the initial theme, using the `@theme-init` import.

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

<!-- TODO integrate the content below  -->

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
