# Docusaurus 2 Changelog

## 2.0.0-alpha.70 (2020-12-17)

#### :rocket: New Feature

- `docusaurus`
  - [#3932](https://github.com/facebook/docusaurus/pull/3932) feat(v2): Add <Root> theme element ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus`
  - [#3916](https://github.com/facebook/docusaurus/pull/3916) feat(v2): Add localeDropdown navbar item type + i18n localeConfigs field ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-types`
  - [#3904](https://github.com/facebook/docusaurus/pull/3904) feat(v2): inline table-of-contents + refactor TOC ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`
  - [#3888](https://github.com/facebook/docusaurus/pull/3888) feat(v2): add custom props for consumption by swizzled sidebar ([@oriooctopus](https://github.com/oriooctopus))
- `docusaurus-plugin-content-blog`
  - [#3842](https://github.com/facebook/docusaurus/pull/3842) feat(v2): enable feeds by default in blog plugin ([@cindygu4](https://github.com/cindygu4))
- Other
  - [#3827](https://github.com/facebook/docusaurus/pull/3827) feat(v2): add automated canary releases ([@slorber](https://github.com/slorber))
  - [#3761](https://github.com/facebook/docusaurus/pull/3761) feat(v2): Added Lighthouse CI to PR checks ([@sarthakkundra](https://github.com/sarthakkundra))
- `docusaurus-1.x`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#3325](https://github.com/facebook/docusaurus/pull/3325) feat(v2): core v2 i18n support + Docusaurus site Crowdin integration ([@slorber](https://github.com/slorber))

#### :boom: Breaking Change

- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-types`
  - [#3904](https://github.com/facebook/docusaurus/pull/3904) feat(v2): inline table-of-contents + refactor TOC ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`
  - [#3842](https://github.com/facebook/docusaurus/pull/3842) feat(v2): enable feeds by default in blog plugin ([@cindygu4](https://github.com/cindygu4))

#### :bug: Bug Fix

- `docusaurus`
  - [#3922](https://github.com/facebook/docusaurus/pull/3922) fix(v2): fix navbar items issue on Windows? ([@slorber](https://github.com/slorber))
  - [#3920](https://github.com/facebook/docusaurus/pull/3920) fix(v2): i18n translation extractor should handle JSX formatting edge cases better ([@slorber](https://github.com/slorber))
  - [#3896](https://github.com/facebook/docusaurus/pull/3896) fix(v2): do not treat at-rules during CSS minification ([@lex111](https://github.com/lex111))
  - [#3869](https://github.com/facebook/docusaurus/pull/3869) fix(v2): load plugin commands async to fix broken plugin CLI commands `docs:version` ([@aeneasr](https://github.com/aeneasr))
- `docusaurus-theme-classic`
  - [#3921](https://github.com/facebook/docusaurus/pull/3921) fix(v2): remove useless console log ([@slorber](https://github.com/slorber))
  - [#3895](https://github.com/facebook/docusaurus/pull/3895) fix(v2): use proper element for pagination nav label ([@lex111](https://github.com/lex111))
  - [#3882](https://github.com/facebook/docusaurus/pull/3882) fix(v2): improve Footer structure, add class names, use Infima transition ([@Simek](https://github.com/Simek))
  - [#3877](https://github.com/facebook/docusaurus/pull/3877) fix(v2): dynamic dark mode detection without toggle widget ([@hmil](https://github.com/hmil))
  - [#3854](https://github.com/facebook/docusaurus/pull/3854) fix(v2): refactor icons in theme-classic, fix swizzle issue ([@Simek](https://github.com/Simek))
  - [#3823](https://github.com/facebook/docusaurus/pull/3823) fix(v2): support rendering of singular tabs ([@aeneasr](https://github.com/aeneasr))
  - [#3817](https://github.com/facebook/docusaurus/pull/3817) fix(v2): Allow footer logo at attribute to be empty ([@aarongarciah](https://github.com/aarongarciah))
- `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`
  - [#3900](https://github.com/facebook/docusaurus/pull/3900) fix(v2): correct typo in metas generated for Twitter cards ([@mpsq](https://github.com/mpsq))
- Other
  - [#3872](https://github.com/facebook/docusaurus/pull/3872) chore: add missing v1 generated files to ignores ([@Simek](https://github.com/Simek))
  - [#3833](https://github.com/facebook/docusaurus/pull/3833) fix(v2): temporary: disable crowdin until PR env variable permission fixed ([@slorber](https://github.com/slorber))
- `stylelint-copyright`
  - [#3852](https://github.com/facebook/docusaurus/pull/3852) fix(v2): to fix the canary release GH workflow ([@slorber](https://github.com/slorber))
- `docusaurus-theme-search-algolia`
  - [#3853](https://github.com/facebook/docusaurus/pull/3853) fix(v2): fix DocSearch keyboard navigator ([@francoischalifour](https://github.com/francoischalifour))
  - [#3837](https://github.com/facebook/docusaurus/pull/3837) fix(v2): update SearchPage styling, fix appearance in dark mode ([@Simek](https://github.com/Simek))
  - [#3828](https://github.com/facebook/docusaurus/pull/3828) fix(v2): restore Algolia search ([@lex111](https://github.com/lex111))
  - [#3819](https://github.com/facebook/docusaurus/pull/3819) feat(search): update DocSearch to alpha.31 ([@francoischalifour](https://github.com/francoischalifour))
- `docusaurus-plugin-content-docs`
  - [#3839](https://github.com/facebook/docusaurus/pull/3839) fix(v2): remove unnecessary backtick in output ([@sivaraam](https://github.com/sivaraam))
- `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`
  - [#3829](https://github.com/facebook/docusaurus/pull/3829) fix(v2): fix search ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus`
  - [#3824](https://github.com/facebook/docusaurus/pull/3824) fix(v2): update notifier dist tag ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus`
  - [#3880](https://github.com/facebook/docusaurus/pull/3880) polish(v2): improve docusaurus deploy logs ([@slorber](https://github.com/slorber))

#### :memo: Documentation

- [#3931](https://github.com/facebook/docusaurus/pull/3931) docs(v2): blog.md with docs: false, for blog-only mode ([@Romstar](https://github.com/Romstar))
- [#3924](https://github.com/facebook/docusaurus/pull/3924) docs(v2): Removed unnecessary closing parenthesis ([@Varshit07](https://github.com/Varshit07))
- [#3928](https://github.com/facebook/docusaurus/pull/3928) docs(v2): add FoalTS to showcase page ([@LoicPoullain](https://github.com/LoicPoullain))
- [#3899](https://github.com/facebook/docusaurus/pull/3899) docs(v2): Move sidebar content to its own page ([@ArtFlag](https://github.com/ArtFlag))
- [#3856](https://github.com/facebook/docusaurus/pull/3856) docs(v2): typo ([@borool](https://github.com/borool))
- [#3891](https://github.com/facebook/docusaurus/pull/3891) docs(v2): Wrap section about custom domains in :::info ([@Alex1304](https://github.com/Alex1304))
- [#3871](https://github.com/facebook/docusaurus/pull/3871) docs(v2): missing <ColorGenerator/> mdx import ([@slorber](https://github.com/slorber))
- [#3873](https://github.com/facebook/docusaurus/pull/3873) docs(v2): From docusaurus-migrate to @docusaurus/migrate ([@manzinello](https://github.com/manzinello))
- [#3867](https://github.com/facebook/docusaurus/pull/3867) docs(v2): Add docusaurus-plugin-moesif to community plugins ([@dgilling](https://github.com/dgilling))
- [#3851](https://github.com/facebook/docusaurus/pull/3851) docs(v2): Fixed Typo: Hided => Hidden ([@woodrufs](https://github.com/woodrufs))
- [#3832](https://github.com/facebook/docusaurus/pull/3832) docs(v2): Add wasp to showcase ([@matijaSos](https://github.com/matijaSos))
- [#3813](https://github.com/facebook/docusaurus/pull/3813) docs(v2): render deployment doc ([@davidmauskop](https://github.com/davidmauskop))
- [#3835](https://github.com/facebook/docusaurus/pull/3835) docs(v2): update Client API docs page ([@Simek](https://github.com/Simek))
- [#3831](https://github.com/facebook/docusaurus/pull/3831) docs(v2): Docs refactoring and reorganization ([@slorber](https://github.com/slorber))

#### :house: Internal

- Other
  - [#3912](https://github.com/facebook/docusaurus/pull/3912) chore(v2): remove docs for alpha v64 ([@lex111](https://github.com/lex111))
  - [#3907](https://github.com/facebook/docusaurus/pull/3907) chore(ci): fix canary release filtering ([@slorber](https://github.com/slorber))
  - [#3902](https://github.com/facebook/docusaurus/pull/3902) chore(deps): bump ini from 1.3.5 to 1.3.7 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#3884](https://github.com/facebook/docusaurus/pull/3884) chore(ci): increase Lighthouse CI max_timeout ([@Simek](https://github.com/Simek))
  - [#3883](https://github.com/facebook/docusaurus/pull/3883) chore(v2): remove docs for alpha v62-63 ([@lex111](https://github.com/lex111))
  - [#3863](https://github.com/facebook/docusaurus/pull/3863) chore(ci): run V1 Build and Migration CLI tests conditionally on CI ([@Simek](https://github.com/Simek))
  - [#3861](https://github.com/facebook/docusaurus/pull/3861) chore(ci): reduce number of jobs, remove build from lighthouse pipeline ([@Simek](https://github.com/Simek))
  - [#3860](https://github.com/facebook/docusaurus/pull/3860) chore: add Yarn v2 cache directory to ignores ([@Simek](https://github.com/Simek))
  - [#3858](https://github.com/facebook/docusaurus/pull/3858) chore(v2): disable Crowdin for deploy previews ([@slorber](https://github.com/slorber))
  - [#3857](https://github.com/facebook/docusaurus/pull/3857) fix(v2): fix Crowdin ci commands ([@slorber](https://github.com/slorber))
  - [#3849](https://github.com/facebook/docusaurus/pull/3849) chore(ci): CI scripts cleanup, add Node 14 runs, bump checkout action ([@Simek](https://github.com/Simek))
  - [#3850](https://github.com/facebook/docusaurus/pull/3850) chore(v2): i18n CI: add write-translations call ([@slorber](https://github.com/slorber))
  - [#3848](https://github.com/facebook/docusaurus/pull/3848) chore(v2): fix CI typo ([@slorber](https://github.com/slorber))
  - [#3847](https://github.com/facebook/docusaurus/pull/3847) chore(v2): wire production Crowdin project + setup ([@slorber](https://github.com/slorber))
  - [#3846](https://github.com/facebook/docusaurus/pull/3846) chore(v2): fix PRs not able to add lighthouse/buildsize comment from works ([@slorber](https://github.com/slorber))
- `docusaurus-1.x`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`
  - [#3865](https://github.com/facebook/docusaurus/pull/3865) chore(v2): fix ignore paths and Prettier commands in themes ([@Simek](https://github.com/Simek))
- `docusaurus-cssnano-preset`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#3844](https://github.com/facebook/docusaurus/pull/3844) chore(v2): fix several lint warnings, add missing types, cleanup ([@Simek](https://github.com/Simek))
- `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`
  - [#3838](https://github.com/facebook/docusaurus/pull/3838) refactor(v2): extract site title formatter to theme-common util ([@Simek](https://github.com/Simek))

#### Committers: 23

- Aarón García Hervás ([@aarongarciah](https://github.com/aarongarciah))
- Alex1304 ([@Alex1304](https://github.com/Alex1304))
- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Arthur ([@ArtFlag](https://github.com/ArtFlag))
- Bartosz Kaszubowski ([@Simek](https://github.com/Simek))
- Cindy Gu ([@cindygu4](https://github.com/cindygu4))
- Derric Gilling ([@dgilling](https://github.com/dgilling))
- François Chalifour ([@francoischalifour](https://github.com/francoischalifour))
- Hadrien Milano ([@hmil](https://github.com/hmil))
- Kaartic Sivaraam ([@sivaraam](https://github.com/sivaraam))
- Loïc Poullain ([@LoicPoullain](https://github.com/LoicPoullain))
- Matija Sosic ([@matijaSos](https://github.com/matijaSos))
- Matteo Manzinello ([@manzinello](https://github.com/manzinello))
- Méril ([@mpsq](https://github.com/mpsq))
- Oliver Ullman ([@oriooctopus](https://github.com/oriooctopus))
- Rami ([@Romstar](https://github.com/Romstar))
- Sarthak kundra ([@sarthakkundra](https://github.com/sarthakkundra))
- Stephen Woodruff ([@woodrufs](https://github.com/woodrufs))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Varshit Shah ([@Varshit07](https://github.com/Varshit07))
- [@borool](https://github.com/borool)
- [@davidmauskop](https://github.com/davidmauskop)
- hackerman ([@aeneasr](https://github.com/aeneasr))

## 2.0.0-alpha.69 (2020-11-24)

#### :rocket: New Feature

- `docusaurus-types`, `docusaurus`
  - [#3802](https://github.com/facebook/docusaurus/pull/3802) feat(v2): add baseUrlIssueBanner configuration to disable banner ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#3807](https://github.com/facebook/docusaurus/pull/3807) chore(v2): upgrade Infima to v0.2.0-alpha.18 ([@lex111](https://github.com/lex111))
  - [#3806](https://github.com/facebook/docusaurus/pull/3806) fix(v2): remove aria-hidden attr from anchor link of heading ([@lex111](https://github.com/lex111))
  - [#3784](https://github.com/facebook/docusaurus/pull/3784) fix(v2): fix missing logo in dark theme when darkSrc was not set ([@Simek](https://github.com/Simek))
- `docusaurus-theme-search-algolia`
  - [#3804](https://github.com/facebook/docusaurus/pull/3804) fix(v2): Algolia: allow contextualSearch + facetFilters ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#3796](https://github.com/facebook/docusaurus/pull/3796) Adds createRequire for preset resolution ([@arcanis](https://github.com/arcanis))

#### :memo: Documentation

- [#3803](https://github.com/facebook/docusaurus/pull/3803) docs(v2): fix docusaurus init issue when not using @latest ([@slorber](https://github.com/slorber))
- [#3785](https://github.com/facebook/docusaurus/pull/3785) docs(v2): recommend Docusaurus 2 usage ([@slorber](https://github.com/slorber))
- [#3783](https://github.com/facebook/docusaurus/pull/3783) docs(v2): remove @next tags needed to install v2 packages ([@slorber](https://github.com/slorber))
- [#3781](https://github.com/facebook/docusaurus/pull/3781) docs(v2): rename zeit to vercel ([@camiluc](https://github.com/camiluc))

#### :house: Internal

- [#3800](https://github.com/facebook/docusaurus/pull/3800) chore(v2): remove useless stylelint-copyright peerDependency ([@slorber](https://github.com/slorber))
- [#3786](https://github.com/facebook/docusaurus/pull/3786) chore(v2): ensure publishConfig.access presence with tests ([@slorber](https://github.com/slorber))

#### Committers: 5

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Bartosz Kaszubowski ([@Simek](https://github.com/Simek))
- Maël Nison ([@arcanis](https://github.com/arcanis))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- [@camiluc](https://github.com/camiluc)

## 2.0.0-alpha.68 (2020-11-18)

#### :rocket: New Feature

- Other
  - [#3717](https://github.com/facebook/docusaurus/pull/3717) feat(v2): official CodeSandbox support ([@sammychinedu2ky](https://github.com/sammychinedu2ky))
- `docusaurus-init`
  - [#3729](https://github.com/facebook/docusaurus/pull/3729) feat(v2): allow init project via npm ([@lex111](https://github.com/lex111))
- `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`
  - [#3730](https://github.com/facebook/docusaurus/pull/3730) feat(v2): add ThemedImage component ([@Simek](https://github.com/Simek))
- `docusaurus-cssnano-preset`, `docusaurus-theme-classic`, `docusaurus`
  - [#3716](https://github.com/facebook/docusaurus/pull/3716) feat(v2): introduce new minification of CSS bundle ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#3694](https://github.com/facebook/docusaurus/pull/3694) feat(v2): Added the ability to specify GIT_PASS in deploy command (for CI purposes) ([@smcelhinney](https://github.com/smcelhinney))
  - [#3621](https://github.com/facebook/docusaurus/pull/3621) feat(v2): baseUrl config issues: show help message if css/js can't load ([@jcs98](https://github.com/jcs98))
  - [#3594](https://github.com/facebook/docusaurus/pull/3594) feat(v2): add support for key,cert in https ([@ThakurKarthik](https://github.com/ThakurKarthik))
- `docusaurus-remark-plugin-npm2yarn`
  - [#3705](https://github.com/facebook/docusaurus/pull/3705) feat(v2): add support for sync to npm2yarn tabs ([@lex111](https://github.com/lex111))
- `docusaurus-init`, `docusaurus-migrate`, `docusaurus-plugin-content-docs`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#3658](https://github.com/facebook/docusaurus/pull/3658) feat(v2): onBrokenMarkdownLinks config ([@AmyrAhmady](https://github.com/AmyrAhmady))
- `docusaurus-theme-classic`
  - [#3640](https://github.com/facebook/docusaurus/pull/3640) feat(v2): add skip to content link ([@lex111](https://github.com/lex111))
  - [#3615](https://github.com/facebook/docusaurus/pull/3615) feat(v2): add ability to hide doc sidebar ([@lex111](https://github.com/lex111))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#3749](https://github.com/facebook/docusaurus/pull/3749) fix(v2): add support for interleaving Markdown in code blocks ([@lex111](https://github.com/lex111))
  - [#3739](https://github.com/facebook/docusaurus/pull/3739) fix(v2): add support for prefers-reduced-motion in hideable sidebar ([@lex111](https://github.com/lex111))
  - [#3726](https://github.com/facebook/docusaurus/pull/3726) fix(v2): add thin scrollbar to proper element in TOC ([@lex111](https://github.com/lex111))
  - [#3681](https://github.com/facebook/docusaurus/pull/3681) Revert "refactor(v2): improve regex matching code-block title" ([@lex111](https://github.com/lex111))
  - [#3662](https://github.com/facebook/docusaurus/pull/3662) fix(v2): navbar dropdown crash when item.to is undefined ([@artemkovalyov](https://github.com/artemkovalyov))
  - [#3669](https://github.com/facebook/docusaurus/pull/3669) fix(v2): make scrollbar styles consistent ([@nategiraudeau](https://github.com/nategiraudeau))
  - [#3666](https://github.com/facebook/docusaurus/pull/3666) fix(v2): make optional title for footer links column ([@lex111](https://github.com/lex111))
  - [#3647](https://github.com/facebook/docusaurus/pull/3647) fix(v2): do not set height for mobile dropdown during build ([@lex111](https://github.com/lex111))
  - [#3650](https://github.com/facebook/docusaurus/pull/3650) fix(v2): add landmark for skip to content link ([@lex111](https://github.com/lex111))
  - [#3627](https://github.com/facebook/docusaurus/pull/3627) fix(v2): disable tabbing on hidden doc sidebar ([@lex111](https://github.com/lex111))
  - [#3637](https://github.com/facebook/docusaurus/pull/3637) fix(v2): wrap code blocks on print ([@haivp3010](https://github.com/haivp3010))
  - [#3603](https://github.com/facebook/docusaurus/pull/3603) fix(v2): animate dropdown properly ([@lex111](https://github.com/lex111))
  - [#3611](https://github.com/facebook/docusaurus/pull/3611) fix(v2): Added back support for optional logo field in theme-classic navbarConfig ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-theme-classic`, `docusaurus`
  - [#3763](https://github.com/facebook/docusaurus/pull/3763) refactor(v2): various markup improvements ([@lex111](https://github.com/lex111))
  - [#3724](https://github.com/facebook/docusaurus/pull/3724) fix(v2): add support for non-ASCII chars in anchor link scroll ([@lex111](https://github.com/lex111))
- `docusaurus-module-type-aliases`, `docusaurus`
  - [#3723](https://github.com/facebook/docusaurus/pull/3723) fix(v2): restore prefetch functionality ([@lex111](https://github.com/lex111))
- Other
  - [#3760](https://github.com/facebook/docusaurus/pull/3760) fix(v2): codesandbox generated examples should use published init package ([@slorber](https://github.com/slorber))
  - [#3701](https://github.com/facebook/docusaurus/pull/3701) fix(v2): limit images height on showcase page ([@lex111](https://github.com/lex111))
- `docusaurus-mdx-loader`
  - [#3757](https://github.com/facebook/docusaurus/pull/3757) fix(v2): escape alt text in img tag ([@lex111](https://github.com/lex111))
  - [#3653](https://github.com/facebook/docusaurus/pull/3653) fix(v2): handle multiple asset links in one line properly ([@lex111](https://github.com/lex111))
- `docusaurus-theme-search-algolia`, `docusaurus-utils`
  - [#3721](https://github.com/facebook/docusaurus/pull/3721) fix(v2): use swizzled SearchPage component if any ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#3725](https://github.com/facebook/docusaurus/pull/3725) fix(v2): fix inconsistent error output in swizzle command ([@lex111](https://github.com/lex111))
  - [#3704](https://github.com/facebook/docusaurus/pull/3704) refactor(v2): allow adding plugins depending on condition ([@lex111](https://github.com/lex111))
  - [#3691](https://github.com/facebook/docusaurus/pull/3691) fix(v2): use SVGO in webpack SVGR loader ([@charleskorn](https://github.com/charleskorn))
  - [#3667](https://github.com/facebook/docusaurus/pull/3667) fix(v2): Fix typo in BaseUrlSuggestionWarning ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-utils`
  - [#3703](https://github.com/facebook/docusaurus/pull/3703) fix(v2): ignore export declarations in excerpt ([@lex111](https://github.com/lex111))
- `docusaurus-theme-search-algolia`
  - [#3639](https://github.com/facebook/docusaurus/pull/3639) fix(v2): restore infinite scroll pagination on search page ([@lex111](https://github.com/lex111))
- `docusaurus-types`, `docusaurus`
  - [#3622](https://github.com/facebook/docusaurus/pull/3622) fix(v2): docusaurus start --poll 500 should work + better config load failure error ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus`
  - [#3765](https://github.com/facebook/docusaurus/pull/3765) chore(v2): replace wait-file with wait-on to reduce npm warnings ([@lex111](https://github.com/lex111))
  - [#3725](https://github.com/facebook/docusaurus/pull/3725) fix(v2): fix inconsistent error output in swizzle command ([@lex111](https://github.com/lex111))
  - [#3609](https://github.com/facebook/docusaurus/pull/3609) refactor(v2): Improve SSR error message: log page path ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#3764](https://github.com/facebook/docusaurus/pull/3764) refactor(v2): make accessible anchor links from keyboard ([@lex111](https://github.com/lex111))
  - [#3745](https://github.com/facebook/docusaurus/pull/3745) refactor(v2): introduce Logo component, remove useLogo hook ([@Simek](https://github.com/Simek))
  - [#3706](https://github.com/facebook/docusaurus/pull/3706) refactor(v2): render all tab panels at once ([@lex111](https://github.com/lex111))
  - [#3712](https://github.com/facebook/docusaurus/pull/3712) chore(v2): upgrade Infima to v0.2.0-alpha.15 ([@lex111](https://github.com/lex111))
  - [#3685](https://github.com/facebook/docusaurus/pull/3685) refactor(v2): improve regex matching code-block title ([@hong4rc](https://github.com/hong4rc))
  - [#3674](https://github.com/facebook/docusaurus/pull/3674) feat(v2): add additional wrapper class to blog pages ([@Simek](https://github.com/Simek))
  - [#3671](https://github.com/facebook/docusaurus/pull/3671) refactor(v2): improve regex matching code-block title ([@hong4rc](https://github.com/hong4rc))
  - [#3654](https://github.com/facebook/docusaurus/pull/3654) refactor(v2): clean up code blocks ([@lex111](https://github.com/lex111))
  - [#3649](https://github.com/facebook/docusaurus/pull/3649) refactor(v2): make code blocks scrollable from keyboard ([@lex111](https://github.com/lex111))
  - [#3626](https://github.com/facebook/docusaurus/pull/3626) refactor(v2): remove focus outline from mouse users ([@lex111](https://github.com/lex111))
- `docusaurus-init`
  - [#3709](https://github.com/facebook/docusaurus/pull/3709) chore(v2): adjust website npm package ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`
  - [#3707](https://github.com/facebook/docusaurus/pull/3707) chore(v2): upgrade Infima to v0.2.0-alpha.14 ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `docusaurus-utils-validation`, `docusaurus`
  - [#3638](https://github.com/facebook/docusaurus/pull/3638) chore(v2): migrate hapi/joi to joi ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-search-algolia`
  - [#3604](https://github.com/facebook/docusaurus/pull/3604) refactor(v2): use new way to get versions for search page ([@lex111](https://github.com/lex111))

#### :memo: Documentation

- Other
  - [#3762](https://github.com/facebook/docusaurus/pull/3762) Adding ConfigCat to showcase ([@sigewuzhere](https://github.com/sigewuzhere))
  - [#3750](https://github.com/facebook/docusaurus/pull/3750) docs(v2): add npm2yarn to typescript install command ([@davidjgoss](https://github.com/davidjgoss))
  - [#3743](https://github.com/facebook/docusaurus/pull/3743) docs(v2): convert teams page to MDX ([@slorber](https://github.com/slorber))
  - [#3737](https://github.com/facebook/docusaurus/pull/3737) docs(v2): add Inline SVG color override example ([@Simek](https://github.com/Simek))
  - [#3718](https://github.com/facebook/docusaurus/pull/3718) docs(v2): showcase Botonic ([@vanbasten17](https://github.com/vanbasten17))
  - [#3696](https://github.com/facebook/docusaurus/pull/3696) docs(v2): normalize showcase preview images height ([@Simek](https://github.com/Simek))
  - [#3699](https://github.com/facebook/docusaurus/pull/3699) docs(v2): deployment should use mdx extension ([@slorber](https://github.com/slorber))
  - [#3695](https://github.com/facebook/docusaurus/pull/3695) docs(v2): add React Native website to the showcase ([@Simek](https://github.com/Simek))
  - [#3645](https://github.com/facebook/docusaurus/pull/3645) Update Docusaurus v2 Showcase ([@ndom91](https://github.com/ndom91))
  - [#3644](https://github.com/facebook/docusaurus/pull/3644) docs(v2): update the link of joi ([@kenve](https://github.com/kenve))
  - [#3636](https://github.com/facebook/docusaurus/pull/3636) docs(v2): fix some misspellings ([@ka1bi4](https://github.com/ka1bi4))
  - [#3630](https://github.com/facebook/docusaurus/pull/3630) docs: remove runme ([@juzhiyuan](https://github.com/juzhiyuan))
- `docusaurus-remark-plugin-npm2yarn`
  - [#3624](https://github.com/facebook/docusaurus/pull/3624) Fix typo in remark-plugin-npm2yarn documentation ([@belemaire](https://github.com/belemaire))

#### :house: Internal

- Other
  - [#3769](https://github.com/facebook/docusaurus/pull/3769) docs(v2): fix statements background, update footer background ([@Simek](https://github.com/Simek))
  - [#3744](https://github.com/facebook/docusaurus/pull/3744) chore(v2): add build size bot workflow Github CI workflow ([@jcs98](https://github.com/jcs98))
  - [#3741](https://github.com/facebook/docusaurus/pull/3741) chore: update yarn lock again ([@slorber](https://github.com/slorber))
  - [#3740](https://github.com/facebook/docusaurus/pull/3740) chore: update yarn lock ([@slorber](https://github.com/slorber))
  - [#3738](https://github.com/facebook/docusaurus/pull/3738) chore(internal): add yarn deduplicate script, cleanup lock ([@Simek](https://github.com/Simek))
  - [#3732](https://github.com/facebook/docusaurus/pull/3732) fix(internal): fix clear script from the main package.json ([@Simek](https://github.com/Simek))
  - [#3708](https://github.com/facebook/docusaurus/pull/3708) chore(v2): remove docs for alpha v60-61 ([@lex111](https://github.com/lex111))
  - [#3693](https://github.com/facebook/docusaurus/pull/3693) fix(v2): fix website scripts on Windows by using cross-env ([@Simek](https://github.com/Simek))
  - [#3673](https://github.com/facebook/docusaurus/pull/3673) test(e2e): dogfood Yarn with enableGlobalCache ([@ylemkimon](https://github.com/ylemkimon))
  - [#3641](https://github.com/facebook/docusaurus/pull/3641) misc: fix unbound env variable in test release script ([@lex111](https://github.com/lex111))
- `docusaurus-mdx-loader`, `docusaurus-migrate`, `lqip-loader`
  - [#3766](https://github.com/facebook/docusaurus/pull/3766) chore(v2): fix several npm warnings ([@lex111](https://github.com/lex111))
- `docusaurus-mdx-loader`
  - [#3753](https://github.com/facebook/docusaurus/pull/3753) chore(v2): fix mismatch peer dependency in MDX loader ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#3742](https://github.com/facebook/docusaurus/pull/3742) chore(v2): pin version of babel-plugin-dynamic-import-node to 2.3.0 ([@lex111](https://github.com/lex111))
  - [#3734](https://github.com/facebook/docusaurus/pull/3734) chore(v2): downgrade babel-plugin-dynamic-import-node to 2.3.0 ([@lex111](https://github.com/lex111))
  - [#3714](https://github.com/facebook/docusaurus/pull/3714) chore(v2): fix prettier formatting ([@slorber](https://github.com/slorber))
  - [#3619](https://github.com/facebook/docusaurus/pull/3619) refactor(v2): add better error message for yarn workspace/monorepo/terser issue ([@slorber](https://github.com/slorber))
- `docusaurus-1.x`, `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-pwa`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#3727](https://github.com/facebook/docusaurus/pull/3727) chore(v2): upgrade dependencies ([@lex111](https://github.com/lex111))
- `docusaurus-1.x`
  - [#3715](https://github.com/facebook/docusaurus/pull/3715) chore(v2): update Browserslist ([@lex111](https://github.com/lex111))
- `docusaurus-mdx-loader`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-sitemap`
  - [#3675](https://github.com/facebook/docusaurus/pull/3675) fix(v2): add missing 'react' and 'webpack' peer dependencies ([@ylemkimon](https://github.com/ylemkimon))
- `docusaurus-1.x`, `docusaurus-init-1.x`, `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-bootstrap`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`, `stylelint-copyright`
  - [#3613](https://github.com/facebook/docusaurus/pull/3613) fix: add repository metadata to all packages ([@rarkins](https://github.com/rarkins))

#### Committers: 26

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Anh Hong ([@hong4rc](https://github.com/hong4rc))
- Artem Kovalov ([@artemkovalyov](https://github.com/artemkovalyov))
- Bartosz Kaszubowski ([@Simek](https://github.com/Simek))
- Benoît Lemaire ([@belemaire](https://github.com/belemaire))
- Bright Egbo ([@egbobright](https://github.com/egbobright))
- Charles Korn ([@charleskorn](https://github.com/charleskorn))
- David Goss ([@davidjgoss](https://github.com/davidjgoss))
- Gergely Sinka ([@sigewuzhere](https://github.com/sigewuzhere))
- Hai ([@haivp3010](https://github.com/haivp3010))
- Jainam Chirag Shah ([@jcs98](https://github.com/jcs98))
- Marc Rabat Pla ([@vanbasten17](https://github.com/vanbasten17))
- Nate Giraudeau ([@nategiraudeau](https://github.com/nategiraudeau))
- Nico Domino ([@ndom91](https://github.com/ndom91))
- Rhys Arkins ([@rarkins](https://github.com/rarkins))
- Roman Bug ([@ka1bi4](https://github.com/ka1bi4))
- Sam Zhou ([@SamChou19815](https://github.com/SamChou19815))
- Shenwei Wang ([@weareoutman](https://github.com/weareoutman))
- Stephen McElhinney ([@smcelhinney](https://github.com/smcelhinney))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Thakur Karthik ([@ThakurKarthik](https://github.com/ThakurKarthik))
- [@sammychinedu2ky](https://github.com/sammychinedu2ky)
- iAmir ([@AmyrAhmady](https://github.com/AmyrAhmady))
- kenve ([@kenve](https://github.com/kenve))
- ylemkimon ([@ylemkimon](https://github.com/ylemkimon))
- 琚致远 ([@juzhiyuan](https://github.com/juzhiyuan))

## 2.0.0-alpha.67 (2020-11-18)

Failed release

## 2.0.0-alpha.66 (2020-10-19)

#### :rocket: New Feature

- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`
  - [#3593](https://github.com/facebook/docusaurus/pull/3593) feat(v2): blog sidebar ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-remark-plugin-npm2yarn`
  - [#3469](https://github.com/facebook/docusaurus/pull/3469) feat(v2): Extract npm2yarn plugin ([@fanny](https://github.com/fanny))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`
  - [#3550](https://github.com/facebook/docusaurus/pull/3550) feat(v2): contextual search, dynamic Algolia facetFilters ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#3580](https://github.com/facebook/docusaurus/pull/3580) feat(v2): allow to define custom CSS class for Tabs component ([@Simek](https://github.com/Simek))
  - [#3553](https://github.com/facebook/docusaurus/pull/3553) feat(v2): make dropdown menu collapsible on mobiles ([@lex111](https://github.com/lex111))
- `docusaurus-migrate`, `docusaurus-types`, `docusaurus`
  - [#3573](https://github.com/facebook/docusaurus/pull/3573) feat(v2): Add themeConfig.noIndex option #3528 ([@hamzahamidi](https://github.com/hamzahamidi))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus`
  - [#3543](https://github.com/facebook/docusaurus/pull/3543) feat(v2): persist docs preferred version ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus`
  - [#3548](https://github.com/facebook/docusaurus/pull/3548) feat(v2): version dropdown before/after items + move site "All Versions" link ([@slorber](https://github.com/slorber))
- `docusaurus-types`, `docusaurus`
  - [#3545](https://github.com/facebook/docusaurus/pull/3545) feat(v2): site client modules ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#3539](https://github.com/facebook/docusaurus/pull/3539) feat(v2): doc navbar item type ([@slorber](https://github.com/slorber))

#### :boom: Breaking Change

- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`
  - [#3550](https://github.com/facebook/docusaurus/pull/3550) feat(v2): contextual search, dynamic Algolia facetFilters ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-theme-classic`, `docusaurus`
  - [#3607](https://github.com/facebook/docusaurus/pull/3607) fix(v2): fix error with required href attr of link in mobiles ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#3602](https://github.com/facebook/docusaurus/pull/3602) fix(v2): make dropdown button clickable with mouse ([@lex111](https://github.com/lex111))
  - [#3601](https://github.com/facebook/docusaurus/pull/3601) fix(v2): fix table-of-content scroll highlighting issues ([@slorber](https://github.com/slorber))
- `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`
  - [#3599](https://github.com/facebook/docusaurus/pull/3599) fix(v2): remove event listeners on Tabs component unmount ([@lex111](https://github.com/lex111))
- `docusaurus-types`, `docusaurus`
  - [#3531](https://github.com/facebook/docusaurus/pull/3531) fix(v2): Fixes serve cli --port option ([@UmairKamran](https://github.com/UmairKamran))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#3585](https://github.com/facebook/docusaurus/pull/3585) refactor(v2): various dropdown improvements ([@lex111](https://github.com/lex111))
  - [#3588](https://github.com/facebook/docusaurus/pull/3588) refactor(v2): make accessible copy code button from keyboard ([@lex111](https://github.com/lex111))
  - [#3578](https://github.com/facebook/docusaurus/pull/3578) refactor(v2): apply common behavior to dropdowns ([@lex111](https://github.com/lex111))
  - [#3546](https://github.com/facebook/docusaurus/pull/3546) docs: various fixes and improvements ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus`
  - [#3587](https://github.com/facebook/docusaurus/pull/3587) refactor(v2): various fixes ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#3569](https://github.com/facebook/docusaurus/pull/3569) refactor(v2): improve broken links error message ([@slorber](https://github.com/slorber))

#### :memo: Documentation

- Other
  - [#3576](https://github.com/facebook/docusaurus/pull/3576) docs(v2): removed obsolete "you" identifier ([@christian-bromann](https://github.com/christian-bromann))
  - [#3589](https://github.com/facebook/docusaurus/pull/3589) docs(v2): add taro to users ([@honlyHuang](https://github.com/honlyHuang))
  - [#3565](https://github.com/facebook/docusaurus/pull/3565) docs(v2): deployment, add required Github token scope infos ([@russtaylor](https://github.com/russtaylor))
  - [#3574](https://github.com/facebook/docusaurus/pull/3574) docs(v2): adding vue-nodegui to users ([@shubhamzanwar](https://github.com/shubhamzanwar))
  - [#3556](https://github.com/facebook/docusaurus/pull/3556) Added Axioms to users ([@abhishektiwari](https://github.com/abhishektiwari))
  - [#3558](https://github.com/facebook/docusaurus/pull/3558) docs(v2): embedding real source code in MDX as a code block ([@slorber](https://github.com/slorber))
  - [#3555](https://github.com/facebook/docusaurus/pull/3555) docs(v2): add "Wisdom" dev docs website to showcase. ([@jagracey](https://github.com/jagracey))
  - [#3532](https://github.com/facebook/docusaurus/pull/3532) docs(v2): change package name in example script ([@MatanBobi](https://github.com/MatanBobi))
  - [#3538](https://github.com/facebook/docusaurus/pull/3538) docs(v1): added drone for 1.0 #3491 ([@aakhtar3](https://github.com/aakhtar3))
  - [#3533](https://github.com/facebook/docusaurus/pull/3533) docs(v1): Fix broken link in the documentation ([@saintmalik](https://github.com/saintmalik))
  - [#3534](https://github.com/facebook/docusaurus/pull/3534) docs(v2): Fix url bugs in v2 docs ([@saintmalik](https://github.com/saintmalik))
- `docusaurus-theme-classic`
  - [#3546](https://github.com/facebook/docusaurus/pull/3546) docs: various fixes and improvements ([@lex111](https://github.com/lex111))

#### :house: Internal

- `docusaurus-theme-search-algolia`
  - [#3591](https://github.com/facebook/docusaurus/pull/3591) chore(v2): enable new contextual search feature ([@slorber](https://github.com/slorber))
- Other
  - [#3586](https://github.com/facebook/docusaurus/pull/3586) chore(v2): fix/upgrade react types ([@slorber](https://github.com/slorber))
  - [#3577](https://github.com/facebook/docusaurus/pull/3577) refactor(v2): clarify versions page ([@lex111](https://github.com/lex111))
  - [#3560](https://github.com/facebook/docusaurus/pull/3560) feat(v2): prevent using remote image urls in showcase ([@slorber](https://github.com/slorber))
  - [#3554](https://github.com/facebook/docusaurus/pull/3554) fix(v2): use absolute path to manifest file ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#3394](https://github.com/facebook/docusaurus/pull/3394) refactor(v2): add useThemeConfig hook + cleanup useless theme default values ([@imskr](https://github.com/imskr))

#### Committers: 17

- Abhishek Tiwari ([@abhishektiwari](https://github.com/abhishektiwari))
- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Bartosz Kaszubowski ([@Simek](https://github.com/Simek))
- Christian Bromann ([@christian-bromann](https://github.com/christian-bromann))
- Fanny ([@fanny](https://github.com/fanny))
- Hamza Hamidi ([@hamzahamidi](https://github.com/hamzahamidi))
- John Gracey ([@jagracey](https://github.com/jagracey))
- Matan Borenkraout ([@MatanBobi](https://github.com/MatanBobi))
- Russ Taylor ([@russtaylor](https://github.com/russtaylor))
- SaintMalik ([@saintmalik](https://github.com/saintmalik))
- Shubham Kumar ([@imskr](https://github.com/imskr))
- Shubham Zanwar ([@shubhamzanwar](https://github.com/shubhamzanwar))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Umair Kamran ([@UmairKamran](https://github.com/UmairKamran))
- Utkarsh Goel ([@utkarsh867](https://github.com/utkarsh867))
- [@aakhtar3](https://github.com/aakhtar3)
- honlyHuang ([@honlyHuang](https://github.com/honlyHuang))

## 2.0.0-alpha.65 (2020-10-02)

#### :rocket: New Feature

- `docusaurus`
  - [#3497](https://github.com/facebook/docusaurus/pull/3497) feat(v2): env variable TERSER_PARALLEL to customize TerserPlugin.parallel ([@aeneasr](https://github.com/aeneasr))
  - [#3446](https://github.com/facebook/docusaurus/pull/3446) feat(v2): new docusaurus clear command ([@abadon7](https://github.com/abadon7))
  - [#3485](https://github.com/facebook/docusaurus/pull/3485) feat(v2): Add @theme-init components to user theme ([@edno](https://github.com/edno))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`
  - [#3467](https://github.com/facebook/docusaurus/pull/3467) feat(v2): add beforeDefaultRemarkPlugins/beforeDefaultRehypePlugins options to all md content plugins ([@ayshiff](https://github.com/ayshiff))
- `docusaurus-init`, `docusaurus-theme-bootstrap`
  - [#3496](https://github.com/facebook/docusaurus/pull/3496) feat(v2): migrate bootstrap components to ts ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#3474](https://github.com/facebook/docusaurus/pull/3474) feat(v2): allow to use array of files in customCss field ([@Simek](https://github.com/Simek))
- `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`
  - [#3457](https://github.com/facebook/docusaurus/pull/3457) feat(v2): add optional custom wrapper class name for pages based on theme classic Layout ([@Simek](https://github.com/Simek))

#### :bug: Bug Fix

- Other
  - [#3517](https://github.com/facebook/docusaurus/pull/3517) fix(v1): v1 deploy preview should be available ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#3498](https://github.com/facebook/docusaurus/pull/3498) fix(v2): fixed props being passed to @svgr/webpack loader ([@anru](https://github.com/anru))
- `docusaurus-theme-search-algolia`
  - [#3456](https://github.com/facebook/docusaurus/pull/3456) fix(v2): use valid value for crossorigin attribute ([@lex111](https://github.com/lex111))
- `docusaurus-utils`
  - [#3427](https://github.com/facebook/docusaurus/pull/3427) fix(v2): normalizeUrl edge cases ([@ayshiff](https://github.com/ayshiff))
- `docusaurus-theme-classic`
  - [#3472](https://github.com/facebook/docusaurus/pull/3472) fix(v2): Show dropdown instead of a single button when there are two versions ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-plugin-content-docs`
  - [#3441](https://github.com/facebook/docusaurus/pull/3441) fix(v2): fixing typo in error message ([@ayonious](https://github.com/ayonious))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#3499](https://github.com/facebook/docusaurus/pull/3499) chore(v2): upgrade Infima to 0.2.0-alpha.13 ([@lex111](https://github.com/lex111))

#### :memo: Documentation

- `docusaurus`
  - [#3502](https://github.com/facebook/docusaurus/pull/3502) docs(v2): add doc for wrapping theme components with @theme-original and @theme-init ([@slorber](https://github.com/slorber))
- Other
  - [#3473](https://github.com/facebook/docusaurus/pull/3473) misc: add License to the documentation ([@muskanvk](https://github.com/muskanvk))
  - [#3492](https://github.com/facebook/docusaurus/pull/3492) docs(v2): Added drone.io publish docs #3491 ([@aakhtar3](https://github.com/aakhtar3))
  - [#3479](https://github.com/facebook/docusaurus/pull/3479) docs(v2): remove redundant new line in code block ([@lex111](https://github.com/lex111))
  - [#3448](https://github.com/facebook/docusaurus/pull/3448) chore(v2): fix theme classic navbar style docs ([@Simek](https://github.com/Simek))

#### :house: Internal

- `docusaurus-1.x`, `docusaurus-migrate`
  - [#3504](https://github.com/facebook/docusaurus/pull/3504) chore(v1): move v1 docs inside website-1.x ([@slorber](https://github.com/slorber))
- Other
  - [#3506](https://github.com/facebook/docusaurus/pull/3506) chore(v2): v2 website should make it easy to contribute to upstream docs ([@slorber](https://github.com/slorber))
  - [#3511](https://github.com/facebook/docusaurus/pull/3511) misc: update CODEOWNERS ([@yangshun](https://github.com/yangshun))
  - [#3477](https://github.com/facebook/docusaurus/pull/3477) chore(v2): remove alpha 58 doc ([@lex111](https://github.com/lex111))
- `docusaurus-utils-validation`
  - [#3453](https://github.com/facebook/docusaurus/pull/3453) test(v2): add protocol relative uri validation test ([@moonrailgun](https://github.com/moonrailgun))

#### Committers: 18

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Andrey Rublev ([@anru](https://github.com/anru))
- Bartosz Kaszubowski ([@Simek](https://github.com/Simek))
- Grégory Heitz ([@edno](https://github.com/edno))
- Henry Vélez ([@abadon7](https://github.com/abadon7))
- Jeremy Hager ([@jeremyhager](https://github.com/jeremyhager))
- Joel Marcey ([@JoelMarcey](https://github.com/JoelMarcey))
- Long Ho ([@longlho](https://github.com/longlho))
- Muskan Kumar ([@muskanvk](https://github.com/muskanvk))
- Nahiyan Kamal ([@ayonious](https://github.com/ayonious))
- Rémi Doreau ([@ayshiff](https://github.com/ayshiff))
- Sam Zhou ([@SamChou19815](https://github.com/SamChou19815))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tim Gates ([@timgates42](https://github.com/timgates42))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))
- [@aakhtar3](https://github.com/aakhtar3)
- hackerman ([@aeneasr](https://github.com/aeneasr))
- moonrailgun ([@moonrailgun](https://github.com/moonrailgun))

## 2.0.0-alpha.64 (2020-09-11)

#### :rocket: New Feature

- `docusaurus-theme-classic`
  - [#3432](https://github.com/facebook/docusaurus/pull/3432) feat(v2): add style property to theme-classic navbar ([@Simek](https://github.com/Simek))
  - [#3406](https://github.com/facebook/docusaurus/pull/3406) feat(v2): ability to add/override theme html metadatas ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-sitemap`
  - [#3426](https://github.com/facebook/docusaurus/pull/3426) feat(v2): add option to add trailing slash to urls in sitemap ([@mpsq](https://github.com/mpsq))

#### :bug: Bug Fix

- Other
  - [#3438](https://github.com/facebook/docusaurus/pull/3438) fix(v2): docusaurus 2 PWA should work under baseurl (deploy previews) ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`
  - [#3435](https://github.com/facebook/docusaurus/pull/3435) fix(v2): fix empty link error message ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-pwa`
  - [#3436](https://github.com/facebook/docusaurus/pull/3436) fix(v2): Correctly resolve sw.js path on windows ([@ashscodes](https://github.com/ashscodes))
- `docusaurus-theme-classic`
  - [#3433](https://github.com/facebook/docusaurus/pull/3433) fix(v2): fix theme-classic announcement bar closeable style ([@Simek](https://github.com/Simek))
- `docusaurus-1.x`
  - [#3429](https://github.com/facebook/docusaurus/pull/3429) fix(v1): versioned_docs and skip-next-release relative path issue ([@josephMG](https://github.com/josephMG))
- `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`
  - [#3418](https://github.com/facebook/docusaurus/pull/3418) fix(v2): reset sidebar state on sidebar changes ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-debug`
  - [#3405](https://github.com/facebook/docusaurus/pull/3405) fix(v2): fix debug plugin unscoped inline code global css ([@slorber](https://github.com/slorber))

#### :memo: Documentation

- [#3428](https://github.com/facebook/docusaurus/pull/3428) docs(v2): fix grammar ([@thadguidry](https://github.com/thadguidry))
- [#3425](https://github.com/facebook/docusaurus/pull/3425) docs(v2): mention Eta in ssrTemplate section ([@mpsq](https://github.com/mpsq))
- [#3423](https://github.com/facebook/docusaurus/pull/3423) docs(v2): minor typo fix ([@rutikwankhade](https://github.com/rutikwankhade))

#### :house: Internal

- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus`
  - [#3439](https://github.com/facebook/docusaurus/pull/3439) chore(v2): fix serialize-javascript security issue by upgrading webpack/workbox ([@slorber](https://github.com/slorber))
- Other
  - [#3401](https://github.com/facebook/docusaurus/pull/3401) chore(deps): bump decompress from 4.2.0 to 4.2.1 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 7

- Ash ([@ashscodes](https://github.com/ashscodes))
- Bartosz Kaszubowski ([@Simek](https://github.com/Simek))
- Méril ([@mpsq](https://github.com/mpsq))
- Rutik Wankhade ([@rutikwankhade](https://github.com/rutikwankhade))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Thad Guidry ([@thadguidry](https://github.com/thadguidry))
- [@josephMG](https://github.com/josephMG)

## 2.0.0-alpha.63 (2020-09-03)

#### :rocket: New Feature

- `docusaurus-types`, `docusaurus`
  - [#3387](https://github.com/facebook/docusaurus/pull/3387) feat(v2): allow users to specify a custom ssr HTML template ([@mpsq](https://github.com/mpsq))
- `docusaurus-plugin-debug`
  - [#3392](https://github.com/facebook/docusaurus/pull/3392) feat(v2): officially release @docusaurus/plugin-debug ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#3388](https://github.com/facebook/docusaurus/pull/3388) feat(v2): add isCloseable property for theme-classic announcement bar ([@Simek](https://github.com/Simek))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#3373](https://github.com/facebook/docusaurus/pull/3373) feat(v2): docs options.onlyIncludeVersions ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- Other
  - [#3397](https://github.com/facebook/docusaurus/pull/3397) fix(v2): DocSearch should keep working after a new release (part 2/2) ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#3393](https://github.com/facebook/docusaurus/pull/3393) fix(v2): DocSearch should keep working after a new release (part 1/2) ([@slorber](https://github.com/slorber))
  - [#3381](https://github.com/facebook/docusaurus/pull/3381) fix(v2): alpha 62 doc fixes ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#3385](https://github.com/facebook/docusaurus/pull/3385) fix(v2): scripts should allow unknown values ([@slorber](https://github.com/slorber))
- `docusaurus-preset-bootstrap`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus`
  - [#3382](https://github.com/facebook/docusaurus/pull/3382) fix(v2): allow using classic theme/preset without the docs plugin ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-utils-validation`
  - [#3377](https://github.com/facebook/docusaurus/pull/3377) fix(v2): reject routeBasePath: '' ([@slorber](https://github.com/slorber))

#### :memo: Documentation

- [#3390](https://github.com/facebook/docusaurus/pull/3390) docs(v1, v2): Update Deploy to Vercel guide ([@samsisle](https://github.com/samsisle))
- [#3344](https://github.com/facebook/docusaurus/pull/3344) docs(v2): Update Deploy to Vercel guide ([@samsisle](https://github.com/samsisle))

#### :house: Internal

- `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-bootstrap`, `docusaurus-preset-classic`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus`
  - [#3386](https://github.com/facebook/docusaurus/pull/3386) chore(v2): pin exact dependency versions ([@slorber](https://github.com/slorber))
- `docusaurus-1.x`, `docusaurus-init-1.x`, `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-bootstrap`, `docusaurus-preset-classic`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`, `stylelint-copyright`
  - [#3359](https://github.com/facebook/docusaurus/pull/3359) chore(v2): prepare v2.0.0.alpha-62 release ([@slorber](https://github.com/slorber))

#### Committers: 5

- Bartosz Kaszubowski ([@Simek](https://github.com/Simek))
- Méril ([@mpsq](https://github.com/mpsq))
- Sam Ko ([@samsisle](https://github.com/samsisle))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Thad Guidry ([@thadguidry](https://github.com/thadguidry))

## 2.0.0-alpha.62 (2020-08-28)

#### :rocket: New Feature

- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#3357](https://github.com/facebook/docusaurus/pull/3357) feat(v2): docs version configuration: lastVersion, version.{path,label} ([@slorber](https://github.com/slorber))
  - [#3328](https://github.com/facebook/docusaurus/pull/3328) feat(v2): Provide docs plugin theme typing ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-theme-classic`
  - [#3356](https://github.com/facebook/docusaurus/pull/3356) feat(v2): Provide type definitions for remaining theme-classic components ([@SamChou19815](https://github.com/SamChou19815))
  - [#3274](https://github.com/facebook/docusaurus/pull/3274) feat(v2): add TOC to blog posts ([@amy-lei](https://github.com/amy-lei))
- `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`
  - [#3354](https://github.com/facebook/docusaurus/pull/3354) feat(v2): Provide type definitions for MDXPage from page plugin ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#3348](https://github.com/facebook/docusaurus/pull/3348) feat(v2): Provide typing to most of the theme-classic components ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-init`, `docusaurus-plugin-content-blog`
  - [#3284](https://github.com/facebook/docusaurus/pull/3284) feat(v2): blog slug frontmatter ([@JeanMarcSaad](https://github.com/JeanMarcSaad))
- `docusaurus-init`, `docusaurus-theme-bootstrap`
  - [#2981](https://github.com/facebook/docusaurus/pull/2981) feat(v2): bootstrap theme, preset, template, CI previews ([@fanny](https://github.com/fanny))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`
  - [#3267](https://github.com/facebook/docusaurus/pull/3267) feat(v2): Provide blog plugin theme typing ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-debug`, `docusaurus-preset-classic`, `docusaurus-theme-bootstrap`, `docusaurus-types`, `docusaurus`
  - [#3229](https://github.com/facebook/docusaurus/pull/3229) feat(v2): debug pages + debug layout + ability to debug content ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus`
  - [#3021](https://github.com/facebook/docusaurus/pull/3021) feat(v2): update swizzle command to suggest component/theme ([@anshulrgoyal](https://github.com/anshulrgoyal))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-pages`
  - [#3196](https://github.com/facebook/docusaurus/pull/3196) feat(v2): add support to ignore files in pages plugin ([@anshulrgoyal](https://github.com/anshulrgoyal))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-utils-validation`, `docusaurus`
  - [#3204](https://github.com/facebook/docusaurus/pull/3204) feat(v2): blog + docs multi-instance plugins ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`
  - [#3096](https://github.com/facebook/docusaurus/pull/3096) feat(v2): add support to import assets using relative link in markdown syntax ([@anshulrgoyal](https://github.com/anshulrgoyal))

#### :bug: Bug Fix

- `docusaurus-migrate`
  - [#3358](https://github.com/facebook/docusaurus/pull/3358) fix(v2): fix migrate cli paths (sidebars/customcss) ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#3311](https://github.com/facebook/docusaurus/pull/3311) fix(v2): add https support in webpack devserver ([@arcvats](https://github.com/arcvats))
  - [#3313](https://github.com/facebook/docusaurus/pull/3313) fix(v2): resolve webpack loaders from siteDir/node_modules ([@anshulrgoyal](https://github.com/anshulrgoyal))
  - [#3308](https://github.com/facebook/docusaurus/pull/3308) fix(v2): brokenLinks should not report links that belong to an existing folder if folder/index.html exists ([@slorber](https://github.com/slorber))
  - [#3273](https://github.com/facebook/docusaurus/pull/3273) fix: logic error while deciding deploymentBranch ([@thehanimo](https://github.com/thehanimo))
  - [#3281](https://github.com/facebook/docusaurus/pull/3281) fix(v2): allow swizzling of component even if case doesn't match ([@anshulrgoyal](https://github.com/anshulrgoyal))
  - [#3222](https://github.com/facebook/docusaurus/pull/3222) fix(v2): update react-loadable-ssr-addon to solve yarn2 error ([@slorber](https://github.com/slorber))
  - [#3191](https://github.com/facebook/docusaurus/pull/3191) fix(v2): add missing `lodash.flatmap` dependency ([@ylemkimon](https://github.com/ylemkimon))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-theme-bootstrap`, `docusaurus-theme-search-algolia`, `docusaurus-types`
  - [#3355](https://github.com/facebook/docusaurus/pull/3355) fix(v2): Add missing dependencies to packages ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-theme-classic`
  - [#3352](https://github.com/facebook/docusaurus/pull/3352) fix(v2): Allow the alt for the logo to be empty ([@Vinnl](https://github.com/Vinnl))
  - [#3240](https://github.com/facebook/docusaurus/pull/3240) fix(v2): navbar dropdown opened with tab, not closing on click outside ([@Ako92](https://github.com/Ako92))
- `docusaurus-mdx-loader`, `docusaurus`
  - [#3347](https://github.com/facebook/docusaurus/pull/3347) fix(v2): linking to asset or external html page -> don't use history.push() ([@slorber](https://github.com/slorber))
- `docusaurus-1.x`
  - [#3340](https://github.com/facebook/docusaurus/pull/3340) fix(v1): show images after one line code block ([@adinaja](https://github.com/adinaja))
- `docusaurus-1.x`, `docusaurus`
  - [#3290](https://github.com/facebook/docusaurus/pull/3290) fix(v1,v2): Add initial-scale=1.0 to all meta viewport tags ([@nebrelbug](https://github.com/nebrelbug))
- `docusaurus-theme-search-algolia`
  - [#3297](https://github.com/facebook/docusaurus/pull/3297) fix(v2): keep DocSearch state on remounts ([@francoischalifour](https://github.com/francoischalifour))
  - [#3280](https://github.com/facebook/docusaurus/pull/3280) fix(v2): allow search page swizzle ([@Ako92](https://github.com/Ako92))
  - [#3263](https://github.com/facebook/docusaurus/pull/3263) fix(v2): do not index search pages ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-pages`
  - [#3283](https://github.com/facebook/docusaurus/pull/3283) fix(v2): pass images in static dir to webpack-loader ([@anshulrgoyal](https://github.com/anshulrgoyal))
- Other
  - [#3269](https://github.com/facebook/docusaurus/pull/3269) fix(v2): website feedback page hydration bug ([@mecm1993](https://github.com/mecm1993))
  - [#3200](https://github.com/facebook/docusaurus/pull/3200) fix(v1): self-host user images ([@leoigel](https://github.com/leoigel))
- `docusaurus-plugin-google-gtag`
  - [#3243](https://github.com/facebook/docusaurus/pull/3243) fix(v2): GTM, send page_view events on navigate ([@govardhan-srinivas](https://github.com/govardhan-srinivas))
- `docusaurus-plugin-content-docs`, `docusaurus-utils`
  - [#3262](https://github.com/facebook/docusaurus/pull/3262) fix(v2): doc path special char (space or other) should lead to a valid slug ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-utils-validation`, `docusaurus`
  - [#3247](https://github.com/facebook/docusaurus/pull/3247) fix(v2): modify validation schema and tests for rehype/remark + remove duplicate dependency ([@teikjun](https://github.com/teikjun))
- `docusaurus-init`
  - [#3258](https://github.com/facebook/docusaurus/pull/3258) fix(v2): fix template alt image prop ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-utils-validation`, `docusaurus`
  - [#3227](https://github.com/facebook/docusaurus/pull/3227) fix(v2): relax URI validation ([@anshulrgoyal](https://github.com/anshulrgoyal))
- `docusaurus-init`, `docusaurus-plugin-content-docs`
  - [#3228](https://github.com/facebook/docusaurus/pull/3228) fix(v2): deprecate docs homePageId in favor of frontmatter "slug: /" ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus`
  - [#3225](https://github.com/facebook/docusaurus/pull/3225) fix(v2): swizzle minor improvements ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#3210](https://github.com/facebook/docusaurus/pull/3210) fix(v2): fix theme validation for prism field and add tests ([@teikjun](https://github.com/teikjun))
- `docusaurus-plugin-content-docs`
  - [#3192](https://github.com/facebook/docusaurus/pull/3192) fix(v2): add missing `chalk` and `lodash` dependencies ([@ylemkimon](https://github.com/ylemkimon))

#### :nail_care: Polish

- `docusaurus-module-type-aliases`, `docusaurus`
  - [#3244](https://github.com/facebook/docusaurus/pull/3244) chore(v2): tighten up the TypeScript onboarding ([@orta](https://github.com/orta))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-utils`, `docusaurus`
  - [#3245](https://github.com/facebook/docusaurus/pull/3245) refactor(v2): docs plugin refactor ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#3188](https://github.com/facebook/docusaurus/pull/3188) fix(v2): Add a missing whitespace before prompt to use `npm run serve` ([@SamChou19815](https://github.com/SamChou19815))

#### :memo: Documentation

- Other
  - [#3346](https://github.com/facebook/docusaurus/pull/3346) docs(v2): add draft doc ([@imskr](https://github.com/imskr))
  - [#3336](https://github.com/facebook/docusaurus/pull/3336) docs(v2): add Nisarag to Fellows section ([@FocalChord](https://github.com/FocalChord))
  - [#3335](https://github.com/facebook/docusaurus/pull/3335) docs(v2): update team profile ([@yangshun](https://github.com/yangshun))
  - [#3334](https://github.com/facebook/docusaurus/pull/3334) docs(v2): add Drew to Fellows section ([@Drewbi](https://github.com/Drewbi))
  - [#3333](https://github.com/facebook/docusaurus/pull/3333) docs(v2): add anshul and teikjun to fellows section of team page ([@teikjun](https://github.com/teikjun))
  - [#3326](https://github.com/facebook/docusaurus/pull/3326) docs(v1): showcase user Casbin ([@hsluoyz](https://github.com/hsluoyz))
  - [#3316](https://github.com/facebook/docusaurus/pull/3316) docs(v1): add Global CTO Forum to users ([@MirzayevFarid](https://github.com/MirzayevFarid))
  - [#3310](https://github.com/facebook/docusaurus/pull/3310) docs(v2): add "T-Regx" website to showcase ([@Danon](https://github.com/Danon))
  - [#3307](https://github.com/facebook/docusaurus/pull/3307) docs(v2): showcase SpotifyAPI-NET ([@JohnnyCrazy](https://github.com/JohnnyCrazy))
  - [#3295](https://github.com/facebook/docusaurus/pull/3295) docs(v2): showcase Oxidizer ([@vandreleal](https://github.com/vandreleal))
  - [#3287](https://github.com/facebook/docusaurus/pull/3287) docs: update README.md with some grammatical corrections ([@shalinikumari50](https://github.com/shalinikumari50))
  - [#3271](https://github.com/facebook/docusaurus/pull/3271) docs(v2): fix typo ([@thehanimo](https://github.com/thehanimo))
  - [#3277](https://github.com/facebook/docusaurus/pull/3277) docs(v1): Add Radity to users ([@tolunayakbulut](https://github.com/tolunayakbulut))
  - [#3276](https://github.com/facebook/docusaurus/pull/3276) docs: corrected some few typos in the docusaurus tech docs ([@ajifrank75](https://github.com/ajifrank75))
  - [#3249](https://github.com/facebook/docusaurus/pull/3249) docs(v2): fix migration command ([@BogdanDor](https://github.com/BogdanDor))
  - [#3248](https://github.com/facebook/docusaurus/pull/3248) Added twitter badge and modified discord Badges ([@Souravdey777](https://github.com/Souravdey777))
  - [#3251](https://github.com/facebook/docusaurus/pull/3251) docs(v2): fix migration command for earlier versions ([@teikjun](https://github.com/teikjun))
  - [#3252](https://github.com/facebook/docusaurus/pull/3252) docs(v2): docs typos ([@olawanlejoel](https://github.com/olawanlejoel))
  - [#3111](https://github.com/facebook/docusaurus/pull/3111) docs(v2): clarify theme-original and theme-init ([@Jonathannsegal](https://github.com/Jonathannsegal))
  - [#3232](https://github.com/facebook/docusaurus/pull/3232) docs(v2): showcase user QA-Board ([@arthur-flam](https://github.com/arthur-flam))
  - [#3205](https://github.com/facebook/docusaurus/pull/3205) docs: format reference links ([@lebogangolifant](https://github.com/lebogangolifant))
  - [#3194](https://github.com/facebook/docusaurus/pull/3194) docs(v2): Added switch config docs to theme-classic API ([@Drewbi](https://github.com/Drewbi))
  - [#3201](https://github.com/facebook/docusaurus/pull/3201) docs(v2): removed duplicate text under "Using React" section ([@boosh511](https://github.com/boosh511))
  - [#3186](https://github.com/facebook/docusaurus/pull/3186) docs(v1): formatting changelog ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#3202](https://github.com/facebook/docusaurus/pull/3202) fix(v2): fix svg loader ([@anshulrgoyal](https://github.com/anshulrgoyal))

#### :house: Internal

- `docusaurus-migrate`
  - [#3323](https://github.com/facebook/docusaurus/pull/3323) test(v2): Add unit test for migration of config file ([@BogdanDor](https://github.com/BogdanDor))
- `docusaurus-theme-classic`
  - [#3343](https://github.com/facebook/docusaurus/pull/3343) refactor(v2): announcement bar bad spelling + minor refactors ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`
  - [#3339](https://github.com/facebook/docusaurus/pull/3339) test(v2): make blog posts unit test ordering determinate ([@BogdanDor](https://github.com/BogdanDor))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`, `docusaurus-types`
  - [#3306](https://github.com/facebook/docusaurus/pull/3306) chore(v2): Define type for markdown right table of contents ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-module-type-aliases`, `docusaurus`
  - [#3244](https://github.com/facebook/docusaurus/pull/3244) chore(v2): tighten up the TypeScript onboarding ([@orta](https://github.com/orta))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-utils`, `docusaurus`
  - [#3245](https://github.com/facebook/docusaurus/pull/3245) refactor(v2): docs plugin refactor ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#3282](https://github.com/facebook/docusaurus/pull/3282) chore(v2): fix javascript-serialize vulnerability ([@slorber](https://github.com/slorber))
  - [#3265](https://github.com/facebook/docusaurus/pull/3265) chore(v2): upgrade terser-webpack-plugin ([@dschaller](https://github.com/dschaller))
- Other
  - [#3241](https://github.com/facebook/docusaurus/pull/3241) chore(deps): bump prismjs from 1.20.0 to 1.21.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#3259](https://github.com/facebook/docusaurus/pull/3259) chore(v2): fix slow commits due to lint-staged ([@slorber](https://github.com/slorber))
  - [#3197](https://github.com/facebook/docusaurus/pull/3197) chore(v2): lockfile update ([@slorber](https://github.com/slorber))
- `docusaurus-1.x`
  - [#3218](https://github.com/facebook/docusaurus/pull/3218) chore(v1): release 1.14.6 ([@slorber](https://github.com/slorber))

#### :running_woman: Performance

- `docusaurus-plugin-client-redirects`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#3238](https://github.com/facebook/docusaurus/pull/3238) refactor(v2): precompile ETA templates ([@slorber](https://github.com/slorber))

#### Committers: 39

- Ali Hosseini ([@Ako92](https://github.com/Ako92))
- Amy Lei ([@amy-lei](https://github.com/amy-lei))
- Anshul Goyal ([@anshulrgoyal](https://github.com/anshulrgoyal))
- Archit ([@arcvats](https://github.com/arcvats))
- Arthur Flam ([@arthur-flam](https://github.com/arthur-flam))
- Ben Gubler ([@nebrelbug](https://github.com/nebrelbug))
- Bogdan Doroschenko ([@BogdanDor](https://github.com/BogdanDor))
- Daniel Wilkowski ([@Danon](https://github.com/Danon))
- Derek ([@dschaller](https://github.com/dschaller))
- Drew Alexander ([@Drewbi](https://github.com/Drewbi))
- Fanny ([@fanny](https://github.com/fanny))
- Franklyn Chisom ([@ajifrank75](https://github.com/ajifrank75))
- François Chalifour ([@francoischalifour](https://github.com/francoischalifour))
- Govardhan Srinivas ([@govardhan-srinivas](https://github.com/govardhan-srinivas))
- Hani Mohammed ([@thehanimo](https://github.com/thehanimo))
- Jean-Marc Saad ([@JeanMarcSaad](https://github.com/JeanMarcSaad))
- Jonas Dellinger ([@JohnnyCrazy](https://github.com/JohnnyCrazy))
- Jonathan ([@Jonathannsegal](https://github.com/Jonathannsegal))
- Manuel Cepeda ([@mecm1993](https://github.com/mecm1993))
- Mirzayev Farid ([@MirzayevFarid](https://github.com/MirzayevFarid))
- Nisarag ([@FocalChord](https://github.com/FocalChord))
- Olawanle Joel ([@olawanlejoel](https://github.com/olawanlejoel))
- Orta Therox ([@orta](https://github.com/orta))
- Sam Zhou ([@SamChou19815](https://github.com/SamChou19815))
- Shubham Kumar ([@imskr](https://github.com/imskr))
- Sourav Dey ([@Souravdey777](https://github.com/Souravdey777))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Teik Jun ([@teikjun](https://github.com/teikjun))
- Tolunay Akbulut ([@tolunayakbulut](https://github.com/tolunayakbulut))
- Vandré Leal ([@vandreleal](https://github.com/vandreleal))
- Vincent ([@Vinnl](https://github.com/Vinnl))
- Yang Luo ([@hsluoyz](https://github.com/hsluoyz))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))
- [@adinaja](https://github.com/adinaja)
- [@leoigel](https://github.com/leoigel)
- [@shalinikumari50](https://github.com/shalinikumari50)
- alex busnelli ([@boosh511](https://github.com/boosh511))
- lebogang Olifant ([@lebogangolifant](https://github.com/lebogangolifant))
- ylemkimon ([@ylemkimon](https://github.com/ylemkimon))

## 2.0.0-alpha.61 (2020-08-01)

#### :rocket: New Feature

- `docusaurus-types`, `docusaurus`
  - [#3083](https://github.com/facebook/docusaurus/pull/3083) feat(v2): warn user when there are conflicting routes ([@teikjun](https://github.com/teikjun))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-utils-validation`, `docusaurus-utils`
  - [#3158](https://github.com/facebook/docusaurus/pull/3158) feat(v2): markdown pages ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#3127](https://github.com/facebook/docusaurus/pull/3127) feat(v2): dark mode toggle customization ([@Drewbi](https://github.com/Drewbi))
- `docusaurus-theme-search-algolia`
  - [#3166](https://github.com/facebook/docusaurus/pull/3166) feat(v2): improve Algolia search accessibility ([@francoischalifour](https://github.com/francoischalifour))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`
  - [#2359](https://github.com/facebook/docusaurus/pull/2359) feat(v2): support custom description for blog-only mode ([@zxuqian](https://github.com/zxuqian))

#### :bug: Bug Fix

- `docusaurus-mdx-loader`, `docusaurus`
  - [#3180](https://github.com/facebook/docusaurus/pull/3180) fix(v2): fix markdown images always using webpack url-loader ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#3171](https://github.com/facebook/docusaurus/pull/3171) fix(v2): tab label showing outline & background when clicked ([@mdfaizan7](https://github.com/mdfaizan7))
- `docusaurus-init`, `docusaurus-theme-classic`
  - [#3168](https://github.com/facebook/docusaurus/pull/3168) fix(v2): fix link items refusing attributes like target, rel etc... ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-sitemap`, `docusaurus-preset-bootstrap`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#3162](https://github.com/facebook/docusaurus/pull/3162) fix(v2): inability for users to pin their docusaurus version ([@BuckyMaler](https://github.com/BuckyMaler))

#### :memo: Documentation

- [#3163](https://github.com/facebook/docusaurus/pull/3163) docs(v2): showcase user questdb ([@mpsq](https://github.com/mpsq))

#### :house: Internal

- Other
  - [#3164](https://github.com/facebook/docusaurus/pull/3164) chore(deps): bump elliptic from 6.5.2 to 6.5.3 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#3157](https://github.com/facebook/docusaurus/pull/3157) chore(v2): remove alpha 59 doc ([@slorber](https://github.com/slorber))
- `docusaurus-1.x`, `docusaurus-init-1.x`, `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-bootstrap`, `docusaurus-preset-classic`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`, `lqip-loader`, `stylelint-copyright`
  - [#3154](https://github.com/facebook/docusaurus/pull/3154) chore(v2): prepare v2.0.0.alpha-60 release ([@slorber](https://github.com/slorber))

#### Committers: 8

- Bucky Maler ([@BuckyMaler](https://github.com/BuckyMaler))
- Drew Alexander ([@Drewbi](https://github.com/Drewbi))
- Faizan ([@mdfaizan7](https://github.com/mdfaizan7))
- François Chalifour ([@francoischalifour](https://github.com/francoischalifour))
- Méril ([@mpsq](https://github.com/mpsq))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Teik Jun ([@teikjun](https://github.com/teikjun))
- Xuqian ([@zxuqian](https://github.com/zxuqian)) ✨ Done in 3.58s.

## 2.0.0-alpha.60 (2020-07-29)

#### :rocket: New Feature

- `docusaurus`
  - [#3134](https://github.com/facebook/docusaurus/pull/3134) feat(v2): add validation escape hatch ([@slorber](https://github.com/slorber))
- `docusaurus-1.x`
  - [#3124](https://github.com/facebook/docusaurus/pull/3124) feat(v1): add 'slugPreprocessor' config option to allow users customize the hash links ([@Simek](https://github.com/Simek))
- `docusaurus-theme-search-algolia`
  - [#3133](https://github.com/facebook/docusaurus/pull/3133) feat(v2): add themeConfig validation to algolia theme ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus`
  - [#3142](https://github.com/facebook/docusaurus/pull/3142) fix(v2): config validation fixes + add tests for config validation ([@teikjun](https://github.com/teikjun))
- `docusaurus`
  - [#3149](https://github.com/facebook/docusaurus/pull/3149) fix(v2): BrowserOnly should not return undefined ([@slorber](https://github.com/slorber))
  - [#3143](https://github.com/facebook/docusaurus/pull/3143) fix(v2): absolute Links should be automatically prefixed by baseurl ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-types`, `docusaurus`
  - [#3141](https://github.com/facebook/docusaurus/pull/3141) fix(v2): remove buggy routesLoaded + deprecate routesLoaded lifecycle ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#3140](https://github.com/facebook/docusaurus/pull/3140) fix(v2): navbar item links should allow unknown attributes ([@slorber](https://github.com/slorber))
- `docusaurus-theme-search-algolia`
  - [#3138](https://github.com/facebook/docusaurus/pull/3138) fix(v2): add accessible label for Algolia search button ([@hobadams](https://github.com/hobadams))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus`
  - [#3120](https://github.com/facebook/docusaurus/pull/3120) fix(v2): make config validation less strict ([@teikjun](https://github.com/teikjun))

#### :memo: Documentation

- [#3145](https://github.com/facebook/docusaurus/pull/3145) docs(v2): add myself to /team page + add TeamProfileCard component ([@slorber](https://github.com/slorber))
- [#3146](https://github.com/facebook/docusaurus/pull/3146) docs(v2): prettier docs ([@slorber](https://github.com/slorber))
- [#3116](https://github.com/facebook/docusaurus/pull/3116) chore(v2): docs updates after release ([@slorber](https://github.com/slorber))

#### :house: Internal

- Other
  - [#3130](https://github.com/facebook/docusaurus/pull/3130) chore(v2): remove old versions ([@slorber](https://github.com/slorber))
- `docusaurus-1.x`, `docusaurus-init-1.x`, `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-bootstrap`, `docusaurus-preset-classic`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`, `lqip-loader`, `stylelint-copyright`
  - [#3114](https://github.com/facebook/docusaurus/pull/3114) chore(v2): prepare v2.0.0.alpha-59 release ([@slorber](https://github.com/slorber))

#### Committers: 4

- Bartosz Kaszubowski ([@Simek](https://github.com/Simek))
- Hob Adams ([@hobadams](https://github.com/hobadams))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Teik Jun ([@teikjun](https://github.com/teikjun))

## 2.0.0-alpha.59 (2020-07-24)

#### :rocket: New Feature

- `docusaurus-migrate`, `docusaurus-plugin-client-redirects`
  - [#3015](https://github.com/facebook/docusaurus/pull/3015) feat: automate migration from v1 to v2 ([@anshulrgoyal](https://github.com/anshulrgoyal))
- `docusaurus-init`
  - [#3105](https://github.com/facebook/docusaurus/pull/3105) feat(v2): add docusaurus script for npm users ([@slorber](https://github.com/slorber))
- `docusaurus-theme-search-algolia`
  - [#2815](https://github.com/facebook/docusaurus/pull/2815) feat(v2): introduce DocSearch v3 search ([@francoischalifour](https://github.com/francoischalifour))
- `docusaurus-init`, `docusaurus-types`, `docusaurus`
  - [#3059](https://github.com/facebook/docusaurus/pull/3059) feat(v2): broken links detection ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-utils`
  - [#3084](https://github.com/facebook/docusaurus/pull/3084) feat(v2): absolute slugs and slug resolution system ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`
  - [#3069](https://github.com/facebook/docusaurus/pull/3069) feat(v2): support for adding relative images and handling broken image links ([@anshulrgoyal](https://github.com/anshulrgoyal))
- `docusaurus-init`, `docusaurus-module-type-aliases`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-debug`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus`
  - [#2971](https://github.com/facebook/docusaurus/pull/2971) feat(v2): global data + useGlobalData + docs versions dropdown ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus`
  - [#3080](https://github.com/facebook/docusaurus/pull/3080) feat(v2): add support for serve command ([@anshulrgoyal](https://github.com/anshulrgoyal))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-debug`, `docusaurus-types`, `docusaurus`
  - [#3058](https://github.com/facebook/docusaurus/pull/3058) feat(v2): useDocusaurusContext().siteMetadata ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#3032](https://github.com/facebook/docusaurus/pull/3032) feat(v2): notify users when docusaurus version is outdated ([@teikjun](https://github.com/teikjun))
  - [#3033](https://github.com/facebook/docusaurus/pull/3033) feat(v2): add useBaseUrlUtils() hook ([@slorber](https://github.com/slorber))
  - [#3006](https://github.com/facebook/docusaurus/pull/3006) feat(v2): prompt user when default port is in use ([@taylorallen0913](https://github.com/taylorallen0913))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-debug`, `docusaurus`
  - [#3050](https://github.com/facebook/docusaurus/pull/3050) feat(v2): Collect plugin versions to allow them to be inspected in debug plugin ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-theme-classic`
  - [#3038](https://github.com/facebook/docusaurus/pull/3038) feat(v2): Support keywords meta in blog posts ([@dpkg](https://github.com/dpkg))
  - [#2974](https://github.com/facebook/docusaurus/pull/2974) feat(v2): Error when hooks depends on context is used outside of Layout ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-plugin-pwa`, `docusaurus`
  - [#2205](https://github.com/facebook/docusaurus/pull/2205) feat(v2): Plugin for Offline/PWA support ([@codemonkey800](https://github.com/codemonkey800))
- `docusaurus-plugin-ideal-image`, `docusaurus-types`, `docusaurus`
  - [#2994](https://github.com/facebook/docusaurus/pull/2994) feat(v2): configureWebpack merge strategy + use file-loader for common asset types ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`
  - [#2989](https://github.com/facebook/docusaurus/pull/2989) feat(v2): add disableVersioning config to docs plugin ([@slorber](https://github.com/slorber))
  - [#2877](https://github.com/facebook/docusaurus/pull/2877) feat(v2): allow skipping build docs for next version ([@lex111](https://github.com/lex111))
- `docusaurus-1.x`
  - [#2955](https://github.com/facebook/docusaurus/pull/2955) feat(v1): add deletedDocs config to fix unwanted versioning fallback ([@aldeed](https://github.com/aldeed))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-types`, `docusaurus`
  - [#2943](https://github.com/facebook/docusaurus/pull/2943) feat(v2): option and config validation life cycle method for official plugins ([@anshulrgoyal](https://github.com/anshulrgoyal))

#### :boom: Breaking Change

- `docusaurus-init`, `docusaurus-module-type-aliases`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-debug`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus`
  - [#2971](https://github.com/facebook/docusaurus/pull/2971) feat(v2): global data + useGlobalData + docs versions dropdown ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus`
  - [#3012](https://github.com/facebook/docusaurus/pull/3012) fix(v2): refactor color mode system ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus`
  - [#3107](https://github.com/facebook/docusaurus/pull/3107) fix(v2): broken links detector: ignore existing folders ([@slorber](https://github.com/slorber))
  - [#3112](https://github.com/facebook/docusaurus/pull/3112) fix(v2): baseUrl is wrongly appended to anchor links ([@slorber](https://github.com/slorber))
  - [#3063](https://github.com/facebook/docusaurus/pull/3063) fix(v2): classify link hrefs with protocol identifier as internal ([@svtfrida](https://github.com/svtfrida))
- `docusaurus-theme-classic`
  - [#3106](https://github.com/facebook/docusaurus/pull/3106) fix(v2): dropdown navbar item: validation too strict ([@slorber](https://github.com/slorber))
  - [#3029](https://github.com/facebook/docusaurus/pull/3029) fix(v2): change description for blog post paginator ([@teikjun](https://github.com/teikjun))
- `docusaurus-plugin-content-docs`
  - [#3108](https://github.com/facebook/docusaurus/pull/3108) fix(v2): fix docs instance path typo ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-pages`
  - [#3025](https://github.com/facebook/docusaurus/pull/3025) fix(v2):pass siteConfig as prop to pages ([@anshulrgoyal](https://github.com/anshulrgoyal))
- `docusaurus-init`
  - [#3008](https://github.com/facebook/docusaurus/pull/3008) chore(v2): Add E2E test for yarn v2 ([@SamChou19815](https://github.com/SamChou19815))
- Other
  - [#3017](https://github.com/facebook/docusaurus/pull/3017) fix(v2): fix broken links on versions page ([@teikjun](https://github.com/teikjun))
- `docusaurus-theme-classic`, `docusaurus`
  - [#3012](https://github.com/facebook/docusaurus/pull/3012) fix(v2): refactor color mode system ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-utils`, `docusaurus`
  - [#3001](https://github.com/facebook/docusaurus/pull/3001) fix(v2): refactor routes.ts + add route hash for chunkNames key ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-client-redirects`, `docusaurus-utils`, `docusaurus`
  - [#3010](https://github.com/facebook/docusaurus/pull/3010) fix(v2): make client-redirect-plugin not baseUrl sensitive ([@teikjun](https://github.com/teikjun))
- `docusaurus-1.x`
  - [#2993](https://github.com/facebook/docusaurus/pull/2993) fix(relative path): last update date and by isn’t generated if localh… ([@amirulahmad](https://github.com/amirulahmad))
- `docusaurus-plugin-client-redirects`
  - [#2969](https://github.com/facebook/docusaurus/pull/2969) fix: fromExtensions and toExtensions translation when used with baseUrl ([@jknoxville](https://github.com/jknoxville))

#### :nail_care: Polish

- `docusaurus-theme-classic`, `docusaurus`
  - [#3088](https://github.com/facebook/docusaurus/pull/3088) improve navbar menu ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`
  - [#3087](https://github.com/facebook/docusaurus/pull/3087) refactor(v2): async md image transformer + pathname protocol as an escape hatch ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-sitemap`, `docusaurus-theme-live-codeblock`, `docusaurus-types`
  - [#2970](https://github.com/facebook/docusaurus/pull/2970) feat(v2): add option validation for remaining official plugins ([@teikjun](https://github.com/teikjun))
- `docusaurus`
  - [#2987](https://github.com/facebook/docusaurus/pull/2987) chore(v2): use joi for config validation ([@anshulrgoyal](https://github.com/anshulrgoyal))

#### :memo: Documentation

- [#3026](https://github.com/facebook/docusaurus/pull/3026) docs(v2): add documentation for migration command ([@teikjun](https://github.com/teikjun))
- [#3094](https://github.com/facebook/docusaurus/pull/3094) docs(v2): showcase user Clutch ([@danielhochman](https://github.com/danielhochman))
- [#3101](https://github.com/facebook/docusaurus/pull/3101) docs(v2):Add azure-pipelines CI guide ([@ayan-b](https://github.com/ayan-b))
- [#3098](https://github.com/facebook/docusaurus/pull/3098) docs: Add azure-pipelines CI guide ([@ayan-b](https://github.com/ayan-b))
- [#3086](https://github.com/facebook/docusaurus/pull/3086) doc(v2): replace heading position ([@eKhattak](https://github.com/eKhattak))
- [#3082](https://github.com/facebook/docusaurus/pull/3082) fixing few typos and enhancing few sentences clarity ([@aladin002dz](https://github.com/aladin002dz))
- [#3078](https://github.com/facebook/docusaurus/pull/3078) Updated link for #docusaurus-2-dev discord ([@jordanliu](https://github.com/jordanliu))
- [#3076](https://github.com/facebook/docusaurus/pull/3076) docs(v2): showcase Runlet ([@vandreleal](https://github.com/vandreleal))
- [#3040](https://github.com/facebook/docusaurus/pull/3040) docs(v2): correct the documentation for docs-only mode ([@teikjun](https://github.com/teikjun))
- [#3034](https://github.com/facebook/docusaurus/pull/3034) docs(v2): showcase user Tasit ([@pcowgill](https://github.com/pcowgill))
- [#3022](https://github.com/facebook/docusaurus/pull/3022) docs(v2): showcase Eta ([@nebrelbug](https://github.com/nebrelbug))
- [#3011](https://github.com/facebook/docusaurus/pull/3011) docs(v1): external links ([@slorber](https://github.com/slorber))
- [#2997](https://github.com/facebook/docusaurus/pull/2997) docs(v2): Document TypeScript support ([@SamChou19815](https://github.com/SamChou19815))
- [#2973](https://github.com/facebook/docusaurus/pull/2973) docs(v2): Fix typo in markdown-features ([@ehsanjso](https://github.com/ehsanjso))
- [#2991](https://github.com/facebook/docusaurus/pull/2991) Showcase Amphora Data ([@xtellurian](https://github.com/xtellurian))
- [#2983](https://github.com/facebook/docusaurus/pull/2983) docs(v2): add plugin redirects production build note ([@slorber](https://github.com/slorber))
- [#2967](https://github.com/facebook/docusaurus/pull/2967) docs(v2): fix typos in plugin-content examples ([@hi-matbub](https://github.com/hi-matbub))
- [#2960](https://github.com/facebook/docusaurus/pull/2960) doc(v2): publish doc update after alpha.58 release ([@slorber](https://github.com/slorber))
- [#2966](https://github.com/facebook/docusaurus/pull/2966) docs(v2): fix typo in plugin-content-pages example ([@hi-matbub](https://github.com/hi-matbub))

#### :house: Internal

- `docusaurus-migrate`
  - [#3113](https://github.com/facebook/docusaurus/pull/3113) chore(v2): ability to test the migration cli easily ([@slorber](https://github.com/slorber))
- Other
  - [#3099](https://github.com/facebook/docusaurus/pull/3099) fix(v2): netlify.toml shouldn't affect v1 site deployment config ([@slorber](https://github.com/slorber))
  - [#3068](https://github.com/facebook/docusaurus/pull/3068) chore(deps): bump lodash from 4.17.15 to 4.17.19 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#2958](https://github.com/facebook/docusaurus/pull/2958) docs(v2): rename 2.0.0-alpha.57 to 2.0.0-alpha.58 ([@yangshun](https://github.com/yangshun))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus`
  - [#3093](https://github.com/facebook/docusaurus/pull/3093) fix(v2): fix recent baseurl issues ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`
  - [#3087](https://github.com/facebook/docusaurus/pull/3087) refactor(v2): async md image transformer + pathname protocol as an escape hatch ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-pwa`, `docusaurus`
  - [#3055](https://github.com/facebook/docusaurus/pull/3055) chore(v2): Adopt corejs 3 and only import at entry point ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-init`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-utils`, `docusaurus`
  - [#2998](https://github.com/facebook/docusaurus/pull/2998) chore(v2): refactor yarn tsc to yarn build + add theme-classic watch mode ([@slorber](https://github.com/slorber))
- `docusaurus-init`
  - [#3008](https://github.com/facebook/docusaurus/pull/3008) chore(v2): Add E2E test for yarn v2 ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-plugin-content-docs`, `docusaurus-utils`, `docusaurus`
  - [#3001](https://github.com/facebook/docusaurus/pull/3001) fix(v2): refactor routes.ts + add route hash for chunkNames key ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#3007](https://github.com/facebook/docusaurus/pull/3007) fix(v2): Add two missing docusaurus core babel dependency ([@SamChou19815](https://github.com/SamChou19815))
  - [#2987](https://github.com/facebook/docusaurus/pull/2987) chore(v2): use joi for config validation ([@anshulrgoyal](https://github.com/anshulrgoyal))
  - [#2950](https://github.com/facebook/docusaurus/pull/2950) chore(v2): Implement a simple E2E testing mechanism for `docusausus start` ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-sitemap`, `docusaurus-theme-live-codeblock`, `docusaurus-types`
  - [#2970](https://github.com/facebook/docusaurus/pull/2970) feat(v2): add option validation for remaining official plugins ([@teikjun](https://github.com/teikjun))
- `docusaurus-theme-classic`
  - [#2996](https://github.com/facebook/docusaurus/pull/2996) chore(v2): Merge devDependencies in theme-classic ([@SamChou19815](https://github.com/SamChou19815))
  - [#2977](https://github.com/facebook/docusaurus/pull/2977) chore(v2): Remove extraneous package-lock.json ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-plugin-client-redirects`
  - [#2962](https://github.com/facebook/docusaurus/pull/2962) Feat: replace yup with joi for cleaner validation ([@anshulrgoyal](https://github.com/anshulrgoyal))
- `docusaurus-init`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-sitemap`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#2976](https://github.com/facebook/docusaurus/pull/2976) chore(v2): Fix more eslint errors ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-sitemap`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#2972](https://github.com/facebook/docusaurus/pull/2972) chore(v2): Fix a lot of eslint warnings ([@SamChou19815](https://github.com/SamChou19815))

#### Committers: 25

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Amirul Ahmad ([@amirulahmad](https://github.com/amirulahmad))
- Anshul Goyal ([@anshulrgoyal](https://github.com/anshulrgoyal))
- Arsalan Khattak ([@eKhattak](https://github.com/eKhattak))
- Ayan Banerjee ([@ayan-b](https://github.com/ayan-b))
- Ben Gubler ([@nebrelbug](https://github.com/nebrelbug))
- Daniel Hochman ([@danielhochman](https://github.com/danielhochman))
- Deepak Giri ([@dpkg](https://github.com/dpkg))
- Eric Dobbertin ([@aldeed](https://github.com/aldeed))
- François Chalifour ([@francoischalifour](https://github.com/francoischalifour))
- Frida Hjelm ([@svtfrida](https://github.com/svtfrida))
- Jeremy Asuncion ([@codemonkey800](https://github.com/codemonkey800))
- John Knox ([@jknoxville](https://github.com/jknoxville))
- Jordan Liu ([@jordanliu](https://github.com/jordanliu))
- Mahfoudh Arous ([@aladin002dz](https://github.com/aladin002dz))
- Paul Cowgill ([@pcowgill](https://github.com/pcowgill))
- Rian Finnegan ([@xtellurian](https://github.com/xtellurian))
- Sam Zhou ([@SamChou19815](https://github.com/SamChou19815))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Taylor Allen ([@taylorallen0913](https://github.com/taylorallen0913))
- Teik Jun ([@teikjun](https://github.com/teikjun))
- Vandré Leal ([@vandreleal](https://github.com/vandreleal))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))
- ehsan jso ([@ehsanjso](https://github.com/ehsanjso))
- matbub ([@hi-matbub](https://github.com/hi-matbub))

## 2.0.0-alpha.58

#### :rocket: New Feature

- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#2916](https://github.com/facebook/docusaurus/pull/2916) feat(v2): add a banner that links to latest version of documentation ([@teikjun](https://github.com/teikjun))
  - [#2682](https://github.com/facebook/docusaurus/pull/2682) feat(v2): expanded sidebar categories by default ([@jsjoeio](https://github.com/jsjoeio))
- `docusaurus-plugin-debug`, `docusaurus-preset-classic`
  - [#2928](https://github.com/facebook/docusaurus/pull/2928) feat(v2): Implement proof-of-concept Docusaurus Debug Dashboard ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-init`, `docusaurus`
  - [#2903](https://github.com/facebook/docusaurus/pull/2903) feat(v2): Allow configuring babel via babel.config.js ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-plugin-client-redirects`, `docusaurus-utils`
  - [#2793](https://github.com/facebook/docusaurus/pull/2793) feat(v2): docusaurus-plugin-client-redirects ([@slorber](https://github.com/slorber))
- `docusaurus-theme-live-codeblock`
  - [#2826](https://github.com/facebook/docusaurus/pull/2826) feat(v2): allow adding components to react-live scope ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus`
  - [#2856](https://github.com/facebook/docusaurus/pull/2856) feat(v2): allow specifying meta image for blog posts ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#2841](https://github.com/facebook/docusaurus/pull/2841) feat(v2): Allow swizzling prism-include-languages in theme-classic ([@SamChou19815](https://github.com/SamChou19815))

#### :boom: Breaking Change

- `docusaurus-init`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#2895](https://github.com/facebook/docusaurus/pull/2895) chore(v2): replace classnames with clsx ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`
  - [#2861](https://github.com/facebook/docusaurus/pull/2861) fix(v2): do not create route for document that serve as docs home page ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#2682](https://github.com/facebook/docusaurus/pull/2682) feat(v2): expanded sidebar categories by default ([@jsjoeio](https://github.com/jsjoeio))

#### :bug: Bug Fix

- `docusaurus-plugin-content-docs`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`
  - [#2905](https://github.com/facebook/docusaurus/pull/2905) fix(v2): fix docs homepage permalink issues ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#2932](https://github.com/facebook/docusaurus/pull/2932) fix(v2): Add hooks to detect window resize, toggle off sidebar and navbar in desktop ([@guillaumejacquart](https://github.com/guillaumejacquart))
  - [#2909](https://github.com/facebook/docusaurus/pull/2909) fix(v2): adjust anchor offset when routes switched ([@lex111](https://github.com/lex111))
  - [#2896](https://github.com/facebook/docusaurus/pull/2896) fix(v2): set correct canonical url for docs home page ([@lex111](https://github.com/lex111))
  - [#2893](https://github.com/facebook/docusaurus/pull/2893) fix(v2): Do not automatically change tab when a non-existing option is selected ([@SamChou19815](https://github.com/SamChou19815))
  - [#2888](https://github.com/facebook/docusaurus/pull/2888) fix(v2): restore styles for menu scrollbar ([@lex111](https://github.com/lex111))
  - [#2857](https://github.com/facebook/docusaurus/pull/2857) fix(v2): treat inline code in raw HTML as native element ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#2951](https://github.com/facebook/docusaurus/pull/2951) fix(v2): Add optional-chaining and nullish-coalescing babel plugin ([@SamChou19815](https://github.com/SamChou19815))
  - [#2921](https://github.com/facebook/docusaurus/pull/2921) fix(v2): upgrade react-loadable-ssr-addon ([@slorber](https://github.com/slorber))
  - [#2854](https://github.com/facebook/docusaurus/pull/2854) fix(v2): fix broken build when swizzled NotFound component exist ([@lex111](https://github.com/lex111))
  - [#2829](https://github.com/facebook/docusaurus/pull/2829) fix(v2): Fix plugin path resolution ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-preset-classic`
  - [#2944](https://github.com/facebook/docusaurus/pull/2944) fix(v2): Declare @docusaurus-plugin-debug as dependency of preset classic ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-init`
  - [#2902](https://github.com/facebook/docusaurus/pull/2902) feat(v2): add nojekyll file to static folder for all templates ([@teikjun](https://github.com/teikjun))
- `docusaurus-theme-bootstrap`
  - [#2860](https://github.com/facebook/docusaurus/pull/2860) fix(v2): bootstrap doc sidebar ([@fanny](https://github.com/fanny))
- Other
  - [#2874](https://github.com/facebook/docusaurus/pull/2874) fix(v2): Getting Started URL ([@fanny](https://github.com/fanny))
- `docusaurus-plugin-content-docs`
  - [#2861](https://github.com/facebook/docusaurus/pull/2861) fix(v2): do not create route for document that serve as docs home page ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#2867](https://github.com/facebook/docusaurus/pull/2867) fix(v2): fix FOUC in doc sidebar and various improvements ([@slorber](https://github.com/slorber))
- `docusaurus-theme-search-algolia`
  - [#2838](https://github.com/facebook/docusaurus/pull/2838) fix(v2): use base url to navigate to search page ([@tetunori](https://github.com/tetunori))
- `docusaurus-utils`
  - [#2855](https://github.com/facebook/docusaurus/pull/2855) fix(v2): strip images and footnotes for excerpt correctly ([@lex111](https://github.com/lex111))
- `docusaurus-theme-live-codeblock`
  - [#2835](https://github.com/facebook/docusaurus/pull/2835) fix(v2): set proper font for live editor ([@lex111](https://github.com/lex111))

#### :nail_care: Polish

- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-utils`, `docusaurus`
  - [#2884](https://github.com/facebook/docusaurus/pull/2884) polish(v2): improve Docusaurus 1 to 2 migration developer experience ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#2870](https://github.com/facebook/docusaurus/pull/2870) refactor(v2): combine nested theme providers into one ([@lex111](https://github.com/lex111))
  - [#2880](https://github.com/facebook/docusaurus/pull/2880) fix(v2): render as regular text uncollapsible categories ([@lex111](https://github.com/lex111))
  - [#2864](https://github.com/facebook/docusaurus/pull/2864) refactor(v2): add aria role for doc sidebar ([@lex111](https://github.com/lex111))
  - [#2859](https://github.com/facebook/docusaurus/pull/2859) refactor(v2): add aria label to paginators ([@lex111](https://github.com/lex111))
  - [#2858](https://github.com/facebook/docusaurus/pull/2858) refactor(v2): add missing main landmark for needed pages ([@lex111](https://github.com/lex111))
- Other
  - [#2862](https://github.com/facebook/docusaurus/pull/2862) Updated banner in solidarity ([@JoelMarcey](https://github.com/JoelMarcey))

#### :memo: Documentation

- [#2946](https://github.com/facebook/docusaurus/pull/2946) docs(v2): add require.resolve to plugin imports on remaining pages ([@teikjun](https://github.com/teikjun))
- [#2941](https://github.com/facebook/docusaurus/pull/2941) docs(v2): wrap all plugin imports in require.resolve() ([@TomBrien](https://github.com/TomBrien))
- [#2934](https://github.com/facebook/docusaurus/pull/2934) docs(v2): add useThemeContext note ([@Drewbi](https://github.com/Drewbi))
- [#2935](https://github.com/facebook/docusaurus/pull/2935) docs(v2): Add router implementation note ([@Drewbi](https://github.com/Drewbi))
- [#2933](https://github.com/facebook/docusaurus/pull/2933) docs(v2): add documentation for multiple blogs ([@teikjun](https://github.com/teikjun))
- [#2910](https://github.com/facebook/docusaurus/pull/2910) docs(v2): fix GitHub action workflow in docs ([@anshulrgoyal](https://github.com/anshulrgoyal))
- [#2886](https://github.com/facebook/docusaurus/pull/2886) docs(v2): fix typo in command on installation page ([@pglezen](https://github.com/pglezen))
- [#2887](https://github.com/facebook/docusaurus/pull/2887) docs(v2): make .nojekyll warning more obvious ([@yangshun](https://github.com/yangshun))
- [#2865](https://github.com/facebook/docusaurus/pull/2865) docs(v2): description field in frontmatter of blog post ([@lex111](https://github.com/lex111))
- [#2839](https://github.com/facebook/docusaurus/pull/2839) docs(v2): \_index docs page does not show a sidebar ([@aeneasr](https://github.com/aeneasr))
- [#2852](https://github.com/facebook/docusaurus/pull/2852) misc: move runme demo in block quote about v2 ([@lex111](https://github.com/lex111))
- [#2842](https://github.com/facebook/docusaurus/pull/2842) docs(v2): Update ZEIT to Vercel ([@Nishikoh](https://github.com/Nishikoh))

#### :house: Internal

- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`
  - [#2948](https://github.com/facebook/docusaurus/pull/2948) refactor(v2): legacy export = syntax ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-sitemap`, `docusaurus-utils`, `docusaurus`
  - [#2922](https://github.com/facebook/docusaurus/pull/2922) misc(v2): better dx: yarn clear, yarn watch, yarn serve ([@slorber](https://github.com/slorber))
- Other
  - [#2929](https://github.com/facebook/docusaurus/pull/2929) chore(v2): Run E2E tests in CI ([@SamChou19815](https://github.com/SamChou19815))
  - [#2899](https://github.com/facebook/docusaurus/pull/2899) chore(deps): bump websocket-extensions from 0.1.3 to 0.1.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#2897](https://github.com/facebook/docusaurus/pull/2897) refactor(v2): synchronize yarn/npm command on site ([@lex111](https://github.com/lex111))
- `docusaurus-theme-bootstrap`
  - [#2931](https://github.com/facebook/docusaurus/pull/2931) chore(v2): remove unused hooks from bootstrap theme ([@fanny](https://github.com/fanny))
- `docusaurus-1.x`, `docusaurus-plugin-content-docs`
  - [#2906](https://github.com/facebook/docusaurus/pull/2906) chore(v2): fix async tests ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#2858](https://github.com/facebook/docusaurus/pull/2858) refactor(v2): add missing main landmark for needed pages ([@lex111](https://github.com/lex111))

#### :running_woman: Performance

- `docusaurus-plugin-content-blog`, `docusaurus-plugin-sitemap`
  - [#2936](https://github.com/facebook/docusaurus/pull/2936) perf(v2): convert synchronous filewrite to asynchronous ([@moonrailgun](https://github.com/moonrailgun))
- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#2900](https://github.com/facebook/docusaurus/pull/2900) chore(v2): replace Clipboard with copy-text-to-clipboard ([@lex111](https://github.com/lex111))
- `docusaurus-init`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#2895](https://github.com/facebook/docusaurus/pull/2895) chore(v2): replace classnames with clsx ([@lex111](https://github.com/lex111))

#### Committers: 18

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Anshul Goyal ([@anshulrgoyal](https://github.com/anshulrgoyal))
- Drew Alexander ([@Drewbi](https://github.com/Drewbi))
- Fanny ([@fanny](https://github.com/fanny))
- Guillaume Jacquart ([@guillaumejacquart](https://github.com/guillaumejacquart))
- Joe Previte ([@jsjoeio](https://github.com/jsjoeio))
- Joel Marcey ([@JoelMarcey](https://github.com/JoelMarcey))
- Koki Nishihara ([@Nishikoh](https://github.com/Nishikoh))
- Paul Glezen ([@pglezen](https://github.com/pglezen))
- Sam Zhou ([@SamChou19815](https://github.com/SamChou19815))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Teik Jun ([@teikjun](https://github.com/teikjun))
- Tom Brien ([@TomBrien](https://github.com/TomBrien))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))
- [@belokonm](https://github.com/belokonm)
- hackerman ([@aeneasr](https://github.com/aeneasr))
- moonrailgun ([@moonrailgun](https://github.com/moonrailgun))
- tetunori ([@tetunori](https://github.com/tetunori))

## 2.0.0-alpha.57

Bad release, check ## 2.0.0-alpha.58

## 2.0.0-alpha.56

#### :boom: Breaking Change

- If you refer to modules (plugins) in your config file in a string form, you will need to replace them with `require.resolve` calls, for example:

```diff
- plugins: ['@docusaurus/plugin-google-analytics']
+ plugins: [require.resolve('@docusaurus/plugin-google-analytics')]
```

- `docusaurus-theme-classic`
  - [#2818](https://github.com/facebook/docusaurus/pull/2818) feat(v2): automatically add base url to logo link ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`
  - [#2791](https://github.com/facebook/docusaurus/pull/2791) refactor(v2): show search icon only on mobiles ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#2780](https://github.com/facebook/docusaurus/pull/2780) feat(v2): open external links in new tab by default ([@jknoxville](https://github.com/jknoxville))

#### :rocket: New Feature

- `docusaurus-types`, `docusaurus`
  - [#2770](https://github.com/facebook/docusaurus/pull/2770) feat(v2): allow deploy without building website ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#2818](https://github.com/facebook/docusaurus/pull/2818) feat(v2): automatically add base url to logo link ([@lex111](https://github.com/lex111))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#2645](https://github.com/facebook/docusaurus/pull/2645) fix(v2): enable scrolling for sidebar menu only ([@lex111](https://github.com/lex111))
  - [#2800](https://github.com/facebook/docusaurus/pull/2800) fix(v2): make proper h1 font size on mobiles ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#2788](https://github.com/facebook/docusaurus/pull/2788) fix(v2): use `require.resolve` for all webpack presets and plugins ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-plugin-content-docs`
  - [#2785](https://github.com/facebook/docusaurus/pull/2785) fix(v2): do not show sidebar on reserved docs home page ([@lex111](https://github.com/lex111))
  - [#2777](https://github.com/facebook/docusaurus/pull/2777) fix(v2): check for docs homepage correctly ([@lex111](https://github.com/lex111))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#2820](https://github.com/facebook/docusaurus/pull/2820) chore(v2): upgrade Infima to 0.2.0-alpha.12 ([@lex111](https://github.com/lex111))
- `docusaurus-theme-search-algolia`
  - [#2814](https://github.com/facebook/docusaurus/pull/2814) refactor(v2): align search icon to center on mobiles ([@lex111](https://github.com/lex111))
  - [#2799](https://github.com/facebook/docusaurus/pull/2799) refactor(v2): increase search input on medium screens ([@lex111](https://github.com/lex111))
- `docusaurus-init`
  - [#2802](https://github.com/facebook/docusaurus/pull/2802) misc: minor improvements for init templates ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`
  - [#2791](https://github.com/facebook/docusaurus/pull/2791) refactor(v2): show search icon only on mobiles ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#2783](https://github.com/facebook/docusaurus/pull/2783) refactor(v2): make external links more secure ([@lex111](https://github.com/lex111))

#### :memo: Documentation

- [#2809](https://github.com/facebook/docusaurus/pull/2809) docs(v2): add mention on DocSearch when you run the crawler on your own ([@s-pace](https://github.com/s-pace))

#### :house: Internal

- [#2778](https://github.com/facebook/docusaurus/pull/2778) fix(v2): do not highlight root docs path in navbar ([@lex111](https://github.com/lex111))

#### Committers: 8

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- James McShane ([@jmcshane](https://github.com/jmcshane))
- John Knox ([@jknoxville](https://github.com/jknoxville))
- Kasper Bøgebjerg Pedersen ([@kasperp](https://github.com/kasperp))
- Muhammad Ali ([@mrmuhammadali](https://github.com/mrmuhammadali))
- Piotr Baran ([@piotros](https://github.com/piotros))
- Sam Zhou ([@SamChou19815](https://github.com/SamChou19815))
- Sylvain Pace ([@s-pace](https://github.com/s-pace))

## 2.0.0-alpha.55

#### :boom: Breaking Change

- `infima`

  - The following Infima classes have been renamed for consistency:

    - `page-item` → `pagination__item`
    - `pagination-nav__link--label` → `pagination-nav__label`
    - `pagination-nav__link--sublabel` → `pagination-nav__sublabel`
    - `tab-item` → `tabs__item`
    - `tab-item--active` → `tabs__item--active`

    If you have swizzled components, you need to replace these class names.

- `docusaurus`

  - [#2764](https://github.com/facebook/docusaurus/pull/2764) feat(v2): allow import SVG images ([@lex111](https://github.com/lex111))

#### :rocket: New Feature

- `docusaurus`
  - [#2764](https://github.com/facebook/docusaurus/pull/2764) feat(v2): allow import SVG images ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#2690](https://github.com/facebook/docusaurus/pull/2690) feat(v2): allow activeBaseTest in NavLink ([@nebrelbug](https://github.com/nebrelbug))
  - [#2694](https://github.com/facebook/docusaurus/pull/2694) feat(v2): add canonical URL to `<head>` ([@jcomack](https://github.com/jcomack))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus`
  - [#2652](https://github.com/facebook/docusaurus/pull/2652) feat(v2): allow home page for docs ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#2756](https://github.com/facebook/docusaurus/pull/2756) feat(v2): add search page 🔎 ([@lex111](https://github.com/lex111))

#### :bug: Bug Fix

- `docusaurus-plugin-content-docs`, `docusaurus-utils`
  - [#2701](https://github.com/facebook/docusaurus/pull/2701) fix(v2): remove Markdown syntax from excerpt ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#2765](https://github.com/facebook/docusaurus/pull/2765) fix(v2): remove invalid attr from mobile nav links ([@lex111](https://github.com/lex111))
  - [#2760](https://github.com/facebook/docusaurus/pull/2760) fix(v2): move anchor link to right of heading ([@lex111](https://github.com/lex111))
  - [#2758](https://github.com/facebook/docusaurus/pull/2758) fix(v2): remove extra top margin of tab item ([@lex111](https://github.com/lex111))
  - [#2759](https://github.com/facebook/docusaurus/pull/2759) fix(v2): restore hiding of docs toc ([@lex111](https://github.com/lex111))
- `docusaurus-theme-search-algolia`
  - [#2762](https://github.com/facebook/docusaurus/pull/2762) fix(v2): avoid duplication search input in navbar ([@lex111](https://github.com/lex111))
- `lqip-loader`
  - [#2693](https://github.com/facebook/docusaurus/pull/2693) fix(v2): add support esModule to lqip-loader ([@ykzts](https://github.com/ykzts))
- `docusaurus-init`
  - [#2751](https://github.com/facebook/docusaurus/pull/2751) fix(v2): fix index page features.length when 0 ([@jdeniau](https://github.com/jdeniau))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#2773](https://github.com/facebook/docusaurus/pull/2773) chore(v2): upgrade Infima to 0.2.0-alpha.11 ([@lex111](https://github.com/lex111))
  - [#2766](https://github.com/facebook/docusaurus/pull/2766) refactor(v2): remove extra active CSS class for menu item links ([@lex111](https://github.com/lex111))
- `docusaurus-theme-live-codeblock`
  - [#2767](https://github.com/facebook/docusaurus/pull/2767) refactor(v2): add support for dark mode to live code blocks ([@lex111](https://github.com/lex111))
- `docusaurus-theme-search-algolia`
  - [#2761](https://github.com/facebook/docusaurus/pull/2761) refactor(v2): improve UX of search page ([@lex111](https://github.com/lex111))
- `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`
  - [#2729](https://github.com/facebook/docusaurus/pull/2729) chore(v2): upgrade Infima to 0.2.0-alpha.10 ([@lex111](https://github.com/lex111))
- `docusaurus-utils`
  - [#2696](https://github.com/facebook/docusaurus/pull/2696) refactor(v2): make semicolon optional in imports for excerpt ([@lex111](https://github.com/lex111))

#### :memo: Documentation

- [#2768](https://github.com/facebook/docusaurus/pull/2768) docs(v2): various improvements ([@lex111](https://github.com/lex111))
- [#2670](https://github.com/facebook/docusaurus/pull/2670) docs(v2): add deployment workflow manual for GitHub Actions ([@artemkovalyov](https://github.com/artemkovalyov))

#### :house: Internal

- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus`
  - [#2464](https://github.com/facebook/docusaurus/pull/2464) refactor(v2): add @theme-init alias to give access to initial components ([@lex111](https://github.com/lex111))

#### :running_woman: Performance

- `docusaurus`
  - [#2684](https://github.com/facebook/docusaurus/pull/2684) refactor(v2): replace EJS with Eta for SSR generation ([@nebrelbug](https://github.com/nebrelbug))

#### Committers: 13

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Artem Kovalov ([@artemkovalyov](https://github.com/artemkovalyov))
- Ben Gubler ([@nebrelbug](https://github.com/nebrelbug))
- Fanny ([@fanny](https://github.com/fanny))
- Jimmy ([@jcomack](https://github.com/jcomack))
- Jonny Nabors ([@jonnynabors](https://github.com/jonnynabors))
- Julien Deniau ([@jdeniau](https://github.com/jdeniau))
- Marco Moretti ([@marcosvega91](https://github.com/marcosvega91))
- Rajiv Singh ([@iamrajiv](https://github.com/iamrajiv))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Taylor Reece ([@taylorreece](https://github.com/taylorreece))
- Yamagishi Kazutoshi ([@ykzts](https://github.com/ykzts))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))

## 2.0.0-alpha.54

**HOTFIX for 2.0.0-alpha.53**.

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#2688](https://github.com/facebook/docusaurus/pull/2688) fix(v2): add default value for options in theme classic ([@lex111](https://github.com/lex111))
- `docusaurus-module-type-aliases`
  - [#2687](https://github.com/facebook/docusaurus/pull/2687) fix(v2): Add all webpack module aliases to type declaration file ([@SamChou19815](https://github.com/SamChou19815))

#### :memo: Documentation

- [#2680](https://github.com/facebook/docusaurus/pull/2680) docs(v2): add swizzle example ([@jsjoeio](https://github.com/jsjoeio))

#### Committers: 3

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Joe Previte ([@jsjoeio](https://github.com/jsjoeio))
- Sam Zhou ([@SamChou19815](https://github.com/SamChou19815))

## 2.0.0-alpha.53

**HOTFIX for 2.0.0-alpha.51**.

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#2676](https://github.com/facebook/docusaurus/pull/2676) fix(v2): allow build website without custom css ([@lex111](https://github.com/lex111))

#### Committers: 1

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))

## 2.0.0-alpha.51

#### :boom: Breaking Change

- `infima`
  - The following infima variables have been renamed for consistency:
    - `--ifm-font-base-color` → `--ifm-font-color-base`
    - `--ifm-font-base-color-inverse` → `--ifm-font-color-base-inverse`
    - `--ifm-font-color-secondary` → `--ifm-font-color-secondary`

#### :rocket: New Feature

- `docusaurus-theme-classic`
  - [#2660](https://github.com/facebook/docusaurus/pull/2660) feat(v2): add ability to specify CSS class for navbar item ([@lex111](https://github.com/lex111))
  - [#2597](https://github.com/facebook/docusaurus/pull/2597) feat(v2): add ability set dark mode by default ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#2665](https://github.com/facebook/docusaurus/pull/2665) feat(v2): add fallback to BrowserOnly component ([@lex111](https://github.com/lex111))
- `docusaurus-types`, `docusaurus`
  - [#2630](https://github.com/facebook/docusaurus/pull/2630) feat(v2): add CLI option for polling ([@TomBrien](https://github.com/TomBrien))
- `docusaurus-init`
  - [#2541](https://github.com/facebook/docusaurus/pull/2541) feat(v2): add showReadingTime and editUrl to the templates ([@fanny](https://github.com/fanny))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-utils`
  - [#2524](https://github.com/facebook/docusaurus/pull/2524) feat(v2): add edit url in post page ([@fanny](https://github.com/fanny))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`
  - [#2531](https://github.com/facebook/docusaurus/pull/2531) feat(v2): add blog post estimated reading time ([@JoseRenan](https://github.com/JoseRenan))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#2672](https://github.com/facebook/docusaurus/pull/2672) fix(v2): add a11y support for dropdown ([@lex111](https://github.com/lex111))
  - [#2649](https://github.com/facebook/docusaurus/pull/2649) fix(v2): hide sidebar after click on child item ([@lex111](https://github.com/lex111))
  - [#2631](https://github.com/facebook/docusaurus/pull/2631) fix(v2): hide doc sidebar on mobiles ([@lex111](https://github.com/lex111))
  - [#2626](https://github.com/facebook/docusaurus/pull/2626) fix(v2): make border right of doc sidebar equals doc page ([@lex111](https://github.com/lex111))
  - [#2625](https://github.com/facebook/docusaurus/pull/2625) fix(v2): disable tab focus on collapsed doc sidebar items ([@lex111](https://github.com/lex111))
  - [#2602](https://github.com/facebook/docusaurus/pull/2602) fix(v2): inherit color for announcement bar close icon ([@lex111](https://github.com/lex111))
  - [#2582](https://github.com/facebook/docusaurus/pull/2582) fix(v2): remove horizontal scroll on docs page ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#2666](https://github.com/facebook/docusaurus/pull/2666) chore(v2): upgrade prism-react-renderer to latest version ([@lex111](https://github.com/lex111))
  - [#2533](https://github.com/facebook/docusaurus/pull/2533) fix(v2): add rounded corners in code blocks properly ([@lex111](https://github.com/lex111))
- `docusaurus-1.x`, `docusaurus-init-1.x`, `docusaurus-init`, `docusaurus-plugin-content-docs`, `docusaurus`
  - [#2661](https://github.com/facebook/docusaurus/pull/2661) chore: upgrade shelljs to 0.8.4 ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-preset-classic`, `docusaurus-theme-classic`
  - [#2642](https://github.com/facebook/docusaurus/pull/2642) fix(v2): use remark-admonitions separately in each plugin instead of in preset only ([@lex111](https://github.com/lex111))
- `docusaurus-utils`
  - [#2380](https://github.com/facebook/docusaurus/pull/2380) fix(v2): ignore import declarations in excerpt ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-sitemap`
  - [#2616](https://github.com/facebook/docusaurus/pull/2616) fix(v2): don't include 404 page in sitemaps ([@RDIL](https://github.com/RDIL))
  - [#2530](https://github.com/facebook/docusaurus/pull/2530) fix(v2): Use `writeFileSync` to write generated sitemap.xml to avoid early termination ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus`
  - [#2558](https://github.com/facebook/docusaurus/pull/2558) fix(v2): properly link top-level github pages sites in deploy command ([@RDIL](https://github.com/RDIL))
  - [#2580](https://github.com/facebook/docusaurus/pull/2580) fix(v2): do not process anchor links by router ([@lex111](https://github.com/lex111))
  - [#2579](https://github.com/facebook/docusaurus/pull/2579) fix(v2): treat mailto and tel links properly ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-blog`
  - [#2540](https://github.com/facebook/docusaurus/pull/2540) fix(v2): use synchronous write for generate blog feeds ([@lex111](https://github.com/lex111))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#2656](https://github.com/facebook/docusaurus/pull/2656) refactor(v2): lose focus of active sidebar item after click on it ([@lex111](https://github.com/lex111))
  - [#2627](https://github.com/facebook/docusaurus/pull/2627) refactor(v2): extract scroll position detection into separate hook ([@lex111](https://github.com/lex111))
  - [#2595](https://github.com/facebook/docusaurus/pull/2595) refactor(v2): make margin top on blog pages as on other pages ([@lex111](https://github.com/lex111))
  - [#2588](https://github.com/facebook/docusaurus/pull/2588) refactor(v2): remove redundant container on docs page ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus`
  - [#2585](https://github.com/facebook/docusaurus/pull/2585) refactor(v2): use nav link component only where needed ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#2556](https://github.com/facebook/docusaurus/pull/2556) refactor(v2): enhance CLI experience ([@RDIL](https://github.com/RDIL))
  - [#2529](https://github.com/facebook/docusaurus/pull/2529) refactor(v2): replace few Lodash methods with native counterparts ([@Simek](https://github.com/Simek))
- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#2534](https://github.com/facebook/docusaurus/pull/2534) refactor(v2): make better code blocks ([@lex111](https://github.com/lex111))
  - [#2526](https://github.com/facebook/docusaurus/pull/2526) fix(v2): make code block nicer again ([@yangshun](https://github.com/yangshun))
- `docusaurus-plugin-content-docs`
  - [#2519](https://github.com/facebook/docusaurus/pull/2519) chore(v2): use single method Lodash packages in docs plugin ([@Simek](https://github.com/Simek))

#### :memo: Documentation

- [#2659](https://github.com/facebook/docusaurus/pull/2659) fix(docs): mention that appID is optional ([@s-pace](https://github.com/s-pace))
- [#2596](https://github.com/facebook/docusaurus/pull/2596) docs(v2): remove duplicated package.json in installation directory structure ([@jaylees14](https://github.com/jaylees14))
- [#2572](https://github.com/facebook/docusaurus/pull/2572) docs(v2): mention that `plugin-ideal-image` only perform compression on a production build ([@Noah-Silvera](https://github.com/Noah-Silvera))
- [#2570](https://github.com/facebook/docusaurus/pull/2570) docs(v2): fix syntax error for @docusaurus/plugin-ideal-image example ([@Noah-Silvera](https://github.com/Noah-Silvera))
- [#2566](https://github.com/facebook/docusaurus/pull/2566) docs(v2): be more polite ([@lex111](https://github.com/lex111))
- [#2559](https://github.com/facebook/docusaurus/pull/2559) doc(v2): remove legacy blog metadata ([@RDIL](https://github.com/RDIL))
- [#2549](https://github.com/facebook/docusaurus/pull/2549) docs(v2): command for swizzling all components ([@fanny](https://github.com/fanny))
- [#2547](https://github.com/facebook/docusaurus/pull/2547) docs(v2): Fix typo in team page ([@SamChou19815](https://github.com/SamChou19815))
- [#2545](https://github.com/facebook/docusaurus/pull/2545) docs(v2): add community pages ([@yangshun](https://github.com/yangshun))
- [#2521](https://github.com/facebook/docusaurus/pull/2521) docs(v2): useThemeContext hook ([@lex111](https://github.com/lex111))

#### :house: Internal

- `docusaurus-types`, `docusaurus`
  - [#2578](https://github.com/facebook/docusaurus/pull/2578) refactor(v2): Convert docusaurus-core to TypeScript ([@SamChou19815](https://github.com/SamChou19815))
- Other
  - [#2569](https://github.com/facebook/docusaurus/pull/2569) docs(v2): showcase user Tourmaline ([@watzon](https://github.com/watzon))
  - [#2553](https://github.com/facebook/docusaurus/pull/2553) misc(v2): remove deprecated/useless lerna field ([@slorber](https://github.com/slorber))
- `docusaurus-1.x`, `lqip-loader`
  - [#2563](https://github.com/facebook/docusaurus/pull/2563) chore(v2): fix lint, tweak lqip-loader utils comment ([@Simek](https://github.com/Simek))
- `lqip-loader`
  - [#2561](https://github.com/facebook/docusaurus/pull/2561) chore(v2): add lqip-loader tests, clarify loader code, improve README ([@Simek](https://github.com/Simek))
- `docusaurus-plugin-ideal-image`, `lqip-loader`
  - [#2544](https://github.com/facebook/docusaurus/pull/2544) refactor(v2): import lqip-loader to monorepo, fix build on Node 13, fix lint-staged ([@Simek](https://github.com/Simek))
- `docusaurus-init`
  - [#2542](https://github.com/facebook/docusaurus/pull/2542) chore(v2): update Prettier config ([@lex111](https://github.com/lex111))
- `docusaurus-1.x`, `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-utils`, `docusaurus`, `stylelint-copyright`
  - [#2538](https://github.com/facebook/docusaurus/pull/2538) chore(v2): upgrade devDependencies ([@yangshun](https://github.com/yangshun))
- `docusaurus-utils`
  - [#2536](https://github.com/facebook/docusaurus/pull/2536) refactor(v2): replace Lodash with single methods packages in utils ([@Simek](https://github.com/Simek))
- `docusaurus`
  - [#2535](https://github.com/facebook/docusaurus/pull/2535) refactor(v2): replace Lodash with single methods packages in core ([@Simek](https://github.com/Simek))

#### Committers: 18

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Anayo Oleru ([@AnayoOleru](https://github.com/AnayoOleru))
- Bartosz Kaszubowski ([@Simek](https://github.com/Simek))
- Chris Watson ([@watzon](https://github.com/watzon))
- Fanny ([@fanny](https://github.com/fanny))
- Jay Lees ([@jaylees14](https://github.com/jaylees14))
- Joe Previte ([@jsjoeio](https://github.com/jsjoeio))
- José Renan ([@JoseRenan](https://github.com/JoseRenan))
- Kamil Kisiela ([@kamilkisiela](https://github.com/kamilkisiela))
- Kristóf Poduszló ([@kripod](https://github.com/kripod))
- Mehmet Yatkı ([@yatki](https://github.com/yatki))
- Noah Silvera ([@Noah-Silvera](https://github.com/Noah-Silvera))
- Reece Dunham ([@RDIL](https://github.com/RDIL))
- Sam Zhou ([@SamChou19815](https://github.com/SamChou19815))
- Sylvain Pace ([@s-pace](https://github.com/s-pace))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tom Brien ([@TomBrien](https://github.com/TomBrien))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))

## 2.0.0-alpha.50 (2020-04-02)

**HOTFIX for 2.0.0-alpha.49**.

#### :bug: Bug Fix

- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#2509](https://github.com/facebook/docusaurus/pull/2509) fix(v2): synchronize code block components changes ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#2498](https://github.com/facebook/docusaurus/pull/2498) fix(v2): blog item styling ([@yangshun](https://github.com/yangshun))
  - [#2489](https://github.com/facebook/docusaurus/pull/2489) fix(v2): fix HTML issues nav dropdown and highlight docs item ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#2496](https://github.com/facebook/docusaurus/pull/2496) fix(v2): do not force terminate building when running deploy command ([@lex111](https://github.com/lex111))
- `docusaurus-utils`
  - [#2497](https://github.com/facebook/docusaurus/pull/2497) fix(v2): unbreak blog-only mode routing by deplicating starting forward slashes ([@SamChou19815](https://github.com/SamChou19815))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#2505](https://github.com/facebook/docusaurus/pull/2505) fix(v2): tweak colors for announcement bar ([@yangshun](https://github.com/yangshun))
  - [#2504](https://github.com/facebook/docusaurus/pull/2504) refactor(v2): improve announcement bar ([@lex111](https://github.com/lex111))
  - [#2495](https://github.com/facebook/docusaurus/pull/2495) refactor(v2): update HTML markup of pagination for better a11y ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#2502](https://github.com/facebook/docusaurus/pull/2502) fix(v2): make code block nicer ([@yangshun](https://github.com/yangshun))
- `docusaurus-plugin-content-docs`, `docusaurus`
  - [#2490](https://github.com/facebook/docusaurus/pull/2490) fix(v2): use lodash instead of array-map-polyfill ([@lex111](https://github.com/lex111))

#### :memo: Documentation

- `docusaurus-theme-classic`
  - [#2500](https://github.com/facebook/docusaurus/pull/2500) docs(v2): misc docs updates ([@yangshun](https://github.com/yangshun))

#### :house: Internal

- [#2486](https://github.com/facebook/docusaurus/pull/2486) misc: add instructions about test release ([@lex111](https://github.com/lex111))

#### Committers: 5

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Can Gencer ([@cangencer](https://github.com/cangencer))
- Richard Chan ([@iWun](https://github.com/iWun))
- Sam Zhou ([@SamChou19815](https://github.com/SamChou19815))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))

## 2.0.0-alpha.49 (2020-04-01)

#### :rocket: New Feature

- `docusaurus-theme-classic`
  - [#2487](https://github.com/facebook/docusaurus/pull/2487) feat(v2): nav dropdown ([@yangshun](https://github.com/yangshun))
  - [#2456](https://github.com/facebook/docusaurus/pull/2456) feat(v2): support comments for code highlighting ([@elviswolcott](https://github.com/elviswolcott))
  - [#2330](https://github.com/facebook/docusaurus/pull/2330) feat(v2): add announcement bar ([@lex111](https://github.com/lex111))
  - [#2440](https://github.com/facebook/docusaurus/pull/2440) feat(v2): make clickable sidebar logo ([@lex111](https://github.com/lex111))
  - [#2366](https://github.com/facebook/docusaurus/pull/2366) feat(v2): support syncing tab choices ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus`
  - [#2323](https://github.com/facebook/docusaurus/pull/2323) feat(v2): add a way to exclude components from build-time prerendering ([@lex111](https://github.com/lex111))
  - [#2469](https://github.com/facebook/docusaurus/pull/2469) feat(v2): add TypeScript support for theme components ([@SamChou19815](https://github.com/SamChou19815))
  - [#2455](https://github.com/facebook/docusaurus/pull/2455) feat(v2): add @theme-original alias to give access to pre-swizzled components ([@yangshun](https://github.com/yangshun))
  - [#2438](https://github.com/facebook/docusaurus/pull/2438) feat(v2): add version to page's generated meta tags ([@lex111](https://github.com/lex111))
- `docusaurus-types`, `docusaurus`
  - [#2474](https://github.com/facebook/docusaurus/pull/2474) feat(v2): add ability to create unminimized bundles ([@lex111](https://github.com/lex111))
  - [#2417](https://github.com/facebook/docusaurus/pull/2417) feat(v2): allow custom output directory for build ([@ZachJW34](https://github.com/ZachJW34))
- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#2346](https://github.com/facebook/docusaurus/pull/2346) feat(v2): add filename in CodeBlock ([@KohheePeace](https://github.com/KohheePeace))
- `docusaurus-plugin-content-docs`, `docusaurus`
  - [#2444](https://github.com/facebook/docusaurus/pull/2444) feat(v2): allow nested sidebar category shorthand syntax ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#2483](https://github.com/facebook/docusaurus/pull/2483) fix(v2): do not render sidebar logo if used sticky navbar ([@lex111](https://github.com/lex111))
  - [#2475](https://github.com/facebook/docusaurus/pull/2475) fix(v2): make correct Open Graph title for doc page ([@lex111](https://github.com/lex111))
  - [#2436](https://github.com/facebook/docusaurus/pull/2436) fix(v2): update twitter:card to summary_large_image ([@lex111](https://github.com/lex111))
  - [#2434](https://github.com/facebook/docusaurus/pull/2434) fix(v2): add support dark logo for sidebar logo ([@lex111](https://github.com/lex111))
  - [#2420](https://github.com/facebook/docusaurus/pull/2420) fix(v2): fix external URL for og:image tag ([@38elements](https://github.com/38elements))
- `docusaurus-theme-live-codeblock`
  - [#2480](https://github.com/facebook/docusaurus/pull/2480) fix(v2): various improvements for accessibility ([@lex111](https://github.com/lex111))
- `docusaurus-mdx-loader`, `docusaurus-theme-classic`
  - [#2479](https://github.com/facebook/docusaurus/pull/2479) chore(v2): upgrade MDX to 1.5.8 ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#2476](https://github.com/facebook/docusaurus/pull/2476) fix(v2): improve code block scroll accessibility ([@lex111](https://github.com/lex111))
  - [#2442](https://github.com/facebook/docusaurus/pull/2442) fix(v2): various improvements for accessibility ([@lex111](https://github.com/lex111))
- `docusaurus-preset-classic`, `docusaurus-theme-classic`
  - [#2477](https://github.com/facebook/docusaurus/pull/2477) chore(v2): upgrade remark-admonitions for a11y fixes ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#2462](https://github.com/facebook/docusaurus/pull/2462) fix(v2): do not force terminate building when bundle analyzer is on ([@lex111](https://github.com/lex111))
  - [#2393](https://github.com/facebook/docusaurus/pull/2393) fix(v2): normalize location for route matching ([@rlamana](https://github.com/rlamana))
  - [#2443](https://github.com/facebook/docusaurus/pull/2443) fix(v2): always exit after successful build ([@mohrash92](https://github.com/mohrash92))
  - [#2437](https://github.com/facebook/docusaurus/pull/2437) fix(v2): do not force terminate building if client bundle failed in development mode ([@lex111](https://github.com/lex111))
  - [#2424](https://github.com/facebook/docusaurus/pull/2424) fix(v2): make correct internal link check ([@lex111](https://github.com/lex111))
- `docusaurus-preset-classic`
  - [#2451](https://github.com/facebook/docusaurus/pull/2451) fix(v2): pass options to remark-admonitions ([@elviswolcott](https://github.com/elviswolcott))
- `docusaurus-mdx-loader`
  - [#2426](https://github.com/facebook/docusaurus/pull/2426) fix(v2): remove HTML from heading slug ([@lex111](https://github.com/lex111))
- `docusaurus-utils`
  - [#2405](https://github.com/facebook/docusaurus/pull/2405) fix(v2): properly dedupe forward slashes in the entire URL path ([@rlamana](https://github.com/rlamana))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#2485](https://github.com/facebook/docusaurus/pull/2485) refactor(v2): remove unnecessary X-UA-Compatible meta tag ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-blog`
  - [#2460](https://github.com/facebook/docusaurus/pull/2460) refactor(v2): use single method package instead of whole Lodash package in blog plugin ([@Simek](https://github.com/Simek))
- Other
  - [#2428](https://github.com/facebook/docusaurus/pull/2428) polish(v2): use npm-to-yarn for the npm2yarn remark plugin ([@nebrelbug](https://github.com/nebrelbug))

#### :memo: Documentation

- Other
  - [#2478](https://github.com/facebook/docusaurus/pull/2478) docs(v2): mark that in dev server some features may not work ([@lex111](https://github.com/lex111))
  - [#2472](https://github.com/facebook/docusaurus/pull/2472) docs(v2): fix typo in deployment docs ([@GermaVinsmoke](https://github.com/GermaVinsmoke))
  - [#2423](https://github.com/facebook/docusaurus/pull/2423) docs(v2): add Sass/SCSS under the styling section ([@rlamana](https://github.com/rlamana))
  - [#2446](https://github.com/facebook/docusaurus/pull/2446) docs(v2): add docusaurus-plugin-sass to community plugins ([@rlamana](https://github.com/rlamana))
  - [#2408](https://github.com/facebook/docusaurus/pull/2408) docs(v2): suggest Surge for quick deployment ([@fakela](https://github.com/fakela))
  - [#2401](https://github.com/facebook/docusaurus/pull/2401) docs(v2): add resources page ([@yangshun](https://github.com/yangshun))
  - [#2413](https://github.com/facebook/docusaurus/pull/2413) docs(v2): include appId key for Algolia ([@TheodoreChu](https://github.com/TheodoreChu))
  - [#2411](https://github.com/facebook/docusaurus/pull/2411) docs:(v2): add Netlify configuration warning ([@bravo-kernel](https://github.com/bravo-kernel))
  - [#2397](https://github.com/facebook/docusaurus/pull/2397) docs(v2):update alpha version to current version ([@fakela](https://github.com/fakela))
  - [#2395](https://github.com/facebook/docusaurus/pull/2395) docs(v2): clarify instructions on docs-only mode ([@phoqe](https://github.com/phoqe))
- `docusaurus-init`
  - [#2458](https://github.com/facebook/docusaurus/pull/2458) fix(v2): expand broken admonitions ([@elviswolcott](https://github.com/elviswolcott))

#### :house: Internal

- `docusaurus`
  - [#2461](https://github.com/facebook/docusaurus/pull/2461) chore(v2): upgrade react-dev-utils ([@lex111](https://github.com/lex111))
- Other
  - [#2450](https://github.com/facebook/docusaurus/pull/2450) docs(v2): Adding Motion Layout to Docusaurus users ([@jeffersonlicet](https://github.com/jeffersonlicet))
  - [#2450](https://github.com/facebook/docusaurus/pull/2450) docs(v2): Adding Motion Layout to Docusaurus users ([@jeffersonlicet](https://github.com/jeffersonlicet))
  - [#2439](https://github.com/facebook/docusaurus/pull/2439) polish(v2): add logo for dark mode ([@lex111](https://github.com/lex111))
  - [#2435](https://github.com/facebook/docusaurus/pull/2435) fix(v2): fix aspect ratio for Open Graph image ([@lex111](https://github.com/lex111))
  - [#2433](https://github.com/facebook/docusaurus/pull/2433) chore(v2): ignore JetBrains editors .iml files ([@slorber](https://github.com/slorber))
  - [#2416](https://github.com/facebook/docusaurus/pull/2416) docs(v2): Add Build Tracker to Showcase page ([@paularmstrong](https://github.com/paularmstrong))
  - [#2388](https://github.com/facebook/docusaurus/pull/2388) docs(v1): showcase user Day.js ([@iamkun](https://github.com/iamkun))
- `stylelint-copyright`
  - [#2415](https://github.com/facebook/docusaurus/pull/2415) misc: improve stylelint rule ([@ayshiff](https://github.com/ayshiff))

#### Committers: 24

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Bartosz Kaszubowski ([@Simek](https://github.com/Simek))
- Ben Gubler ([@nebrelbug](https://github.com/nebrelbug))
- Elvis Wolcott ([@elviswolcott](https://github.com/elviswolcott))
- Fanny ([@fanny](https://github.com/fanny))
- Favour Kelvin ([@fakela](https://github.com/fakela))
- Jefferson Licet ([@jeffersonlicet](https://github.com/jeffersonlicet))
- Kohhee Peace ([@KohheePeace](https://github.com/KohheePeace))
- Linus Långberg ([@phoqe](https://github.com/phoqe))
- Luke Collier ([@lukecollier](https://github.com/lukecollier))
- Nisar Hassan Naqvi ([@nisarhassan12](https://github.com/nisarhassan12))
- Paul Armstrong ([@paularmstrong](https://github.com/paularmstrong))
- Ramón Lamana ([@rlamana](https://github.com/rlamana))
- Rémi Doreau ([@ayshiff](https://github.com/ayshiff))
- Sam Zhou ([@SamChou19815](https://github.com/SamChou19815))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Theodore Chu ([@TheodoreChu](https://github.com/TheodoreChu))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))
- [@38elements](https://github.com/38elements)
- [@GermaVinsmoke](https://github.com/GermaVinsmoke)
- [@ZachJW34](https://github.com/ZachJW34)
- [@bravo-kernel](https://github.com/bravo-kernel)
- [@iamkun](https://github.com/iamkun)
- [@mohrash92](https://github.com/mohrash92)

## 2.0.0-alpha.48 (2020-03-08)

**HOTFIX for 2.0.0-alpha.44**.

#### :bug: Bug Fix

- Other
  - [#2383](https://github.com/facebook/docusaurus/pull/2383) fix(v2): specify proper version for stylelint-copyright ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#2382](https://github.com/facebook/docusaurus/pull/2382) fix(v2): add missing preset-typescript dependency ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#2386](https://github.com/facebook/docusaurus/pull/2386) fix(v2): add missing prismjs dependency and Noop component ([@lex111](https://github.com/lex111))

#### Committers: 1

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))

## 2.0.0-alpha.44 (2020-03-08)

#### :rocket: New Feature

- `docusaurus-theme-classic`
  - [#2250](https://github.com/facebook/docusaurus/pull/2250) feat(v2): add support specify new languages for Prism ([@lex111](https://github.com/lex111))
  - [#2344](https://github.com/facebook/docusaurus/pull/2344) feat(v2): allow specifying custom target for logo link ([@lex111](https://github.com/lex111))
  - [#2327](https://github.com/facebook/docusaurus/pull/2327) feat(v2): add ability to use HTML in footer copyright ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-blog`
  - [#2335](https://github.com/facebook/docusaurus/pull/2335) feat(v2): add draft feature to blog posts ([@lex111](https://github.com/lex111))
- `docusaurus-init`, `docusaurus-theme-classic`
  - [#2303](https://github.com/facebook/docusaurus/pull/2303) docs(v2): Nav links activeBasePath ([@yangshun](https://github.com/yangshun))
- `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus`
  - [#2296](https://github.com/facebook/docusaurus/pull/2296) feat(v2): add ExecutionEnvironment API ([@yangshun](https://github.com/yangshun))

#### :bug: Bug Fix

- `docusaurus`
  - [#2345](https://github.com/facebook/docusaurus/pull/2345) fix(v2): force terminate building if client bundle failed ([@lex111](https://github.com/lex111))
  - [#2310](https://github.com/facebook/docusaurus/pull/2310) fix(v2): add @babel/preset-typescript to babel-loader ([@deniaz](https://github.com/deniaz))
- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#2371](https://github.com/facebook/docusaurus/pull/2371) fix(v2): remove line break from end of code blocks ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-blog`
  - [#2326](https://github.com/facebook/docusaurus/pull/2326) fix(v2): linkify blog posts ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#2324](https://github.com/facebook/docusaurus/pull/2324) fix(v2): properly set dark mode logo on build-time prerendering ([@lex111](https://github.com/lex111))
  - [#2325](https://github.com/facebook/docusaurus/pull/2325) fix(v2): switch a toggle when system theme changed ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-pages`, `docusaurus-utils`
  - [#2334](https://github.com/facebook/docusaurus/pull/2334) fix(v2): make proper path to pages in TS ([@lex111](https://github.com/lex111))
- Other
  - [#2316](https://github.com/facebook/docusaurus/pull/2316) fix(v2): properly scale logo on IE 11 ([@lex111](https://github.com/lex111))

#### :nail_care: Polish

- `docusaurus-theme-search-algolia`
  - [#2376](https://github.com/facebook/docusaurus/pull/2376) refactor(v2): clean up and improve Algolia styles ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`
  - [#2372](https://github.com/facebook/docusaurus/pull/2372) chore(v2): upgrade Infima and remark-admonitions ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#2367](https://github.com/facebook/docusaurus/pull/2367) refactor(v2): increase CSS specificity on application container ([@lex111](https://github.com/lex111))
- `docusaurus-init`, `stylelint-copyright`
  - [#2363](https://github.com/facebook/docusaurus/pull/2363) fix(v2): improve stylelint copyright header rule ([@yangshun](https://github.com/yangshun))
- `docusaurus-types`, `docusaurus`
  - [#2342](https://github.com/facebook/docusaurus/pull/2342) chore(v2): mark tagline field as optional ([@lex111](https://github.com/lex111))

#### :memo: Documentation

- [#2378](https://github.com/facebook/docusaurus/pull/2378) docs(v2): add section for docs-only mode ([@phoqe](https://github.com/phoqe))
- [#2357](https://github.com/facebook/docusaurus/pull/2357) docs(v2): fix getPathsToWatch() example syntax in lifecycle APIs ([@rlamana](https://github.com/rlamana))
- [#2351](https://github.com/facebook/docusaurus/pull/2351) docs(v2): add examples to plugin usage doc ([@Noah-Silvera](https://github.com/Noah-Silvera))
- [#2343](https://github.com/facebook/docusaurus/pull/2343) docs(v2): fix typo in remark-admonitions example ([@hassanfarid](https://github.com/hassanfarid))
- [#2340](https://github.com/facebook/docusaurus/pull/2340) docs(v2): mention about disabling Jekyll when using GitHub pages ([@amilajack](https://github.com/amilajack))
- [#2338](https://github.com/facebook/docusaurus/pull/2338) docs(v2): guide on upgrading Docusaurus within a project ([@TheodoreChu](https://github.com/TheodoreChu))
- [#2313](https://github.com/facebook/docusaurus/pull/2313) docs(v2): move the quotes to remark admonitions ([@Zhencha0Cai](https://github.com/Zhencha0Cai))
- [#2307](https://github.com/facebook/docusaurus/pull/2307) docs(v1): fix Windows instructions for GitHub Pages publishing ([@jartuso](https://github.com/jartuso))
- [#2300](https://github.com/facebook/docusaurus/pull/2300) docs(v2): make blog plugin config example valid ([@balloob](https://github.com/balloob))
- [#2289](https://github.com/facebook/docusaurus/pull/2289) docs(v2): add instructions on Travis CI deployment ([@mohamedsgap](https://github.com/mohamedsgap))

#### :house: Internal

- Other
  - [#2369](https://github.com/facebook/docusaurus/pull/2369) misc: mention about v2 in README file ([@lex111](https://github.com/lex111))
  - [#2368](https://github.com/facebook/docusaurus/pull/2368) misc: add note about edits in versioned docs ([@lex111](https://github.com/lex111))
  - [#2333](https://github.com/facebook/docusaurus/pull/2333) docs: update use of npm/yarn in contributing.md ([@jsjoeio](https://github.com/jsjoeio))
  - [#2328](https://github.com/facebook/docusaurus/pull/2328) docs(v2): remove unwanted black line from DocSearch showcase image ([@s-pace](https://github.com/s-pace))
  - [#2319](https://github.com/facebook/docusaurus/pull/2319) docs(v2): showcase user Algolia ([@scottilee](https://github.com/scottilee))
- `docusaurus-init`
  - [#2322](https://github.com/facebook/docusaurus/pull/2322) docs(v2): fix misc styling ([@lex111](https://github.com/lex111))

#### Committers: 16

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Amila Welihinda ([@amilajack](https://github.com/amilajack))
- Hassan Farid ([@hassanfarid](https://github.com/hassanfarid))
- Joe Previte ([@jsjoeio](https://github.com/jsjoeio))
- Linus Långberg ([@phoqe](https://github.com/phoqe))
- Mohamed Abdel Nasser ([@mohamedsgap](https://github.com/mohamedsgap))
- Noah Silvera ([@Noah-Silvera](https://github.com/Noah-Silvera))
- Paulus Schoutsen ([@balloob](https://github.com/balloob))
- Ramón Lamana ([@rlamana](https://github.com/rlamana))
- Robert ([@deniaz](https://github.com/deniaz))
- Scott Lee ([@scottilee](https://github.com/scottilee))
- Sylvain Pace ([@s-pace](https://github.com/s-pace))
- Theodore Chu ([@TheodoreChu](https://github.com/TheodoreChu))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))
- Zhenchao Cai ([@Zhencha0Cai](https://github.com/Zhencha0Cai))
- [@jartuso](https://github.com/jartuso)

## 2.0.0-alpha.43 (2020-02-18)

**HOTFIX for 2.0.0-alpha.41**.

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#2292](https://github.com/facebook/docusaurus/pull/2292) chore(v2): update Infima to 0.2.0-alpha.4 ([@yangshun](https://github.com/yangshun))
  - [#2291](https://github.com/facebook/docusaurus/pull/2291) fix(v2): fix build and deps install ([@lex111](https://github.com/lex111))

#### Committers: 2

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))

## 2.0.0-alpha.41 (2020-02-16)

#### :rocket: New Feature

- `docusaurus-init`, `docusaurus-preset-classic`, `docusaurus-theme-classic`
  - [#2224](https://github.com/facebook/docusaurus/pull/2224) feat(v2): add remark-admonitions to @docusaurus/preset-classic ([@elviswolcott](https://github.com/elviswolcott))
- `docusaurus-theme-classic`, `docusaurus`
  - [#2263](https://github.com/facebook/docusaurus/pull/2263) feat(v2): pluralize posts on tag's page ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#2261](https://github.com/facebook/docusaurus/pull/2261) feat(v2): allow to specify different logo for dark mode ([@lex111](https://github.com/lex111))
  - [#2253](https://github.com/facebook/docusaurus/pull/2253) feat(v2): allow specify custom link for logo ([@lex111](https://github.com/lex111))
  - [#2255](https://github.com/facebook/docusaurus/pull/2255) feat(v2): add site title to meta title ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-pages`, `docusaurus-utils`, `docusaurus`
  - [#2221](https://github.com/facebook/docusaurus/pull/2221) feat(v2): allow for Typescript pages and components ([@jonathanrdelgado](https://github.com/jonathanrdelgado))

#### :boom: Breaking Change

- `docusaurus-theme-classic`
  - [#2235](https://github.com/facebook/docusaurus/pull/2235) fix(v2): show doc sidebar on pages with case-sensitive paths ([@lex111](https://github.com/lex111))

#### :bug: Bug Fix

- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#2285](https://github.com/facebook/docusaurus/pull/2285) fix(v2): fix codeblock copy button not including blank lines ([@KohheePeace](https://github.com/KohheePeace))
  - [#2241](https://github.com/facebook/docusaurus/pull/2241) fix(v2): make code blocks scrollable ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#2259](https://github.com/facebook/docusaurus/pull/2259) fix(v2): use site title if enabled blog-only mode ([@lex111](https://github.com/lex111))
  - [#2248](https://github.com/facebook/docusaurus/pull/2248) fix(v2): adjust correct behavior of navbar when active anchor ([@lex111](https://github.com/lex111))
  - [#2235](https://github.com/facebook/docusaurus/pull/2235) fix(v2): show doc sidebar on pages with case-sensitive paths ([@lex111](https://github.com/lex111))
  - [#2162](https://github.com/facebook/docusaurus/pull/2162) fix(v2): unify anchor behavior ([@lex111](https://github.com/lex111))
- `docusaurus-theme-search-algolia`
  - [#2262](https://github.com/facebook/docusaurus/pull/2262) fix(v2): remove focus on search input when hovering over it ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`
  - [#2240](https://github.com/facebook/docusaurus/pull/2240) fix(v2): hide read more button on non-truncated posts ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#2237](https://github.com/facebook/docusaurus/pull/2237) fix(v2): include base url in 404 route ([@lex111](https://github.com/lex111))
- `docusaurus-mdx-loader`
  - [#2236](https://github.com/facebook/docusaurus/pull/2236) fix(v2): escape link text in TOC ([@lex111](https://github.com/lex111))
- `docusaurus-theme-live-codeblock`
  - [#2227](https://github.com/facebook/docusaurus/pull/2227) fix(v2): render correct theme for live code blocks on SSR ([@lex111](https://github.com/lex111))

#### :nail_care: Polish

- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#2254](https://github.com/facebook/docusaurus/pull/2254) refactor(v2): avoid to use raw theme values ([@lex111](https://github.com/lex111))

#### :memo: Documentation

- [#2281](https://github.com/facebook/docusaurus/pull/2281) docs: update windows deploy command ([@OndrejNepozitek](https://github.com/OndrejNepozitek))
- [#2257](https://github.com/facebook/docusaurus/pull/2257) docs(v2): require using JSX flavored style objects in mdx ([@wgao19](https://github.com/wgao19))
- [#2251](https://github.com/facebook/docusaurus/pull/2251) docs(v2): collapsible categories in sidebar ([@lex111](https://github.com/lex111))
- [#2218](https://github.com/facebook/docusaurus/pull/2218) docs(v2): update link to available prism themes ([@jsjoeio](https://github.com/jsjoeio))
- [#2216](https://github.com/facebook/docusaurus/pull/2216) docs(v2): fix plugin-content-docs config comment typo ([@sdowding](https://github.com/sdowding))

#### :house: Internal

- Other
  - [#2256](https://github.com/facebook/docusaurus/pull/2256) fix(v2): add title for Feedback page ([@lex111](https://github.com/lex111))
  - [#2246](https://github.com/facebook/docusaurus/pull/2246) docs(v2): add Benthos to showcase ([@Jeffail](https://github.com/Jeffail))
  - [#2242](https://github.com/facebook/docusaurus/pull/2242) docs(v1): showcase user Jafar ([@galhavivi](https://github.com/galhavivi))
  - [#2238](https://github.com/facebook/docusaurus/pull/2238) docs(v1): showcase Dime ([@hbulens](https://github.com/hbulens))
  - [#2233](https://github.com/facebook/docusaurus/pull/2233) docs(v2): showcase user supabase ([@awalias](https://github.com/awalias))
  - [#2226](https://github.com/facebook/docusaurus/pull/2226) docs(v1): showcase user Adapt.js ([@mterrel](https://github.com/mterrel))
  - [#2225](https://github.com/facebook/docusaurus/pull/2225) docs(v1): add The Diff Podcast to users ([@JoelMarcey](https://github.com/JoelMarcey))
  - [#2219](https://github.com/facebook/docusaurus/pull/2219) chore(v1): Updated users list, removing sites not using docusaurus ([@jjwill](https://github.com/jjwill))
- `docusaurus-theme-classic`, `docusaurus`
  - [#2239](https://github.com/facebook/docusaurus/pull/2239) chore(eslint): require curly brackets on all blocks ([@lex111](https://github.com/lex111))

#### Committers: 18

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Ashley Jeffs ([@Jeffail](https://github.com/Jeffail))
- Elie Dutheil ([@edwandr](https://github.com/edwandr))
- Elvis Wolcott ([@elviswolcott](https://github.com/elviswolcott))
- Evan Rubinton ([@erubi](https://github.com/erubi))
- Gal Havivi ([@galhavivi](https://github.com/galhavivi))
- Hanseung Yoo ([@trustyoo86](https://github.com/trustyoo86))
- Hendrik Bulens ([@hbulens](https://github.com/hbulens))
- JavaScript Joe ([@jsjoeio](https://github.com/jsjoeio))
- Joel Marcey ([@JoelMarcey](https://github.com/JoelMarcey))
- Jonathan Delgado ([@jonathanrdelgado](https://github.com/jonathanrdelgado))
- Joshua Williams ([@jjwill](https://github.com/jjwill))
- KohheePeace ([@KohheePeace](https://github.com/KohheePeace))
- Mark Terrel ([@mterrel](https://github.com/mterrel))
- Ondřej Nepožitek ([@OndrejNepozitek](https://github.com/OndrejNepozitek))
- Scott Dowding ([@sdowding](https://github.com/sdowding))
- Wei Gao ([@wgao19](https://github.com/wgao19))
- [@awalias](https://github.com/awalias)

## 2.0.0-alpha.40 (2019-12-25)

#### :rocket: New Feature

- `docusaurus-theme-classic`
  - [#2117](https://github.com/facebook/docusaurus/pull/2117) feat(v2): auto switch theme depending on the system theme ([@lex111](https://github.com/lex111))
  - [#2055](https://github.com/facebook/docusaurus/pull/2055) feat(v2): hide navbar on scroll ([@lex111](https://github.com/lex111))

#### :bug: Bug Fix

- `docusaurus`
  - [#2145](https://github.com/facebook/docusaurus/pull/2145) fix(v2): remove style-loader, use minicssextract in both dev & prod ([@endiliey](https://github.com/endiliey))
  - [#2122](https://github.com/facebook/docusaurus/pull/2122) fix(v2): dont collapse whitespace in minified html ([@endiliey](https://github.com/endiliey))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`
  - [#2105](https://github.com/facebook/docusaurus/pull/2105) fix(v2): move metadata export after compiling MDX to avoid weird MDX parsing error. ([@endiliey](https://github.com/endiliey))
- `docusaurus-theme-classic`
  - [#2113](https://github.com/facebook/docusaurus/pull/2113) fix(v2): set stored theme only if it exists ([@lex111](https://github.com/lex111))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#2129](https://github.com/facebook/docusaurus/pull/2129) fix(v2): disable scroll while mobile menu open ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus`
  - [#2127](https://github.com/facebook/docusaurus/pull/2127) refactor(v2): toggle data-theme with vanilla js instead of react helmet ([@endiliey](https://github.com/endiliey))
- `docusaurus-theme-search-algolia`, `docusaurus`
  - [#2125](https://github.com/facebook/docusaurus/pull/2125) feat(v2): lazy load algolia css so its not render blocking ([@endiliey](https://github.com/endiliey))

#### :memo: Documentation

- Other
  - [#2135](https://github.com/facebook/docusaurus/pull/2135) docs(v1): add space between "out" and "Docusaurus" ([@TransmissionsDev](https://github.com/TransmissionsDev))
  - [#2128](https://github.com/facebook/docusaurus/pull/2128) docs(v1): showcase user Shrine ([@janko](https://github.com/janko))
  - [#2110](https://github.com/facebook/docusaurus/pull/2110) docs(v2): fix pages routing inaccurate info ([@endiliey](https://github.com/endiliey))
  - [#2106](https://github.com/facebook/docusaurus/pull/2106) fix(v2): add missing hyphen in color generator ([@lex111](https://github.com/lex111))
  - [#2104](https://github.com/facebook/docusaurus/pull/2104) feat(v2): add color generator for primary colors ([@yangshun](https://github.com/yangshun))
  - [#2103](https://github.com/facebook/docusaurus/pull/2103) docs: mention about moving docs directory into website ([@yangshun](https://github.com/yangshun))
- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#2114](https://github.com/facebook/docusaurus/pull/2114) fix(v2): add syntax highlight to generated colors ([@lex111](https://github.com/lex111))

#### :house: Internal

- Other
  - [#2126](https://github.com/facebook/docusaurus/pull/2126) docs: promote Docusaurus 2 usage ([@yangshun](https://github.com/yangshun))
  - [#2119](https://github.com/facebook/docusaurus/pull/2119) fix(v2): align GH button in vertical center ([@lex111](https://github.com/lex111))
- `docusaurus-init`
  - [#2124](https://github.com/facebook/docusaurus/pull/2124) feat(v2): add Facebook Docusaurus 2 template ([@yangshun](https://github.com/yangshun))
- `docusaurus`
  - [#2111](https://github.com/facebook/docusaurus/pull/2111) feat(v2): explicit babel/runtime version ([@endiliey](https://github.com/endiliey))
- `docusaurus-1.x`, `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-ideal-image`, `docusaurus-theme-live-codeblock`, `docusaurus`
  - [#2102](https://github.com/facebook/docusaurus/pull/2102) misc: add command to run prettier on docs ([@yangshun](https://github.com/yangshun))

#### :running_woman: Performance

- `docusaurus`
  - [#2118](https://github.com/facebook/docusaurus/pull/2118) perf(v2): reduce HTML payload by eliminating chunk-map ([@endiliey](https://github.com/endiliey))
  - [#2116](https://github.com/facebook/docusaurus/pull/2116) feat(v2): minify html ([@endiliey](https://github.com/endiliey))

#### Committers: 6

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Endi ([@endiliey](https://github.com/endiliey))
- Janko Marohnić ([@janko](https://github.com/janko))
- Nick McCurdy ([@nickmccurdy](https://github.com/nickmccurdy))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))
- t11s ([@TransmissionsDev](https://github.com/TransmissionsDev))

## 2.0.0-alpha.39

#### :bug: Bug Fix

- `docusaurus`
  - [#2099](https://github.com/facebook/docusaurus/pull/2099) fix(v2): escape import path on windows ([@endiliey](https://github.com/endiliey))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`
  - [#2095](https://github.com/facebook/docusaurus/pull/2095) fix(v2): metadata error if markdown does not have ending line ([@endiliey](https://github.com/endiliey))

#### :house: Internal

- Other
  - [#2100](https://github.com/facebook/docusaurus/pull/2100) chore(CI): docusaurus build on Windows with GitHub actions ([@endiliey](https://github.com/endiliey))
- `docusaurus`
  - [#2096](https://github.com/facebook/docusaurus/pull/2096) feat(v2): better & nice looking error overlay ([@endiliey](https://github.com/endiliey))

#### Committers: 1

- Endi ([@endiliey](https://github.com/endiliey))

## 2.0.0-alpha.38

#### :boom: Breaking Change

- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-utils`
  - [#2088](https://github.com/facebook/docusaurus/pull/2088) perf(v2): smaller bundlesize by embedding metadata to content ([@endiliey](https://github.com/endiliey))

If you have swizzled any Docs/Blog component that depends on metadata, you'll have to update. If you haven't, no action is needed.

For example, if you've swizzled `@theme/DocItem`. You'll have to update

```diff
- const {metadata, content: DocContent} = props;
+ const {content: DocContent} = props;
+ const {metadata} = DocContent;
```

#### :bug: Bug Fix

- `docusaurus`
  - [#2086](https://github.com/facebook/docusaurus/pull/2086) fix(v2): windows compatibility regression ([@endiliey](https://github.com/endiliey))
- `docusaurus-plugin-ideal-image`
  - [#2074](https://github.com/facebook/docusaurus/pull/2074) fix(v2): fix plugin-ideal-image breaking website (exports not defined) ([@endiliey](https://github.com/endiliey))

#### :nail_care: Polish

- `docusaurus-mdx-loader`
  - [#2085](https://github.com/facebook/docusaurus/pull/2085) misc(v2): update mdx loader plugin README ([@shivangna](https://github.com/shivangna))

#### :house: Internal

- `docusaurus-1.x`
  - [#2087](https://github.com/facebook/docusaurus/pull/2087) fix(v1): add key to versions.map in versions.js ([@FeynmanDNA](https://github.com/FeynmanDNA))
  - [#2083](https://github.com/facebook/docusaurus/pull/2083) refactor(v1): fix props for ProjectTitle ([@FeynmanDNA](https://github.com/FeynmanDNA))
- `docusaurus`
  - [#2081](https://github.com/facebook/docusaurus/pull/2081) refactor(v2): move scripts/stylesheets injection to server side ([@endiliey](https://github.com/endiliey))
  - [#2080](https://github.com/facebook/docusaurus/pull/2080) refactor(v2): minor code refactoring on component creator ([@endiliey](https://github.com/endiliey))

#### :running_woman: Performance

- `docusaurus-utils`
  - [#2089](https://github.com/facebook/docusaurus/pull/2089) perf(v2): improve dev build time by not overwriting file if possible ([@endiliey](https://github.com/endiliey))
- `docusaurus-theme-search-algolia`
  - [#2079](https://github.com/facebook/docusaurus/pull/2079) perf(v2): algolia search result no longer cause full page refresh ([@endiliey](https://github.com/endiliey))
  - [#2076](https://github.com/facebook/docusaurus/pull/2076) perf(v2): load algolia JS only when user interacts with search ([@endiliey](https://github.com/endiliey))

#### Committers: 4

- Endi ([@endiliey](https://github.com/endiliey))
- KYY ([@FeynmanDNA](https://github.com/FeynmanDNA))
- Shivangna Kaistha ([@shivangna](https://github.com/shivangna))
- kaichu ([@qshiwu](https://github.com/qshiwu))

## 2.0.0-alpha.37

#### :boom: Breaking Change

- `docusaurus-init`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-utils`, `docusaurus`
  - [#2045](https://github.com/facebook/docusaurus/pull/2045) breaking(v2): minimum required nodejs version 8.9-> 8.10 so we can use es2017 ([@endiliey](https://github.com/endiliey))

#### :rocket: New Feature

- `docusaurus-theme-classic`, `docusaurus`
  - [#2069](https://github.com/facebook/docusaurus/pull/2069) feat(v2): support prefers-color-scheme & fix dark mode FOUC on refresh ([@endiliey](https://github.com/endiliey))
- `docusaurus-plugin-content-blog`
  - [#2000](https://github.com/facebook/docusaurus/pull/2000) feat(v2): add meta RSS/Atom feed links to head ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`, `docusaurus-types`, `docusaurus`
  - [#2057](https://github.com/facebook/docusaurus/pull/2057) feat(v2): injectHtmlTags API to inject head and/or body html tags ([@endiliey](https://github.com/endiliey))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus`
  - [#2032](https://github.com/facebook/docusaurus/pull/2032) feat(v2): allow non sidebar category to be first item of sidebar ([@endiliey](https://github.com/endiliey))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus`
  - [#1983](https://github.com/facebook/docusaurus/pull/1983) feat(v2): docs versioning ❄️🔥 ([@endiliey](https://github.com/endiliey))

#### :bug: Bug Fix

- `docusaurus-theme-classic`, `docusaurus`
  - [#2069](https://github.com/facebook/docusaurus/pull/2069) feat(v2): support prefers-color-scheme & fix dark mode FOUC on refresh ([@endiliey](https://github.com/endiliey))
- `docusaurus-mdx-loader`
  - [#2067](https://github.com/facebook/docusaurus/pull/2067) fix(v2): toc should not be broken for heading with html inline code ([@endiliey](https://github.com/endiliey))
- `docusaurus-theme-classic`
  - [#2064](https://github.com/facebook/docusaurus/pull/2064) fix(v2): markdown reference to file should not be page not found ([@endiliey](https://github.com/endiliey))
  - [#2061](https://github.com/facebook/docusaurus/pull/2061) fix(v2): fix docs sidebar highlighting if link is partially matched ([@endiliey](https://github.com/endiliey))
- `docusaurus`
  - [#2042](https://github.com/facebook/docusaurus/pull/2042) fix(v2): remove css order warning if css imports are not sorted ([@endiliey](https://github.com/endiliey))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#2066](https://github.com/facebook/docusaurus/pull/2066) refactor(v2): add title attribute to anchor link ([@lex111](https://github.com/lex111))
  - [#1990](https://github.com/facebook/docusaurus/pull/1990) refactor(v2): make better a11y for tabs ([@lex111](https://github.com/lex111))
  - [#2034](https://github.com/facebook/docusaurus/pull/2034) feat(v2): style sidebar on overflow ([@endiliey](https://github.com/endiliey))

#### :memo: Documentation

- Other
  - [#2068](https://github.com/facebook/docusaurus/pull/2068) docs(v2): quick proofread docs ([@endiliey](https://github.com/endiliey))
  - [#2047](https://github.com/facebook/docusaurus/pull/2047) docs(v2): add manual migration guide for versioning ([@endiliey](https://github.com/endiliey))
  - [#2036](https://github.com/facebook/docusaurus/pull/2036) docs(v2): Reorganize migration guide ([@wgao19](https://github.com/wgao19))
  - [#2052](https://github.com/facebook/docusaurus/pull/2052) fix(v2): make proper spelling of Yarn in tabs ([@lex111](https://github.com/lex111))
  - [#2040](https://github.com/facebook/docusaurus/pull/2040) docs(v2): showcase user vector.dev :) ([@binarylogic](https://github.com/binarylogic))
  - [#2038](https://github.com/facebook/docusaurus/pull/2038) docs(v2): add documentation on versioning ([@endiliey](https://github.com/endiliey))
  - [#2037](https://github.com/facebook/docusaurus/pull/2037) docs(v2): display yarn and npm command on website ([@endiliey](https://github.com/endiliey))
  - [#2051](https://github.com/facebook/docusaurus/pull/2051) docs(v2): more examples on lifecycle apis, cleanup ([@endiliey](https://github.com/endiliey))

#### :house: Internal

- `docusaurus-plugin-content-blog`
  - [#2072](https://github.com/facebook/docusaurus/pull/2072) refactor(v2): stronger typing for blog plugin ([@endiliey](https://github.com/endiliey))
- `docusaurus`
  - [#2060](https://github.com/facebook/docusaurus/pull/2060) fix(v2): clean generated manifest from previous build so we dont use the wrong one ([@endiliey](https://github.com/endiliey))
  - [#2033](https://github.com/facebook/docusaurus/pull/2033) refactor(v2): move unused generated files out from build folder ([@endiliey](https://github.com/endiliey))
- `docusaurus-types`, `docusaurus`
  - [#2043](https://github.com/facebook/docusaurus/pull/2043) refactor(v2): stronger typing for route gen ([@endiliey](https://github.com/endiliey))
- `docusaurus-mdx-loader`, `docusaurus-plugin-ideal-image`, `docusaurus-types`, `docusaurus`
  - [#2044](https://github.com/facebook/docusaurus/pull/2044) chore(v2): bump deps ([@endiliey](https://github.com/endiliey))
- `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-plugin-content-docs`, `docusaurus`
  - [#2029](https://github.com/facebook/docusaurus/pull/2029) chore(v2): bump deps and remove unused deps ([@endiliey](https://github.com/endiliey))

#### :running_woman: Performance

- `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`
  - [#2070](https://github.com/facebook/docusaurus/pull/2070) perf(v2): more performant gtag and analytics plugin ([@endiliey](https://github.com/endiliey))
- `docusaurus`
  - [#2046](https://github.com/facebook/docusaurus/pull/2046) perf(v2): use webpack future version of asset emitting logic to free memory ([@endiliey](https://github.com/endiliey))
  - [#2039](https://github.com/facebook/docusaurus/pull/2039) perf(v2): replace unnecessary json stringify(string) with inline string ([@endiliey](https://github.com/endiliey))
  - [#2035](https://github.com/facebook/docusaurus/pull/2035) perf(v2): use @babel/runtime plugin to reduce codesize ([@endiliey](https://github.com/endiliey))
- `docusaurus-plugin-content-docs`
  - [#2054](https://github.com/facebook/docusaurus/pull/2054) perf(v2): unblock metadata processing when possible ([@endiliey](https://github.com/endiliey))

#### Committers: 5

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Binary Logic ([@binarylogic](https://github.com/binarylogic))
- Dongwoo Gim ([@gimdongwoo](https://github.com/gimdongwoo))
- Endi ([@endiliey](https://github.com/endiliey))
- Wei Gao ([@wgao19](https://github.com/wgao19))

## 2.0.0-alpha.36

#### :boom: Breaking Change

- `docusaurus-init`, `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`
  - [#1989](https://github.com/facebook/docusaurus/pull/1989) misc(v2): change blog front matter to snake_case ([@yangshun](https://github.com/yangshun))

#### :rocket: New Feature

- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#2012](https://github.com/facebook/docusaurus/pull/2012) feat(v2): allow hiding docs table of contents ([@yangshun](https://github.com/yangshun))

#### :bug: Bug Fix

- `docusaurus`
  - [#2007](https://github.com/facebook/docusaurus/pull/2007) feat(v2): only create one css file to avoid code-split css loading problem ([@endiliey](https://github.com/endiliey))
- `docusaurus-theme-classic`
  - [#2005](https://github.com/facebook/docusaurus/pull/2005) fix(v2): adjust first-level heading offset ([@lex111](https://github.com/lex111))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#2013](https://github.com/facebook/docusaurus/pull/2013) refactor(v2): split out dark mode toggle so it is easily swizzle-able ([@endiliey](https://github.com/endiliey))
  - [#2017](https://github.com/facebook/docusaurus/pull/2017) feat(v2): style right sidebar scrollbar when overflow ([@endiliey](https://github.com/endiliey))
  - [#2003](https://github.com/facebook/docusaurus/pull/2003) refactor(v2): improve semantic markup of blog ([@lex111](https://github.com/lex111))

#### :house: Internal

- `docusaurus`
  - [#2024](https://github.com/facebook/docusaurus/pull/2024) test(v2): babel exclude transpilation logic to prevent regression ([@endiliey](https://github.com/endiliey))
  - [#2014](https://github.com/facebook/docusaurus/pull/2014) feat(v2): add meta generator docusaurus ([@endiliey](https://github.com/endiliey))
- `docusaurus-mdx-loader`, `docusaurus-plugin-ideal-image`
  - [#2015](https://github.com/facebook/docusaurus/pull/2015) chore(v2): bump & remove unused deps ([@endiliey](https://github.com/endiliey))
- Other
  - [#2009](https://github.com/facebook/docusaurus/pull/2009) misc(v2): branding update ([@yangshun](https://github.com/yangshun))

#### :memo: Documentation

- [#2010](https://github.com/facebook/docusaurus/pull/2010) docs(v2): misc updates ([@yangshun](https://github.com/yangshun))

#### Committers: 3

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Endi ([@endiliey](https://github.com/endiliey))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))

## 2.0.0-alpha.35

#### :rocket: New Feature

- `docusaurus-theme-classic`
  - [#1965](https://github.com/facebook/docusaurus/pull/1965) feat(v2): add ability specify link in footer logo ([@lex111](https://github.com/lex111))

#### :bug: Bug Fix

- `docusaurus-mdx-loader`, `docusaurus-theme-classic`
  - [#1992](https://github.com/facebook/docusaurus/pull/1992) fix(v2): static phrasing content should be rendered correctly in TOC ([@endiliey](https://github.com/endiliey))
- `docusaurus-theme-classic`
  - [#1999](https://github.com/facebook/docusaurus/pull/1999) fix(v2): remove hashbang when click on category ([@lex111](https://github.com/lex111))
  - [#1962](https://github.com/facebook/docusaurus/pull/1962) fix(v2): make not clickable post title on post item page ([@lex111](https://github.com/lex111))
  - [#1980](https://github.com/facebook/docusaurus/pull/1980) fix(v2): remove invalid label attribute of footer links ([@lex111](https://github.com/lex111))
  - [#1978](https://github.com/facebook/docusaurus/pull/1978) fix(v2): use regular div instead of main tag for wrapper layout page ([@lex111](https://github.com/lex111))
  - [#1975](https://github.com/facebook/docusaurus/pull/1975) fix(v2): move header inside article tag in doc page ([@lex111](https://github.com/lex111))
  - [#1974](https://github.com/facebook/docusaurus/pull/1974) fix(v2): remove invalid attributes of nav links ([@lex111](https://github.com/lex111))
  - [#1963](https://github.com/facebook/docusaurus/pull/1963) fix(v2): remove empty containers when no data in blog pages ([@lex111](https://github.com/lex111))
  - [#1966](https://github.com/facebook/docusaurus/pull/1966) fix(v2): remove duplicate meta tags ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`
  - [#1994](https://github.com/facebook/docusaurus/pull/1994) fix(v2): throw error if first level item of a sidebar is not category ([@endiliey](https://github.com/endiliey))

#### :nail_care: Polish

- `docusaurus-theme-search-algolia`
  - [#2001](https://github.com/facebook/docusaurus/pull/2001) fix(v2): improve UI of search ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#1991](https://github.com/facebook/docusaurus/pull/1991) fix(v2): remove accessible anchors via keyboard ([@lex111](https://github.com/lex111))
  - [#1987](https://github.com/facebook/docusaurus/pull/1987) refactor(v2): replace h1 tag with h2 in blog list pages ([@lex111](https://github.com/lex111))
  - [#1981](https://github.com/facebook/docusaurus/pull/1981) fix(v2): use tag time for showing last update of doc item ([@lex111](https://github.com/lex111))
  - [#1977](https://github.com/facebook/docusaurus/pull/1977) feat(v2): add aria-label to read more links for a11y ([@lex111](https://github.com/lex111))
  - [#1964](https://github.com/facebook/docusaurus/pull/1964) fix(v2): use tag time for showing post item date ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`
  - [#1994](https://github.com/facebook/docusaurus/pull/1994) fix(v2): throw error if first level item of a sidebar is not category ([@endiliey](https://github.com/endiliey))
- Other
  - [#1986](https://github.com/facebook/docusaurus/pull/1986) fix(v2): remove obsolete iframe attributes ([@lex111](https://github.com/lex111))
- `docusaurus-init`
  - [#1982](https://github.com/facebook/docusaurus/pull/1982) feat(v2): add FB link to footer ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-blog`
  - [#1968](https://github.com/facebook/docusaurus/pull/1968) refactor(v2): simplify blog truncate function ([@endiliey](https://github.com/endiliey))

#### :memo: Documentation

- Other
  - [#1988](https://github.com/facebook/docusaurus/pull/1988) docs(v2): fix syntax highlighting for YML code blocks ([@lex111](https://github.com/lex111))
  - [#1976](https://github.com/facebook/docusaurus/pull/1976) docs(v2): Add section to blog document about feed location ([@vinnytheviking](https://github.com/vinnytheviking))
  - [#1970](https://github.com/facebook/docusaurus/pull/1970) docs(v2): update configureWebpack utility functions ([@jamiedavenport](https://github.com/jamiedavenport))
- `docusaurus-1.x`
  - [#1961](https://github.com/facebook/docusaurus/pull/1961) docs(v1): remove exclusive language ([@ericcarboni](https://github.com/ericcarboni))

#### :house: Internal

- Other
  - [#2002](https://github.com/facebook/docusaurus/pull/2002) fix(v2): fix browser window menu icon on smaller screen ([@lex111](https://github.com/lex111))
  - [#1986](https://github.com/facebook/docusaurus/pull/1986) fix(v2): remove obsolete iframe attributes ([@lex111](https://github.com/lex111))
- `docusaurus-init`
  - [#1982](https://github.com/facebook/docusaurus/pull/1982) feat(v2): add FB link to footer ([@lex111](https://github.com/lex111))
- `docusaurus-1.x`, `docusaurus-init-1.x`, `docusaurus-init`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-ideal-image`, `docusaurus-types`, `docusaurus`
  - [#1985](https://github.com/facebook/docusaurus/pull/1985) chore(v2): update dependencies ([@endiliey](https://github.com/endiliey))

#### :running_woman: Performance

- `docusaurus`
  - [#1979](https://github.com/facebook/docusaurus/pull/1979) perf(v2): reduce main bundle size by using es5 if possible ([@endiliey](https://github.com/endiliey))

#### Committers: 6

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Endi ([@endiliey](https://github.com/endiliey))
- Eric Carboni ([@ericcarboni](https://github.com/ericcarboni))
- Jamie Davenport ([@jamiedavenport](https://github.com/jamiedavenport))
- Nick McCormick ([@kenning](https://github.com/kenning))
- Vincent van der Walt ([@vinnytheviking](https://github.com/vinnytheviking))

## 2.0.0-alpha.34

#### :rocket: New Feature

- `docusaurus-theme-classic`
  - [#1956](https://github.com/facebook/docusaurus/pull/1956) feat(v2): add ability hide dark mode toggle ([@lex111](https://github.com/lex111))

#### :boom: Breaking Change

- `docusaurus-plugin-content-docs`
  - [#1958](https://github.com/facebook/docusaurus/pull/1958) breaking(v2): editUrl should point to website instead of docsDir ([@endiliey](https://github.com/endiliey))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#1959](https://github.com/facebook/docusaurus/pull/1959) fix(v2): useTOC hooks should not be called in each nested children ([@endiliey](https://github.com/endiliey))

#### :nail_care: Polish

- `docusaurus-plugin-content-docs`, `docusaurus`
  - [#1957](https://github.com/facebook/docusaurus/pull/1957) refactor(v2): avoid synchronous/ blocking operation when possible ([@endiliey](https://github.com/endiliey))

#### :memo: Documentation

- [#1953](https://github.com/facebook/docusaurus/pull/1953) fix(v2): update Infima website URL ([@yangshun](https://github.com/yangshun))

#### :house: Internal

- `docusaurus-1.x`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#1955](https://github.com/facebook/docusaurus/pull/1955) chore: bump dev dependencies ([@endiliey](https://github.com/endiliey))
- Other
  - [#1952](https://github.com/facebook/docusaurus/pull/1952) chore(v2): add lerna-changelog ([@endiliey](https://github.com/endiliey))

#### :running_woman: Performance

- `docusaurus-plugin-content-docs`, `docusaurus-utils`, `docusaurus`
  - [#1951](https://github.com/facebook/docusaurus/pull/1951) perf(v2): skip runtime fileHash cache in prod & get timestamp asynchronously ([@endiliey](https://github.com/endiliey))
  - [#1950](https://github.com/facebook/docusaurus/pull/1950) perf(v2): more efficient hot reload & consistent filegen ([@endiliey](https://github.com/endiliey))

#### Committers: 3

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Endi ([@endiliey](https://github.com/endiliey))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))

## 2.0.0-alpha.33

### Features

- Table of contents is now highlighted depending on current active headings. (thanks to awesome @SantiagoGdaR) [#1896](https://github.com/facebook/docusaurus/pull/1896)
- Official blog plugin can now generate feed for blog posts. (thanks to awesome @moozzyk) [#1916](https://github.com/facebook/docusaurus/pull/1916)
- **BREAKING** `prismTheme` is renamed to `theme` as part new `prism` object in `themeConfig` field in your `docusaurus.config.js`. Eg:
  ```diff
   themeConfig: {
  -   prismTheme: require('prism-react-renderer/themes/dracula'),
  +   prism: {
  +     theme: require('prism-react-renderer/themes/dracula'),
  +   },
  },
  ```
- Added new `prism` option `defaultLanguage` that is used if the language is not specified in code blocks. [#1910](https://github.com/facebook/docusaurus/pull/1910)

### Fixes

- Fix babel/env not picking the correct browserslist configuration during development. When running `docusaurus start`, `process.env.NODE_ENV` is now consistently set to `development`.
- Ensure routes config generation to be more consistent in ordering. Nested routes should be placed last in routes.js. This will allow user to create `src/pages/docs.js` to create custom docs page for `/docs` or even `src/pages/docs/super.js` to create page for `/docs/super/`;
- Fix watcher does not trigger reload on windows.
- Fix build compilation error if exists only one code tab.
- Add minor padding to docs container so that hash-link won't be cut off.

### Others

- Misc dependency upgrades.
- Stability improvement (more tests) & refactoring on docs plugin to prevent regression.

## 2.0.0-alpha.32

### Features

- Add `<Redirect>` component for client side redirect. Example Usage:

```js
import React from 'react';
import {Redirect} from '@docusaurus/router';

function Home() {
  return <Redirect to="/docs/test" />;
}
```

- Allow user to add custom HTML to footer items. [#1905](https://github.com/facebook/docusaurus/pull/1905)
- Added code block line highlighting feature (thanks @lex111)! If you have previously swizzled the `CodeBlock` theme component, it is recommended to update your source code to have this feature. ([#1860](https://github.com/facebook/Docusaurus/issues/1860))

### Bug Fixes

- Fix `@theme/Tabs` component to be able to create tabs with only one item.
- Fix MDX `@theme/Heading` component. If there is no id, it should not create anchor link.
- Fixed a bug in which if `themeConfig.algolia` is not defined, the custom searchbar won't appear. If you've swizzled Algolia `SearchBar` component before, please update your source code otherwise CSS might break. See [#1909](https://github.com/facebook/docusaurus/pull/1909/files) for reference.

```js
- <Fragment>
+ <div className="navbar__search" key="search-box">
```

- Slightly adjust search icon position to be more aligned on small width device. ([#1893](https://github.com/facebook/Docusaurus/issues/1893))
- Fix algolia styling bug, previously search suggestion result is sometimes hidden. ([#1915](https://github.com/facebook/Docusaurus/issues/1915))
- Changed the way we read the `USE_SSH` env variable during deployment to be the same as in v1.
- Fix accessing `docs/` or `/docs/xxxx` that does not match any existing doc page should return 404 (Not found) page, not blank page. ([#1903](https://github.com/facebook/Docusaurus/issues/1903))
- Prioritize `@docusaurus/core` dependencies/ node_modules over user's node_modules. This fix a bug whereby if user has core-js@3 on its own node_modules but docusaurus depends on core-js@2, we previously encounter `Module not found: core-js/modules/xxxx` (because core-js@3 doesn't have that).
- Fix a bug where docs plugin add `/docs` route even if docs folder is empty. We also improved docs plugin test coverage to 100% for stability before working on docs versioning. ([#1912](https://github.com/facebook/Docusaurus/issues/1912))

### Performance Improvement

- Reduce memory usage consumption. ([#1900](https://github.com/facebook/Docusaurus/issues/1900))
- Significantly reduce main bundle size and initial HTML payload on production build. Generated files from webpack is also shorter in name. ([#1898](https://github.com/facebook/Docusaurus/issues/1898))
- Simplify blog metadata. Previously, accessing `/blog/post-xxx` will request for next and prev blog post metadata too aside from target post metadata. We should only request target post metadata. ([#1908](https://github.com/facebook/Docusaurus/issues/1908))

### Others

- Convert sitemap plugin to TypeScript. ([#1894](https://github.com/facebook/Docusaurus/issues/1894))
- Refactor dark mode toggle into a hook. ([#1899](https://github.com/facebook/Docusaurus/issues/1899))

## 2.0.0-alpha.31

- Footer is now sticky/ pinned to the bottom of the viewport in desktop browsers.
- Footer is now also displayed in docs page for consistency.
- Remove empty doc sidebar container if sidebar for a particular doc page does not exist. Otherwise, it will cause an additional empty space.
- Default PostCSS loader now only polyfills stage 3+ features (previously it was stage 2) like Create React App. Stage 2 CSS is considered relatively unstable and subject to change while Stage 3 features will likely become a standard.
- Fix search bar focus bug. When you put the focus on search input, previously the focus will remain although we have clicked to other area outside of the search input.
- New themeConfig option `sidebarCollapsible`. It is on by default. If explicitly set to `false`, all doc items in sidebar is expanded. Otherwise, it will still be a collapsible sidebar.
- Disable adding hashes to the generated class names of CSS modules in dev mode. Generating unique identifiers takes some time, which can be saved since including paths to files in class names is enough to avoid collisions.
- Fix showing sidebar category with empty items.
- Update infima from 0.2.0-alpha.2 to 0.2.0-alpha.3
  - Fix pagination nav and right sidebar color contrast ratio
  - Fix sidebar arrow color in dark mode
  - Fix footer mobile issue
  - Increase sidebar width
  - etc

## 2.0.0-alpha.30

- Fix babel transpilation include/exclude logic to be more efficient. This also fix a very weird bug `TypeError: Cannot assign to read only property 'exports' of object '#<Object>'`.([#1868](https://github.com/facebook/docusaurus/pull/1868))

If you are still encountering the error. Please check whether you use `module.exports` for your `.js` file instead of doing `export` (mixing CJS and ES). See https://github.com/webpack/webpack/issues/4039#issuecomment-477779322 and https://github.com/webpack/webpack/issues/4039#issuecomment-273804003 for more context.

## 2.0.0-alpha.29

**HOTFIX for 2.0.0-alpha.28**.

- Fix missing `core-js` dependencies on `@docusaurus/core`.
- Fix wrong `@babel/env` preset configuration that causes build compilation error.
- New UI for webpack compilation progress bar.

## 2.0.0-alpha.28

- Further reduce memory usage to avoid heap memory allocation failure.
- Fix `keywords` frontmatter for SEO not working properly.
- Fix `swizzle` command not passing context properly to theme packages.
- Add `extendCli` api for plugins. This will allow plugin to further extend Docusaurus CLI.
- Fix `swizzle` command not being able to swizzle single js file.
- Fix logo URL in footer to be appended with baseUrl automatically.
- Add the option `--no-open` for `start` command.
- Set `@babel/env` useBuiltins to `usage`. This will automatically use browserlist and import polyfills required.
- Modified TerserWebpackPlugin `terserOptions` for better cross-browser compatibility.
- **BREAKING** `withBaseUrl` is renamed to `useBaseUrl` because its a React Hooks. Make sure you import/rename it correctly. Eg: `import useBaseUrl from '@docusaurus/useBaseUrl`;
- Fix potential security vulnerability because we're exposing the directory structure of the host machine.
- Upgrade dependencies.

## 2.0.0-alpha.27

- Add `@theme/Tabs` which can be used to implement multi-language code tabs.
- Implement `custom_edit_url` and `hide_title` markdown header for docusaurus v1 feature parity.
- Reduce memory usage and slightly faster production build.
- Misc dependency upgrades.

## 2.0.0-alpha.26

- Docs, pages plugin is rewritten in TypeScript
- Docs improvements and tweaks
  - Improved metadata which results in smaller bundle size.
  - Docs sidebar can now be more than one level deep, theoretically up to infinity
  - Collapsible docs sidebar!
  - Make doc page title larger
  - Add `editUrl` option (URL for editing) to docs plugin. If this field is set, there will be an "Edit this page" link for each doc page. Example: 'https://github.com/facebook/docusaurus/edit/master/docs'
  - Add `showLastUpdateTime` and `showLastUpdateAuthor` options to docs plugin to further achieve v1 parity of showing last update data for a particular doc
- Slight tweaks to the Blog components - blog title is larger now
- Code Blocks
  - Change default theme from Night Owl to Palenight
  - Slight tweaks to playground/preview components
- Add `scripts` and `stylesheets` field to `docusaurus.config.js`
- More documentation...

## 2.0.0-alpha.25

- Blog plugin is rewritten in TypeScript and can now support CJK
- Upgrade key direct dependencies such as webpack, mdx and babel to latest
- Do not escape html and body attributes
- For devices with very small viewport width, the searchbar is replaced with a search icon. On tap of the search icon the searchbar is expanded and the text beside the logo is hidden and remains hidden while the search bar is expanded.
- Add `date` frontMatter support for blog plugin
- Add `truncateMarker` option to blog plugin, support string or regex.
- Webpack `optimization.removeAvailableModules` is now disabled for performance gain. See https://github.com/webpack/webpack/releases/tag/v4.38.0 for more context.

## 2.0.0-alpha.24

- Remove unused metadata for pages. This minimize number of http request & smaller bundle size.
- Upgrade dependencies of css-loader from 2.x to 3.x. Css modules localIdentName hash now only use the last 4 characters instead of 8.
- Fix broken markdown linking replacement for mdx files
- Fix potential security vulnerability because we're exposing the directory structure of the host machine. Instead of absolute path, we use relative path from site directory. Resulting in shorter webpack chunk naming and smaller bundle size.
- Use contenthash instead of chunkhash for better long term caching
- Allow user to customize generated heading from MDX. Swizzle `@theme/Heading`

## 2.0.0-alpha.23

- Fix docusaurus route config generation for certain edge case

## 2.0.0-alpha.22

- Add missing dependencies on `@docusaurus/preset-classic`
- New plugin `@docusaurus/plugin-ideal-image` to generate an almost ideal image (responsive, lazy-loading, and low quality placeholder)
- Better Twitter/discord image preview. Previously the size is too zoomed
- Allow prism syntax highlighting theme customization. Refer to https://v2.docusaurus.io/docs/markdown-features#syntax-highlighting
- CSS is now autoprefixed using postcss
- Faster, lighter webpack bundle size
- `@docusaurus/theme-live-codeblock` is now much smaller in size and no longer only load on viewport
- Blog markdown files now support using the id field to specify the path

## 2.0.0-alpha.21

- Fix babel-loader not transpiling docusaurus package

## 2.0.0-alpha.20

- Add copy codeblock button
- Add Google analytics and Google gtag plugins.
- Move source components to `/src`. Please create a `website/src` directory and move your `/pages` and `/theme` code into it. This is to make it easier to integrate your website with external build/static analysis tooling (you can now just pass in `src/**/*.js` as the path to process).
- Adde more documentation thanks to @wgao19.
- Deprecate the current docs plugin. The docs plugin as of 2.0.0-alpha.19 is heavily based on V1 specifications and we intend to create a better one that fixes some of the inconsistencies in V1. If you have swizzled any doc components, you will have to update their names. You are highly encourages to not swizzle the legacy doc components until we have completed the new docs plugin.
- Separate v2 init command to new package @docusaurus/init
- Render 404.html page
- Improve SEO
- Clicking on the logo in the mobile sliding navigation will now bring you to the homepage.
- Performance
  - Disable webpack output pathinfo. Webpack has the ability to generate path info in the output bundle. However, this puts garbage collection pressure on projects that bundle thousands of modules. Not very useful for our case
  - Drop cache-loader in CI and test environment because it has an initial overhead. We always start from scratch in vm instance like CI so cache-loader is useless
  - Better splitchunks and babel default webpack config

## 2.0.0-alpha.19

- Add a sensible default for browserslist config.
- UI
  - Add sun and moon emoji to the dark mode toggle.
  - Mobile responsive menu.
  - Right table of contents for docs is now sticky.
- Plugins
  - Change plugin definitions from classes to functions. Refer to the new plugin docs.
  - Implement Clients module API.
  - Change format within `docusaurus.config.js` to be like presets.
- Deps
  - Infima CSS is now locked down to specific versions and not relying upon the CDN which reads from trunk.
  - Update dependencies to latest
- Customize/ Override infima CSS variables by passing options into the classic preset.

```
presets: [
  [
    '@docusaurus/preset-classic',
    {
      theme: {
        customCss: require.resolve('./css/custom.css'),
      },
      ...
    },
  ],
],
```

- Allow passing remark and rehype plugins to mdx-loader for docs and blog plugin
- Move themes component of docs and blog to be part of theme-classic
- Use composition style for prism syntax highlighting instead of doing it via rehype plugin
- Pass MDXProvider to docs and blog. To change the provided MDX components, run `docusaurus swizzle @docusaurus/theme-classic MDXComponents`
- Add @docusaurus/theme-livecodeblock plugin
- Better run-time code generation & webpack splitchunks optimization
- Minify css for production build
- Fix weird scrolling problem when navigating to a route with a `hash` location

## V2 Changelog

### `siteConfig.js` changes

- `siteConfig.js` renamed to `docusaurus.config.js`.
- Remove the following config options:
  - `docsUrl`. Use the plugin option on `docusaurus-plugin-content-docs` instead.
  - `customDocsPath`. Use the plugin option on `docusaurus-plugin-content-docs` instead.
  - `sidebars.json` now has to be explicitly loaded by users and passed into the the plugin option on `docusaurus-plugin-content-docs`.
  - `headerLinks` doc, page, blog is deprecated and has been to moved into `themeConfig` under the name `navbar`. The syntax is now:

```js
themeConfig: {
  navbar: {
    title: 'Docusaurus',
    logo: {
      alt: 'Docusaurus Logo',
      src: 'img/docusaurus.svg',
    },
    links: [
      {to: 'docs/introduction', label: 'Docs', position: 'left'},
      {to: 'blog', label: 'Blog', position: 'left'},
      {to: 'feedback', label: 'Feedback', position: 'left'},
      {
        href: 'https://github.com/facebook/docusaurus',
        label: 'GitHub',
        position: 'right',
      },
    ],
  },
}
```

# Migration Guide

_Work in Progress_

### Presets

- Add presets for plugins that follow the [Babel preset convention](https://babeljs.io/docs/en/presets).
