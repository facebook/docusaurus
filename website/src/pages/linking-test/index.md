---
title: File Path Linking Test
description: Test pages to verify markdown file path links work in the pages plugin
---

# File Path Linking Test

This folder contains test pages that verify markdown file path links work correctly in the `@docusaurus/plugin-content-pages`.

## What this tests

The pages plugin now supports linking between markdown pages using file paths (like the docs plugin does). For example:

```md
[Link to another page](./other-page.md)
```

## Test Pages

Try navigating between these pages using the file path links:

- [Page A](./page-a.md) - The starting point
- [Page B](./page-b.md) - Links back to Page A
- [Nested Page C](./nested/page-c.md) - Tests `../` relative paths

## How it works

The plugin maintains a mapping from source file paths to permalinks. When processing markdown links, it resolves file paths like `./page-b.md` to the correct permalink like `/linking-test/page-b`.
