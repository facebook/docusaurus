# Release process

Let's see how Docusaurus handles **versioning, releases and breaking changes**.

:::info

This topic is particularly important for **highly customized sites** that have **difficulties to upgrade**.

:::

## Semantic versioning

Docusaurus versioning is based on the `major.minor.patch` scheme and [Semantic Versioning](https://semver.org/).

Respecting Semantic Versioning is important for multiple reasons:

- It **guarantees simple minor version upgrades**, as long as you only use the [public API](##public-api-surface)
- It is a reasonable expectation for many frontend developers to respect it
- A new major version is an opportunity to document better the breaking changes
- A new major/minor version is an opportunity to communicate the new features with a blog post

:::note

Releasing Docusaurus 2.0 took a very long time.

From now on, Docusaurus will **release new major versions more regularly**. In practice, you can expect a new major version every 2-3 months.

[Major version numbers are not sacred](https://tom.preston-werner.com/2022/05/23/major-version-numbers-are-not-sacred.html), but we still group breaking changes together and avoid releasing major versions too often.

:::

### `major` versions {#major-versions}

The `major` version number is incremented on **every breaking change**.

Whenever a new major version is released, we publish:

- a blog post with feature highlights, major bug fixes, **breaking changes and upgrade instructions**.
- an exhaustive changelog entry

:::tip

Read our [public API surface](##public-api-surface) section to clearly understand what we consider as a breaking change.

:::

### `minor` versions {#minor-versions}

The `minor` version number is incremented on every significant retro-compatible change.

Whenever a new minor version is released, we publish:

- a blog post with a list of feature highlights and major bug fixes
- an exhaustive changelog entry

:::tip

If you only use our [public API surface](##public-api-surface), you should be able to upgrade in no time!

:::

### `patch` versions {#minor-versions}

The `patch` version number is incremented on bugfixes releases.

Whenever a new patch version is released, we only publish an exhaustive changelog entry.

## Versions development

```mdx-code-block
import {
  StableMajorVersion,
  NextMajorVersion,
  StableMajorBranchLink,
  NextMajorBranchLink,
} from "@site/src/components/Versions";
```

The Docusaurus team is working on 2 major versions at the same time:

- **Docusaurus <StableMajorVersion/>**: the **stable**, on the <StableMajorBranchLink/> branch
- **Docusaurus <NextMajorVersion/>**: the **next** version, on the <NextMajorBranchLink/> branch

### Stable version

The stable version (v<StableMajorVersion/>, on <StableMajorBranchLink/>) is recommended for most Docusaurus users.

We regularly backport retro-compatible features, bug and security fixes from <NextMajorBranchLink/> to <StableMajorBranchLink/> with `git cherry-pick` to make them available as soon as possible on a stable release.

### Next version

The next version (v<NextMajorVersion/>, on <NextMajorBranchLink/>) is the version the Docusaurus team is currently working on.

The <NextMajorBranchLink/> branch is the **default target branch** for all pull-requests, including core team and external contributions.

This version is recommended for **early adopters** that want to use the latest Docusaurus features as soon as possible. It is also a good way to help us by reporting bugs and giving some feedback.

There are 2 ways to use the next version:

- use a pre-release with an `alpha`, `beta` or `rc` tag
- use a [canary release](./4-canary.md) for the very latest features

:::caution

Breaking changes can happen on the next version, but they will be documented, and you shouldn't be afraid to give it a try.

In particular at the `beta` and `rc` (release candidate) stage where we avoid introducing new breaking changes.

:::

## Public API surface {#public-api-surface}
