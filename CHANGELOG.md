# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/facebook/Docusaurus/compare/v1.0.4...HEAD
[1.0.4]: https://github.com/facebook/Docusaurus/compare/v1.0.3...v1.0.4
