---
id: introduction
title: Introduction
description: Docusaurus was designed from the ground up to be easily installed and used to get your website up and running quickly.
slug: /
---

## Disclaimer

It has been a year since we made the first **alpha release** of Docusaurus 2 and things have been pretty stable since then. Many of Facebook's new open source websites are using Docusaurus 2 now. At this point, we highly encourage you to use Docusaurus 2 over Docusaurus 1 for your new websites. For feedback and questions, chat with us on [**Discord**](https://discordapp.com/invite/docusaurus) :wink:

**You should use this if:**

- :white_check_mark: You want to contribute to Docusaurus 2
- :white_check_mark: You want to build a modern website with client-side routing and prerendering
- :white_check_mark: You want to provide feedback to make sure Docusaurus 2 suits your needs
- :white_check_mark: You are curious about what comes next as a Docusaurus user
- :white_check_mark: You want to ease the pain of migration in future
- :white_check_mark: You do not need support for IE11

**Do not use this if:**

- :x: You need a fully production-ready solution (try [Docusaurus 1](https://docusaurus.io/) instead)
- :x: You need the translation features present in v1
- :x: You prefer not to work with potential breaking changes and/or features not yet working properly as we improve it during the alpha period
- :x: You need support for IE11

## A better Docusaurus is coming to town

<img alt="Docusaurus " src={require('@docusaurus/useBaseUrl').default('img/slash-introducing.svg')} />

Docusaurus 1 used to be a pure documentation site generator. In Docusaurus 2, we rebuilt it from the ground up, allowing for more customizability but preserved the best parts of Docusaurus 1 - easy to get started, versioned docs, and i18n (_coming soon_).

Beyond that, Docusaurus 2 is a **performant static site generator** and can be used to create common content-driven websites (e.g. Documentation, Blogs, Product Landing and Marketing Pages, etc) extremely quickly.

While our main focus will still be helping you get your documentations right and well, it is possible to build any kind of website using Docusaurus 2 as it is just a React application. **Docusaurus can now be used to build any website, not just documentation websites.**

## Features

Docusaurus is built with high attention to your experience building your site and maintaining it with your collaborators and contributors.

- ⚛️ **Built with 💚 and React**
  - Extend and customize with React
  - Gain full control of your site's browsing experience by `swizzling` in your own components
- **Pluggable**
  - Bootstrap your site with a basic template, then pick and plug functionalities built by us and our community
  - Open source your plugins to share with your fellow documentarians, because sharing is caring
- ✂️ **Developer experience**
  - Multiple bootstrapping templates to get your site up and running, start writing your docs right now
  - Universal configuration entry point to make it more maintainable by contributors
  - Hot reloading with lightning fast incremental build on changes
  - Route-based code and data splitting
  - Publish to GitHub Pages, Netlify, and other deployment services with ease

Our shared goal — to help your users find what they need fast, and understand your products better. With the experience of Docusaurus 1, we share with you our best practices to help you build your doc site right and well.

- 🎯 **SEO friendly**
  - HTML files are statically generated for every possible path
  - page-specific SEO to help your users land on your official docs directly relating their problems at hand
- 📝 **Powered by MDX**
  - Write interactive components via JSX and React embedded in markdown
  - Share your code in live editors to get your users love your products on the spot
- 🔍 **Search** - Your full site is searchable
- 💾 **Document Versioning** - Helps you keep documentation in sync with project releases.
- 🌍 **i18n** (_coming soon_)

Docusaurus 2 is born to be compassionately accessible to all your users, and lightning fast.

- ⚡️ **Lightning fast** - Docusaurus 2 follows the [PRPL Pattern](https://developers.google.com/web/fundamentals/performance/prpl-pattern/) that makes sure your content loads blazing fast
- 🦖 **Accessible** - Attention to accessibility, making your site equally accessible to all users

## Comparison with other tools

Across all static site generators, Docusaurus has a unique focus on doc sites and has out-of-the-box structure you need.

We've also studied other main static site generators and would like to share our insights on the comparison, hopefully to help you navigate through the prismatic choices out there.

### Gatsby

Gatsby is packed with a lot of features, has a rich ecosystem of plugins and is capable of doing everything that Docusaurus does. Naturally, that comes at a cost of a higher learning curve. Gatsby does many things well and is suitable for building many types of websites. On the other hand, Docusaurus tries to do one thing super well - be the best tool for writing and publishing content.

GraphQL is also pretty core to Gatsby, although you don't necessarily need GraphQL to build a Gatsby site. In most cases when building static websites, you won't need the flexibility that GraphQL provides.

Many aspects of Docusaurus 2 were inspired by the best things about Gatsby and it's a great alternative.

### GitBook

GitBook has very clean design and has been used by many open source projects. With its focus shifting towards a commercial product rather than an open-source tool, many of its requirements no longer fit the needs as an open source project's documentation site. As a result, many have turned to other products. You may read about Redux's switch to Docusaurus [here](https://github.com/reduxjs/redux/issues/3161).

Currently, GitBook is only free for open-source and non-profit teams. Docusaurus is free for everyone.

### Jekyll

Jekyll is one of the most mature static site generators around and has been a great tool to use — in fact, before Docusaurus, most of Facebook's Open Source websites are/were built on Jekyll! It is extremely simple to get started. We want to bring a similar developer experience as building a static site with Jekyll.

In comparison with statically generated HTML and interactivity added using `<script />` tags, Docusaurus sites are React apps. Using modern JavaScript ecosystem tooling, we hope to set new standards on doc sites performance, asset build pipeline and optimizations, and ease to setup.

### VuePress

VuePress has many similarities with Docusaurus - both focus heavily on content-centric website and provides tailored documentation features out of the box. However, VuePress is powered by Vue, while Docusaurus is powered by React. If you want a Vue-based solution, VuePress would be a decent choice.

<!-- TODO: Add a Next.js comparison -->

## Staying informed

- [GitHub](https://github.com/facebook/docusaurus)
- [Twitter](https://twitter.com/docusaurus)
- [Blog](/blog)

## Something missing?

If you find issues with the documentation or have suggestions on how to improve the documentation or the project in general, please [file an issue](https://github.com/facebook/docusaurus) for us, or send a tweet mentioning the [@docusaurus](https://twitter.com/docusaurus) Twitter account.

For new feature requests, you can create a post on our [Canny board](/feedback), which is a handy tool for roadmapping and allows for sorting by upvotes, which gives the core team a better indicator of what features are in high demand, as compared to GitHub issues which are harder to triage. Refrain from making a Pull Request for new features (especially large ones) as someone might already be working on it or will be part of our roadmap. Talk to us first!
