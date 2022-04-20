---
sidebar_position: 6
id: eslint-plugin
title: '📦 eslint-plugin'
slug: '/api/plugins/@docusaurus/eslint-plugin'
---

import APITable from '@site/src/components/APITable';

Docusaurus eslint plugin to ensure best Docusaurus practices.

## Installation

```bash npm2yarn
npm install --save-dev @docusaurus/eslint-plugin
```

## Usage

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

## Supported Configs

### recommended{#config-recommended}

#### Rules:{#config-recommended-rules}

- @docusaurus/string-literal-i18n-messages

### all{#config-all}

#### Rules:{#config-all-rules}

- @docusaurus/string-literal-i18n-messages
- @docusaurus/no-untranslated-text

## Supported Rules

### string-literal-i18n-messages{#rule-string-literal-i18n-messages}

enforce translate calls to be plain text labels (string-literal-i18n-messages)

Ensures that `<Translate>` children and the message attribute of `translate` function calls are hardcoded strings.

This is to ensure that static extraction of the text will work so it can be translatable. In-string dynamic placeholders are also possible using the values object.

#### Rule Details{#rule-string-literal-i18n-messages-details}

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

#### Further Reading{#rule-string-literal-i18n-messages-further-reading}

- https://docusaurus.io/docs/docusaurus-core#translate
- https://docusaurus.io/docs/docusaurus-core#translate-1

### no-untranslated-text{#rule-no-untranslated-text}

enforce text labels in JSX to be wrapped by translate calls (no-untranslated-text)

Ensures that all text labels in JSX are wrapped by `<Translate>` components.

When the [i18n feature](https://docusaurus.io/docs/i18n/introduction) is used, this rule is to ensure that all strings appearing on the website are being translated, so no string accidentally slips through untranslated.

#### Rule Details{#rule-no-untranslated-text-details}

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

#### Rule Configuration{#rule-no-untranslated-text-configuration}

Accepted fields:

<APITable>

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `ignoreStrings` | `string[]` | `['·', '—', '×']` | The strings to be ignored. |

</APITable>

#### When Not To Use It{#rule-no-untranslated-text-when-not-to-use}

If you're not using the [i18n feature](https://docusaurus.io/docs/i18n/introduction) then you can disable this rule.

#### Further Reading{#rule-no-untranslated-text-further-reading}

- https://docusaurus.io/docs/docusaurus-core#translate
- https://docusaurus.io/docs/docusaurus-core#translate-1

## Example configuration

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
