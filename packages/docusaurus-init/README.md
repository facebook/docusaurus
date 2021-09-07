# `@docusaurus/init`

Create Docusaurus apps easily.

## Usage

Please see the [installation documentation](https://docusaurus.io/docs/installation).

## For maintainers

For Docusaurus maintainers, templates can be tested with:

```bash
cd `git rev-parse --show-toplevel` # Back to repo root
rm -rf test-website
yarn docusaurus-init init test-website classic
cd test-website
yarn start
```

Note: `test-website` is not part of the workspace and use packages from npm.

Use the following to test the templates against local packages:

```bash
cd `git rev-parse --show-toplevel` # Back to repo root
rm -rf test-website-in-workspace
yarn docusaurus-init init test-website-in-workspace classic
cd test-website-in-workspace
yarn start
```
