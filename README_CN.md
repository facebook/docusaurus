<h1 align="center">
  <p align="center">Docusaurus</p>
  <a href="https://docusaurus.io"><img src="https://docusaurus.io/img/slash-introducing.svg" alt="Docusaurus"></a>
</h1>

<p align="center">
  <a href="https://twitter.com/docusaurus"><img src="https://img.shields.io/twitter/follow/docusaurus.svg?style=social" align="right" alt="Twitter Follow" /></a>
  <a href="#backers" alt="sponsors on Open Collective"><img src="https://opencollective.com/Docusaurus/backers/badge.svg" /></a>
  <a href="#sponsors" alt="Sponsors on Open Collective"><img src="https://opencollective.com/Docusaurus/sponsors/badge.svg" /></a>
  <a href="https://www.npmjs.com/package/@docusaurus/core"><img src="https://img.shields.io/npm/v/@docusaurus/core.svg?style=flat" alt="npm version"></a>
  <a href="https://github.com/facebook/docusaurus/actions/workflows/tests.yml"><img src="https://github.com/facebook/docusaurus/actions/workflows/tests.yml/badge.svg" alt="GitHub Actions status"></a>
  <a href="CONTRIBUTING.md#pull-requests"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
  <a href="https://discord.gg/docusaurus"><img src="https://img.shields.io/discord/102860784329052160.svg" align="right" alt="Discord Chat" /></a>
  <a href= "https://github.com/prettier/prettier"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"></a>
  <a href="#license"><img src="https://img.shields.io/github/license/sourcerer-io/hall-of-fame.svg?colorB=ff0000"></a>
  <a href="https://github.com/facebook/jest"><img src="https://img.shields.io/badge/tested_with-jest-99424f.svg" alt="Tested with Jest"></a>
  <a href="https://gitpod.io/#https://github.com/facebook/docusaurus"><img src="https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod" alt="Gitpod Ready-to-Code"/></a>
  <a href="https://app.netlify.com/sites/docusaurus-2/deploys"><img src="https://api.netlify.com/api/v1/badges/9e1ff559-4405-4ebe-8718-5e21c0774bc8/deploy-status" alt="Netlify Status"></a>
  <a href="https://meercode.io/facebook/docusaurus"><img src="https://meercode.io/badge/facebook/docusaurus?type=ci-score" alt="CI Score"></a>
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffacebook%2Fdocusaurus%2Ftree%2Fmain%2Fexamples%2Fclassic&project-name=my-docusaurus-site&repo-name=my-docusaurus-site"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>
  <a href="https://app.netlify.com/start/deploy?repository=https://github.com/slorber/docusaurus-starter"><img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify"></a>
</p>

