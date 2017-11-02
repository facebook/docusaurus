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

At this point, you can grab all of the files inside the `website/build` folder and copy them over to your favorite web server's "html" directory. For example, both Apache and nginx serve content from `/var/www/html` by default. You'll still need to host the web server somewhere, and as it happens, choosing a web hosting provider is out of scope for this guide. Don't fret, as Docusaurus was designed to work really well with one of the most popular hosting solutions for open source projects: [GitHub Pages](https://pages.github.com/).

### Using GitHub Pages

Deploying your Docusaurus site to GitHub Pages is straightforward if you are already using GitHub to host your project. Your code repository does not even need to be public.

> Even if your repo is private, anything published to a `gh-pages` branch will be [public](https://help.github.com/articles/user-organization-and-project-pages/).

Most of the work to publish to GitHub pages is done for you automatically through the [`publish-gh-pages`](./commands.md#docusaurus-publish) script. You just need to determine the values for a few parameters required by the script.

```
GIT_USER=<GIT_USER> \
  CIRCLE_PROJECT_USERNAME=<CIRCLE_PROJECT_REPONAME> \
  CIRCLE_PROJECT_REPONAME=<CIRCLE_PROJECT_USERNAME> \
  CIRCLE_BRANCH=master \
  yarn run publish-gh-pages
```

The require parameters are:

- `CIRCLE_PROJECT_REPONAME`: The name of the GitHub repository for your project. For example, Docusaurus is hosted at https://github.com/facebookexperimental/docusaurus, so our repo name in this case would be "docusaurus".
- `CIRCLE_PROJECT_USERNAME`: The GitHub user or organization that owns the repository. In the case of Docusaurus, that would be the "facebookexperimental" GitHub organization.
- `GITHUB_USERNAME`: The username for a GitHub account that has commit access to this repo. For your own repositories, this will usually be your own GitHub username.
- `CIRCLE_BRANCH`: The branch that contains the latest docs changes that will be deployed. Usually, "master".

Once you have the parameters information, you can go ahead and run the publish script, ensuring you have inserted your own values inside the `<...>` placeholders above:

```
yarn run publish-gh-pages # or `npm run publish-gh-pages`
```

You should now be able to load your website by visiting its GitHub Pages URL, which should be something along the lines of https://CIRCLE_PROJECT_USERNAME.github.io/CIRCLE_PROJECT_REPONAME. For example, Docusaurus's own GitHub Pages URL is https://facebookexperimental.github.io/docusaurus, because it is served from the `gh-pages` branch of the https://github.com/facebookexperimental/docusaurus GitHub repo. We highly encourage reading through the [GitHub Pages documentation](https://pages.github.com) to learn more about how this hosting solution works.

You can run the command above any time you update the docs and wish to deploy the changes to your site. Running the script manually may be fine for sites where the documentation rarely changes and it is not too much of an inconvenience to remember to manually deploy changes.

However, you can automate the publishing process with continuous integration (CI).

## Automating Deployments Using Continuous Integration

Continuous integration (CI) services are typically used to perform routine tasks whenever new commits are checked in to source control. These tasks can be any combination of running unit tests and integration tests, automating builds, publishing packages to NPM, and yes, deploying changes to your website. All you need to do to automate deployment of your website is to invoke the `publish-gh-pages` script whenever your docs get updated. In the following section we'll be covering how to do just that using [Circle CI](https://circleci.com/), a popular continuous integration service provider.

### Using Circle CI

If you're already using Circle CI for your project, all you need to do to enable automatic deployments is to configure Circle to run the `publish-gh-pages` script as part of the deployment step.

  1. Go to https://github.com/settings/tokens and generate a new [personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/), granting it full control of private repositories through the `repo` access scope. Store this token in a safe place, making sure to not share it with anyone. This token can be used to authenticate GitHub actions on your behalf in place of your GitHub password.
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
          - cd website && npm install && GIT_USER=<GITHUB_USERNAME> npm run publish-gh-pages
    ```

Make sure to replace `<GITHUB_USERNAME>` with your actual GitHub username.

**DO NOT** place the actual value of $GITHUB_TOKEN in `circle.yml`. We already configured that as an environment variable back in Step 3.

Since the script will run within the Circle environment, the values of `CIRCLE_PROJECT_USERNAME`, `CIRCLE_PROJECT_REPONAME`, and `CIRCLE_BRANCH` are already defined as environment variables and will be picked up by the script automatically.

Now, whenever a new commit lands in `master`, Circle will run your suite of tests and, if everything passes, your website will be deployed via the `publish-gh-pages` script.

> If you would rather use a deploy key instead of a personal access token, you can by starting with the Circle CI [instructions](https://circleci.com/docs/1.0/adding-read-write-deployment-key/) for adding a read/write deploy key.
