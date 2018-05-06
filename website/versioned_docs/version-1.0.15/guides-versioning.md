---
id: version-1.0.15-versioning
title: Versioning
original_id: versioning
---

You can use the `version` script to cut a new documentation version based on the latest content in the `docs` folder. That specific set of documentation will then be preserved and accessible even as the documentation in the `docs` folder changes moving forward.

## How to Create New Versions

Run the following script to generate a starter versions page listing all the site versions:

```bash
yarn examples versions
```

This creates the `pages/en/versions.js` file.

You can edit this file later on to customize how you display the versions.

Add the following script to your `package.json` file if it doesn't already exist:

```js
...
"scripts": {
  "version": "docusaurus-version"
},
...
```

Run the script with a command line argument of the version you wish to create. e.g.,

```bash
yarn run version 1.0.0
```

This will preserve all documents currently in the `docs` folder and make them available as documentation for version `1.0.0`.

If, for example, you ran the version script with `1.0.0` as the version number, version `1.0.0` is considered the latest release version for your project. The site will display the version number next to the title in the header. This version number links to a versions page that you created earlier.

Documents in the `docs` folder will be considered part of version `next` and they are available, for example, at the url `docs/next/doc1.html`. Documents from the latest version use the url `docs/doc1.html`.

Running the script again with `yarn run version 2.0.0` will create a version `2.0.0`, making version `2.0.0` the most recent set of documentation. Documents from version `1.0.0` will use the url `docs/1.0.0/doc1.html` while `2.0.0` will use `docs/doc1.html`.

This table below summarizes Docusaurus versioning at a glance:

| Version | Tag | URL
| --- | --- | --- |
| 1.0.0 | 1.0.0 | docs/1.0.0/doc1.html |
| 1.0.1 | 1.0.1 | docs/1.0.1/doc1.html |
| 2.0.0 | current | docs/doc1.html |
| `master` branch | next | docs/next/doc1.html |

## Versioning Patterns

You can create version numbers in whatever format you wish, and a new version can be created with any version number as long as it does not match an existing version. Version ordering is determined by the order in which versions are created, independently of how they are numbered.

## Storing Files for Each Version

Versioned documents are placed into `website/versioned_docs/version-${version}`, where `${version}` is the version number you supplied the `version` script.

The markdown header for each versioned doc is altered by renaming the id front matter field to `original_id`, then using `"version-${version}-${original_id}"` as the value for the actual `id` field.

Versioned sidebars are copied into `website/versioned_sidebars` and are named as `version-${version}-sidebars.json`.

A `website/versions.json` file is created the first time you cut a version and is used by Docusaurus to detect what versions exist. Each time a new version is added, it gets added to the `versions.json` file.

If you wish to change the documentation for a past version, you can access the files for that respective version.

## Fallback Functionality

Only files in the `docs` folder and sidebar files that differ from those of the latest version will get copied each time a new version is specified. If there is no change across versions, Docusaurus will use the file from the latest version with that file.

For example, a document with the original id `doc1` exists for the latest version, `1.0.0`, and has the same content as the document with the id `doc1` in the `docs` folder. When a new version `2.0.0` is created, the file for `doc1` will not be copied into `versioned_docs/version-2.0.0/`. There will still be a page for `docs/2.0.0/doc1.html`, but it will use the file from version `1.0.0`.

## Renaming Existing Versions

To rename an existing version number to something else, first make sure the following script is in your `package.json` file:

```js
...
"scripts": {
  "rename-version": "docusaurus-rename-version"
},
...
```

Run the script with command line arguments of first, the current version name, then second, the new version name. e.g.,

```bash
yarn run rename-version 1.0.0 1.0.1
```

## Versioning and Translations

If you wish to use versioning and translations features, the `crowdin.yaml` file should be set up to upload and download versioned documents to and from Crowdin for translation. Translated, versioned files will go into the folder `translated_docs/${language}/version-${version}/`. For more information, check out the [translations guide](guides-translation.md).