> **我们正在努力开发 `Docusaurus v2` 。最新版为  `V2.3.1` ，如果您不熟悉 Docusaurus，请尝试使用最新版本而不是 v1。有关更多详细信息，请参阅 [Docusaurus v2 网站](https://docusaurus.io/) 。**

> `Docusaurus v1` 文档可在 [v1.docusaurus.io](https://v1.docusaurus.io) 中查阅，代码可在以下分支 [docusaurus-v1](https://github.com/facebook/docusaurus/tree/docusaurus-v1) 中获取。

<p align="center">
    <br> <a href="README.md">English</a> | 中文
</p>

## 简介

`Docusaurus` 是一个用于轻松构建、部署和维护开源项目网站的项目。

如果您时间有限，可以打开我们的 [教程](https://tutorial.docusaurus.io) 5分钟⏱️快速上手 &#x1F44C; ！

**小提示&#x1F440;**：可以使用 **[docusaurus.new](https://docusaurus.new)** 在浏览器中立即亲身体验 `Docusaurus` 。

### 1. **简洁的安装 - Simple to Start - 快速使用**

> `Docusaurus` 的官方 [**安装教程**](https://docusaurus.io/docs/installation) 使其能够在尽可能短的时间内**轻松上手**。我们构建了 `Docusaurus` 来处理网站的构建过程，因此您可以专注于您的项目。

### 2. **本地化支持 - Localizable - 交流无障碍**

> `Docusaurus` 使用 `CrowdIn` 提供 [**本地化支持**](https://docusaurus.io/docs/i18n/introduction)。通过翻译您的文档来增强与拓展您的国际化社区。

### 3. **丰富的定制 - Customizable - 个性十足**

> 虽然 `Docusaurus` 附带了您入门所需的关键页面和sections，包括主页、文档 _\<section\>_ 标签、[**博客**](https://docusaurus.io/docs/blog) 和附加的支持页面，但它也可以自定义 [**创建**](https://docusaurus.io/docs/creating-pages) 页面，更改 [**样式与布局**](https://docusaurus.io/docs/styling-layout) 以确保您拥有一个 `UI风格` 独特又漂亮的网站。

## 安装

使用命令行工具可以帮助你快速简单地安装 `Docusaurus` 并搭建网站框架。 你可以在空仓库或现有仓库的任何地方运行这个命令，它会创建一个包含模板文件的新目录。
```bash
npx create-docusaurus@latest my-website classic
```
你也可以用你喜欢的包管理器来初始化新项目：

使用npm包管理器：
```bash
npm init docusaurus
```
使用yarn包管理器：
```bash
yarn create docusaurus
```
使用pnpm包管理器：
```bash
pnpm create docusaurus
```

推荐使用 `classic` 模板来快速上手，同时它也包含 _Docusaurus 1_ 中的功能。 `classic` 模板内含 `@docusaurus/preset-classic` 包，后者包含了标准文档、博客、自定义页面及 _CSS_ 框架（支持`暗黑模式`）。 你可以用经典模板来快速设立网站，在熟悉了 `Docusaurus` 之后，再逐步对其自定义。
你也可以用 `--typescript` 选项来使用模板的 `TypeScript` 变种。 更多详情请查看 `Typescript` 支持。
```bash
npx create-docusaurus@latest my-website classic --typescript
```
运行 <code>npx create-docusaurus@latest --help</code>，或者查看 <a href="https://docusaurus.io/zh-CN/docs/docusaurus-core">API 文档</a> 以了解更多可用选项。

[查看安装文档](https://docusaurus.io/docs/installation) 可以了解更详细的安装步骤。

## 文档
打开对应的 [**docusaurus文档**](https://docusaurus.io/docs) 可以获取您所需要的更详细信息。

## 贡献

我们发布了 `Docusaurus`，因为它可以帮助我们更好地扩展并支持 _Facebook_ 的许多 _OSS_ 项目。希望其他组织能够从该项目中受益。感谢社区的每一个贡献。

### [行为准则](https://code.fb.com/codeofconduct)

Facebook 已采用《行为准则》_Code of Conduct_，我们希望项目参与者遵守该准则。请阅读[全文](https://code.fb.com/codeofconduct)，以便您了解哪些行为将被容忍，哪些行为不会被容忍。

### 贡献指南

阅读我们的[贡献指南](https://github.com/facebook/docusaurus/blob/main/CONTRIBUTING.md)，了解我们的开发过程，如何提出错误修复和改进，以及如何构建和测试对 `Docusaurus` 的更改。

### Beginner-friendly bugs

为了帮助您了解并熟悉我们的贡献流程，我们列出了 [beginner-friendly bugs](https://github.com/facebook/docusaurus/labels/good%20first%20issue)，其中可能包含需要首先解决的小问题。这里是一个起步的好地方。

## 联系

我们有以下多种渠道联系：

- [Discord](https://discord.gg/docusaurus):
  - `#general` for those using Docusaurus.
  - `#contributors` for those wanting to contribute to the Docusaurus core.
- [@docusaurus](https://twitter.com/docusaurus) on Twitter
- [GitHub Issues](https://github.com/facebook/docusaurus/issues)

## 贡献者

这个项目的存在要归功于所有做出贡献的人。[[Contribute](CONTRIBUTING.md)]. <a href="https://github.com/facebook/docusaurus/graphs/contributors"><img src="https://opencollective.com/Docusaurus/contributors.svg?width=890&button=false" /></a>

## 支持者

感谢我们所有的支持者！ 🙏 [成为支持者中的一员](https://opencollective.com/Docusaurus#backer)

<a href="https://opencollective.com/Docusaurus#backers" target="_blank"><img src="https://opencollective.com/Docusaurus/backers.svg?width=890"></a>

## 赞助商

通过成为赞助商来支持这个项目。您的徽标将显示在此处，并带有指向您网站的链接。 [成为该项目的赞助商](https://opencollective.com/Docusaurus#sponsor)

<p align="center">
  <a href="https://opencollective.com/Docusaurus/sponsor/0/website" target="_blank"><img src="https://opencollective.com/Docusaurus/sponsor/0/avatar.svg"></a> <a href="https://opencollective.com/Docusaurus/sponsor/1/website" target="_blank"><img src="https://opencollective.com/Docusaurus/sponsor/1/avatar.svg"></a>
</p>

## 许可

`Docusaurus` 使用 [MIT](./LICENSE) 许可.

`Docusaurus` 文档 (例如以 `.md` 结尾的文档放置在 `/docs` 文件夹) 的 [知识共享许可](./LICENSE-docs).

## 特别致谢

<p>
  <a href="http://www.browserstack.com/" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./admin/img/browserstack-dark-mode-logo.svg#gh-dark-mode-only">
      <img alt="BrowserStack logo" src="./admin/img/browserstack-light-mode-logo.svg#gh-light-mode-only" height="50px" />
    </picture>
  </a>
</p>

[BrowserStack](http://www.browserstack.com/) 支持我们 [免费访问开源](https://www.browserstack.com/open-source).

[![Rocket Validator logo](./admin/img/rocketvalidator-logo.png)](https://rocketvalidator.com/)

[Rocket Validator](https://rocketvalidator.com/) 帮助我们查找 HTML 标记或辅助功能问题。
