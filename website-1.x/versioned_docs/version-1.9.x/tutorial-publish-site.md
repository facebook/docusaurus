---
id: version-1.9.x-tutorial-publish-site
title: Publish the Site
original_id: tutorial-publish-site
---

<img alt="Docusaurus Facebook" src="/img/undraw_docusaurus_fb.svg" class="docImage"/>

Next we'll learn how to publish the site to the WWW for everyone to browse! For the purpose of the tutorial, we'll use GitHub pages to host our website. But you can use any static file hosting service that you want, e.g. Netlify, Amazon S3, etc.

## Put the Site Online

Kill the web server first by pressing Cmd + C or Ctrl + C depending on your operating system.

In `website/siteConfig.js`, fill in the following fields:

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

2. In the `website` directory, run `npm run build` or `yarn build`. This will generate a `build` directory inside the `website` directory containing the `.html` files from all of your docs and other pages included in `pages`. Make sure the `build` directory is there before running the next step.
3. Replace `<GIT_USER>` with your GitHub username and run the following command.

```
$ GIT_USER=<GIT_USER> CURRENT_BRANCH=master USE_SSH=true npm run publish-gh-pages
```

The built code will be pushed to the `gh-pages` branch of your repository.

4. Go to `https://USERNAME.github.io/docusaurus-tutorial/` and view your site in action!

> Note that when you run `npm run start` again, the `baseUrl` will now be part of the path.
