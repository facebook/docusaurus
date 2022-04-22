---
slug: '/api/misc/@docusaurus/eslint-plugin/no-untranslated-text'
---

# no-untranslated-text

Enforce text labels in JSX to be wrapped by translate calls.

When the [i18n feature](../../../i18n/i18n-introduction.md) is used, this rule is to ensure that all strings appearing on the website are being translated, so no string accidentally slips through untranslated.

## Rule Details {#details}

Examples of **incorrect** code for this rule:

```js
// Hello World is not translated
<Component>Hello World</Component>
```

Examples of **correct** code for this rule:

```js
// Hello World is translated
<Component>
  <Translate>Hello World</Translate>
</Component>
```

## Rule Configuration {#configuration}

Accepted fields:

<APITable>

| Option          | Type       | Default | Description                |
| --------------- | ---------- | ------- | -------------------------- |
| `ignoreStrings` | `string[]` | `[]`    | The strings to be ignored. |

</APITable>

## When Not To Use It {#when-not-to-use}

If you're not using the [i18n feature](../../../i18n/i18n-introduction.md) then you can disable this rule.

## Further Reading {#further-reading}

- https://docusaurus.io/docs/docusaurus-core#translate
- https://docusaurus.io/docs/docusaurus-core#translate-1
