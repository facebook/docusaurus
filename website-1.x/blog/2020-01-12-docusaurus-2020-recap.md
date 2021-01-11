---
title: Docusaurus 2020 Recap
author: Sébastien Lorber
authorTitle: Docusaurus maintainer
authorURL: https://sebastienlorber.com
authorImageURL: https://github.com/slorber.png
authorTwitter: sebastienlorber
tags: [recap]
---

2020 was a great for Docusaurus, despite [a regrettable start](https://docusaurus.io/blog/2020/01/07/tribute-to-endi) and a tumultuous year for everyone.

We continued to invest on [Docusaurus 2](https://v2.docusaurus.io/), and made it reach **full feature parity with [Docusaurus 1](https://docusaurus.io/)**,

We can now safely **recommend Docusaurus 2** as the **default choice** to start a new Docusaurus project, and encourage v1 users to [migrate to Docusaurus 2](https://v2.docusaurus.io/docs/migration).

We are **still in alpha**, but expect **some good news very soon**!

<!--truncate-->

## Docusaurus 2 highlights

We have worked on many features this year, and would like to highlight the most significant ones:

- **i18n**: easily translate your Docusaurus site, released soon! ([preview](https://github.com/facebook/docusaurus/pull/3325))
- **Version dropdown**: enable contextual version switch
- **Versioning options**: solving the most common pain-points users had with versioning
- **Contextual search**: search in current version, use the brand-new Algolia DocSearch 3 experience
- **Markdown pages**: use Markdown instead of React components to create standalone pages
- **PWA**: add offline support to your site, and make it installable
- **Fail-fast**: strict config validation, detect broken links and prevent bad production deployments
- **Multi-instance**: use the docs plugin twice on a single Docusarus site (e.g. ios/android doc sdks)
- **Migration CLI**: automate many parts to upgrade easily from Docusaurus 1
- **CodeSandbox**: assess Docusaurus easily from your browser
- **Canary releases**: use the `@canary` npm tag to use the upcoming release before everyone else
- **TypeScript**: progressive adoption for internal code, and improve usage for users

## Docusaurus 2 growth

The plan to [rebuild Docusaurus from scratch in 2019](https://docusaurus.io/blog/2019/12/30/docusaurus-2019-recap) paid off: after a slow start, Docusaurus 2 has been widely adopted and has **already outgrown Docusaurus 1** usage.

![Docusaurus v1 vs v2 npm trends](/img/blog/2020-recap/docusaurus-npm-trends.png)

Notable **projects, startups, large companies and individuals** adopted Docusaurus 2 ([showcase](https://v2.docusaurus.io/showcase)):

- [Supabase](https://supabase.io)
- [React-Navigation](https://reactnavigation.org)
- [React-Redux](https://react-redux.js.org/)
- [Vector](https://vector.dev)
- [Algolia DocSearch](https://docsearch.algolia.com)
- [SAP Cloud SDK](https://sap.github.io/cloud-sdk)
- [Palo Alto Cortex XSOAR](https://xsoar.pan.dev)
- [Quddús George's personal website](https://portfoliosaurus.now.sh)

We helped **large scale Docusaurus 1 sites to upgrade**, ensuring a proper **migration path** and **feature parity**.

[ReactNative](https://reactnative.dev/) was successfully migrated ([old version](http://archive.reactnative.dev/)).

![ReactNative screenshot](/img/blog/2020-recap/react-native-screenshot.png)

Localized Docusaurus 1 sites like **Jest** will be able to upgrade too:

![Jest in Japanese screenshot](/img/blog/2020-recap/jest-screenshot.png)

We even saw the **[first right-to-left](https://datagit.ir/)** Docusaurus 2 site published:

![Datagit screenshot](/img/blog/2020-recap/datagit-rtl-screenshot.png)

## GitHub Activity

- **Stars**: 14632 -> 20946 (+43.2% y/y)
- **Total Contributors**: 303 -> 512 (+68.9% y/y). Most of which are non-Facebook contributors
- **Weekly npm Downloads**: 2356 -> 25592 (+986% y/y)
- **On GitHub**, Docusaurus 1 is used by 6311 projects (+62.9% y/y) while Docusaurus 2 is used by 5039 projects (+19 40% y/y)

## Collaboration with Major League Hacking

We have welcomed [Major League Hacking](https://mlh.io/) open-source interns for 2 seasons already.

We are very thankful for the various contributions they made, such as:

- Writing the first v1 -> v2 migration CLI
- Help migrate the ReactNative website (v1 -> v2)
- Making the config validation more strict and exhaustive, returning helpful error messages
- Adding CodeSandbox support
- Improving our CI pipelines with build size and Lighthouse bots
- Many other contributions

We look forward to continuing this collaboration in 2021.

## Media

Dmitry Vinnik (dev advocate @ Facebook) explains Docusaurus in [60 seconds](https://www.youtube.com/watch?v=_An9EsKPhp0) or [15min + Q&A](https://www.youtube.com/watch?v=Yhyx7otSksg).

Rachel Nabors (ReactNative documentation @ Facebook) talks a bit about Docusaurus in [ReactNative Radio 178](https://reactnativeradio.com/episodes/178-documenting-react-native-with-rachel-nabors-gWxwySPl), and William Candillon covered our [Docusaurus v1 -> v2 migration](https://www.youtube.com/watch?v=-zhjq2ECKq4)

Various blog posts have been published:

- [Easy documentation with Docusaurus](https://blog.logrocket.com/easy-documentation-with-docusaurus/) by Anshul Goyal, former MLH intern
- [To the Makers of Docusaurus](https://portfoliosaurus.now.sh/blog/toTheMakers) by Quddus George
- [Build Beautiful Documentation Websites with Docusaurus](https://lo-victoria.com/build-beautiful-documentation-websites-with-docusaurus) by Victoria Lo
- [How to Build a Plugin for Docusaurus v2](https://aknapen.nl/blog/how-to-build-a-plugin-for-docusaurus-v2/) by Adriaan Knapen

## Community

The Docusaurus community continues to grow. Our [Discord](https://discord.gg/docusaurus) server is quite active, and [StackOverflow questions](https://stackoverflow.com/questions/tagged/docusaurus) keep being posted.

The modular architecture of Docusaurus 2 allowed the community to build and publish [community plugins](https://v2.docusaurus.io/community/resources#community-plugins-). As we would like to federate better our community, if you are building a community plugin, please [let us know](https://github.com/facebook/docusaurus/discussions/4025).

## What's next?

The core features of Docusaurus 2 have finally been built, and we now have a clear migration path for all Docusaurus 1 sites to upgrade.

We'll be able to dedicate time to solve the pain points and bugs reported by the community, and make Docusaurus stable enough to enter the beta and release-candidate phase.

We still have a few major features that we'd like to work on:

- [Create a theme gallery](https://github.com/facebook/docusaurus/issues/3522), make it easy to switch from one another, and include first-class Tailwind support
- [Better compatibility with CommonMark](https://github.com/facebook/docusaurus/issues/3018), as MDX is not useful for all sites, and makes it harder for CommonMark-based sites to migrate to adopt Docusaurus
- [Migration to Webpack 5](https://github.com/facebook/docusaurus/issues/4027), and improve build times

Huge thanks to the community for their contributions, especially the core team - [Alexey Pyltsyn](https://github.com/lex111), [Yangshun Tay](https://twitter.com/yangshunz) and [Joel Marcey](https://github.com/JoelMarcey) for starting Docusaurus and supporting the project all this time.

Cheers to a great 2021! 🎉
