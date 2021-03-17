---
title: Manage Versions
---

Docusaurus gives you the option to have different versions of your docs, allowing you to update and have previous versions available.

### Tagging a new version

To tag a new version make sure the content in the `docs` directory is ready to be frozen as a version. Run the following command to tag a version

```bash
npm run docusaurus docs:version <version>
```

When a new `version` is tagged, the `docs/` directory content will be copied into `versioned_docs/version-<version>/` folder. A [sidebar](https://v2.docusaurus.io/docs/docs-introduction#sidebar) configuration will also be copiend and the version number added to `versions.json`.

## Updating an existing version

You can edit any version in its specific folder, comit and push changes and it will be published to that version. Example when you change any file in `versioned_docs/version-2.6/`, it will only affect the docs for `version 2.6`

## Deleting an existing version

You can delete an existing version by removing the version from `versions.json` file, deleting the docs directory, Example : `versioned_docs/version-1.8.0` and deleting the versioned sidebar file, Example : `versioned_sidebars/version-1.8.0-sidebars.json`.

After tagging a new version or deleting an existing version, you can restart the site with `yarn restart` or `npm restart`.
