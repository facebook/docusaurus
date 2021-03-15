---
title: Deploy your site 
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page will discuss multiple options available when it comes to 
deploying your docs site. Before even this happens, you need to build the files 
of your website for production. To do this, run :

```bash
npm run build
```
The static files will be generate in the build/ directory.

## Self Hosting

:::warning
It is not the most performant solution
:::


Docusaurus can be self hosted with docusaurus serve. Change your `--port` and `--host` to match appropriately.

```bash
npm run serve --build --port 80 --host 0.0.0.0
```

## Deploying to GitHub Pages
Docusaurus comes with an easy way to publish to Github Pages which is free 
hosting that comes with every GitHub repo.

`docusaurus.config.js` settings <br/>
Make changes to your `docusaurus.config.js` and add the required parameters

| Name | Description |
| --- | --- |
| `organizationName` | The GitHub user or organization that owns the repository. If you are the owner, it is your GitHub username. In the case of Docusaurus, it is "_facebook_" which is the GitHub organization that owns Docusaurus. |
| `projectName` | The name of the GitHub repository. For example, the repository name for Docusaurus is "docusaurus", so the project name is "docusaurus". |
| `url` | URL for your GitHub Page's user/organization page. This is commonly https://_username_.github.io. |
| `baseUrl` | Base URL for your project. For projects hosted on GitHub pages, it follows the format "/_projectName_/". For https://github.com/facebook/docusaurus, `baseUrl` is `/docusaurus/`. |


`Environmental` variables <br/>
Below are a few environmental variables you can pass to the deploy command

| Name | Description |
| --- | --- |
| `GIT_USER` | The username for a GitHub account that has commit access to this repo. For your own repositories, this will usually be your GitHub username. The specified `GIT_USER` must have push access to the repository specified in the combination of `organizationName` and `projectName`. |

You can also pass these optional parameters : 

| Name | Description |
| --- | --- |
| `USE_SSH` | Set to `true` to use SSH instead of the default HTTPS for the connection to the GitHub repo. |
| `DEPLOYMENT_BRANCH` | The branch that the website will be deployed to, defaults to `gh-pages` for normal repos and `master` for repository names ending in `github.io`. |
| `CURRENT_BRANCH` | The branch that contains the latest docs changes that will be deployed. Usually, the branch will be `master`, but it could be any branch (default or otherwise) except for `gh-pages`. If nothing is set for this variable, then the current branch will be used. |
| `GIT_PASS` | Password (or token) of the `git` user (specified by `GIT_USER`). For example, to facilitate non-interactive deployment (e.g. continuous deployment) |


`Deploy`
To deploy your site to GitHub pages, run :

````mdx-code-block
<Tabs
  defaultValue="bash"
  values={[
    { label: 'Bash', value: 'bash' },
    { label: 'Windows', value: 'windows' },
    { label: 'PowerShell', value: 'powershell' }
]}>
<TabItem value="bash">

```bash
GIT_USER=<GITHUB_USERNAME> yarn deploy
```

</TabItem>
<TabItem value="windows">

```batch
cmd /C "set "GIT_USER=<GITHUB_USERNAME>" && yarn deploy"
```

</TabItem>
<TabItem value="powershell">

```powershell
cmd /C 'set "GIT_USER=<GITHUB_USERNAME>" && yarn deploy'
```

</TabItem>
</Tabs>
````

