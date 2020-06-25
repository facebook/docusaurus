# Docusaurus Theme Bootstrap

The bootstrap theme for Docusaurus.

## Installation

Add `docusaurus/theme-bootstrap` to your package:

```bash
npm i @docusaurus/theme-bootstrao
# or
yarn add @docusaurus/theme-bootstrap
```

Modify your `docusaurus.config.js`:

```diff
module.exports = {
  ...
+ themes: ['@docusaurus/theme-bootstrap'],
  ...
}
```

## Swizzling components

```shell
$ npm swizzle @docusaurus/theme-bootstrap [component name]
```

All components used by this theme can be found [here](https://github.com/facebook/docusaurus/tree/master/packages/docusaurus-theme-bootstrap/src/theme)
