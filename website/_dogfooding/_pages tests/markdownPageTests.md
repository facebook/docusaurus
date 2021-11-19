<!-- This file has a leading comment.
By many standards the following is not valid front matter anymore,
but we are still able to parse it because of a custom frontMatterParser. -->
<!-- This is actually bad practice because most parsers don't strip leading comments. -->
<!-- Any linter rule demanding copyright notices at the very top should be doomed to death. -->

## <!-- prettier-ignore-start -->

title: Markdown Page tests title description: Markdown Page tests description wrapperClassName: docusaurus-markdown-example

---

<!-- prettier-ignore-end -->

# Markdown page tests

This is a page generated from markdown to illustrate the Markdown page feature and test some edge cases.

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

### Using absolute path

![](/img/docusaurus.png)

### Tab

import Tabs from '@theme/Tabs';

import TabItem from '@theme/TabItem';

<Tabs defaultValue="apple" values={[ {label: 'Apple', value: 'apple'}, {label: 'Orange', value: 'orange'}, {label: 'Banana', value: 'banana'} ]}><TabItem value="apple">This is an apple 🍎</TabItem><TabItem value="orange">This is an orange 🍊</TabItem><TabItem value="banana">This is a banana 🍌</TabItem></Tabs>

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

import MyComponent from "@site/src/pages/examples/\_myComponent"

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

import MyComponentSource from '!!raw-loader!@site/src/pages/examples/\_myComponent';

<BrowserWindow url="http://localhost:3000">

<CodeBlock className="language-jsx">{MyComponentSource}</CodeBlock>

</BrowserWindow>

## Test

```jsx live
function Demo() {
  React.useEffect(() => console.log('mount'), []);
  return null;
}
```

## Code block test

```js title="Title"
function Clock(props) {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    var timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }

  return (
    <div>
      <h2>It is {date.toLocaleTimeString()}.</h2>
      // highlight-start
      {/* prettier-ignore */}
      long long long long long long long long long long long long line
      {/* prettier-ignore */}
      // highlight-end
    </div>
  );
}
```

```jsx live
function Clock(props) {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    var timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }

  return (
    <div>
      <h2>It is {date.toLocaleTimeString()}.</h2>
    </div>
  );
}
```

<CodeBlock className="language-yaml" title="test">
  test
</CodeBlock>

<code>test</code>

## direct using of `pre`

<pre>test</pre>

<!-- Multi-line text inside `pre` will turn into one-liner, but it's okay (https://github.com/mdx-js/mdx/issues/1095) -->
<pre>
1
2
3
</pre>

## Custom heading id {#custom}

## Children elements inside pre/code elements

See https://github.com/facebook/docusaurus/pull/1584

<pre><code>
  <BrowserWindow url="http://localhost:3000" >
    Lol bro
  </BrowserWindow>
</code></pre>

<code>
  <BrowserWindow url="http://localhost:3000" >
    Lol bro
  </BrowserWindow>
</code>

## Pipe

Code tag + double pipe: <code>&#124;&#124;</code>

Code tag + double pipe: <code>||</code>

## Images edge cases

![](/新控制器空间/图片.png)

![](/4/图片.png)

![](/4/docu.png)
