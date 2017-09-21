---
id: installation
title: Installation
---

Docusaurus was designed from the ground up to be easily installed and used to get your website up an running quickly. To install Docusaurus, follow these steps:

1. Create a `website` folder in the root of your GitHub repo.
1. `cd website`
1. Create a `package.json` file with the following scripts that will be used when developing documentation with Docusaurus:

    ```json
    {
      "scripts": {
        "start": "docusaurus-start",
        "build": "docusaurus-build",
        "publish-gh-pages": "docusaurus-publish",
        "examples": "docusaurus-examples"
      }
    }
    ```
1. Install Docusaurus with `yarn` or `npm`

    ```
    yarn add docusaurus -dev
    ```

    or

    ```
    npm install --save-dev docusaurus
    ```
