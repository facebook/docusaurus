---
name: code-style
description: How to structure code so that humans can review it. Use whenever you write or modify code (packages, scripts, tests, website), before writing it.
---

# Code style

Humans review all the code of this repository: write code that is easy to read and understand, even if it requires introducing intermediate abstractions.

## Structure code as a tree

Readers should see the high-level picture first, and dive into the implementation details only if needed.

- Don't inline all the low-level calls sequentially in a single long function or script.
- Start with a short top-level function (`main()`, the exported function…) that reads like a summary of what the code does, delegating each step to a well-named function.
- Don't mix different levels of abstraction in the same function: a function either orchestrates high-level steps, or implements a low-level detail.
- Order the code top-down: high-level functions first, then the functions they call, then the low-level helpers.

```js
async function main() {
  const monorepo = await loadMonorepo();

  const errors = [
    ...checkCatalogsSplit(monorepo),
    ...checkTemplatesMatchCatalogs(monorepo),
  ];

  reportErrors(errors);
}
```

## Make the intent explicit

- Use well-named intermediate variables and functions to name what a piece of code computes, instead of long expressions or comments.
- Group related lines together with line breaks, and `{}` blocks when it helps.
- Prefer pure functions, that compute a result from their arguments, over functions with side effects. Keep side effects (I/O, logging, `process.exit()`…) at the edges, in the top-level functions.
- Keep data loading separate from the logic using it: load everything first, then pass the data to pure functions.

## Readability over micro-optimizations

Unless the code is on a hot path where performance matters, favor readability over micro-optimizations and clever one-liners. Iterating over a list several times with well-named steps is fine when the list is small.
