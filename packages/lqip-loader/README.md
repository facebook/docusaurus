# `@docusaurus/lqip-loader`

Low Quality Image Placeholders (LQIP) loader for webpack.

### Installation

```
npm install --save-dev @docusaurus/lqip-loader
OR 
yarn add docusaurus/lqip-loader
```

### Example

Generating Base64 & dominant colours palette for a jpeg image imported in your JS bundle:

> The large image file will be emitted & only 400byte of Base64 (if set to true in the loader options) will be bundled.

#### `webpack.config.js`

```js
{
  // OPTION A: default file-loader fallback
  test: /\.jpe?g$/,
  loaders: [
    {
      loader: '@docusaurus/lqip-loader',
      options: {
        path: '/media', // your image going to be in media folder in the output dir
        name: '[name].[ext]', // you can use [hash].[ext] too if you wish,
        base64: true, // default: true, gives the base64 encoded image
        palette: true // default: false, gives the dominant colours palette
      }
    }
  ]

  // OPTION B: Chained with your own url-loader or file-loader
  test: /\.(png|jpe?g)$/,
  loaders: [
    {
      loader: '@docusaurus/lqip-loader',
      options: {
        base64: true,
        palette: false
      }
    },
    {
      loader: 'url-loader',
      options: {
        limit: 8000
      }
    }
  ]
}
```

#### `your-app-module.js`

```js
import banner from './images/banner.jpg';

console.log(banner.preSrc);
// outputs: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhY....

// the object will have palette property, array will be sorted from most dominant colour to the least
console.log(banner.palette); // [ '#628792', '#bed4d5', '#5d4340', '#ba454d', '#c5dce4', '#551f24' ]

console.log(banner.src); // that's the original image URL to load later!
```

### Important note

To save memory and improve GPU performance, browsers (including Chrome started from 61.0.3163.38) will now render a slightly more crisp or pixelated Base64 encoded images. If you want the blur to be very intense (smooth), here's a fix!

```css
img {
  filter: blur(25px);
}
```

More history about the issue can be [found here](https://bugs.chromium.org/p/chromium/issues/detail?id=771110#c3) and [here](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/6L_3ZZeuA0M).

Alternatively, you can fill the container with a really cheap colour or gradient from the amazing palette we provide.

### Credits

This package has been imported from [`@endiliey/lqip-loader`](https://github.com/endiliey/lqip-loader) which was a fork of original [`lqip-loader`](https://github.com/zouhir/lqip-loader) created exclusively for Docusaurus.
