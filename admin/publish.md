# Publishing Instructions

Docusaurus is published as an npm package that can be installed via `npm` or `yarn`.

# Check publish rights

Get access from the Docusaurus npm admins (@yangshun/@JoelMarcey).

## GitHub

You need publish access to **the main Docusaurus repository** (not a fork).

## NPM

Publishing will only work if you are logged into npm with an account with publishing rights to the package.

If you are not currently logged into npm on your CLI, do the following:

1. `npm login`
1. Enter username, password and associated email address
1. **Enable 2FA** on your account (preferably for D2: select 2FA mode `Authorization`, not `Authorization and Publishing`)

---

## Docusaurus 2

<!-- TODO: describe the process of hotfix releases -->

If you're publishing new v2 versions, 2FA might get in the way as the pin might expire during the publishing as there are over 10 packages to publish. Use 2FA mode `Authorization`, not `Authorization and Publishing`.

### 1. Git setup

From the **master branch** (up to date, main repo, not a fork), create a new branch for the release.

The branch name does not matter much, but you can use the `<your_username>/<version_to_release>` pattern.

```sh
# up to date master
git co master
git pull

# create a new release branch
git co -b <your_username>/<version_to_release>
```

### 2. Build and test the project

Run `yarn install`

It should run `yarn build:packages` and build the project's packages.

To make sure that all packages will work correctly when they are published, we can initialize a new D2 skeleton website, and test that it can start/built.

```sh
yarn test:build:v2
```

This command will build all the packages that it will publish to the running private npm proxy registry, and then initialize a new website in the `test-website` directory. Now you can start the dev server and/or make a production built.

```sh
cd test-website
yarn start
yarn build # after manual testing in browser
```

If there are no errors, you can start preparing for the new release.

