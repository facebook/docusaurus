---
title: Docusaurus 2019 Recap
author: Yangshun Tay
authorTitle: Front End Engineer at Facebook
authorURL: https://github.com/yangshun
authorImageURL: https://avatars1.githubusercontent.com/u/1315101?s=460&v=4
authorTwitter: yangshunz
tags: [recap]
---

2019 was a great year for Docusaurus - we've made tremendous progress on [Docusaurus 2](https://v2.docusaurus.io/). Current Docusaurus 1 users who aren't using the translations feature can feel free to check it out and [migrate](https://v2.docusaurus.io/docs/migrating-from-v1-to-v2) to it! Otherwise we will work with you to make that happen in 2020 :)

<!--truncate-->

## Docusaurus 2 (D2)

In 2018, we proposed to rebuild [Docusaurus from the ground up](https://github.com/facebook/docusaurus/issues/789). It involved a major rearchitecture effort - we created a content-centric CSS framework from scratch, a plugins system, and moved from static HTML pages to be a single page-app with prerendered routes. It was a wild adventure and a tough feat, especially with no dedicated FTE working on the project. With the help of [@endilie](https://github.com/endiliey), our ex-intern-turned-contributor-turned-maintainer, we made really good progress on D2 and are currently on version 2.0.0-alpha.40. All features in Docusaurus 1 except for translations have been ported over.

D2's killer features are **Dark Mode** and its **superb performance**. D2 has dark mode support out-of-the-box and its near effortless to create a dark mode-friendly documentation site. Endilie put in great effort into optimizing the performance of the site and a bunch of performance optimization tricks have been done under the hood by default - optimized images, prerendering every route to static HTML and client-side routing thereafter, prefetching assets needed by future navigations whenever the user hovers over a navigation link, etc.

Last but not least, we implemented a plugins architecture and turned the repo into a [Lerna monorepo](https://github.com/facebook/docusaurus/tree/master/packages). We believe this plugin architecture will be helpful towards building a community and also allowing users to build their own features for their unique use cases.

## GitHub Activity

- Stars: 10050 -> 14632 (+45.6% y/y)
- Total Contributors: 182 -> 303 (+66.4% y/y). Most of which are non-Facebook contributors
- Daily npm Downloads: 728 -> 2320 (+218.7% y/y). The peak was in November
- D1 is currently used by 3872 projects on GitHub while D2 is used by 247 projects on GitHub
- We now have 4 active core contributors! (+100% y/y)

## Notable Users

A good portion of the projects within the Open Source community use Docusaurus. This half we also onboarded more notable projects onto Docusaurus 2:

- [Create React App](https://create-react-app.dev/)
- [Redux](https://redux.js.org/)
- [Draft.js](https://draftjs.org/)
- [Flux](http://facebook.github.io/flux/)

And welcomed more projects to Docusaurus 1:

- [Libra](https://developers.libra.org/)
- [MobX](https://mobx.js.org/)
- [Sorbet](https://sorbet.org/)

## Media

Yangshun gave a classroom session during F8 about [Using Docusaurus to Create Open Source Websites](https://www.youtube.com/watch?v=QcGJsf6mgZE).

## Community

A few third-party hosting/development services also has first-class integration with a Docusaurus setup:

- [ZEIT Now deployment](https://github.com/zeit/now-examples/tree/master/docusaurus)
- [CodeSandbox](https://codesandbox.io/s/docusaurus-template-x3vg9)
- [Render](https://render.com/docs/deploy-docusaurus)

## Looking Ahead

D2 has gained some traction among the [developer community](https://v2.docusaurus.io/showcase). In 2020, we want to achieve full feature parity with D1 by the first half and help the remaining Facebook projects on D1 move to D2. It would also be great if we could use Docusaurus for internal documentation, but that is a non-trivial undertaking. If you have a need for it or have some ideas, come speak with us!

Huge thanks to the community for their contributions, especially the core team - [Endilie Yacop Sucipto](https://github.com/endiliey), [Alexey Pyltsyn](https://github.com/lex111), [Wei Gao](https://github.com/wgao19). Lastly, thank you [Joel Marcey](https://github.com/JoelMarcey) for starting Docusaurus and supporting the project all this time.

Cheers to a great 2020! 🎉
