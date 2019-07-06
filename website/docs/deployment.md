---
id: deployment
title: Deployment
---

To build the static files of your website for production, run:

```bash
npm build
```

Once it finishes, you should see the production build under the `build/` directory.

You can deploy your site to static site hosting services such as [GitHub Pages](https://pages.github.com/), [Netlify](https://www.netlify.com/). Docusaurus sites are server rendered so they work without JavaScript too!

## Deploying to GitHub Pages

Docusaurus provides a easy way to publish to GitHub Pages.

### `docusaurus.config.js` settings

First, modify your `docusaurus.config.js` and add the required params:

| Name | Description |
| --- | --- |
| `organizationName` | The GitHub user or organization that owns the repository. If you are the owner, it is your GitHub username. In the case of Docusaurus, it is "_facebook_" which is the GitHub organization that owns Docusaurus. |
| `projectName` | The name of the GitHub repository. For example, the repository name for Docusaurus is "docusaurus", so the project name is "docusaurus". |
| `url` | URL for your GitHub Page's user/organization page. This is commonly https://_username_.github.io. |
| `baseUrl` | Base URL for your project. For projects hosted on GitHub pages, it follows the format "/_projectName_/". For https://github.com/facebook/docusaurus, `baseUrl` is `/docusaurus/`. |

In case you want to use your custom domain for GitHub Pages, create a `CNAME` file in the `static` directory. Anything within the `static` directory will be copied to the root of the `build` directory for deployment.

You may refer to GitHub Pages' documentation [User, Organization, and Project Pages](https://help.github.com/en/articles/user-organization-and-project-pages) for more details.

Example:

```jsx
module.exports = {
  ...
  url: 'https://endiliey.github.io', // Your website URL
  baseUrl: '/',
  projectName: 'endiliey.github.io',
  organizationName: 'endiliey'
  ...
}
```

### Environment Settings

Specify the Git user as an environment variable.

| Name | Description |
| --- | --- |
| `GIT_USER` | The username for a GitHub account that has commit access to this repo. For your own repositories, this will usually be your GitHub username. The specified `GIT_USER` must have push access to the repository specified in the combination of `organizationName` and `projectName`. |

There are two more optional parameters that are set as environment variables:

| Name | Description |
| --- | --- |
| `USE_SSH` | Set to `true` to use SSH instead of the default HTTPS for the connection to the GitHub repo. |
| `CURRENT_BRANCH` | The branch that contains the latest docs changes that will be deployed. Usually, the branch will be `master`, but it could be any branch (default or otherwise) except for `gh-pages`. If nothing is set for this variable, then the current branch will be used. |

### Deploy

Finally, to deploy your site to GitHub Pages, run:

```bash
GIT_USER=[yourGitHubUserName] yarn run deploy
```

<!--
TODO: Talk about deployment steps and different hosting options.

References:
- https://www.gatsbyjs.org/docs/deploying-and-hosting/

-->

## Deployment with Netlify

_This section is a work in progress. [Welcoming PRs](https://github.com/facebook/docusaurus/issues/1640)._
