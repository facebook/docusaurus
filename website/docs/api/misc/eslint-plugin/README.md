---
sidebar_position: 0
id: eslint-plugin
title: '📦 eslint-plugin'
slug: '/api/misc/@docusaurus/eslint-plugin'
---

import APITable from '@site/src/components/APITable';

[ESLint](https://eslint.org/) is a tool that statically analyzes your code and reports problems or suggests best practices through editor hints and command line. Docusaurus provides an ESLint plugin to enforce best Docusaurus practices.

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

| Name | Rules |
| :-: | --- |
| recommended | [`@docusaurus/string-literal-i18n-messages`](./string-literal-i18n-messages.md) |
| all | [`@docusaurus/no-untranslated-text`](./no-untranslated-text.md) <br/> [`@docusaurus/string-literal-i18n-messages`](./string-literal-i18n-messages.md) |

## Supported Rules

| Name | Description |
| --- | --- |
| [`@docusaurus/no-untranslated-text`](./no-untranslated-text.md) | Enforce text labels in JSX to be wrapped by translate calls |
| [`@docusaurus/string-literal-i18n-messages`](./string-literal-i18n-messages.md) | Enforce translate APIs to be called on plain text labels |

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
