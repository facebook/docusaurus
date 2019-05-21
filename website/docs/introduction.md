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
- :x: You are not willing to adapt with the breaking changes/ things not working properly as we improve it during alpha period

## Introduction

<img src="https://docusaurus.io/img/slash-introducing.svg" alt="Docusaurus"/>

Docusaurus is not just a documentation site generator. It is a **painless static site generator** with focus on *content-centric website like documentation and blog site*.

This website for example, is build with Docusaurus 2 alpha.

## Features

- ⚛️ **Built using React** Extend or customize with React.
- ⚡️ **Super Fast** Link prefetching, instant navigation and page views
- ✂️ **Easy** Hot Reloadable out-of-the-box, automatic code and data splitting!
- 💥 **Single-page application** Add dynamic interactivity to your website (CSR)
- 🎯 **SEO Friendly** files are staticly generated (SSR)
- 😌 **Painless** Painless project setup. First class support for documentation
- 📝 **MDX Based.** Write JSX and React in markdown 
- ☁️ **GitHub pages friendly** Publish to GitHub pages with one command !
- 🔌 **Pluggable** Plugin system to extend basic functionality
- 🎨 **Themeable** Theming system to customize how your website's appearance
- 🔍 **Search** Make it easy for people to search what they need in your website.
- 🌎 **i18n** Internationalize your website easily (*coming soon*) 
- 💾 **Version** Versioning support (*coming soon*) 
- 🚀 **many others** ....


## Comparison with other tools

### Docz

Docz is a great project but it is best suited to internally document a React component library. It doesn't help you generate a nice looking landing page or blog like what Docusaurus does, you have to write your own MDX for all of that. It is also completely runtime-driven (not a static site), doesn't work without JavaScript and therefore not SEO friendly.

## GitBook

The primary problem with GitBook is that the team behind it is more focused on turning it into a commercial product rather than an open-source tool. It also has a lot of problems that Docusaurus doesn't have. That's why [Redux switched to Docusaurus](https://github.com/reduxjs/redux/issues/3161). It is only free for open-source and & non-profit teams. Docusaurus is free for everyone.

## Gatsby

Gatsby is capable of doing what Docusaurus does. But it is designed to build various kind of websites and apps. In comparison, Docusaurus is very focused on content-centric sites and provides features tailed for documentation of the box. 
Gatsby tries to **do many things well**, while Docusaurus tries to **do one thing super well**.

In addition, Gatsby's codebase is complex and it has hundreds of open issues. In comparison, Docusaurus codebase is very minimal and it has less open issues. It is much harder to fix a bug caused by Gatsby yourself unless you have a vast understanding of Gatsby's monorepository which has has ~~9000~~ over 100 packages. You'll have to rely on the maintainers who have few other hundreds of issues to solve.

In addition, in order to achieve what Docusaurus does in Gatsby, you'll have to invest a lot of effort and build everything yourself. This of course give you an advantage of flexibility because you will be doing mostly everything on your own. However, that just means you're building another version of Docusaurus. Why reinvent the wheel ? 

## Jekyll

Jekyll is written in Ruby and is very simple. The primary data source that can go in is Markdown, Liquid, HTML and CSS. In comparison, Docusaurus is written in JavaScript and is powered by React. If you don't want to utilize the power of React and JavaScript, Jekyll can be your choice.

## Vuepress

Vuepress is a great static site generator. Both vuepress and Docusaurus both focus heavily on content-centric website and provide tailored documentation feature out of the box. However, Vuepress is powered by Vue, while Docusaurus is powered by React. If you wanted a Vue based solution, Vuepress could be your choice. If you want React, use Docusaurus.

