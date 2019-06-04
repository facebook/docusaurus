---
id: introduction
title: Introduction
---

#### :warning: Disclaimers

This is a **very early and incomplete alpha release** of Docusaurus 2. We are making it available early to maximize community participation and feedback. Expect it to evolve a lot over the course of the alpha-beta period. If you are adventurous enough to be an early adopter, chat with us on [**Discord**](https://discordapp.com/invite/docusaurus) :wink:.

**You should use this if**

- :white_check_mark: You want to contribute to Docusaurus 2
- :white_check_mark: You want to give feedback to make sure it suits your needs
- :white_check_mark: You are curious about what's next as a Docusaurus user

**Do not use this if**

- :x: You are expecting a full production-ready solution (<small>try [Docusaurus 1](https://docusaurus.io/) instead</small>)
- :x: You are not willing to accept the breaking changes/things not working properly as we improve it during alpha period

## Introduction

<img src="https://docusaurus.io/img/slash-introducing.svg" alt="Docusaurus"/>

Docusaurus 1 used to be a documentation site generator. In Docusaurus 2, we rebuilt it from the ground up, allowing for more customizability but preserved the best parts of Docusaurus 1 - easy to get started. Docusaurus 2 is a **performant static site generator** can be used to create most content-driven websites (e.g. Documentation, Blogs, Product Landing and Marketing Pages, etc) extremely fast. Out of the box, we have support for documentation-style and blogging websites.

This website for example, is built with Docusaurus 2.

## Features

- ⚛️ **Built using React** - Extend or customize with React
- 📦 **Uses webpack** - Build an optimized bundle and use any CSS-in-JS solution you like
- ⚡️ **Lightning Fast** - Link prefetching, instant navigation and page views
- ✂️ **Easy** - Hot reloading out-of-the-box, automatic route-based code and data splitting! Create new routes by creating new Markdown or JSX files
- 💥 **Single-page Application** - Client-side navigations and easily add dynamic interactivity to your website (Client-side Rendering)
- 🎯 **SEO Friendly** - `index.html` files are statically generated for every possible path (Static Rendering)
- 😌 **Painless** - Painless project setup. First class support for documentation
- 📝 **MDX Based** - Write interactive components via JSX and React embedded in markdown
- ☁️ **GitHub pages friendly** - Publish to GitHub pages with one command!
- 🔌 **Pluggable** - Plugin system to extend basic functionality and do almost anything youw ant
- 🎨 **Themeable** - Theming system to customize how your website's appearance
- 🔍 **Search** - Make it easy for people to search what they need in your website.
- 🌎 **i18n** - Internationalize your website easily (_coming soon_)
- 💾 **Versioning** - Versioning support (_coming soon_)
- 🚀 **Many others** ....

## Comparison with other Tools

### Gatsby

Gatsby is packed with a lot of features, has a rich ecosystem of plugins and is capable of doing everything that Docusaurus does. Naturally, that comes at a cost of a higher learning curve. Gatsby tries to do many things well, while Docusaurus tries to do one thing super well - be the best tool for writing and publishing content.

GraphQL is also pretty core to Gatsby, although you don't necessarily need GraphQL to build a Gatsby site. In most cases when building static websites, you won't need the flexibility that GraphQL provides.

Many aspects of Docusaurus 2 were inspired by the best things about Gatsby and it's a great alternative.

### GitBook

The primary problem with GitBook is that the team behind it is more focused on turning it into a commercial product rather than an open-source tool. It also has a lot of problems that Docusaurus doesn't have. That's why [Redux switched to Docusaurus](https://github.com/reduxjs/redux/issues/3161). It is only free for open-source and non-profit teams. Docusaurus is free for everyone.

### Jekyll

Jekyll is one of the most mature static site generators around and has been a great tool to use - in fact, before Docusaurus, most of Facebook's Open Source websites are/were built on Jekyll! It is extremely simple to get started. However, Jekyll generates static HTML and it is hard to build websites with interactivity involved as you would have to embed `<script>` tags all over. A basic Jekyll website only supports a very basic blog, and a great deal of set up is needed to make it suitable for writing documentation. Jekyll is also written in Ruby and it isn't the fastest in terms of performance when you have a lot of content. Jekyll's build pipeline for non-CSS assets aren't great either. If you don't need the interactivity and do not care about a build pipeline to optimize your assets, Jekyll is still a great choice.

### VuePress

VuePress has many similarities with Docusaurus - both focus heavily on content-centric website and provides tailored documentation features out of the box. However, VuePress is powered by Vue, while Docusaurus is powered by React. If you wanted a Vue-based solution, VuePress would be a decent choice.

## Staying Informed

- [GitHub](https://github.com/facebook/docusaurus)
- [Twitter](https://twitter.com/docusaurus)
- [Blog](/blog)

## Something Missing?

If you find issues with the documentation or have suggestions on how to improve the documentation or the project in general, please [file an issue](https://github.com/facebook/docusaurus) for us, or send a tweet mentioning the [@docusaurus](https://twitter.com/docusaurus) Twitter account.

For new feature requests, you can create a post on our [Canny board](/feedback), which is a handy tool for roadmapping and allows for sorting by upvotes, which gives the core team a better indicator of what features are in high demand, as compared to GitHub issues which are harder to triage. Refrain from making a Pull Request for new features (especially large ones) as someone might already be working on it or will be part of our roadmap. Talk to us first!
