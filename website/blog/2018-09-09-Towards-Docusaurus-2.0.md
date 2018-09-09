---
title: Towards Docusaurus 2.0
author: Endilie Yacop Sucipto
authorTitle: Maintainer of Docusaurus
authorURL: https://github.com/endiliey
authorImageURL: https://avatars1.githubusercontent.com/u/17883920?s=460&v=4
authorTwitter: endiliey
---

Docusaurus was [officially announced](https://docusaurus.io/blog/2017/12/14/introducing-docusaurus) over nine months ago as a way to easily build open source website. Since then, it has amassed ~8,600 GitHub Stars and is used by many popular open source projects such as [React Native](https://facebook.github.io/react-native/), [Babel](https://babeljs.io/), [Jest](https://jestjs.io/), [Reason](https://reasonml.github.io/) and [Prettier](https://prettier.io/).

There is a saying that the very best software is constantly evolving, and the very worst isn't.
In case you didn't know already, we've been planning & working on Docusaurus 2.0 🎉. 

<!--truncate-->

## Introduction

It all started with this [RFC issue](https://github.com/facebook/Docusaurus/issues/789) opened by [yangshun](https://github.com/yangshun) nearing the end of last June.

<blockquote class="embedly-card"><h4><a href="https://github.com/facebook/Docusaurus/issues/789">[RFC] Docusaurus v2 · Issue #789 · facebook/Docusaurus</a></h4><p>These are some of the problems I'm seeing in Docusaurus now and also how we can address them in v2. A number of the ideas here were inspired by VuePress and other static site generators. In the current static site generators ecosystem, t...</p></blockquote>

Since most of the problems are already mentioned in the issue, I will only go through some of the problems we are facing and how we are going to address it in Docusaurus 2.0.

## Infrastructure

### Content

A Docusaurus 1.0 website is in fact just a pure rendered static HTML. Despite using React, we are not utilizing the **view library features** like *state* which allows dynamic and interactive pages. React is only used as a templating engine for static content and interactivity has to be added through script tags and `dangerouslySetInnerHTML`.

In addition, there isn't any easy way to change how Docusaurus load content. For example, adding CSS preprocessor such as SASS and LESS is only possible by submitting a pull request to Docusaurus repository itself or forking it.

For Docusaurus 2.0, we are using [Webpack](https://webpack.js.org/) as a module bundler & we are changing the way we serve content. Adding CSS preprocessor will be as easy as adding a webpack loader. Instead of a pure static HTML, **during build time we will create a server-rendered version of the app** and render the corresponding HTML. Thus, Docusaurus site is essentially an isomorphic/universal application. This approach is heavily inspired by [Gatsby](https://github.com/gatsbyjs/gatsby).


### Versioning

If you've been using Docusaurus for a while, you might notice that the Docusaurus creates versioned docs **only and if only** the docs content are **different.**

For example, if we have **`docs/hello.md`**:

```text
---
id: hello
title: hello
---
Hello world !
```


And then **we cut version 1.0.0,** Docusaurus will create **`versioned_docs/version-1.0.0/hello.md`**:

```text
---
id: version-1.0.0-hello
title: hello
original_id: hello
---
Hello world !
```

However, when we try to cut version 2.0.0 again, Docusaurus will not create any versioned docs again since there are no changes in the document. **`versioned_docs/version-2.0.0/hello.md`** simply does not exist.

This is very confusing for user, if they want to edit the 2.0.0 docs, they have to edit the **`versioned_docs/version-1.0.0/hello.md`** or manually add **`versioned_docs/version-2.0.0/hello.md`.** [Here is a real scenario in Jest.](https://github.com/facebook/jest/pull/6758#issuecomment-408274413)
This could potentially lead to unwanted bugs.

In addition, this adds complexity on the codebase (for doing all the version fallback). And during the build time, Docusaurus had to replace the linking to the correct version.
This is also the cause of [#845](https://github.com/facebook/Docusaurus/issues/845).

For Docusaurus 2.0, **every time we cut a new version, we will instead take a snapshot of all the docs**. It doesn't care if the content of the document has changed or not. This is a space complexity trade-offs for a better developer & user experience.


### Translation

Docusaurus allows for easy translation functionality by using [Crowdin](https://crowdin.com/). Documentation files written in English are uploaded to Crowdin for translation by users within a community. We always assumed that **English** is the default language, but this might not be the case for all user. I've seen some other Non-English open source project using Docusaurus.

For Docusaurus 2.0, **we will not assume English is the default language**, when a user enables internationalization, they have to set a default language in the `siteConfig`. We will then assume that all the files in `docs` are written in that language.

In addition, after working on the MVP of Docusaurus 2.0. I realized that it is very possible not to use Crowdin at all so we might need to add a documentation on how to do that. However, we'll still strongly recommend people to use Crowdin for easier integration.

## Customizability

### Layout
The current state of Docusaurus is that it maintains the entire layout and styling, unintentionally taking away a lot of the customizability part from the user. 

For Docusaurus 2.0, **layout and styling should be controlled by the user**. Docusaurus will provide the data (content, translation, versioning), props, and a default theme. We will allow the user to eject from the default theme for further layout customization. This means that it is very possible for the user to even change the HTML meta by using [React Helmet](https://github.com/nfl/react-helmet). A community-based theme is also very possible.

### Markdown
Our markdown parser is currently powered by [Remarkable](https://github.com/jonschlinkert/remarkable). What if the user want to use [markdown-it](https://github.com/markdown-it/markdown-it) or even [MDX](https://github.com/mdx-js/mdx) ? Other than that, it comes to the problem of which syntax highlighter to use, (e.g: Prism vs Highlight.js). We should leave the choice open to the user.

For Docusaurus 2.0, **user can eject and implement their own markdown parser**. It doesn't matter if they want to use MDX, Remark, Markdown-it or their own Markdown parser. As a rule of thumb, the user has to provide a React component, in which we will inject a children props containing the *RAW string of markdown*. By default, we will use Remarkable for the markdown parser and Highlight.js for the syntax highlighting. The default parser could still change in the future as we're still experimenting with different markdown parser.

### Search
Our core search functionality is based on [Algolia](https://www.algolia.com/). There is a lot of request by the user to change the search into something else, `lunrjs` for example so it will allow an offline search.

I personally like Algolia and has a pretty good experience working with them. If there's anything wrong, we can easily submit a pull request to Algolia since their `docsearch` is open source. For example, I recently submitted [this PR that enables DocSearch to scrape alternate languages in sitemap](https://github.com/algolia/docsearch-scraper/pull/387).

For Docusaurus 2.0, **we will allow the user to change the search UI**. A user just needs to eject from the default theme & modify the Search UI (a React component). However, we will still use Algolia in the default theme.

## Stability

Software is never going to be perfect but we'll want it to not break easily as we add new features. When Docusaurus was first released, it doesn't have any strong automated test suites. As a result, there is a lot of regressions that was not caught on early. Although we have recently added a lot of tests, it is still low in coverage.

For Docusaurus 2.0, **we are adding test as we develop** since we're going for a fresh re-write. Hence, I believe that it should be more stable than ever and it should be harder to break things compared to Docusaurus 1.0.

## Conclusion

I would like to take this opportunity to remind everyone once again that we are striving to make Docusaurus better for everyone. In fact, it is safe to say that Docusaurus 2.0 is not just a plan anymore. The work on it actually has started and hopefully, we'll be able to see it in the coming future.

We also want to let people know that due to work on v2, we will be less likely to accept new features/ big changes on the current version of Docusaurus.

If you are using Docusaurus, you're part of our community; keep letting us know how we can make Docusaurus better for you. Lastly, if you appreciate the work we're doing, you can sponsor [Docusaurus on Open Collective](https://opencollective.com/Docusaurus).

Thank you,

See you in the next blog post.

<script async src="//cdn.embedly.com/widgets/platform.js" charset="UTF-8"></script>