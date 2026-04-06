# Docusaurus 2 Website

## Installation

1. `yarn install` in the root of the repo (one level above this directory).
1. In this directory, do `yarn start`.
1. A browser window will open up, pointing to the docs.

## Static build

```
npm run build
npm run serve
```

You may need to reduce the numbe of locales to avoid running out of memory. For example, `docusaurus.config.ts` can be modified like this:

```
            //[defaultLocale, 'fr', 'pt-BR', 'ko', 'zh-CN'], // this original line has been commented out
            [defaultLocale], // and replaced with this line
```
