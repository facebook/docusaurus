---
id: versioning
title: Versioning Documentation
---

## Overview

Docusaurus has built-in versioning features to allow users to maintain different sets of documentation for the different versions of their projects. Users can use a script to cut a version of their documents from the current ones in the `docs` folder. This will preserve these docs as docs for a specified version, and users can continue updating files in the `docs` folder to reflect the latest version of their projects.

## How to Create New Versions

Add the following script to your `package.json` file:

```json
...
"scripts": {
  "version": "docusaurus-version"
},
...
```

Run the script with a command line argument of the version you wish to create.

```bash
npm run version 1.0.0
```

This will preserve all documents currently in the `docs` folder and make them available as documents for version `1.0.0`.

Now, version `1.0.0` is considered the latest release version for your project, and the site will display the version number next to the title in the header.

Documents in the `docs` folder will be considered part of version `next` and they would be available, for example, at the url `docs/next/doc1.html`. Documents from the latest version use the url `docs/doc1.html`.

Running the script again with `npm run version 2.0.0` will create a version `2.0.0` which is now the most recent. Documents from version `1.0.0` will use the url `docs/1.0.0/doc1.html` while `2.0.0` will use `docs/doc1.html`.


## Versioning Patterns

Users can create version numbers with whatever format they wish and a new version can be created with any version number as long as it does not match an existing version. Version ordering is determined by the order in which versions are created, independently of how they are numbered.

## Storing Files for Each Version

Versioned documents are placed into a `versioned_docs/version-${version}` folder inside of `website`. The front matter for each versioned doc is altered by appending `"version-${version}-"` to the id and by adding an `original_id` field. Versioned sidebars are copied into the `versioned_sidebars` folder inside `website` and are named as `version-${version}-sidebar.json`. If you wish to change the documentation for a past version, you can access the files for that respective version. 

## Fallback Functionality

Only files in the `docs` folder and sidebar files that differ from those of the latest version will get copied each time a new version is specified. If there is no change across versions, Docusaurus will use the file from the latest version with that file.

Ex: A document with the original id `doc1` exists for the latest version, `1.0.0`, and has the same content as the document with the id `doc1` in the `docs` folder. When a new version `2.0.0` is created, the file for `doc1` will not be copied into `versioned_docs/version-2.0.0/`. There will still be a page for `docs/2.0.0/doc1.html`, but it will use the file from version `1.0.0`.

## Versioning and Translations

If you wish to use versioning and translations features, the `crowdin.yaml` file should be set up to upload and download versioned documents to and from Crowdin for translation. Translated, versioned files will go into the folder `translated_docs/${language}/version-${version}/`. For more information, check out the [translations guide](translation.md).
