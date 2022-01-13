---
sidebar_label: Server-side rendering
---

# Server-side rendering (SSR)

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

:::info Why do we use a "render function"?

It's important to realize that the children of `<BrowserOnly>` is not a JSX element, but a function that _returns_ an element. This is a design decision. Consider this code:

```jsx
import BrowserOnly from '@docusaurus/BrowserOnly';

const MyComponent = () => {
  return (
    <BrowserOnly>
      {/* highlight-start */}
      {/* DON'T DO THIS - doesn't actually work */}
      <span>page url = {window.location.href}</span>
      {/* highlight-end */}
    </BrowserOnly>
  );
};
```

While you may expect that `BrowserOnly` hides away the children during server-side rendering, it actually can't. When the React renderer tries to render this JSX tree, it does see the `{window.location.href}` variable as a node of this tree and tries to render it, although it's actually not used! Using a function ensures that we only let the renderer see the browser-only component when it's needed.

:::
