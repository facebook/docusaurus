---
sidebar_position: 0
id: eslint-plugin
title: '📦 eslint-plugin'
slug: '/api/misc/@docusaurus/eslint-plugin'
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

| Name | Rules |
| :-: | --- |
| recommended | [`@docusaurus/string-literal-i18n-messages`](./eslint-plugin/string-literal-i18n-messages) |
| all | [`@docusaurus/no-untranslated-text`](./eslint-plugin/no-untranslated-text) <br/> [`@docusaurus/string-literal-i18n-messages`](./eslint-plugin/string-literal-i18n-messages) |

## Supported Rules

| Name | Description |
| --- | --- |
| [`@docusaurus/no-untranslated-text`](./eslint-plugin/no-untranslated-text) | Enforce text labels in JSX to be wrapped by translate calls |
| [`@docusaurus/string-literal-i18n-messages`](./eslint-plugin/string-literal-i18n-messages) | Enforce translate calls to be plain text labels |

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
