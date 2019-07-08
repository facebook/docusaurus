---
id: styling-layout
title: Styling and Layout
---

## Traditional CSS

If you're using `@docusaurus/preset-classic`, you can create your own CSS files (e.g. `src/css/custom.css`) and import them globally by passing it as an option into the preset.

```diff
// docusaurus.config.js
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
+       theme: {
+         customCss: require.resolve('./src/css/custom.css'),
+       },
      },
    ],
  ],
};
```

Any CSS you write within that file will be available globally and can be referenced directly using string literals. This is the most traditional approach to writing CSS and is fine for small websites that do not have much customization.

## Styling your Site with Infima

`@docusaurus/preset-classic` uses [Infima CSS](https://infima-dev.netlify.com/) as the underlying styling framework. Infima provides powerful and flexible layout and styling suitable for content-centric websites. For more details of Infima, check out [Infima docs](https://infima-dev.netlify.com/).

When you `init` your Docusaurus 2 project, the website will be generated with basic Infima stylesheets and default styling. You may customize the styling by editing the `src/css/custom.css` file.

```css
/**
 * src/css/custom.css
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

<!-- TODO need more refinement here -->

## Styling Approaches

A Docusaurus site is a single-page React application. You can style it the way you style React apps.

There are a few approaches/frameworks which will work, depending on your preferences and the type of website you are trying to build. Websites that are highly interactive and behave more like web apps will benefit from a more modern styling approaches that co-locate styles with the components. Component styling can also be particularly useful when you wish to customize or swizzle a component.

### Global Styles

This is the most traditional way of styling that most developers (including non-front end developers) would be familiar with.

Assuming you are using `@docusaurus/preset-classic` and `src/css/custom.css` was passed in to the preset config, styles inside that file would be available globally.

```css
/* src/css/custom.css */
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
