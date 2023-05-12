---
title: Markdown Page tests title
description: Markdown Page tests description
wrapperClassName: docusaurus-markdown-example
---

# Markdown .md tests

This file should be interpreted in a more CommonMark compliant way

## Comment

Html comment: <!-- comment -->

<!-- prettier-ignore -->
MDX comment: {/* comment */}

## JSX syntax

import BrowserWindow from '@site/src/components/BrowserWindow';

<BrowserWindow>

BrowserWindow content

</BrowserWindow>

export const answer = 42;

Test {xyz}

## Admonition

Admonitions still work

:::note[title]

note

:::

## Heading Id {#custom-heading-id}

Custom heading syntax `{#custom-heading-id}` still works

---

## HTML

### Styling

<span style="color: blue;">blue span</span>

<p style="color: green;">green p</p>

<button style="color: red;">red button</button>

<div style="border: solid; background-color: grey; color: lime; padding: 10px">
  lime <span style="color: red; margin: 10px;">red</span>
</div>

<br/>

### Embeds

#### Closed image tag:

<img src="/img/docusaurus.png"/>

<br/>

#### Unclosed image tag:

<img src="/img/docusaurus.png">

<br/>

### Iframe

<iframe src="/" style="width: 100%; height: 300px; border: solid red thick;"></iframe>

<br/>

### Security

```md
<p>
  When pressing this button, no alert should be printed
  <button onClick="alert('unsafe');">Click me</button>
</p>
```

<p>
  When pressing this button, no alert should be printed
  <button onClick="alert('unsafe');">Click me</button>
</p>
