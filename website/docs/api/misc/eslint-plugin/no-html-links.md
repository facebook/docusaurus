---
slug: /api/misc/@docusaurus/eslint-plugin/no-html-links
---

# no-html-links

Ensure that docusaurus `<Link>` is used instead of `<a>` tags.

## Rule Details {#details}

Examples of **incorrect** code for this rule:

```html
<a href="/page">go to page!</a>
```

Examples of **correct** code for this rule:

```js
//
import Link from '@docusaurus/Link';

<Link to="/page">go to page!</Link>;
```
