# `@docusaurus/mdx-loader`

Docusaurus webpack loader of [MDX](https://github.com/mdx-js/mdx)

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
      test: /\.mdx?$/,
      use: [
        'babel-loader',
        {
            loader: '@docusaurus/mdx-loader',
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

### `rehypePlugins`
Array of rehype plugins to manipulate the MDXHAST

### `remarkPlugins`
Array of remark plugins to manipulate the MDXAST

