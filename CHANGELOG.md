# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.10] - 2018-04-09

This is a general release with mostly bug fixes and documentation updates (which are already live on docusuarus.io).

### Breaking Changes

N/A

### Added

- [Added Facebook Pixel ID as a configuration option](https://github.com/facebook/Docusaurus/commit/508090377eb14f27db5ccb87c5fbe70ab79dc62d), thanks @pestevez.
- Better documentation on installation requirements, CircleCI, updating Docusaurus and API. Thanks espcially to @yangshun for a lot of documentation cleanup and additions.

### Fixed/Changed

- [Fixed .gitignore placement when running the examples script or `docusaurus-init`](https://github.com/facebook/Docusaurus/commit/fc051acde53e7dd981d5aeb0cea498209b1da11c)
- On page navigation fixes, including its [scroll height](https://github.com/facebook/Docusaurus/commit/56bae1d70ca6e0467b4f43fcc2b3adf72a5296db), [better table of contents](https://github.com/facebook/Docusaurus/commit/c437f7be37827f4f8c199577f4367ad0e56562c7), and other [fixes](https://github.com/facebook/Docusaurus/commit/1a674885aeff1a3c9523d16a72a34e4ba0ce8019), thanks @microbouji.
- [Cleaned up example pages](https://github.com/facebook/Docusaurus/commit/37c699e8bdcad6889fadf52253c0901dc029b507), thanks @Happy-Ferret.
- [Better alignment of the sitemap in the footer](https://github.com/facebook/Docusaurus/commit/a7acc7d794240b28da52f90cac487f6b803dc7a3), thanks @ryzokuken.
- Accessibility fixes around [images](https://github.com/facebook/Docusaurus/commit/c2cd169b64d1bd9513831976bd5db436d6cda498) and [links](https://github.com/facebook/Docusaurus/commit/e19b9ac56e227c40209cec774b5b74a539819153), thanks @amyrlam and @yangshun.

### Removed

N/A

## [1.0.9] - 2018-03-13

**This is a hotfix release**

A [bug](https://github.com/facebook/Docusaurus/pull/501) was found in the [using `path` functions commit](https://github.com/facebook/Docusaurus/commit/cbdab2ba1112e8949683d23ce20034aa17d9013d) by @sunnylqm. Total commits in this release is 4, including the release itself.

### Breaking Changes

N/A

### Added

- [Docs for the secondary, on-page navigation option](https://docusaurus.io/docs/en/navigation.html#secondary-on-page-navigation).

### Fixed/Changed

- [Fix wrong versioned_docs file path](https://github.com/facebook/Docusaurus/pull/501/commits/324facde46e13749423d72f14e300a8dbf0a76cb), thanks @sunnylqm.

### Removed

N/A

## [1.0.8] - 2018-03-12

This is a targeted feature and bug fix release. A couple of things of interest are that this release fixes some [issues](https://github.com/facebook/Docusaurus/issues/468) with Windows that were occurring, particularly when building the docs, both locally and publishing, as well as addressing an [issue](https://github.com/facebook/Docusaurus/issues/344) for support for a secondary, on-page sidebar for local page navigation, which is now enabled for docusaurus.io. Total commits in this release is 27, including the release itself.

### Breaking Changes

N/A

### Added

- [Add separate, on-page navigation sidebar option so that you can see links to local page topics](https://github.com/facebook/Docusaurus/commit/4ff2fe280ebd41c4b491936fdd4ae75b7805ed61), thanks @microbouji.
- [You can now use a custom `appId` for your Algolia search](https://github.com/facebook/Docusaurus/commit/4ea8158c0cf2105b0fec767289fd722ebc6e3a92), thanks @atroncy.
- [The header navigation now shows the active link clearly](https://github.com/facebook/Docusaurus/commit/48ee457ec98b728343196362d5d42c0dc3d1cff9), thanks @microbouji.
- [Replace Circle CI 1.0 publishing documentation with Circle CI 2.0](https://docusaurus.io/docs/en/publishing.html#using-circle-ci-20), thanks @ashleytqy.

### Fixed/Changed

- [Use `path` functions in order to fix building on Windows](https://github.com/facebook/Docusaurus/commit/cbdab2ba1112e8949683d23ce20034aa17d9013d)
- [`latestVersion` was fixed when running the local server](https://github.com/facebook/Docusaurus/commit/4a10be8002af4bf59a3830d75c5860b83df3d2a6), thanks @sunnylqm.
- [Environment variables take precedent over config options when publishing](https://github.com/facebook/Docusaurus/commit/d2bff6929e410f03bc4758538020167c828b156e), thanks @juanpicado.
- [i18n support fixed for the home page link in the header](https://github.com/facebook/Docusaurus/commit/f8486e02ae2b28e7c04cf72617a31716b64a445c) and [the sidebar navigation](https://github.com/facebook/Docusaurus/commit/4553afda2bdb68db2f5f014a117cf93e81014037), thank @cheercroaker.
- [Document an existing feature that has already existed, `ogImage`](https://github.com/facebook/Docusaurus/commit/a8d7299ef2c055e7cd48cf6a78ed2204a964bdaa), thanks @miralemd.
- [`siteConfig.users` is now optional](https://github.com/facebook/Docusaurus/commit/8c2145585c415f0e1b093c33cc2aba46c407b575), thanks @aimeerpierce.
- [`id` used instead of `name` in anchors, bringing us more HTML 5 compliant](https://github.com/facebook/Docusaurus/commit/c800870fefe0f3f1987ea0731d0ad1391ea35471), thanks @ronami.

### Removed

N/A

## [1.0.7] - 2018-02-17

**This is a hotfix release**

A couple of bugs were found in our versioning system that would make versioning unusable in some scenarios. Thank you to @iRoachie for finding these. This release also contains a better header link scroll on mobile. Total commits in this release is 6, including the release itself.

### Breaking Changes

N/A

### Added

- [A scrollbar to the header links on mobile](https://github.com/facebook/Docusaurus/commit/0dad6d562f78e9d1c9d8c70946755accd73a6a63), thanks @maaz93.

### Fixed/Changed

- [Allow new docs to be added for new versions](https://github.com/facebook/Docusaurus/commit/1388e1379512ddfd4d5bfbecaac2a598dd85151c)
- [Relax restriction on versioned doc ids with dashes](https://github.com/facebook/Docusaurus/commit/ec6ff9284c03e3287089f65e596a2293097c23ab)
- [Broken link in the site config docs](https://github.com/facebook/Docusaurus/commit/f79cfaa3a11270665ab528b26a37f2598a878bff), thanks @justinmusgrove.

### Removed

N/A

## [1.0.6] - 2018-02-12

This is a bigger release than normal as it has been a month since releases. It contains bug fixes, duplicate code removal, a few new features, and documentation updates. Total commits in this release is 38, including the release itself.

### Breaking Changes

N/A

### Added

- Option to control number of blog posts in sidebar ([#432](https://github.com/facebook/Docusaurus/commit/dfb70e18296fe0feb53ac05e807cba290b5da3d7), thanks @ericnakagawa)
- `font-family` is now a configurable parameter ([#294](https://github.com/facebook/Docusaurus/commit/a241a466697a2bb9fa022df29fba35dd49e29715), thanks @cowlingj)
- Configurable edit URL link, per doc ([#443](https://github.com/facebook/Docusaurus/commit/41750667cd74b66c2bdde00619d290fc293a01d3), thanks @Glavin001)
- New Docusaurus [users](https://docusaurus.io/en/users.html): [Vuls](https://vuls.io/), [react-native-ios-kit](https://callstack.github.io/react-native-ios-kit) and [Verdaccio](http://www.verdaccio.org/)
- Docs section about referencing site documents ([#394](https://github.com/facebook/Docusaurus/commit/1d967a941cfc7256588ce8b88291d7f3c86c1983)
)
- Clarified docs on [publishing to a user/org page](https://docusaurus.io/docs/en/publishing.html#using-github-pages)
- [Alphabetized site config options](https://docusaurus.io/docs/en/site-config.html) in docs (thanks @haraldur12)
- Moved [verifying installation](https://docusaurus.io/docs/en/installation.html#verifying-installation) section to the install docs (@thanks @gedeagas)
- Discord added as a [help and communication](https://docusaurus.io/en/help.html) option

### Fixed/Changed

- Blog feeds now show HTML, not markdown ([#407](https://github.com/facebook/Docusaurus/commit/2d7274f6fe052615d0e0fe4d1b75f9cfc5f88cbb), thanks @tom-auger)
- Chinese translation infra ([#377](https://github.com/facebook/Docusaurus/commit/00270c26a729a9b23e1e4055868ae7146c2d81d8), thanks @chenglou)
- Margin for right-aligned images ([#398](https://github.com/facebook/Docusaurus/commit/4c2558e8bd538ea6f49867e18c1bbd9489e7ba2c), thanks @rickhanlonii)
- Correct HTTP status code sent on redirects ([#408](https://github.com/facebook/Docusaurus/commit/c81609d393e9e1fe2b63b69028b0624091a3e440))
- Non-English versioned docs metadata parsed correctly ([#412](https://github.com/facebook/Docusaurus/commit/43e80fcea735788a78d8c48e35df4ea1b6cd8b00), thanks @sunnylqm)
- Provide Algolia information about the latest and current version ([#418](https://github.com/facebook/Docusaurus/commit/61c5d2d8e01ace967157120727e3b3fcab541b17))
- Remove key errors when running local server ([#425](https://github.com/facebook/Docusaurus/commit/c6a9848a17b7ac27f43a58c6cecacf905fab0cbc), thanks @hshoff)
- Links fixed in blog Atom feed ([#421](https://github.com/facebook/Docusaurus/commit/c99cdefd3a314e53cc23ff65eeaa6837cb49d034), thanks @hramos)

### Removed

N/A

## [1.0.5] - 2018-01-09

This is a targeted bug fix release, with some documentation updates and Docusaurus repo housekeeping in between. Total commits in this release is 13, including the release itself.

### Breaking Changes

N/A

### Added

N/A

### Fixed/Changed

- Docusaurus builds on Windows ([PR #381](https://github.com/facebook/Docusaurus/pull/381), thanks @qcz).
- Fixed publishing for user/org GitHub sites (as opposed to project sites) ([PR #384](https://github.com/facebook/Docusaurus/pull/384)).
- Clarification and updates on the publishing and API documentation ([PR #372](https://github.com/facebook/Docusaurus/pull/372)).

### Removed

N/A

## [1.0.4] - 2017-12-27

This is generally a bug fix release, with some code refactoring. Total commits in this release is 58.

### Breaking Changes

- ***Most users may not run into this problem, but we think it can technically be a breaking change***. PR #322 (original PR #316) and friends changes the way we check for the existence of translations and versioning. Part of that is that we allow for the possibility of an empty language prop, instead of defaulting everything to English. When running 1.0.4, check to make sure your `index.js` works as expected. See [this comment](https://github.com/facebook/Docusaurus/pull/322#issuecomment-352914064) and those below for discussion on this. There is still a bit more work to be done (refactoring and maybe adding a `defaultLang` config option) to make this as clean as possible.

### Added

- `lang` property added on `html` tag, if a language exists and is set (PR #295).
- Added the `wrapPagesHTML` configuration option (PR #332).
- Some adming docs on how to debug with VSCode (PR #335).
- Added docs for the `useEnglishURL` configuration option.

### Fixed/Changed

- Links on landing page in `docusaurus-init` test site do not 404 any longer.
- Refactoring how we check for translations and versioning (PRs #322/#316 and friends).
- Refactored the example `index.js` page (PR #293).
- Link errors, typos and grammatical errors in the docusuarus.io documentation.

### Removed

N/A

## [1.0.3] - 2017-12-13
### Added
- Docusaurus [released](http://docusaurus.io/blog/2017/12/14/introducing-docusaurus.html) to the public.
  - Initialization script
  - Versioning
  - Translations
  - Search
  - Blog
  - Documentation

[Unreleased]: https://github.com/facebook/Docusaurus/compare/v1.0.10...HEAD
[1.0.10]: https://github.com/facebook/Docusaurus/compare/v1.0.9...v1.0.10
[1.0.9]: https://github.com/facebook/Docusaurus/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/facebook/Docusaurus/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/facebook/Docusaurus/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/facebook/Docusaurus/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/facebook/Docusaurus/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/facebook/Docusaurus/compare/v1.0.3...v1.0.4
