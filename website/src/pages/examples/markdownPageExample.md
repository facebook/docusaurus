---
title: Markdown Page example title
description: Markdown Page example description
wrapperClassName: docusaurus-markdown-example
---

# Markdown page

This is a page generated from markdown to illustrate the Markdown page feature.

It supports all the regular MDX features, as you can see:

:::info

Useful information.

:::

```jsx live
function Button() {
  return (
    <button type="button" onClick={() => alert('hey')}>
      Click me!
    </button>
  );
}
```

### Using relative path

![](../../../static/img/docusaurus.png)

### Using absolute path

![](/img/docusaurus.png)

import Tabs from '@theme/Tabs';

import TabItem from '@theme/TabItem';

<Tabs defaultValue="apple" values={[ {label: 'Apple', value: 'apple'}, {label: 'Orange', value: 'orange'}, {label: 'Banana', value: 'banana'} ]}><TabItem value="apple">This is an apple 🍎</TabItem><TabItem value="orange">This is an orange 🍊</TabItem><TabItem value="banana">This is a banana 🍌</TabItem></Tabs>

## Import Mdx and Md files

```js
// *.md file
import Chapter1 from './_chapter1.md';

<Chapter1 />;

// *.mdx file
import Chapter2 from './_chapter2.mdx';

<Chapter2 />;
```

import Chapter1 from './\_chapter1.md';

<Chapter1/>

import Chapter2 from './\_chapter2.mdx';

<Chapter2/>

## Comments

MDX comments can be used with

```mdx
<!--

My comment

-->
```

See, nothing is displayed:

<!--

My comment

-->

## Import code block from source code file

import MyComponent from "./\_myComponent"

import BrowserWindow from '@site/src/components/BrowserWindow';

Let's say you have a React component.

You can import and use it in MDX:

```jsx title="myMarkdownFile.mdx"
import MyComponent from './myComponent';

<MyComponent />;
```

<BrowserWindow url="http://localhost:3000">

<MyComponent/>

</BrowserWindow>

But you can also display its source code directly in MDX, thanks to [Webpack raw-loader](https://webpack.js.org/loaders/raw-loader/)

```jsx title="myMarkdownFile.mdx"
import CodeBlock from '@theme/CodeBlock';

import MyComponentSource from '!!raw-loader!./myComponent';

<CodeBlock className="language-jsx">{MyComponentSource}</CodeBlock>;
```

import CodeBlock from "@theme/CodeBlock"

import MyComponentSource from '!!raw-loader!./\_myComponent';

<BrowserWindow url="http://localhost:3000">

<CodeBlock className="language-jsx">{MyComponentSource}</CodeBlock>

</BrowserWindow>
