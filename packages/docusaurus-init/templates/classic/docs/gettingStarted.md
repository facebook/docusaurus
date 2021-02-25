---
id: getting-started 
title: Getting Started 
---

import TOCInline from '@theme/TOCInline';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page will help you to get started to build your documentation site with Docusaurus.

## Creating a Docusaurus site

Docusaurus has a command line utility package to help you generate a new documentation project. You can access it without installing anything globally by using `npx` or if you prefer, you can install the package `@docusaurus/init` globally. 

### Installing Docusaurus Init CLI (Optional)

:::caution
Skip to the next step, if you prefer to use `npx` rather than installing the package globally.
:::

In order to use the initial templates by Docusaurus, you have to install `@docusaurus/init` which is a command line utility to generate packages. Depending on your preferred package manager, install it globally. 

<Tabs
    defaultValue="npm"
    values={[
        { label: 'npm', value: 'npm' },
        { label: 'Yarn', value: 'yarn' },
    ]}
>
<TabItem value="npm">

```shell
    npm install -g @docusaurus/init@latest
```

</TabItem>
<TabItem value="yarn">

```shell
    yarn global add @docusaurus/init@latest
```

</TabItem>
</Tabs>

### Create a new Docusaurus site

Currently, we have a few initial templates available to kickstart your Docusaurus site.

- Classic
- Bootstrap
- Facebook

In order to generate the template with the command line utility, You can run this command anywhere either in a new empty repository or within an existing repository.

```shell
npx @docusaurus/init@latest init [name] [template]
```

Example:

```shell
npx @docusaurus/init@latest init my-documentation classic
```

### Running your Docusaurus site

#### Step 1: Install Dependencies

First, you will need to install the dependencies needed to be able to run Docusaurus.

To install dependencies, run the install command from your preferred package manager in the root directory of the project:

<Tabs
    defaultValue="npm"
    values={[
        { label: 'npm', value: 'npm' },
        { label: 'Yarn', value: 'yarn' },
    ]}
>
<TabItem value="npm">

```shell
npm install
```

</TabItem>
<TabItem value="yarn">

```shell
yarn 
```

</TabItem>
</Tabs>

a folder called `node_modules` should be generated if the installation process went correctly.

#### Step 2: Start your Docusaurus site

Let the Docusaurus's development server to start developing and adding content to your documentation site. Open a new terminal inside your Docusaurus project folder and run this command:

```shell
npx docusaurus start
```

If everything is set up correctly, you should be able to see your Docusaurus site running. 
