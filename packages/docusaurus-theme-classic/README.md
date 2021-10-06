# Docusaurus Theme Classic

The classic theme for Docusaurus.

## Installation

Add `docusaurus/theme-classic` to your package:

```bash
npm i @docusaurus/theme-classic
# or
yarn add @docusaurus/theme-classic
```

Modify your `docusaurus.config.js`:

```diff
module.exports = {
  ...
+ themes: ['@docusaurus/theme-classic'],
  ...
}
```

## Swizzling components

```shell
$ npm swizzle @docusaurus/theme-classic [component name]
```

All components used by this theme can be found [here](https://github.com/facebook/docusaurus/tree/main/packages/docusaurus-theme-classic/src/theme)
