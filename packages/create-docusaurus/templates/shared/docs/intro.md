---
sidebar_position: 1
---

# Tutorial Intro
A beginners guide <br />

Let's discover **Docusaurus in less than 5 minutes**.

## Getting Started

Get started by easily **creating a new site**

Or **try Docusaurus immediately** with **[docusaurus.new](https://docusaurus.new)**.

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 14 or above:
    - **To install**
    - Head to the Node.js download page. [Click Here](https://nodejs.org/en/download/)
    - Select the correct version for your machine. Windows Installer, macOS Installer...
    - Choose all the preset options during installation until the last step.
        - Ensure tools are set to automatically install, this will save time when installing packages. 
        ![](/img/nodejs-install.png)
    - Let the installation run and finish completely, this may take a while. 

## Generate a new site

Generate a new Docusaurus site using the **classic template**.  <br />

The classic template will automatically be added to your project after you run the command:

```shell
npm init docusaurus@latest my-website classic
```

You can type this command into Command Prompt, Powershell, Terminal, Visual Studio terminal, or any other code editors you may have.

## Start your site

Run the development server:

```shell
cd my-website

npm run build
```

The `cd` command changes the directory you're working with. In order to work with your newly created Docusaurus site, you'll need to navigate the terminal there. 

<br />

The `npm run build` command will build your website locally ready for you to view it at [localhost:3000](localhost:3000)


Open `docs/intro.md` (this page) and edit some lines: the site **reloads automatically** and displays your changes.
