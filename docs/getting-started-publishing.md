---
id: publishing
title: Publishing your site
---

You should now have a [site up and running locally](getting-started-site-creation.md). Once you have [customized](api-site-config.md) it to your liking, it's time to publish it. Docusaurus generates a static HTML website that is ready to be served by your favorite web server or online hosting solution.

## Building Static HTML Pages

To create a static build of your website, run the following script from the `website` directory:

```
yarn run build # or `npm run build`
```

This will generate a `build` folder inside the `website` directory containing the `.html` files from all of your docs and other pages included in `pages`.

## Hosting Static HTML Pages

At this point, you can grab all of the files inside the `website/build` folder and copy them over to your favorite web server's "html" directory.

> For example, both Apache and nginx serve content from `/var/www/html` by default. That said, choosing a web server or provider is outside the scope of Docusaurus.

### Using GitHub Pages

While choosing a web server or host is outside Docusaurus' scope, Docusaurus was designed to work really well with one of the most popular hosting solutions for open source projects: [GitHub Pages](https://pages.github.com/).

Deploying your Docusaurus site to GitHub Pages is straightforward if you are already using GitHub to host your project. Your code repository does not even need to be public.

> Even if your repo is private, anything published to a `gh-pages` branch will be [public](https://help.github.com/articles/user-organization-and-project-pages/).

Most of the work to publish to GitHub pages is done for you automatically through the [`publish-gh-pages`](./commands.md#docusaurus-publish) script. You just need to determine the values for a few parameters required by the script.

Two of the required parameters are set in the [`siteConfig.js`](api-site-config.md):

- `organizationName`: The GitHub user or organization that owns the repository. In the case of Docusaurus, that would be the "facebook" GitHub organization.
- `projectName`: The name of the GitHub repository for your project. For example, Docusaurus is hosted at https://github.com/facebook/docusaurus, so our project name in this case would be "docusaurus".

> While we recommend setting the above in `siteConfig.js`, you can also use environment variables `ORGANIZATION_NAME` and `PROJECT_NAME`.

One of the required parameters are set as environment variables:

- `GIT_USER`: The username for a GitHub account that has commit access to this repo. For your own repositories, this will usually be your own GitHub username.

There is also an optional parameter that is set as an environment variable. If nothing is set for this variable, then the current branch will be used.

- `CURRENT_BRANCH`: The branch that contains the latest docs changes that will be deployed. Usually, the branch will be `master`, but it could be any branch (default or otherwise) except for `gh-pages`.

> We currently require the published documentation to be served from the `gh-pages` branch in your GitHub repo.

Once you have the parameter value information, you can go ahead and run the publish script, ensuring you have inserted your own values inside the various parameter placeholders:

To run the script directly from the command-line, you can use the following, filling in the parameter values as appropriate.

```
GIT_USER=<GIT_USER> \
  CURRENT_BRANCH=master \
  yarn run publish-gh-pages # or `npm run publish-gh-pages`
```

> The specified `GIT_USER` must have push access to the repository specified in the combination of `organizationName` and `projectName`.

You should now be able to load your website by visiting its GitHub Pages URL, which could be something along the lines of https://organizationName.github.io/projectName, or a custom domain if you have set that up. For example, Docusaurus' own GitHub Pages URL is https://docusaurus.io (it can also be accessed via https://facebook.github.io/docusaurus), because it is served from the `gh-pages` branch of the https://github.com/facebook/docusaurus GitHub repo. We highly encourage reading through the [GitHub Pages documentation](https://pages.github.com) to learn more about how this hosting solution works.

You can run the command above any time you update the docs and wish to deploy the changes to your site. Running the script manually may be fine for sites where the documentation rarely changes and it is not too much of an inconvenience to remember to manually deploy changes.

However, you can automate the publishing process with continuous integration (CI).

## Automating Deployments Using Continuous Integration

Continuous integration (CI) services are typically used to perform routine tasks whenever new commits are checked in to source control. These tasks can be any combination of running unit tests and integration tests, automating builds, publishing packages to NPM, and yes, deploying changes to your website. All you need to do to automate deployment of your website is to invoke the `publish-gh-pages` script whenever your docs get updated. In the following section we'll be covering how to do just that using [Circle CI](https://circleci.com/), a popular continuous integration service provider.

### Using Circle CI

If you're already using Circle CI for your project, all you need to do to enable automatic deployments is to configure Circle to run the `publish-gh-pages` script as part of the deployment step.

  1. Ensure the GitHub account that will be set as the `GIT_USER` has `write` access to the repo that contains the documentation.
  1. Log into GitHub as the `GIT_USER`.
  1. Go to https://github.com/settings/tokens for the `GIT_USER` and generate a new [personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/), granting it full control of private repositories through the `repo` access scope. Store this token in a safe place, making sure to not share it with anyone. This token can be used to authenticate GitHub actions on your behalf in place of your GitHub password.
  1. Open your Circle CI dashboard, and navigate to the Settings page for your repository, then select "Environment variables". The URL looks like https://circleci.com/gh/ORG/REPO/edit#env-vars, where "ORG/REPO" should be replaced with your own GitHub org/repo.
  1. Create a new environment variable named "GITHUB_TOKEN", using your newly generated access token as the value.
  1. Open your `circle.yml` file and add the following under the `machine:` section to tell Circle to use relatively recent versions of node and npm, replacing npm with yarn if applicable:

    ```
    machine:
      node:
        version: 6.11.2
      npm:
        version: 3.10.10
    ```

  1. Then, add the following lines to the `deployment:` section. If you don't have a `deployment:` section, you can add it at the end of the file.

    ```
    deployment:
      website:
        branch: master
        commands:
          - git config --global user.email "<GITHUB_USERNAME>@users.noreply.github.com"
          - git config --global user.name "<YOUR_NAME>"
          - echo "machine github.com login <GITHUB_USERNAME> password $GITHUB_TOKEN" > ~/.netrc
          - cd website && npm install && GIT_USER=<GIT_USER> npm run publish-gh-pages
    ```

Make sure to replace `<GIT_USER>` with the actual username of the GitHub account that will be used to publish the documentation.

**DO NOT** place the actual value of `$GITHUB_TOKEN` in `circle.yml`. We already configured that as an environment variable back in Step 3.

> Unlike when you run the `publish-gh-pages` script manually, when the script runs within the Circle environment, the values of `ORGANIZATION_NAME`, `PROJECT_NAME`, and `CURRENT_BRANCH` are already defined as environment variables within CircleCI and will be picked up by the script automatically.

Now, whenever a new commit lands in `master`, CircleCI will run your suite of tests and, if everything passes, your website will be deployed via the `publish-gh-pages` script.

> If you would rather use a deploy key instead of a personal access token, you can by starting with the Circle CI [instructions](https://circleci.com/docs/1.0/adding-read-write-deployment-key/) for adding a read/write deploy key.
