# `@docusaurus/eslint-plugin`

Docusaurus specific linting rules for eslint

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i -D eslint
```

Next, install `@docusaurus/eslint-plugin`:

```sh
npm i -D @docusaurus/eslint-plugin
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

For more fine-grained control, you can also configure the rules you want to use:

```json
{
  "rules": {
    "@docusaurus/string-literal-i18n-messages": "error",
    "@docusaurus/no-untranslated-text": "warn"
  }
}
```

## Supported Configs

- recommended
- all

## Supported Rules

- string-literal-i18n-messages
- no-untranslated-text
