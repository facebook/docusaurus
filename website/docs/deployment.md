---
id: deployment
title: Deployment
---

To build the static files for your website, just run this command. After that, check your **build** folder.

```bash
yarn build
```

You can deploy it to GitHub pages, netlify, etc. It's completely up to you. The site is server rendered so it works without JavaScript too !

## Deploying to GitHub pages

Docusaurus provide a very easy way of publishing to GitHub pages.
First, you need to modify your `docusaurus.config.js` and add the required params


| Name               | Description                                                                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `organizationName` | The GitHub user or organization that owns the repository. If you are the owner, then it is your GitHub username. In the case of Docusaurus, that would be the "_facebook_" GitHub organization.                                                   |
| `projectName`      | The name of the GitHub repository for your project. For example, the source code for Docusaurus is hosted at https://github.com/facebook/docusaurus, so our project name in this case would be "docusaurus". |
| `url`              | Your website's URL. For projects hosted on GitHub pages, this will be "https://_username_.github.io" |
| `baseUrl`          | Base URL for your project. For projects hosted on GitHub pages, it follows the format "/_projectName_/". For https://github.com/facebook/docusaurus, `baseUrl` is `/docusaurus/`. |

Example:

```js
const siteConfig = {
  ...
  url: 'https://endiliey.github.io', // Your website URL
  baseUrl: '/',
  projectName: 'endiliey.github.io',
  organizationName: 'endiliey'
  ...
}
```

3. Now you have to specify the git user as an environment variable and run the deploy script

| Name       | Description                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GIT_USER` | The username for a GitHub account that has commit access to this repo. For your own repositories, this will usually be your own GitHub username. The specified `GIT_USER` must have push access to the repository specified in the combination of `organizationName` and `projectName`. |

Example:

```bash
GIT_USER=endiliey yarn run deploy
```

There are also two optional parameters that are set as environment variables:

| Name             | Description                                                                                                                                                                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `USE_SSH`        | If this is set to `true`, then SSH is used instead of HTTPS for the connection to the GitHub repo. HTTPS is the default if this variable is not set.                                                                                                              |
| `CURRENT_BRANCH` | The branch that contains the latest docs changes that will be deployed. Usually, the branch will be `master`, but it could be any branch (default or otherwise) except for `gh-pages`. If nothing is set for this variable, then the current branch will be used. |
