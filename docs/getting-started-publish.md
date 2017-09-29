---
id: publish
title: Publishing Your Website
---

## Automatically Publish Your Website with Circle

You can use CircleCI to publish your website whenever your project repo is updated. Configure your circle.yml file in your project repo to run commands to publish to GitHub Pages. An example is shown here:

```yaml
machine:
  node:
    version: 6.10.3
  npm:
    version: 3.10.10

test:
  override:
    - "true"

deployment:
  website:
    branch: master
    commands:
      - git config --global user.email "test-site-bot@users.noreply.github.com"
      - git config --global user.name "Website Deployment Script"
      - echo "machine github.com login test-site-bot password $GITHUB_TOKEN" > ~/.netrc
      - cd website && npm install && GIT_USER=test-site-bot npm run publish-gh-pages
```

Note that in this case a GitHub user `test-site-bot` is created to use just for publishing. Make sure to give your Git user push permissions for your project and to set a GITHUB_TOKEN environment variable in Circle.

If you wish to manually publish your website with the `publish-gh-pages` script, run the following example command with the appropriate variables for your project:

```
DEPLOY_USER=deltice GIT_USER=test-site-bot CIRCLE_PROJECT_USERNAME=deltice CIRCLE_PROJECT_REPONAME=test-site CIRCLE_BRANCH=master npm run publish-gh-pages
```

## Manually Publishing Your Website

Docusaurus can generate all related HTML, JavaScript, CSS, and image assets.

Run the command:

`yarn run build`

All corresponding files will be placed in a `build` folder inside your Docusaurus project folder.

From here you can copy the folder, or write a script to deploy where you wish.