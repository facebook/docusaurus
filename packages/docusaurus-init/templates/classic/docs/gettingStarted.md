---
id: getting-started 
title: Getting Started 
---

import TOCInline from '@theme/TOCInline';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page will help you to get started with the development process of your Docusaurus project.


## Setting up the development environment

If you haven't setup your development environment. Let's go through a small step-by-step tutorial to get started with your Docusaurus project.

:::note
Feel free to edit this page as you follow the tutorial!
:::

### Step 1:  Generate a Docusaurus site

Let's run a command to generate the classic template. You can run this command anywhere either in a new empty repository or within an existing repository.

```shell
npx @docusaurus/init@latest init my-documentation classic
```

### Step 2: Install Dependencies

Don't forget to install the dependencies required, run the install command from your preferred package manager in the root directory of the project:

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

### Step 3: Start your Docusaurus site

Run this command to start the Docusaurus development server and start developing by adding content to your docusaurus project: 

```shell
npx docusaurus start
```

Open up `gettingStarted.md` in your project folder and try to edit some lines. The site should reload automatically after you save your changes.

### That's it!

Congratulations! You've successfully run and modified your Docusaurus project.


