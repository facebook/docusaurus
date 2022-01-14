---
sidebar_label: Server-side rendering
---

# Server-side rendering (SSR)

In [architecture](architecture.md), we mentioned that the theme is run in Webpack. But beware: that doesn't mean it always has access to browser globals! The theme is built twice:

- During **server-side rendering**, the theme is compiled in a sandbox called [React DOM Server](https://reactjs.org/docs/react-dom-server.html). You can see this as a "headless browser", where there is no `window` or `document`, only React. SSR produces static HTML pages.
- During **client-side rendering**, the theme is compiled with standard React DOM, and has access to browser variables. CSR produces dynamic JavaScript.

Therefore, while you probably know not to access Node globals like `process` ([or can we?](#node-env)) or the `'fs'` module, you can't freely access browser globals either.

```jsx
import React from 'react';

export default function WhereAmI() {
  return <span>{window.location.href}</span>;
}
```

This looks like idiomatic React, but if you run `docusaurus build`, you will get an error:

```
ReferenceError: window is not defined
```

This is because during server-side rendering, the Docusaurus app isn't actually run in browser, and it doesn't know what the `window` is.

<details id="node-env">

<summary>What about <code>process.env.NODE_ENV</code>?</summary>

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

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

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
</details>

## Understanding SSR

## Escape hatches

### `<BrowserOnly>`

If you need to render something in browser only, one common approach is to wrap your component with [`<BrowserOnly>`](../docusaurus-core.md#browseronly) to make sure it's invisible during SSR and only rendered in CSR.

```jsx
import BrowserOnly from '@docusaurus/BrowserOnly';

function MyComponent(props) {
  return (
    // highlight-start
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        const LibComponent =
          require('some-lib-that-accesses-window').LibComponent;
        return <LibComponent {...props} />;
      }}
    </BrowserOnly>
    // highlight-end
  );
}
```

It's important to realize that the children of `<BrowserOnly>` is not a JSX element, but a function that _returns_ an element. This is a design decision. Consider this code:

```jsx
import BrowserOnly from '@docusaurus/BrowserOnly';

function MyComponent() {
  return (
    <BrowserOnly>
      {/* highlight-start */}
      {/* DON'T DO THIS - doesn't actually work */}
      <span>page url = {window.location.href}</span>
      {/* highlight-end */}
    </BrowserOnly>
  );
}
```

While you may expect that `BrowserOnly` hides away the children during server-side rendering, it actually can't. When the React renderer tries to render this JSX tree, it does see the `{window.location.href}` variable as a node of this tree and tries to render it, although it's actually not used! Using a function ensures that we only let the renderer see the browser-only component when it's needed.

### `useIsBrowser`

You can also use the `useIsBrowser()` hook to test if the component is currently in a browser environment. It returns `false` in SSR and `true` is CSR. Use this hook if you only need to perform certain operations on client-side, but not render an entirely different UI.

```jsx
import useIsBrowser from '@docusaurus/useIsBrowser';

function MyComponent() {
  const isBrowser = useIsBrowser();
  const location = isBrowser ? window.location.href : 'fetching location...';
  return <span>{location}</span>;
}
```

### `useEffect`

Lastly, you can put your logic in `useEffect()` to delay its execution until after first CSR. Use this if you are only performing render side-effects but don't depend the environment to _get_ data.

```jsx
function MyComponent() {
  useEffect(() => {
    console.log("I'm now in the browser");
  }, []);
  return <span>Some content...</span>;
}
```
