---
id: typescript-support
title: TypeScript Support
---

## Setup {#setup}

Docusaurus supports writing and using TypeScript theme components. To start using TypeScript, add `@docusaurus/module-type-aliases` and some `@types` dependencies to your project:

```bash npm2yarn
npm install --save-dev typescript @docusaurus/module-type-aliases @types/react @types/react-router-dom @types/react-helmet @tsconfig/docusaurus
```

Then add `tsconfig.json` to your project root with the following content:

```json title="tsconfig.json"
{
  "extends": "@tsconfig/docusaurus/tsconfig.json",
  "include": ["src/"]
}
```

Docusaurus doesn't use this `tsconfig.json` to compile your project. It is added just for a nicer Editor experience, although you can choose to run `tsc` to type check your code for yourself or on CI.

Now you can start writing TypeScript theme components.

## Swizzling TypeScript theme components {#swizzling-typescript-theme-components}

For themes that supports TypeScript theme components, you can add the `--typescript` flag to the end of swizzling command to get TypeScript source code. For example, the following command will generate `index.tsx` and `styles.module.css` into `src/theme/Footer`.

```bash npm2yarn
npm run swizzle @docusaurus/theme-classic Footer -- --typescript
```

At this moment, the only official Docusaurus theme that supports TypeScript theme components is `@docusaurus/theme-classic`. If you are a Docusaurus theme package author who wants to add TypeScript support, see the [Lifecycle APIs docs](./lifecycle-apis.md#gettypescriptthemepath).
