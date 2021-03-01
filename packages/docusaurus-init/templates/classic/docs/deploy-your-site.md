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

## Automatically Deployment with GitHub Actions
[GitHub Actions](https://help.github.com/en/actions) allows you to run code in response to events like when new code is pushed or merged into a branch. This allows you to execute software development workflows very easily.

This workflow assumes your documentation resided in `documentation` branch of your repository and your [publishing source](https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) is configured for `gh-pages` branch.

1. Generate a new [SSH key](https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).
1. By default, your public key should have been created in `~/.ssh/id_rsa.pub` or use the name you've provided in the previous step to add your key to [GitHub deploy keys](https://developer.github.com/v3/guides/managing-deploy-keys/).
1. Copy key to clipboard with `xclip -sel clip < ~/.ssh/id_rsa.pub` and paste it as a [deploy key](https://developer.github.com/v3/guides/managing-deploy-keys/#deploy-keys) in your repository. Copy file content if the command line doesn't work for you. Check the box for `Allow write access` before saving your deployment key.
1. You'll need your private key as a [GitHub secret](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) to allow Docusaurus to run the deployment for you.
1. Copy your private key with `xclip -sel clip < ~/.ssh/id_rsa` and paste a GitHub secret with name `GH_PAGES_DEPLOY`. Copy file content if the command line doesn't work for you. Save your secret.
1. Create you [documentation workflow file](https://help.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow#creating-a-workflow-file) in `.github/workflows/`. In this example it's `documentation.yml`.

```yaml title="documentation.yml"
name: documentation

on:
  pull_request:
    branches: [documentation]
  push:
    branches: [documentation]

jobs:
  checks:
    if: github.event_name != 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: actions/setup-node@v1
        with:
          node-version: '12.x'
      - name: Test Build
        run: |
          if [ -e yarn.lock ]; then
          yarn install --frozen-lockfile
          elif [ -e package-lock.json ]; then
          npm ci
          else
          npm i
          fi
          npm run build
  gh-release:
    if: github.event_name != 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: actions/setup-node@v1
        with:
          node-version: '12.x'
      - uses: webfactory/ssh-agent@v0.5.0
        with:
          ssh-private-key: ${{ secrets.GH_PAGES_DEPLOY }}
      - name: Release to GitHub Pages
        env:
          USE_SSH: true
          GIT_USER: git
        run: |
          git config --global user.email "actions@github.com"
          git config --global user.name "gh-actions"
          if [ -e yarn.lock ]; then
          yarn install --frozen-lockfile
          elif [ -e package-lock.json ]; then
          npm ci
          else
          npm i
          fi
          npm run deploy
```

1. Now when a new pull request arrives towards your repository in branch `documentation` it will automatically ensure that Docusaurus build is successful.
1. When pull request is merged to `documentation` branch or someone pushes to `documentation` branch directly it will be built and deployed to `gh-pages` branch.
1. After this step, your updated documentation will be available on the GitHub pages.
