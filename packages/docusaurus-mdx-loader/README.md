# `@docusaurus/mdx-loader`

Docusaurus webpack loader of [MDX](https://github.com/mdx-js/mdx)

The extra idea here is to simplify things by adding prismjs syntax highlighting by default through https://github.com/mapbox/rehype-prism and add the prism css theme import directly (only add the CSS import if target is 'web').


## Installation

```sh
yarn add @docusaurus/mdx-loader
```

## Usage
```js

// ...
module: {
  rules: [
    // ...
    {
        test: /\.css$/,
        // Make sure your webpack loader can import css files too
    },
    {
      test: /\.mdx?$/,
      use: [
        'babel-loader',
        {
            loader: '@docuaurus/mdx-loader',
            options: {
                // .. See options
            }
        }
      ]
    }
  ]
}
```

## Options

### `prismTheme`
  - Default: `prism-themes/themes/prism-atom-dark.css`;

This is the PrismJS theme CSS that will be imported. The supported themes are :
- prismjs/themes/XXXXXX.css (See https://github.com/PrismJS/prism/tree/master/themes)
- prism-themes/themes/XXXXXX.css (See https://github.com/PrismJS/prism-themes/tree/master/themes)