---
id: typescript-support
title: TypeScript Support
---

## Setup

Docusaurus supports writing and using TypeScript theme components. To start using TypeScript, add `@docusaurus/module-type-aliases` to your project:

```bash
npm install --save-dev typescript @docusaurus/module-type-aliases
```

Then add `tsconfig.json` to your project root with following content:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "allowJs": true,
    "esModuleInterop": true,
    "jsx": "react",
    "lib": ["DOM"],
    "noEmit": true,
    "noImplicitAny": false
  },
  "include": ["src/"]
}
```

Docusaurus doesn't use this `tsconfig.json` to compile your TypeScript. It is added just for a nicer Editor experience, although you can choose to run `tsc --noEmit` to type check your code for yourself.

Then add `types.d.ts` in your `src` folder with the following content:

```ts title="src/types.d.ts"
/// <reference types="@docusaurus/module-type-aliases" />
```

This file makes TypeScript recognize various Docusaurus specific webpack aliases like `@theme`, `@docusaurus`, `@generated`.

Now you can start writing TypeScript theme components.

## Swizzling TypeScript theme components

For themes that supports TypeScript theme components, you can add the `--typescript` flag to the end of swizzling command to get TypeScript source code. For example, the following command will generate `index.tsx` and `styles.module.css` into `src/theme/Footer`.

```bash npm2yarn
npm run swizzle @docusaurus/theme-classic Footer --typescript
```

At this moment, the only official Docusaurus theme that supports TypeScript theme components is `@docusaurus/theme-classic`. If you are a Docusaurus theme package author who wants to add TypeScript support, see the [Lifecycle APIs docs](./lifecycle-apis#gettypescriptthemepath).
