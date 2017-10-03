Docusaurus is published as an npm package that can be installed via `npm` or `yarn`. Here is how you publish the package to npm:

## Log in to npm

Publishing will only work if you are logged into npm with an account with admin rights to the package.

If you are not currently logged into npm locally:

1. `npm adduser`
1. Enter username, password and associated email address

## Publish

1. Bump version number in `package.json`
2. `npm publish`

### What version should you use?

The version number should generally increase by some factor than the current one. You can check current version by looking in `package.json`.

```
"name": "docusaurus",
"version": "1.0.0-alpha.41",
"repository": {
  "type": "git",
  "url": "https://github.com/facebookexperimental/Docusaurus.git"
},
```

For the above example, you may want to bump the version to `1.0.0-alpha.42` or `1.0.0-beta.1` or `1.0.1`.

You can also see the full list of all published versions with `npm show docusaurus versions --json`.
