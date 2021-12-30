---
id: browser-support
title: Browser support
---

Docusaurus allows sites to define the list of supported browsers through a [browserslist configuration](https://github.com/browserslist/browserslist).

## Purpose {#purpose}

Websites need to balance between backward compatibility and bundle size. As old browsers do not support modern APIs or syntax, more code is needed to implement the same functionality, penalizing all other users with increased site load time. As a tradeoff, the Docusaurus bundler only supports browser versions defined in the browser list.

The browser list by default is provided through the `package.json` file as a root `browserslist` field.

:::caution

On old browsers, the compiled output will use unsupported (too recent) JS syntax, causing React to fail to initialize and end up with a static website with only HTML/CSS and no JS.

:::

## Default values {#default-values}

Websites initialized with the default classic template has the following in `package.json`:

```json title="package.json"
{
  "name": "docusaurus",
  // ...
  // highlight-start
  "browserslist": {
    "production": [">0.5%", "not dead", "not op_mini all"],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
  // highlight-end
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

The output is all browsers supported in production. Below is the output in December 2021:

```text
and_chr 95
and_uc 12.12
chrome 95
chrome 94
chrome 93
chrome 92
edge 95
edge 94
firefox 93
firefox 92
ie 11
ios_saf 15
ios_saf 14.5-14.8
ios_saf 14.0-14.4
ios_saf 12.2-12.5
opera 79
safari 15
safari 14.1
safari 13.1
samsung 15.0
```

## Read more {#read-more}

You may wish to visit the [browserslist documentation](https://github.com/browserslist/browserslist/blob/main/README.md) for more specifications, especially the accepted [query values](https://github.com/browserslist/browserslist/blob/main/README.md#queries) and [best practices](https://github.com/browserslist/browserslist/blob/main/README.md#best-practices).
