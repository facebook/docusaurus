---
id: version-1.13.0-tutorial-publish-site
title: Publish the Site
original_id: tutorial-publish-site
---

<img alt="Docusaurus Facebook" src="/img/undraw_docusaurus_fb.svg" class="docImage"/>

Next, we'll learn how to publish the site to the WWW for everyone to browse! For the purpose of the tutorial, we'll use GitHub Pages to host our website. But you can use any static file hosting service that you want, like Netlify, Amazon S3, etc.

## Put the Site Online

1. Edit the file `docusaurus-tutorial/website/siteConfig.js` and fill in the following values:

```
const siteConfig = {
  ...
  url: 'https://USERNAME.github.io', // Replace USERNAME with your GitHub username.
  baseUrl: '/docusaurus-tutorial/', // The name of your GitHub project.
  projectName: 'docusaurus-tutorial',  // The name of your GitHub project. Same as above.
  organizationName: 'USERNAME' // Your GitHub username.
  ...
}
```

2. In Terminal or Git Bash, kill the web server by pressing **Cmd+C** or **Ctrl+C**.
3. In the `website` directory, run `npm run build` or `yarn build`. The command generates a `build` directory inside the `website` directory, containing HTML files (and other file types) for all of your docs and other pages. Make sure the `docusaurus-tutorial/website/build` directory is successfully created before running the next step.
4. Replace `USERNAME` with your GitHub username and run the following command.

```sh
GIT_USER=USERNAME CURRENT_BRANCH=master USE_SSH=true npm run publish-gh-pages # SSH
# or
GIT_USER=USERNAME CURRENT_BRANCH=master npm run publish-gh-pages # HTTPS
```

The HTML files (and other file types) are pushed to the `gh-pages` branch of your repository:  https://github.com/USERNAME/docusaurus-tutorial.

5. Go to https://USERNAME.github.io/docusaurus-tutorial/ and view your site in action!

> Note that when you run `npm run start` again, the `baseUrl` will now be part of the path.
