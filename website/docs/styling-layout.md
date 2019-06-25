---
id: styling-layout
title: Styling and Layout
---

## Styling your site with Infima

The classic template of Docusaurus uses [Infima](https://infima-dev.netlify.com/) as the underlying styling framework. Infima provides powerful and flexible layout and styling for content-centric websites. For more details of Infima, check out [Infima docs](https://infima-dev.netlify.com/).

When you `init` your Docusaurus 2 project, the website will be generated with basic Infima stylesheets and default styling. You may customize the styling by editing the `custom.css` file under your site's `/css` directory:

```css
/**
 * /css/custom.css
 * You can override the default Infima variables here. 
 * this is not a complete list of --ifm- variables
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

## Styling your components

Your whole Docusaurus 2 site is a React app. Any styling that works with React will work with your site.

Component styling can be particularly useful when you wish to customize or swizzle a component. And there are a few frameworks we recommend that work particularly well with components.

### With CSS Modules

To style your components using CSS Modules, name your stylesheets as `xxx.module.css`. The build step will pick up such files as CSS Module stylesheets. Then, you may get the generated class names from the module:

```js
import styles from './styles.module.css';

export default () => (
  <main className={styles.main}>
    <h1 className={styles.heading}>Hello!</h1>
    <article className={styles.docContent}>My doc</article>
  </main>
);
```

### With CSS-in-JS Frameworks

This section is a work in progress. [Welcoming PRs](https://github.com/facebook/Docusaurus/pulls).
