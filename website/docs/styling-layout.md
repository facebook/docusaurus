---
id: styling-layout
title: Styling and Layout
---

<!--
  TODO:
  - Infima
  - SASS
  - CSS in JS
-->

### CSS Modules

Docusaurus supports CSS Modules out of the box. To use CSS Modules, name your stylesheets as `*.modules.css` and import as objects to be consumed as class names.

```js
// CodeBlock.js
import React from 'react';
import styles from './styles.modules.css';

export default ({children}) => (
  <pre className={styles.codeBlock}>{children}</pre>
);
```

```css
/* styles.modules.css */
.codeBlock {
  font-family: monospace;
}
```

#### References

- https://www.gatsbyjs.org/docs/styling/
