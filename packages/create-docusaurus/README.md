# `create-docusaurus`

Create Docusaurus apps easily with simplified commands:

```bash
npm init docusaurus
```

```bash
yarn create docusaurus
```

```bash
npx create-docusaurus@latest
```

## Usage

Please see the [installation documentation](https://docusaurus.io/docs/installation).

## For maintainers

For Docusaurus maintainers, templates can be tested with:

```bash
cd `git rev-parse --show-toplevel` # Back to repo root
rm -rf test-website
yarn create-docusaurus test-website classic --javascript
cd test-website
yarn start
```

Note: `test-website` is not part of the workspace and use packages from npm.

Use the following to test the templates against local packages:

```bash
cd `git rev-parse --show-toplevel` # Back to repo root
rm -rf test-website-in-workspace
yarn create-docusaurus test-website-in-workspace classic --javascript
cd test-website-in-workspace
yarn build
yarn start
```

For the TypeScript template:

```bash
cd `git rev-parse --show-toplevel` # Back to repo root
rm -rf test-website-in-workspace
yarn create-docusaurus test-website-in-workspace classic --typescript
cd test-website-in-workspace
yarn typecheck
yarn build
yarn start
```
