# Client architecture

## Theme aliases {#theme-aliases}

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

We already talked about how the "userland theme" in `src/theme` can re-use a theme component through the [`@theme-original`](#wrapping) alias. One theme package can also wrap a component from another theme, by importing the component from the initial theme, using the `@theme-init` import.

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

## Client modules {#client-modules}

Client modules are part of your site's bundle, just like theme components. However, they are usually side-effect-ful. Client modules are anything that can be `import`ed by Webpack—CSS, JS, etc. JS scripts usually work on the global context, like registering event listeners, creating global variables...

These modules are imported globally before React even renders the initial UI.

```js title="App.tsx"
// How it works under the hood
import '@generated/client-modules';
```

Plugins and sites can both declare client modules, through [`getClientModules`](../api/plugin-methods/lifecycle-apis.md#getClientModules) and [`siteConfig.clientModules`](../api/docusaurus.config.js.md#clientModules), respectively.

Client modules are called during server-side rendering as well, so remember to check the [execution environment](./ssg.md#escape-hatches) before accessing client-side globals.

```js title="mySiteGlobalJs.js"
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  // As soon as the site loads in the browser, register a global event listener
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Period') {
      location.assign(location.href.replace('.com', '.dev'));
    }
  });
}
```

CSS stylesheets imported as client modules are [global](../styling-layout.md#global-styles).

```css title="mySiteGlobalCss.css"
/* This stylesheet is global. */
.globalSelector {
  color: red;
}
```

<!-- TODO client module lifecycles -->
<!-- https://github.com/facebook/docusaurus/issues/3399 -->
