---
id: plugin-ideal-image
title: '📦 plugin-ideal-image'
slug: '/api/plugins/@docusaurus/plugin-ideal-image'
---

Docusaurus Plugin to generate an almost ideal image (responsive, lazy-loading, and low quality placeholder) **in the production builds**.

## Installation

```bash npm2yarn
npm install --save @docusaurus/plugin-ideal-image
```

## Configuration

Modify your `docusaurus.config.js`

```diff
module.exports = {
  ...
+ plugins: ['@docusaurus/plugin-ideal-image'],
  ...
}
```

## Usage

This plugin supports the PNG, GIF and JPG formats only.

```jsx
import Image from '@theme/IdealImage';
import thumbnail from './path/to/img.png';

// your React code
<Image img={thumbnail} />

// or
<Image img={require('./path/to/img.png')} />
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | `ideal-img/[name].[hash:hex:7].[width].[ext]` | Filename template for output files. |
| `sizes` | `array` | _original size_ | Specify all widths you want to use. If a specified size exceeds the original image's width, the latter will be used (i.e. images won't be scaled up). |
| `size` | `integer` | _original size_ | Specify one width you want to use; if the specified size exceeds the original image's width, the latter will be used (i.e. images won't be scaled up) |
| `min` | `integer` |  | As an alternative to manually specifying `sizes`, you can specify `min`, `max` and `steps`, and the sizes will be generated for you. |
| `max` | `integer` |  | See `min` above |
| `steps` | `integer` | `4` | Configure the number of images generated between `min` and `max` (inclusive) |
| `quality` | `integer` | `85` | JPEG compression quality |
