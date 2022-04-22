---
slug: '/api/misc/@docusaurus/eslint-plugin/string-literal-i18n-messages'
---

# string-literal-i18n-messages

Enforce translate APIs to be called on plain text labels.

This is to ensure that static extraction of the text will work so it can be translatable. In-string dynamic placeholders are also possible using the values object.

## Rule Details {#details}

Examples of **incorrect** code for this rule:

```js
const text = 'Some text to be translated'

// Invalid <Translate> child
<Translate>{text}</Translate>

// Invalid message attribute
translate({message: text})
```

Examples of **correct** code for this rule:

```js
// Valid <Translate> child
<Translate>Some text to be translated</Translate>

// Valid message attribute
translate({message: 'Some text to be translated'})

// Valid <Translate> child using values object as prop
<Translate values={{firstName: 'Sébastien'}}>
  {'Welcome, {firstName}! How are you?'}
</Translate>

// Valid message attribute using values object as second argument
translate({message: 'The logo of site {siteName}'}, {siteName: 'Docusaurus'})
```

## Further Reading {#further-reading}

- https://docusaurus.io/docs/docusaurus-core#translate
- https://docusaurus.io/docs/docusaurus-core#translate-1
