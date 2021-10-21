---
id: browser-support
title: Browser support
---

Docusaurus allows sites to define the list of supported browsers through a [browserslist configuration](https://github.com/browserslist/browserslist).

## Purpose {#purpose}

Websites need to balance between backward compatibility and bundle size. As old browsers do not support modern APIs or syntax, more code is needed to implement the same functionality, penalizing all other users with increased site load time. As a tradeoff, the Docusaurus bundler only supports browser versions defined in the browser list.

The browser list by default is provided through the `package.json` file as a root `browserslist` field.

:::caution

On old browsers, the compiled output will use unsupported (too recent) JS syntax, causing React to fail to initialize and ending up with a static website with only HTML/CSS and no JS.

:::

## Default values {#default-values}

Websites initialized with the default classic template has the following in `package.json`:

```json {4-11} title="package.json"
{
  "name": "docusaurus",
  // ...
  "browserslist": {
    "production": [">0.5%", "not dead", "not op_mini all"],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
  // ...
}
```

Explained in natural language, the browsers supported in production are those:

- With more than 0.5% of market share; _and_
- Has official support or updates in the past 24 months (the opposite of "dead"); _and_
- Is not Opera Mini.

And browsers used in development are:

- The latest version of Chrome _or_ Firefox _or_ Safari.

You can "evaluate" any config with the `browserlist` cli to obtain the actual list:

```bash
npx browserslist --env="production"
```

The output are all browsers supported in production. Below is the output in May, 2021:

```text
and_chr 89
and_uc 12.12
chrome 89
chrome 88
chrome 87
edge 89
edge 88
firefox 86
ie 11
ios_saf 14.0-14.5
ios_saf 13.4-13.7
safari 14
safari 13.1
samsung 13.0
```

## Read more {#read-more}

You may wish to visit the [browserslist documentation](https://github.com/browserslist/browserslist/blob/main/README.md) for more specifications, especially the accepted [query values](https://github.com/browserslist/browserslist/blob/main/README.md#queries) and [best practices](https://github.com/browserslist/browserslist/blob/main/README.md#best-practices).
