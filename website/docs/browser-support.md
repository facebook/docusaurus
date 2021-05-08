---
id: browser-support
title: Browser support
---

Docusaurus allows doc sites to define the list of supported browsers through some config:
https://github.com/browserslist/browserslist

## Purpose {#purpose}

Websites need to balance between backward compatibility and bundle size. As old browsers do not support modern APIs or syntax, more code is needed to implement the same functionality, penalizing all other users with increased site load times. As a tradeoff, the Docusaurus bundler only supports browser versions defined in the browser list.

The browser list by default is provided through the `package.json` file as a root `browserslist` field.

:::caution

On old browsers, the JS will use unsupported (too recent) JS syntax, causing React to fail to initialize and ending up with a static website with only HTML/CSS and no JS.

:::

## Default values {#default-values}

Websites initialized with the default classic template has the following in `package.json`:

```json {4-15} title="package.json"
{
  "name": "docusaurus",
  // ...
  "browserslist": {
    "production": [
      ">0.5%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  // ...
}
```

Explained in natural language, the browsers supported in production are those:

- With more than 0.5% of market share; _and_
- Has official support or updates in the past 24 months (the opposite of "dead"); _and_
- Is not Opera Mini.

And browsers used in development are:

- The latest version of Chrome _or_ Firefox _or_ Safari.

You can "eval" any config with the `browserlist` cli to obtain the actual list:

```bash
yarn browserslist --env="production"
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

## Accepted values {#accepted-values}

This section is adopted from [the browserslist documentation](https://github.com/browserslist/browserslist/blob/main/README.md#queries).

- `defaults`: Browserslist’s default browsers (`> 0.5%, last 2 versions, Firefox ESR, not dead`).
- `> 5%`: browsers versions selected by global usage statistics. `>=`, `<` and `<=` work too.
  - `> 5% in US`: uses USA usage statistics. It accepts [two-letter country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements).
  - `> 5% in alt-AS`: uses Asia region usage statistics. List of all region codes can be found at [`caniuse-lite/data/regions`](https://github.com/ben-eb/caniuse-lite/tree/master/data/regions).
  - `> 5% in my stats`: uses [custom usage data](https://github.com/browserslist/browserslist/blob/main/README.md#custom-usage-data).
  - `> 5% in browserslist-config-mycompany stats`: uses [custom usage data](https://github.com/browserslist/browserslist/blob/main/README.md#custom-usage-data) from `browserslist-config-mycompany/browserslist-stats.json`.
  - `cover 99.5%`: most popular browsers that provide coverage.
  - `cover 99.5% in US`: same as above, with [two-letter country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements).
  - `cover 99.5% in my stats`: uses [custom usage data](https://github.com/browserslist/browserslist/blob/main/README.md#custom-usage-data).
- `dead`: browsers without official support or updates for 24 months. Right now it is `IE 10`, `IE_Mob 11`, `BlackBerry 10`, `BlackBerry 7`, `Samsung 4` and `OperaMobile 12.1`.
- `last 2 versions`: the last 2 versions for -each- browser.
  - `last 2 Chrome versions`: the last 2 versions of Chrome browser.
  - `last 2 major versions` or `last 2 iOS major versions`: all minor/patch releases of last 2 major versions.
- `node 10` and `node 10.4`: selects latest Node.js `10.x.x` or `10.4.x` release.
  - `current node`: Node.js version used by Browserslist right now.
  - `maintained node versions`: all Node.js versions, which are [still maintained](https://github.com/nodejs/Release) by Node.js Foundation.
- `iOS 7`: the iOS browser version 7 directly.
  - `Firefox > 20`: versions of Firefox newer than 20. `>=`, `<` and `<=` work too. It also works with Node.js.
  - `ie 6-8`: selects an inclusive range of versions.
  - `Firefox ESR`: the latest [Firefox Extended Support Release](https://support.mozilla.org/en-US/kb/choosing-firefox-update-channel).
  - `PhantomJS 2.1` and `PhantomJS 1.9`: selects Safari versions similar to PhantomJS runtime.
- `extends browserslist-config-mycompany`: take queries from
  `browserslist-config-mycompany` npm package.
- `supports es6-module`: browsers with support for specific features. `es6-module` here is the `feat` parameter at the URL of the [Can I Use] page. A list of all available features can be found at [`caniuse-lite/data/features`](https://github.com/ben-eb/caniuse-lite/tree/master/data/regions).
- `browserslist config`: the browsers defined in Browserslist config. Useful in Differential Serving to modify user’s config like `browserslist config and supports es6-module`.
- `since 2015` or `last 2 years`: all versions released since year 2015 (also `since 2015-03` and `since 2015-03-10`).
- `unreleased versions` or `unreleased Chrome versions`: alpha and beta versions.
- `not ie <= 8`: exclude IE 8 and lower from previous queries.

You can combine multiple queries with combiners. Start with a single query and then combine the queries to get the final list.

An `or` combiner can use the keyword `or` as well as `,`. `last 1 version or > 1%` is equal to `last 1 version, > 1%`.

An `and` combiner performs an intersection of all the previous queries: `last 1 version or chrome > 75 and > 1%` will select (`browser last version` or `Chrome since 76`) and `more than 1% marketshare`.

A `not` combiner performs a relative complement: `> 0.5%, not dead` eliminates the browsers that are `dead` from the ones selected by `> 0.5%`. Obviously you can _not_ start with a `not` combiner, since there is no left-hand side query to combine it with. The left-hand is always resolved as `and` combiner even if `or` is used (this is an API implementation specificity).

## Choosing a value {#choosing-a-value}

This section is adopted from [the browserslist documentation](https://github.com/browserslist/browserslist/blob/main/README.md#best-practices).

- If you want to change the default set of browsers, we recommend combining `last 2 versions`, `not dead` with a usage number like `> 0.2%`. This is because `last n versions` on its own does not add popular old versions, while only using a percentage above `0.2%` will in the long run make popular browsers even more popular. We might run into a monopoly and stagnation situation, as we had with Internet Explorer 6. Please use this setting with caution.
- Select browsers directly (`last 2 Chrome versions`) only if you are making a web app for a kiosk with one browser (which is very unlikely for users of Docusaurus). There are a lot of browsers on the market. If you are making general web app you should respect browsers diversity.
- Don’t remove browsers just because you don’t know them. Opera Mini has 100 million users in Africa and it is more popular in the global market than Microsoft Edge. Chinese QQ Browsers has more market share than Firefox and desktop Safari combined.

You may always use the `browserslist` cli to test your query results.
