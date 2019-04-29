---
id: version-1.9.0-tutorial-version
title: Add Versions
original_id: tutorial-version
---

With an example site deployed, we can now try out one of the killer features of Docusaurus - versioned documentation. Versioned documentation helps to show relevant documention to the users for the current version of the tool they are using and also hide unreleased documentation from users, reducing confusion. Documentation for older versions are also preserved and accessible to users of older versions of the tool even as the latest documentation changes.

<img alt="Docusaurus process" src="/img/undraw_docusaurus_process.svg" class="docImage"/>

## Releasing a Version

Assuming we are happy with the current state of the documentation and we want to freeze it as the v1.0.0 docs. We first run the following command to generate a `versions.js` file, which will be used to list down all the versions of docs in the project.

```sh
npm run examples versions # yarn examples versions
```

Next, we run a command with the version we want to create, e.g. 1.0.0,

```sh
npm run version 1.0.0 # yarn version 1.0.0
```

This will preserve all documents currently in the `docs` directory and make them available as documentation for version 1.0.0.

Documents in the `docs` directory will be considered part of version next and they are available, for example, at the URL `localhost:3000/<baseUrl>/docs/next/doc1`. Documents from the latest version use the URL `docs/doc1`.

Let's test out that versioning actually works. We can go to `docs/doc1.md` and change the first line of the body:

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

If we go to the `localhost:3000/<baseUrl>/docs/doc1` URL in our browser, realize that it's still showing the previous line. That's because the version we're looking at now is the 1.0.0 version, which has already been frozen in time.

## Next Version

The latest versions of the docs have to be accessed by adding `next` to the URL: `localhost:3000/<baseUrl>/docs/next/doc1`. Note that the version beside the title also changes to `next` when we are on that URL.

A versions page has been created for us at `localhost:3000/<baseUrl>/versions` which shows a list of the current versions of the documentation. See that both `1.0.0` and `master` are being listed here and they correctly link to the respective versions of documentation.

Go ahead and publish your versioned site!

## Wrap Up

That's all folks! In this short tutorial you have experienced how easy it was to create a documentation website from scratch and making versions for them. There are many more things you can do with Docusaurus, such as adding a blog, search and translations. Check out the Guides section for more.
