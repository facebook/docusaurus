---
id: setup
title: Setting Up
---

## Install Node

Node.js is an environment that can run JavaScript code outside of a web browser. Gatsby is built with Node.js. To get up and running with Gatsby, you’ll need to have a recent version installed on your computer.

Note: Gatsby’s minimum supported Node.js version is Node 8, but feel free to use a more recent version.

1. Open your Terminal.
1. Run brew update to make sure you have the latest version of Homebrew.
1. Run this command to install Node and npm in one go: brew install node

Once you have followed the installation steps, make sure everything was installed properly:

## Check your Node.js installation

```sh
$ node --version
```

## Install Yarn

TODO

## Create a GitHub Repository

1. Go to https://github.com/ and sign up for an account if you don't have one.
1. Click on "New Repository" or go to https://github.com/new.
1. Name your repository without spaces. For e.g. `docusaurus-tutorial`.
1. Proceed to create the repository without adding `.gitignore` or a license.
1. Clone your repository to your local machine:

```sh
$ git@github.com:USERNAME/docusaurus-tutorial.git
```

## Install the Docusaurus init command

1. Do `yarn global add docusaurus-init` or `npm install --global docusaurus-init`.
1. `cd` into the repository which you just created.
