---
id: publishing
title: Publishing your site
---

You should now have a site up and running locally. Once you have customized it to your liking, it's time to publish it. Docusaurus generates a static HTML website that is ready to be served by your favorite web server or online hosting solution.

## Building Static HTML Pages

To create a static build of your website, run the script:

```
npm run build
```

or

```
yarn run build
```

This will generate `.html` files from all of your docs and other pages included in `pages`. The build folder is inside Docusaurus's directory inside `node_modules`.

## Hosting Static HTML Pages

At this point, you can grab all of the files inside the `node_modules/docusaurus/build` folder and copy them over to your favorite web server's "html" directory. For example, both Apache and nginx serve content from `/var/www/html` by default. You'll still need to host the web server somewhere, and as it happens, choosing a web hosting provider is out of scope for this guide. Don't fret, as Docusaurus was designed to work really well with one of the most popular hosting solutions for open source projects: GitHub Pages.

### Using GitHub Pages

Deploying your Docusaurus site to GitHub Pages is straightforward if you are already using GitHub to host your project. Your code repository does not even need to be public.

1. First, generate your static HTML pages using the `build` command.
2. Copy the `node_modules/docusaurus/build` folder contents to a temporary folder **outside** of your root project folder. Make a note of where these files are saved.
3. Make sure you don't have any uncommitted changes. You can run `git status` to verify. Commit, stash, or throwaway any changes before moving on.
4. We'll use a `gh-pages` branch to host our static pages. When this approach is used, GitHub Pages expects your static pages to be located at the root of your project when the `gh-pages` branch is checked out. You can create and check out a `gh-pages` branch using the following command:

  ```
  git checkout -b gh-pages
  ```

  Alternatively, you can simply use `git branch gh-pages` to create the branch without checking it out immediately.
5. Now, make sure you have checked out `gh-pages`. You can run `git status` to verify this. You should see "On branch gh-pages" as the first line of output after running the status command. 
6. Then, clear out everything in your root project folder.
7. Remember the static HTML pages that you saved back in Step 2? Copy them over to your root project folder.
8. Commit your changes and push your `gh-pages` branch to GitHub:
  
  ```
  git commit -a -m 'deploy website' && git push origin gh-pages
  ```

You should now be able to load your website by visiting its GitHub Pages URL, which should be something along the lines of https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME. For example, Docusaurus's own GitHub Pages URL is https://facebookexperimental.github.io/docusaurus, because it is served from the `gh-pages` branch of the `facebookexperimental/docusaurus` GitHub repo.

#### Publishing updates

Whenever you change anything in your docs, you can update the website by rebuilding the static HTML pages and then copying the build folder to the `gh-pages` branch, then committing and pushing these changes to GitHub. Performing this process manually every time a doc changes can take quite a bit of time, and can lead to outdated docs. Therefore, we recommend automating deployments in some manner.

## Automating Deployments Using Continuous Integration

Continuous integration services are typically used to perform routine tasks whenever your code is updated. These tasks can be any combination of running unit tests and integration tests, automating builds, publishing packages to NPM, and yes, deploying changes to your website.

In theory, all you need to do is script the whole process of building the static HTML pages and publishing the changes to the `gh-pages` branch. Therefore, any service that allows you to automatically run a script whenever your `master` branch has new commits should allow you to set this up. 

Docusaurus provides a quick and easy way of automating deploys using Circle CI, a popular continuous integration service provider. If you're already using Circle CI for your project, all you need to do to enable automatic deployments is to configure Circle to run the `publish-gh-pages` command as part of the deployment step.

  1. Create a GitHub bot account. TODO: Cover scope, etc.
  2. TODO: Configure env variable in Circle
  3. Open your `circle.yml` file, and add the following lines to the `deployment:` section. If you don't have a `deployment:` section, you can add it at the end of the file.

  ```
  deployment:
    website:
      branch: master
      commands:
        - git config --global user.email "facebook-github-bot@users.noreply.github.com"
        - git config --global user.name "Facebook GitHub Bot"
        - echo "machine github.com login facebook-github-bot" > ~/.netrc
        - npm install && cd website && GIT_USER=facebook-github-bot USE_SSH=true npm run publish-gh-pages
  ```
  4. Configure Circle to use relatively recent versions of node and npm by adding the following under the `machine:` section in `circle.yml`:

  ```
  machine:
    node:
      version: 6.11.2
    npm:
      version: 3.10.10
  ``` 

  TODO: What's the minimum? Should we tell people to use latest, and maybe make a note of what the minimum requirement is in case they already load node/npm and need to figure out which version to use?

Now, whenever a new commit lands in `master`, Circle will run your suite of tests and, if everything passes, your website will be deployed via the `publish-gh-pages` script.

TODO: This needs some work.