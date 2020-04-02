# Publishing Instructions

Docusaurus is published as an npm package that can be installed via `npm` or `yarn`. Get access from the Docusaurus npm admins (@yangshun/@JoelMarcey).

## Log in to npm

Publishing will only work if you are logged into npm with an account with publishing rights to the package.

If you are not currently logged into npm on your CLI, do the following:

1. `npm login`
1. Enter username, password and associated email address
1. Make sure you have 2FA enabled on your account (preferably just for authorization)

## Docusaurus 2

If you're publishing new v2 versions, 2FA might get in the way as the pin might expire during the publishing as there are over 10 packages to publish. You're encouraged not to use the "Authorization and Publishing" 2FA option.

### 0. Build skeleton website with new version (Docker required)

To make sure that all packages will work correctly when they are published, you can build them locally and use them to run the skeleton website:

```bash
yarn test:build:v2
```

This command will build all the packages that it will publish to the running private npm proxy registry, and then initialize a new website in the `test-website` directory. Now you can start the dev server and/or make a production built.

```bash
cd test-website
yarn start
yarn build # after manual testing in browser
```

If there are no errors, you can start preparing for the new release.

### 1. Update the v2 changelog

Generate a GitHub auth token by going to https://github.com/settings/tokens. Save the token somewhere for future reference.

```sh
GITHUB_AUTH=<Your GitHub auth token> yarn changelog
```

Copy the generated contents and paste them in `CHANGELOG-2.x.md`.

### 2. Cut a new version of the docs

```sh
cd website
yarn run docusaurus docs:version 2.0.0-alpha.41
```

Test running the website with the new version locally.

### 3. Create a Pull Request

Make a commit and create a pull request with the changes and get it merged. An example PR would be [#2287](https://github.com/facebook/docusaurus/pull/2287). Make sure the preview loads fine and is showing the new version.

### 4. Publish to npm

As we have a monorepo structure, we use `lerna publish` to publish the new version of packages to npm in one shot.

```sh
yarn lerna publish 2.0.0-alpha.41 --dist-tag next
```

_Note: The v1 packages will also be modified because it's part of the monorepo. It is not ideal but we will live with it for now._

This command does a few things:

- Modifies the versions of all the `package.json` in the repository to be `2.0.0-alpha.41` and creates a commit
- Creates a new Git tag `v2.0.0-alpha.41`
- Pushes the new commit and Git tag to `master`

You should receive many emails notifying you that a new version of the packages has been published.

### 5. Create a release on GitHub

- Go to https://github.com/facebook/docusaurus/releases/new
- Under the "Tag version" field, look for the newly-created tag, which is `v2.0.0-alpha.41` in this case
- Paste the CHANGELOG changes in the textarea below
- Hit the green "Publish release" button
- Profit! 💰

## Docusaurus 1

1. Bump version number in [`package.json`](https://github.com/facebook/docusaurus/blob/master/package.json).
1. Update the [changelog](https://github.com/facebook/docusaurus/blob/master/CHANGELOG.md), including at the reference links at the bottom.
1. Do this always, but particularly important if there were any `package.json` changes in this release:
   1. If there is no `node_modules` directory in you local Docusaurus version, run `yarn install` and `npm install`.
   1. Run `yarn upgrade` to update `yarn.lock` and `npm update` to update `package-lock.json`.
1. From the `website-1.x` directory, run `npm run docusaurus-version x.x.x`, where x.x.x is the same version number you updated to in `package.json`.
1. Test your PR locally on a project that was created via [these instructions](https://github.com/facebook/docusaurus/blob/master/admin/local-third-party-project-testing.md).
1. Submit your PR
1. When your PR is merged, rebase to get the PR commit locally
1. Run `npm publish`
1. Tag the commit with the new version prefixed with a `v` (e.g. `v1.19.0`) and push the tag to `master`
1. Go to https://github.com/facebook/docusaurus/releases/new
1. Under the "Tag version" field, look for the newly-created tag
1. Paste the CHANGELOG changes in the textarea below
1. Hit the green "Publish release" button
1. Profit! 💰

### What version should you use?

The version number should generally increase by some factor than the current one. You can check current version by looking in `package.json`.

```json
{
  "name": "docusaurus",
  "version": "1.0.0-alpha.41",
  "repository": {
    "type": "git",
    "url": "https://github.com/facebook/docusaurus.git"
  }
  ...
}
```

For the above example, you may want to bump the version to `1.0.0-alpha.42` or `1.0.0-beta.1` or `1.0.1`.

You can also see the full list of all published versions with `npm show docusaurus versions --json`.
