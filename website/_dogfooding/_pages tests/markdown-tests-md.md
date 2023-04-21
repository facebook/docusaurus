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

<BrowserWindow/>

export const answer = 42;

Test {xyz}

## Admonition

Admonitions still work

:::note[title]

note

:::

## Heading Id {#custom-heading-id}

Custom heading syntax `{#custom-heading-id}` still works
