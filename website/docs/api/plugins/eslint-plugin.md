---
sidebar_position: 6
id: eslint-plugin
title: '📦 eslint-plugin'
slug: '/api/plugins/@docusaurus/eslint-plugin'
---

import APITable from '@site/src/components/APITable';

Docusaurus eslint plugin to ensure best Docusaurus practices.

# Installation {#installation}

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i -D eslint
```

Next, install `@docusaurus/eslint-plugin`:

```bash npm2yarn
npm i -D @docusaurus/eslint-plugin
```

# Usage {#usage}

Add `@docusaurus` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["@docusaurus"]
}
```

Then, you can extend one of the configs (e.g. the `recommended` config):

```json
{
  "extends": ["plugin:@docusaurus/recommended"]
}
```

Each config contains a set of rules. For more fine-grained control, you can also configure the rules you want to use directly:

```json
{
  "rules": {
    "@docusaurus/string-literal-i18n-messages": "error",
    "@docusaurus/no-untranslated-text": "warn"
  }
}
```

# Supported Configs{#supported-configs}

## recommended

### Rules:

- @docusaurus/string-literal-i18n-messages

## all

### Rules:

- @docusaurus/string-literal-i18n-messages
- @docusaurus/no-untranslated-text

# Supported Rules{#supported-rules}

## string-literal-i18n-messages

### enforce translate calls to be plain text labels (string-literal-i18n-messages)

Ensures that `<Translate>` children and the message attribute of `translate` function calls are hardcoded strings.

This is to ensure that static extraction of the text will work so it can be translatable. In-string dynamic placeholders are also possible using the values object.

### Rule Details

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

### Further Reading

- https://docusaurus.io/docs/docusaurus-core#translate
- https://docusaurus.io/docs/docusaurus-core#translate-1

## no-untranslated-text

### enforce text labels in JSX to be wrapped by translate calls (no-untranslated-text)

Ensures that all text labels in JSX are wrapped by `<Translate>` components.

When the [i18n feature](https://docusaurus.io/docs/i18n/introduction) is used, this rule is to ensure that all strings appearing on the website are being translated, so no string accidentally slips through untranslated.

### Rule Details

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

### Rule Configuration

Accepted fields:

<APITable>

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `ignoreStrings` | `string[]` | `['·', '—', '×']` | The strings to be ignored. |

</APITable>

### When Not To Use It

If you're not using the [i18n feature](https://docusaurus.io/docs/i18n/introduction) then you can disable this rule.

### Further Reading

- https://docusaurus.io/docs/docusaurus-core#translate
- https://docusaurus.io/docs/docusaurus-core#translate-1

# Example configuration {#ex-config}

Here's an example configuration:

```js title="[.eslintrc.js]"
module.exports = {
  extends: ['plugin:@docusaurus/all'],
  plugins: ['@docusaurus'],
  rules: {
    '@docusaurus/no-untranslated-text': [
      'warn',
      {ignoreStrings: ['·', '—', '×']},
    ],
  },
};
```
