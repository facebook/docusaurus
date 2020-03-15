---
id: deployment
title: Deployment
---

To build the static files of your website for production, run:

```bash npm2yarn
npm run build
```

Once it finishes, you should see the production build under the `build/` directory.

You can deploy your site to static site hosting services such as [ZEIT Now](https://zeit.co/now), [GitHub Pages](https://pages.github.com/), [Netlify](https://www.netlify.com/), [Render](https://render.com/static-sites), and [Surge](https://surge.sh/help/getting-started-with-surge). Docusaurus sites are statically rendered so they work without JavaScript too!

## Deploying to ZEIT Now

Deploying your Docusaurus project to [ZEIT Now](https://zeit.co/now) will provide you with [various benefits](https://zeit.co/now) in the areas of performance and ease of use.

Most importantly, however, deploying a Docusaurus project only takes a couple seconds:

1. First, install their [command-line interface](https://zeit.co/download):

```bash
npm i -g now
```

2. Run a single command inside the root directory of your project:

```bash
now
```

**That's all.** Your docs will automatically be deployed.

Now you can connect your site to [GitHub](https://zeit.co/github) or [GitLab](https://zeit.co/gitlab) to automatically receive a new deployment every time you push a commit.

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

```jsx {3-6}
module.exports = {
  ...
  url: 'https://endiliey.github.io', // Your website URL
  baseUrl: '/',
  projectName: 'endiliey.github.io',
  organizationName: 'endiliey'
  ...
}
```

### Environment settings

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

**Bash**

```bash
GIT_USER=<GITHUB_USERNAME> yarn deploy
```

**Windows**

```batch
cmd /C "set "GIT_USER=<GITHUB_USERNAME>" && yarn deploy"
```

<!--
TODO: Talk about deployment steps and different hosting options.

References:
- https://www.gatsbyjs.org/docs/deploying-and-hosting/

-->

## Deploying to Netlify

To deploy your Docusaurus 2 sites to [Netlify](https://www.netlify.com/), first make sure the following options are properly configured:

```js {3-4}
// docusaurus.config.js
module.exports = {
  url: 'https://docusaurus-2.netlify.com', // url to your site with no trailing slash
  baseUrl: '/', // base directory of your site relative to your repo
};
```

Then, [create your site with Netlify](https://app.netlify.com/start).

While you set up the site, specify the build commands and directories as follows:

- build command: `npm run build`
- build directory: `build`

If you did not configure these build options, you may still go to "Site settings" -> "Build and deploy" after your site is created.

Once properly configured with the above options, your site should deploy and automatically redeploy upon merging to your deploy branch, which defaults to `master`.

## Deploying to Render

Render offers [free static site hosting](https://render.com/docs/static-sites) with fully managed SSL, custom domains, a global CDN and continuous auto deploys from your Git repo. Deploy your app in just a few minutes by following these steps.

1. Create a new **Web Service** on Render, and give Render permission to access your Docusaurus repo.

2. Select the branch to deploy. The default is `master`.

3. Enter the following values during creation.

   | Field                 | Value         |
   | --------------------- | ------------- |
   | **Environment**       | `Static Site` |
   | **Build Command**     | `yarn build`  |
   | **Publish Directory** | `build`       |

That's it! Your app will be live on your Render URL as soon as the build finishes.

## Deploying with Surge

Surge is a [static web hosting platform](https://surge.sh/help/getting-started-with-surge), it is used to deploy your Docusaurus project from command line in a minute. Deploying your project to surge is easy and it’s also free (including a custom domain and SSL).

Deploy your app in a matter of seconds using surge with the following steps:

1. First, install surge using npm by running the following command:

```bash
npm install --g surge
```

2. To build the static files of your site for production in the root directory of your project, run:

```bash
npm run build
```

3. Then, run this command inside the root directory of your project:

```bash
surge build/
```

First time users of Surge would be prompted to create an account from the command line(happens only once).

Confirm that the site you want to publish is in the `build` directory, a randomly generated subdomain `*.surge.sh subdomain` is always given(which can be edited).

### Using your domain

If you have a domain name you can deploy your site using surge to your domain using the command:

```bash
surge build/ yourdomain.com
```

You site is now deployed for free at `subdomain.surge.sh` or `yourdomain.com` depending on the method you chose.

### Setting up CNAME file

Store your domain in a CNAME file for future deployments with the following command:

```bash
echo subdomain.surge.sh > CNAME
```

You can deploy any other changes in the future with the command `surge`
