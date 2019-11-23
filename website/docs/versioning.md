---
title: Versioning
---

You can use the version script to cut a new documentation version based on the latest content in the `docs` directory. That specific set of documentation will then be preserved and accessible even as the documentation in the `docs` directory changes moving forward.

## :warning: Disclaimer

> Consider it really well before starting to version your documentation. 

Most of the times, you don't need versioning and it will just increase your build time and introduces complexity to your codebase. Versioning is **best suited for website with high-traffic & rapid changes in documentation between version**. If your documentation rarely changes, don't version. 

To better understand how versioning works and see if it suits your needs, you can read up below.

## Directory structure
```shell
website/
├── sidebars.json        # sidebar for master (next) version 
├── docs/                # docs directory for master (next) version
│   ├── foo/         
│   │   └── bar.md       # https://mysite.com/docs/next/foo/bar
│   └── hello.md         # https://mysite.com/docs/next/hello  
│
├── versions.json             # file to indicate what versions are available 
├── versioned_docs/               
│   ├── version-1.1.0
│   │    ├── foo
│   │    │   └── bar.md      # https://mysite.com/docs/foo/bar
│   │    └── hello.md
|   │    
│   └── version-1.0.0
│        ├── foo
│        │   └── bar.md      # https://mysite.com/docs/1.0.0/foo/bar
│        └── hello.md
├── versioned_sidebars/
│   ├── version-1.1.0-sidebars.json
│   └── version-1.0.0-sidebars.json
│
├── docusaurus.config.js
└── package.json
```

This table below summarizes Docusaurus versioning at a glance.

| Path                                    | Version         | URL                  |
| --------------------------------------- | --------------- | -------------------- |
| `versioned_docs/version-1.0.0/hello.md` | 1.0.0           | /docs/1.0.0/hello    |
| `versioned_docs/version-1.1.0/hello.md` | 1.1.0 (latest)  | /docs/hello          |
| `docs/guides/hello.md`                  | next            | /docs/next/hello     |

### Tagging a new version
1. First, finsh your work on `docs` . A version always should be based from master.
2. Enter a new version number

```bash npm2yarn
npm run docusaurus docs:version 1.1.0
```

When tagging a new version, the document versioning mechanism will:

* Copy full `docs/` folder contents into a new `versioned_docs/version-<version>/` folder.
* Create a versioned sidebars file based from your current [sidebar](sidebar.md) configuration (if exists). Saved as `versioned_sidebars/version-<version>-sidebars.json`.
* Place a new version number in `versions.json`

## Files
### Creating new files
1. Place the new file into correspondent version folder.
2. Include the reference for the new file into correspondent sidebar file, according version number.

Master docs
```shell
# the new file
docs/new.md

# edit the correspondent sidebar
sidebar.js
```

Older docs
```shell
# the new file
versioned_docs/version-1.0.0/new.md

# edit the correspondent sidebar
versioned_sidebars/version-1.0.0-sidebars.json
```

### Linking files
* Remember to include the `.md` extension.
* Files will be linked to correct corresponding version
* Relative paths work as well

```lisp
The [@hello](hello.md#paginate) document is great!

See the [Tutorial](../getting-started/tutorial.md) for more info.
```

## Versions
Each subfolder in `versioned_docs/` will represent a documentation version

### Updating an existent version
You can update multiples docs versions at the same time. Because each `docs/` subfolder represents specifics routes when published.

1. Edit any file.
2. Commit and push changes.
3. It will be published to the correspondent version.

**Example:** When you change any file from `versioned_docs/version-2.6/`, it will publish changes only for `2.6` docs version.

### Deleting an existent version
You can delete/remove version as well.

1. Remove the version from `versions.json`

Example:
```diff {4}
[
  "2.0.0",
  "1.9.0",
- "1.8.0"
]
```

2. Delete the versioned docs. Example: `versioned_docs/version-1.8.0`.
3. Delete the versioned sidebars. Example: `versioned_sidebars/version-1.8.0-sidebars.json`.

## Best Practices Recommendation

### Version your documentation only when needed

For example, you are building a documentation for your npm package `foo` and you are currently in version 1.0.0. You then release a patch version for a minor bug fix and it's now 1.0.1. 

Should you cut a new documentation version 1.0.1? **You shouldn't**. 1.0.1 and 1.0.0 docs shouldn't differ according to semver because there is no new feature !. Cutting a new version for it will only just create unnecessary duplicated files.

### Keep the number of versions low 

As a good rule of thumb, try to maintain the number of your versions below 10. **It is very likely** that you have a lot of obsolete versioned documentation that nobody even read anymore. [Babel](https://babeljs.io/versions) for example is currently in version `7.X`, and it no longer maintains documentation for version `<= 6.X`. Keep it low :)
