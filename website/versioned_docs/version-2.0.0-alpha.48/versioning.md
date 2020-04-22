---
id: versioning
title: Versioning
---

You can use the version script to cut a new documentation version based on the latest content in the `docs` directory. That specific set of documentation will then be preserved and accessible even as the documentation in the `docs` directory changes moving forward.

## :warning: Disclaimer

:::important

Consider it really well before starting to version your documentation.

:::

Most of the times, you don't need versioning and it will just increase your build time and introduces complexity to your codebase. Versioning is **best suited for website with high-traffic and rapid changes in documentation between version**. If your documentation rarely changes, don't add versions to the website.

To better understand how versioning works and see if it suits your needs, you can read on below.

## Directory structure

```shell
website
├── sidebars.json        # sidebar for master (next) version
├── docs                 # docs directory for master (next) version
│   ├── foo
│   │   └── bar.md       # https://mysite.com/docs/next/foo/bar
│   └── hello.md         # https://mysite.com/docs/next/hello
├── versions.json        # file to indicate what versions are available
├── versioned_docs
│   ├── version-1.1.0
│   │   ├── foo
│   │   │   └── bar.md   # https://mysite.com/docs/foo/bar
│   │   └── hello.md
│   └── version-1.0.0
│       ├── foo
│       │   └── bar.md   # https://mysite.com/docs/1.0.0/foo/bar
│       └── hello.md
├── versioned_sidebars
│   ├── version-1.1.0-sidebars.json
│   └── version-1.0.0-sidebars.json
├── docusaurus.config.js
└── package.json
```

The table below explains how a versioned file maps to its version and the generated URL.

| Path                                    | Version        | URL               |
| --------------------------------------- | -------------- | ----------------- |
| `versioned_docs/version-1.0.0/hello.md` | 1.0.0          | /docs/1.0.0/hello |
| `versioned_docs/version-1.1.0/hello.md` | 1.1.0 (latest) | /docs/hello       |
| `docs/hello.md`                         | next           | /docs/next/hello  |

### Tagging a new version

1. First, make sure your content in the `docs` directory is ready to be frozen as a version. A version always should be based from master.
1. Enter a new version number.

```bash npm2yarn
npm run docusaurus docs:version 1.1.0
```

When tagging a new version, the document versioning mechanism will:

- Copy the full `docs/` folder contents into a new `versioned_docs/version-<version>/` folder.
- Create a versioned sidebars file based from your current [sidebar](sidebar.md) configuration (if it exists). Saved it as `versioned_sidebars/version-<version>-sidebars.json`.
- Append the new version number into `versions.json`.

## Files

### Creating new files

1. Place the new file into the corresponding version folder.
1. Include the reference for the new file into the corresponding sidebar file, according to version number.

**Master docs**

```shell
# The new file.
docs/new.md

# Edit the corresponding sidebar file.
sidebar.js
```

**Older docs**

```shell
# The new file.
versioned_docs/version-1.0.0/new.md

# Edit the corresponding sidebar file.
versioned_sidebars/version-1.0.0-sidebars.json
```

### Linking files

- Remember to include the `.md` extension.
- Files will be linked to correct corresponding version.
- Relative paths work as well.

```md
The [@hello](hello.md#paginate) document is great!

See the [Tutorial](../getting-started/tutorial.md) for more info.
```

## Versions

Each directory in `versioned_docs/` will represent a documentation version.

### Updating an existing version

You can update multiple docs versions at the same time. Because each directory in `versioned_docs/` represents specific routes when published.

1. Edit any file.
1. Commit and push changes.
1. It will be published to the version.

**Example:** When you change any file in `versioned_docs/version-2.6/`, it will only affect the docs for version `2.6`.

### Deleting an existing version

You can delete/remove versions as well.

1. Remove the version from `versions.json`.

Example:

```diff {4}
[
  "2.0.0",
  "1.9.0",
- "1.8.0"
]
```

2. Delete the versioned docs directory. Example: `versioned_docs/version-1.8.0`.
3. Delete the versioned sidebars file. Example: `versioned_sidebars/version-1.8.0-sidebars.json`.

## Recommended practices

### Version your documentation only when needed

For example, you are building a documentation for your npm package `foo` and you are currently in version 1.0.0. You then release a patch version for a minor bug fix and it's now 1.0.1.

Should you cut a new documentation version 1.0.1? **You probably shouldn't**. 1.0.1 and 1.0.0 docs shouldn't differ according to semver because there are no new features!. Cutting a new version for it will only just create unnecessary duplicated files.

### Keep the number of versions small

As a good rule of thumb, try to keep the number of your versions below 10. **It is very likely** that you will have a lot of obsolete versioned documentation that nobody even reads anymore. For example, [Jest](https://jestjs.io/versions) is currently in version `24.9`, and only maintains several latest documentation version with the lowest being `22.X`. Keep it small 😊

### Use absolute import within the docs

Don't use relative paths import within the docs. Because when we cut a version the paths no longer work (the nesting level is different, among other reasons). You can utilize the `@site` alias provided by docusaurus, that points to the `website` directory. Example:

```diff
- import Foo from '../src/components/Foo';
+ import Foo from '@site/src/components/Foo';
```
