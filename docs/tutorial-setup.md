---
id: tutorial-setup
title: Setting Up
---

This tutorial is geared at first-time users who want detailed instructions on how to go from zero to a Docusaurus website that has versions. Let's start!

<img alt="Docusaurus campfire" src="/img/undraw_docusaurus_mountain.svg" class="docImage"/>

## Install Git

Git is a version control system for tracking changes in source code during software development and it can help you synchronize and version files between your local system and your online repository. If not already installed, see [Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Install Node.js

Node.js is an environment that can run JavaScript code outside of a web browser and is used to write and run server-side JavaScript apps. Node.js installation includes `npm`, the package manager that allows you to install NPM modules from your terminal.

1. Open your Terminal.
1. If you have `brew` on your OS, run the following command to install Node.

```sh
brew install node
```

Alternatively, you can download an installer from the [Node.js homepage](https://nodejs.org/en/).

## Check your Node.js installation

Check that you have the minimum required version installed by running the following command:

```sh
node -v
```

You should see a version larger than Node 8.

```sh
node -v
v8.15.1
```

> Docusaurus' minimum supported Node.js version is Node 8, but more recent versions will work as well.

## Install Yarn (Optional)

We highly recommend that you install Yarn, an alternative package manager that has superb performance for managing your NPM dependencies. Check it out [here](https://yarnpkg.com/en/docs/install).

> You can still proceed with the tutorial without Yarn.

## Create a GitHub repository and local clone

1. Go to https://github.com/ and sign up for an account if you don't already have one.
1. Click on the green **New** button or go to https://github.com/new.
1. Type a repository name without spaces. For example, `docusaurus-tutorial`.
1. Click **Create repository** (without `.gitignore` and without a license).

<img alt="GitHub create repo" src="/img/tutorial-git-clone.png" class="docImage"/>

5. In your terminal, `cd` to a directory where the local clone will be a subdirectory. (For help see [Introduction to the command-line interface](https://tutorial.djangogirls.org/en/intro_to_command_line/).) 

```sh
cd /Users/USERNAME/doc_projects # macOS example
# or
cd /c/USERNAME/doc_projects # Windows example
```

6. Clone your repository to your local machine:

```sh
git clone git@github.com:USERNAME/docusaurus-tutorial.git # SSH
# or
git clone https://github.com/USERNAME/docusaurus-tutorial.git # HTTPS
```

## Install the Docusaurus init command

Docusaurus comes with a command line tool to help you scaffold a Docusaurus site with some example templates. Let's install the installer!

Run the following command:

```sh
npm install --global docusaurus-init
```

or if you have Yarn:

```sh
yarn global add docusaurus-init
```
