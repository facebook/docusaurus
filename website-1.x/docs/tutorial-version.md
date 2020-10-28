---
id: tutorial-version
title: Add Versions
---

With an example site deployed, we can now try out one of the killer features of Docusaurus &mdash; versioned documentation. Versioned documentation helps to show relevant documentation for the current version of a tool and also hide unreleased documentation from users, reducing confusion. Documentation for older versions is also preserved and accessible to users of older versions of a tool even as the latest documentation changes.

<img alt="Docusaurus process" src="/img/undraw_docusaurus_process.svg" class="docImage"/>

## Releasing a Version

Assume you are happy with the current state of the documentation and want to freeze it as the v1.0.0 docs. First you `cd` to the `website` directory and run the following command.

```sh
npm run examples versions
```

That command generates a `versions.json` file, which will be used to list down all the versions of docs in the project.

Next, you run a command with the version you want to create, like `1.0.0`.

```sh
npm run version 1.0.0
```

That command preserves a copy of all documents currently in the `docs` directory and makes them available as documentation for version 1.0.0. The `docs` directory is copied to the `website/versioned_docs/version-1.0.0` directory.

### Current Version

Type `npm start` and you will see the version beside the title. Version 1.0.0, the number of your current version, shows at the URL http://localhost:3000/docusaurus-tutorial/docs/doc1.

Let's test out how versioning actually works. Open `docs/doc1.md` and change the first line of the body:

```diff
---
id: doc1
title: Latin-ish
sidebar_label: Example Page
---

- Check the [documentation](https://docusaurus.io) for how to use Docusaurus.
+ This is the latest version of the docs.

## Lorem

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies.
```

If you go to http://localhost:3000/docusaurus-tutorial/docs/doc1 in your browser, realize that it's still showing the line before the change. That's because the version you're looking at is the 1.0.0 version, which has already been frozen in time. The document you changed is part of the next version.

### Next Version

The latest version of the documents is viewed by adding `next` to the URL: http://localhost:3000/docusaurus-tutorial/docs/next/doc1. Now you can see the line change to "This is the latest version of the docs." Note that the version beside the title changes to "next" when you open that URL.

Click the version to open the versions page, which was created at http://localhost:3000/docusaurus-tutorial/versions with a list of the documentation versions. See that both `1.0.0` and `master` are listed there and they link to the respective versions of the documentation.

The master documents in the `docs` directory became version next when the `website/versioned_docs/version-1.0.0` directory was made for version 1.0.0.

### Past Versions

Assume the documentation changed and needs an update. You can release another version, like `1.0.1`.

```sh
npm run version 1.0.1
```

Version 1.0.0 remains available as a past version. You can view it by adding `1.0.0` to the URL, http://localhost:3000/docusaurus-tutorial/docs/1.0.0/doc1. Also, a link to version 1.0.0 appears on the versions page.

Go ahead and [publish](https://docusaurus.io/docs/en/next/tutorial-publish-site) your versioned site with the `publish-gh-pages` script!

## Wrap Up

That's all folks! In this short tutorial, you have experienced how easy it is to create a documentation website from scratch and make versions for them. There are many more things you can do with Docusaurus, such as adding a blog, search and translations. Check out the [Guides](https://docusaurus.io/docs/en/next/versioning) section for more.
