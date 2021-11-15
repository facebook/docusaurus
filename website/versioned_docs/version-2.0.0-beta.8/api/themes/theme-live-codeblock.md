---
id: theme-live-codeblock
title: '📦 theme-live-codeblock'
slug: '/api/themes/@docusaurus/theme-live-codeblock'
---

This theme provides a `@theme/CodeBlock` component that is powered by react-live. You can read more on [interactive code editor](../../guides/markdown-features/markdown-features-code-blocks.mdx#interactive-code-editor) documentation.

```bash npm2yarn
npm install --save @docusaurus/theme-live-codeblock
```

### Configuration {#configuration}

```jsx title="docusaurus.config.js"
module.exports = {
  plugins: ['@docusaurus/theme-live-codeblock'],
  themeConfig: {
    liveCodeBlock: {
      /**
       * The position of the live playground, above or under the editor
       * Possible values: "top" | "bottom"
       */
      playgroundPosition: 'bottom',
    },
  },
};
```
