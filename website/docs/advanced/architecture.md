---
description: How Docusaurus works to build your app
---

# Architecture

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Zoom from '@site/src/components/Zoom';
```

<Zoom>

![Architecture overview](/img/architecture.png)

</Zoom>

This image shows how Docusaurus works to build your app. Plugins each collect their content and emit JSON data; themes provide layout components which receive the JSON data as route modules. The bundler bundles all the components and emits a server bundle and a client bundle.

Although you (either plugin authors or site creators) are writing JavaScript all the time, bear in mind that the JS is actually run in different environments:

- All plugin lifecycle methods are run in Node. Therefore, until we support ES Modules in our codebase, plugin source code must be provided as CommonJS that can be `require`'d.
- The theme code is built with Webpack. They can be provided as ESM—following React conventions.

Plugin code and theme code never directly import each other: they only communicate through protocols (in our case, through JSON temp files and calls to `addRoute`). A useful mental model is to imagine that the plugins are not written in JavaScript, but in another language like Rust. The only way to interact with plugins for the user is through `docusaurus.config.js`, which itself is run in Node (hence you can use `require` and pass callbacks as plugin options).

During bundling, the config file itself is serialized and bundled, allowing the theme to access config options like `themeConfig` or `baseUrl` through [`useDocusaurusContent()`](../docusaurus-core.md#useDocusaurusContext). However, the `siteConfig` object only contains **serializable values** (values that are preserved after `JSON.stringify()`). Functions, regexes, etc. would be lost on the client side. The `themeConfig` is designed to be entirely serializable.

Beware: the theme being run in Webpack doesn't mean it always has access to browser globals! The theme is built twice:

- During **server-side rendering**, the theme is compiled in a sandbox called [React DOM Server](https://reactjs.org/docs/react-dom-server.html). You can see this as a "headless browser", where there is no `window` or `document`, only React. SSR produces static HTML pages.
- During **client-side rendering**, the theme is compiled with standard React DOM, and has access to browser variables.

Therefore, while you probably know not to access Node globals like `process` or the `'fs'` module, you can't freely access browser globals either. If you need to, you need to wrap your component with [`<BrowserOnly>`](../docusaurus-core.md#browseronly) to make sure it's invisible during SSR and only rendered in CSR, or put your logic in `useEffect()` to delay its execution until after first CSR.

:::note what about process.env.NODE_ENV?

One exception to the "no Node globals" rule is `process.env.NODE_ENV`. In fact, you can use it in React, because Webpack injects this variable as a global:

```jsx
import React from 'react';

export default function expensiveComp() {
  if (process.env.NODE_ENV === 'development') {
    return <>This component is not shown in development</>;
  }
  const res = someExpensiveOperationThatLastsALongTime();
  return <>{res}</>;
}
```

During Webpack build, the `process.env.NODE_ENV` will be replaced with the value, either `'development'` or `'production'`. You will then get different build results after treeshaking:

<Tabs>
<TabItem value="Development">

```diff
import React from 'react';

export default function expensiveComp() {
  // highlight-next-line
  if ('development' === 'development') {
+   return <>This component is not shown in development</>;
  }
- const res = someExpensiveOperationThatLastsALongTime();
- return <>{res}</>;
}
```

</TabItem>
<TabItem value="Production">

```diff
import React from 'react';

export default function expensiveComp() {
  // highlight-next-line
- if ('production' === 'development') {
-   return <>This component is not shown in development</>;
- }
+ const res = someExpensiveOperationThatLastsALongTime();
+ return <>{res}</>;
}
```

</TabItem>
</Tabs>

:::
