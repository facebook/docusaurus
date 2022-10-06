---
slug: /api/misc/@docusaurus/eslint-plugin/no-html-links
---

# no-html-links

Ensure that docusaurus `<Link>` is used instead of `<a>` tags.

## Rule Details {#details}

Examples of **incorrect** code for this rule:

```html
<a href="/page">go to page!</a>

<a href="https://twitter.com/docusaurus" target="_blank">Twitter</a>
```

Examples of **correct** code for this rule:

```js
import Link from '@docusaurus/Link'

<Link to="/page">go to page!</Link>

<Link to="https://twitter.com/docusaurus">Twitter</Link>
```

## Rule Configuration {#configuration}

Accepted fields:

```mdx-code-block
<APITable>
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `ignoreFullyResolved` | `boolean` | `false` | Set to true will not report any `<a>` tags with absolute URLs. |

```mdx-code-block
</APITable>
```
