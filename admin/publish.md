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

### 2. Clean, Build and test the project

Build all the packages from a clean state:

```sh
yarn clear
yarn install
```

**Optional**: to make sure that all packages will work correctly when they are published, we can initialize a new D2 skeleton website, and test that it can start/built.

```sh
# This will build all the packages and publish them in a local Verdaccio npm registry
# and then initialize a new website in the `test-website` directory using those locally published packages
yarn test:build:v2

# Now you can test the site in dev/prod mode
cd test-website
yarn start
yarn build
yarn serve
```

This local test step is optional because it will be run by the CI on your release PR ([see](https://github.com/facebook/docusaurus/pull/2954/checks?check_run_id=780871959))

### 3. Update the v2 changelog

The changelog uses GitHub labels to classify each pull request. Use the GitHub interface to assign each newly merged pull request to a GitHub label starting with `tag:`, otherwise the PR won't appear in the changelog.

[Check tags of all recently merged Pull-Requests](https://github.com/facebook/docusaurus/pulls?q=is%3Apr+sort%3Aupdated-desc+is%3Amerged+)

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

Copy the generated contents and paste them in `CHANGELOG.md`.

**Note**: sometimes `lerna-changelog` gives an empty changelog ([bug report](https://github.com/lerna/lerna-changelog/issues/354)).

Adding the `--from` options seems to help:

```sh
yarn changelog --from v2.0.0-beta.0
```

### 4. Cut a new version of the docs

```sh
yarn workspace docusaurus-2-website docusaurus docs:version 2.0.0-beta.0
```

Test running the website with the new version locally.

### 5. Create a Pull Request

You should still be on your local branch `<your_username>/<version_to_release>`

Make a commit/push, create a pull request with the changes.

Example PR: [#3114](https://github.com/facebook/docusaurus/pull/5098), using title such as `chore(v2): prepare v2.0.0-beta.0 release`

**Don't merge it yet**, but wait for the CI checks to complete.

### 6. Build and publish to npm

Stay on your local branch `<your_username>/<version_to_release>`

As we have a monorepo structure, we use `lerna publish ... --exact` to publish the new version of packages to npm in one shot.

Using the `--exact` is important to ensure we keep using fixed versions (without the ^ prefix added by Lerna).

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

It can happen that some accesses are not granted, as an admin might add you to the @docusaurus NPM organization, but you don't have access to the packages that are not in that organization.

Please **double-check your permissions on these 3 packages**, otherwise you'll publish a half-release and will have to release a new version.

```
  "docusaurus": "read-write",
  "docusaurus-init": "read-write",
  "stylelint-copyright": "read-write"
```

If all accesses are available, build all the necessary packages, and then run the lerna command to release a new version:

```sh
yarn build:packages
yarn lerna publish 2.0.0-beta.0 --exact
```

This command does a few things:

- Modifies the versions of all the `package.json` in the repository to be `2.0.0-beta.0` and creates a commit
- Creates a new Git tag `v2.0.0-beta.0`
- Pushes the new release commit on your branch, and add a git tag

You should receive many emails notifying you that a new version of the packages has been published.

Now that the release is done, **merge the pull request**.

### 7. Create a release on GitHub

- Go to https://github.com/facebook/docusaurus/releases/new
- Under the "Tag version" field, look for the newly-created tag, which is `v2.0.0-beta.0` in this case
- Paste the CHANGELOG changes in the textarea below
- Hit the green "Publish release" button
- Profit! 💰

### 8. Update example projects (optional but desirable)

After a release, update the examples to keep them in sync with the latest release. This will ensure that CodeSandbox playground is able to use the new version at [new.docusaurus.io](https://new.docusaurus.io).

Create a separate branch/PR and run `yarn examples:generate`

### 9. Notify people about new release (optional but desirable)

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
