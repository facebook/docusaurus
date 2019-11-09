---
id: styling-layout
title: Styling and Layout
description: A Docusaurus site is a pre-rendered single-page React application. You can style it the way you style React apps.
---

## Traditional CSS

If you're using `@docusaurus/preset-classic`, you can create your own CSS files (e.g. `/src/css/custom.css`) and import them globally by passing it as an option into the preset.

```js {8-10}
// docusaurus.config.js
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
```

Any CSS you write within that file will be available globally and can be referenced directly using string literals. This is the most traditional approach to writing CSS and is fine for small websites that do not have much customization.

## Styling your site with Infima

`@docusaurus/preset-classic` uses [Infima](https://facebookincubator.github.io/infima/) as the underlying styling framework. Infima provides flexible layout and common UI components styling suitable for content-centric websites (blogs, documentation, landing pages). For more details, check out the [Infima website](https://facebookincubator.github.io/infima/).

When you `init` your Docusaurus 2 project, the website will be generated with basic Infima stylesheets and default styling. You may customize the styling by editing the `src/css/custom.css` file.

```css
/**
 * /src/css/custom.css
 * You can override the default Infima variables here.
 * Note: this is not a complete list of --ifm- variables.
 */
:root {
  --ifm-color-primary: #25c2a0;
  --ifm-color-primary-dark: rgb(33, 175, 144);
  --ifm-color-primary-darker: rgb(31, 165, 136);
  --ifm-color-primary-darkest: rgb(26, 136, 112);
  --ifm-color-primary-light: rgb(70, 203, 174);
  --ifm-color-primary-lighter: rgb(102, 212, 189);
  --ifm-color-primary-lightest: rgb(146, 224, 208);
}
```

Infima uses 7 shades of each color. We recommend using [ColorBox](https://www.colorbox.io/) to find the different shades of colors for your chosen primary color. In future, we will provide an easier way to generate the different shades of colors.

<!-- TODO need more refinement here -->

## Styling approaches

A Docusaurus site is a single-page React application. You can style it the way you style React apps.

There are a few approaches/frameworks which will work, depending on your preferences and the type of website you are trying to build. Websites that are highly interactive and behave more like web apps will benefit from a more modern styling approaches that co-locate styles with the components. Component styling can also be particularly useful when you wish to customize or swizzle a component.

### Global styles

This is the most traditional way of styling that most developers (including non-front end developers) would be familiar with.

Assuming you are using `@docusaurus/preset-classic` and `/src/css/custom.css` was passed in to the preset config, styles inside that file would be available globally.

```css
/* /src/css/custom.css */
.purple-text {
  color: rebeccapurple;
}
```

```jsx
function MyComponent() {
  return (
    <main>
      <h1 className="purple-text">Purple Heading!</h1>
    </main>
  );
}
```

### CSS Modules

To style your components using [CSS Modules](https://github.com/css-modules/css-modules), name your stylesheet files with the `.module.css` suffix (e.g. `welcome.module.css`). webpack will load such CSS files as CSS modules and you have to reference the class names from the imported CSS module (as opposed to using plain strings). This is similar to the convention used in [Create React App](https://facebook.github.io/create-react-app/docs/adding-a-css-modules-stylesheet).

```css
/* styles.module.css */
.main {
  padding: 12px;
}

.heading {
  font-weight: bold;
}

.contents {
  color: #ccc;
}
```

```jsx
import styles from './styles.module.css';

function MyComponent() {
  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Hello!</h1>
      <article className={styles.contents}>Lorem Ipsum</article>
    </main>
  );
}
```

The class names which will be processed by webpack into a globally unique class name during build.

### CSS-in-JS

_This section is a work in progress. [Welcoming PRs](https://github.com/facebook/docusaurus/issues/1640)._
