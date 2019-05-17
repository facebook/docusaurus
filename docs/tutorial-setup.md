---
id: tutorial-setup
title: Setting Up
---

This tutorial is geared at first-time users who want detailed instructions on how to go from zero to a Docusaurus website that has versions. Let's start!

<img alt="Docusaurus campfire" src="/img/undraw_docusaurus_mountain.svg" class="docImage"/>

## Install Node.js

Node.js is an environment that can run JavaScript code outside of a web browser and is used to write and run server-side JavaScript apps.

> Docusaurus' minimum supported Node.js version is Node 8, but more recent versions will work as well.

1. Open your Terminal.
1. If you have `brew` on your OS, run the following command to install Node (a JavaScript runtime that allows you to run JavaScript on the server) and `npm` the package manager (allows you to install npm modules from your terminal).

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

## Install Yarn (Optional)

We highly recommend you to install Yarn, an alternative package manager that has superb performance for managing your NPM dependencies. Check it out [here](https://yarnpkg.com/en/docs/install).

> You can still proceed with the tutorial without Yarn.

## Create a GitHub Repository

1. Go to https://github.com/ and sign up for an account if you don't already have one.
1. Click on **"New Repository"** or go to https://github.com/new.
1. Name your repository without spaces. For e.g. `docusaurus-tutorial`.
1. Proceed to create the repository without adding `.gitignore` or a license.

<img alt="GitHub create repo" src="/img/tutorial-git-clone.png" class="docImage"/>

5. Clone your repository to your local machine:

```sh
git clone git@github.com:USERNAME/docusaurus-tutorial.git # SSH
# or
git clone https://github.com/USERNAME/docusaurus-tutorial.git # HTTPS
```

6. `cd` into the repository which you just created.

## Install the Docusaurus init command

Docusaurus comes with a command line tool to help you scaffold a Docusaurus site with some example templates. Let's install the installer!

1. Run the following command:

```sh
npm install --global docusaurus-init
```

or if you have Yarn:

```sh
yarn global add docusaurus-init
```