**Note**: This step is also run by the CI on all pull requests ([see](https://github.com/facebook/docusaurus/pull/2954/checks?check_run_id=780871959))

### 3. Update the v2 changelog

The changelog uses GitHub labels to classify each pull request. Use the GitHub interface to assign each newly merged pull request to a GitHub label starting with `tag:`, otherwise the PR won't appear in the changelog.

The `tag:` label prefix is for PRs only. Other labels are not used by the changelog tool, and it's not necessary to assign such labels to issues, only PRs.

Generate a GitHub auth token by going to https://github.com/settings/tokens (the only permission needed is `public_repo`). Save the token somewhere for future reference.

Fetch the tags from Github (lerna-changelog looks for commits since last tag by default):

```sh
git fetch --tags
```

Generate the changelog with:

```sh
GITHUB_AUTH=<Your GitHub auth token> yarn changelog
```

Copy the generated contents and paste them in `CHANGELOG-2.x.md`.

**Note**: sometimes `lerna-changelog` gives an empty changelog ([bug report](https://github.com/lerna/lerna-changelog/issues/354)).

Adding the `--from` options seems to help:

```sh
yarn changelog --from v2.0.0-alpha.60`
```

### 4. Cut a new version of the docs

```sh
yarn workspace docusaurus-2-website docusaurus docs:version 2.0.0-alpha.59
```

Test running the website with the new version locally.

### 5. Create a Pull Request

You should still be on your local branch `<your_username>/<version_to_release>`

Make a commit/push, create a pull request with the changes.

**Don't merge it yet**, but wait for the CI checks to complete.

An example PR would be [#3114](https://github.com/facebook/docusaurus/pull/3114).

### 6. Build and publish to npm

Stay on your local branch `<your_username>/<version_to_release>`

As we have a monorepo structure, we use `lerna publish --exact` to publish the new version of packages to npm in one shot.

`--exact` is important to ensure we keep using fixed versions (without the ^ prefix added by Lerna).

First, be sure to run the command below to verify that you have access to all the necessary repositories.

```sh
npm access ls-packages
```

<details>
 <summary>The list of packages which need access (as of April 2020)</summary>
 <pre>
{
  "@docusaurus/plugin-sitemap": "read-write",
  "@docusaurus/mdx-loader": "read-write",
  "@docusaurus/utils": "read-write",
  "@docusaurus/core": "read-write",
  "@docusaurus/plugin-content-blog": "read-write",
  "@docusaurus/plugin-content-docs": "read-write",
  "@docusaurus/plugin-content-pages": "read-write",
  "@docusaurus/preset-classic": "read-write",
  "@docusaurus/theme-search-algolia": "read-write",
  "@docusaurus/theme-classic": "read-write",
  "@docusaurus/theme-live-codeblock": "read-write",
  "@docusaurus/plugin-google-analytics": "read-write",
  "@docusaurus/plugin-google-gtag": "read-write",
  "@docusaurus/init": "read-write",
  "@docusaurus/plugin-content-docs-legacy": "read-write",
  "@docusaurus/plugin-ideal-image": "read-write",
  "@docusaurus/types": "read-write",
  "docusaurus": "read-write",
  "docusaurus-init": "read-write",
  "stylelint-copyright": "read-write"
}
</pre>
</details>

It can happen that some accesses not granted, as an admin might add you to the @docusaurus NPM organization, but you don't have access to the packages that are not in that organization.

Please **double-check your permissions on these 3 packages**, otherwise you'll publish a half-release and will have to release a new version.

```
  "docusaurus": "read-write",
  "docusaurus-init": "read-write",
  "stylelint-copyright": "read-write"
```

If all accesses are available, build all the necessary packages, and then run the lerna command to release a new version:

```sh
yarn build:packages
yarn lerna publish 2.0.0-alpha.41 --dist-tag next --exact
```

**Note**: The v1 packages will also be modified because it's part of the monorepo. It is not ideal but we will live with it for now.\_

This command does a few things:

- Modifies the versions of all the `package.json` in the repository to be `2.0.0-alpha.41` and creates a commit
- Creates a new Git tag `v2.0.0-alpha.41`
- Pushes the new release commit on your branch, and add a git tag

You should receive many emails notifying you that a new version of the packages has been published.

Now that the release is done, **merge the pull request**.

### 7. Create a release on GitHub

- Go to https://github.com/facebook/docusaurus/releases/new
- Under the "Tag version" field, look for the newly-created tag, which is `v2.0.0-alpha.41` in this case
- Paste the CHANGELOG changes in the textarea below
- Hit the green "Publish release" button
- Profit! 💰

### 8. Notify people about new release (optional but desirable)

After new release, it is cool to notify our users about this in the Discord chat (`docusaurus-users` channel) and write summaries on Twitter using the following templates.

For Discord:

```
A new version %VER% is available now! 🎉
See release notes at the following link https://github.com/facebook/docusaurus/releases/tag/%VER%
```

For Twitter:

```
💥 A new version %VER% is available now! 💥

###
LIST HERE MAJOR FEATURES, SEE EXAMPLES BELOW

- Dropdown nav 🔗
- New code blocks features 🖥️
- Draft blog posts ✏️
- Announcement bar 📢

..

NOTE: most likely this last item will be relevant for each new release, so do not forget include it
- Many documentation improvements and bug fixes! 🐛
###

https://github.com/facebook/docusaurus/releases/tag/%VER%
```

---

## Docusaurus 1

### Updated v1 release process

Process reworked by @slorber at `1.14.6`, it may not be perfect yet:

Suppose we are at `v1.14.5`, and want to release `v1.14.6`:

- Assign appropriate `tag: xyz` labels to merged PRs
- Be on master (up-to-date): `git co master && git pull`
- Create a new branch: `git co -b slorber/release-1.14.6`
- Get the changelog from last release: `git fetch --tags && GITHUB_AUTH=<myToken> yarn changelog --from=v1.14.5`
- Update [CHANGELOG.md](https://github.com/facebook/docusaurus/blob/master/CHANGELOG.md), but remove the v2-related items manually.
- Run `yarn install`
- Version the docs: `yarn workspace docusaurus-1-website docusaurus-version 1.14.6`
- Test the v1 website locally: `yarn start:v1` + `yarn build:v1`
- Publish: `yarn workspace docusaurus publish --new-version 1.14.6`

The release is now published. It's worth to test it by initializing a new v1 site:

```sh
mkdir my-v1-website
cd my-v1-website
npx docusaurus-init
cd website
yarn start
```

Finish the release:

- Commit: `git commit -am "chore(v1): release v1.14.6"`
- Push: `git push origin slorber/release-1.14.6`
- Run `git tag v1.14.6` (important: the tag is prefixed by **`v`**)
- Run `git push origin v1.14.6`
- Open a PR, and merge it
- Create the [new Github release](https://github.com/facebook/docusaurus/releases/new), paste the changelog
- The End

### Historical v1 release process

1. Bump version number in [`package.json`](https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-1.x/package.json).
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
