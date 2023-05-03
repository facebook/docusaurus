# `@docusaurus/plugin-ideal-image`

Docusaurus Plugin to generate an almost ideal image (responsive, lazy-loading, and low quality placeholder).

## Usage

See [plugin-ideal-image documentation](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-ideal-image).

### Important 

This plugin registers a [Webpack loader](https://webpack.js.org/loaders/) that changes the type of imported/require images:

- Before: `string`
- After: `{preSrc: string, src: import("@theme/IdealImage").SrcImage}`

