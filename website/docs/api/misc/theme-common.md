---
sidebar_position: 3
title: '📦 theme-common'
slug: '/api/misc/@docusaurus/theme-common'
---

Common code for Docusaurus themes.

:::caution Note about API publicity

Most of `@docusaurus/theme-common` is **internal code** for `@docusaurus/theme-classic` and future official themes, extracted for reusability. External theme authors are not required to use this package to achieve functionality (although are strongly advised to).

Most APIs may be refactored between minor versions—function parameters can change, APIs can come and go, semantics may vary. However, most APIs are still exposed to the end user through swizzling. For this reason, theme components dependent on fragile theme-common APIs will be unsafe for eject.

APIs listed below are fully stable and intended for public consumption. However, all theme-common APIs have JSDoc. In a proper editor, hovering over the imported identifier will show the explanation for the API and its semantics, which means even if they don't appear on this page, you shouldn't be lost when using them.

:::

## Contexts {#contexts}

### `useColorMode` {#useColorMode}

A React hook to access the color context. This hook returns an enum value of the current color mode and a callback to set a new color mode.

Signature:

```ts
type ColorMode = 'light' | 'dark';

declare function useColorMode(): {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode | null) => void;
};
```

Besides `light` and `dark`, `setColorMode` also accepts `null`, which will reset the color mode to the system theme (with `respectPrefersColorScheme: true`), or the default mode otherwise.

Usage example:

```jsx
import React from 'react';
// highlight-next-line
import {useColorMode} from '@docusaurus/theme-common';

const Example = () => {
  // highlight-next-line
  const {colorMode} = useColorMode();

  return <h1>Dark mode is now {colorMode === 'dark' ? 'on' : 'off'}</h1>;
};
```

`useColorMode` must be called from a child of the `ColorModeProvider`. For official Docusaurus themes, `ColorModeProvider` will be part of the `Layout`.

```jsx
import React from 'react';
import Layout from '@theme/Layout';

export default function ExamplePage() {
  return (
    <Layout>
      {/* highlight-next-line */}
      <Example />
    </Layout>
  );
}
```
