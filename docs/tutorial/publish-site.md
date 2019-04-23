---
id: publish
title: Publish the Site
---

Next we'll learn how to publish the site to the WWW for everyone to browse! For the purpose of the tutorial, we'll use GitHub pages to host our website. But you can use any static file hosting service that you want like Netlify, Amazon S3, etc.

1. Go to `website/siteConfig.js` and fill in the following fields:

```
const siteConfig = {
  ...
  url: 'https://__username__.github.io', // Replace username with your GitHub username.
  baseUrl: '/docusaurus-classroom/', // The name of your GitHub project.
  projectName: 'testProject',  // The name of your GitHub project. Same as above.
  organizationName: 'userName' // Your GitHub username.
  ...
}
```

2. In the `website` directory, run `npm run build` or `yarn build`. This will generate a `build` directory inside the `website` directory containing the `.html` files from all of your docs and other pages included in `pages`. Make sure the `build` directory is there before running the next step.
3. Replace `<GIT_USER>` with your GitHub username and run the following command.

```
$ GIT_USER=<GIT_USER> CURRENT_BRANCH=master USE_SSH=true npm run publish-gh-pages # or yarn run publish-gh-pages
```

The built code will be pushed to the `gh-pages` branch of your repository.

4. Go to `https://__username__.github.io/docusaurus-classroom/` and view your site in action!
