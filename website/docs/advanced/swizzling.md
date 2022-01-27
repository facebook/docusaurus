---
description: Customize your site's appearance through creating your own theme components
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

Docusaurus Themes' components are designed to be replaceable. The replacing is called "swizzle". In Objective C, method swizzling is the process of changing the implementation of an existing selector (method). **In the context of a website, component swizzling means providing an alternative component that takes precedence over the component provided by the theme.** (To gain a deeper understanding of this, you have to understand [how theme components are resolved](#theme-aliases)). To help you get started, we created a command called `docusaurus swizzle`.

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

Very often, you don't need to re-implement a component from scratch, but only to render additional items before or after it, or conditionally call some other logic. In this case, you are still going to swizzle the component—but not making a self-sustained one. Instead, you can delegate most of the logic and layout to the original theme component. The `@theme-original` alias allows you to import the original theme component and wrap it as a higher-order component.

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

## Which component should I swizzle?

Currently, `theme-classic` has about 100 components[^source]! If you want to customize a part of your site's layout, which component should you choose?

[^source]: https://github.com/facebook/docusaurus/tree/main/packages/docusaurus-theme-classic/src/theme

You can follow the following steps to locate the component to swizzle:

1. **Search.** Our components are semantically named, so you should be able to infer its function from the name. The swizzle CLI allows you to enter part of a component name to narrow down the available choices. For example, if you run `yarn swizzle @docusaurus/theme-classic`, and enter `Doc`, only the docs-related components will be listed.
2. **Start with a higher-level component.** Components form a tree with some components importing others. Every route will be associated with one top-level component that the route will render (most of them listed in [Routing in content plugins](routing.md#routing-in-content-plugins)). For example, all blog post pages have `@theme/BlogPostPage` as the topmost component. You can start with swizzling this component, and then go down the component tree to locate the component that renders just what you are targeting. Don't forget to unswizzle the rest by deleting the files after you've found the correct one, so you don't maintain too many components.
3. **Read the source code and use search wisely.** Topmost components are registered by the plugin with `addRoute`, so you can search for `addRoute` and see which component the plugin references. Afterwards, read the code of all components that this component references.
4. **Ask.** If you still have no idea which component to swizzle to achieve the desired effect, you can reach out for help in one of our [support channels](/community/support).

### Wrapping your site with `<Root>` {#wrapper-your-site-with-root}

The `<Root>` component is one that you probably won't spot. Every component provided by `theme-classic` is ultimately only rendered on certain routes, and will be unmounted during route transition; however, the `<Root>` theme component is rendered at the very top of the Docusaurus SPA, above the router and the theme `<Layout>`, and will **never unmount**, allowing you to wrap your site with additional logic like global state. You can swizzle it by creating a file at `src/theme/Root.js`:

```js title="website/src/theme/Root.js"
import React from 'react';

// Default implementation, that you can customize
function Root({children}) {
  return <>{children}</>;
}

export default Root;
```

:::tip

Use this component to render React Context providers and global stateful logic.

:::

## Do I need to swizzle?

Swizzling ultimately means you have to maintain part of the code directly used to build your site, and you have to interact with Docusaurus internal APIs. If you can, think about the following alternatives when customizing your site:

1. **Use CSS.** CSS rules and selectors can often help you achieve a decent degree of customization. Refer to [styling and layout](../styling-layout.md) for more details.
2. **Use translations.** It may sound surprising, but translations are ultimately just a way to customize the text labels. For example, if your site's default language is `en`, you can still run `yarn write-translations -l en` and edit the `code.json` emitted. Refer to [i18n tutorial](../i18n/i18n-tutorial.md) for more details.
3. **The smaller, the better.** If swizzling is inevitable, prefer to swizzle only the relevant part and maintain as little code on your own as possible. Swizzling a small component often means less risk of breaking during upgrade. [Wrapping](#wrapping-theme-components) is also a far safer alternative to [ejecting](#ejecting-theme-components).

## Theme aliases

A theme works by exporting a set of components, e.g. `Navbar`, `Layout`, `Footer`, to render the data passed down from plugins. Docusaurus and users use these components by importing them using the `@theme` webpack alias:

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

`website/src/theme/Navbar.js` takes precedence whenever `@theme/Navbar` is imported. This behavior is called component swizzling. If you are familiar with Objective C where a function's implementation can be swapped during runtime, it's the exact same concept here with changing the target `@theme/Navbar` is pointing to!

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
