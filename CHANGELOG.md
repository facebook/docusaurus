# Docusaurus Changelog

## 3.8.0 (2025-05-26)

#### :rocket: New Feature

- `docusaurus-plugin-css-cascade-layers`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus`
  - [#11142](https://github.com/facebook/docusaurus/pull/11142) feat(theme): new CSS cascade layers plugin + built-in `v4.useCssCascadeLayers` future flag ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#11156](https://github.com/facebook/docusaurus/pull/11156) feat(core): add internal flag to skip bundling ([@slorber](https://github.com/slorber))
  - [#11067](https://github.com/facebook/docusaurus/pull/11067) feat(core): enable Rspack `parallelCodeSplitting` ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#11090](https://github.com/facebook/docusaurus/pull/11090) feat(theme): make it possible to provide your own page title formatter ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-pages`
  - [#11088](https://github.com/facebook/docusaurus/pull/11088) feat(pages): Support `frontMatter.slug` like docs and blog plugins ([@slorber](https://github.com/slorber))
- `docusaurus-faster`, `docusaurus`
  - [#11006](https://github.com/facebook/docusaurus/pull/11006) feat(core): Add bundler tracing/profiling ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-translations`
  - [#10987](https://github.com/facebook/docusaurus/pull/10987) feat(theme): Allow resetting colorMode to System/OS value ([@slorber](https://github.com/slorber))
- `docusaurus-remark-plugin-npm2yarn`
  - [#10953](https://github.com/facebook/docusaurus/pull/10953) feat(plugin-npm2yarn): Add Bun to default tabs conversions ([@jakeboone02](https://github.com/jakeboone02))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#10945](https://github.com/facebook/docusaurus/pull/10945) feat(theme): add theme layout stable CSS classes ([@slorber](https://github.com/slorber))
  - [#10846](https://github.com/facebook/docusaurus/pull/10846) feat(theme): code block showLineNumbers=start metastring ([@slorber](https://github.com/slorber))
- `docusaurus-faster`, `docusaurus-plugin-content-docs`, `docusaurus-types`, `docusaurus`
  - [#10931](https://github.com/facebook/docusaurus/pull/10931) feat(core): Docusaurus Faster - Rspack Persistent Cache ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#10852](https://github.com/facebook/docusaurus/pull/10852) feat(theme): add `versions` attribute to `docsVersionDropdown` navbar item ([@hrumhurum](https://github.com/hrumhurum))
- `docusaurus-types`, `docusaurus`
  - [#10826](https://github.com/facebook/docusaurus/pull/10826) feat(core): Docusaurus Faster - SSG worker threads ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-sitemap`, `docusaurus-types`, `docusaurus`
  - [#10850](https://github.com/facebook/docusaurus/pull/10850) feat(core): new `postBuild({routesBuildMetadata})` API, deprecate `head` attribute + v4 future flag ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-plugin-content-blog`
  - [#11138](https://github.com/facebook/docusaurus/pull/11138) refactor(content-blog): replace `reading-time` with `Intl.Segmenter` API ([@shreedharbhat98](https://github.com/shreedharbhat98))
- `docusaurus-plugin-content-blog`
  - [#11138](https://github.com/facebook/docusaurus/pull/11138) refactor(content-blog): replace `reading-time` with `Intl.Segmenter` API ([@shreedharbhat98](https://github.com/shreedharbhat98))
  - [#11068](https://github.com/facebook/docusaurus/pull/11068) fix(blog): fix blog Atom feed item url / XSL bug ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`
  - [#11179](https://github.com/facebook/docusaurus/pull/11179) fix(mdx-loader): remove opt-in for mdx dependency file ([@slorber](https://github.com/slorber))
  - [#10875](https://github.com/facebook/docusaurus/pull/10875) fix(docs): versioning CLI should copy localized translation file `current.json` to `version-<v>.json` ([@jkboxomine](https://github.com/jkboxomine))
- `create-docusaurus`
  - [#11157](https://github.com/facebook/docusaurus/pull/11157) fix(create-docusaurus): Improve init template README, fix headings and remove $ in bash code blocks ([@arienshibani](https://github.com/arienshibani))
- `docusaurus-theme-common`
  - [#11153](https://github.com/facebook/docusaurus/pull/11153) fix(theme): restore former code block theme-common internal APIs ([@slorber](https://github.com/slorber))
  - [#11046](https://github.com/facebook/docusaurus/pull/11046) fix(theme): Fix code block magic comments with CRLF line breaks bug ([@coder-xiaomo](https://github.com/coder-xiaomo))
  - [#10989](https://github.com/facebook/docusaurus/pull/10989) fix(theme): mobile drawer history blocker should be rendered conditionally (workaround) ([@slorber](https://github.com/slorber))
  - [#10954](https://github.com/facebook/docusaurus/pull/10954) fix(theme): fix `useColorMode().colorMode` leading to React hydration mismatches ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#11085](https://github.com/facebook/docusaurus/pull/11085) fix(theme): add missing `rel="tag"` attribute for docs/blog tags ([@slorber](https://github.com/slorber))
  - [#10999](https://github.com/facebook/docusaurus/pull/10999) fix(theme): CodeBlock should accept `title` of `ReactNode` type ([@lebalz](https://github.com/lebalz))
  - [#10705](https://github.com/facebook/docusaurus/pull/10705) fix(theme): only render secondaryMenu if it should be shown ([@hidde](https://github.com/hidde))
  - [#10898](https://github.com/facebook/docusaurus/pull/10898) fix(theme): a11y fix on mobile DropdownNavbarItem ([@mxschmitt](https://github.com/mxschmitt))
  - [#10909](https://github.com/facebook/docusaurus/pull/10909) fix(theme): apply docs `sidebar_class_name` in DocCard + better dogfooding ([@slorber](https://github.com/slorber))
  - [#10849](https://github.com/facebook/docusaurus/pull/10849) fix(theme): fix `<DocCard>` height inconsistency ([@hichemfantar](https://github.com/hichemfantar))
  - [#10866](https://github.com/facebook/docusaurus/pull/10866) fix(theme): Hide code block buttons before React hydration ([@kennethormandy](https://github.com/kennethormandy))
- `docusaurus-theme-classic`, `docusaurus-theme-translations`
  - [#11053](https://github.com/facebook/docusaurus/pull/11053) fix(theme): navbar mobile sidebar should allow clicking dropdown parent link ([@slorber](https://github.com/slorber))
- `docusaurus-utils`
  - [#11027](https://github.com/facebook/docusaurus/pull/11027) fix(cli): fix CLI write-translation bug ([@slorber](https://github.com/slorber))
- `docusaurus-theme-translations`
  - [#11030](https://github.com/facebook/docusaurus/pull/11030) fix(theme-translation): add missing Japanese translation for System Mode ([@tats-u](https://github.com/tats-u))
  - [#10893](https://github.com/facebook/docusaurus/pull/10893) fix(theme-translations): Turkish exist language translate completed. ([@ramazansancar](https://github.com/ramazansancar))
  - [#10884](https://github.com/facebook/docusaurus/pull/10884) fix(theme-translations): Add missing Polish (pl) theme translations ([@mariuszkrzaczkowski](https://github.com/mariuszkrzaczkowski))
- `docusaurus-plugin-ideal-image`
  - [#11026](https://github.com/facebook/docusaurus/pull/11026) fix(ideal-image): fix waypoint initial scroll bug ([@slorber](https://github.com/slorber))
  - [#11014](https://github.com/facebook/docusaurus/pull/11014) fix(ideal-image): Internalize `react-waypoint` dependency, fix React 19 compatibility ([@slorber](https://github.com/slorber))
  - [#10910](https://github.com/facebook/docusaurus/pull/10910) fix(ideal-image): Add issuer to ideal-image Webpack loader ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`
  - [#11004](https://github.com/facebook/docusaurus/pull/11004) fix(mdx-loader): refactor and fix heading to toc html value serialization ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`
  - [#10998](https://github.com/facebook/docusaurus/pull/10998) fix(module-type-aliases): pin react-helmet-async to @slorber/react-helmet-async@1.3.0 ([@cylewaitforit](https://github.com/cylewaitforit))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-translations`
  - [#10987](https://github.com/facebook/docusaurus/pull/10987) feat(theme): Allow resetting colorMode to System/OS value ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-utils`
  - [#10958](https://github.com/facebook/docusaurus/pull/10958) fix(create-docusaurus): fix CLI and remove shelljs escapeShellArg util ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-docs`
  - [#10934](https://github.com/facebook/docusaurus/pull/10934) fix(docs): fix mdx loader cache invalidation bug on versions changes ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`
  - [#10929](https://github.com/facebook/docusaurus/pull/10929) fix(plugins): add missing `validateOptions` types ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#10888](https://github.com/facebook/docusaurus/pull/10888) fix(seo): docs breadcrumb structured data should use JSON-LD and filter unliked categories ([@johnnyreilly](https://github.com/johnnyreilly))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#10886](https://github.com/facebook/docusaurus/pull/10886) fix(theme): collapse doc sidebar category on label click if active ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#10915](https://github.com/facebook/docusaurus/pull/10915) fix(core): use `os.availableParallelism()` for SSG worker threads count ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#10847](https://github.com/facebook/docusaurus/pull/10847) fix(theme): Fix `<DocCardList>` usage on docs at root of a sidebar ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-svgr`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#10820](https://github.com/facebook/docusaurus/pull/10820) fix(core): restore core svg file-loader ([@slorber](https://github.com/slorber))
- `docusaurus-logger`
  - [#10818](https://github.com/facebook/docusaurus/pull/10818) fix: perflogger mark detail bug ([@slorber](https://github.com/slorber))

#### :running_woman: Performance

- `docusaurus-utils`, `docusaurus`
  - [#11178](https://github.com/facebook/docusaurus/pull/11178) perf(core): disable Rspack `parallelCodeSplitting` temporarily ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#11177](https://github.com/facebook/docusaurus/pull/11177) perf(core): fix bad value for mergeDuplicateChunks (typo) ([@slorber](https://github.com/slorber))
  - [#11170](https://github.com/facebook/docusaurus/pull/11170) perf(core): add default for DOCUSAURUS_SSG_WORKER_THREAD_RECYCLER_MAX_MEMORY ([@slorber](https://github.com/slorber))
  - [#11166](https://github.com/facebook/docusaurus/pull/11166) feat(core): expose opt-in env variable for SSG thread recycling ([@slorber](https://github.com/slorber))
  - [#11072](https://github.com/facebook/docusaurus/pull/11072) perf(core): remove bundler `optimization.removeAvailableModules` ([@slorber](https://github.com/slorber))
  - [#11067](https://github.com/facebook/docusaurus/pull/11067) feat(core): enable Rspack `parallelCodeSplitting` ([@slorber](https://github.com/slorber))
  - [#11037](https://github.com/facebook/docusaurus/pull/11037) refactor(core): remove clean-webpack-plugin ([@slorber](https://github.com/slorber))
  - [#11007](https://github.com/facebook/docusaurus/pull/11007) perf(core): Optimize `docusaurus start/serve`, fix `openBrowser()` perf issue on macOS ([@slorber](https://github.com/slorber))
- `docusaurus-bundler`, `docusaurus-faster`, `docusaurus`
  - [#11176](https://github.com/facebook/docusaurus/pull/11176) perf(bundler): fine-tuning of Webpack/Rspack optimizations ([@slorber](https://github.com/slorber))
- `docusaurus-utils`
  - [#11163](https://github.com/facebook/docusaurus/pull/11163) perf(utils): implement git command queue ([@slorber](https://github.com/slorber))
- `docusaurus-logger`, `docusaurus`
  - [#11162](https://github.com/facebook/docusaurus/pull/11162) perf(core): optimize SSG collected data memory and worker thread communication ([@slorber](https://github.com/slorber))
- `docusaurus-bundler`, `docusaurus`
  - [#10956](https://github.com/facebook/docusaurus/pull/10956) refactor: remove `react-dev-utils` (CRA) dependency, internalize code ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#10885](https://github.com/facebook/docusaurus/pull/10885) perf(theme): use SVG sprite for IconExternalLink ([@slorber](https://github.com/slorber))
- `docusaurus-types`, `docusaurus`
  - [#10826](https://github.com/facebook/docusaurus/pull/10826) feat(core): Docusaurus Faster - SSG worker threads ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-theme-live-codeblock`
  - [#11120](https://github.com/facebook/docusaurus/pull/11120) fix(theme): improve color contrast of live code block header ([@JackHowa](https://github.com/JackHowa))
- `docusaurus-theme-translations`
  - [#10825](https://github.com/facebook/docusaurus/pull/10825) fix(theme-translations): Add missing Polish (pl) theme translations ([@mariuszkrzaczkowski](https://github.com/mariuszkrzaczkowski))
  - [#10816](https://github.com/facebook/docusaurus/pull/10816) chore(theme-translations): add missing zh theme translations ([@MisterFISHUP](https://github.com/MisterFISHUP))

#### :memo: Documentation

- [#11181](https://github.com/facebook/docusaurus/pull/11181) docs: adjust the Docusaurus release process documentation to our new simpler process ([@slorber](https://github.com/slorber))
- [#11180](https://github.com/facebook/docusaurus/pull/11180) docs(ideal-image): Add warning for pnpm 10+ and `sharp` install script ([@slorber](https://github.com/slorber))
- [#11137](https://github.com/facebook/docusaurus/pull/11137) docs(deploy): remove `layer0` from deployment docs ([@PaiJi](https://github.com/PaiJi))
- [#10822](https://github.com/facebook/docusaurus/pull/10822) docs(website): Comparison with Rspress ([@DevJoaoLopes](https://github.com/DevJoaoLopes))

#### :robot: Dependencies

- [#11185](https://github.com/facebook/docusaurus/pull/11185) chore(deps): bump actions/dependency-review-action from 4.7.0 to 4.7.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#11182](https://github.com/facebook/docusaurus/pull/11182) chore(deps): bump lockfile-lint-api from 5.9.1 to 5.9.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#11174](https://github.com/facebook/docusaurus/pull/11174) chore(deps): bump actions/dependency-review-action from 4.6.0 to 4.7.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#11135](https://github.com/facebook/docusaurus/pull/11135) chore(deps): bump http-proxy-middleware from 2.0.7 to 2.0.9 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#11103](https://github.com/facebook/docusaurus/pull/11103) chore(deps): bump marocchino/sticky-pull-request-comment from 2.9.1 to 2.9.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#11102](https://github.com/facebook/docusaurus/pull/11102) chore(deps): bump actions/setup-node from 4.3.0 to 4.4.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#11070](https://github.com/facebook/docusaurus/pull/11070) chore(deps): bump estree-util-value-to-estree from 3.1.2 to 3.3.3 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#11069](https://github.com/facebook/docusaurus/pull/11069) chore(deps): bump actions/dependency-review-action from 4.5.0 to 4.6.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#11002](https://github.com/facebook/docusaurus/pull/11002) chore(deps): bump actions/setup-node from 4.2.0 to 4.3.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10990](https://github.com/facebook/docusaurus/pull/10990) chore(deps): bump @babel/runtime-corejs3 from 7.25.9 to 7.26.10 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10970](https://github.com/facebook/docusaurus/pull/10970) chore(deps): bump axios from 1.7.7 to 1.8.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10978](https://github.com/facebook/docusaurus/pull/10978) chore(deps): bump prismjs from 1.29.0 to 1.30.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10957](https://github.com/facebook/docusaurus/pull/10957) chore(deps): bump http-proxy-middleware from 2.0.6 to 2.0.7 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10937](https://github.com/facebook/docusaurus/pull/10937) chore(deps): bump dompurify from 3.1.6 to 3.2.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10936](https://github.com/facebook/docusaurus/pull/10936) chore(deps): bump preactjs/compressed-size-action from 2.7.0 to 2.8.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10873](https://github.com/facebook/docusaurus/pull/10873) chore(deps): bump actions/setup-node from 4.1.0 to 4.2.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10853](https://github.com/facebook/docusaurus/pull/10853) chore(deps): bump marocchino/sticky-pull-request-comment from 2.9.0 to 2.9.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10851](https://github.com/facebook/docusaurus/pull/10851) chore(deps): bump katex from 0.16.11 to 0.16.21 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### :wrench: Maintenance

- `docusaurus-mdx-loader`, `docusaurus-utils`
  - [#11168](https://github.com/facebook/docusaurus/pull/11168) chore: add Node 24 to CI + fix deprecation warnings ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`
  - [#11116](https://github.com/facebook/docusaurus/pull/11116) test(blog): Add unit tests for calculating blog posts reading time ([@shreedharbhat98](https://github.com/shreedharbhat98))
- `docusaurus-mdx-loader`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`
  - [#11077](https://github.com/facebook/docusaurus/pull/11077) refactor(live-codeblock): refactor live code block theme components ([@slorber](https://github.com/slorber))
- Other
  - [#11075](https://github.com/facebook/docusaurus/pull/11075) fix(c): fix `yarn lint:spelling:fix` script ([@slorber](https://github.com/slorber))
- `docusaurus-faster`
  - [#11073](https://github.com/facebook/docusaurus/pull/11073) chore: upgrade Rspack 1.3.3 ([@slorber](https://github.com/slorber))
  - [#10870](https://github.com/facebook/docusaurus/pull/10870) chore(deps): bump @rspack/core in Faster from 1.2.0-alpha.0 to 1.2.2 ([@tats-u](https://github.com/tats-u))
- `docusaurus-theme-mermaid`
  - [#11066](https://github.com/facebook/docusaurus/pull/11066) chore: upgrade mermaid, fix diagram labels bug ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`
  - [#11065](https://github.com/facebook/docusaurus/pull/11065) chore: upgrade image-size deps to v2 ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#11062](https://github.com/facebook/docusaurus/pull/11062) refactor(theme): introduce CodeBlockContextProvider + split into smaller components ([@slorber](https://github.com/slorber))
  - [#11059](https://github.com/facebook/docusaurus/pull/11059) refactor(theme): CodeBlock, centralize metadata parsing + refactor theme component ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-common`
  - [#11058](https://github.com/facebook/docusaurus/pull/11058) refactor(theme): refactor CodeBlock parseLines logic + use inline snapshots to ease review ([@slorber](https://github.com/slorber))
- `docusaurus-faster`, `docusaurus`
  - [#11039](https://github.com/facebook/docusaurus/pull/11039) chore: use rspack 1.3.0 ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-ideal-image`
  - [#11010](https://github.com/facebook/docusaurus/pull/11010) refactor(ideal-image-plugin): internalize legacy component code ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-mermaid`, `docusaurus-theme-search-algolia`
  - [#10969](https://github.com/facebook/docusaurus/pull/10969) chore: add `eslint-plugin-react-compiler` ([@slorber](https://github.com/slorber))
- `docusaurus-cssnano-preset`, `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-remark-plugin-npm2yarn`, `eslint-plugin`, `stylelint-copyright`
  - [#10966](https://github.com/facebook/docusaurus/pull/10966) chore: upgrade monorepo to TS 5.8 ([@slorber](https://github.com/slorber))
- `docusaurus-bundler`, `docusaurus`
  - [#10956](https://github.com/facebook/docusaurus/pull/10956) refactor: remove `react-dev-utils` (CRA) dependency, internalize code ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-plugin-content-docs`, `docusaurus-utils`, `docusaurus`
  - [#10358](https://github.com/facebook/docusaurus/pull/10358) refactor: replace unmaintained shelljs dependency by execa ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-theme-search-algolia`
  - [#10941](https://github.com/facebook/docusaurus/pull/10941) chore(algolia): bump docsearch dependency to v3.9 ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-debug`
  - [#10903](https://github.com/facebook/docusaurus/pull/10903) chore(plugin-debug): upgrade react-json-view-lite to v2.3.0 for react 19 ([@reece-white](https://github.com/reece-white))
  - [#10819](https://github.com/facebook/docusaurus/pull/10819) chore(plugin-debug): upgrade react-json-view-lite to v2, prepare for React 19 ([@slorber](https://github.com/slorber))
- `create-docusaurus`
  - [#10871](https://github.com/facebook/docusaurus/pull/10871) refactor(create-docusaurus): add `future.v4` flag to init templates ([@slorber](https://github.com/slorber))

#### Committers: 38

- Arien Shibani ([@arienshibani](https://github.com/arienshibani))
- Balthasar Hofer ([@lebalz](https://github.com/lebalz))
- Ben McCann ([@benmccann](https://github.com/benmccann))
- Daniel Kuschny ([@Danielku15](https://github.com/Danielku15))
- David King Roderos ([@dkroderos](https://github.com/dkroderos))
- FISH UP ([@MisterFISHUP](https://github.com/MisterFISHUP))
- Hichem Fantar ([@hichemfantar](https://github.com/hichemfantar))
- Hidde de Vries ([@hidde](https://github.com/hidde))
- Jack Howard ([@JackHowa](https://github.com/JackHowa))
- Jake Boone ([@jakeboone02](https://github.com/jakeboone02))
- JiPai ([@PaiJi](https://github.com/PaiJi))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- João Victor Lopes ([@DevJoaoLopes](https://github.com/DevJoaoLopes))
- Justin D Mathew ([@JDMathew](https://github.com/JDMathew))
- Kenneth Ormandy ([@kennethormandy](https://github.com/kennethormandy))
- Mariusz Krzaczkowski ([@mariuszkrzaczkowski](https://github.com/mariuszkrzaczkowski))
- Massoud Maboudi ([@massoudmaboudi](https://github.com/massoudmaboudi))
- Max Schmitt ([@mxschmitt](https://github.com/mxschmitt))
- Milica ([@mmaksimovic](https://github.com/mmaksimovic))
- Oleksiy Gapotchenko ([@hrumhurum](https://github.com/hrumhurum))
- Ramazan Sancar ([@ramazansancar](https://github.com/ramazansancar))
- Shreedhar Bhat ([@shreedharbhat98](https://github.com/shreedharbhat98))
- Stephen Glass ([@stephenglass](https://github.com/stephenglass))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Taras ([@taraspos](https://github.com/taraspos))
- Tatsunori Uchino ([@tats-u](https://github.com/tats-u))
- Waldir Pimenta ([@waldyrious](https://github.com/waldyrious))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))
- Yoshiaki Yoshida ([@kakakakakku](https://github.com/kakakakakku))
- [@cylewaitforit](https://github.com/cylewaitforit)
- [@jkboxomine](https://github.com/jkboxomine)
- [@reece-white](https://github.com/reece-white)
- kilavvy ([@kilavvy](https://github.com/kilavvy))
- ozaki ([@OzakIOne](https://github.com/OzakIOne))
- pedenys ([@pedenys](https://github.com/pedenys))
- マルコメ ([@Marukome0743](https://github.com/Marukome0743))
- 程序员小墨 ([@coder-xiaomo](https://github.com/coder-xiaomo))

## 3.7.0 (2025-01-03)

#### :rocket: New Feature

- `docusaurus-faster`, `docusaurus`
  - [#10800](https://github.com/facebook/docusaurus/pull/10800) feat(core): Turn Rspack incremental on by default (again) ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`
  - [#10768](https://github.com/facebook/docusaurus/pull/10768) feat(blog): Add author social icons for bluesky, mastodon, threads, twitch, youtube, instagram ([@GingerGeek](https://github.com/GingerGeek))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-google-tag-manager`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-rsdoctor`, `docusaurus-plugin-sitemap`, `docusaurus-plugin-svgr`, `docusaurus-plugin-vercel-analytics`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-mermaid`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus`
  - [#10763](https://github.com/facebook/docusaurus/pull/10763) feat: Add React 19 support to Docusaurus v3 ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`
  - [#10729](https://github.com/facebook/docusaurus/pull/10729) feat(blog): Add `frontMatter.sidebar_label` ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-svgr`, `docusaurus-preset-classic`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#10677](https://github.com/facebook/docusaurus/pull/10677) feat(svgr): create new Docusaurus SVGR plugin ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-remark-plugin-npm2yarn`
  - [#10803](https://github.com/facebook/docusaurus/pull/10803) fix(npm-to-yarn): add missing npm-to-yarn converter for Bun ([@Lehoczky](https://github.com/Lehoczky))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#10796](https://github.com/facebook/docusaurus/pull/10796) fix(theme): Footer Column/Link should merge provided className ([@slorber](https://github.com/slorber))
- `docusaurus-bundler`, `docusaurus-theme-common`
  - [#10786](https://github.com/facebook/docusaurus/pull/10786) fix(core): fix React hydration errors, change html minifier settings ([@slorber](https://github.com/slorber))
- `docusaurus-theme-common`
  - [#10782](https://github.com/facebook/docusaurus/pull/10782) fix(theme-common): code block magic comments should support SQL block comments ([@WillBlack403](https://github.com/WillBlack403))
- `docusaurus-theme-translations`
  - [#10783](https://github.com/facebook/docusaurus/pull/10783) fix(theme-translations): Add missing Dutch (nl) theme translations ([@janaukema](https://github.com/janaukema))
  - [#10760](https://github.com/facebook/docusaurus/pull/10760) fix(theme-translation): add missing Korean (ko) theme translations ([@effozen](https://github.com/effozen))
- `docusaurus-plugin-content-docs`
  - [#10754](https://github.com/facebook/docusaurus/pull/10754) fix(docs): fix sidebar item visibility bug for category index ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#10727](https://github.com/facebook/docusaurus/pull/10727) fix(core): fix codegen routesChunkName possible hash collision ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`
  - [#10723](https://github.com/facebook/docusaurus/pull/10723) fix(mdx-loader): fix md image paths with spaces bug related to transformImage encoding problem ([@slorber](https://github.com/slorber))

#### :memo: Documentation

- [#10740](https://github.com/facebook/docusaurus/pull/10740) docs: Link initialization docs together ([@waldyrious](https://github.com/waldyrious))

#### :robot: Dependencies

- [#10771](https://github.com/facebook/docusaurus/pull/10771) chore(deps): bump nanoid from 3.3.7 to 3.3.8 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10721](https://github.com/facebook/docusaurus/pull/10721) chore(deps): bump actions/dependency-review-action from 4.4.0 to 4.5.0 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### :wrench: Maintenance

- Other
  - [#10770](https://github.com/facebook/docusaurus/pull/10770) chore: Devcontainer upgrade to Ubuntu Noble & Node 22 ([@GingerGeek](https://github.com/GingerGeek))
- `docusaurus-theme-search-algolia`
  - [#10801](https://github.com/facebook/docusaurus/pull/10801) refactor(algolia): simplify SearchBar component ([@slorber](https://github.com/slorber))
  - [#10672](https://github.com/facebook/docusaurus/pull/10672) chore(algolia): upgrade algoliasearch to v5 ([@millotp](https://github.com/millotp))
- `docusaurus`
  - [#10798](https://github.com/facebook/docusaurus/pull/10798) refactor(core): Use Intl native API to get locale direction, remove rtl-detect depend… ([@slorber](https://github.com/slorber))
  - [#10747](https://github.com/facebook/docusaurus/pull/10747) refactor(core): swizzle wrap should use ReactNode instead of JSX.Element ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-module-type-aliases`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-mermaid`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus`
  - [#10746](https://github.com/facebook/docusaurus/pull/10746) refactor: prepare types for React 19 ([@slorber](https://github.com/slorber))
- `docusaurus-theme-common`
  - [#10728](https://github.com/facebook/docusaurus/pull/10728) refactor(theme-common): change storageUtils useSyncExternalCode getSnapshot workaround ([@slorber](https://github.com/slorber))

#### Committers: 14

- Alvin Bryan ([@alvinometric](https://github.com/alvinometric))
- Hichem Fantar ([@hichemfantar](https://github.com/hichemfantar))
- Ivan Cheban ([@ivancheban](https://github.com/ivancheban))
- Jake Boone ([@jakeboone02](https://github.com/jakeboone02))
- Jan Aukema ([@janaukema](https://github.com/janaukema))
- Lehoczky Zoltán ([@Lehoczky](https://github.com/Lehoczky))
- Lin Huang ([@codimiracle](https://github.com/codimiracle))
- Pierre Millot ([@millotp](https://github.com/millotp))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Taylor Reece ([@taylorreece](https://github.com/taylorreece))
- Waldir Pimenta ([@waldyrious](https://github.com/waldyrious))
- William Black ([@WillBlack403](https://github.com/WillBlack403))
- Zed Spencer-Milnes ([@GingerGeek](https://github.com/GingerGeek))
- Zen ([@effozen](https://github.com/effozen))

## 3.6.3 (2024-11-22)

#### :bug: Bug Fix

- `docusaurus`
  - [#10712](https://github.com/facebook/docusaurus/pull/10712) fix(core): disable Rspack incremental in dev ([@slorber](https://github.com/slorber))

#### Committers: 1

- Sébastien Lorber ([@slorber](https://github.com/slorber))

## 3.6.2 (2024-11-19)

#### :bug: Bug Fix

- `docusaurus-module-type-aliases`
  - [#10693](https://github.com/facebook/docusaurus/pull/10693) fix(types): add missing ambiant TS declarations for .md / .mdx partials ([@slorber](https://github.com/slorber))
- `docusaurus-theme-translations`
  - [#10688](https://github.com/facebook/docusaurus/pull/10688) fix(theme-translation): add and update Japanese translations ([@Ryoga-exe](https://github.com/Ryoga-exe))
- `docusaurus`
  - [#10685](https://github.com/facebook/docusaurus/pull/10685) fix(cli): `docusaurus --help` should print plugin commands using `extendCli()` ([@slorber](https://github.com/slorber))
- `docusaurus-bundler`
  - [#10680](https://github.com/facebook/docusaurus/pull/10680) fix(bundler): allow CSS nesting by default, restore postcss-preset-env ([@slorber](https://github.com/slorber))
- `create-docusaurus`
  - [#10676](https://github.com/facebook/docusaurus/pull/10676) fix(create-docusaurus): add ts exclude to TS init template ([@slorber](https://github.com/slorber))
- `docusaurus-bundler`, `docusaurus-faster`, `docusaurus`
  - [#10648](https://github.com/facebook/docusaurus/pull/10648) fix(faster): Upgrade to Rspack 1.1.1, fix build progress bar display ([@slorber](https://github.com/slorber))

#### :wrench: Maintenance

- [#10691](https://github.com/facebook/docusaurus/pull/10691) chore(ci): retry `yarn install` to ignore temporary network errors ([@slorber](https://github.com/slorber))

#### Committers: 5

- Junior_Gx ([@goffxnca](https://github.com/goffxnca))
- Kyle Tsang ([@kyletsang](https://github.com/kyletsang))
- Ryoga ([@Ryoga-exe](https://github.com/Ryoga-exe))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Zwyx ([@Zwyx](https://github.com/Zwyx))

## 3.6.1 (2024-11-08)

#### :bug: Bug Fix

- `docusaurus`
  - [#10658](https://github.com/facebook/docusaurus/pull/10658) fix(core): bundler should not minimize static assets ([@slorber](https://github.com/slorber))
- `docusaurus-bundler`, `docusaurus-faster`, `docusaurus-utils-common`, `docusaurus-utils`
  - [#10649](https://github.com/facebook/docusaurus/pull/10649) fix(faster,utils): fix faster/types peerDependencies ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-bundler`, `docusaurus-types`, `docusaurus`
  - [#10655](https://github.com/facebook/docusaurus/pull/10655) refactor(faster,bundler,core): improve js loader DX ([@slorber](https://github.com/slorber))

#### :memo: Documentation

- [#10657](https://github.com/facebook/docusaurus/pull/10657) docs: fix old base ts config ref ([@slorber](https://github.com/slorber))

#### :wrench: Maintenance

- `docusaurus-mdx-loader`
  - [#10651](https://github.com/facebook/docusaurus/pull/10651) refactor(mdx-loader): streamline typescript usage for remark plugin types ([@lebalz](https://github.com/lebalz))
- Other
  - [#10650](https://github.com/facebook/docusaurus/pull/10650) chore: Argos screenshot dogfooding test pages ([@slorber](https://github.com/slorber))

#### Committers: 2

- Balthasar Hofer ([@lebalz](https://github.com/lebalz))
- Sébastien Lorber ([@slorber](https://github.com/slorber))

## 3.6.0 (2024-11-04)

#### :rocket: New Feature

- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`
  - [#10586](https://github.com/facebook/docusaurus/pull/10586) feat(blog): Add `frontMatter.title_meta` to override title for SEO ([@ilg-ul](https://github.com/ilg-ul))
- `docusaurus`
  - [#10600](https://github.com/facebook/docusaurus/pull/10600) feat(cli): build/deploy should allow multiple `--locale` options ([@slorber](https://github.com/slorber))
- `docusaurus-logger`
  - [#10590](https://github.com/facebook/docusaurus/pull/10590) feat(core): add Node.js memory perf logging ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-rsdoctor`
  - [#10588](https://github.com/facebook/docusaurus/pull/10588) feat: new Rsdoctor official plugin ([@slorber](https://github.com/slorber))
- `docusaurus-bundler`, `docusaurus-faster`, `docusaurus-theme-classic`, `docusaurus`
  - [#10402](https://github.com/facebook/docusaurus/pull/10402) feat(core): Replace Webpack with Rspack - `siteConfig.future.experimental_faster.rspackBundler` ([@slorber](https://github.com/slorber))
- `docusaurus-bundler`, `docusaurus-faster`, `docusaurus-types`, `docusaurus`
  - [#10554](https://github.com/facebook/docusaurus/pull/10554) feat(core): faster HTML minimizer - `siteConfig.future.experimental_faster.swcHtmlMinimizer` ([@slorber](https://github.com/slorber))
  - [#10522](https://github.com/facebook/docusaurus/pull/10522) feat(core): faster CSS minimizer - `siteConfig.future.experimental_faster.lightningCssMinimizer` ([@slorber](https://github.com/slorber))
- `docusaurus-theme-mermaid`
  - [#10510](https://github.com/facebook/docusaurus/pull/10510) feat(theme-mermaid): support Mermaid 11+ including new types of diagrams ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-types`, `docusaurus`
  - [#10479](https://github.com/facebook/docusaurus/pull/10479) feat(core, mdx-loader): deduplicate MDX compilation - `siteConfig.future.experimental_faster.mdxCrossCompilerCache` ([@slorber](https://github.com/slorber))
- `docusaurus-faster`, `docusaurus-types`, `docusaurus`
  - [#10441](https://github.com/facebook/docusaurus/pull/10441) feat(core): faster JS minimizer - `siteConfig.future.experimental_faster.swcJsMinimizer` ([@slorber](https://github.com/slorber))
- `docusaurus-faster`, `docusaurus-plugin-content-docs`, `docusaurus-types`, `docusaurus`
  - [#10435](https://github.com/facebook/docusaurus/pull/10435) feat(core): faster transpiler option - `siteConfig.future.experimental_faster.swcJsLoader` ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-bundler`, `docusaurus`
  - [#10632](https://github.com/facebook/docusaurus/pull/10632) fix(core): restore Rspack ProgressBar colors ([@slorber](https://github.com/slorber))
  - [#10581](https://github.com/facebook/docusaurus/pull/10581) fix(core): fix handling of Swc html minifier warnings ([@slorber](https://github.com/slorber))
  - [#10573](https://github.com/facebook/docusaurus/pull/10573) fix(core): move @docusaurus/faster to bundler peerDeps ([@slorber](https://github.com/slorber))
- `docusaurus-bundler`
  - [#10617](https://github.com/facebook/docusaurus/pull/10617) fix(faster): allow Rspack + babel-loader ([@slorber](https://github.com/slorber))
  - [#10614](https://github.com/facebook/docusaurus/pull/10614) fix(faster): fix error message typo + add color ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#10618](https://github.com/facebook/docusaurus/pull/10618) fix(theme): Restore former globalThis.Prism ([@slorber](https://github.com/slorber))
  - [#10585](https://github.com/facebook/docusaurus/pull/10585) fix(theme): light & dark mode checkbox doesn't announce state switches ([@andrewasche](https://github.com/andrewasche))
  - [#10439](https://github.com/facebook/docusaurus/pull/10439) fix(theme): upgrade infima, fix footer link width bug ([@slorber](https://github.com/slorber))
- `docusaurus-faster`
  - [#10616](https://github.com/facebook/docusaurus/pull/10616) fix(faster): add missing tslib dependency ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#10611](https://github.com/facebook/docusaurus/pull/10611) fix(core): fix DOCUSAURUS_CURRENT_LOCALE = 'undefined' ([@slorber](https://github.com/slorber))
  - [#10423](https://github.com/facebook/docusaurus/pull/10423) fix(core): always use hash for CSS module class names ([@slorber](https://github.com/slorber))
- `docusaurus-bundler`, `docusaurus-faster`
  - [#10605](https://github.com/facebook/docusaurus/pull/10605) fix(core): Use proper swc loader options ([@slorber](https://github.com/slorber))
- `docusaurus-theme-translations`
  - [#10551](https://github.com/facebook/docusaurus/pull/10551) fix(translations): complete missing slovenian theme translations ([@patik123](https://github.com/patik123))
  - [#10507](https://github.com/facebook/docusaurus/pull/10507) fix(theme-translations): add missing Vietnamese translations ([@namnguyenthanhwork](https://github.com/namnguyenthanhwork))
  - [#10413](https://github.com/facebook/docusaurus/pull/10413) fix(translations): fix Spanish translation for "breadcrumbs" ([@TheMineWay](https://github.com/TheMineWay))
- `docusaurus-mdx-loader`
  - [#10553](https://github.com/facebook/docusaurus/pull/10553) fix(mdx-loader): fix cross-compiler cache randomly loading mdx with client/server envs ([@slorber](https://github.com/slorber))
- `docusaurus-tsconfig`
  - [#10547](https://github.com/facebook/docusaurus/pull/10547) fix(tsconfig): add `@docusaurus/tsconfig` target es2022 ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`
  - [#10424](https://github.com/facebook/docusaurus/pull/10424) fix(blog): normalize inline authors socials ([@OzakIOne](https://github.com/OzakIOne))
  - [#10440](https://github.com/facebook/docusaurus/pull/10440) fix(blog): apply baseUrl to relative image in blog authors ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-translations`
  - [#10431](https://github.com/facebook/docusaurus/pull/10431) fix(blog): authors count incorrectly rendered ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-types`, `docusaurus`
  - [#10420](https://github.com/facebook/docusaurus/pull/10420) fix(types): fix type of PluginModule ([@slorber](https://github.com/slorber))

#### :running_woman: Performance

- `docusaurus-bundler`, `docusaurus-faster`
  - [#10605](https://github.com/facebook/docusaurus/pull/10605) fix(core): Use proper swc loader options ([@slorber](https://github.com/slorber))
- Other
  - [#10601](https://github.com/facebook/docusaurus/pull/10601) perf(ci): Add CI checks to prevent memory, build-time and build-size regressions ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#10599](https://github.com/facebook/docusaurus/pull/10599) fix(core): fix i18n sites SSG memory leak - require.cache ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`
  - [#10470](https://github.com/facebook/docusaurus/pull/10470) refactor(mdx-loader): re-export metadata module instead of serializing it ([@slorber](https://github.com/slorber))
  - [#10457](https://github.com/facebook/docusaurus/pull/10457) refactor(mdx-loader): read metadata from memory (loaded content) instead of fs ([@slorber](https://github.com/slorber))

#### :memo: Documentation

- Other
  - [#10631](https://github.com/facebook/docusaurus/pull/10631) docs: fix frontMatter.mdx.format docs ([@slorber](https://github.com/slorber))
  - [#10630](https://github.com/facebook/docusaurus/pull/10630) docs: Add missing API ref docs for Docusaurus Faster options ([@slorber](https://github.com/slorber))
  - [#10592](https://github.com/facebook/docusaurus/pull/10592) docs: resource add docusaurus-i18n ([@moonrailgun](https://github.com/moonrailgun))
  - [#10535](https://github.com/facebook/docusaurus/pull/10535) docs: add tip about harmless vulnerabilities ([@ilg-ul](https://github.com/ilg-ul))
  - [#10545](https://github.com/facebook/docusaurus/pull/10545) docs: clarify component naming for markdown import ([@jackrabbit128](https://github.com/jackrabbit128))
  - [#10416](https://github.com/facebook/docusaurus/pull/10416) docs: corrected typo in search.mdx ([@B0r1sD](https://github.com/B0r1sD))
  - [#10405](https://github.com/facebook/docusaurus/pull/10405) docs(website): small spellfix on 3.5 update notes ([@Zenahr](https://github.com/Zenahr))
- `create-docusaurus`
  - [#10608](https://github.com/facebook/docusaurus/pull/10608) docs: mention config/sidebars run in Node.js runtime ([@slorber](https://github.com/slorber))

#### :robot: Dependencies

- Other
  - [#10623](https://github.com/facebook/docusaurus/pull/10623) chore(deps): bump actions/setup-node from 4.0.4 to 4.1.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#10624](https://github.com/facebook/docusaurus/pull/10624) chore(deps): bump actions/dependency-review-action from 4.3.4 to 4.4.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#10539](https://github.com/facebook/docusaurus/pull/10539) chore(deps): bump preactjs/compressed-size-action from 2.6.0 to 2.7.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#10530](https://github.com/facebook/docusaurus/pull/10530) chore(deps): bump rollup from 2.79.1 to 2.79.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#10518](https://github.com/facebook/docusaurus/pull/10518) chore(deps): bump actions/setup-node from 4.0.2 to 4.0.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#10505](https://github.com/facebook/docusaurus/pull/10505) chore(deps): bump dompurify from 3.0.5 to 3.1.6 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#10488](https://github.com/facebook/docusaurus/pull/10488) chore(deps): bump express from 4.19.2 to 4.20.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#10449](https://github.com/facebook/docusaurus/pull/10449) chore(deps): bump github/codeql-action from 3.26.3 to 3.26.5 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#10444](https://github.com/facebook/docusaurus/pull/10444) chore(deps): bump micromatch from 4.0.5 to 4.0.8 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#10425](https://github.com/facebook/docusaurus/pull/10425) chore(deps): bump github/codeql-action from 3.26.0 to 3.26.3 ([@dependabot[bot]](https://github.com/apps/dependabot))
- `docusaurus-plugin-pwa`
  - [#10455](https://github.com/facebook/docusaurus/pull/10455) chore(deps): bump webpack from 5.88.1 to 5.94.0 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### :wrench: Maintenance

- Other
  - [#10612](https://github.com/facebook/docusaurus/pull/10612) chore: fix canary version prefix ([@slorber](https://github.com/slorber))
  - [#10438](https://github.com/facebook/docusaurus/pull/10438) chore(ci): fix setup-node, use LTS by default ([@slorber](https://github.com/slorber))
  - [#10418](https://github.com/facebook/docusaurus/pull/10418) chore(website): add Rsdoctor plugin ([@slorber](https://github.com/slorber))
- `docusaurus-babel`, `docusaurus-bundler`, `docusaurus-mdx-loader`, `docusaurus-plugin-debug`, `docusaurus-plugin-pwa`, `docusaurus-plugin-rsdoctor`, `docusaurus-theme-live-codeblock`, `docusaurus`
  - [#10610](https://github.com/facebook/docusaurus/pull/10610) chore: upgrade minor dependencies ([@slorber](https://github.com/slorber))
- `docusaurus-bundler`, `docusaurus-faster`
  - [#10609](https://github.com/facebook/docusaurus/pull/10609) chore: upgrade faster packages ([@slorber](https://github.com/slorber))
- `docusaurus-bundler`, `docusaurus-logger`, `docusaurus-types`, `docusaurus`
  - [#10593](https://github.com/facebook/docusaurus/pull/10593) refactor(core): refactor SSG infrastructure ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#10587](https://github.com/facebook/docusaurus/pull/10587) refactor(core): replace serve-handler fork by official deps ([@slorber](https://github.com/slorber))
  - [#10579](https://github.com/facebook/docusaurus/pull/10579) refactor(core): remove useless Webpack wait plugin ([@slorber](https://github.com/slorber))
  - [#10485](https://github.com/facebook/docusaurus/pull/10485) refactor(core): rewrite Webpack ChunkAssetPlugin with RuntimeModule ([@slorber](https://github.com/slorber))
  - [#10448](https://github.com/facebook/docusaurus/pull/10448) refactor(core): Restore null-loader ([@slorber](https://github.com/slorber))
  - [#10442](https://github.com/facebook/docusaurus/pull/10442) fix(core): use serve-handler fork to remove annoying punycode warning ([@slorber](https://github.com/slorber))
  - [#10410](https://github.com/facebook/docusaurus/pull/10410) refactor(core): remove useless build forceTerminate exit ([@slorber](https://github.com/slorber))
- `docusaurus-bundler`, `docusaurus-plugin-pwa`, `docusaurus-types`, `docusaurus`
  - [#10548](https://github.com/facebook/docusaurus/pull/10548) chore: upgrade Webpack to 5.95 and related deps ([@slorber](https://github.com/slorber))
- `create-docusaurus`
  - [#10514](https://github.com/facebook/docusaurus/pull/10514) refactor: remove babel.config.js from init templates + website ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-babel`, `docusaurus-bundler`, `docusaurus-mdx-loader`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-translations`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#10511](https://github.com/facebook/docusaurus/pull/10511) refactor: create `@docusaurus/bundler` and `@docusaurus/babel` packages ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-mermaid`, `docusaurus-utils`, `docusaurus`, `eslint-plugin`
  - [#10509](https://github.com/facebook/docusaurus/pull/10509) chore: Rename Twitter links/labels to X ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-types`, `docusaurus`
  - [#10497](https://github.com/facebook/docusaurus/pull/10497) refactor(core): prepare codebase for swappable bundler ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-utils`
  - [#10486](https://github.com/facebook/docusaurus/pull/10486) chore: upgrade to TS 5.6 + temporarily use skipLibCheck for TS 5.6 ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-logger`, `docusaurus-theme-translations`, `docusaurus`
  - [#10480](https://github.com/facebook/docusaurus/pull/10480) refactor: move PerfLogger from core to @docusaurus/logger ([@slorber](https://github.com/slorber))
- `docusaurus-remark-plugin-npm2yarn`
  - [#10454](https://github.com/facebook/docusaurus/pull/10454) chore: upgrade npm-to-yarn to v3 ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus`
  - [#10450](https://github.com/facebook/docusaurus/pull/10450) refactor(mdx-loader): refactor mdx-loader, expose loader creation utils ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-utils`, `docusaurus`
  - [#10429](https://github.com/facebook/docusaurus/pull/10429) refactor(core): improve handling of server bundle ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`
  - [#10422](https://github.com/facebook/docusaurus/pull/10422) refactor(mdx-loader): remove useless usage of mdx loader this.query ([@slorber](https://github.com/slorber))

#### Committers: 19

- Andrew Asche ([@andrewasche](https://github.com/andrewasche))
- Boris Depoortere ([@B0r1sD](https://github.com/B0r1sD))
- Chris Cho ([@ccho-mongodb](https://github.com/ccho-mongodb))
- Flix ([@flixyudh](https://github.com/flixyudh))
- Joel Campos ([@TheMineWay](https://github.com/TheMineWay))
- Kamil Moskała ([@moskalakamil](https://github.com/moskalakamil))
- Kenrick ([@kenrick95](https://github.com/kenrick95))
- Liviu Ionescu ([@ilg-ul](https://github.com/ilg-ul))
- Nguyễn Thành Nam ([@namnguyenthanhwork](https://github.com/namnguyenthanhwork))
- Patrick ([@patik123](https://github.com/patik123))
- Raghav ([@raghav2005](https://github.com/raghav2005))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Zenahr Barzani ([@Zenahr](https://github.com/Zenahr))
- [@Olexandr88](https://github.com/Olexandr88)
- [@Radovenchyk](https://github.com/Radovenchyk)
- [@jackrabbit128](https://github.com/jackrabbit128)
- [@k-seltzer](https://github.com/k-seltzer)
- moonrailgun ([@moonrailgun](https://github.com/moonrailgun))
- ozaki ([@OzakIOne](https://github.com/OzakIOne))

## 3.5.2 (2024-08-13)

#### :bug: Bug Fix

- `docusaurus-theme-common`
  - [#10397](https://github.com/facebook/docusaurus/pull/10397) fix(theme-common): restore useContextualSearchFilters public API for retrocompatibility ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#10391](https://github.com/facebook/docusaurus/pull/10391) fix(core): always alias React/ReactDOM to site dependency so that importing MDX from anywhere works ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-plugin-content-blog`
  - [#10392](https://github.com/facebook/docusaurus/pull/10392) fix(create-docusaurus): Improve init templates blog setup + fix warnings ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#10390](https://github.com/facebook/docusaurus/pull/10390) fix(theme): Adjust blog authors line height to show descenders in lowercase letters (`g`, `j`, `p`, `q`, and `y`) ([@josh-wong](https://github.com/josh-wong))

#### :nail_care: Polish

- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-translations`
  - [#10394](https://github.com/facebook/docusaurus/pull/10394) fix(translations): change casing of some en labels ([@cstangerup](https://github.com/cstangerup))

#### :memo: Documentation

- [#10393](https://github.com/facebook/docusaurus/pull/10393) docs(showcase): remove sites not using Docusaurus anymore ([@GatienBoquet](https://github.com/GatienBoquet))

#### :robot: Dependencies

- [#10396](https://github.com/facebook/docusaurus/pull/10396) chore(deps): bump github/codeql-action from 3.25.13 to 3.26.0 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 4

- Christian Stangerup ([@cstangerup](https://github.com/cstangerup))
- Gatien Boquet ([@GatienBoquet](https://github.com/GatienBoquet))
- Josh Wong ([@josh-wong](https://github.com/josh-wong))
- Sébastien Lorber ([@slorber](https://github.com/slorber))

## 3.5.1 (2024-08-09)

#### :bug: Bug Fix

- `docusaurus-plugin-content-blog`, `docusaurus-theme-search-algolia`
  - [#10384](https://github.com/facebook/docusaurus/pull/10384) fix(core): algolia context import ([@slorber](https://github.com/slorber))
- `docusaurus-theme-search-algolia`
  - [#10382](https://github.com/facebook/docusaurus/pull/10382) fix(theme-algolia): useDocusaurusContext import error ([@anaclumos](https://github.com/anaclumos))

#### Committers: 2

- Sunghyun Cho ([@anaclumos](https://github.com/anaclumos))
- Sébastien Lorber ([@slorber](https://github.com/slorber))

## 3.5.0 (2024-08-09)

#### :rocket: New Feature

- `docusaurus-plugin-content-blog`
  - [#10375](https://github.com/facebook/docusaurus/pull/10375) feat(blog): add `onUntruncatedBlogPosts` blog options ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-translations`
  - [#10376](https://github.com/facebook/docusaurus/pull/10376) feat(theme): show unlisted/draft banners in dev mode ([@OzakIOne](https://github.com/OzakIOne))
- `create-docusaurus`, `docusaurus-plugin-content-blog`
  - [#9252](https://github.com/facebook/docusaurus/pull/9252) feat(blog): add feed xlst options to render beautiful RSS and Atom feeds ([@Xebec19](https://github.com/Xebec19))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-translations`, `docusaurus-utils`
  - [#10216](https://github.com/facebook/docusaurus/pull/10216) feat(blog): authors page ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-theme-translations`
  - [#10339](https://github.com/facebook/docusaurus/pull/10339) feat(translation): add Estonian default translation ([@chirbard](https://github.com/chirbard))
  - [#10325](https://github.com/facebook/docusaurus/pull/10325) feat(translations): Indonesian translation ([@priyadi](https://github.com/priyadi))
- `docusaurus-mdx-loader`
  - [#10335](https://github.com/facebook/docusaurus/pull/10335) feat(mdx-loader): wrap mdx content title (`# Title`) in `<header>` for concistency ([@OzakIOne](https://github.com/OzakIOne))
- `create-docusaurus`, `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`, `docusaurus-utils`
  - [#10222](https://github.com/facebook/docusaurus/pull/10222) feat(blog): author header social icons ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-google-tag-manager`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-plugin-vercel-analytics`, `docusaurus-types`, `docusaurus`
  - [#10286](https://github.com/facebook/docusaurus/pull/10286) feat(core): allow plugins to self-disable by returning null ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#10252](https://github.com/facebook/docusaurus/pull/10252) feat(blog): group sidebar items by year (`themeConfig.blog.sidebar.groupByYear`) ([@alicelovescake](https://github.com/alicelovescake))
- `docusaurus-plugin-content-blog`, `docusaurus-utils`
  - [#10224](https://github.com/facebook/docusaurus/pull/10224) feat(blog): warn duplicate and inline authors ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-utils-validation`
  - [#10241](https://github.com/facebook/docusaurus/pull/10241) feat(mdx): support recma plugins ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-theme-translations`
  - [#10344](https://github.com/facebook/docusaurus/pull/10344) fix(translations): fix wrong Estonian (et) translations and typos ([@Gekd](https://github.com/Gekd))
  - [#10360](https://github.com/facebook/docusaurus/pull/10360) fix(translations): Fix and Improve Spanish translations ([@sergioalmela](https://github.com/sergioalmela))
  - [#10235](https://github.com/facebook/docusaurus/pull/10235) fix(theme-translation): add missing German (de) theme.admonition translations ([@franzd1](https://github.com/franzd1))
- `docusaurus-theme-search-algolia`
  - [#10342](https://github.com/facebook/docusaurus/pull/10342) fix(search): fix algolia search ignore ctrl + F in search input ([@mxschmitt](https://github.com/mxschmitt))
- `docusaurus-plugin-content-docs`
  - [#10324](https://github.com/facebook/docusaurus/pull/10324) fix(docs): the _category_.json description attribute should display on generated index pages ([@bharateshwq](https://github.com/bharateshwq))
  - [#10309](https://github.com/facebook/docusaurus/pull/10309) fix(theme): docsVersionDropdown navbar item not showing the appropriate version ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus`
  - [#10368](https://github.com/facebook/docusaurus/pull/10368) fix(cli): Fix bad docusaurus CLI behavior on for --version, -V, --help, -h ([@ashiq-firoz](https://github.com/ashiq-firoz))
  - [#10311](https://github.com/facebook/docusaurus/pull/10311) fix(core): revert wrong anchor link implementation change ([@slorber](https://github.com/slorber))
  - [#10239](https://github.com/facebook/docusaurus/pull/10239) fix(core): fail fast if plugin has no name ([@slorber](https://github.com/slorber))
  - [#10225](https://github.com/facebook/docusaurus/pull/10225) fix(core): fix sites unable to start/build without a static dir ([@slorber](https://github.com/slorber))
  - [#10223](https://github.com/facebook/docusaurus/pull/10223) fix: escape period ([@d4nyll](https://github.com/d4nyll))
- `docusaurus-theme-classic`
  - [#10288](https://github.com/facebook/docusaurus/pull/10288) fix(theme): fix DocsVersionDropdownNavbarItem version link target ([@slorber](https://github.com/slorber))
  - [#10219](https://github.com/facebook/docusaurus/pull/10219) fix(theme): ignored className attribute on lazy loaded TabItem ([@lebalz](https://github.com/lebalz))
- `docusaurus-utils`
  - [#10240](https://github.com/facebook/docusaurus/pull/10240) fix(markdown): mdx-code-block should support intentation ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-theme-translations`
  - [#10257](https://github.com/facebook/docusaurus/pull/10257) chore(theme-translations): add more Traditional Chinese(zh-Hant) translations ([@pjchender](https://github.com/pjchender))

#### :memo: Documentation

- Other
  - [#10361](https://github.com/facebook/docusaurus/pull/10361) docs: rename @getcanary/docusaurus-pagefind in docs ([@yujonglee](https://github.com/yujonglee))
  - [#10345](https://github.com/facebook/docusaurus/pull/10345) docs: Add @getcanary/docusaurus-pagefind in docs ([@yujonglee](https://github.com/yujonglee))
  - [#10337](https://github.com/facebook/docusaurus/pull/10337) docs: fix default value for `docRootComponent` ([@ultimate](https://github.com/ultimate))
  - [#10310](https://github.com/facebook/docusaurus/pull/10310) docs: remove deprecated partial toc warning ([@slorber](https://github.com/slorber))
  - [#10245](https://github.com/facebook/docusaurus/pull/10245) docs: add emoji for consistency ([@Paneedah](https://github.com/Paneedah))
  - [#10180](https://github.com/facebook/docusaurus/pull/10180) docs: backport #10173 to v3.3 + v3.4 & revise the content ([@tats-u](https://github.com/tats-u))
  - [#10233](https://github.com/facebook/docusaurus/pull/10233) docs(search): update docsearch api url ([@dhayab](https://github.com/dhayab))
- `docusaurus-plugin-google-gtag`
  - [#10338](https://github.com/facebook/docusaurus/pull/10338) docs(plugin-google-gtag): replace the broken Google Developers links with valid ones ([@bohyunjung](https://github.com/bohyunjung))

#### :robot: Dependencies

- [#10330](https://github.com/facebook/docusaurus/pull/10330) chore(deps): bump github/codeql-action from 3.25.12 to 3.25.13 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10299](https://github.com/facebook/docusaurus/pull/10299) chore(deps): bump actions/dependency-review-action from 4.3.3 to 4.3.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10300](https://github.com/facebook/docusaurus/pull/10300) chore(deps): bump github/codeql-action from 3.25.11 to 3.25.12 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10259](https://github.com/facebook/docusaurus/pull/10259) chore(deps): bump github/codeql-action from 3.25.10 to 3.25.11 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10247](https://github.com/facebook/docusaurus/pull/10247) chore(deps): bump treosh/lighthouse-ci-action from 11.4.0 to 12.1.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10226](https://github.com/facebook/docusaurus/pull/10226) chore(deps): bump github/codeql-action from 3.25.8 to 3.25.10 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10227](https://github.com/facebook/docusaurus/pull/10227) chore(deps): bump ws from 7.5.9 to 7.5.10 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10210](https://github.com/facebook/docusaurus/pull/10210) chore(deps): bump braces from 3.0.2 to 3.0.3 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10209](https://github.com/facebook/docusaurus/pull/10209) chore(deps): bump actions/dependency-review-action from 4.3.2 to 4.3.3 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10208](https://github.com/facebook/docusaurus/pull/10208) chore(deps): bump github/codeql-action from 3.25.7 to 3.25.8 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10195](https://github.com/facebook/docusaurus/pull/10195) chore(deps): bump github/codeql-action from 3.25.6 to 3.25.7 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### :wrench: Maintenance

- Other
  - [#10369](https://github.com/facebook/docusaurus/pull/10369) feat(ci): continuous releases for main and PRs with pkg.pr.new ([@Aslemammad](https://github.com/Aslemammad))
- `docusaurus-theme-classic`
  - [#10343](https://github.com/facebook/docusaurus/pull/10343) chore(deps): update infima npm dependency to version 0.2.0-alpha.44 ([@hichemfantar](https://github.com/hichemfantar))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`
  - [#10316](https://github.com/facebook/docusaurus/pull/10316) refactor(docs): theme-common shouldn't depend on docs content ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#10313](https://github.com/facebook/docusaurus/pull/10313) refactor(blog): theme-common shouldn't depend on blog content plugins ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-cssnano-preset`, `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-google-tag-manager`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-plugin-vercel-analytics`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-mermaid`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `eslint-plugin`, `lqip-loader`, `stylelint-copyright`
  - [#10256](https://github.com/facebook/docusaurus/pull/10256) chore: simplify TypeScript configs, use TS 5.5 configDir placeholder ([@slorber](https://github.com/slorber))

#### Committers: 25

- Aaron Chen ([@pjchender](https://github.com/pjchender))
- Alice Zhao ([@alicelovescake](https://github.com/alicelovescake))
- Ashiq Firoz ([@ashiq-firoz](https://github.com/ashiq-firoz))
- Balthasar Hofer ([@lebalz](https://github.com/lebalz))
- Bharatesh ([@bharateshwq](https://github.com/bharateshwq))
- Daniel Li ([@d4nyll](https://github.com/d4nyll))
- Dhaya ([@dhayab](https://github.com/dhayab))
- Hichem Fantar ([@hichemfantar](https://github.com/hichemfantar))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Julian V ([@ultimate](https://github.com/ultimate))
- Markus Tamm ([@chirbard](https://github.com/chirbard))
- Max Schmitt ([@mxschmitt](https://github.com/mxschmitt))
- Mohammad Bagher Abiyat ([@Aslemammad](https://github.com/Aslemammad))
- Paneedah ([@Paneedah](https://github.com/Paneedah))
- Priyadi Iman Nurcahyo ([@priyadi](https://github.com/priyadi))
- Robin Otter ([@Gekd](https://github.com/Gekd))
- Rohan Thakur ([@Xebec19](https://github.com/Xebec19))
- Sergio ([@sergioalmela](https://github.com/sergioalmela))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tatsunori Uchino ([@tats-u](https://github.com/tats-u))
- [@franzd1](https://github.com/franzd1)
- ozaki ([@OzakIOne](https://github.com/OzakIOne))
- yujonglee ([@yujonglee](https://github.com/yujonglee))
- 정보현 Bohyun Jung ([@bohyunjung](https://github.com/bohyunjung))

## 3.4.0 (2024-05-31)

#### :rocket: New Feature

- `create-docusaurus`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-utils-validation`, `docusaurus-utils`
  - [#10137](https://github.com/facebook/docusaurus/pull/10137) feat(docs, blog): add support for `tags.yml`, predefined list of tags ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-theme-translations`
  - [#10151](https://github.com/facebook/docusaurus/pull/10151) feat(theme-translations): Added Turkmen (tk) default theme translations ([@ilmedova](https://github.com/ilmedova))
  - [#10111](https://github.com/facebook/docusaurus/pull/10111) feat(theme-translations): Add Bulgarian default theme translations (bg) ([@PetarMc1](https://github.com/PetarMc1))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#9859](https://github.com/facebook/docusaurus/pull/9859) feat(core): hash router option - browse site offline (experimental) ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus`
  - [#10121](https://github.com/facebook/docusaurus/pull/10121) feat(core): site storage config options (experimental) ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-utils`
  - [#10185](https://github.com/facebook/docusaurus/pull/10185) fix(docs, blog): Markdown link resolution does not support hot reload ([@slorber](https://github.com/slorber))
- `docusaurus-theme-search-algolia`
  - [#10178](https://github.com/facebook/docusaurus/pull/10178) fix(theme): SearchPage should respect `contextualSearch: false` setting ([@ncoughlin](https://github.com/ncoughlin))
  - [#10164](https://github.com/facebook/docusaurus/pull/10164) fix(search): fix algolia search container bug ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-utils`
  - [#10168](https://github.com/facebook/docusaurus/pull/10168) fix(mdx-loader): resolve Markdown/MDX links with Remark instead of RegExp ([@slorber](https://github.com/slorber))
- `docusaurus-theme-translations`
  - [#10165](https://github.com/facebook/docusaurus/pull/10165) fix(theme-translation): add missing Korean (ko) theme translations ([@revi](https://github.com/revi))
  - [#10157](https://github.com/facebook/docusaurus/pull/10157) fix(theme-translations): complete Vietnamese theme translations ([@namnguyenthanhwork](https://github.com/namnguyenthanhwork))
- `docusaurus`
  - [#10145](https://github.com/facebook/docusaurus/pull/10145) fix(core): fix serve workaround regexp ([@slorber](https://github.com/slorber))
  - [#10142](https://github.com/facebook/docusaurus/pull/10142) fix(core): fix `docusaurus serve` broken for assets when using trailingSlash ([@slorber](https://github.com/slorber))
  - [#10130](https://github.com/facebook/docusaurus/pull/10130) fix(core): the broken anchor checker should not be sensitive pathname trailing slashes ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#10144](https://github.com/facebook/docusaurus/pull/10144) fix(theme): fix announcement bar layout shift due to missing storage key namespace ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus`
  - [#10132](https://github.com/facebook/docusaurus/pull/10132) fix(core): `configurePostCss()` should run after `configureWebpack()` ([@slorber](https://github.com/slorber))
- `docusaurus-utils`, `docusaurus`
  - [#10131](https://github.com/facebook/docusaurus/pull/10131) fix(core): codegen should generate unique route prop filenames ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-translations`
  - [#10118](https://github.com/facebook/docusaurus/pull/10118) fix(theme-translations): fix missing pluralization for label DocCard.categoryDescription.plurals ([@slorber](https://github.com/slorber))

#### :memo: Documentation

- [#10176](https://github.com/facebook/docusaurus/pull/10176) docs: add community plugin docusaurus-graph ([@Arsero](https://github.com/Arsero))
- [#10173](https://github.com/facebook/docusaurus/pull/10173) docs: improve how to use `<details>` ([@tats-u](https://github.com/tats-u))
- [#10167](https://github.com/facebook/docusaurus/pull/10167) docs: suggest using `{<...>...</...>}` if don't use Markdown in migra… ([@tats-u](https://github.com/tats-u))
- [#10143](https://github.com/facebook/docusaurus/pull/10143) docs: recommend users to remove hast-util-is-element in migration to v3 ([@tats-u](https://github.com/tats-u))
- [#10124](https://github.com/facebook/docusaurus/pull/10124) docs: v3 prepare your site blog post should point users to the upgrade guide ([@homotechsual](https://github.com/homotechsual))

#### :robot: Dependencies

- [#10155](https://github.com/facebook/docusaurus/pull/10155) chore(deps): bump peaceiris/actions-gh-pages from 3 to 4 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10154](https://github.com/facebook/docusaurus/pull/10154) chore(deps): bump github/codeql-action from 2.13.4 to 3.25.6 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10112](https://github.com/facebook/docusaurus/pull/10112) chore(deps): bump actions/dependency-review-action from 4.3.1 to 4.3.2 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 11

- Azzedine E. ([@Arsero](https://github.com/Arsero))
- CodeDoctor ([@CodeDoctorDE](https://github.com/CodeDoctorDE))
- Mahri Ilmedova ([@ilmedova](https://github.com/ilmedova))
- Mikey O'Toole ([@homotechsual](https://github.com/homotechsual))
- Nguyễn Thành Nam ([@namnguyenthanhwork](https://github.com/namnguyenthanhwork))
- Nick Coughlin ([@ncoughlin](https://github.com/ncoughlin))
- Petar_mc ([@PetarMc1](https://github.com/PetarMc1))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tatsunori Uchino ([@tats-u](https://github.com/tats-u))
- Yongmin ([@revi](https://github.com/revi))
- ozaki ([@OzakIOne](https://github.com/OzakIOne))

## 3.3.2 (2024-05-03)

#### :bug: Bug Fix

- `docusaurus-module-type-aliases`, `docusaurus`
  - [#10103](https://github.com/facebook/docusaurus/pull/10103) fix(core): do not recreate ReactDOM Root, fix React warning on hot reload ([@slorber](https://github.com/slorber))

#### Committers: 1

- Sébastien Lorber ([@slorber](https://github.com/slorber))

## 3.3.1 (2024-05-03)

Failed release

## 3.3.0 (2024-05-03)

#### :rocket: New Feature

- `docusaurus-plugin-sitemap`
  - [#10083](https://github.com/facebook/docusaurus/pull/10083) feat: add createSitemapItems hook ([@johnnyreilly](https://github.com/johnnyreilly))
- `docusaurus-mdx-loader`, `docusaurus-types`, `docusaurus`
  - [#10064](https://github.com/facebook/docusaurus/pull/10064) feat(core): add new site config option `siteConfig.markdown.anchors.maintainCase` ([@iAdramelk](https://github.com/iAdramelk))
- `docusaurus`
  - [#9767](https://github.com/facebook/docusaurus/pull/9767) feat(cli): docusaurus deploy should support a --target-dir option ([@SandPod](https://github.com/SandPod))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-types`, `docusaurus`
  - [#10042](https://github.com/facebook/docusaurus/pull/10042) feat(core): simplify plugin API, support route.props ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#10032](https://github.com/facebook/docusaurus/pull/10032) feat(pages): add LastUpdateAuthor & LastUpdateTime & editUrl ([@OzakIOne](https://github.com/OzakIOne))

#### :bug: Bug Fix

- `docusaurus-cssnano-preset`, `docusaurus-utils`, `docusaurus`
  - [#10092](https://github.com/facebook/docusaurus/pull/10092) chore: Upgrade svgr / svgo / cssnano ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#10091](https://github.com/facebook/docusaurus/pull/10091) fix(theme): `<Tabs>` props should allow overriding defaults ([@gagdiez](https://github.com/gagdiez))
  - [#10080](https://github.com/facebook/docusaurus/pull/10080) fix(theme): `<Admonition>` should render properly without heading/icon ([@andrmaz](https://github.com/andrmaz))
- `docusaurus`
  - [#10090](https://github.com/facebook/docusaurus/pull/10090) fix(core): `docusaurus serve` redirects should include the site `/baseUrl/` prefix ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus`
  - [#10079](https://github.com/facebook/docusaurus/pull/10079) fix: handle React v18.3 warnings ([@slorber](https://github.com/slorber))
- `docusaurus-theme-translations`
  - [#10070](https://github.com/facebook/docusaurus/pull/10070) fix(theme-translations): add missing theme translations for pt-BR ([@h3nr1ke](https://github.com/h3nr1ke))
  - [#10051](https://github.com/facebook/docusaurus/pull/10051) fix(theme-translations): correct label for tip admonition in italian ([@tomsotte](https://github.com/tomsotte))
- `docusaurus-theme-search-algolia`
  - [#10048](https://github.com/facebook/docusaurus/pull/10048) fix(algolia): add insights property on Algolia Theme Config object TS definition ([@Virgil993](https://github.com/Virgil993))
- `docusaurus-plugin-content-docs`, `docusaurus`
  - [#10054](https://github.com/facebook/docusaurus/pull/10054) fix(core): sortRoutes shouldn't have a default baseUrl value, this led to a bug ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`
  - [#10025](https://github.com/facebook/docusaurus/pull/10025) fix(docs): sidebar item label impact the pagination label of docs ([@Abdullah-03](https://github.com/Abdullah-03))
- `docusaurus-utils`
  - [#10022](https://github.com/facebook/docusaurus/pull/10022) fix(utils): getFileCommitDate should support `log.showSignature=true` ([@slorber](https://github.com/slorber))

#### :running_woman: Performance

- `docusaurus`
  - [#10060](https://github.com/facebook/docusaurus/pull/10060) refactor(core): optimize App entrypoint, it should not re-render when navigating ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#10061](https://github.com/facebook/docusaurus/pull/10061) refactor(theme): simplify CSS solution to solve empty search container ([@slorber](https://github.com/slorber))
- `docusaurus-theme-common`
  - [#10023](https://github.com/facebook/docusaurus/pull/10023) refactor(website): refactor showcase components ([@slorber](https://github.com/slorber))

#### :memo: Documentation

- [#10096](https://github.com/facebook/docusaurus/pull/10096) docs: Fix `déja` to `déjà` in `swizzling.mdx` ([@Zwyx](https://github.com/Zwyx))
- [#10093](https://github.com/facebook/docusaurus/pull/10093) docs: Fix dead Typesense links ([@kaihoffman](https://github.com/kaihoffman))
- [#10085](https://github.com/facebook/docusaurus/pull/10085) docs: make `ThemedImage` example work out of the box ([@lebalz](https://github.com/lebalz))
- [#10082](https://github.com/facebook/docusaurus/pull/10082) docs: add note regarding ts extension for config file. ([@homotechsual](https://github.com/homotechsual))
- [#9490](https://github.com/facebook/docusaurus/pull/9490) docs: add troubleshooting steps to migration/upgrade page ([@homotechsual](https://github.com/homotechsual))
- [#10056](https://github.com/facebook/docusaurus/pull/10056) docs(search): Algolia troubleshooting section for index configuration problems ([@slorber](https://github.com/slorber))
- [#10039](https://github.com/facebook/docusaurus/pull/10039) docs: visit is a named export of unist-util-visit ([@pearmini](https://github.com/pearmini))
- [#10020](https://github.com/facebook/docusaurus/pull/10020) docs: Fix wrong path example ([@tomy0000000](https://github.com/tomy0000000))
- [#10011](https://github.com/facebook/docusaurus/pull/10011) docs: add stormkit as deployment platform ([@eldemcan](https://github.com/eldemcan))

#### :robot: Dependencies

- [#10097](https://github.com/facebook/docusaurus/pull/10097) chore(deps): bump ejs from 3.1.9 to 3.1.10 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10089](https://github.com/facebook/docusaurus/pull/10089) chore(deps): bump actions/dependency-review-action from 4.2.5 to 4.3.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10088](https://github.com/facebook/docusaurus/pull/10088) chore(deps): bump preactjs/compressed-size-action from 2.5.0 to 2.6.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#10034](https://github.com/facebook/docusaurus/pull/10034) chore(deps): bump semver from 7.3.4 to 7.6.0 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### :wrench: Maintenance

- `create-docusaurus`, `docusaurus-cssnano-preset`, `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-google-tag-manager`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-plugin-vercel-analytics`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-mermaid`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `eslint-plugin`, `lqip-loader`, `stylelint-copyright`
  - [#10065](https://github.com/facebook/docusaurus/pull/10065) refactor: extract base TS client config + upgrade TS + refactor TS setup ([@slorber](https://github.com/slorber))
- Other
  - [#10063](https://github.com/facebook/docusaurus/pull/10063) test(e2e): TypeCheck website/starter in min/max range of TS versions ([@slorber](https://github.com/slorber))
  - [#10049](https://github.com/facebook/docusaurus/pull/10049) fix(website): fix website manifest.json name "Docusaurus v2" to just "Docusaurus" ([@volcanofr](https://github.com/volcanofr))

#### Committers: 20

- Abdullah Saud ([@Abdullah-03](https://github.com/Abdullah-03))
- Alexander Sandor ([@SandPod](https://github.com/SandPod))
- Alexey Ivanov ([@iAdramelk](https://github.com/iAdramelk))
- Andrea Mazzucchelli ([@andrmaz](https://github.com/andrmaz))
- Bairui Su ([@pearmini](https://github.com/pearmini))
- Balthasar Hofer ([@lebalz](https://github.com/lebalz))
- Can Eldem ([@eldemcan](https://github.com/eldemcan))
- Daniel Li ([@d4nyll](https://github.com/d4nyll))
- Guille ([@gagdiez](https://github.com/gagdiez))
- H3NR1KE ([@h3nr1ke](https://github.com/h3nr1ke))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Kai Hoffman ([@kaihoffman](https://github.com/kaihoffman))
- Mikey O'Toole ([@homotechsual](https://github.com/homotechsual))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tommaso Sotte ([@tomsotte](https://github.com/tomsotte))
- Tomy Hsieh ([@tomy0000000](https://github.com/tomy0000000))
- Zwyx ([@Zwyx](https://github.com/Zwyx))
- [@Virgil993](https://github.com/Virgil993)
- [@volcanofr](https://github.com/volcanofr)
- ozaki ([@OzakIOne](https://github.com/OzakIOne))

## 3.2.1 (2024-04-04)

#### :bug: Bug Fix

- `docusaurus`
  - [#10012](https://github.com/facebook/docusaurus/pull/10012) fix(core): fix configurePostCss v3.2 regression ([@slorber](https://github.com/slorber))

#### :memo: Documentation

- [#9980](https://github.com/facebook/docusaurus/pull/9980) docs: remove old github action description ([@OzakIOne](https://github.com/OzakIOne))
- [#10014](https://github.com/facebook/docusaurus/pull/10014) docs(website): fix SEO docs headTags example ([@OzakIOne](https://github.com/OzakIOne))
- [#10004](https://github.com/facebook/docusaurus/pull/10004) docs(website): Announce v3.2 on website/homepage ([@slorber](https://github.com/slorber))

#### :robot: Dependencies

- [#10006](https://github.com/facebook/docusaurus/pull/10006) chore(deps): bump actions/dependency-review-action from 4.2.4 to 4.2.5 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 2

- Sébastien Lorber ([@slorber](https://github.com/slorber))
- ozaki ([@OzakIOne](https://github.com/OzakIOne))

## 3.2.0 (2024-03-29)

#### :rocket: New Feature

- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-sitemap`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#9954](https://github.com/facebook/docusaurus/pull/9954) feat(sitemap): add support for "lastmod" ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils-validation`, `docusaurus-utils`
  - [#9912](https://github.com/facebook/docusaurus/pull/9912) feat(blog): add LastUpdateAuthor & LastUpdateTime ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-plugin-debug`, `docusaurus-types`, `docusaurus`
  - [#9931](https://github.com/facebook/docusaurus/pull/9931) feat(core): add new plugin allContentLoaded lifecycle ([@slorber](https://github.com/slorber))
- `docusaurus-theme-translations`
  - [#9928](https://github.com/facebook/docusaurus/pull/9928) feat(theme-translations) Icelandic (is) ([@Hallinn](https://github.com/Hallinn))
- `docusaurus-plugin-content-blog`
  - [#9886](https://github.com/facebook/docusaurus/pull/9886) feat(blog): allow processing blog posts through a processBlogPosts function ([@OzakIOne](https://github.com/OzakIOne))
  - [#9838](https://github.com/facebook/docusaurus/pull/9838) feat(blog): add blog pageBasePath plugin option ([@ilg-ul](https://github.com/ilg-ul))
- `docusaurus`
  - [#9681](https://github.com/facebook/docusaurus/pull/9681) feat(swizzle): ask user preferred language if no language CLI option provided ([@yixiaojiu](https://github.com/yixiaojiu))
- `create-docusaurus`, `docusaurus-utils`
  - [#9442](https://github.com/facebook/docusaurus/pull/9442) feat(create-docusaurus): ask user for preferred language when no language CLI option provided ([@Rafael-Martins](https://github.com/Rafael-Martins))
- `docusaurus-plugin-vercel-analytics`
  - [#9687](https://github.com/facebook/docusaurus/pull/9687) feat(plugin-vercel-analytics): add new vercel analytics plugin ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-mdx-loader`
  - [#9684](https://github.com/facebook/docusaurus/pull/9684) feat(mdx-loader): the table-of-contents should display toc/headings of imported MDX partials ([@anatolykopyl](https://github.com/anatolykopyl))

#### :bug: Bug Fix

- `docusaurus-mdx-loader`
  - [#9999](https://github.com/facebook/docusaurus/pull/9999) fix(mdx-loader): Ignore contentTitle coming after Markdown thematicBreak ([@slorber](https://github.com/slorber))
- `docusaurus-theme-search-algolia`
  - [#9945](https://github.com/facebook/docusaurus/pull/9945) fix(a11y): move focus algolia-search focus back to search input on Escape ([@mxschmitt](https://github.com/mxschmitt))
- `docusaurus-plugin-content-blog`
  - [#9920](https://github.com/facebook/docusaurus/pull/9920) fix(blog): apply trailing slash to blog feed ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-theme-classic`
  - [#9944](https://github.com/facebook/docusaurus/pull/9944) fix(theme): improve a11y of DocSidebarItemCategory expand/collapsed button ([@mxschmitt](https://github.com/mxschmitt))
- `docusaurus-theme-translations`
  - [#9915](https://github.com/facebook/docusaurus/pull/9915) fix(theme-translations): complete and modify Japanese translations ([@Suenaga-Ryuya](https://github.com/Suenaga-Ryuya))
  - [#9910](https://github.com/facebook/docusaurus/pull/9910) fix(theme-translations): add Japanese translations ([@Suenaga-Ryuya](https://github.com/Suenaga-Ryuya))
  - [#9872](https://github.com/facebook/docusaurus/pull/9872) fix(theme-translations): complete and improve Spanish theme translations ([@4troDev](https://github.com/4troDev))
  - [#9812](https://github.com/facebook/docusaurus/pull/9812) fix(i18n): add missing theme translations for fa locale ([@VahidNaderi](https://github.com/VahidNaderi))
- `docusaurus-utils`
  - [#9897](https://github.com/facebook/docusaurus/pull/9897) fix(mdx-loader): mdx-code-block should support CRLF ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#9878](https://github.com/facebook/docusaurus/pull/9878) fix(core): fix default i18n calendar used, infer it from locale if possible ([@slorber](https://github.com/slorber))
  - [#9852](https://github.com/facebook/docusaurus/pull/9852) fix(core): ensure core error boundary is able to render theme layout ([@slorber](https://github.com/slorber))
- `docusaurus-remark-plugin-npm2yarn`
  - [#9861](https://github.com/facebook/docusaurus/pull/9861) fix(remark-npm2yarn): update npm-to-yarn from 2.0.0 to 2.2.1, fix pnpm extra args syntax ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-theme-classic`, `docusaurus-theme-translations`
  - [#9851](https://github.com/facebook/docusaurus/pull/9851) fix(theme-classic): should use plurals for category items description ([@baradusov](https://github.com/baradusov))

#### :running_woman: Performance

- `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#9975](https://github.com/facebook/docusaurus/pull/9975) refactor(core): improve dev perf, fine-grained site reloads - part 3 ([@slorber](https://github.com/slorber))
- `docusaurus-types`, `docusaurus`
  - [#9968](https://github.com/facebook/docusaurus/pull/9968) refactor(core): improve dev perf, fine-grained site reloads - part2 ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-types`, `docusaurus`
  - [#9903](https://github.com/facebook/docusaurus/pull/9903) refactor(core): improve dev perf, fine-grained site reloads - part1 ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-utils`
  - [#9890](https://github.com/facebook/docusaurus/pull/9890) perf: optimize getFileCommitDate, make it async ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#9798](https://github.com/facebook/docusaurus/pull/9798) refactor(core): internalize, simplify and optimize the SSG logic ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#9868](https://github.com/facebook/docusaurus/pull/9868) refactor(theme): dates should be formatted on the client-side instead of in nodejs code ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`
  - [#9669](https://github.com/facebook/docusaurus/pull/9669) refactor(theme): use JSON-LD instead of microdata for blog structured data ([@johnnyreilly](https://github.com/johnnyreilly))
- `docusaurus-plugin-content-docs`
  - [#9839](https://github.com/facebook/docusaurus/pull/9839) refactor(blog): improve doc global data hook error message + add doc warning to blogOnly mode ([@OzakIOne](https://github.com/OzakIOne))

#### :memo: Documentation

- [#9937](https://github.com/facebook/docusaurus/pull/9937) docs: use official GitHub Action to deploy to GitHub Pages ([@vlad-nestorov](https://github.com/vlad-nestorov))
- [#9971](https://github.com/facebook/docusaurus/pull/9971) docs: replace VuePress by VitePress on tool comparison section ([@sunkanmii](https://github.com/sunkanmii))
- [#9914](https://github.com/facebook/docusaurus/pull/9914) docs: update legacy MDX v1 links to markdown links ([@OzakIOne](https://github.com/OzakIOne))
- [#9913](https://github.com/facebook/docusaurus/pull/9913) docs: update legacy MDX v1 links to markdown links ([@OzakIOne](https://github.com/OzakIOne))
- [#9906](https://github.com/facebook/docusaurus/pull/9906) docs: emphasize "index slug" convention ([@Josh-Cena](https://github.com/Josh-Cena))
- [#9877](https://github.com/facebook/docusaurus/pull/9877) docs: fix typos in deployment.mdx ([@Oreoxmt](https://github.com/Oreoxmt))
- [#9845](https://github.com/facebook/docusaurus/pull/9845) docs: typo ([@OzakIOne](https://github.com/OzakIOne))
- [#9816](https://github.com/facebook/docusaurus/pull/9816) docs: Add docs for Mermaid Component ([@Its-Just-Nans](https://github.com/Its-Just-Nans))

#### :robot: Dependencies

- [#9981](https://github.com/facebook/docusaurus/pull/9981) chore(deps): bump actions/dependency-review-action from 4.1.3 to 4.2.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#9982](https://github.com/facebook/docusaurus/pull/9982) chore(deps): bump katex from 0.16.8 to 0.16.10 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#9983](https://github.com/facebook/docusaurus/pull/9983) chore(deps): bump express from 4.18.2 to 4.19.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#9977](https://github.com/facebook/docusaurus/pull/9977) chore(deps): bump webpack-dev-middleware from 5.3.3 to 5.3.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#9958](https://github.com/facebook/docusaurus/pull/9958) chore(deps): bump follow-redirects from 1.15.4 to 1.15.6 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#9892](https://github.com/facebook/docusaurus/pull/9892) chore(deps): bump actions/dependency-review-action from 4.1.2 to 4.1.3 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#9869](https://github.com/facebook/docusaurus/pull/9869) chore(deps): bump actions/dependency-review-action from 4.0.0 to 4.1.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#9874](https://github.com/facebook/docusaurus/pull/9874) chore(deps): bump ip from 2.0.0 to 2.0.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#9843](https://github.com/facebook/docusaurus/pull/9843) chore(deps): bump actions/setup-node from 4.0.1 to 4.0.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#9824](https://github.com/facebook/docusaurus/pull/9824) chore(deps): bump treosh/lighthouse-ci-action from 10.1.0 to 11.4.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#9823](https://github.com/facebook/docusaurus/pull/9823) chore(deps): bump marocchino/sticky-pull-request-comment from 2.8.0 to 2.9.0 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### :wrench: Maintenance

- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-docs`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#9972](https://github.com/facebook/docusaurus/pull/9972) refactor(utils): remove duplicated function ([@OzakIOne](https://github.com/OzakIOne))
- Other
  - [#9965](https://github.com/facebook/docusaurus/pull/9965) refactor(website): organise blog posts by year ([@GingerGeek](https://github.com/GingerGeek))
  - [#9865](https://github.com/facebook/docusaurus/pull/9865) chore(website): update @crowdin/crowdin-api-client ([@chris-bateman](https://github.com/chris-bateman))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils`
  - [#9963](https://github.com/facebook/docusaurus/pull/9963) refactor(docs,blog): last update timestamp should be in milliseconds instead of seconds ([@slorber](https://github.com/slorber))

#### Committers: 22

- Aolin ([@Oreoxmt](https://github.com/Oreoxmt))
- Anatoly Kopyl ([@anatolykopyl](https://github.com/anatolykopyl))
- Chris Bateman ([@chris-bateman](https://github.com/chris-bateman))
- Fafowora Sunkanmi ([@sunkanmii](https://github.com/sunkanmii))
- Hallbjörn Magnússon ([@Hallinn](https://github.com/Hallinn))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Josue [4tro] A ([@4troDev](https://github.com/4troDev))
- Liviu Ionescu ([@ilg-ul](https://github.com/ilg-ul))
- Max Schmitt ([@mxschmitt](https://github.com/mxschmitt))
- Rafael Martins ([@Rafael-Martins](https://github.com/Rafael-Martins))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Vahid Naderi ([@VahidNaderi](https://github.com/VahidNaderi))
- Vlad Nestorov ([@vlad-nestorov](https://github.com/vlad-nestorov))
- Zed Spencer-Milnes ([@GingerGeek](https://github.com/GingerGeek))
- axel7083 ([@axel7083](https://github.com/axel7083))
- krinza.eth ([@kaymomin](https://github.com/kaymomin))
- n4n5 ([@Its-Just-Nans](https://github.com/Its-Just-Nans))
- ozaki ([@OzakIOne](https://github.com/OzakIOne))
- suenryu ([@Suenaga-Ryuya](https://github.com/Suenaga-Ryuya))
- Нуриль Барадусов ([@baradusov](https://github.com/baradusov))
- 翊小久 ([@yixiaojiu](https://github.com/yixiaojiu))

## 3.1.1 (2024-01-26)

#### :bug: Bug Fix

- `docusaurus-types`, `docusaurus`
  - [#9791](https://github.com/facebook/docusaurus/pull/9791) fix(core): broken links optimization behaves differently than non-optimized logic ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#9788](https://github.com/facebook/docusaurus/pull/9788) fix(core): links with target "\_blank" should no be checked by the broken link checker ([@slorber](https://github.com/slorber))
  - [#9407](https://github.com/facebook/docusaurus/pull/9407) fix(core): conditionally include `hostname` parameter when using… ([@jack-robson](https://github.com/jack-robson))
- `docusaurus-utils`
  - [#9776](https://github.com/facebook/docusaurus/pull/9776) fix(mdx-loader): allow spaces before `mdx-code-block` info string ([@eitsupi](https://github.com/eitsupi))
- `create-docusaurus`
  - [#9783](https://github.com/facebook/docusaurus/pull/9783) fix(create-docusaurus): fix typo in init template sample docs ([@dawei-wang](https://github.com/dawei-wang))
- `docusaurus-theme-common`
  - [#9727](https://github.com/facebook/docusaurus/pull/9727) fix(theme-common): fix missing code block MagicComments style in Visual Basic (.NET) 16 ([@tats-u](https://github.com/tats-u))
- `docusaurus-theme-classic`, `docusaurus-theme-mermaid`
  - [#9733](https://github.com/facebook/docusaurus/pull/9733) fix: remove old useless mdx typedefs ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils`, `docusaurus`
  - [#9732](https://github.com/facebook/docusaurus/pull/9732) fix(core): various broken anchor link fixes ([@slorber](https://github.com/slorber))

#### :running_woman: Performance

- `docusaurus`
  - [#9778](https://github.com/facebook/docusaurus/pull/9778) perf(core): optimize broken links checker ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#9470](https://github.com/facebook/docusaurus/pull/9470) polish(theme): MDX images should use async decoding ([@sanjaiyan-dev](https://github.com/sanjaiyan-dev))

#### Committers: 6

- Jack Robson ([@jack-robson](https://github.com/jack-robson))
- Sanjaiyan Parthipan ([@sanjaiyan-dev](https://github.com/sanjaiyan-dev))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tatsunori Uchino ([@tats-u](https://github.com/tats-u))
- [@dawei-wang](https://github.com/dawei-wang)
- [@eitsupi](https://github.com/eitsupi)

## 3.1.0 (2024-01-05)

#### :rocket: New Feature

- `docusaurus-mdx-loader`, `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#9528](https://github.com/facebook/docusaurus/pull/9528) feat(core): make broken link checker detect broken anchors - add `onBrokenAnchors` config ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-mdx-loader`, `docusaurus-types`, `docusaurus`
  - [#9674](https://github.com/facebook/docusaurus/pull/9674) feat(mdx-loader): add support for siteConfig.markdown.remarkRehypeOptions ([@slorber](https://github.com/slorber))
- `docusaurus-theme-common`
  - [#9671](https://github.com/facebook/docusaurus/pull/9671) feat(theme-common): code block MagicComments support for (Visual) Basic/Batch/Fortran/COBOL/ML ([@tats-u](https://github.com/tats-u))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#9624](https://github.com/facebook/docusaurus/pull/9624) feat: siteConfig.markdown.parseFrontMatter hook ([@slorber](https://github.com/slorber))
- `docusaurus-utils`
  - [#9610](https://github.com/facebook/docusaurus/pull/9610) feat(core): enable port configuration via environment variable ([@OzakIOne](https://github.com/OzakIOne))

#### :bug: Bug Fix

- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#9704](https://github.com/facebook/docusaurus/pull/9704) fix(theme): allow empty code blocks and live playgrounds ([@slorber](https://github.com/slorber))
- `create-docusaurus`
  - [#9696](https://github.com/facebook/docusaurus/pull/9696) fix(create-docusaurus): fix init template code blocks, and little improvements ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-pwa`
  - [#9668](https://github.com/facebook/docusaurus/pull/9668) fix(pwa-plugin): upgrade workbox ([@SimenB](https://github.com/SimenB))
- `docusaurus`
  - [#9648](https://github.com/facebook/docusaurus/pull/9648) fix(cli): output help when no conventional config + no subcommand ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-live-codeblock`
  - [#9631](https://github.com/facebook/docusaurus/pull/9631) fix(live-codeblock): stabilize react-live transformCode callback, fix editor/preview desync ([@slorber](https://github.com/slorber))
- `docusaurus-utils`
  - [#9617](https://github.com/facebook/docusaurus/pull/9617) fix(utils): Markdown link replacement with <> but no spaces ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`
  - [#9612](https://github.com/facebook/docusaurus/pull/9612) fix(type-aliases): add `title` prop for imported inline SVG React components ([@axmmisaka](https://github.com/axmmisaka))
- `docusaurus-plugin-content-blog`
  - [#9581](https://github.com/facebook/docusaurus/pull/9581) fix(content-blog): add baseUrl for author.image_url ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-theme-translations`
  - [#9477](https://github.com/facebook/docusaurus/pull/9477) fix(i18n): complete translations for theme-common.json Brazilian Portuguese (pt-BR) ([@c0h1b4](https://github.com/c0h1b4))

#### :nail_care: Polish

- `docusaurus-theme-common`
  - [#9335](https://github.com/facebook/docusaurus/pull/9335) refactor(theme-common): allow optional desktopBreakpoint param in useWindowSize ([@jgarrow](https://github.com/jgarrow))

#### :wrench: Maintenance

- `docusaurus-theme-search-algolia`
  - [#9604](https://github.com/facebook/docusaurus/pull/9604) chore: add lint autofix CI job ([@slorber](https://github.com/slorber))

#### Committers: 8

- Janessa Garrow ([@jgarrow](https://github.com/jgarrow))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Simen Bekkhus ([@SimenB](https://github.com/SimenB))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tatsunori Uchino ([@tats-u](https://github.com/tats-u))
- [@c0h1b4](https://github.com/c0h1b4)
- axmmisaka ([@axmmisaka](https://github.com/axmmisaka))
- ozaki ([@OzakIOne](https://github.com/OzakIOne))

## 3.0.1 (2023-11-30)

#### :bug: Bug Fix

- `docusaurus-utils`
  - [#9570](https://github.com/facebook/docusaurus/pull/9570) fix: add v2 retrocompatible support for quoted admonitions ([@slorber](https://github.com/slorber))
  - [#9535](https://github.com/facebook/docusaurus/pull/9535) fix: v3 admonitions should support v2 title syntax for nested admonitions ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#9567](https://github.com/facebook/docusaurus/pull/9567) fix(theme): upgrade prism-react-renderer, fix html script and style tag highlighting ([@slorber](https://github.com/slorber))
- `docusaurus-theme-common`
  - [#9531](https://github.com/facebook/docusaurus/pull/9531) fix(theme): docs html sidebar items should always be visible ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#9530](https://github.com/facebook/docusaurus/pull/9530) fix(theme): fix firefox CSS :has() support bug ([@slorber](https://github.com/slorber))
- `create-docusaurus`
  - [#9487](https://github.com/facebook/docusaurus/pull/9487) fix(create-docusaurus): fix readme docusaurus 2 ref ([@slorber](https://github.com/slorber))

#### :robot: Dependencies

- `docusaurus-plugin-debug`
  - [#9566](https://github.com/facebook/docusaurus/pull/9566) chore(debug-plugin): migrate to a new maintained JSON Viewer ([@mcrstudio](https://github.com/mcrstudio))
- `create-docusaurus`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#9572](https://github.com/facebook/docusaurus/pull/9572) chore: upgrade prism-react-renderer to 2.3.0 to avoid older clsx ([@harryzcy](https://github.com/harryzcy))
  - [#9567](https://github.com/facebook/docusaurus/pull/9567) fix(theme): upgrade prism-react-renderer, fix html script and style tag highlighting ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`
  - [#9464](https://github.com/facebook/docusaurus/pull/9464) chore: Upgrade clsx to 2.0.0 ([@harryzcy](https://github.com/harryzcy))
- `docusaurus`
  - [#9547](https://github.com/facebook/docusaurus/pull/9547) chore(core): replace `wait-on` dependency with custom lighter code ([@NickGerleman](https://github.com/NickGerleman))
- `docusaurus-plugin-pwa`, `docusaurus`
  - [#9529](https://github.com/facebook/docusaurus/pull/9529) chore: ugrade babel dependencies to v7.23.3 ([@reece-white](https://github.com/reece-white))

#### Committers: 6

- Chongyi Zheng ([@harryzcy](https://github.com/harryzcy))
- MCR Studio ([@mcrstudio](https://github.com/mcrstudio))
- Nick Gerleman ([@NickGerleman](https://github.com/NickGerleman))
- Shreesh Nautiyal ([@Shreesh09](https://github.com/Shreesh09))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- [@reece-white](https://github.com/reece-white)

## 3.0.0 (2023-10-31)

#### :boom: Breaking Change

- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`
  - [#9451](https://github.com/facebook/docusaurus/pull/9451) feat(mdx-loader): upgrade to MDX v3 ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-ideal-image`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#9317](https://github.com/facebook/docusaurus/pull/9317) feat(core): support TypeScript + ESM configuration ([@harryzcy](https://github.com/harryzcy))
- `create-docusaurus`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus`
  - [#9316](https://github.com/facebook/docusaurus/pull/9316) chore: upgrade syntax highlighting dependencies, `prism-react-renderer` to v2, `react-live` to v4 ([@harryzcy](https://github.com/harryzcy))
- `create-docusaurus`, `docusaurus-cssnano-preset`, `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-google-tag-manager`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-mermaid`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `eslint-plugin`, `lqip-loader`
  - [#9348](https://github.com/facebook/docusaurus/pull/9348) chore: update node engine version 18 ([@OzakIOne](https://github.com/OzakIOne))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#9310](https://github.com/facebook/docusaurus/pull/9310) chore(plugin-docs): remove legacy versioned prefix on doc ids and sidebar names in versioned sidebars ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-translations`
  - [#9308](https://github.com/facebook/docusaurus/pull/9308) fix(theme): make warning a first-class admonition, and deprecate caution admonition ([@slorber](https://github.com/slorber))
- `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-mermaid`
  - [#9305](https://github.com/facebook/docusaurus/pull/9305) feat(theme-mermaid): upgrade Mermaid to v10.4 - handle async rendering ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-google-tag-manager`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-mermaid`, `docusaurus-theme-search-algolia`, `docusaurus-tsconfig`, `docusaurus`
  - [#9258](https://github.com/facebook/docusaurus/pull/9258) feat: Docusaurus v3 upgrades and require TypeScript 5 ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`
  - [#9189](https://github.com/facebook/docusaurus/pull/9189) feat(blog-plugin): limit option for blog feedOptions ([@johnnyreilly](https://github.com/johnnyreilly))
- `create-docusaurus`, `docusaurus-tsconfig`
  - [#9050](https://github.com/facebook/docusaurus/pull/9050) feat: create official TypeScript base config @docusaurus/tsconfig ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-google-tag-manager`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-mermaid`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus`
  - [#8961](https://github.com/facebook/docusaurus/pull/8961) feat: React 18 + automatic JSX runtime + build --dev ([@slorber](https://github.com/slorber))
- `create-docusaurus`
  - [#9026](https://github.com/facebook/docusaurus/pull/9026) chore: remove facebook template ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-content-blog`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-mermaid`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#8288](https://github.com/facebook/docusaurus/pull/8288) feat: upgrade to MDX v2 ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus`
  - [#7966](https://github.com/facebook/docusaurus/pull/7966) fix(plugin-docs,theme): refactor docs plugin routes and component tree ([@slorber](https://github.com/slorber))

#### :rocket: New Feature

- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`
  - [#9451](https://github.com/facebook/docusaurus/pull/9451) feat(mdx-loader): upgrade to MDX v3 ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-utils`
  - [#9394](https://github.com/facebook/docusaurus/pull/9394) feat(mdx-loader): Remark plugin to report unused MDX / Markdown directives ([@OzakIOne](https://github.com/OzakIOne))
- `create-docusaurus`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-ideal-image`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#9317](https://github.com/facebook/docusaurus/pull/9317) feat(core): support TypeScript + ESM configuration ([@harryzcy](https://github.com/harryzcy))
- `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-mermaid`
  - [#9305](https://github.com/facebook/docusaurus/pull/9305) feat(theme-mermaid): upgrade Mermaid to v10.4 - handle async rendering ([@slorber](https://github.com/slorber))
- `create-docusaurus`
  - [#9241](https://github.com/facebook/docusaurus/pull/9241) feat: support bun package manager in `create-docusaurus` ([@colinhacks](https://github.com/colinhacks))
- `docusaurus-plugin-content-blog`
  - [#9189](https://github.com/facebook/docusaurus/pull/9189) feat(blog-plugin): limit option for blog feedOptions ([@johnnyreilly](https://github.com/johnnyreilly))
- `docusaurus-theme-classic`
  - [#9152](https://github.com/facebook/docusaurus/pull/9152) feat(theme): add support for meta og locale and alternates ([@FlorinaPacurar](https://github.com/FlorinaPacurar))
  - [#9028](https://github.com/facebook/docusaurus/pull/9028) feat(theme): add ability to inject data attributes from query-string - possibility to create an iframe/embed variant of a page ([@slorber](https://github.com/slorber))
  - [#8915](https://github.com/facebook/docusaurus/pull/8915) feat(theme): add queryString option to localeDropdown ([@wceolin](https://github.com/wceolin))
- `docusaurus-plugin-client-redirects`, `docusaurus-utils-validation`
  - [#9171](https://github.com/facebook/docusaurus/pull/9171) feat(client-redirects-plugin): support fully qualified urls and querystring/hash in destination/to url ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#9102](https://github.com/facebook/docusaurus/pull/9102) feat(cli): deploy command should allow customizing git config user.name / user.email in deployment branch (#9101) ([@amdshrif](https://github.com/amdshrif))
- `docusaurus-mdx-loader`, `docusaurus-types`, `docusaurus`
  - [#9097](https://github.com/facebook/docusaurus/pull/9097) feat(mdx): add siteConfig.markdown.format to configure the default content parser (MDX / CommonMark) ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`
  - [#9071](https://github.com/facebook/docusaurus/pull/9071) feat(pages): add support for missing SEO front matter + improve SEO docs ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-tsconfig`
  - [#9050](https://github.com/facebook/docusaurus/pull/9050) feat: create official TypeScript base config @docusaurus/tsconfig ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-google-tag-manager`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-mermaid`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus`
  - [#8961](https://github.com/facebook/docusaurus/pull/8961) feat: React 18 + automatic JSX runtime + build --dev ([@slorber](https://github.com/slorber))
- `docusaurus-theme-common`
  - [#8982](https://github.com/facebook/docusaurus/pull/8982) feat(theme-common): code block MagicComments support for TeX/LaTeX/Matlab ([@jj-style](https://github.com/jj-style))
  - [#8870](https://github.com/facebook/docusaurus/pull/8870) feat(theme-common): code block MagicComments support for Lua/Haskell -- and WebAssembly ;; ([@tarunrajput](https://github.com/tarunrajput))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-content-blog`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-mermaid`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#8288](https://github.com/facebook/docusaurus/pull/8288) feat: upgrade to MDX v2 ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#8890](https://github.com/facebook/docusaurus/pull/8890) feat(theme): create more generic ThemedComponent util from ThemedImage ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `eslint-plugin`
  - [#8384](https://github.com/facebook/docusaurus/pull/8384) feat(eslint-plugin): new prefer-docusaurus-heading rule ([@Devansu-Yadav](https://github.com/Devansu-Yadav))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus`, `eslint-plugin`
  - [#8156](https://github.com/facebook/docusaurus/pull/8156) feat: add eslint plugin no-html-links ([@JohnVicke](https://github.com/JohnVicke))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-translations`, `docusaurus-utils-validation`, `docusaurus-utils`
  - [#8004](https://github.com/facebook/docusaurus/pull/8004) feat(docs,blog,pages): add support for "unlisted" front matter - hide md content in production ([@jodyheavener](https://github.com/jodyheavener))

#### :bug: Bug Fix

- `docusaurus-theme-common`
  - [#9446](https://github.com/facebook/docusaurus/pull/9446) fix(theme): fix useWindowSize React hydration issue ([@slorber](https://github.com/slorber))
  - [#9276](https://github.com/facebook/docusaurus/pull/9276) fix(theme-common): remove useless useSyncExternalStore shim ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`
  - [#9437](https://github.com/facebook/docusaurus/pull/9437) fix(plugin-blog): blog archive should hide unlisted blog posts ([@slorber](https://github.com/slorber))
  - [#9151](https://github.com/facebook/docusaurus/pull/9151) fix(content-blog): links in feed should be absolute ([@VinceCYLiao](https://github.com/VinceCYLiao))
- `docusaurus`
  - [#9387](https://github.com/facebook/docusaurus/pull/9387) fix(core): log missing errorInfo in React 18 onRecoverableError callback ([@johnnyreilly](https://github.com/johnnyreilly))
  - [#9309](https://github.com/facebook/docusaurus/pull/9309) fix(cli): disable vertical borders of the update notification ([@qwerzl](https://github.com/qwerzl))
  - [#9112](https://github.com/facebook/docusaurus/pull/9112) fix(core): throw error if build folder already exists on initial clean ([@thedevwonder](https://github.com/thedevwonder))
  - [#9006](https://github.com/facebook/docusaurus/pull/9006) fix(core): docusaurus CLI should detect the correct yarn version when suggesting upgrades ([@0420syj](https://github.com/0420syj))
  - [#7951](https://github.com/facebook/docusaurus/pull/7951) fix(core): make webpack HMR always listen to current location ([@jeengbe](https://github.com/jeengbe))
- `docusaurus-mdx-loader`
  - [#9386](https://github.com/facebook/docusaurus/pull/9386) fix(mdx-loader): get correct error line numbers, handle front matter + contentTitle with remark ([@slorber](https://github.com/slorber))
  - [#9262](https://github.com/facebook/docusaurus/pull/9262) fix(mdx-loader): improve mdxJsxTextElementToHtml ([@slorber](https://github.com/slorber))
  - [#9202](https://github.com/facebook/docusaurus/pull/9202) fix(mdx-loader): ensure heading anchor slugs respect GitHub emoji behavior ([@yosukekato165](https://github.com/yosukekato165))
  - [#9100](https://github.com/facebook/docusaurus/pull/9100) fix(mdx): fix for html multi-line comments ([@slorber](https://github.com/slorber))
  - [#9091](https://github.com/facebook/docusaurus/pull/9091) fix(mdx-loader): loader error message should display stacktrace if no extra MDX details ([@slorber](https://github.com/slorber))
  - [#8960](https://github.com/facebook/docusaurus/pull/8960) fix: allow html syntax in MDX v2 with format md ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#9385](https://github.com/facebook/docusaurus/pull/9385) fix(theme): avoid rendering empty search container if site has no search plugin ([@slorber](https://github.com/slorber))
  - [#9183](https://github.com/facebook/docusaurus/pull/9183) fix(theme): make Prism code block language / additionalLanguages case insensitive ([@heysujal](https://github.com/heysujal))
  - [#9216](https://github.com/facebook/docusaurus/pull/9216) fix(theme): fix typo in swizzle component config ([@sixhobbits](https://github.com/sixhobbits))
  - [#9093](https://github.com/facebook/docusaurus/pull/9093) fix(theme): support details/summary in CommonMark + add md dogfood test cases ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-utils`
  - [#9369](https://github.com/facebook/docusaurus/pull/9369) fix(mdx-loader): prevent Open Graph images from being inserted as base64 ([@Zwyx](https://github.com/Zwyx))
- `docusaurus-theme-translations`
  - [#9362](https://github.com/facebook/docusaurus/pull/9362) fix(theme-translations): add Japanese translation for "warning" ([@tats-u](https://github.com/tats-u))
  - [#9321](https://github.com/facebook/docusaurus/pull/9321) fix(theme-translations): add missing zh-Hans messages ([@chudongvip](https://github.com/chudongvip))
  - [#9338](https://github.com/facebook/docusaurus/pull/9338) fix(theme-translations): complete and fix hungarian translations ([@la55u](https://github.com/la55u))
  - [#9292](https://github.com/facebook/docusaurus/pull/9292) fix(theme-translations): add missing Spanish theme translations ([@Villanuevand](https://github.com/Villanuevand))
  - [#9021](https://github.com/facebook/docusaurus/pull/9021) fix(theme-transalations): fix Swedish translation of "last updated" ([@gazab](https://github.com/gazab))
- `docusaurus-theme-classic`, `docusaurus-theme-translations`
  - [#9308](https://github.com/facebook/docusaurus/pull/9308) fix(theme): make warning a first-class admonition, and deprecate caution admonition ([@slorber](https://github.com/slorber))
  - [#9269](https://github.com/facebook/docusaurus/pull/9269) fix(theme): improve docs sidebar category caret aria-label accessibility ([@pinakipb2](https://github.com/pinakipb2))
- Other
  - [#9260](https://github.com/facebook/docusaurus/pull/9260) fix(website): fix showcase search input ([@biplavmz](https://github.com/biplavmz))
  - [#8193](https://github.com/facebook/docusaurus/pull/8193) fix(website): mobile scroll on homepage announcement ([@maliMirkec](https://github.com/maliMirkec))
  - [#8042](https://github.com/facebook/docusaurus/pull/8042) fix(website): fix blog post social card ([@slorber](https://github.com/slorber))
- `create-docusaurus`
  - [#9217](https://github.com/facebook/docusaurus/pull/9217) fix(create-docusaurus): increase Browserslist support query in dev ([@slorber](https://github.com/slorber))
- `docusaurus-utils`, `docusaurus`
  - [#9160](https://github.com/facebook/docusaurus/pull/9160) fix(core): handle single quotes inside file paths ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-debug`
  - [#9116](https://github.com/facebook/docusaurus/pull/9116) fix(debug-plugin): upgrade react-json-view to maintained React-18 compatible fork ([@slorber](https://github.com/slorber))
- `docusaurus-utils`
  - [#9046](https://github.com/facebook/docusaurus/pull/9046) fix(utils): better handling of code blocks in link replacement ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#8927](https://github.com/facebook/docusaurus/pull/8927) fix(utils): make Markdown link replacement much more rigorous ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7864](https://github.com/facebook/docusaurus/pull/7864) fix(utils): always match exclusion root dirs as complete folder paths ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7801](https://github.com/facebook/docusaurus/pull/7801) fix(utils): recognize ~~~ as code fences in link replacement ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-pwa`, `docusaurus`
  - [#8872](https://github.com/facebook/docusaurus/pull/8872) fix(core): better error logging on SSR/dev failures + log stacktraces and error causes ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-utils-validation`, `docusaurus`
  - [#8258](https://github.com/facebook/docusaurus/pull/8258) fix(docusaurus-utils-validation): baseUrl + routeBasePath: allow empty string, normalized as "/" ([@Djunnni](https://github.com/Djunnni))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#8319](https://github.com/facebook/docusaurus/pull/8319) fix(docs,theme): auto-generated category index should not display unlisted content ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`
  - [#8015](https://github.com/facebook/docusaurus/pull/8015) fix(live-codeblock): add error boundary to live code preview ([@rashidmya](https://github.com/rashidmya))
- `docusaurus-mdx-loader`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils-validation`, `docusaurus`
  - [#7945](https://github.com/facebook/docusaurus/pull/7945) refactor(theme): split admonitions, make swizzle easier, better retrocompatibility ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus`
  - [#7966](https://github.com/facebook/docusaurus/pull/7966) fix(plugin-docs,theme): refactor docs plugin routes and component tree ([@slorber](https://github.com/slorber))

#### :running_woman: Performance

- `docusaurus`
  - [#9051](https://github.com/facebook/docusaurus/pull/9051) perf(core): use React 18 startTransition for hydration ([@sanjaiyan-dev](https://github.com/sanjaiyan-dev))
  - [#8081](https://github.com/facebook/docusaurus/pull/8081) perf(core): move scripts to document head + defer ([@sanjaiyan-dev](https://github.com/sanjaiyan-dev))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus`
  - [#8972](https://github.com/facebook/docusaurus/pull/8972) fix: remove useless js-loader in front of mdx-loader ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#9438](https://github.com/facebook/docusaurus/pull/9438) refactor(blog-plugin): blog archive reverse ordering of posts ([@slorber](https://github.com/slorber))
  - [#9184](https://github.com/facebook/docusaurus/pull/9184) fix(theme): change schema.org itemType prop urls from http to https ([@thedevwonder](https://github.com/thedevwonder))
- `docusaurus`
  - [#9381](https://github.com/facebook/docusaurus/pull/9381) feat(core): throw error when official docusaurus dependencies use different versions ([@JorensM](https://github.com/JorensM))
- `docusaurus-theme-translations`
  - [#9302](https://github.com/facebook/docusaurus/pull/9302) chore(theme-translations): complete zh-Hant translations ([@qwerzl](https://github.com/qwerzl))
  - [#9025](https://github.com/facebook/docusaurus/pull/9025) chore(theme-translations): complete it translations ([@bitpredator](https://github.com/bitpredator))
- `create-docusaurus`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus`
  - [#9133](https://github.com/facebook/docusaurus/pull/9133) fix(init): change initial site URL to one that is safe for the future ([@tats-u](https://github.com/tats-u))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#8150](https://github.com/facebook/docusaurus/pull/8150) fix(theme-classic): polish admonition details, render title-only admonitions ([@attitude](https://github.com/attitude))
- `docusaurus-plugin-google-gtag`
  - [#8143](https://github.com/facebook/docusaurus/pull/8143) refactor(plugin-gtag): update gtag plugin to modern SPA recommendations ([@lanegoolsby](https://github.com/lanegoolsby))
- `docusaurus-mdx-loader`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils-validation`, `docusaurus`
  - [#7945](https://github.com/facebook/docusaurus/pull/7945) refactor(theme): split admonitions, make swizzle easier, better retrocompatibility ([@slorber](https://github.com/slorber))

#### :memo: Documentation

- Other
  - [#9452](https://github.com/facebook/docusaurus/pull/9452) docs: v3 upgrade guide should mention MDX v1 compat options ([@slorber](https://github.com/slorber))
  - [#9430](https://github.com/facebook/docusaurus/pull/9430) docs: update Kinsta deployment documentation ([@palmiak](https://github.com/palmiak))
  - [#9417](https://github.com/facebook/docusaurus/pull/9417) docs: add Docusaurus v3.0 upgrade guide ([@slorber](https://github.com/slorber))
  - [#9396](https://github.com/facebook/docusaurus/pull/9396) docs: fix typos in website/docs/i18n/i18n-git.mdx ([@suravshrestha](https://github.com/suravshrestha))
  - [#9397](https://github.com/facebook/docusaurus/pull/9397) docs: fix typos in website/docs/migration/migration-manual.mdx ([@suravshrestha](https://github.com/suravshrestha))
  - [#9388](https://github.com/facebook/docusaurus/pull/9388) docs: fix algolia crowler config template link for v3 ([@slorber](https://github.com/slorber))
  - [#9377](https://github.com/facebook/docusaurus/pull/9377) docs(deployment): add permissions config to github action file in v2.4.3 ([@chillinPanda](https://github.com/chillinPanda))
  - [#9333](https://github.com/facebook/docusaurus/pull/9333) docs: "Preparing your site for Docusaurus v3" blog post ([@slorber](https://github.com/slorber))
  - [#9330](https://github.com/facebook/docusaurus/pull/9330) docs: "Upgrading frontend dependencies with confidence" blog post ([@slorber](https://github.com/slorber))
  - [#9288](https://github.com/facebook/docusaurus/pull/9288) docs: fix bad link for create doc ([@forresst](https://github.com/forresst))
  - [#9267](https://github.com/facebook/docusaurus/pull/9267) docs: fix typo in docs-introduction ([@HyeokjinKang](https://github.com/HyeokjinKang))
  - [#9247](https://github.com/facebook/docusaurus/pull/9247) docs: Reword comparison between React authoring and CSS authoring ([@hidde](https://github.com/hidde))
  - [#9223](https://github.com/facebook/docusaurus/pull/9223) docs: fix grammatical error, rewrite sentence to make clearer ([@thatrobotdev](https://github.com/thatrobotdev))
  - [#9233](https://github.com/facebook/docusaurus/pull/9233) docs(website): Add a "clearAll" Feature to site showcase ([@biplavmz](https://github.com/biplavmz))
  - [#9180](https://github.com/facebook/docusaurus/pull/9180) docs: remove 'import type' declaration in javascript snippet ([@oluwatobiss](https://github.com/oluwatobiss))
  - [#9177](https://github.com/facebook/docusaurus/pull/9177) docs: improve the opening sentence's clarity ([@oluwatobiss](https://github.com/oluwatobiss))
  - [#9149](https://github.com/facebook/docusaurus/pull/9149) docs: improve yarn deps upgrade command ([@webbertakken](https://github.com/webbertakken))
  - [#9139](https://github.com/facebook/docusaurus/pull/9139) docs: add Flightcontrol as a deployment option ([@ModupeD](https://github.com/ModupeD))
  - [#9082](https://github.com/facebook/docusaurus/pull/9082) docs: fix themeConfig.prism.defaultLanguage table api ref docs ([@razzeee](https://github.com/razzeee))
  - [#9074](https://github.com/facebook/docusaurus/pull/9074) docs: fix filenames in docs/swizzling.mdx ([@shwaka](https://github.com/shwaka))
  - [#9065](https://github.com/facebook/docusaurus/pull/9065) docs: update link for commonly used languages ([@heysujal](https://github.com/heysujal))
  - [#9055](https://github.com/facebook/docusaurus/pull/9055) docs: update outdated links in showcase ([@manuel-rw](https://github.com/manuel-rw))
  - [#9063](https://github.com/facebook/docusaurus/pull/9063) docs: add @markprompt/docusaurus-theme-search ([@schneegansm](https://github.com/schneegansm))
  - [#9033](https://github.com/facebook/docusaurus/pull/9033) docs: update info for community plugin docusaurus2-graphql-doc-generator ([@edno](https://github.com/edno))
  - [#9044](https://github.com/facebook/docusaurus/pull/9044) docs: fix prism theme broken link in code blocks docs ([@adithyaakrishna](https://github.com/adithyaakrishna))
  - [#9043](https://github.com/facebook/docusaurus/pull/9043) docs: fix grammar typo in swizzling.mdx ([@adampatterson](https://github.com/adampatterson))
  - [#9018](https://github.com/facebook/docusaurus/pull/9018) docs: fix link to rehype ([@Mogyuchi](https://github.com/Mogyuchi))
  - [#8993](https://github.com/facebook/docusaurus/pull/8993) docs: fix broken link in code blocks docs ([@NamanGarg2075](https://github.com/NamanGarg2075))
  - [#8975](https://github.com/facebook/docusaurus/pull/8975) docs: update link in md code blocks section ([@rbarbazz](https://github.com/rbarbazz))
  - [#8976](https://github.com/facebook/docusaurus/pull/8976) docs: update broken links theme configuration page ([@rbarbazz](https://github.com/rbarbazz))
  - [#8904](https://github.com/facebook/docusaurus/pull/8904) docs: fix broken link to Prism includeLangs.js default list of languages ([@conlacda](https://github.com/conlacda))
  - [#8951](https://github.com/facebook/docusaurus/pull/8951) docs: mention equivalent config syntaxes ([@thadguidry](https://github.com/thadguidry))
  - [#8950](https://github.com/facebook/docusaurus/pull/8950) docs: bidirectional link between api config and guide config ([@thadguidry](https://github.com/thadguidry))
  - [#8953](https://github.com/facebook/docusaurus/pull/8953) docs: mention blog truncating marker edge case ([@allyw2002](https://github.com/allyw2002))
  - [#8941](https://github.com/facebook/docusaurus/pull/8941) docs: rewrite some docs for mdx v2 ([@slorber](https://github.com/slorber))
  - [#8943](https://github.com/facebook/docusaurus/pull/8943) docs: mention docusaurus.community site in resources ([@thadguidry](https://github.com/thadguidry))
  - [#8920](https://github.com/facebook/docusaurus/pull/8920) docs: mdx-js is using v2 for next edition ([@jhcao23](https://github.com/jhcao23))
  - [#8888](https://github.com/facebook/docusaurus/pull/8888) docs: improve sidebar items custom props docs ([@slorber](https://github.com/slorber))
  - [#8877](https://github.com/facebook/docusaurus/pull/8877) docs: add "permissions.content: write" to GH workflow examples ([@e-minguez](https://github.com/e-minguez))
  - [#8845](https://github.com/facebook/docusaurus/pull/8845) docs: add description on blog post file/folder naming conventions and date extraction patterns ([@rojakcoder](https://github.com/rojakcoder))
  - [#8865](https://github.com/facebook/docusaurus/pull/8865) docs: correct small grammar error ([@werner33](https://github.com/werner33))
  - [#8830](https://github.com/facebook/docusaurus/pull/8830) docs: link to mermaid config types ([@PaulRBerg](https://github.com/PaulRBerg))
  - [#8804](https://github.com/facebook/docusaurus/pull/8804) docs: update suggestion for OSS meta projects ([@antonk52](https://github.com/antonk52))
  - [#8788](https://github.com/facebook/docusaurus/pull/8788) docs: remove problematic mdx2 anchor id docs for MDX 2 migration ([@slorber](https://github.com/slorber))
  - [#8780](https://github.com/facebook/docusaurus/pull/8780) docs: fix localhost url without link ([@slorber](https://github.com/slorber))
  - [#8779](https://github.com/facebook/docusaurus/pull/8779) docs: v2 docs should discourage the usage of a lower-case MDX component (will not work in v3) ([@slorber](https://github.com/slorber))
  - [#8761](https://github.com/facebook/docusaurus/pull/8761) docs: add mention that themeConfig.footer.copyright supports html strings ([@fxpby](https://github.com/fxpby))
  - [#8723](https://github.com/facebook/docusaurus/pull/8723) docs: add TypeScript playgrounds to docusaurus.new + Playground page ([@slorber](https://github.com/slorber))
  - [#8709](https://github.com/facebook/docusaurus/pull/8709) docs: add dark mode version of BrowserStack logo ([@fredrikstave](https://github.com/fredrikstave))
  - [#8642](https://github.com/facebook/docusaurus/pull/8642) docs: clarify query string behavior ([@homotechsual](https://github.com/homotechsual))
  - [#8576](https://github.com/facebook/docusaurus/pull/8576) docs(playground): use CodeSandbox cloud sandboxes ([@danilowoz](https://github.com/danilowoz))
  - [#8543](https://github.com/facebook/docusaurus/pull/8543) docs: add link to pluralization docs ([@homotechsual](https://github.com/homotechsual))
  - [#8556](https://github.com/facebook/docusaurus/pull/8556) docs: document plugin-content-pages wrapperClassName frontmatter. ([@homotechsual](https://github.com/homotechsual))
  - [#8548](https://github.com/facebook/docusaurus/pull/8548) docs: fix typo 'validationOptions' ([@gracefullight](https://github.com/gracefullight))
  - [#8509](https://github.com/facebook/docusaurus/pull/8509) docs(website): fix broken external links wrongly modified to use the .mdx extension (ex: github README.mdx) ([@Kesyau](https://github.com/Kesyau))
  - [#8507](https://github.com/facebook/docusaurus/pull/8507) docs: blog + community + dogfood docs should use .mdx extension ([@slorber](https://github.com/slorber))
  - [#8490](https://github.com/facebook/docusaurus/pull/8490) docs(website): use .mdx extension for every docs ([@slorber](https://github.com/slorber))
  - [#8484](https://github.com/facebook/docusaurus/pull/8484) docs: `plugin-content-sitemap` -> `plugin-sitemap` ([@chubei](https://github.com/chubei))
  - [#8454](https://github.com/facebook/docusaurus/pull/8454) fix(docs): Update link for tooljet website(broken) ([@shawshankkumar](https://github.com/shawshankkumar))
  - [#8443](https://github.com/facebook/docusaurus/pull/8443) docs: fix website home testimonials broken image URLs ([@abhinandanwadwa](https://github.com/abhinandanwadwa))
  - [#8438](https://github.com/facebook/docusaurus/pull/8438) docs: add hyperlink to swizzling in Search page ([@dandv](https://github.com/dandv))
  - [#8431](https://github.com/facebook/docusaurus/pull/8431) docs: add diagrams page to 2.2.0 sidebar ([@homotechsual](https://github.com/homotechsual))
  - [#8307](https://github.com/facebook/docusaurus/pull/8307) docs: clarify additionalLanguages with custom language definitions. ([@homotechsual](https://github.com/homotechsual))
  - [#8390](https://github.com/facebook/docusaurus/pull/8390) docs: changed actions/checkout version from 2 to 3 ([@cm-igarashi-ryosuke](https://github.com/cm-igarashi-ryosuke))
  - [#8262](https://github.com/facebook/docusaurus/pull/8262) docs: fix links to external plugin description ([@scubamaggo](https://github.com/scubamaggo))
  - [#8375](https://github.com/facebook/docusaurus/pull/8375) docs: add Kinsta to deployment page ([@palmiak](https://github.com/palmiak))
  - [#8417](https://github.com/facebook/docusaurus/pull/8417) docs: document theme-mermaid in API sidebar ([@homotechsual](https://github.com/homotechsual))
  - [#8392](https://github.com/facebook/docusaurus/pull/8392) docs: add i18n guide doc should link to i18n core config doc ([@mcallisto](https://github.com/mcallisto))
  - [#8388](https://github.com/facebook/docusaurus/pull/8388) docs: point to where commit types are listed ([@dandv](https://github.com/dandv))
  - [#8352](https://github.com/facebook/docusaurus/pull/8352) docs: actually demo the zero-width space workaround in MDX ([@waldyrious](https://github.com/waldyrious))
  - [#8363](https://github.com/facebook/docusaurus/pull/8363) docs: fix unclosed admonition code block ([@Zwyx](https://github.com/Zwyx))
  - [#8364](https://github.com/facebook/docusaurus/pull/8364) docs: autogenerated page comment does not matching dirName in examples ([@HumbleDeer](https://github.com/HumbleDeer))
  - [#8359](https://github.com/facebook/docusaurus/pull/8359) docs: fix anchor link `#customFields` ([@Zwyx](https://github.com/Zwyx))
  - [#8320](https://github.com/facebook/docusaurus/pull/8320) docs: remove blog.johnnyreilly.com Google Analytics tag from docs part 2 ([@johnnyreilly](https://github.com/johnnyreilly))
  - [#8335](https://github.com/facebook/docusaurus/pull/8335) docs: use Mermaid diagram for routing page ([@Mysterious-Dev](https://github.com/Mysterious-Dev))
  - [#8313](https://github.com/facebook/docusaurus/pull/8313) docs: link to migration guide from Blogger to Docusaurus / remove blog.johnnyreilly.com Google Analytics tag from docs ([@johnnyreilly](https://github.com/johnnyreilly))
  - [#8292](https://github.com/facebook/docusaurus/pull/8292) docs: document tag types for insertHtmlContent ([@homotechsual](https://github.com/homotechsual))
  - [#8272](https://github.com/facebook/docusaurus/pull/8272) docs: fix mermaid theme options typo ([@ntucker](https://github.com/ntucker))
  - [#8209](https://github.com/facebook/docusaurus/pull/8209) docs: removing community resource docusaurus-plugin-relative-paths ([@ShahriarKh](https://github.com/ShahriarKh))
  - [#8146](https://github.com/facebook/docusaurus/pull/8146) docs(content-docs): add api doc for displayed_sidebar front matter ([@slorber](https://github.com/slorber))
  - [#8115](https://github.com/facebook/docusaurus/pull/8115) docs: add caveat about using Translate in string contexts ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#8053](https://github.com/facebook/docusaurus/pull/8053) docs: document usage of docs `frontMatter.custom_edit_url: null` ([@homotechsual](https://github.com/homotechsual))
  - [#8010](https://github.com/facebook/docusaurus/pull/8010) docs(showcase): add 74 new showcase sites ([@slorber](https://github.com/slorber))
  - [#7955](https://github.com/facebook/docusaurus/pull/7955) docs: add docusaurus-post-generator to community resource list ([@moojing](https://github.com/moojing))
  - [#7906](https://github.com/facebook/docusaurus/pull/7906) docs: add TOC heading level options to guide ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7884](https://github.com/facebook/docusaurus/pull/7884) docs: add baseUrl to example tsconfig ([@Foosballfan](https://github.com/Foosballfan))
  - [#7835](https://github.com/facebook/docusaurus/pull/7835) docs: update workbox doc link ([@hslee2008](https://github.com/hslee2008))
  - [#7799](https://github.com/facebook/docusaurus/pull/7799) docs: formally document how admonitions can be customized ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7796](https://github.com/facebook/docusaurus/pull/7796) docs: modify the description of deploying to Netlify ([@Oreoxmt](https://github.com/Oreoxmt))
- `docusaurus-logger`
  - [#9210](https://github.com/facebook/docusaurus/pull/9210) docs: add the missing import logger statement ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#8047](https://github.com/facebook/docusaurus/pull/8047) docs: improve alt messages ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`
  - [#8944](https://github.com/facebook/docusaurus/pull/8944) polish(create-docusaurus): add comment in config to mention different ways to declare config + doc link ([@thadguidry](https://github.com/thadguidry))
  - [#8323](https://github.com/facebook/docusaurus/pull/8323) docs: fix typo 'internalization' ([@dandv](https://github.com/dandv))
- `docusaurus-plugin-ideal-image`
  - [#8630](https://github.com/facebook/docusaurus/pull/8630) docs: normalize README for ideal-image plugin ([@Mysterious-Dev](https://github.com/Mysterious-Dev))
- `docusaurus-mdx-loader`
  - [#8419](https://github.com/facebook/docusaurus/pull/8419) docs: document siteConfig.markdown + better mdx-loader retrocompat ([@slorber](https://github.com/slorber))

#### :robot: Dependencies

- Other
  - [#9440](https://github.com/facebook/docusaurus/pull/9440) chore(deps): bump actions/setup-node from 3 to 4 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#9441](https://github.com/facebook/docusaurus/pull/9441) chore(deps): bump actions/checkout from 4.1.0 to 4.1.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#9367](https://github.com/facebook/docusaurus/pull/9367) chore(deps): bump postcss from 8.4.26 to 8.4.31 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#9344](https://github.com/facebook/docusaurus/pull/9344) chore(deps): bump actions/checkout from 4.0.0 to 4.1.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#9298](https://github.com/facebook/docusaurus/pull/9298) chore(deps): bump actions/dependency-review-action from 3.0.8 to 3.1.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#9277](https://github.com/facebook/docusaurus/pull/9277) chore(deps): bump actions/checkout from 3 to 4 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#9251](https://github.com/facebook/docusaurus/pull/9251) chore(deps): bump actions/dependency-review-action from 3.0.7 to 3.0.8 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#9250](https://github.com/facebook/docusaurus/pull/9250) chore(deps): bump marocchino/sticky-pull-request-comment from 2.7.0 to 2.8.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#9227](https://github.com/facebook/docusaurus/pull/9227) chore(deps): bump actions/dependency-review-action from 3.0.6 to 3.0.7 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#9174](https://github.com/facebook/docusaurus/pull/9174) chore(deps): bump marocchino/sticky-pull-request-comment from 2.6.2 to 2.7.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#9096](https://github.com/facebook/docusaurus/pull/9096) chore(deps): bump semver from 7.3.8 to 7.5.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#9061](https://github.com/facebook/docusaurus/pull/9061) chore(deps): bump github/codeql-action from 2.3.6 to 2.13.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#9038](https://github.com/facebook/docusaurus/pull/9038) chore(deps): bump github/codeql-action from 2.3.5 to 2.3.6 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#9039](https://github.com/facebook/docusaurus/pull/9039) chore(deps): bump actions/dependency-review-action from 3.0.4 to 3.0.6 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#9019](https://github.com/facebook/docusaurus/pull/9019) chore(deps): bump github/codeql-action from 2.3.3 to 2.3.5 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8964](https://github.com/facebook/docusaurus/pull/8964) chore(deps): bump github/codeql-action from 2.3.2 to 2.3.3 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8955](https://github.com/facebook/docusaurus/pull/8955) chore(deps): bump github/codeql-action from 2.3.0 to 2.3.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8922](https://github.com/facebook/docusaurus/pull/8922) chore(deps): bump marocchino/sticky-pull-request-comment from 2.5.0 to 2.6.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8923](https://github.com/facebook/docusaurus/pull/8923) chore(deps): bump treosh/lighthouse-ci-action from 9.6.8 to 10.1.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8924](https://github.com/facebook/docusaurus/pull/8924) chore(deps): bump github/codeql-action from 2.2.12 to 2.3.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8899](https://github.com/facebook/docusaurus/pull/8899) chore(deps): bump github/codeql-action from 2.2.11 to 2.2.12 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8900](https://github.com/facebook/docusaurus/pull/8900) chore(deps): bump actions/checkout from 3.5.0 to 3.5.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8879](https://github.com/facebook/docusaurus/pull/8879) chore(deps): bump actions/github-script from 6.4.0 to 6.4.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8878](https://github.com/facebook/docusaurus/pull/8878) chore(deps): bump github/codeql-action from 2.2.9 to 2.2.11 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8836](https://github.com/facebook/docusaurus/pull/8836) chore(deps): bump github/codeql-action from 2.2.7 to 2.2.9 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8837](https://github.com/facebook/docusaurus/pull/8837) chore(deps): bump actions/checkout from 3.4.0 to 3.5.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8797](https://github.com/facebook/docusaurus/pull/8797) chore(deps): bump actions/checkout from 3.3.0 to 3.4.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8796](https://github.com/facebook/docusaurus/pull/8796) chore(deps): bump actions/dependency-review-action from 3.0.3 to 3.0.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8795](https://github.com/facebook/docusaurus/pull/8795) chore(deps): bump github/codeql-action from 2.2.6 to 2.2.7 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8766](https://github.com/facebook/docusaurus/pull/8766) chore(deps): bump treosh/lighthouse-ci-action from 9.3.1 to 9.6.8 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8767](https://github.com/facebook/docusaurus/pull/8767) chore(deps): bump github/codeql-action from 2.2.5 to 2.2.6 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8739](https://github.com/facebook/docusaurus/pull/8739) chore(deps): bump github/codeql-action from 2.2.4 to 2.2.5 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8663](https://github.com/facebook/docusaurus/pull/8663) chore(deps): bump marocchino/sticky-pull-request-comment from 2.3.1 to 2.5.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8662](https://github.com/facebook/docusaurus/pull/8662) chore(deps): bump github/codeql-action from 2.2.2 to 2.2.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8638](https://github.com/facebook/docusaurus/pull/8638) chore(deps): bump github/codeql-action from 2.2.1 to 2.2.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8624](https://github.com/facebook/docusaurus/pull/8624) chore(deps): bump http-cache-semantics from 4.1.0 to 4.1.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8604](https://github.com/facebook/docusaurus/pull/8604) chore(deps): bump actions/github-script from 6.3.3 to 6.4.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8605](https://github.com/facebook/docusaurus/pull/8605) chore(deps): bump github/codeql-action from 2.1.39 to 2.2.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8572](https://github.com/facebook/docusaurus/pull/8572) chore(deps): bump github/codeql-action from 2.1.38 to 2.1.39 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8553](https://github.com/facebook/docusaurus/pull/8553) chore(deps): bump github/codeql-action from 2.1.37 to 2.1.38 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8531](https://github.com/facebook/docusaurus/pull/8531) chore(deps): bump actions/checkout from 3.2.0 to 3.3.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8532](https://github.com/facebook/docusaurus/pull/8532) chore(deps): bump actions/dependency-review-action from 3.0.2 to 3.0.3 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8533](https://github.com/facebook/docusaurus/pull/8533) chore(deps): bump actions/setup-node from 3.5.1 to 3.6.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8496](https://github.com/facebook/docusaurus/pull/8496) chore(deps): bump jakepartusch/wait-for-netlify-action from 1.3 to 1.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8464](https://github.com/facebook/docusaurus/pull/8464) chore(deps): bump actions/dependency-review-action from 3.0.1 to 3.0.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8440](https://github.com/facebook/docusaurus/pull/8440) chore(deps): bump github/codeql-action from 2.1.36 to 2.1.37 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8435](https://github.com/facebook/docusaurus/pull/8435) chore(deps): bump github/codeql-action from 2.1.35 to 2.1.36 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8434](https://github.com/facebook/docusaurus/pull/8434) chore(deps): bump actions/checkout from 3.1.0 to 3.2.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8412](https://github.com/facebook/docusaurus/pull/8412) chore(deps): bump github/codeql-action from 2.1.32 to 2.1.35 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8385](https://github.com/facebook/docusaurus/pull/8385) chore(deps): bump marocchino/sticky-pull-request-comment from 2.3.0 to 2.3.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8360](https://github.com/facebook/docusaurus/pull/8360) chore(deps): bump actions/dependency-review-action from 3.0.0 to 3.0.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8341](https://github.com/facebook/docusaurus/pull/8341) chore(deps): bump github/codeql-action from 2.1.31 to 2.1.32 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8340](https://github.com/facebook/docusaurus/pull/8340) chore(deps): bump actions/dependency-review-action from 2.5.1 to 3.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8339](https://github.com/facebook/docusaurus/pull/8339) chore(deps): bump treosh/lighthouse-ci-action from 9.3.0 to 9.3.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8295](https://github.com/facebook/docusaurus/pull/8295) chore(deps): bump github/codeql-action from 2.1.29 to 2.1.31 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8271](https://github.com/facebook/docusaurus/pull/8271) chore(deps): bump github/codeql-action from 2.1.28 to 2.1.29 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8270](https://github.com/facebook/docusaurus/pull/8270) chore(deps): bump marocchino/sticky-pull-request-comment from 2.2.1 to 2.3.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8240](https://github.com/facebook/docusaurus/pull/8240) chore(deps): bump actions/dependency-review-action from 2.5.0 to 2.5.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8241](https://github.com/facebook/docusaurus/pull/8241) chore(deps): bump github/codeql-action from 2.1.27 to 2.1.28 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8221](https://github.com/facebook/docusaurus/pull/8221) chore(deps): bump marocchino/sticky-pull-request-comment from 2.2.0 to 2.2.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8220](https://github.com/facebook/docusaurus/pull/8220) chore(deps): bump actions/dependency-review-action from 2.4.0 to 2.5.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8219](https://github.com/facebook/docusaurus/pull/8219) chore(deps): bump actions/github-script from 6.3.1 to 6.3.3 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8222](https://github.com/facebook/docusaurus/pull/8222) chore(deps): bump actions/setup-node from 3.5.0 to 3.5.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8200](https://github.com/facebook/docusaurus/pull/8200) chore(deps): bump github/codeql-action from 2.1.26 to 2.1.27 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8199](https://github.com/facebook/docusaurus/pull/8199) chore(deps): bump actions/checkout from 3.0.2 to 3.1.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8169](https://github.com/facebook/docusaurus/pull/8169) chore(deps): bump github/codeql-action from 2.1.22 to 2.1.26 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8170](https://github.com/facebook/docusaurus/pull/8170) chore(deps): bump actions/setup-node from 3.4.1 to 3.5.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8167](https://github.com/facebook/docusaurus/pull/8167) chore(deps): bump actions/github-script from 6.2.0 to 6.3.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8168](https://github.com/facebook/docusaurus/pull/8168) chore(deps): bump actions/dependency-review-action from 2.1.0 to 2.4.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8064](https://github.com/facebook/docusaurus/pull/8064) chore: bump react-medium-image-zoom ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#8051](https://github.com/facebook/docusaurus/pull/8051) chore(deps): bump github/codeql-action from 2.1.21 to 2.1.22 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8019](https://github.com/facebook/docusaurus/pull/8019) chore(deps): bump actions/github-script from 6.1.1 to 6.2.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#8020](https://github.com/facebook/docusaurus/pull/8020) chore(deps): bump github/codeql-action from 2.1.20 to 2.1.21 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#7988](https://github.com/facebook/docusaurus/pull/7988) chore(deps): bump actions/dependency-review-action from 2.0.4 to 2.1.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#7987](https://github.com/facebook/docusaurus/pull/7987) chore(deps): bump github/codeql-action from 2.1.18 to 2.1.20 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#7957](https://github.com/facebook/docusaurus/pull/7957) chore(deps): bump actions/github-script from 6.1.0 to 6.1.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#7925](https://github.com/facebook/docusaurus/pull/7925) chore(deps): bump github/codeql-action from 2.1.17 to 2.1.18 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#7879](https://github.com/facebook/docusaurus/pull/7879) chore(deps): bump github/codeql-action from 2.1.16 to 2.1.17 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#7804](https://github.com/facebook/docusaurus/pull/7804) chore(deps): bump github/codeql-action from 2.1.15 to 2.1.16 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#7805](https://github.com/facebook/docusaurus/pull/7805) chore(deps): bump actions/dependency-review-action from 2.0.2 to 2.0.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#7806](https://github.com/facebook/docusaurus/pull/7806) chore(deps): bump actions/setup-node from 3.4.0 to 3.4.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- `create-docusaurus`, `docusaurus-cssnano-preset`, `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-google-tag-manager`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-mermaid`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-types`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `eslint-plugin`, `lqip-loader`, `stylelint-copyright`
  - [#9148](https://github.com/facebook/docusaurus/pull/9148) chore: upgrade dependencies (non-major) ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#8749](https://github.com/facebook/docusaurus/pull/8749) chore: upgrade dependencies (non-major) ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#8534](https://github.com/facebook/docusaurus/pull/8534) chore: upgrade dependencies ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`
  - [#8926](https://github.com/facebook/docusaurus/pull/8926) chore: upgrade TypeScript to v5.0 ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils`, `docusaurus`
  - [#8537](https://github.com/facebook/docusaurus/pull/8537) chore: bump dependencies major versions ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-cssnano-preset`, `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `eslint-plugin`, `lqip-loader`, `stylelint-copyright`
  - [#7993](https://github.com/facebook/docusaurus/pull/7993) chore: upgrade dependencies ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`, `eslint-plugin`
  - [#7883](https://github.com/facebook/docusaurus/pull/7883) chore: upgrade dependencies ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-pwa`, `docusaurus-theme-search-algolia`, `docusaurus-utils`, `docusaurus`, `eslint-plugin`
  - [#7822](https://github.com/facebook/docusaurus/pull/7822) chore: upgrade dependencies ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-plugin-pwa`, `docusaurus`, `eslint-plugin`
  - [#7794](https://github.com/facebook/docusaurus/pull/7794) chore: upgrade dependencies ([@Josh-Cena](https://github.com/Josh-Cena))

#### :wrench: Maintenance

- `docusaurus-migrate`
  - [#9400](https://github.com/facebook/docusaurus/pull/9400) chore: remove docusaurus-migrate ([@slorber](https://github.com/slorber))
- `docusaurus-theme-search-algolia`
  - [#9320](https://github.com/facebook/docusaurus/pull/9320) chore(theme-search-algolia): revert docsearch package range downgrade after bugfix release ([@slorber](https://github.com/slorber))
- `docusaurus-theme-translations`
  - [#9304](https://github.com/facebook/docusaurus/pull/9304) chore(theme-translations): complete French translations ([@forresst](https://github.com/forresst))
- Other
  - [#9264](https://github.com/facebook/docusaurus/pull/9264) ci: only install Chromium for Playwright Argos tests ([@mxschmitt](https://github.com/mxschmitt))
  - [#9245](https://github.com/facebook/docusaurus/pull/9245) chore: bump devcontainer to Ubuntu 22.04 to resolve arm64 incompatibility ([@AFRUITPIE](https://github.com/AFRUITPIE))
  - [#8947](https://github.com/facebook/docusaurus/pull/8947) test: add visual regression tests with Argos CI ([@slorber](https://github.com/slorber))
  - [#8911](https://github.com/facebook/docusaurus/pull/8911) chore: migrate website config to createConfigAsync ([@slorber](https://github.com/slorber))
  - [#8578](https://github.com/facebook/docusaurus/pull/8578) docs: fix dead anchor for issue reporting guidelines in template ([@Sainan](https://github.com/Sainan))
  - [#8447](https://github.com/facebook/docusaurus/pull/8447) chore: update lerna to v6.2.0 ([@AgentEnder](https://github.com/AgentEnder))
  - [#7967](https://github.com/facebook/docusaurus/pull/7967) test: improve e2e verdaccio configuration ([@juanpicado](https://github.com/juanpicado))
  - [#7863](https://github.com/facebook/docusaurus/pull/7863) docs: publish 2.0.0 release blog post + adapt website for the launch ([@slorber](https://github.com/slorber))
  - [#7828](https://github.com/facebook/docusaurus/pull/7828) misc: change showcase submission process, use GitHub discussion ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`
  - [#9195](https://github.com/facebook/docusaurus/pull/9195) test(blog-plugin): fix ability to generate proper blog website fixture build snapshot ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-theme-classic`
  - [#9024](https://github.com/facebook/docusaurus/pull/9024) docs: remove Meta Data Policy footer link on website ([@KarthickSakthi](https://github.com/KarthickSakthi))
- `docusaurus`
  - [#8660](https://github.com/facebook/docusaurus/pull/8660) chore: bump update-notifier ([@layershifter](https://github.com/layershifter))

#### Committers: 132

- 0x24Karthick ([@KarthickSakthi](https://github.com/KarthickSakthi))
- Abhinandan Wadhwa ([@abhinandanwadwa](https://github.com/abhinandanwadwa))
- Abinash Satapathy ([@Abinashbunty](https://github.com/Abinashbunty))
- Adam Patterson ([@adampatterson](https://github.com/adampatterson))
- Adithya Krishna ([@adithyaakrishna](https://github.com/adithyaakrishna))
- Ahmad Shrif ([@amdshrif](https://github.com/amdshrif))
- Ahmed Mustafa Malik ([@amm98d](https://github.com/amm98d))
- Akshay Bhalotia ([@akshaybhalotia](https://github.com/akshaybhalotia))
- Alex ([@sashashura](https://github.com/sashashura))
- Alexander Nguyen ([@GalexyN](https://github.com/GalexyN))
- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Andrew Lyons ([@andrewnicols](https://github.com/andrewnicols))
- Andrés Villanueva ([@Villanuevand](https://github.com/Villanuevand))
- Anna ([@HumbleDeer](https://github.com/HumbleDeer))
- Anton Kastritskii ([@antonk52](https://github.com/antonk52))
- Antony Onipko ([@antonyoni](https://github.com/antonyoni))
- Aolin ([@Oreoxmt](https://github.com/Oreoxmt))
- Aqueeb ([@aqueeb](https://github.com/aqueeb))
- Bei Chu ([@chubei](https://github.com/chubei))
- Billy Chan ([@billy1624](https://github.com/billy1624))
- Biplav Kumar Mazumdar ([@biplavmz](https://github.com/biplavmz))
- Bruce ([@recallwei](https://github.com/recallwei))
- Charles Killer ([@Foosballfan](https://github.com/Foosballfan))
- Chongyi Zheng ([@harryzcy](https://github.com/harryzcy))
- Chua Chee How ([@rojakcoder](https://github.com/rojakcoder))
- Clément Vannicatte ([@shortcuts](https://github.com/shortcuts))
- Colin McDonnell ([@colinhacks](https://github.com/colinhacks))
- Coupy ([@HyeokjinKang](https://github.com/HyeokjinKang))
- Craigory Coppola ([@AgentEnder](https://github.com/AgentEnder))
- Dan Dascalescu ([@dandv](https://github.com/dandv))
- Dan Roscigno ([@DanRoscigno](https://github.com/DanRoscigno))
- Danilo Woznica ([@danilowoz](https://github.com/danilowoz))
- David J. Felix ([@DavidJFelix](https://github.com/DavidJFelix))
- Debbie O'Brien ([@debs-obrien](https://github.com/debs-obrien))
- Devansu Yadav ([@Devansu-Yadav](https://github.com/Devansu-Yadav))
- Dinh Bao Dang ([@chillinPanda](https://github.com/chillinPanda))
- Dongjoon Lee ([@Djunnni](https://github.com/Djunnni))
- Eduardo Mínguez ([@e-minguez](https://github.com/e-minguez))
- Eunkwang Shin ([@gracefullight](https://github.com/gracefullight))
- Forresst ([@forresst](https://github.com/forresst))
- Francesco Ciulla ([@FrancescoXX](https://github.com/FrancescoXX))
- Fredrik Stave ([@fredrikstave](https://github.com/fredrikstave))
- Fxpby ([@fxpby](https://github.com/fxpby))
- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))
- Gareth Dwyer ([@sixhobbits](https://github.com/sixhobbits))
- Greg Bergé ([@gregberge](https://github.com/gregberge))
- Grégory Heitz ([@edno](https://github.com/edno))
- Gustav Tonér ([@gazab](https://github.com/gazab))
- Hayden Hong ([@AFRUITPIE](https://github.com/AFRUITPIE))
- Hidde de Vries ([@hidde](https://github.com/hidde))
- Hyunseung ([@hslee2008](https://github.com/hslee2008))
- JJ Style ([@jj-style](https://github.com/jj-style))
- James Kerrane ([@thatrobotdev](https://github.com/thatrobotdev))
- Jean Humann ([@jean-humann](https://github.com/jean-humann))
- Jesper Engberg ([@jeengbe](https://github.com/jeengbe))
- Jody Heavener ([@jodyheavener](https://github.com/jodyheavener))
- Joe Williams ([@BubbaJoe](https://github.com/BubbaJoe))
- John Cao ([@jhcao23](https://github.com/jhcao23))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Jordan Manley ([@werner33](https://github.com/werner33))
- Jorens Merenjanu ([@JorensM](https://github.com/JorensM))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Juan Picado ([@juanpicado](https://github.com/juanpicado))
- Kolja ([@razzeee](https://github.com/razzeee))
- Lane Goolsby ([@lanegoolsby](https://github.com/lanegoolsby))
- Lorenzo Lewis ([@lorenzolewis](https://github.com/lorenzolewis))
- Maciek Palmowski ([@palmiak](https://github.com/palmiak))
- Manuel ([@manuel-rw](https://github.com/manuel-rw))
- Marco Kuper ([@scubamaggo](https://github.com/scubamaggo))
- Marco Stroppel ([@mstroppel](https://github.com/mstroppel))
- Marie ([@schneegansm](https://github.com/schneegansm))
- Markshawn ([@MarkShawn2020](https://github.com/MarkShawn2020))
- Martin Adamko ([@attitude](https://github.com/attitude))
- Max Schmitt ([@mxschmitt](https://github.com/mxschmitt))
- Michael Remediakis ([@mickremedi](https://github.com/mickremedi))
- Mikey O'Toole ([@homotechsual](https://github.com/homotechsual))
- ModupeD ([@ModupeD](https://github.com/ModupeD))
- Mu-Jing-Tsai ([@moojing](https://github.com/moojing))
- Mysterious_Dev ([@Mysterious-Dev](https://github.com/Mysterious-Dev))
- Naffy Dharni ([@knownasnaffy](https://github.com/knownasnaffy))
- Naman Garg ([@NamanGarg2075](https://github.com/NamanGarg2075))
- Nathaniel Tucker ([@ntucker](https://github.com/ntucker))
- Oleksandr Fediashov ([@layershifter](https://github.com/layershifter))
- Oluwatobi Sofela ([@oluwatobiss](https://github.com/oluwatobiss))
- Paul Razvan Berg ([@PaulRBerg](https://github.com/PaulRBerg))
- Pinaki Bhattacharjee ([@pinakipb2](https://github.com/pinakipb2))
- Raphaël Barbazza ([@rbarbazz](https://github.com/rbarbazz))
- Rashid ([@rashidmya](https://github.com/rashidmya))
- Ryosuke Igarashi ([@cm-igarashi-ryosuke](https://github.com/cm-igarashi-ryosuke))
- SADIK KUZU ([@sadikkuzu](https://github.com/sadikkuzu))
- Sanjaiyan Parthipan ([@sanjaiyan-dev](https://github.com/sanjaiyan-dev))
- Serenus ([@Kesyau](https://github.com/Kesyau))
- Shahriar ([@ShahriarKh](https://github.com/ShahriarKh))
- Shashank Kumar ([@shawshankkumar](https://github.com/shawshankkumar))
- Shun Wakatsuki ([@shwaka](https://github.com/shwaka))
- Silvestar Bistrović ([@maliMirkec](https://github.com/maliMirkec))
- Sujal Gupta ([@heysujal](https://github.com/heysujal))
- Sunghyun Cho ([@anaclumos](https://github.com/anaclumos))
- Surav Shrestha ([@suravshrestha](https://github.com/suravshrestha))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tamal Anwar Chowdhury ([@tamalchowdhury](https://github.com/tamalchowdhury))
- Tarun Chauhan ([@tarunrajput](https://github.com/tarunrajput))
- Tatsunori Uchino ([@tats-u](https://github.com/tats-u))
- Thad Guidry ([@thadguidry](https://github.com/thadguidry))
- Tom Mrazauskas ([@mrazauskas](https://github.com/mrazauskas))
- Viktor Malmedal ([@JohnVicke](https://github.com/JohnVicke))
- Waldir Pimenta ([@waldyrious](https://github.com/waldyrious))
- Wan Sim ([@0420syj](https://github.com/0420syj))
- Webber Takken ([@webbertakken](https://github.com/webbertakken))
- Will Ceolin ([@wceolin](https://github.com/wceolin))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))
- Zwyx ([@Zwyx](https://github.com/Zwyx))
- [@Dr-Electron](https://github.com/Dr-Electron)
- [@FlorinaPacurar](https://github.com/FlorinaPacurar)
- [@Mogyuchi](https://github.com/Mogyuchi)
- [@Sainan](https://github.com/Sainan)
- [@VinceCYLiao](https://github.com/VinceCYLiao)
- [@allyw2002](https://github.com/allyw2002)
- [@bitpredator](https://github.com/bitpredator)
- [@conlacda](https://github.com/conlacda)
- [@dawei-wang](https://github.com/dawei-wang)
- [@la55u](https://github.com/la55u)
- [@mcallisto](https://github.com/mcallisto)
- [@prateekbytes](https://github.com/prateekbytes)
- [@qwerzl](https://github.com/qwerzl)
- [@rsteele6](https://github.com/rsteele6)
- [@samatt14](https://github.com/samatt14)
- [@thedevwonder](https://github.com/thedevwonder)
- [@yosukekato165](https://github.com/yosukekato165)
- ozaki ([@OzakIOne](https://github.com/OzakIOne))
- sykp241095 ([@sykp241095](https://github.com/sykp241095))
- 初冬 ([@chudongvip](https://github.com/chudongvip))

## 2.4.3 (2023-09-20)

#### :bug: Bug Fix

- `docusaurus-plugin-content-docs`
  - [#9107](https://github.com/facebook/docusaurus/pull/9107) fix(content-docs): sidebar generator should return customProps for doc items ([@TheCatLady](https://github.com/TheCatLady))
- `docusaurus-theme-classic`
  - [#9108](https://github.com/facebook/docusaurus/pull/9108) feat(theme-classic): add description & keywords microdata to blog posts ([@TheCatLady](https://github.com/TheCatLady))
  - [#9099](https://github.com/facebook/docusaurus/pull/9099) fix(theme): only set classname on ul elements if they have an existing class ([@homotechsual](https://github.com/homotechsual))
  - [#9243](https://github.com/facebook/docusaurus/pull/9243) fix(theme-common): ThemedComponent should display something when JS is disabled ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#9130](https://github.com/facebook/docusaurus/pull/9130) fix(theme): canonical url should be not change after hydration if url accessed with/without trailing slash ([@ori-shalom](https://github.com/ori-shalom))

#### Committers: 4

- Mikey O'Toole ([@homotechsual](https://github.com/homotechsual))
- Ori Shalom ([@ori-shalom](https://github.com/ori-shalom))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- [@TheCatLady](https://github.com/TheCatLady)

## 2.4.2 (2023-09-20)

Bad npm publish, please use 2.4.3

## 2.4.1 (2023-05-15)

#### :bug: Bug Fix

- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#8971](https://github.com/facebook/docusaurus/pull/8971) fix(theme): fix collapsible sidebar behavior when prefers-reduced-motion ([@slorber](https://github.com/slorber))
- `docusaurus-theme-translations`
  - [#8933](https://github.com/facebook/docusaurus/pull/8933) fix(theme-translations): fix Turkish translation for aria label "Enter key" ([@LiberaTeMetuMortis](https://github.com/LiberaTeMetuMortis))
- `docusaurus`
  - [#8908](https://github.com/facebook/docusaurus/pull/8908) fix(core): Correct yarn upgrade command for yarn 2.x ([@andrewnicols](https://github.com/andrewnicols))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-common`, `docusaurus-utils-common`, `docusaurus`
  - [#8909](https://github.com/facebook/docusaurus/pull/8909) fix(theme): add \_\_ prefix to technical anchors, search crawlers (Algolia) should ignore them ([@slorber](https://github.com/slorber))
- `docusaurus-theme-common`
  - [#8906](https://github.com/facebook/docusaurus/pull/8906) fix(theme-common): fix collapsible component with prefers-reduced-motion ([@slorber](https://github.com/slorber))
  - [#8873](https://github.com/facebook/docusaurus/pull/8873) fix(theme-common): fix confusing theme error message: bad sidebar id suggestions ([@slorber](https://github.com/slorber))
- `docusaurus-utils`
  - [#8874](https://github.com/facebook/docusaurus/pull/8874) fix(utils): handle Markdown links with spaces to route correctly ([@morsko1](https://github.com/morsko1))
- `docusaurus-theme-classic`, `docusaurus-theme-translations`
  - [#8842](https://github.com/facebook/docusaurus/pull/8842) fix(theme-translations): remove redundant navigation text in aria label ([@tarunrajput](https://github.com/tarunrajput))
- `create-docusaurus`
  - [#8831](https://github.com/facebook/docusaurus/pull/8831) fix(create): add missing await ([@SACHINnANYAKKARA](https://github.com/SACHINnANYAKKARA))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#8862](https://github.com/facebook/docusaurus/pull/8862) refactor(theme): expose copy, success and word-wrap icons as standalone components ([@armano2](https://github.com/armano2))

#### Committers: 7

- Aleksandr Vladykin ([@morsko1](https://github.com/morsko1))
- Andrew Lyons ([@andrewnicols](https://github.com/andrewnicols))
- Armano ([@armano2](https://github.com/armano2))
- MetuMortis ([@LiberaTeMetuMortis](https://github.com/LiberaTeMetuMortis))
- Sachin Nanayakkara ([@SACHINnANYAKKARA](https://github.com/SACHINnANYAKKARA))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tarun Chauhan ([@tarunrajput](https://github.com/tarunrajput))

## 2.4.0 (2023-03-23)

#### :rocket: New Feature

- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#8236](https://github.com/facebook/docusaurus/pull/8236) feat(content-docs): add support for sidebar item category/link descriptions in generated index page ([@ZarakiKanzaki](https://github.com/ZarakiKanzaki))
- `docusaurus-theme-classic`
  - [#8708](https://github.com/facebook/docusaurus/pull/8708) feat(theme): allow to load a Docusaurus page with theme from query-string: ?docusaurus-theme=dark ([@slorber](https://github.com/slorber))
  - [#8616](https://github.com/facebook/docusaurus/pull/8616) feat(theme): add ability to translate navbar+footer logo alt text ([@Mysterious-Dev](https://github.com/Mysterious-Dev))
- `docusaurus-remark-plugin-npm2yarn`
  - [#8690](https://github.com/facebook/docusaurus/pull/8690) feat(npm-to-yarn): add support for PnPm and custom converters ([@armano2](https://github.com/armano2))
- `docusaurus`
  - [#8677](https://github.com/facebook/docusaurus/pull/8677) feat(core): add script env variables: NODE_ENV + BABEL_ENV + DOCUSAURUS_CURRENT_LOCALE (temporary i18n workaround) ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#8674](https://github.com/facebook/docusaurus/pull/8674) feat(theme-classic): respect `prefers-reduced-motion: reduce` mediaquery, bump Infima to alpha.43 ([@slorber](https://github.com/slorber))
- `docusaurus-theme-translations`
  - [#8668](https://github.com/facebook/docusaurus/pull/8668) feat(theme-translations): add Hungarian theme translations ([@trueqap](https://github.com/trueqap))
  - [#8631](https://github.com/facebook/docusaurus/pull/8631) feat(theme-translations): add Norwegian (Bokmål) theme translation ([@dr0nn1](https://github.com/dr0nn1))
- `docusaurus-theme-common`
  - [#8656](https://github.com/facebook/docusaurus/pull/8656) feat(theme-common): allow passing a string for details summary ([@pReya](https://github.com/pReya))
- `docusaurus-plugin-google-gtag`
  - [#8620](https://github.com/facebook/docusaurus/pull/8620) feat(gtag-plugin): gtag should support multiple tracking ids, notably for the UA => GA4 transition ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#8803](https://github.com/facebook/docusaurus/pull/8803) fix(theme): codeblock buttons should be kept on the right when using RTL locale ([@Vishruta-Patil](https://github.com/Vishruta-Patil))
  - [#8615](https://github.com/facebook/docusaurus/pull/8615) fix(theme): improve color toggle when using dark navbar ([@dewanshDT](https://github.com/dewanshDT))
  - [#8699](https://github.com/facebook/docusaurus/pull/8699) fix(theme-classic): fix tab focus bug in dropdown (#8697) ([@kagankan](https://github.com/kagankan))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#8801](https://github.com/facebook/docusaurus/pull/8801) fix(theme): allow tabs children to be falsy ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-common`, `docusaurus-theme-search-algolia`
  - [#8757](https://github.com/facebook/docusaurus/pull/8757) fix(search): search page should react to querystring changes + cleanup/refactor ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#8746](https://github.com/facebook/docusaurus/pull/8746) fix(core): baseUrl error banner link anchor case ([@slorber](https://github.com/slorber))
- `docusaurus-theme-translations`
  - [#8744](https://github.com/facebook/docusaurus/pull/8744) fix(theme-translations): fix wrong arabic words (tip/next) ([@Anasqx](https://github.com/Anasqx))

#### :nail_care: Polish

- `create-docusaurus`
  - [#8712](https://github.com/facebook/docusaurus/pull/8712) polish(create-docusaurus): the starter template should use a navbar item "docSidebar" instead of "doc" (less fragile on updates) ([@biplavmz](https://github.com/biplavmz))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils-common`, `docusaurus`
  - [#8735](https://github.com/facebook/docusaurus/pull/8735) polish(theme): better error messages on navbar item rendering failures + ErrorCauseBoundary API ([@tannerdolby](https://github.com/tannerdolby))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus`
  - [#8736](https://github.com/facebook/docusaurus/pull/8736) polish(core): better styling for error screens ([@tannerdolby](https://github.com/tannerdolby))

#### Committers: 14

- Anas ([@Anasqx](https://github.com/Anasqx))
- Armano ([@armano2](https://github.com/armano2))
- Davide Donadio ([@ZarakiKanzaki](https://github.com/ZarakiKanzaki))
- Dewansh Thakur ([@dewanshDT](https://github.com/dewanshDT))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Kagan ([@kagankan](https://github.com/kagankan))
- Moritz Stückler ([@pReya](https://github.com/pReya))
- Mysterious_Dev ([@Mysterious-Dev](https://github.com/Mysterious-Dev))
- Petter Drønnen ([@dr0nn1](https://github.com/dr0nn1))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tanner Dolby ([@tannerdolby](https://github.com/tannerdolby))
- TrueQAP ([@trueqap](https://github.com/trueqap))
- Vishruta Patil ([@Vishruta-Patil](https://github.com/Vishruta-Patil))
- [@biplavmz](https://github.com/biplavmz)

## 2.3.1 (2023-02-03)

#### :bug: Bug Fix

- `docusaurus-theme-common`
  - [#8628](https://github.com/facebook/docusaurus/pull/8628) fix(theme-common): fix issue in tab scroll position restoration on tab click ([@slorber](https://github.com/slorber))
  - [#8619](https://github.com/facebook/docusaurus/pull/8619) fix(theme-common): localStorage utils dispatch too many storage events leading to infinite loop ([@slorber](https://github.com/slorber))
  - [#8618](https://github.com/facebook/docusaurus/pull/8618) fix(theme-common): prepare usage of useSyncExternalStore compatibility with React 18 ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#8593](https://github.com/facebook/docusaurus/pull/8593) fix(theme-classic): allow rendering single tab item ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-utils`
  - [#8606](https://github.com/facebook/docusaurus/pull/8606) fix(utils): handle CRLF when parsing MDX imports ([@scastiel](https://github.com/scastiel))
- `docusaurus-preset-classic`
  - [#8597](https://github.com/facebook/docusaurus/pull/8597) fix(preset-classic): install the right plugin for googleTagManager ([@Josh-Cena](https://github.com/Josh-Cena))

#### :nail_care: Polish

- `docusaurus-theme-translations`
  - [#8614](https://github.com/facebook/docusaurus/pull/8614) chore(theme-translations): complete zh translations ([@Josh-Cena](https://github.com/Josh-Cena))

#### :robot: Dependencies

- `docusaurus-plugin-client-redirects`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#8610](https://github.com/facebook/docusaurus/pull/8610) chore(deps): bump eta from 1.12.3 to 2.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 3

- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Sébastien Castiel ([@scastiel](https://github.com/scastiel))
- Sébastien Lorber ([@slorber](https://github.com/slorber))

## 2.3.0 (2023-01-26)

#### :rocket: New Feature

- `docusaurus-theme-translations`
  - [#8541](https://github.com/facebook/docusaurus/pull/8541) feat(theme-translations): default translations for Slovenian (sl-SI) ([@MatijaSi](https://github.com/MatijaSi))
- `docusaurus-plugin-content-blog`
  - [#8378](https://github.com/facebook/docusaurus/pull/8378) feat(blog): add options.createFeedItems to filter/limit/transform feed items ([@johnnyreilly](https://github.com/johnnyreilly))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus`
  - [#8225](https://github.com/facebook/docusaurus/pull/8225) feat(theme-classic): store selected tab in query string. ([@mturoci](https://github.com/mturoci))
- `docusaurus`
  - [#8397](https://github.com/facebook/docusaurus/pull/8397) feat(core): deploy CLI - add support for git url "insteadOf": use 'remote get-url' to determine source repo url ([@friederbluemle](https://github.com/friederbluemle))
- `docusaurus-theme-search-algolia`
  - [#8428](https://github.com/facebook/docusaurus/pull/8428) feat(theme-algolia): add option.replaceSearchResultPathname to process/replaceAll search result urls
- `docusaurus-plugin-google-tag-manager`
  - [#8470](https://github.com/facebook/docusaurus/pull/8470) feat(plugin-google-tag-manager): add new google-tag-manager plugin + deprecate google-analytics plugin ([@lanegoolsby](https://github.com/lanegoolsby))

#### :bug: Bug Fix

- `docusaurus-mdx-loader`
  - [#8303](https://github.com/facebook/docusaurus/pull/8303) fix(mdx-loader): support nested admonitions
  - [#8282](https://github.com/facebook/docusaurus/pull/8282) fix(mermaid): fix Mermaid integration for v9.2 release
- `docusaurus-theme-common`
  - [#8539](https://github.com/facebook/docusaurus/pull/8539) fix(algolia): make search footer respect searchPagePath ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#8538](https://github.com/facebook/docusaurus/pull/8538) fix(core): avoid hash collision when generating chunk names ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#8481](https://github.com/facebook/docusaurus/pull/8481) fix(core): explicitly define CopyWebpackPlugin toType: 'dir' ([@Thomascogez](https://github.com/Thomascogez))
  - [#8342](https://github.com/facebook/docusaurus/pull/8342) fix(core): normalize input for poll option ([@mhnaeem](https://github.com/mhnaeem))
- `docusaurus-theme-classic`, `docusaurus`
  - [#8445](https://github.com/facebook/docusaurus/pull/8445) fix(theme-classic) extract HomeBreadcrumbItem + fix swizzle bugs ([@3v0k4](https://github.com/3v0k4))
- `docusaurus-theme-search-algolia`
  - [#8462](https://github.com/facebook/docusaurus/pull/8462) fix(search-algolia): pass custom transformItems function to SearchBar ([@mturoci](https://github.com/mturoci))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#8486](https://github.com/facebook/docusaurus/pull/8486) fix(theme): refactor Tabs, make groupId + queryString work fine together ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#8463](https://github.com/facebook/docusaurus/pull/8463) fix(theme-classic): content container grow to take all the available space ([@Djunnni](https://github.com/Djunnni))
  - [#8328](https://github.com/facebook/docusaurus/pull/8328) fix(theme): preserve sidebar height on collapse ([@0916dhkim](https://github.com/0916dhkim))
  - [#8350](https://github.com/facebook/docusaurus/pull/8350) fix(theme): forward className prop in theme-classic's Heading ([@JoshuaKGoldberg](https://github.com/JoshuaKGoldberg))
- `docusaurus-theme-translations`
  - [#8424](https://github.com/facebook/docusaurus/pull/8424) fix(translations): typo in lastUpdatedAtBy Vietnamese translation ([@slorber](https://github.com/slorber))
  - [#8289](https://github.com/facebook/docusaurus/pull/8289) fix(theme-translations): complete Turkish theme translations
  - [#8406](https://github.com/facebook/docusaurus/pull/8406) fix(translations): complete farsi theme translations
  - [#8450](https://github.com/facebook/docusaurus/pull/8450) fix(theme-translations): complete Vietnamese theme translations
  - [#8525](https://github.com/facebook/docusaurus/pull/8525) chore(theme-translations): complete pl translations
- `docusaurus-plugin-content-blog`
  - [#8381](https://github.com/facebook/docusaurus/pull/8381) fix(content-blog): blog Atom feed id + RSS feed guid should be fully qualified urls ([@johnnyreilly](https://github.com/johnnyreilly))
- `docusaurus-plugin-content-docs`
  - [#8275](https://github.com/facebook/docusaurus/pull/8275) fix(content-docs): add trailing slash to contentDirs, before passing it to isMDXPartial ([@denis-alkhelali](https://github.com/denis-alkhelali))
- `docusaurus-utils`
  - [#8314](https://github.com/facebook/docusaurus/pull/8314) fix(utils): allow partially backticked markdown h1 contentTitles ([@JoshuaKGoldberg](https://github.com/JoshuaKGoldberg))
- `create-docusaurus`, `docusaurus-theme-classic`
  - [#8279](https://github.com/facebook/docusaurus/pull/8279) fix(create-docusaurus): improve init template misleading doc + add Docuaurus social card ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-theme-classic`, `docusaurus`
  - [#8445](https://github.com/facebook/docusaurus/pull/8445) fix(theme-classic) extract HomeBreadcrumbItem + fix swizzle bugs ([@3v0k4](https://github.com/3v0k4))
- `docusaurus-theme-translations`
  - [#8423](https://github.com/facebook/docusaurus/pull/8423) fix(translations): complete Chinese theme translations ([@SJFCS](https://github.com/SJFCS))
  - [#8312](https://github.com/facebook/docusaurus/pull/8312) fix(theme-translations): complete Swedish theme translations ([@stnor](https://github.com/stnor))
- `eslint-plugin`
  - [#8281](https://github.com/facebook/docusaurus/pull/8281) feat(eslint-plugin): add plugin to exported configs ([@lachieh](https://github.com/lachieh))

#### Committers: 16

- Danny Kim ([@0916dhkim](https://github.com/0916dhkim))
- Denis Al-Khelali ([@denis-alkhelali](https://github.com/denis-alkhelali))
- Dongjoon Lee ([@Djunnni](https://github.com/Djunnni))
- Frieder Bluemle ([@friederbluemle](https://github.com/friederbluemle))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Josh Goldberg ([@JoshuaKGoldberg](https://github.com/JoshuaKGoldberg))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Lachlan Heywood ([@lachieh](https://github.com/lachieh))
- Lane Goolsby ([@lanegoolsby](https://github.com/lanegoolsby))
- Matija Sirk ([@MatijaSi](https://github.com/MatijaSi))
- Muhammad Hammad ([@mhnaeem](https://github.com/mhnaeem))
- Riccardo ([@3v0k4](https://github.com/3v0k4))
- Stefan Norberg ([@stnor](https://github.com/stnor))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Thomas.CA ([@Thomascogez](https://github.com/Thomascogez))
- [@mturoci](https://github.com/mturoci)
- 宋锦丰 ([@SJFCS](https://github.com/SJFCS))

## 2.2.0 (2022-10-29)

#### :rocket: New Feature

- `docusaurus-plugin-client-redirects`
  - [#8227](https://github.com/facebook/docusaurus/pull/8227) feat(plugin-client-redirects): keep the query string + hash ([@Xabilahu](https://github.com/Xabilahu))
- `docusaurus`
  - [#8210](https://github.com/facebook/docusaurus/pull/8210) feat(core): add --config param to swizzle command ([@e-im](https://github.com/e-im))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-theme-mermaid`, `docusaurus-types`, `docusaurus`
  - [#7490](https://github.com/facebook/docusaurus/pull/7490) feat: support mermaid code blocks in Markdown ([@sjwall](https://github.com/sjwall))
- `docusaurus-types`, `docusaurus`
  - [#8151](https://github.com/facebook/docusaurus/pull/8151) feat(core): siteConfig.headTags API to render extra tags in document head ([@johnnyreilly](https://github.com/johnnyreilly))

#### :bug: Bug Fix

- `docusaurus-plugin-ideal-image`
  - [#8250](https://github.com/facebook/docusaurus/pull/8250) fix(ideal-image): do not pass down `img` prop ([@lex111](https://github.com/lex111))
- `docusaurus-theme-common`
  - [#8246](https://github.com/facebook/docusaurus/pull/8246) fix(mdx-loader): properly unwrap mdxAdmonitionTitle placeholder ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`
  - [#8234](https://github.com/facebook/docusaurus/pull/8234) fix(plugin-content-docs): fix error message context (error cause) when doc processing fails ([@shanpriyan](https://github.com/shanpriyan))
- `docusaurus-theme-classic`, `docusaurus-theme-translations`
  - [#8207](https://github.com/facebook/docusaurus/pull/8207) fix(theme-classic): hamburger menu control navigation by keyboard ([@jeferson-sb](https://github.com/jeferson-sb))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#8204](https://github.com/facebook/docusaurus/pull/8204) fix(theme-classic): fix SkipToContent without JS , refactor, make it public theming API ([@mturoci](https://github.com/mturoci))
  - [#8059](https://github.com/facebook/docusaurus/pull/8059) fix(theme): preserve url ?search#hash on navbar version/locale dropdowns navigations ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#8192](https://github.com/facebook/docusaurus/pull/8192) fix(core): throw error for invalid URL in config file ([@forgeRW](https://github.com/forgeRW))
- `docusaurus-theme-classic`
  - [#8174](https://github.com/facebook/docusaurus/pull/8174) fix(theme): announce theme switches ([@mturoci](https://github.com/mturoci))
  - [#8190](https://github.com/facebook/docusaurus/pull/8190) fix(theme): add more tag names to inline code element set ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#8163](https://github.com/facebook/docusaurus/pull/8163) fix(theme): mobile navbar & skipToContent should cover announcementBar ([@adnanhashmi09](https://github.com/adnanhashmi09))
  - [#8068](https://github.com/facebook/docusaurus/pull/8068) fix(theme): preserve line breaks when copying code with showLineNumbers in Firefox ([@LittleboyHarry](https://github.com/LittleboyHarry))
- `docusaurus-utils`
  - [#8137](https://github.com/facebook/docusaurus/pull/8137) fix(utils): remove non-ASCII limitation for path normalization ([@birjj](https://github.com/birjj))
  - [#8158](https://github.com/facebook/docusaurus/pull/8158) fix(content-blog): make RSS feed generation work with slugs with .html extension ([@Pranav2612000](https://github.com/Pranav2612000))
- `docusaurus-theme-translations`
  - [#8105](https://github.com/facebook/docusaurus/pull/8105) fix(theme-translations): complete turkish theme default translations ([@ramazansancar](https://github.com/ramazansancar))
  - [#8087](https://github.com/facebook/docusaurus/pull/8087) fix(theme-translations): remove extra vi translations ([@namnguyenthanhwork](https://github.com/namnguyenthanhwork))
- `docusaurus-plugin-client-redirects`
  - [#8067](https://github.com/facebook/docusaurus/pull/8067) fix(redirect): tolerate trailing slash difference if config is undefined ([@Josh-Cena](https://github.com/Josh-Cena))

#### :nail_care: Polish

- `docusaurus-theme-translations`
  - [#8253](https://github.com/facebook/docusaurus/pull/8253) chore(theme-translations): complete ru translations ([@lex111](https://github.com/lex111))
  - [#8243](https://github.com/facebook/docusaurus/pull/8243) chore(theme-translations): complete French translations ([@forresst](https://github.com/forresst))
  - [#8075](https://github.com/facebook/docusaurus/pull/8075) fix(theme-translation): complete Japanese theme default translation ([@pasora](https://github.com/pasora))
- `docusaurus`
  - [#8159](https://github.com/facebook/docusaurus/pull/8159) fix(core): throw error for invalid URL in config file ([@forgeRW](https://github.com/forgeRW))
  - [#8109](https://github.com/facebook/docusaurus/pull/8109) feat(core): prefetch on mobile touchstart ([@sanjaiyan-dev](https://github.com/sanjaiyan-dev))
- `docusaurus-theme-classic`
  - [#8161](https://github.com/facebook/docusaurus/pull/8161) fix(theme): do not show tab content when tabbing over it; show after selection only ([@mturoci](https://github.com/mturoci))
  - [#8062](https://github.com/facebook/docusaurus/pull/8062) refactor(theme): remove hard-coded tag border-radius ([@homotechsual](https://github.com/homotechsual))
- `docusaurus-utils-validation`, `docusaurus`
  - [#8066](https://github.com/facebook/docusaurus/pull/8066) fix(core): normalize slashes for url/baseUrl instead of throwing ([@Josh-Cena](https://github.com/Josh-Cena))

#### Committers: 22

- Adnan Hashmi ([@adnanhashmi09](https://github.com/adnanhashmi09))
- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Forresst ([@forresst](https://github.com/forresst))
- Jan Peer Stöcklmair ([@JPeer264](https://github.com/JPeer264))
- Jeferson S. Brito ([@jeferson-sb](https://github.com/jeferson-sb))
- Johan Fagerberg ([@birjj](https://github.com/birjj))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- LittleboyHarry ([@LittleboyHarry](https://github.com/LittleboyHarry))
- Masahiko Hara ([@pasora](https://github.com/pasora))
- Mikey O'Toole ([@homotechsual](https://github.com/homotechsual))
- Nguyễn Thành Nam ([@namnguyenthanhwork](https://github.com/namnguyenthanhwork))
- Pranav Joglekar ([@Pranav2612000](https://github.com/Pranav2612000))
- Ramazan SANCAR ([@ramazansancar](https://github.com/ramazansancar))
- Sam Wall ([@sjwall](https://github.com/sjwall))
- Sanjaiyan Parthipan ([@sanjaiyan-dev](https://github.com/sanjaiyan-dev))
- Shanmughapriyan S ([@shanpriyan](https://github.com/shanpriyan))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Xabier Lahuerta Vazquez ([@Xabilahu](https://github.com/Xabilahu))
- [@forgeRW](https://github.com/forgeRW)
- [@mturoci](https://github.com/mturoci)
- evan ([@e-im](https://github.com/e-im))

## 2.1.0 (2022-09-01)

#### :rocket: New Feature

- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#8008](https://github.com/facebook/docusaurus/pull/8008) feat(theme): ability to use `<DocCardList>` without items prop, on any doc page ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#7963](https://github.com/facebook/docusaurus/pull/7963) feat(docs): allow to configure noIndex per doc version ([@slorber](https://github.com/slorber))
  - [#7949](https://github.com/facebook/docusaurus/pull/7949) feat(plugin-docs): docs sidebar item link: support "autoAddBaseUrl" attribute ([@slorber](https://github.com/slorber))
- `docusaurus-theme-translations`
  - [#7953](https://github.com/facebook/docusaurus/pull/7953) feat(theme): adds Ukrainian default theme translations ([@b-ovsepian](https://github.com/b-ovsepian))

#### :bug: Bug Fix

- `create-docusaurus`
  - [#8032](https://github.com/facebook/docusaurus/pull/8032) fix(create-docusaurus): tutorial and init template improvements ([@slorber](https://github.com/slorber))
- `docusaurus-preset-classic`
  - [#8029](https://github.com/facebook/docusaurus/pull/8029) fix(preset-classic): broken link in "unrecognized keys" error message ([@mdubus](https://github.com/mdubus))
- `docusaurus`
  - [#7977](https://github.com/facebook/docusaurus/pull/7977) fix(core): preload should support encoded page links ([@adventure-yunfei](https://github.com/adventure-yunfei))
  - [#7996](https://github.com/facebook/docusaurus/pull/7996) fix(core): CLI command write-translations should extract translations from @docu… ([@slorber](https://github.com/slorber))
  - [#7952](https://github.com/facebook/docusaurus/pull/7952) fix(core): allow overriding ssr/dev template meta tags ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-sitemap`
  - [#7964](https://github.com/facebook/docusaurus/pull/7964) fix(sitemap): filter all routes with robots meta containing noindex ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#7910](https://github.com/facebook/docusaurus/pull/7910) fix(theme-classic): code block line number display with line wrapping ([@yzhe819](https://github.com/yzhe819))
  - [#7786](https://github.com/facebook/docusaurus/pull/7786) fix: collapse siblings when first category is selected ([@whiteand](https://github.com/whiteand))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#7982](https://github.com/facebook/docusaurus/pull/7982) fix(theme): add aria-label to skip to content link region ([@YoniChechik](https://github.com/YoniChechik))
  - [#7940](https://github.com/facebook/docusaurus/pull/7940) refactor(theme-classic): split AnnouncementBar, increase z-index, use shadow ([@slorber](https://github.com/slorber))
  - [#7876](https://github.com/facebook/docusaurus/pull/7876) refactor(theme-classic): make tag text visually certered ([@Kosai106](https://github.com/Kosai106))
- `docusaurus-utils`
  - [#7941](https://github.com/facebook/docusaurus/pull/7941) feat(core): add new Webpack file-loader extensions: avif, mov, mkv, mpg, avi... ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-types`
  - [#7942](https://github.com/facebook/docusaurus/pull/7942) feat(theme-classic): use lang attribute in navbar locale dropdown items ([@slorber](https://github.com/slorber))
- `docusaurus-theme-translations`
  - [#7928](https://github.com/facebook/docusaurus/pull/7928) chore(theme-translations): complete vi translations ([@datlechin](https://github.com/datlechin))

#### :memo: Documentation

- `create-docusaurus`
  - [#8032](https://github.com/facebook/docusaurus/pull/8032) fix(create-docusaurus): tutorial and init template improvements ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`
  - [#7905](https://github.com/facebook/docusaurus/pull/7905) docs: remove mention of beta ([@Josh-Cena](https://github.com/Josh-Cena))

#### Committers: 10

- Bagdasar Ovsepyan ([@b-ovsepian](https://github.com/b-ovsepian))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Kevin Østerkilde ([@Kosai106](https://github.com/Kosai106))
- Morgane Dubus ([@mdubus](https://github.com/mdubus))
- Ngô Quốc Đạt ([@datlechin](https://github.com/datlechin))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Yoni Chechik ([@YoniChechik](https://github.com/YoniChechik))
- [@whiteand](https://github.com/whiteand)
- [@yzhe819](https://github.com/yzhe819)
- adventure-yunfei ([@adventure-yunfei](https://github.com/adventure-yunfei))

## 2.0.1 (2022-08-01)

Fix bad npm publish of 2.0.0

#### Committers: 1

- Sébastien Lorber ([@slorber](https://github.com/slorber))

## 2.0.0 (2022-08-01)

Bad npm publish, please use 2.0.1

#### :nail_care: Polish

- `docusaurus`
  - [#7781](https://github.com/facebook/docusaurus/pull/7781) refactor(core): log Docusaurus & Node version before exiting ([@Josh-Cena](https://github.com/Josh-Cena))

#### Committers: 2

- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Sébastien Lorber ([@slorber](https://github.com/slorber))

## 2.0.0-rc.1 (2022-07-14)

#### :bug: Bug Fix

- `docusaurus`
  - [#7776](https://github.com/facebook/docusaurus/pull/7776) fix(core): swizzle --eject js should not copy theme .d.ts files ([@slorber](https://github.com/slorber))
  - [#7750](https://github.com/facebook/docusaurus/pull/7750) fix(deploy): revert "feat(deploy): copy local git config to tmp repo (#7702)" ([@ghostsquad](https://github.com/ghostsquad))
- `docusaurus-plugin-sitemap`
  - [#7774](https://github.com/facebook/docusaurus/pull/7774) fix(sitemap): complete gracefully when all pages have noIndex meta ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#7771](https://github.com/facebook/docusaurus/pull/7771) chore: bump Infima to 0.2.0-alpha.42, fix a:hover link bug ([@slorber](https://github.com/slorber))
  - [#7755](https://github.com/facebook/docusaurus/pull/7755) fix(theme-classic): validate options properly ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7752](https://github.com/facebook/docusaurus/pull/7752) fix(theme-classic): fix Layout theme height CSS ([@LichLord91](https://github.com/LichLord91))
- `docusaurus-migrate`
  - [#7766](https://github.com/facebook/docusaurus/pull/7766) fix(migrate): import siteConfig with file extension ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-search-algolia`
  - [#7761](https://github.com/facebook/docusaurus/pull/7761) fix(algolia-search): test for canUseIntersectionObserver ([@RoiArthurB](https://github.com/RoiArthurB))

#### :nail_care: Polish

- `docusaurus-theme-translations`
  - [#7762](https://github.com/facebook/docusaurus/pull/7762) chore(theme-translations): complete ko translations ([@anaclumos](https://github.com/anaclumos))

#### :memo: Documentation

- `docusaurus-plugin-content-docs`
  - [#7706](https://github.com/facebook/docusaurus/pull/7706) docs: release process, versioning, breaking changes, public API surface ([@slorber](https://github.com/slorber))

#### :wrench: Maintenance

- `docusaurus-theme-classic`
  - [#7777](https://github.com/facebook/docusaurus/pull/7777) refactor(theme): fix duplicate page metadata usage ([@slorber](https://github.com/slorber))
  - [#7771](https://github.com/facebook/docusaurus/pull/7771) chore: bump Infima to 0.2.0-alpha.42, fix a:hover link bug ([@slorber](https://github.com/slorber))

#### Committers: 11

- Arthur Brugière ([@RoiArthurB](https://github.com/RoiArthurB))
- Bruce Song ([@recallwei](https://github.com/recallwei))
- Evan ([@DigiPie](https://github.com/DigiPie))
- Jeffrey Aven ([@jeffreyaven](https://github.com/jeffreyaven))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Sunghyun Cho ([@anaclumos](https://github.com/anaclumos))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- The Nguyen ([@treoden](https://github.com/treoden))
- Wes McNamee ([@ghostsquad](https://github.com/ghostsquad))
- [@LichLord91](https://github.com/LichLord91)
- 凱恩 Kane ([@Gary50613](https://github.com/Gary50613))

## 2.0.0-beta.22 (2022-07-08)

#### :boom: Breaking Change

- `docusaurus-theme-classic`
  - [#7740](https://github.com/facebook/docusaurus/pull/7740) refactor(theme): nest theme icons under subfolder @theme/Icon/\* ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#7716](https://github.com/facebook/docusaurus/pull/7716) refactor(theme): split BlogPostItem into smaller theme subcomponents ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`
  - [#7660](https://github.com/facebook/docusaurus/pull/7660) refactor(theme-common): split package into public/internal API entrypoints ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#7644](https://github.com/facebook/docusaurus/pull/7644) refactor(docs,theme): split DocItem comp, useDoc hook ([@slorber](https://github.com/slorber))
- `docusaurus-logger`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#7642](https://github.com/facebook/docusaurus/pull/7642) refactor: remove "error" reporting level, move reportMessage to logger ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-utils-validation`, `docusaurus`
  - [#7152](https://github.com/facebook/docusaurus/pull/7152) refactor: handle all admonitions via JSX component ([@lex111](https://github.com/lex111))

#### :rocket: New Feature

- `docusaurus-theme-translations`
  - [#7732](https://github.com/facebook/docusaurus/pull/7732) feat(theme-translations): Dutch translation ([@reinvanhaaren](https://github.com/reinvanhaaren))
  - [#7715](https://github.com/facebook/docusaurus/pull/7715) feat(theme-translations): Swedish translation ([@johnie](https://github.com/johnie))
- `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`
  - [#7666](https://github.com/facebook/docusaurus/pull/7666) feat(algolia-search): allow translating search modal ([@forresst](https://github.com/forresst))
- `create-docusaurus`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#7643](https://github.com/facebook/docusaurus/pull/7643) feat(theme-classic): themeConfig navbar/footer logos accept className/style + update Meta Open-Source Logo ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-client-redirects`
  - [#7649](https://github.com/facebook/docusaurus/pull/7649) feat(client-redirects): make plugin respect onDuplicateRoutes config ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#7624](https://github.com/facebook/docusaurus/pull/7624) feat: allow customizing localization path of each locale ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#7581](https://github.com/facebook/docusaurus/pull/7581) feat(core): allow opting out of HTML minification ([@alexandernst](https://github.com/alexandernst))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#7557](https://github.com/facebook/docusaurus/pull/7557) feat: allow specifying custom target for FooterLogo ([@vannyle](https://github.com/vannyle))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-translations`
  - [#7556](https://github.com/facebook/docusaurus/pull/7556) feat: add admonition type title translations ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#7386](https://github.com/facebook/docusaurus/pull/7386) feat(core): allow customizing the i18n directory path ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-live-codeblock`
  - [#7514](https://github.com/facebook/docusaurus/pull/7514) feat(live-codeblock): add support for noInline to interactive code blocks ([@jpdriver](https://github.com/jpdriver))
- `docusaurus-plugin-content-docs`
  - [#7461](https://github.com/facebook/docusaurus/pull/7461) feat(content-docs): last_update front matter ([@dpang314](https://github.com/dpang314))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#7727](https://github.com/facebook/docusaurus/pull/7727) fix(theme): show blog post edit link even when no tag & not truncated ([@anaclumos](https://github.com/anaclumos))
  - [#7659](https://github.com/facebook/docusaurus/pull/7659) fix(theme-classic): expose empty string alt text in navbar logos ([@BenDMyers](https://github.com/BenDMyers))
  - [#7595](https://github.com/facebook/docusaurus/pull/7595) fix(content-pages): add article wrapper around MDXContent ([@matkoch](https://github.com/matkoch))
- `docusaurus-theme-translations`
  - [#7694](https://github.com/facebook/docusaurus/pull/7694) fix(theme-translations): typo in vi locale ([@saosangmo](https://github.com/saosangmo))
- `docusaurus-plugin-content-docs`
  - [#7638](https://github.com/facebook/docusaurus/pull/7638) fix(docs): forward doc frontMatter.sidebar_custom_props to linking sidebar category ([@slorber](https://github.com/slorber))
  - [#7634](https://github.com/facebook/docusaurus/pull/7634) fix(content-docs): allow translating doc labels in sidebars.js ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-utils`
  - [#7604](https://github.com/facebook/docusaurus/pull/7604) fix(utils): allow any non-boundary characters in Markdown heading ID ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-cssnano-preset`
  - [#7593](https://github.com/facebook/docusaurus/pull/7593) fix(cssnano-preset): disable z-index minification ([@dpang314](https://github.com/dpang314))
- `docusaurus-theme-common`
  - [#7551](https://github.com/facebook/docusaurus/pull/7551) fix(theme-classic): code block wrap mode should allow wrapping in the middle of a word ([@slorber](https://github.com/slorber))
  - [#7485](https://github.com/facebook/docusaurus/pull/7485) fix(theme-classic): inconsistent code block wrapping ([@dpang314](https://github.com/dpang314))
- `docusaurus-mdx-loader`, `docusaurus-module-type-aliases`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus-utils-common`, `docusaurus-utils`
  - [#7521](https://github.com/facebook/docusaurus/pull/7521) fix: make type-checking work in Yarn PnP ([@Josh-Cena](https://github.com/Josh-Cena))

#### :nail_care: Polish

- `docusaurus-theme-translations`
  - [#7696](https://github.com/facebook/docusaurus/pull/7696) fix(theme-translations): improve grammar of zh translation ([@AkagiYui](https://github.com/AkagiYui))
  - [#7691](https://github.com/facebook/docusaurus/pull/7691) chore(theme-translations): complete vi translations ([@datlechin](https://github.com/datlechin))
  - [#7683](https://github.com/facebook/docusaurus/pull/7683) chore(theme-translations): complete ar translations ([@Altomy](https://github.com/Altomy))
  - [#7633](https://github.com/facebook/docusaurus/pull/7633) chore(theme-translations): complete ko translations ([@HyunseungLee-Travis](https://github.com/HyunseungLee-Travis))
- `docusaurus`
  - [#7702](https://github.com/facebook/docusaurus/pull/7702) feat(deploy): copy local git config to tmp repo ([@ghostsquad](https://github.com/ghostsquad))
  - [#7600](https://github.com/facebook/docusaurus/pull/7600) fix: force refresh on chunk preload error ([@yangshun](https://github.com/yangshun))
- `docusaurus-plugin-content-docs`
  - [#7673](https://github.com/facebook/docusaurus/pull/7673) fix(content-docs): format last update date as "Jun 19, 2020" ([@sigwinch28](https://github.com/sigwinch28))
- `docusaurus-theme-common`, `docusaurus-theme-search-algolia`
  - [#7671](https://github.com/facebook/docusaurus/pull/7671) refactor(theme-common): rename useDynamicCallback to useEvent ([@slorber](https://github.com/slorber))
- `docusaurus-theme-common`
  - [#7648](https://github.com/facebook/docusaurus/pull/7648) fix(theme-common): make useShallowMemoObject key-order-insensitive ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`
  - [#7639](https://github.com/facebook/docusaurus/pull/7639) chore(create): update the facebook template with current assets ([@zpao](https://github.com/zpao))
  - [#7520](https://github.com/facebook/docusaurus/pull/7520) feat: add engines field to templates' package.json ([@johnnyreilly](https://github.com/johnnyreilly))
- `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus`
  - [#7579](https://github.com/facebook/docusaurus/pull/7579) refactor(pwa): simplify registerSW code, fix ESLint errors ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`
  - [#7545](https://github.com/facebook/docusaurus/pull/7545) feat(analytics): allow query/hash changes to be sent to GA ([@lanegoolsby](https://github.com/lanegoolsby))

#### :memo: Documentation

- Other
  - [#7739](https://github.com/facebook/docusaurus/pull/7739) docs: swizzle react-live with eject ([@SheetJSDev](https://github.com/SheetJSDev))
  - [#7723](https://github.com/facebook/docusaurus/pull/7723) docs: add GitHub pages deployment troubleshooting guide ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7705](https://github.com/facebook/docusaurus/pull/7705) docs: mention MDXContent ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7675](https://github.com/facebook/docusaurus/pull/7675) docs: add docusaurus-openapi-docs to resources ([@sserrata](https://github.com/sserrata))
  - [#7677](https://github.com/facebook/docusaurus/pull/7677) docs: add more info on github cross repo deployment ([@bcabanes](https://github.com/bcabanes))
  - [#7563](https://github.com/facebook/docusaurus/pull/7563) docs: add awesome-docusaurus resource ([@webbertakken](https://github.com/webbertakken))
  - [#7665](https://github.com/facebook/docusaurus/pull/7665) docs: add link from every category index page to the guide page ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7519](https://github.com/facebook/docusaurus/pull/7519) docs: multiple documentation elaborations ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7518](https://github.com/facebook/docusaurus/pull/7518) docs: remove useless front matter ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7512](https://github.com/facebook/docusaurus/pull/7512) docs: update Kent C. Dodds Twitter avatar ([@DharsanB](https://github.com/DharsanB))
- `create-docusaurus`
  - [#7611](https://github.com/facebook/docusaurus/pull/7611) docs: advise using Node 18 in deployment ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7582](https://github.com/facebook/docusaurus/pull/7582) docs: make localhost links clickable ([@dht](https://github.com/dht))
- `docusaurus-plugin-client-redirects`
  - [#7607](https://github.com/facebook/docusaurus/pull/7607) refactor(client-redirects): elaborate documentation, minor refactor ([@Josh-Cena](https://github.com/Josh-Cena))

#### :wrench: Maintenance

- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#7676](https://github.com/facebook/docusaurus/pull/7676) refactor(theme): move LayoutProviders to Layout/Provider; composeProviders util ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#7674](https://github.com/facebook/docusaurus/pull/7674) chore: prevent importing theme components with relative paths ([@slorber](https://github.com/slorber))
  - [#7664](https://github.com/facebook/docusaurus/pull/7664) chore: upgrade Infima to alpha.40 ([@slorber](https://github.com/slorber))
- Other
  - [#7663](https://github.com/facebook/docusaurus/pull/7663) misc: share .vscode/extensions.json ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#7583](https://github.com/facebook/docusaurus/pull/7583) refactor(cli): make the CLI an even thinner wrapper around command functions ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7547](https://github.com/facebook/docusaurus/pull/7547) chore: update static-site-generator-webpack-plugin ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-cssnano-preset`, `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-types`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `eslint-plugin`, `lqip-loader`, `stylelint-copyright`
  - [#7586](https://github.com/facebook/docusaurus/pull/7586) chore: upgrade to TS 4.7, compile with NodeNext ([@Josh-Cena](https://github.com/Josh-Cena))

#### Committers: 51

- 7Wate ([@7Wate](https://github.com/7Wate))
- Ahmed Altomy ([@Altomy](https://github.com/Altomy))
- Alexander Nestorov ([@alexandernst](https://github.com/alexandernst))
- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Ben Myers ([@BenDMyers](https://github.com/BenDMyers))
- Benjamin Cabanes ([@bcabanes](https://github.com/bcabanes))
- Boulet ([@Boulet-](https://github.com/Boulet-))
- Charles Ancheta ([@cbebe](https://github.com/cbebe))
- Clemie McCartney ([@clemiee](https://github.com/clemiee))
- DOLLE ([@JeremyDolle](https://github.com/JeremyDolle))
- Dharsan B ([@DharsanB](https://github.com/DharsanB))
- Diego França ([@difranca](https://github.com/difranca))
- Dima Grossman ([@scopsy](https://github.com/scopsy))
- Dzung Do ([@saosangmo](https://github.com/saosangmo))
- Flávio Silva ([@201flaviosilva](https://github.com/201flaviosilva))
- Forresst ([@forresst](https://github.com/forresst))
- Huy Nguyen ([@Smilefounder](https://github.com/Smilefounder))
- Hyunseung Lee ([@HyunseungLee-Travis](https://github.com/HyunseungLee-Travis))
- JP ([@jpdriver](https://github.com/jpdriver))
- Joe Harrison ([@sigwinch28](https://github.com/sigwinch28))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Johnie Hjelm ([@johnie](https://github.com/johnie))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Joshua Schmitt ([@jqshuv](https://github.com/jqshuv))
- Kürşat Şimşek ([@kursatsmsek](https://github.com/kursatsmsek))
- Lane Goolsby ([@lanegoolsby](https://github.com/lanegoolsby))
- Le Thi Van ([@vannyle](https://github.com/vannyle))
- Matthias Koch ([@matkoch](https://github.com/matkoch))
- Ngô Quốc Đạt ([@datlechin](https://github.com/datlechin))
- Paul O’Shannessy ([@zpao](https://github.com/zpao))
- Redcamel ([@redcamel](https://github.com/redcamel))
- Rein van Haaren ([@reinvanhaaren](https://github.com/reinvanhaaren))
- Rudra Sen ([@RudraSen2](https://github.com/RudraSen2))
- Steven Serrata ([@sserrata](https://github.com/sserrata))
- Sunghyun Cho ([@anaclumos](https://github.com/anaclumos))
- Szilárd Dóró ([@szilarddoro](https://github.com/szilarddoro))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tom Mrazauskas ([@mrazauskas](https://github.com/mrazauskas))
- Webber Takken ([@webbertakken](https://github.com/webbertakken))
- Wes McNamee ([@ghostsquad](https://github.com/ghostsquad))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))
- [@SheetJSDev](https://github.com/SheetJSDev)
- [@alewolf](https://github.com/alewolf)
- [@dpang314](https://github.com/dpang314)
- dht ([@dht](https://github.com/dht))
- emattia ([@emattia](https://github.com/emattia))
- pincman ([@pincman](https://github.com/pincman))
- sado ([@sado0823](https://github.com/sado0823))
- 凱恩 Kane ([@Gary50613](https://github.com/Gary50613))
- 李小雨 ([@metal-young](https://github.com/metal-young))
- 赤城结衣 ([@AkagiYui](https://github.com/AkagiYui))

## 2.0.0-beta.21 (2022-05-27)

#### :boom: Breaking Change

- `docusaurus-plugin-pwa`
  - [#7422](https://github.com/facebook/docusaurus/pull/7422) refactor(pwa): remove reloadPopup option in favor of swizzling ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-cssnano-preset`, `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `eslint-plugin`, `lqip-loader`
  - [#7501](https://github.com/facebook/docusaurus/pull/7501) chore: require Node 16.14 ([@Josh-Cena](https://github.com/Josh-Cena))

#### :rocket: New Feature

- `docusaurus-plugin-sitemap`
  - [#7469](https://github.com/facebook/docusaurus/pull/7469) feat(sitemap): allow customizing the output name ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-utils`, `docusaurus`
  - [#7371](https://github.com/facebook/docusaurus/pull/7371) feat(core): support docusaurus.config.cjs as default file name ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#7500](https://github.com/facebook/docusaurus/pull/7500) feat: make docusaurus serve automatically open in browser ([@Zamiell](https://github.com/Zamiell))
  - [#7452](https://github.com/facebook/docusaurus/pull/7452) feat: add --no-minify flag to docusaurus start ([@lanegoolsby](https://github.com/lanegoolsby))
- `docusaurus-theme-classic`
  - [#7357](https://github.com/facebook/docusaurus/pull/7357) feat(theme-classic): allow className as option for type: "search" ([@JPeer264](https://github.com/JPeer264))

#### :bug: Bug Fix

- `docusaurus`
  - [#7362](https://github.com/facebook/docusaurus/pull/7362) fix: always emit SEO title + og:title meta ([@charleskorn](https://github.com/charleskorn))
  - [#7453](https://github.com/facebook/docusaurus/pull/7453) fix(core): avoid using logger and fs.readJSON in SSR ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7369](https://github.com/facebook/docusaurus/pull/7369) fix(cli): output correct path when swizzling bare-file component in subfolder ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7360](https://github.com/facebook/docusaurus/pull/7360) fix(core): allow githubPort in config validation ([@mhughes2k](https://github.com/mhughes2k))
- `docusaurus-plugin-google-gtag`
  - [#7424](https://github.com/facebook/docusaurus/pull/7424) fix(gtag): send the newly rendered page's title instead of the old one's ([@ori-shalom](https://github.com/ori-shalom))
- `create-docusaurus`, `docusaurus-utils`
  - [#7507](https://github.com/facebook/docusaurus/pull/7507) fix(create-docusaurus): potential security issue with command injection ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus`
  - [#7492](https://github.com/facebook/docusaurus/pull/7492) fix(core): always treat error boundary fallback as a callback ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#7438](https://github.com/facebook/docusaurus/pull/7438) fix(theme-classic): allow nested task lists to preserve the indent ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7430](https://github.com/facebook/docusaurus/pull/7430) fix(theme-classic): consistently apply the right active class name for all navbar items ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7411](https://github.com/facebook/docusaurus/pull/7411) fix(theme-classic): autocollapse sidebar categories when navigating with paginator ([@pranabdas](https://github.com/pranabdas))
  - [#7363](https://github.com/facebook/docusaurus/pull/7363) fix(theme-classic): resolve customCss from site dir ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-utils`
  - [#7464](https://github.com/facebook/docusaurus/pull/7464) fix(utils): fix Markdown link replacement when link text is same as href ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7458](https://github.com/facebook/docusaurus/pull/7458) fix(utils): avoid replacing Markdown links missing the directly next link ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`
  - [#7392](https://github.com/facebook/docusaurus/pull/7392) fix(mdx-loader): use React.Fragment as fragment factory ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`
  - [#7385](https://github.com/facebook/docusaurus/pull/7385) fix(content-docs): restore functionality when a category only has index page ([@Josh-Cena](https://github.com/Josh-Cena))

#### :nail_care: Polish

- `docusaurus-theme-translations`
  - [#7493](https://github.com/facebook/docusaurus/pull/7493) chore(theme-translations): complete French translations ([@forresst](https://github.com/forresst))
  - [#7474](https://github.com/facebook/docusaurus/pull/7474) chore(theme-translations): complete zh translations ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7400](https://github.com/facebook/docusaurus/pull/7400) chore(theme-translations): complete Farsi translations ([@massoudmaboudi](https://github.com/massoudmaboudi))
- `docusaurus`
  - [#7499](https://github.com/facebook/docusaurus/pull/7499) fix: avoid printing period after localhost URL ([@Zamiell](https://github.com/Zamiell))
- `create-docusaurus`
  - [#7374](https://github.com/facebook/docusaurus/pull/7374) refactor(create): clean up logic when prompting for unspecified arguments ([@Josh-Cena](https://github.com/Josh-Cena))

#### :memo: Documentation

- [#7503](https://github.com/facebook/docusaurus/pull/7503) docs: document MDXComponents scope ([@Josh-Cena](https://github.com/Josh-Cena))
- [#7497](https://github.com/facebook/docusaurus/pull/7497) docs: link every reference of types in API table to the type definition ([@Zamiell](https://github.com/Zamiell))
- [#7407](https://github.com/facebook/docusaurus/pull/7407) docs: add Azure SWA as deployment option ([@nitya](https://github.com/nitya))
- [#7390](https://github.com/facebook/docusaurus/pull/7390) fix(website): use react-lite-youtube-embed for lazy YouTube video ([@matkoch](https://github.com/matkoch))

#### :wrench: Maintenance

- `create-docusaurus`, `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`, `stylelint-copyright`
  - [#7477](https://github.com/facebook/docusaurus/pull/7477) refactor: fix a lot of errors in type-aware linting ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus-theme-translations`
  - [#7447](https://github.com/facebook/docusaurus/pull/7447) refactor(theme-classic): migrate to tsc for build ([@Josh-Cena](https://github.com/Josh-Cena))
- `stylelint-copyright`
  - [#7441](https://github.com/facebook/docusaurus/pull/7441) refactor(stylelint-copyright): migrate to TS ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-cssnano-preset`
  - [#7440](https://github.com/facebook/docusaurus/pull/7440) refactor(cssnano-preset): migrate to TS ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `eslint-plugin`, `lqip-loader`
  - [#7437](https://github.com/facebook/docusaurus/pull/7437) refactor: use TS project references instead of running tsc multiple times ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-pwa`
  - [#7421](https://github.com/facebook/docusaurus/pull/7421) refactor(pwa): migrate client modules to TS ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#7415](https://github.com/facebook/docusaurus/pull/7415) refactor(theme-classic): always collocate stylesheets with components in one folder ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#7405](https://github.com/facebook/docusaurus/pull/7405) refactor(core): properly code-split NotFound page ([@Josh-Cena](https://github.com/Josh-Cena))

#### Committers: 23

- Akara ([@Messiahhh](https://github.com/Messiahhh))
- Benjamin Diolez ([@BenDz](https://github.com/BenDz))
- Charles Korn ([@charleskorn](https://github.com/charleskorn))
- Designatory ([@Designatory](https://github.com/Designatory))
- Forresst ([@forresst](https://github.com/forresst))
- Ggicci ([@ggicci](https://github.com/ggicci))
- James ([@Zamiell](https://github.com/Zamiell))
- Jan Peer Stöcklmair ([@JPeer264](https://github.com/JPeer264))
- Jeremy ([@jrmyw92](https://github.com/jrmyw92))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Junjie ([@junjieweb](https://github.com/junjieweb))
- Lane Goolsby ([@lanegoolsby](https://github.com/lanegoolsby))
- Massoud Maboudi ([@massoudmaboudi](https://github.com/massoudmaboudi))
- Matthias Koch ([@matkoch](https://github.com/matkoch))
- Michael Hughes ([@mhughes2k](https://github.com/mhughes2k))
- Ngô Quốc Đạt ([@datlechin](https://github.com/datlechin))
- Nitya Narasimhan ([@nitya](https://github.com/nitya))
- Oluwatobi Sofela ([@oluwatobiss](https://github.com/oluwatobiss))
- Ori Shalom ([@ori-shalom](https://github.com/ori-shalom))
- Pranab Das ([@pranabdas](https://github.com/pranabdas))
- Rui Peres ([@RuiAAPeres](https://github.com/RuiAAPeres))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- 凱恩 Kane ([@Gary50613](https://github.com/Gary50613))

## 2.0.0-beta.20 (2022-05-05)

#### :bug: Bug Fix

- `docusaurus`
  - [#7342](https://github.com/facebook/docusaurus/pull/7342) fix: avoid flash of page scrolling to top on refresh ([@slorber](https://github.com/slorber))
  - [#7329](https://github.com/facebook/docusaurus/pull/7329) fix(core): inject docusaurus version into SSR as local ([@RDIL](https://github.com/RDIL))
- `docusaurus-theme-classic`
  - [#7341](https://github.com/facebook/docusaurus/pull/7341) fix(theme-classic): properly highlight code block line numbers ([@Josh-Cena](https://github.com/Josh-Cena))

#### :memo: Documentation

- [#7334](https://github.com/facebook/docusaurus/pull/7334) feat(website): make canary release page display actual canary version name ([@Josh-Cena](https://github.com/Josh-Cena))
- [#7343](https://github.com/facebook/docusaurus/pull/7343) docs: add page for create-docusaurus API documentation ([@Josh-Cena](https://github.com/Josh-Cena))
- [#7340](https://github.com/facebook/docusaurus/pull/7340) docs: add Yandex Metrika plugin to community plugins ([@sgromkov](https://github.com/sgromkov))
- [#7336](https://github.com/facebook/docusaurus/pull/7336) fix(website): fix multiple accessibility issues around color contrast ([@Josh-Cena](https://github.com/Josh-Cena))
- [#7327](https://github.com/facebook/docusaurus/pull/7327) docs: add clarity to versioning behavior ([@pepopowitz](https://github.com/pepopowitz))

#### Committers: 6

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Reece Dunham ([@RDIL](https://github.com/RDIL))
- Sergey Gromkov ([@sgromkov](https://github.com/sgromkov))
- Steven Hicks ([@pepopowitz](https://github.com/pepopowitz))
- Sébastien Lorber ([@slorber](https://github.com/slorber))

## 2.0.0-beta.19 (2022-05-04)

#### :rocket: New Feature

- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#7178](https://github.com/facebook/docusaurus/pull/7178) feat(theme-classic): extensible code block magic comment system ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7007](https://github.com/facebook/docusaurus/pull/7007) feat(theme-classic): code block showLineNumbers ([@lex111](https://github.com/lex111))
  - [#7012](https://github.com/facebook/docusaurus/pull/7012) feat(theme-classic): show blog sidebar on mobile ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus`, `eslint-plugin`
  - [#7206](https://github.com/facebook/docusaurus/pull/7206) feat: Docusaurus ESLint plugin to enforce best Docusaurus practices ([@elias-pap](https://github.com/elias-pap))
- `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus`
  - [#6732](https://github.com/facebook/docusaurus/pull/6732) feat(core): rework client modules lifecycles, officially make API public ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#7231](https://github.com/facebook/docusaurus/pull/7231) feat: allow custom navbarItem types to pass through validation ([@slorber](https://github.com/slorber))
  - [#7058](https://github.com/facebook/docusaurus/pull/7058) feat(theme-classic): new 'html' type navbar item ([@lex111](https://github.com/lex111))
  - [#7079](https://github.com/facebook/docusaurus/pull/7079) feat: allow using pure HTML as label in navbar links ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-translations`
  - [#7036](https://github.com/facebook/docusaurus/pull/7036) feat(theme-classic): toggle code wrap button ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#6457](https://github.com/facebook/docusaurus/pull/6457) feat(content-docs): draft docs excluded from build & sidebars ([@jodyheavener](https://github.com/jodyheavener))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-types`, `docusaurus`
  - [#6430](https://github.com/facebook/docusaurus/pull/6430) feat: allow setting calendar for i18n date formatting ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-content-docs`, `docusaurus-types`, `docusaurus`
  - [#7083](https://github.com/facebook/docusaurus/pull/7083) feat(core): fail-safe global data fetching ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`
  - [#7106](https://github.com/facebook/docusaurus/pull/7106) feat(content-docs): make docs:version command work on localized docs ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-types`, `docusaurus`
  - [#7082](https://github.com/facebook/docusaurus/pull/7082) feat(core): allow plugins to declare custom route context ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7124](https://github.com/facebook/docusaurus/pull/7124) feat(core): allow plugin/preset config to contain false/null ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-sitemap`, `docusaurus-utils`
  - [#6979](https://github.com/facebook/docusaurus/pull/6979) feat(sitemap): add ignorePatterns option ([@ApsarasX](https://github.com/ApsarasX))

#### :boom: Breaking Change

- `docusaurus-types`, `docusaurus`
  - [#7257](https://github.com/facebook/docusaurus/pull/7257) refactor: remove long-deprecated routesLoaded lifecycle ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#7277](https://github.com/facebook/docusaurus/pull/7277) refactor(theme-classic): move all sidebar-related config under themeConfig.docs.sidebar ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus`
  - [#6732](https://github.com/facebook/docusaurus/pull/6732) feat(core): rework client modules lifecycles, officially make API public ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-theme-classic`
  - [#7176](https://github.com/facebook/docusaurus/pull/7176) refactor: customize code block line highlight color via CSS var ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus-utils`
  - [#7117](https://github.com/facebook/docusaurus/pull/7117) refactor(content-{blog,docs}): unify handling of tags ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#7027](https://github.com/facebook/docusaurus/pull/7027) refactor(content-docs): deduplicate types, JSDoc for some APIs ([@Josh-Cena](https://github.com/Josh-Cena))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#7304](https://github.com/facebook/docusaurus/pull/7304) fix(theme-classic): remove breadcrumb items without href from microdata ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7179](https://github.com/facebook/docusaurus/pull/7179) fix(theme-classic): do not add microdata item prop to trailing breadcrumb ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7173](https://github.com/facebook/docusaurus/pull/7173) fix(theme-classic): admonition title: disable text-transform on inline code blocks ([@chelproc](https://github.com/chelproc))
  - [#7048](https://github.com/facebook/docusaurus/pull/7048) fix(theme-classic): add caret for dropdown on mobile ([@lex111](https://github.com/lex111))
  - [#7025](https://github.com/facebook/docusaurus/pull/7025) fix: make docs page wrapper take full height ([@lex111](https://github.com/lex111))
  - [#7013](https://github.com/facebook/docusaurus/pull/7013) fix(theme-classic): adjust shadow on code block ([@chernodub](https://github.com/chernodub))
  - [#7015](https://github.com/facebook/docusaurus/pull/7015) fix(theme-classic): do not add caret for non-collapsible categories ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-theme-classic`
  - [#7294](https://github.com/facebook/docusaurus/pull/7294) fix(\*): make TypeScript realize that each plugin package has a default export ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#7285](https://github.com/facebook/docusaurus/pull/7285) fix(core): allow empty static directories ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7180](https://github.com/facebook/docusaurus/pull/7180) fix: pass pollOptions to webpack ([@JohnnyMcWeed](https://github.com/JohnnyMcWeed))
  - [#7184](https://github.com/facebook/docusaurus/pull/7184) fix(core): prevent 404 when accessing /page.html ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7225](https://github.com/facebook/docusaurus/pull/7225) fix: allow swizzling a component's parent folder ([@slorber](https://github.com/slorber))
  - [#7066](https://github.com/facebook/docusaurus/pull/7066) fix(core): all plugin lifecycles should receive translated content ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`
  - [#7233](https://github.com/facebook/docusaurus/pull/7233) fix(content-docs): make category index text translatable ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-common`
  - [#7200](https://github.com/facebook/docusaurus/pull/7200) fix(theme-common): do not persist color mode for OS-triggered changes ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7057](https://github.com/facebook/docusaurus/pull/7057) fix(theme-common): use native scrolling when smooth behavior set in CSS ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7033](https://github.com/facebook/docusaurus/pull/7033) fix(theme): only parse HTML- and JSX-style comments in MD code ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`
  - [#7212](https://github.com/facebook/docusaurus/pull/7212) fix(content-blog): make footnote reference DOM ID unique on post listing page ([@AkiraVoid](https://github.com/AkiraVoid))
- `docusaurus-utils`, `docusaurus`
  - [#7187](https://github.com/facebook/docusaurus/pull/7187) fix(core): handle case where package.json is not available at CWD ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-translations`
  - [#7222](https://github.com/facebook/docusaurus/pull/7222) fix(theme-translations): fix invalid pluralization in cs ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7166](https://github.com/facebook/docusaurus/pull/7166) fix(theme-translations): always try all possible locale resolutions ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`
  - [#7164](https://github.com/facebook/docusaurus/pull/7164) fix: adjust spacing for custom search properly ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-debug`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-types`, `docusaurus`
  - [#7143](https://github.com/facebook/docusaurus/pull/7143) fix(sitemap): exclude pages with robots noindex from sitemap ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-types`
  - [#7078](https://github.com/facebook/docusaurus/pull/7078) fix(create): install types for JS template as well ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-utils`
  - [#7043](https://github.com/facebook/docusaurus/pull/7043) fix(utils): parse Markdown headings with CRLF line break ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-utils`, `docusaurus`
  - [#7023](https://github.com/facebook/docusaurus/pull/7023) refactor: fix a few places of path handling ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-types`
  - [#7014](https://github.com/facebook/docusaurus/pull/7014) fix(types): declare history and react-loadable as dependencies ([@sulu5890](https://github.com/sulu5890))

#### :nail_care: Polish

- `docusaurus-theme-classic`, `docusaurus-theme-translations`
  - [#7299](https://github.com/facebook/docusaurus/pull/7299) refactor: minor improvements for breadcrumbs ([@lex111](https://github.com/lex111))
- `create-docusaurus`
  - [#7290](https://github.com/facebook/docusaurus/pull/7290) refactor(create): add i18n config in init template ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7286](https://github.com/facebook/docusaurus/pull/7286) refactor(create): update screenshots in quick start tutorial ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7223](https://github.com/facebook/docusaurus/pull/7223) refactor: use generated-index in init templates ([@slorber](https://github.com/slorber))
  - [#7118](https://github.com/facebook/docusaurus/pull/7118) refactor(create): mention that the edit links can be removed ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-debug`, `docusaurus-theme-classic`
  - [#7306](https://github.com/facebook/docusaurus/pull/7306) chore: upgrade Infima to alpha.39 ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-debug`, `docusaurus-types`, `docusaurus`
  - [#7291](https://github.com/facebook/docusaurus/pull/7291) feat(types): JSDoc for docusaurus config fields ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#7267](https://github.com/facebook/docusaurus/pull/7267) fix(theme-common): allow details to not provide a summary ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7172](https://github.com/facebook/docusaurus/pull/7172) refactor: control base styling of code blocks via CSS vars ([@lex111](https://github.com/lex111))
  - [#7129](https://github.com/facebook/docusaurus/pull/7129) refactor(theme-classic): fix a few margin inconsistencies ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`, `docusaurus-utils`
  - [#7248](https://github.com/facebook/docusaurus/pull/7248) refactor: normalize Markdown linkification behavior, elaborate in documentation ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#7244](https://github.com/facebook/docusaurus/pull/7244) refactor: semantic markup improvement, fix validation warnings ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7183](https://github.com/facebook/docusaurus/pull/7183) refactor: use SVG icon for home breadcrumb ([@Dr-Electron](https://github.com/Dr-Electron))
  - [#7139](https://github.com/facebook/docusaurus/pull/7139) fix: proper spacing between generated card items on mobiles ([@lex111](https://github.com/lex111))
  - [#7134](https://github.com/facebook/docusaurus/pull/7134) fix(theme-classic): fix docs sidebar layout shifts when expanding categories ([@slorber](https://github.com/slorber))
  - [#7068](https://github.com/facebook/docusaurus/pull/7068) refactor(theme-classic): blog mobile secondary menu use consistent styles ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7004](https://github.com/facebook/docusaurus/pull/7004) fix(theme-classic): shrink title size on mobile ([@Pierre-Gilles](https://github.com/Pierre-Gilles))
- `docusaurus-theme-translations`
  - [#7214](https://github.com/facebook/docusaurus/pull/7214) chore(theme-translations): complete Polish translations ([@rev4324](https://github.com/rev4324))
  - [#7031](https://github.com/facebook/docusaurus/pull/7031) chore(theme-translations): complete German translations ([@deployn](https://github.com/deployn))
- `create-docusaurus`, `docusaurus-theme-classic`
  - [#7176](https://github.com/facebook/docusaurus/pull/7176) refactor: customize code block line highlight color via CSS var ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#7218](https://github.com/facebook/docusaurus/pull/7218) fix(cli): always show error stack to unhandled rejection ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7142](https://github.com/facebook/docusaurus/pull/7142) refactor(core): lower timeout before rendering progress bar to 200ms ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7103](https://github.com/facebook/docusaurus/pull/7103) fix(core): preserve Interpolate children semantics ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7029](https://github.com/facebook/docusaurus/pull/7029) refactor: console output improvements ([@lex111](https://github.com/lex111))
  - [#7017](https://github.com/facebook/docusaurus/pull/7017) refactor: remove copyright comment from swizzled components ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`, `docusaurus-preset-classic`, `docusaurus-theme-classic`
  - [#7148](https://github.com/facebook/docusaurus/pull/7148) feat(preset-classic, content-docs/client): JSDoc ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-debug`, `docusaurus-preset-classic`
  - [#7122](https://github.com/facebook/docusaurus/pull/7122) feat(preset-classic): exclude debug plugin routes from sitemap ([@lex111](https://github.com/lex111))
- `docusaurus-theme-common`, `docusaurus-utils`, `docusaurus`
  - [#7113](https://github.com/facebook/docusaurus/pull/7113) test: improve test coverage ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-ideal-image`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus`
  - [#7080](https://github.com/facebook/docusaurus/pull/7080) refactor: replace non-prop interface with type; allow plugin lifecycles to have sync type ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-logger`, `docusaurus-plugin-content-docs`, `docusaurus`
  - [#7019](https://github.com/facebook/docusaurus/pull/7019) feat(logger): new "url" format, add double quotes around paths ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#7006](https://github.com/facebook/docusaurus/pull/7006) refactor: split and cleanup theme/DocPage ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#7005](https://github.com/facebook/docusaurus/pull/7005) refactor: split DocSidebarItem by item type ([@slorber](https://github.com/slorber))

#### :memo: Documentation

- `docusaurus-logger`
  - [#7305](https://github.com/facebook/docusaurus/pull/7305) docs: update docs for logger, add API docs to website ([@Josh-Cena](https://github.com/Josh-Cena))
- Other
  - [#7284](https://github.com/facebook/docusaurus/pull/7284) docs: add a paragraph about SSR as an optimization technique ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7278](https://github.com/facebook/docusaurus/pull/7278) docs: enhance docs about Markdown TOC and metadata ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7271](https://github.com/facebook/docusaurus/pull/7271) docs: specify Node version requirement to a minor ([@DanRoscigno](https://github.com/DanRoscigno))
  - [#7252](https://github.com/facebook/docusaurus/pull/7252) docs: update gtag docs to reflect what a GA4 tag looks like ([@johnnyreilly](https://github.com/johnnyreilly))
  - [#7240](https://github.com/facebook/docusaurus/pull/7240) docs: add PCC Archive site to showcase ([@CuratorCat](https://github.com/CuratorCat))
  - [#7239](https://github.com/facebook/docusaurus/pull/7239) docs: add Chaos mesh site to showcase ([@cwen0](https://github.com/cwen0))
  - [#7235](https://github.com/facebook/docusaurus/pull/7235) docs: add TiDB community books to showcase ([@shczhen](https://github.com/shczhen))
  - [#7236](https://github.com/facebook/docusaurus/pull/7236) docs: add documentation about pluralization ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7230](https://github.com/facebook/docusaurus/pull/7230) docs: add OSS Insight to showcase ([@sykp241095](https://github.com/sykp241095))
  - [#7208](https://github.com/facebook/docusaurus/pull/7208) docs: remove mention of "template" from README installation guide ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7159](https://github.com/facebook/docusaurus/pull/7159) docs: explain more clearly the purpose of a ref sidebar type ([@andrewnicols](https://github.com/andrewnicols))
  - [#7126](https://github.com/facebook/docusaurus/pull/7126) docs: multiple documentation improvements ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7123](https://github.com/facebook/docusaurus/pull/7123) refactor(showcase): enforce descriptions with maximum length of 120 characters ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7026](https://github.com/facebook/docusaurus/pull/7026) docs: correct plugin example filename ([@mxhdx](https://github.com/mxhdx))
  - [#7110](https://github.com/facebook/docusaurus/pull/7110) docs: add a note about additional languages needing to be Prism component names ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6746](https://github.com/facebook/docusaurus/pull/6746) fix(website): lazy-load YT iframe ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7061](https://github.com/facebook/docusaurus/pull/7061) docs: add docusaurus-plugin-typedoc to resources ([@nartc](https://github.com/nartc))
  - [#7059](https://github.com/facebook/docusaurus/pull/7059) docs: add firelordjs to showcase ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7050](https://github.com/facebook/docusaurus/pull/7050) docs: add import React statement in JSX file example ([@kaycebasques](https://github.com/kaycebasques))
  - [#7022](https://github.com/facebook/docusaurus/pull/7022) docs: add Easypanel to showcase ([@deiucanta](https://github.com/deiucanta))
  - [#7016](https://github.com/facebook/docusaurus/pull/7016) docs: consistently use sidebars.js filename ([@leedom92](https://github.com/leedom92))
  - [#7020](https://github.com/facebook/docusaurus/pull/7020) docs: add Divine WSF and Ghostly to showcase ([@LeviticusMB](https://github.com/LeviticusMB))
  - [#7000](https://github.com/facebook/docusaurus/pull/7000) docs: remove unnecessary semicolon ([@imsingh](https://github.com/imsingh))
- `docusaurus-plugin-content-docs`, `docusaurus-utils`
  - [#7248](https://github.com/facebook/docusaurus/pull/7248) refactor: normalize Markdown linkification behavior, elaborate in documentation ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-utils`
  - [#7081](https://github.com/facebook/docusaurus/pull/7081) docs: fix some casing inconsistencies ([@Josh-Cena](https://github.com/Josh-Cena))

#### :wrench: Maintenance

- Other
  - [#7309](https://github.com/facebook/docusaurus/pull/7309) chore: use "Maintenance" instead of "Internal" in changelog ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7300](https://github.com/facebook/docusaurus/pull/7300) misc: check doc page by Lighthouse CI ([@lex111](https://github.com/lex111))
  - [#7266](https://github.com/facebook/docusaurus/pull/7266) misc: add links section to PR template ([@slorber](https://github.com/slorber))
  - [#7224](https://github.com/facebook/docusaurus/pull/7224) chore: GitHub Actions cancel-in-progress ([@slorber](https://github.com/slorber))
  - [#7216](https://github.com/facebook/docusaurus/pull/7216) chore: remove netlify-cli from devDependencies ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7211](https://github.com/facebook/docusaurus/pull/7211) chore: replace node 17 with 18 in CI matrix ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7168](https://github.com/facebook/docusaurus/pull/7168) misc: add CI actions/dependency-review-action for security ([@slorber](https://github.com/slorber))
  - [#6984](https://github.com/facebook/docusaurus/pull/6984) misc: pin actions to a full-length commit SHA ([@naveensrinivasan](https://github.com/naveensrinivasan))
  - [#7002](https://github.com/facebook/docusaurus/pull/7002) chore: regen examples for 2.0 beta.18 ([@slorber](https://github.com/slorber))
- `docusaurus-logger`, `docusaurus-remark-plugin-npm2yarn`
  - [#7295](https://github.com/facebook/docusaurus/pull/7295) refactor: use export = syntax for Node utility packages ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#7293](https://github.com/facebook/docusaurus/pull/7293) refactor(types): move non-core, non-public types out of the types package ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-types`, `docusaurus`
  - [#7292](https://github.com/facebook/docusaurus/pull/7292) refactor(core): collocate CLI commands and their option types ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7084](https://github.com/facebook/docusaurus/pull/7084) refactor(core): code cleanup ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus`
  - [#7282](https://github.com/facebook/docusaurus/pull/7282) refactor(core): prefetch/preload refactor ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#7273](https://github.com/facebook/docusaurus/pull/7273) refactor(theme-classic): multiple re-arrangements ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7268](https://github.com/facebook/docusaurus/pull/7268) refactor(theme-classic): DocPage theme refactors polish ([@slorber](https://github.com/slorber))
  - [#7269](https://github.com/facebook/docusaurus/pull/7269) refactor: extract useSkipToContent() ([@slorber](https://github.com/slorber))
  - [#7175](https://github.com/facebook/docusaurus/pull/7175) refactor(theme-classic): split CodeBlock ([@slorber](https://github.com/slorber))
  - [#7067](https://github.com/facebook/docusaurus/pull/7067) refactor(theme-classic): extract doc-related navbar items' logic to theme-common ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7021](https://github.com/facebook/docusaurus/pull/7021) refactor(theme): extract plumbing code of BTT button into theme-common ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#7270](https://github.com/facebook/docusaurus/pull/7270) refactor(theme-classic): refactor TOC-related theme components ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#7220](https://github.com/facebook/docusaurus/pull/7220) refactor(cli): normalize the application of default option values ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7141](https://github.com/facebook/docusaurus/pull/7141) refactor(core): minor PendingNavigation refactor ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`
  - [#7243](https://github.com/facebook/docusaurus/pull/7243) chore: upgrade Jest to 28; add GitHub-actions reporter ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#7140](https://github.com/facebook/docusaurus/pull/7140) refactor(content-docs): split version handling into several files ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-theme-live-codeblock`, `docusaurus`
  - [#7194](https://github.com/facebook/docusaurus/pull/7194) fix: fix a few internal declaration semantic errors ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-migrate`, `docusaurus-theme-translations`, `docusaurus`
  - [#7186](https://github.com/facebook/docusaurus/pull/7186) refactor: prefer fs.readJSON over readFile.then(JSON.parse) ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`
  - [#7145](https://github.com/facebook/docusaurus/pull/7145) refactor: unify how MDX content types are represented ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#7138](https://github.com/facebook/docusaurus/pull/7138) chore: upgrade dependencies + upgrade React types ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-sitemap`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#7131](https://github.com/facebook/docusaurus/pull/7131) chore: disable string escaping in snapshots ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-content-blog`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#7054](https://github.com/facebook/docusaurus/pull/7054) refactor(core): refactor routes generation logic ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-types`, `docusaurus`
  - [#7042](https://github.com/facebook/docusaurus/pull/7042) refactor(core): reorganize files ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`, `docusaurus-utils`, `docusaurus`
  - [#7037](https://github.com/facebook/docusaurus/pull/7037) refactor(core): reorganize functions ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#7027](https://github.com/facebook/docusaurus/pull/7027) refactor(content-docs): deduplicate types, JSDoc for some APIs ([@Josh-Cena](https://github.com/Josh-Cena))

#### :running_woman: Performance

- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-utils-common`
  - [#7085](https://github.com/facebook/docusaurus/pull/7085) refactor: mark a few client-side packages as side-effect-free ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-remark-plugin-npm2yarn`
  - [#4997](https://github.com/facebook/docusaurus/pull/4997) perf(mdx-loader): cache mdx/remark compiler instances ([@phryneas](https://github.com/phryneas))

#### Committers: 47

- Aaron Nwabuoku ([@aerovulpe](https://github.com/aerovulpe))
- AkiraVoid ([@AkiraVoid](https://github.com/AkiraVoid))
- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Andrei Canta ([@deiucanta](https://github.com/deiucanta))
- Andrew Lyons ([@andrewnicols](https://github.com/andrewnicols))
- ApsarasX ([@ApsarasX](https://github.com/ApsarasX))
- Chau Tran ([@nartc](https://github.com/nartc))
- Chinazaekpere Ngubo ([@dr-ngubo](https://github.com/dr-ngubo))
- Cwen Yin ([@cwen0](https://github.com/cwen0))
- Dan Roscigno ([@DanRoscigno](https://github.com/DanRoscigno))
- Elias Papavasileiou ([@elias-pap](https://github.com/elias-pap))
- Evan ([@sulu5890](https://github.com/sulu5890))
- Fusang❀ ([@cxOrz](https://github.com/cxOrz))
- Indermohan Singh ([@imsingh](https://github.com/imsingh))
- JMW ([@JohnnyMcWeed](https://github.com/JohnnyMcWeed))
- Jeffrey Aven ([@jeffreyaven](https://github.com/jeffreyaven))
- Jody Heavener ([@jodyheavener](https://github.com/jodyheavener))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Karl Ward ([@mjau-mjau](https://github.com/mjau-mjau))
- Kayce Basques ([@kaycebasques](https://github.com/kaycebasques))
- Leedom ([@leedom92](https://github.com/leedom92))
- Lenz Weber-Tronic ([@phryneas](https://github.com/phryneas))
- Lukas Bach ([@lukasbach](https://github.com/lukasbach))
- Martin Blom ([@LeviticusMB](https://github.com/LeviticusMB))
- Naveen ([@naveensrinivasan](https://github.com/naveensrinivasan))
- Pablo Cordon ([@pcordon](https://github.com/pcordon))
- Pierre-Gilles Leymarie ([@Pierre-Gilles](https://github.com/Pierre-Gilles))
- Qi Zhang ([@zzzhangqi](https://github.com/zzzhangqi))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Viktor Chernodub ([@chernodub](https://github.com/chernodub))
- Zac A ([@sandypockets](https://github.com/sandypockets))
- [@Dr-Electron](https://github.com/Dr-Electron)
- [@chelproc](https://github.com/chelproc)
- [@deployn](https://github.com/deployn)
- [@duanwilliam](https://github.com/duanwilliam)
- [@kgolubic](https://github.com/kgolubic)
- [@redhat123456](https://github.com/redhat123456)
- [@surendran82](https://github.com/surendran82)
- [@svix-ken](https://github.com/svix-ken)
- apq ([@AntonPalmqvist](https://github.com/AntonPalmqvist))
- curatorcat.pcc.eth ([@CuratorCat](https://github.com/CuratorCat))
- czhen ([@shczhen](https://github.com/shczhen))
- loic ([@layerzzzio](https://github.com/layerzzzio))
- mehdim ([@mxhdx](https://github.com/mxhdx))
- rev ([@rev4324](https://github.com/rev4324))
- sykp241095 ([@sykp241095](https://github.com/sykp241095))

## 2.0.0-beta.18 (2022-03-25)

#### :rocket: New Feature

- `docusaurus-mdx-loader`, `docusaurus-theme-classic`
  - [#6990](https://github.com/facebook/docusaurus/pull/6990) feat: lazy-load external images + ability to customize image display ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus`
  - [#6933](https://github.com/facebook/docusaurus/pull/6933) feat(core,theme): useRouteContext + HtmlClassNameProvider ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus`
  - [#6921](https://github.com/facebook/docusaurus/pull/6921) feat(core): allow plugin lifecycles to return relative paths ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#6697](https://github.com/facebook/docusaurus/pull/6697) feat: add SEO microdata for doc breadcrumbs ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6842](https://github.com/facebook/docusaurus/pull/6842) feat(theme-classic): MDXContent wrapper component ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`
  - [#6780](https://github.com/facebook/docusaurus/pull/6780) feat(content-docs): allow custom props through _category_.json ([@taejs](https://github.com/taejs))

#### :boom: Breaking Change

- `docusaurus-plugin-content-docs`
  - [#6859](https://github.com/facebook/docusaurus/pull/6859) feat(content-docs): autogenerate category with linked doc metadata as fallback ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#6989](https://github.com/facebook/docusaurus/pull/6989) refactor: extract MDX components ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#6925](https://github.com/facebook/docusaurus/pull/6925) refactor(theme-{classic,common}): refactor site/page/search metadata + apply className on html element ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#6895](https://github.com/facebook/docusaurus/pull/6895) refactor(theme-{classic,common}): split navbar into smaller components + cleanup + swizzle config ([@slorber](https://github.com/slorber))
  - [#6930](https://github.com/facebook/docusaurus/pull/6930) refactor(theme-{classic,common}): refactor ColorModeToggle + useColorMode() hook ([@lex111](https://github.com/lex111))

#### :bug: Bug Fix

- `docusaurus`
  - [#6993](https://github.com/facebook/docusaurus/pull/6993) fix(core): prevent useBaseUrl returning /base/base when on /base ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6936](https://github.com/facebook/docusaurus/pull/6936) fix: remove semicolon from HTML output ([@lex111](https://github.com/lex111))
  - [#6849](https://github.com/facebook/docusaurus/pull/6849) fix(cli): write-heading-id should not generate colliding slugs when not overwriting ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#6983](https://github.com/facebook/docusaurus/pull/6983) fix(search): bump Infima, fix search issue due to broken CSS selector ([@slorber](https://github.com/slorber))
- `docusaurus-utils-validation`
  - [#6977](https://github.com/facebook/docusaurus/pull/6977) fix(validation): allow non-object params to remark/rehype plugins ([@aloisklink](https://github.com/aloisklink))
- `docusaurus-plugin-content-docs`, `docusaurus-utils`
  - [#6973](https://github.com/facebook/docusaurus/pull/6973) fix(content-docs): suppress git error on multiple occurrences ([@felipecrs](https://github.com/felipecrs))
- `docusaurus-plugin-content-blog`
  - [#6947](https://github.com/facebook/docusaurus/pull/6947) fix(content-blog): only create archive route if there are blog posts ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6918](https://github.com/facebook/docusaurus/pull/6918) fix(content-blog): remove double leading slash in blog-only paginated view ([@heowc](https://github.com/heowc))
- `docusaurus-theme-search-algolia`
  - [#6888](https://github.com/facebook/docusaurus/pull/6888) fix(theme-algolia): declare content-docs as dependency ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-translations`
  - [#6847](https://github.com/facebook/docusaurus/pull/6847) fix: minor Chinese translation fixes ([@rccttwd](https://github.com/rccttwd))

#### :nail_care: Polish

- `docusaurus-plugin-content-docs`
  - [#6859](https://github.com/facebook/docusaurus/pull/6859) feat(content-docs): autogenerate category with linked doc metadata as fallback ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6887](https://github.com/facebook/docusaurus/pull/6887) fix(content-docs): give context about sidebar loading failure ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`, `docusaurus-utils-validation`, `docusaurus`
  - [#6997](https://github.com/facebook/docusaurus/pull/6997) fix(validation): improve error messages for a few schemas ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#6971](https://github.com/facebook/docusaurus/pull/6971) refactor: improve a11y of dropdown menu ([@lex111](https://github.com/lex111))
  - [#6987](https://github.com/facebook/docusaurus/pull/6987) refactor(theme-classic): cleanup of code blocks ([@lex111](https://github.com/lex111))
  - [#6950](https://github.com/facebook/docusaurus/pull/6950) refactor(theme-classic): clean up CSS of doc cards ([@lex111](https://github.com/lex111))
  - [#6994](https://github.com/facebook/docusaurus/pull/6994) refactor: better external link icon positioning ([@lex111](https://github.com/lex111))
  - [#6989](https://github.com/facebook/docusaurus/pull/6989) refactor: extract MDX components ([@slorber](https://github.com/slorber))
  - [#6985](https://github.com/facebook/docusaurus/pull/6985) refactor(theme-classic): remove span wrappers from layout links ([@lex111](https://github.com/lex111))
  - [#6986](https://github.com/facebook/docusaurus/pull/6986) fix(theme-classic): minor code copy button improvements ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6964](https://github.com/facebook/docusaurus/pull/6964) refactor: replace text-based copy code button with icons ([@lex111](https://github.com/lex111))
  - [#6932](https://github.com/facebook/docusaurus/pull/6932) refactor(theme-classic): little breadcrumbs improvements ([@lex111](https://github.com/lex111))
  - [#6914](https://github.com/facebook/docusaurus/pull/6914) feat(theme-classic): set aria-expanded on expandable sidebar categories ([@pkowaluk](https://github.com/pkowaluk))
  - [#6844](https://github.com/facebook/docusaurus/pull/6844) refactor(theme-classic): split sidebar into smaller parts ([@slorber](https://github.com/slorber))
  - [#6846](https://github.com/facebook/docusaurus/pull/6846) refactor(theme-classic): consistently add span wrapper for layout links ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#6980](https://github.com/facebook/docusaurus/pull/6980) feat(utils): JSDoc for all APIs ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-common`
  - [#6974](https://github.com/facebook/docusaurus/pull/6974) feat(theme-common): JSDoc for all APIs ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#6784](https://github.com/facebook/docusaurus/pull/6784) feat(core): allow configureWebpack to return undefined ([@yorkie](https://github.com/yorkie))
  - [#6941](https://github.com/facebook/docusaurus/pull/6941) refactor(core): improve error message when a page has no default-export ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6878](https://github.com/facebook/docusaurus/pull/6878) fix(core): ensure stable webpack theme aliases sorting ([@jrvidal](https://github.com/jrvidal))
  - [#6854](https://github.com/facebook/docusaurus/pull/6854) fix(core): fix swizzle legend typo ([@DigiPie](https://github.com/DigiPie))
  - [#6850](https://github.com/facebook/docusaurus/pull/6850) fix(core): make plugin lifecycles consistently bound to the plugin instance ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-utils`
  - [#6937](https://github.com/facebook/docusaurus/pull/6937) fix(content-docs): warn when files are not tracked ([@felipecrs](https://github.com/felipecrs))
- `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#6925](https://github.com/facebook/docusaurus/pull/6925) refactor(theme-{classic,common}): refactor site/page/search metadata + apply className on html element ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#6895](https://github.com/facebook/docusaurus/pull/6895) refactor(theme-{classic,common}): split navbar into smaller components + cleanup + swizzle config ([@slorber](https://github.com/slorber))
  - [#6930](https://github.com/facebook/docusaurus/pull/6930) refactor(theme-{classic,common}): refactor ColorModeToggle + useColorMode() hook ([@lex111](https://github.com/lex111))
  - [#6894](https://github.com/facebook/docusaurus/pull/6894) refactor(theme-classic): split theme footer into smaller components + swizzle config ([@slorber](https://github.com/slorber))
- `docusaurus-types`, `docusaurus`
  - [#6929](https://github.com/facebook/docusaurus/pull/6929) refactor(core): minor routes type improvement ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`
  - [#6928](https://github.com/facebook/docusaurus/pull/6928) chore(pwa, sitemap, client-redirects, ideal-image): JSDoc for types ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`, `docusaurus-utils`
  - [#6922](https://github.com/facebook/docusaurus/pull/6922) refactor(content-blog): clean up type definitions; in-code documentation ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-translations`
  - [#6781](https://github.com/facebook/docusaurus/pull/6781) feat(theme-translations): complete Russian translations ([@dragomano](https://github.com/dragomano))
  - [#6877](https://github.com/facebook/docusaurus/pull/6877) chore(theme-translations): complete Vietnamese translations ([@datlechin](https://github.com/datlechin))
- `docusaurus-plugin-content-blog`
  - [#6909](https://github.com/facebook/docusaurus/pull/6909) refactor(content-blog): improve error message of authors map validation ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`
  - [#6860](https://github.com/facebook/docusaurus/pull/6860) fix(create): load entry file after node version checking ([@taejs](https://github.com/taejs))

#### :memo: Documentation

- Other
  - [#6988](https://github.com/facebook/docusaurus/pull/6988) docs: fix example admonition syntax ([@kaycebasques](https://github.com/kaycebasques))
  - [#6978](https://github.com/facebook/docusaurus/pull/6978) docs: npm run tsc -> npx tsc ([@jadonn](https://github.com/jadonn))
  - [#6952](https://github.com/facebook/docusaurus/pull/6952) docs: add K3ai to showcase ([@alefesta](https://github.com/alefesta))
  - [#6948](https://github.com/facebook/docusaurus/pull/6948) docs: add pdfme docs to showcase ([@hand-dot](https://github.com/hand-dot))
  - [#6943](https://github.com/facebook/docusaurus/pull/6943) docs: add SeaORM docs to showcase ([@billy1624](https://github.com/billy1624))
  - [#6926](https://github.com/facebook/docusaurus/pull/6926) docs: clarify the usage of slug ([@kaycebasques](https://github.com/kaycebasques))
  - [#6911](https://github.com/facebook/docusaurus/pull/6911) docs: add Reactive Button site to showcase ([@arifszn](https://github.com/arifszn))
  - [#6904](https://github.com/facebook/docusaurus/pull/6904) docs: update image for digital support services ([@PatelN123](https://github.com/PatelN123))
  - [#6892](https://github.com/facebook/docusaurus/pull/6892) docs: add EduLinks site to showcase ([@odarpi](https://github.com/odarpi))
  - [#6889](https://github.com/facebook/docusaurus/pull/6889) docs: editorial fixes ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6883](https://github.com/facebook/docusaurus/pull/6883) docs(cli): add info about development on github codespaces ([@vedantmgoyal2009](https://github.com/vedantmgoyal2009))
  - [#6856](https://github.com/facebook/docusaurus/pull/6856) docs: add Reddit Image Fetcher site to showcase ([@arifszn](https://github.com/arifszn))
  - [#6875](https://github.com/facebook/docusaurus/pull/6875) docs: update TRPG Engine showcase ([@moonrailgun](https://github.com/moonrailgun))
  - [#6871](https://github.com/facebook/docusaurus/pull/6871) docs: mark clutch and gulp as open-source ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6862](https://github.com/facebook/docusaurus/pull/6862) docs: update showcase data ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6837](https://github.com/facebook/docusaurus/pull/6837) docs: add PcapPlusPlus to showcase ([@seladb](https://github.com/seladb))
  - [#6832](https://github.com/facebook/docusaurus/pull/6832) docs: add Spicetify site to showcase ([@afonsojramos](https://github.com/afonsojramos))
  - [#6830](https://github.com/facebook/docusaurus/pull/6830) docs: simplify imported code blocks syntax ([@nathan-contino-mongo](https://github.com/nathan-contino-mongo))
- `docusaurus-types`
  - [#6881](https://github.com/facebook/docusaurus/pull/6881) docs: mention configureWebpack devServer return value ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`
  - [#6833](https://github.com/facebook/docusaurus/pull/6833) docs: make tutorial code block directly copyable ([@samgutentag](https://github.com/samgutentag))

#### :house: Internal

- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#6995](https://github.com/facebook/docusaurus/pull/6995) refactor: ensure all types are using index signature instead of Record ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-cssnano-preset`, `docusaurus-plugin-pwa`, `docusaurus-theme-search-algolia`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#6991](https://github.com/facebook/docusaurus/pull/6991) chore: upgrade dependencies ([@Josh-Cena](https://github.com/Josh-Cena))
- `lqip-loader`
  - [#6992](https://github.com/facebook/docusaurus/pull/6992) refactor(lqip-loader): remove unused palette option ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#6975](https://github.com/facebook/docusaurus/pull/6975) chore: update static-site-generator-webpack-plugin ([@slorber](https://github.com/slorber))
- `stylelint-copyright`
  - [#6967](https://github.com/facebook/docusaurus/pull/6967) chore: publish stylelint-copyright again ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus`
  - [#6961](https://github.com/facebook/docusaurus/pull/6961) refactor: unify how validateOptions is handled ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-types`
  - [#6957](https://github.com/facebook/docusaurus/pull/6957) chore(types): remove querystring from dependencies ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-common`, `docusaurus`
  - [#6956](https://github.com/facebook/docusaurus/pull/6956) test: improve test coverage; reorder theme-common files ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6955](https://github.com/facebook/docusaurus/pull/6955) refactor(core): move browserContext and docusaurusContext out of client exports ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6944](https://github.com/facebook/docusaurus/pull/6944) chore: migrate Jest and website to SWC ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-utils`
  - [#6951](https://github.com/facebook/docusaurus/pull/6951) test: fix Windows test for gitUtils ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-translations`, `docusaurus-utils`, `docusaurus`, `stylelint-copyright`
  - [#6931](https://github.com/facebook/docusaurus/pull/6931) chore: tighten ESLint config ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`
  - [#6924](https://github.com/facebook/docusaurus/pull/6924) refactor(client-redirects): migrate validation to validateOptions lifecycle ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-cssnano-preset`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#6916](https://github.com/facebook/docusaurus/pull/6916) chore: upgrade dependencies ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-plugin-content-docs`, `docusaurus-theme-translations`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `stylelint-copyright`
  - [#6912](https://github.com/facebook/docusaurus/pull/6912) test: improve test coverage; multiple internal refactors ([@Josh-Cena](https://github.com/Josh-Cena))
- Other
  - [#6910](https://github.com/facebook/docusaurus/pull/6910) refactor: convert Jest infrastructure to TS ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6838](https://github.com/facebook/docusaurus/pull/6838) fix(website): changelog plugin leads to CI bugs on release ([@slorber](https://github.com/slorber))
- `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils`, `docusaurus`
  - [#6908](https://github.com/facebook/docusaurus/pull/6908) chore: do not print prototype in jest snapshot ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-migrate`, `docusaurus-plugin-content-docs`, `docusaurus-theme-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#6906](https://github.com/facebook/docusaurus/pull/6906) refactor: install eslint-plugin-regexp ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-docs`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus-utils`, `docusaurus`
  - [#6905](https://github.com/facebook/docusaurus/pull/6905) test: improve test coverage; properly test core client APIs ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-sitemap`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-translations`, `docusaurus-utils`, `docusaurus`
  - [#6903](https://github.com/facebook/docusaurus/pull/6903) chore: spell-check test files ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus-utils-common`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#6902](https://github.com/facebook/docusaurus/pull/6902) test(theme-common): improve test coverage ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-cssnano-preset`, `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-sitemap`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`, `stylelint-copyright`
  - [#6900](https://github.com/facebook/docusaurus/pull/6900) test: enable a few jest eslint rules ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-translations`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#6898](https://github.com/facebook/docusaurus/pull/6898) refactor: import jest as global; unify import style of some modules ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#6891](https://github.com/facebook/docusaurus/pull/6891) refactor(theme-classic): avoid using clsx class dict with CSS modules ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-translations`, `docusaurus-utils`, `docusaurus`
  - [#6880](https://github.com/facebook/docusaurus/pull/6880) refactor: prefer fs.outputFile to ensureDir + writeFile ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-pwa`, `docusaurus-types`, `docusaurus`
  - [#6866](https://github.com/facebook/docusaurus/pull/6866) refactor: improve types ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus`, `lqip-loader`
  - [#6864](https://github.com/facebook/docusaurus/pull/6864) refactor: remove unnecessary default values normalized during validation ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-migrate`, `docusaurus`
  - [#6861](https://github.com/facebook/docusaurus/pull/6861) refactor: make JS executables included in the tsconfig for editor hints ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-types`, `docusaurus`
  - [#6857](https://github.com/facebook/docusaurus/pull/6857) test: improve test coverage ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus-utils-common`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#6852](https://github.com/facebook/docusaurus/pull/6852) refactor: enable a few TS flags ([@Josh-Cena](https://github.com/Josh-Cena))

#### Committers: 28

- Afonso Jorge Ramos ([@afonsojramos](https://github.com/afonsojramos))
- Alessandro Festa ([@alefesta](https://github.com/alefesta))
- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Alois Klink ([@aloisklink](https://github.com/aloisklink))
- Ariful Alam ([@arifszn](https://github.com/arifszn))
- Begula ([@vedantmgoyal2009](https://github.com/vedantmgoyal2009))
- Billy Chan ([@billy1624](https://github.com/billy1624))
- Bugo ([@dragomano](https://github.com/dragomano))
- Evan ([@DigiPie](https://github.com/DigiPie))
- Felipe Santos ([@felipecrs](https://github.com/felipecrs))
- Jadon N ([@jadonn](https://github.com/jadonn))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Kayce Basques ([@kaycebasques](https://github.com/kaycebasques))
- Kyohei Fukuda ([@hand-dot](https://github.com/hand-dot))
- Nayan Patel ([@PatelN123](https://github.com/PatelN123))
- Ngô Quốc Đạt ([@datlechin](https://github.com/datlechin))
- Odarpi ([@odarpi](https://github.com/odarpi))
- Pawel Kowaluk ([@pkowaluk](https://github.com/pkowaluk))
- Roberto Vidal ([@jrvidal](https://github.com/jrvidal))
- Sam Gutentag ([@samgutentag](https://github.com/samgutentag))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tsz W. TAM ([@rccttwd](https://github.com/rccttwd))
- WonChul Heo ([@heowc](https://github.com/heowc))
- Yorkie Liu ([@yorkie](https://github.com/yorkie))
- [@seladb](https://github.com/seladb)
- moonrailgun ([@moonrailgun](https://github.com/moonrailgun))
- nate contino ([@nathan-contino-mongo](https://github.com/nathan-contino-mongo))
- tae ([@taejs](https://github.com/taejs))

## 2.0.0-beta.17 (2022-03-03)

#### :rocket: New Feature

- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`
  - [#6783](https://github.com/facebook/docusaurus/pull/6783) feat: allow blog authors email ([@Josh-Cena](https://github.com/Josh-Cena))

#### :boom: Breaking Change

- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#6771](https://github.com/facebook/docusaurus/pull/6771) refactor(theme-classic): replace color mode toggle with button; remove switchConfig ([@Josh-Cena](https://github.com/Josh-Cena))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#6827](https://github.com/facebook/docusaurus/pull/6827) fix(theme-classic): restore docusaurus search meta ([@slorber](https://github.com/slorber))
  - [#6767](https://github.com/facebook/docusaurus/pull/6767) fix(theme-classic): allow code tags containing inline elements to stay inline ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-common`
  - [#6824](https://github.com/facebook/docusaurus/pull/6824) fix(theme-common): breadcrumbs home bug in docs-only ([@slorber](https://github.com/slorber))
  - [#6816](https://github.com/facebook/docusaurus/pull/6816) fix(theme-common): docs breadcrumbs not working with baseUrl ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`
  - [#6700](https://github.com/facebook/docusaurus/pull/6700) fix(content-docs): always sort autogenerated sidebar items by file/folder name by default ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#6812](https://github.com/facebook/docusaurus/pull/6812) fix(core): remove hash/query when filtering existing files for broken link check ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`
  - [#6779](https://github.com/facebook/docusaurus/pull/6779) fix(mdx-loader): suppress image reading warning in Yarn PnP; log warning instead of error ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`
  - [#6762](https://github.com/facebook/docusaurus/pull/6762) fix(create): update broken SVG paths in templates ([@anicholls](https://github.com/anicholls))

#### :nail_care: Polish

- `docusaurus-theme-common`
  - [#6826](https://github.com/facebook/docusaurus/pull/6826) refactor(theme-common): unify missing context errors ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#6771](https://github.com/facebook/docusaurus/pull/6771) refactor(theme-classic): replace color mode toggle with button; remove switchConfig ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#6769](https://github.com/facebook/docusaurus/pull/6769) refactor(theme-classic): use Material icon for language dropdown ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`
  - [#6792](https://github.com/facebook/docusaurus/pull/6792) fix(mdx-loader): allow image paths to be URL encoded ([@Josh-Cena](https://github.com/Josh-Cena))

#### :memo: Documentation

- Other
  - [#6825](https://github.com/facebook/docusaurus/pull/6825) docs: Adds Netlify one click deploy to README ([@PatelN123](https://github.com/PatelN123))
  - [#6818](https://github.com/facebook/docusaurus/pull/6818) docs: add deploy with vercel button to README ([@PatelN123](https://github.com/PatelN123))
  - [#6817](https://github.com/facebook/docusaurus/pull/6817) docs: fix broken links ([@PatelN123](https://github.com/PatelN123))
  - [#6811](https://github.com/facebook/docusaurus/pull/6811) docs: add homepage banner in support of Ukraine ([@dmitryvinn](https://github.com/dmitryvinn))
  - [#6813](https://github.com/facebook/docusaurus/pull/6813) docs: mark dyte as opensource in showcase ([@vaibhavshn](https://github.com/vaibhavshn))
  - [#6776](https://github.com/facebook/docusaurus/pull/6776) docs: make GitHub actions explanation aligned with the code ([@arifszn](https://github.com/arifszn))
  - [#6772](https://github.com/facebook/docusaurus/pull/6772) docs: add basic documentation about client modules ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`
  - [#6815](https://github.com/facebook/docusaurus/pull/6815) fix: consistently use `max-width: 996px` in media queries ([@dstotijn](https://github.com/dstotijn))

#### :house: Internal

- `docusaurus-plugin-content-docs`
  - [#6821](https://github.com/facebook/docusaurus/pull/6821) test(content-docs): refactor navigation test snapshot ([@Josh-Cena](https://github.com/Josh-Cena))
- Other
  - [#6768](https://github.com/facebook/docusaurus/pull/6768) test: add TypeScript template to E2E test matrix ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-utils`
  - [#6773](https://github.com/facebook/docusaurus/pull/6773) refactor(utils): categorize functions into separate files ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-migrate`
  - [#6761](https://github.com/facebook/docusaurus/pull/6761) chore: various internal fixes ([@Josh-Cena](https://github.com/Josh-Cena))

#### Committers: 8

- Alex Nicholls ([@anicholls](https://github.com/anicholls))
- Ariful Alam ([@arifszn](https://github.com/arifszn))
- David Stotijn ([@dstotijn](https://github.com/dstotijn))
- Dmitry Vinnik ([@dmitryvinn](https://github.com/dmitryvinn))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Nayan Patel ([@PatelN123](https://github.com/PatelN123))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Vaibhav Shinde ([@vaibhavshn](https://github.com/vaibhavshn))

## 2.0.0-beta.16 (2022-02-25)

#### :rocket: New Feature

- `docusaurus-logger`, `docusaurus-module-type-aliases`, `docusaurus-plugin-debug`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus`
  - [#6243](https://github.com/facebook/docusaurus/pull/6243) feat(core): brand new swizzle CLI experience ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`
  - [#6750](https://github.com/facebook/docusaurus/pull/6750) feat(create): new --package-manager option; interactive package manager selection ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6610](https://github.com/facebook/docusaurus/pull/6610) feat(create): allow specifying a git clone strategy ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#6723](https://github.com/facebook/docusaurus/pull/6723) feat: sync color mode between browser tabs ([@lex111](https://github.com/lex111))
- `docusaurus-theme-search-algolia`
  - [#6692](https://github.com/facebook/docusaurus/pull/6692) feat(search-algolia): allow disabling search page and configuring path ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#6517](https://github.com/facebook/docusaurus/pull/6517) feat(docs,theme-classic): docs breadcrumbs ([@jodyheavener](https://github.com/jodyheavener))
  - [#6519](https://github.com/facebook/docusaurus/pull/6519) feat(content-docs): sidebar item type "html" for rendering pure markup ([@jodyheavener](https://github.com/jodyheavener))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-utils`
  - [#6593](https://github.com/facebook/docusaurus/pull/6593) feat(content-blog): infer blog post date from git history ([@felipecrs](https://github.com/felipecrs))
- `docusaurus-plugin-content-docs`
  - [#6619](https://github.com/facebook/docusaurus/pull/6619) feat(content-docs): add custom props front matter ([@TheCatLady](https://github.com/TheCatLady))
  - [#6452](https://github.com/facebook/docusaurus/pull/6452) feat(content-docs): allow explicitly disabling index page for generated category ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`
  - [#6603](https://github.com/facebook/docusaurus/pull/6603) feat(content-blog): allow customizing blog archive component through option ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`
  - [#6221](https://github.com/facebook/docusaurus/pull/6221) feat(content-blog): Allow pagination for BlogTagsPostsPage ([@redhoyasa](https://github.com/redhoyasa))

#### :boom: Breaking Change

- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils`, `docusaurus`, `stylelint-copyright`
  - [#6752](https://github.com/facebook/docusaurus/pull/6752) chore: upgrade docsearch-react to v3 stable, bump dependencies ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`
  - [#6729](https://github.com/facebook/docusaurus/pull/6729) refactor: make MDX export a flat TOC list instead of tree ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus`
  - [#6740](https://github.com/facebook/docusaurus/pull/6740) refactor: remove deprecated Webpack utils & validation escape hatch ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`
  - [#6707](https://github.com/facebook/docusaurus/pull/6707) refactor(theme-classic): bias again search metadata toward Algolia DocSearch ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`, `docusaurus-theme-common`, `docusaurus`
  - [#6651](https://github.com/facebook/docusaurus/pull/6651) refactor: reduce exported members of docusaurus router ([@Josh-Cena](https://github.com/Josh-Cena))

#### :bug: Bug Fix

- `docusaurus-theme-common`
  - [#6758](https://github.com/facebook/docusaurus/pull/6758) fix(theme-common): isSamePath should be case-insensitive ([@slorber](https://github.com/slorber))
  - [#6748](https://github.com/facebook/docusaurus/pull/6748) fix(theme-classic): temporarily disable toc heading autoscrolling ([@slorber](https://github.com/slorber))
  - [#6696](https://github.com/facebook/docusaurus/pull/6696) fix(theme-common): do not run useLocationChange when hot reloading ([@lex111](https://github.com/lex111))
  - [#6490](https://github.com/facebook/docusaurus/pull/6490) fix(theme-classic): do not switch color modes when printing ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#6749](https://github.com/facebook/docusaurus/pull/6749) fix(theme-classic): fix breadcrumb home link bug with new useHomePageRoute() hook ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`
  - [#6720](https://github.com/facebook/docusaurus/pull/6720) fix(content-docs): create assets for frontmatter images ([@lebalz](https://github.com/lebalz))
  - [#6592](https://github.com/facebook/docusaurus/pull/6592) fix(content-docs): read last update from inner git repositories ([@felipecrs](https://github.com/felipecrs))
  - [#6477](https://github.com/facebook/docusaurus/pull/6477) fix(content-docs): export versioning utils ([@milesj](https://github.com/milesj))
- `docusaurus-mdx-loader`
  - [#6712](https://github.com/facebook/docusaurus/pull/6712) fix(mdx-loader): make headings containing links properly formatted in ToC ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#6701](https://github.com/facebook/docusaurus/pull/6701) fix(cli): disable directory listing in serve ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6607](https://github.com/facebook/docusaurus/pull/6607) fix(cli): log error itself on unhandled rejection ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6500](https://github.com/facebook/docusaurus/pull/6500) fix(cli): allow passing a list of file names to write-heading-ids ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6496](https://github.com/facebook/docusaurus/pull/6496) fix(core): configValidation should allow inline theme functions ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#6652](https://github.com/facebook/docusaurus/pull/6652) fix(theme-classic): minor BTT button fixes ([@lex111](https://github.com/lex111))
  - [#6612](https://github.com/facebook/docusaurus/pull/6612) fix(theme-classic): make Prism additional languages properly server-side rendered ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6599](https://github.com/facebook/docusaurus/pull/6599) fix(theme-classic): add docSidebar as allowed item in dropdown ([@homotechsual](https://github.com/homotechsual))
  - [#6531](https://github.com/facebook/docusaurus/pull/6531) fix(theme-classic): highlight active collapsible doc category properly ([@lex111](https://github.com/lex111))
  - [#6515](https://github.com/facebook/docusaurus/pull/6515) fix(theme-classic): add key prop for SimpleLinks map ([@kgajera](https://github.com/kgajera))
  - [#6508](https://github.com/facebook/docusaurus/pull/6508) fix(theme-classic): apply width/height for footer logos without href ([@kgajera](https://github.com/kgajera))
- `docusaurus-utils`
  - [#6617](https://github.com/facebook/docusaurus/pull/6617) fix(utils): convert Markdown links in reference-style links with multiple spaces ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6489](https://github.com/facebook/docusaurus/pull/6489) fix(utils): do not resolve Markdown paths with @site prefix ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6478](https://github.com/facebook/docusaurus/pull/6478) fix(utils): Markdown linkification match local paths beginning with http ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#6495](https://github.com/facebook/docusaurus/pull/6495) fix(content-docs): render category with no subitems as a normal link ([@Josh-Cena](https://github.com/Josh-Cena))

#### :nail_care: Polish

- `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#6755](https://github.com/facebook/docusaurus/pull/6755) refactor: unify error handling behavior ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`
  - [#6679](https://github.com/facebook/docusaurus/pull/6679) feat(create): better detection of package manager preference ([@lex111](https://github.com/lex111))
  - [#6481](https://github.com/facebook/docusaurus/pull/6481) refactor(init): promote good practices; use site alias ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`
  - [#6745](https://github.com/facebook/docusaurus/pull/6745) fix(content-docs): improve sidebar shorthand normalization error message ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6602](https://github.com/facebook/docusaurus/pull/6602) feat(content-docs): allow omitting enclosing array consistently for category shorthand ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6596](https://github.com/facebook/docusaurus/pull/6596) refactor(content-docs): clean up sidebars logic; validate generator returns ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6586](https://github.com/facebook/docusaurus/pull/6586) refactor(content-docs): read category metadata files before autogenerating ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus`
  - [#6730](https://github.com/facebook/docusaurus/pull/6730) refactor: declare all props as interfaces ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-translations`
  - [#6711](https://github.com/facebook/docusaurus/pull/6711) chore(theme-translations): complete Korean translations ([@revi](https://github.com/revi))
  - [#6686](https://github.com/facebook/docusaurus/pull/6686) fix(theme-translations): improve Korean translations ([@winterlood](https://github.com/winterlood))
  - [#6635](https://github.com/facebook/docusaurus/pull/6635) refactor(theme-translation): improve Traditional Chinese translation quality ([@toto6038](https://github.com/toto6038))
- `docusaurus-theme-classic`, `docusaurus-theme-translations`
  - [#6674](https://github.com/facebook/docusaurus/pull/6674) fix(theme-classic): improve aria label of color mode toggle ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-theme-classic`
  - [#6668](https://github.com/facebook/docusaurus/pull/6668) refactor: recommend using data-theme without html element selector ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#6622](https://github.com/facebook/docusaurus/pull/6622) refactor(theme-classic): clean up CSS of doc sidebar item ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#6644](https://github.com/facebook/docusaurus/pull/6644) fix(core): forward ref to Link's anchor element ([@koistya](https://github.com/koistya))
  - [#6646](https://github.com/facebook/docusaurus/pull/6646) fix(cli): make docusaurus clear also remove .yarn/.cache folder ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6306](https://github.com/facebook/docusaurus/pull/6306) feat(core): use react-helmet-async ([@seyoon20087](https://github.com/seyoon20087))
- `docusaurus-utils-validation`
  - [#6656](https://github.com/facebook/docusaurus/pull/6656) feat: allow numbers in plugin ID ([@cdemonchy-pro](https://github.com/cdemonchy-pro))
- `docusaurus-mdx-loader`, `docusaurus-utils`, `lqip-loader`
  - [#6650](https://github.com/facebook/docusaurus/pull/6650) refactor(utils): replace hash with contenthash for file loader ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus-utils-validation`, `docusaurus-utils`
  - [#6615](https://github.com/facebook/docusaurus/pull/6615) fix: remove more peer dependency warnings ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`
  - [#6598](https://github.com/facebook/docusaurus/pull/6598) feat: make Markdown images lazy loaded ([@johnnyreilly](https://github.com/johnnyreilly))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#6505](https://github.com/facebook/docusaurus/pull/6505) fix(theme-classic): make focused link outlined with JS disabled ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#6507](https://github.com/facebook/docusaurus/pull/6507) refactor: improve internal typing ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus-utils-validation`, `docusaurus-utils`
  - [#6498](https://github.com/facebook/docusaurus/pull/6498) fix: updating peerDependency fields for yarn berry ([@vidarc](https://github.com/vidarc))
- `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`
  - [#6482](https://github.com/facebook/docusaurus/pull/6482) feat: mark some text labels as translatable ([@Josh-Cena](https://github.com/Josh-Cena))

#### :memo: Documentation

- Other
  - [#6727](https://github.com/facebook/docusaurus/pull/6727) docs: add Blog Matheus Brunelli site to showcase ([@mrbrunelli](https://github.com/mrbrunelli))
  - [#6721](https://github.com/facebook/docusaurus/pull/6721) docs: add Butterfly Documentation to showcase ([@CodeDoctorDE](https://github.com/CodeDoctorDE))
  - [#6710](https://github.com/facebook/docusaurus/pull/6710) docs(website): Add techharvesting to showcase ([@NaseelNiyas](https://github.com/NaseelNiyas))
  - [#6708](https://github.com/facebook/docusaurus/pull/6708) docs: add doc for generated-index keyword/image metadata ([@slorber](https://github.com/slorber))
  - [#6709](https://github.com/facebook/docusaurus/pull/6709) docs(website): fix video responsiveness ([@lex111](https://github.com/lex111))
  - [#6687](https://github.com/facebook/docusaurus/pull/6687) docs: add deep dive video for Docusaurus ([@dmitryvinn](https://github.com/dmitryvinn))
  - [#6704](https://github.com/facebook/docusaurus/pull/6704) docs(website): search doc typo searchParameters ([@slorber](https://github.com/slorber))
  - [#6682](https://github.com/facebook/docusaurus/pull/6682) docs: add redux-cool site to showcase ([@Ruben-Arushanyan](https://github.com/Ruben-Arushanyan))
  - [#6677](https://github.com/facebook/docusaurus/pull/6677) docs: add Rivalis to showcase ([@kalevski](https://github.com/kalevski))
  - [#6676](https://github.com/facebook/docusaurus/pull/6676) docs: add SmartCookieWeb site to showcase ([@CookieJarApps](https://github.com/CookieJarApps))
  - [#6675](https://github.com/facebook/docusaurus/pull/6675) docs: mention that all official themes are TypeScript-covered ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6673](https://github.com/facebook/docusaurus/pull/6673) docs: mention about blog date in front matter ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6672](https://github.com/facebook/docusaurus/pull/6672) refactor(website): extract homepage data from UI; feature text updates ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6670](https://github.com/facebook/docusaurus/pull/6670) docs: add CyberDrain Improved Partner Portal (CIPP) to showcase ([@homotechsual](https://github.com/homotechsual))
  - [#6667](https://github.com/facebook/docusaurus/pull/6667) fix(website): make YT iframe responsive ([@lex111](https://github.com/lex111))
  - [#6659](https://github.com/facebook/docusaurus/pull/6659) docs: add eli5 video to home page ([@dmitryvinn-fb](https://github.com/dmitryvinn-fb))
  - [#6633](https://github.com/facebook/docusaurus/pull/6633) docs: improve wording of using Markdown file paths ([@BigDataWriter](https://github.com/BigDataWriter))
  - [#6624](https://github.com/facebook/docusaurus/pull/6624) docs: add Resoto & Some Engineering Inc. to showcase ([@TheCatLady](https://github.com/TheCatLady))
  - [#6611](https://github.com/facebook/docusaurus/pull/6611) docs: fix bad anchor link syntax ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6591](https://github.com/facebook/docusaurus/pull/6591) docs: improve GitHub Actions example jobs ([@ebarojas](https://github.com/ebarojas))
  - [#6426](https://github.com/facebook/docusaurus/pull/6426) feat(website): add Tweets section ([@yangshun](https://github.com/yangshun))
  - [#6532](https://github.com/facebook/docusaurus/pull/6532) docs: add SAP Cloud SDK to showcase ([@artemkovalyov](https://github.com/artemkovalyov))
  - [#6513](https://github.com/facebook/docusaurus/pull/6513) docs: clean up CONTRIBUTING ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6501](https://github.com/facebook/docusaurus/pull/6501) docs: add Cloudflare pages deployment guide ([@apidev234](https://github.com/apidev234))
  - [#6499](https://github.com/facebook/docusaurus/pull/6499) docs: mention how env vars can be read ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6492](https://github.com/facebook/docusaurus/pull/6492) docs: mention where to find the sitemap ([@tamalweb](https://github.com/tamalweb))
  - [#6491](https://github.com/facebook/docusaurus/pull/6491) docs: add developers.verida to showcase ([@nick-verida](https://github.com/nick-verida))
  - [#6414](https://github.com/facebook/docusaurus/pull/6414) feat(website): new plugin to load CHANGELOG and render as blog ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6404](https://github.com/facebook/docusaurus/pull/6404) docs: elaborate on Markdown asset linking; document pathname:// protocol ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6484](https://github.com/facebook/docusaurus/pull/6484) docs: remove mention that CDN resources are cached cross-domain ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6429](https://github.com/facebook/docusaurus/pull/6429) refactor: self-host KaTeX assets ([@pranabdas](https://github.com/pranabdas))
  - [#6483](https://github.com/facebook/docusaurus/pull/6483) docs: mark a lot of website texts as translatable ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-preset-classic`
  - [#6627](https://github.com/facebook/docusaurus/pull/6627) docs: fix presets documentation link ([@thedanielhanke](https://github.com/thedanielhanke))

#### :house: Internal

- `docusaurus-theme-classic`
  - [#6759](https://github.com/facebook/docusaurus/pull/6759) refactor(theme-classic): merge CSS files for Heading ([@slorber](https://github.com/slorber))
  - [#6584](https://github.com/facebook/docusaurus/pull/6584) misc: enable jsx-key eslint rule ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-migrate`
  - [#6756](https://github.com/facebook/docusaurus/pull/6756) test: sort migration test FS mock calls ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6609](https://github.com/facebook/docusaurus/pull/6609) refactor(migrate): change internal methods' parameter style ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6476](https://github.com/facebook/docusaurus/pull/6476) chore: fix Stylelint globs for editor support ([@nschonni](https://github.com/nschonni))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#6744](https://github.com/facebook/docusaurus/pull/6744) fix(content-docs): properly display collocated social card image ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus-types`, `docusaurus`
  - [#6742](https://github.com/facebook/docusaurus/pull/6742) refactor: improve client modules types ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`
  - [#6741](https://github.com/facebook/docusaurus/pull/6741) chore(module-type-aliases): add react as peer dependency ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6658](https://github.com/facebook/docusaurus/pull/6658) refactor(module-aliases): remove react-helmet dependency ([@Josh-Cena](https://github.com/Josh-Cena))
- Other
  - [#6726](https://github.com/facebook/docusaurus/pull/6726) misc: improve bug report template ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6512](https://github.com/facebook/docusaurus/pull/6512) misc: configure linguist behavior to show better language stats ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6487](https://github.com/facebook/docusaurus/pull/6487) chore: fix codesandbox example link + mention npm publish recovery ([@slorber](https://github.com/slorber))
  - [#6486](https://github.com/facebook/docusaurus/pull/6486) chore: update examples for beta.15 ([@slorber](https://github.com/slorber))
  - [#6485](https://github.com/facebook/docusaurus/pull/6485) fix(website): bad translate tags without default translation ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#6716](https://github.com/facebook/docusaurus/pull/6716) refactor: ensure lodash is default-imported ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-logger`, `docusaurus-migrate`, `docusaurus`
  - [#6661](https://github.com/facebook/docusaurus/pull/6661) refactor: convert CLI entry points to ESM; migrate create-docusaurus to ESM ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus-theme-common`, `docusaurus`
  - [#6651](https://github.com/facebook/docusaurus/pull/6651) refactor: reduce exported members of docusaurus router ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#6629](https://github.com/facebook/docusaurus/pull/6629) refactor: move module declarations for non-route components to theme-classic ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-pwa`, `docusaurus-theme-classic`
  - [#6614](https://github.com/facebook/docusaurus/pull/6614) refactor: remove Babel plugins that are included in preset-env ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-translations`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#6605](https://github.com/facebook/docusaurus/pull/6605) chore: fix ESLint warnings, restrict export all syntax ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`
  - [#6583](https://github.com/facebook/docusaurus/pull/6583) refactor(live-codeblock): migrate theme to TS ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-migrate`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-theme-common`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#6524](https://github.com/facebook/docusaurus/pull/6524) refactor: enforce named capture groups; clean up regexes ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-migrate`, `docusaurus-plugin-content-docs`, `docusaurus`
  - [#6521](https://github.com/facebook/docusaurus/pull/6521) refactor: mark all functions that import external modules as async ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-cssnano-preset`, `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-types`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `stylelint-copyright`
  - [#6514](https://github.com/facebook/docusaurus/pull/6514) chore: clean up ESLint config, enable a few rules ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-types`, `docusaurus`
  - [#6511](https://github.com/facebook/docusaurus/pull/6511) refactor(core): convert theme-fallback to TS ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-utils`
  - [#6506](https://github.com/facebook/docusaurus/pull/6506) test: add test for readOutputHTMLFile ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-migrate`, `docusaurus-theme-common`
  - [#6502](https://github.com/facebook/docusaurus/pull/6502) refactor: fix all eslint warnings ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus`
  - [#6474](https://github.com/facebook/docusaurus/pull/6474) test: rename 'fixtures' to '**fixtures**' ([@nschonni](https://github.com/nschonni))

#### :running_woman: Performance

- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils`, `docusaurus`
  - [#6725](https://github.com/facebook/docusaurus/pull/6725) refactor: convert all fs methods to async ([@Josh-Cena](https://github.com/Josh-Cena))

#### Committers: 38

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Artem Kovalov ([@artemkovalyov](https://github.com/artemkovalyov))
- Balthasar Hofer ([@lebalz](https://github.com/lebalz))
- Clement Demonchy ([@cdemonchy-pro](https://github.com/cdemonchy-pro))
- CodeDoctor ([@CodeDoctorDE](https://github.com/CodeDoctorDE))
- Daniel Hanke ([@thedanielhanke](https://github.com/thedanielhanke))
- Daniel Kalevski ([@kalevski](https://github.com/kalevski))
- Dmitry Vinnik ([@dmitryvinn](https://github.com/dmitryvinn))
- Dmitry Vinnik | Meta ([@dmitryvinn-fb](https://github.com/dmitryvinn-fb))
- Erick Zhao ([@erickzhao](https://github.com/erickzhao))
- Everardo J. Barojas M. ([@ebarojas](https://github.com/ebarojas))
- Felipe Santos ([@felipecrs](https://github.com/felipecrs))
- Gaurish ([@apidev234](https://github.com/apidev234))
- Hong Yongmin ([@revi](https://github.com/revi))
- Jody Heavener ([@jodyheavener](https://github.com/jodyheavener))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Kishan Gajera ([@kgajera](https://github.com/kgajera))
- Konstantin Tarkus ([@koistya](https://github.com/koistya))
- Matheus Ricardo Brunelli ([@mrbrunelli](https://github.com/mrbrunelli))
- Matthew Ailes ([@vidarc](https://github.com/vidarc))
- Mikey O'Toole ([@homotechsual](https://github.com/homotechsual))
- Miles Johnson ([@milesj](https://github.com/milesj))
- Muhammad Redho Ayassa ([@redhoyasa](https://github.com/redhoyasa))
- Naseel Niyas ([@NaseelNiyas](https://github.com/NaseelNiyas))
- Nick Schonning ([@nschonni](https://github.com/nschonni))
- Pranab Das ([@pranabdas](https://github.com/pranabdas))
- Ruben Arushanyan ([@Ruben-Arushanyan](https://github.com/Ruben-Arushanyan))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tamal Web ([@tamalweb](https://github.com/tamalweb))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))
- [@BigDataWriter](https://github.com/BigDataWriter)
- [@CookieJarApps](https://github.com/CookieJarApps)
- [@TheCatLady](https://github.com/TheCatLady)
- [@nick-verida](https://github.com/nick-verida)
- [@seyoon20087](https://github.com/seyoon20087)
- [@toto6038](https://github.com/toto6038)
- 이정환 ([@winterlood](https://github.com/winterlood))

## 2.0.0-beta.15 (2022-01-26)

#### :rocket: New Feature

- `docusaurus-plugin-content-docs`
  - [#6451](https://github.com/facebook/docusaurus/pull/6451) feat(content-docs): expose isCategoryIndex matcher to customize conventions ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5782](https://github.com/facebook/docusaurus/pull/5782) feat(content-docs): displayed_sidebar front matter ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#6466](https://github.com/facebook/docusaurus/pull/6466) feat(theme-classic): add stable class for DocSidebarContainer ([@homotechsual](https://github.com/homotechsual))
  - [#3811](https://github.com/facebook/docusaurus/pull/3811) feat(theme-classic): auto-collapse sibling categories in doc sidebar ([@josephriosIO](https://github.com/josephriosIO))
  - [#6216](https://github.com/facebook/docusaurus/pull/6216) feat(theme-classic): usable CodeBlock outside markdown ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`
  - [#6416](https://github.com/facebook/docusaurus/pull/6416) feat(content-blog): allow authors list to contain images only ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`
  - [#6415](https://github.com/facebook/docusaurus/pull/6415) feat(content-blog): allow disabling generating archive ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6245](https://github.com/facebook/docusaurus/pull/6245) feat(content-blog): parse date from middle of file path ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6388](https://github.com/facebook/docusaurus/pull/6388) feat(content-blog): include tags in feed ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus`
  - [#6371](https://github.com/facebook/docusaurus/pull/6371) feat(core, theme-classic): allow overriding htmlLang ([@noomorph](https://github.com/noomorph))
- `docusaurus-mdx-loader`
  - [#6323](https://github.com/facebook/docusaurus/pull/6323) feat(mdx-loader): preserve hash in image src; support GH themed images ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#6139](https://github.com/facebook/docusaurus/pull/6139) feat(theme-classic): new navbar item linking to a sidebar ([@lmpham1](https://github.com/lmpham1))
  - [#6239](https://github.com/facebook/docusaurus/pull/6239) feat(content-docs): allow SEO metadata for category index pages ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-sitemap`
  - [#6248](https://github.com/facebook/docusaurus/pull/6248) feat(sitemap): remove trailingSlash option; respect noIndex config ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-ideal-image`, `docusaurus-theme-translations`
  - [#6173](https://github.com/facebook/docusaurus/pull/6173) feat(ideal-image): allow translating status messages ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-ideal-image`
  - [#6155](https://github.com/facebook/docusaurus/pull/6155) feat(ideal-image): new option disableInDev ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-translations`
  - [#6169](https://github.com/facebook/docusaurus/pull/6169) feat(theme-translations): add Italian translations ([@mcallisto](https://github.com/mcallisto))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-types`, `docusaurus`
  - [#6166](https://github.com/facebook/docusaurus/pull/6166) feat: async plugin creator functions ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#6165](https://github.com/facebook/docusaurus/pull/6165) feat(core): async docusaurus.config.js creator function ([@slorber](https://github.com/slorber))

#### :boom: Breaking Change

- `docusaurus-theme-search-algolia`
  - [#6407](https://github.com/facebook/docusaurus/pull/6407) feat(search): enable contextual search by default ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`
  - [#6289](https://github.com/facebook/docusaurus/pull/6289) refactor: move @theme/hooks to @docusaurus/theme-common ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#6283](https://github.com/facebook/docusaurus/pull/6283) refactor(theme-classic): apply import/no-named-export eslint rule ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-sitemap`
  - [#6248](https://github.com/facebook/docusaurus/pull/6248) feat(sitemap): remove trailingSlash option; respect noIndex config ([@Josh-Cena](https://github.com/Josh-Cena))

#### :bug: Bug Fix

- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus-utils-common`, `docusaurus-utils`, `docusaurus`
  - [#6454](https://github.com/facebook/docusaurus/pull/6454) fix(content-blog): generate feed by reading build output ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`
  - [#6468](https://github.com/facebook/docusaurus/pull/6468) fix(init): cd to correct path when installing ([@gabrielcsapo](https://github.com/gabrielcsapo))
- `docusaurus-mdx-loader`
  - [#4827](https://github.com/facebook/docusaurus/pull/4827) fix: allow links to JSON in .md files to be transformed as asset links ([@antmcc49](https://github.com/antmcc49))
- `docusaurus-plugin-content-docs`
  - [#6435](https://github.com/facebook/docusaurus/pull/6435) fix(content-docs): make getActivePlugin match plugin paths more exactly ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6310](https://github.com/facebook/docusaurus/pull/6310) fix: highlight appropriate navItem when browsing generated category index ([@tapanchudasama](https://github.com/tapanchudasama))
  - [#6202](https://github.com/facebook/docusaurus/pull/6202) fix(content-docs): quotify path when retrieving git history ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#6424](https://github.com/facebook/docusaurus/pull/6424) fix(core): fix css url("image.png"), use css-loader v6 with esModules: false ([@slorber](https://github.com/slorber))
  - [#6378](https://github.com/facebook/docusaurus/pull/6378) fix(core): do not coerce webpack warning to string ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6197](https://github.com/facebook/docusaurus/pull/6197) fix(cli): quotify temp path in deploy command ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6168](https://github.com/facebook/docusaurus/pull/6168) fix(core): update webpack-dev-server + fix deprecation warning ([@slorber](https://github.com/slorber))
- `docusaurus-logger`, `docusaurus-utils`
  - [#6384](https://github.com/facebook/docusaurus/pull/6384) fix(logger): properly stringify objects for logging ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus`
  - [#6338](https://github.com/facebook/docusaurus/pull/6338) fix(core): error boundary should allow no children ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#6314](https://github.com/facebook/docusaurus/pull/6314) fix(theme-classic): fix mobile version dropdown label with only one version ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6288](https://github.com/facebook/docusaurus/pull/6288) fix(theme-classic): add missing role=region to SkipToContent ([@JoshuaKGoldberg](https://github.com/JoshuaKGoldberg))
  - [#6213](https://github.com/facebook/docusaurus/pull/6213) refactor(theme-classic): extract common PaginatorNavLink component ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6177](https://github.com/facebook/docusaurus/pull/6177) fix(theme-classic): make React elements in pre render correctly ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`
  - [#6300](https://github.com/facebook/docusaurus/pull/6300) refactor: move exported type definitions to declaration file ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-migrate`
  - [#6276](https://github.com/facebook/docusaurus/pull/6276) fix(migrate): migration CLI should correctly migrate gtag options ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`
  - [#6244](https://github.com/facebook/docusaurus/pull/6244) fix(content-blog): always convert front matter date as UTC ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-utils`, `docusaurus`
  - [#6190](https://github.com/facebook/docusaurus/pull/6190) fix(utils): properly escape Windows paths ([@Josh-Cena](https://github.com/Josh-Cena))

#### :nail_care: Polish

- `docusaurus-module-type-aliases`
  - [#6469](https://github.com/facebook/docusaurus/pull/6469) fix(module-type-aliases): fix type def for translate params ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-search-algolia`
  - [#6407](https://github.com/facebook/docusaurus/pull/6407) feat(search): enable contextual search by default ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`
  - [#6443](https://github.com/facebook/docusaurus/pull/6443) refactor(mdx-loader): use vfile.path to access Markdown file path ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#6427](https://github.com/facebook/docusaurus/pull/6427) feat(theme-classic): add aria-current to sidebar category link ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6391](https://github.com/facebook/docusaurus/pull/6391) refactor(theme-classic): add comments to Prism setup; minor refactor ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6240](https://github.com/facebook/docusaurus/pull/6240) refactor(theme-classic): use front matter from metadata for BlogPostPage ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#6419](https://github.com/facebook/docusaurus/pull/6419) feat(core): warn users about hand-modifying generated files ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6405](https://github.com/facebook/docusaurus/pull/6405) feat(core): check imported API name when extracting translations ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6291](https://github.com/facebook/docusaurus/pull/6291) feat(core): improve error message for BrowserOnly; better docs ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`
  - [#5822](https://github.com/facebook/docusaurus/pull/5822) feat: update website & init template palette to pass WCAG test; include contrast check in ColorGenerator ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6368](https://github.com/facebook/docusaurus/pull/6368) fix(create-docusaurus): add useBaseUrl for image URLs ([@alias-mac](https://github.com/alias-mac))
- `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`
  - [#6400](https://github.com/facebook/docusaurus/pull/6400) feat(content-pages): front matter validation, include front matter in metadata ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-theme-classic`
  - [#6339](https://github.com/facebook/docusaurus/pull/6339) feat(mdx-loader): read image dimensions when processing Markdown ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`
  - [#6388](https://github.com/facebook/docusaurus/pull/6388) feat(content-blog): include tags in feed ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6189](https://github.com/facebook/docusaurus/pull/6189) feat(content-blog): include front matter in loaded content metadata ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-common`
  - [#6317](https://github.com/facebook/docusaurus/pull/6317) feat(theme-classic): autoscroll TOC with active link ([@cerkiewny](https://github.com/cerkiewny))
- `docusaurus-mdx-loader`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-theme-search-algolia`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#6303](https://github.com/facebook/docusaurus/pull/6303) test(utils, mdx-loader, core): improve coverage ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-preset-classic`
  - [#6284](https://github.com/facebook/docusaurus/pull/6284) fix(preset-classic): throw if preset finds GA options in theme config ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus`
  - [#6186](https://github.com/facebook/docusaurus/pull/6186) refactor: print trailing new line when outputting JSON ([@Josh-Cena](https://github.com/Josh-Cena))

#### :memo: Documentation

- Other
  - [#6296](https://github.com/facebook/docusaurus/pull/6296) docs: add advanced guides ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6459](https://github.com/facebook/docusaurus/pull/6459) docs: add replicad to showcase ([@sgenoud](https://github.com/sgenoud))
  - [#6334](https://github.com/facebook/docusaurus/pull/6334) docs: 2021 recap blog post ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6458](https://github.com/facebook/docusaurus/pull/6458) docs: add Kuizuo's Personal Website to showcase ([@kuizuo](https://github.com/kuizuo))
  - [#6431](https://github.com/facebook/docusaurus/pull/6431) docs: add Koyeb as a deployment option ([@edouardb](https://github.com/edouardb))
  - [#6455](https://github.com/facebook/docusaurus/pull/6455) docs: add Sass Fairy to showcase ([@roydukkey](https://github.com/roydukkey))
  - [#6453](https://github.com/facebook/docusaurus/pull/6453) docs: document embedding generated index in doc page ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6450](https://github.com/facebook/docusaurus/pull/6450) docs: split sidebar documentation into sections ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6449](https://github.com/facebook/docusaurus/pull/6449) docs: multiple doc improvements ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6448](https://github.com/facebook/docusaurus/pull/6448) fix(website): update colors correctly when palette is only customized in one color mode ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6385](https://github.com/facebook/docusaurus/pull/6385) chore: add height/width for front page images ([@nschonni](https://github.com/nschonni))
  - [#6445](https://github.com/facebook/docusaurus/pull/6445) docs: update showcase data of InfraQL ([@jeffreyaven](https://github.com/jeffreyaven))
  - [#6433](https://github.com/facebook/docusaurus/pull/6433) docs: add kube-green to showcase ([@davidebianchi](https://github.com/davidebianchi))
  - [#6428](https://github.com/facebook/docusaurus/pull/6428) docs: elaborate on i18n tutorial ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6422](https://github.com/facebook/docusaurus/pull/6422) docs: add 404Lab wiki to showcase ([@HiChen404](https://github.com/HiChen404))
  - [#6420](https://github.com/facebook/docusaurus/pull/6420) fix(website): restore some site CSS in light mode ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6410](https://github.com/facebook/docusaurus/pull/6410) docs: add SODA for SPARC to showcase ([@megasanjay](https://github.com/megasanjay))
  - [#6417](https://github.com/facebook/docusaurus/pull/6417) docs: fix accessibility of search modal ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6406](https://github.com/facebook/docusaurus/pull/6406) docs(i18n): add docs for htmlLang config ([@noomorph](https://github.com/noomorph))
  - [#6393](https://github.com/facebook/docusaurus/pull/6393) docs: update Algolia docs for new DocSearch infra ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6383](https://github.com/facebook/docusaurus/pull/6383) docs: elaborate on different CSS class names ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6348](https://github.com/facebook/docusaurus/pull/6348) docs: add KaustubhK24's site to showcase ([@kaustubhk24](https://github.com/kaustubhk24))
  - [#6333](https://github.com/facebook/docusaurus/pull/6333) feat(website): search in showcase ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6344](https://github.com/facebook/docusaurus/pull/6344) fix(website): make ColorGenerator functional ([@shwaka](https://github.com/shwaka))
  - [#6340](https://github.com/facebook/docusaurus/pull/6340) docs: minor fix in the sample config for ESM ([@pranabdas](https://github.com/pranabdas))
  - [#6336](https://github.com/facebook/docusaurus/pull/6336) docs: make upgrade guide always show the latest version ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6320](https://github.com/facebook/docusaurus/pull/6320) chore: upgrade rehype-katex with ESM support, update docs ([@pranabdas](https://github.com/pranabdas))
  - [#6335](https://github.com/facebook/docusaurus/pull/6335) docs: add Pglet website to showcase ([@FeodorFitsner](https://github.com/FeodorFitsner))
  - [#6327](https://github.com/facebook/docusaurus/pull/6327) docs: remove typo bracket ([@MorookaKotaro](https://github.com/MorookaKotaro))
  - [#6316](https://github.com/facebook/docusaurus/pull/6316) docs: add bandwidth.com to showcase ([@ajrice6713](https://github.com/ajrice6713))
  - [#6313](https://github.com/facebook/docusaurus/pull/6313) docs: add Refine site to showcase ([@omeraplak](https://github.com/omeraplak))
  - [#6318](https://github.com/facebook/docusaurus/pull/6318) fix(website): various anchor link fixes ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6308](https://github.com/facebook/docusaurus/pull/6308) fix(website): wrap details in mdx-code-block ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6307](https://github.com/facebook/docusaurus/pull/6307) docs: document MD and JSX interoperability issues ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6299](https://github.com/facebook/docusaurus/pull/6299) docs: add icodex to showcase ([@wood3n](https://github.com/wood3n))
  - [#6297](https://github.com/facebook/docusaurus/pull/6297) docs: mention setup in monorepo ([@PatelN123](https://github.com/PatelN123))
  - [#6293](https://github.com/facebook/docusaurus/pull/6293) docs: remove GraphQL mesh from showcase ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6231](https://github.com/facebook/docusaurus/pull/6231) docs: update showcase images; remove GraphQL Code Generator site ([@PatelN123](https://github.com/PatelN123))
  - [#6285](https://github.com/facebook/docusaurus/pull/6285) refactor(website): further optimize showcase images ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6281](https://github.com/facebook/docusaurus/pull/6281) docs: Add kwatch to showcase ([@abahmed](https://github.com/abahmed))
  - [#6280](https://github.com/facebook/docusaurus/pull/6280) docs: elaborate on doc versioning ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6043](https://github.com/facebook/docusaurus/pull/6043) fix(website): resize showcase images, tighten CI check ([@armano2](https://github.com/armano2))
  - [#6274](https://github.com/facebook/docusaurus/pull/6274) docs: add dyte docs to showcase ([@vaibhavshn](https://github.com/vaibhavshn))
  - [#6278](https://github.com/facebook/docusaurus/pull/6278) docs: add Khyron Realm to showcase ([@alexgrigoras](https://github.com/alexgrigoras))
  - [#6271](https://github.com/facebook/docusaurus/pull/6271) docs: add FlatifyCSS to showcase ([@amir2mi](https://github.com/amir2mi))
  - [#6275](https://github.com/facebook/docusaurus/pull/6275) fix(website): fix config-tabs breaking after translation ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6269](https://github.com/facebook/docusaurus/pull/6269) docs: add Ionic to showcase ([@ltm](https://github.com/ltm))
  - [#6272](https://github.com/facebook/docusaurus/pull/6272) docs: make tsconfig work OOTB in typescript guide ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6265](https://github.com/facebook/docusaurus/pull/6265) docs: add Eric JiuRan's blog to showcase ([@1084350607](https://github.com/1084350607))
  - [#6242](https://github.com/facebook/docusaurus/pull/6242) docs(showcase): update oxidizer website url ([@vandreleal](https://github.com/vandreleal))
  - [#6226](https://github.com/facebook/docusaurus/pull/6226) docs: update showcase data for digital support notes ([@PatelN123](https://github.com/PatelN123))
  - [#6224](https://github.com/facebook/docusaurus/pull/6224) docs: add TalentBrick to showcase ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6223](https://github.com/facebook/docusaurus/pull/6223) docs: normalize CodeBlock highlighting ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6214](https://github.com/facebook/docusaurus/pull/6214) feat(website): improve prism themes ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6215](https://github.com/facebook/docusaurus/pull/6215) docs: use BrowserWindow for Markdown demos ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6193](https://github.com/facebook/docusaurus/pull/6193) docs: normalize plugin API documentation ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6209](https://github.com/facebook/docusaurus/pull/6209) docs: elaborate on static asset resolution ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6207](https://github.com/facebook/docusaurus/pull/6207) docs: add default value for BrowserWindow URL field ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6206](https://github.com/facebook/docusaurus/pull/6206) docs: fix highlighting of YAML front matter ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6191](https://github.com/facebook/docusaurus/pull/6191) docs: fix react live scope button color in dark mode ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6188](https://github.com/facebook/docusaurus/pull/6188) docs: add Layer0 to deployment guide ([@rishi-raj-jain](https://github.com/rishi-raj-jain))
  - [#6184](https://github.com/facebook/docusaurus/pull/6184) docs: remove mention of 'UA-' in gtag ([@johnnyreilly](https://github.com/johnnyreilly))
  - [#6181](https://github.com/facebook/docusaurus/pull/6181) docs: add GTFS-to-HTML to showcase ([@brendannee](https://github.com/brendannee))
  - [#6178](https://github.com/facebook/docusaurus/pull/6178) docs: add Digital Support Notes to showcase ([@PatelN123](https://github.com/PatelN123))
  - [#6170](https://github.com/facebook/docusaurus/pull/6170) docs: add LabVIEW coding experience to showcase ([@ruanqizhen](https://github.com/ruanqizhen))
  - [#6164](https://github.com/facebook/docusaurus/pull/6164) docs: fix import module name of theme/Admonition ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6158](https://github.com/facebook/docusaurus/pull/6158) docs: add Astronomer to showcase ([@jwitz](https://github.com/jwitz))
- `create-docusaurus`
  - [#5822](https://github.com/facebook/docusaurus/pull/5822) feat: update website & init template palette to pass WCAG test; include contrast check in ColorGenerator ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6187](https://github.com/facebook/docusaurus/pull/6187) docs: make installation guide more beginner-friendly ([@PatelN123](https://github.com/PatelN123))
- `docusaurus-utils`
  - [#6204](https://github.com/facebook/docusaurus/pull/6204) docs: recommend highlighting with comments than number range ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-theme-classic`
  - [#6203](https://github.com/facebook/docusaurus/pull/6203) docs: audit grammar issues ([@Josh-Cena](https://github.com/Josh-Cena))

#### :house: Internal

- `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#6456](https://github.com/facebook/docusaurus/pull/6456) chore: add cSpell for spell checking ([@nschonni](https://github.com/nschonni))
- Other
  - [#6444](https://github.com/facebook/docusaurus/pull/6444) misc: update nvmrc to 14.17.0 to meet dependency requirements ([@jodyheavener](https://github.com/jodyheavener))
  - [#6441](https://github.com/facebook/docusaurus/pull/6441) misc: fix stylelint erroring when lint-staged passed ignored file ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6421](https://github.com/facebook/docusaurus/pull/6421) chore: fix yarn build:website:fast ([@slorber](https://github.com/slorber))
  - [#6381](https://github.com/facebook/docusaurus/pull/6381) chore(website): set cache-control for static assets ([@nschonni](https://github.com/nschonni))
  - [#6364](https://github.com/facebook/docusaurus/pull/6364) chore: remove Intl polyfills for Jest ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6325](https://github.com/facebook/docusaurus/pull/6325) chore: add Dependabot for dependency updates ([@nschonni](https://github.com/nschonni))
  - [#6328](https://github.com/facebook/docusaurus/pull/6328) chore(ci): upgrade actions/github-script to v5 ([@nschonni](https://github.com/nschonni))
  - [#6332](https://github.com/facebook/docusaurus/pull/6332) chore(deps): bump follow-redirects from 1.14.5 to 1.14.7 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#6326](https://github.com/facebook/docusaurus/pull/6326) misc(ci): remove redundant "CI: true" env ([@nschonni](https://github.com/nschonni))
  - [#6304](https://github.com/facebook/docusaurus/pull/6304) chore: upgrade to Husky 7 ([@nschonni](https://github.com/nschonni))
  - [#6222](https://github.com/facebook/docusaurus/pull/6222) test: ensure consistent CSS ordering ([@slorber](https://github.com/slorber))
  - [#6159](https://github.com/facebook/docusaurus/pull/6159) docs: remove useless comment ([@slorber](https://github.com/slorber))
  - [#6148](https://github.com/facebook/docusaurus/pull/6148) chore(examples): update examples to 2.0.0-beta.14 ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-debug`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#6442](https://github.com/facebook/docusaurus/pull/6442) chore: enable stylelint standard config ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-ideal-image`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus`
  - [#6440](https://github.com/facebook/docusaurus/pull/6440) chore: remove some unused dependencies from package.json ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#6436](https://github.com/facebook/docusaurus/pull/6436) refactor(theme-classic): render BlogPostItem as one JSX element ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6283](https://github.com/facebook/docusaurus/pull/6283) refactor(theme-classic): apply import/no-named-export eslint rule ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-pages`
  - [#6413](https://github.com/facebook/docusaurus/pull/6413) fix(content-pages): declare hide_table_of_contents as boolean ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus`
  - [#6399](https://github.com/facebook/docusaurus/pull/6399) refactor: clean up TODO comments ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-cssnano-preset`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-common`, `docusaurus-theme-translations`, `docusaurus`
  - [#6387](https://github.com/facebook/docusaurus/pull/6387) test: improve test coverage ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-utils`
  - [#6380](https://github.com/facebook/docusaurus/pull/6380) chore: enable a few fixable ESLint rules ([@nschonni](https://github.com/nschonni))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-docs`, `docusaurus-utils`, `docusaurus`
  - [#6377](https://github.com/facebook/docusaurus/pull/6377) refactor: use findAsyncSequential in a few places ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `docusaurus-utils-common`, `docusaurus-utils`, `docusaurus`, `stylelint-copyright`
  - [#6375](https://github.com/facebook/docusaurus/pull/6375) chore: enable eslint-plugin-jest ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`
  - [#6373](https://github.com/facebook/docusaurus/pull/6373) chore: enable react/jsx-closing-bracket-location ([@nschonni](https://github.com/nschonni))
- `docusaurus-theme-classic`, `stylelint-copyright`
  - [#6374](https://github.com/facebook/docusaurus/pull/6374) feat(stylelint-copyright): autofix, stricter config ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-cssnano-preset`, `docusaurus-theme-classic`
  - [#6372](https://github.com/facebook/docusaurus/pull/6372) chore: add baseline stylelint rules ([@nschonni](https://github.com/nschonni))
- `create-docusaurus`, `docusaurus-plugin-debug`, `docusaurus-theme-classic`
  - [#6369](https://github.com/facebook/docusaurus/pull/6369) chore: upgrade lint-staged and globs ([@nschonni](https://github.com/nschonni))
- `docusaurus-theme-search-algolia`, `docusaurus-utils-validation`, `docusaurus`
  - [#6341](https://github.com/facebook/docusaurus/pull/6341) chore: regenerate yarn.lock ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-pages`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus`
  - [#6324](https://github.com/facebook/docusaurus/pull/6324) chore: minor typo cleanup ([@nschonni](https://github.com/nschonni))
- `create-docusaurus`, `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`, `stylelint-copyright`
  - [#6286](https://github.com/facebook/docusaurus/pull/6286) misc: convert all internal scripts to ESM ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`
  - [#6289](https://github.com/facebook/docusaurus/pull/6289) refactor: move @theme/hooks to @docusaurus/theme-common ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`
  - [#6287](https://github.com/facebook/docusaurus/pull/6287) refactor: new @docusaurus/plugin-content-docs/client interface ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#6279](https://github.com/facebook/docusaurus/pull/6279) refactor(core): use native types from webpack-dev-server ([@RDIL](https://github.com/RDIL))
- `docusaurus-plugin-content-docs`
  - [#6277](https://github.com/facebook/docusaurus/pull/6277) refactor(content-docs): make readVersionsMetadata async ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-types`, `docusaurus`
  - [#6237](https://github.com/facebook/docusaurus/pull/6237) refactor(core): convert serverEntry.js to TS ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#6230](https://github.com/facebook/docusaurus/pull/6230) refactor: enforce type import specifiers ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-plugin-content-blog`, `docusaurus-utils`, `docusaurus`
  - [#6229](https://github.com/facebook/docusaurus/pull/6229) refactor(utils): reorganize functions; move authors file resolution to utils ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-translations`
  - [#6225](https://github.com/facebook/docusaurus/pull/6225) refactor(theme-translations): improve typing for update script ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6174](https://github.com/facebook/docusaurus/pull/6174) misc(theme-translations): multiple improvements to the update CLI ([@Josh-Cena](https://github.com/Josh-Cena))

#### Committers: 46

- AJ Rice ([@ajrice6713](https://github.com/ajrice6713))
- Abdelrahman Ahmed ([@abahmed](https://github.com/abahmed))
- Alexandru Grigoras ([@alexgrigoras](https://github.com/alexgrigoras))
- Amir M. Mohamadi ([@amir2mi](https://github.com/amir2mi))
- Anthony McCaigue ([@antmcc49](https://github.com/antmcc49))
- Armano ([@armano2](https://github.com/armano2))
- Brendan Nee ([@brendannee](https://github.com/brendannee))
- Chen ([@HiChen404](https://github.com/HiChen404))
- Davide Bianchi ([@davidebianchi](https://github.com/davidebianchi))
- Devtato ([@cerkiewny](https://github.com/cerkiewny))
- Edouard Bonlieu ([@edouardb](https://github.com/edouardb))
- Feodor Fitsner ([@FeodorFitsner](https://github.com/FeodorFitsner))
- Filipe Guerra ([@alias-mac](https://github.com/alias-mac))
- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))
- Jake Witz ([@jwitz](https://github.com/jwitz))
- Jeffrey Aven ([@jeffreyaven](https://github.com/jeffreyaven))
- Jody Heavener ([@jodyheavener](https://github.com/jodyheavener))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Joseph ([@josephriosIO](https://github.com/josephriosIO))
- Josh Goldberg ([@JoshuaKGoldberg](https://github.com/JoshuaKGoldberg))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Kaustubh Kulkarni ([@kaustubhk24](https://github.com/kaustubhk24))
- Lars Mikkelsen ([@ltm](https://github.com/ltm))
- Mikey O'Toole ([@homotechsual](https://github.com/homotechsual))
- Minh Pham ([@lmpham1](https://github.com/lmpham1))
- Morooka Kotaro ([@MorookaKotaro](https://github.com/MorookaKotaro))
- Nayan Patel ([@PatelN123](https://github.com/PatelN123))
- Nick Schonning ([@nschonni](https://github.com/nschonni))
- Pranab Das ([@pranabdas](https://github.com/pranabdas))
- Reece Dunham ([@RDIL](https://github.com/RDIL))
- Rishi Raj Jain ([@rishi-raj-jain](https://github.com/rishi-raj-jain))
- Sanjay Soundarajan ([@megasanjay](https://github.com/megasanjay))
- Shun Wakatsuki ([@shwaka](https://github.com/shwaka))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tapan Chudasama ([@tapanchudasama](https://github.com/tapanchudasama))
- Vaibhav Shinde ([@vaibhavshn](https://github.com/vaibhavshn))
- Vandré Leal ([@vandreleal](https://github.com/vandreleal))
- Yaroslav Serhieiev ([@noomorph](https://github.com/noomorph))
- [@mcallisto](https://github.com/mcallisto)
- [@ruanqizhen](https://github.com/ruanqizhen)
- [@wood3n](https://github.com/wood3n)
- kuizuo ([@kuizuo](https://github.com/kuizuo))
- sgenoud ([@sgenoud](https://github.com/sgenoud))
- trent ([@roydukkey](https://github.com/roydukkey))
- Ömer Faruk APLAK ([@omeraplak](https://github.com/omeraplak))
- 久染 | JiuRan ([@1084350607](https://github.com/1084350607))

## 2.0.0-beta.14 (2021-12-21)

#### :rocket: New Feature

- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#6132](https://github.com/facebook/docusaurus/pull/6132) feat(theme-classic): new configuration syntax for a simple footer ([@christopherklint97](https://github.com/christopherklint97))
  - [#6125](https://github.com/facebook/docusaurus/pull/6125) feat(theme-common): stable classname for code blocks ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#5848](https://github.com/facebook/docusaurus/pull/5848) feat(theme-classic): standalone Admonition component ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6082](https://github.com/facebook/docusaurus/pull/6082) feat(theme-classic): allow passing additional attributes to tab headings ([@Drylozu](https://github.com/Drylozu))
- `docusaurus-plugin-content-blog`
  - [#6126](https://github.com/facebook/docusaurus/pull/6126) feat(content-blog): support json feed ([@notzheng](https://github.com/notzheng))
- `docusaurus`
  - [#6107](https://github.com/facebook/docusaurus/pull/6107) feat(core): allow plugins to customize/override Webpack devServer config ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-migrate`
  - [#6146](https://github.com/facebook/docusaurus/pull/6146) fix(migrate): do not modify non-MD files ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#6128](https://github.com/facebook/docusaurus/pull/6128) fix: do not use aria-hidden in heading anchor links ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`
  - [#6124](https://github.com/facebook/docusaurus/pull/6124) fix(content-docs): restore behavior when pagination front matter is null ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6085](https://github.com/facebook/docusaurus/pull/6085) fix(content-docs): getMainDocId should return doc with both versioned or unversioned id ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-utils-validation`
  - [#6097](https://github.com/facebook/docusaurus/pull/6097) fix: declare missing dependencies ([@merceyz](https://github.com/merceyz))
- `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-pwa`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `lqip-loader`
  - [#6094](https://github.com/facebook/docusaurus/pull/6094) fix: add missing dependencies on tslib ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-translations`
  - [#6088](https://github.com/facebook/docusaurus/pull/6088) fix(theme-translations): publish theme-translation lib, including typedef ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#6053](https://github.com/facebook/docusaurus/pull/6053) feat(theme-classic): allow stylizing doc paginator arrows ([@noomorph](https://github.com/noomorph))
  - [#6121](https://github.com/facebook/docusaurus/pull/6121) fix(theme-classic): add outline to focused code blocks ([@christopherklint97](https://github.com/christopherklint97))
  - [#6118](https://github.com/facebook/docusaurus/pull/6118) refactor: remove some useless code ([@lex111](https://github.com/lex111))
- `create-docusaurus`, `docusaurus-logger`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#5994](https://github.com/facebook/docusaurus/pull/5994) refactor: unify log format with new logger utility ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`
  - [#6119](https://github.com/facebook/docusaurus/pull/6119) fix(create-docusaurus): make initial editUrl functional ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6095](https://github.com/facebook/docusaurus/pull/6095) fix(create-docusaurus): give a clearer message when installation failed ([@Josh-Cena](https://github.com/Josh-Cena))

#### :memo: Documentation

- [#6142](https://github.com/facebook/docusaurus/pull/6142) docs: normalize usage of placeholders ([@Josh-Cena](https://github.com/Josh-Cena))
- [#5918](https://github.com/facebook/docusaurus/pull/5918) docs: refactor & refine lifecycle API docs ([@Josh-Cena](https://github.com/Josh-Cena))
- [#6138](https://github.com/facebook/docusaurus/pull/6138) docs: add Smart Docs to showcase ([@wowtvds](https://github.com/wowtvds))
- [#6137](https://github.com/facebook/docusaurus/pull/6137) docs: add ToolJet to showcase ([@withshubh](https://github.com/withshubh))
- [#6141](https://github.com/facebook/docusaurus/pull/6141) docs: add WoodpeckerCI to showcase ([@6543](https://github.com/6543))
- [#6135](https://github.com/facebook/docusaurus/pull/6135) docs: mention admonition quirks with Prettier ([@yangshun](https://github.com/yangshun))
- [#6131](https://github.com/facebook/docusaurus/pull/6131) docs: elaborate on "docs-only" and "blog-only" ([@himanshu007-creator](https://github.com/himanshu007-creator))
- [#6134](https://github.com/facebook/docusaurus/pull/6134) docs: update link to init template README.md ([@cmpadden](https://github.com/cmpadden))
- [#6130](https://github.com/facebook/docusaurus/pull/6130) docs: refactor docs sidebar doc ([@Josh-Cena](https://github.com/Josh-Cena))
- [#6129](https://github.com/facebook/docusaurus/pull/6129) docs: refactor styling/theming docs ([@Josh-Cena](https://github.com/Josh-Cena))
- [#6112](https://github.com/facebook/docusaurus/pull/6112) docs: mention that SEO through front matter is better than head tag ([@Josh-Cena](https://github.com/Josh-Cena))
- [#6120](https://github.com/facebook/docusaurus/pull/6120) refactor(website): make deploy preview open next version docs by default ([@Josh-Cena](https://github.com/Josh-Cena))
- [#6111](https://github.com/facebook/docusaurus/pull/6111) docs: add Molecule website to showcase ([@wewoor](https://github.com/wewoor))
- [#6089](https://github.com/facebook/docusaurus/pull/6089) docs: add Enarx website to showcase ([@HarshCasper](https://github.com/HarshCasper))
- [#6090](https://github.com/facebook/docusaurus/pull/6090) docs: add sapphire to showcase ([@favna](https://github.com/favna))
- [#6091](https://github.com/facebook/docusaurus/pull/6091) docs(showcase): "much more pages" => "many more pages" ([@favna](https://github.com/favna))

#### :house: Internal

- `docusaurus-theme-classic`
  - [#6144](https://github.com/facebook/docusaurus/pull/6144) fix(theme-classic): fix translation when footer has no links ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`
  - [#6143](https://github.com/facebook/docusaurus/pull/6143) test: fix async tests resolved in random order ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6123](https://github.com/facebook/docusaurus/pull/6123) test: use snapshots for sidebar tests ([@Josh-Cena](https://github.com/Josh-Cena))
- Other
  - [#6122](https://github.com/facebook/docusaurus/pull/6122) fix(website): fix yarn build:website:fast ([@slorber](https://github.com/slorber))
  - [#6080](https://github.com/facebook/docusaurus/pull/6080) chore: add npm and pnpm to E2E tests ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-cssnano-preset`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-types`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#6092](https://github.com/facebook/docusaurus/pull/6092) misc: ignore some files during npm publish ([@Josh-Cena](https://github.com/Josh-Cena))

#### Committers: 17

- 6543 ([@6543](https://github.com/6543))
- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Christopher Klint ([@christopherklint97](https://github.com/christopherklint97))
- Harsh Mishra ([@HarshCasper](https://github.com/HarshCasper))
- Himanshu ([@himanshu007-creator](https://github.com/himanshu007-creator))
- Jeroen Claassens ([@favna](https://github.com/favna))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Kristoffer K. ([@merceyz](https://github.com/merceyz))
- Shubhendra Singh Chauhan ([@withshubh](https://github.com/withshubh))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Wout Vandesompele ([@wowtvds](https://github.com/wowtvds))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))
- Yaroslav Serhieiev ([@noomorph](https://github.com/noomorph))
- Ziv ([@wewoor](https://github.com/wewoor))
- [@Drylozu](https://github.com/Drylozu)
- colton ([@cmpadden](https://github.com/cmpadden))
- 不郑 ([@notzheng](https://github.com/notzheng))

## 2.0.0-beta.13 (2021-12-10)

Good npm publish, same code as beta.11

## 2.0.0-beta.12 (2021-12-10)

Bad npm publish, use beta.13 instead

## 2.0.0-beta.11 (2021-12-10)

#### :bug: Bug Fix

- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`
  - [#6078](https://github.com/facebook/docusaurus/pull/6078) fix: move docusaurus core back to hard dependencies ([@pranabdas](https://github.com/pranabdas))

#### Committers: 2

- Pranab Das ([@pranabdas](https://github.com/pranabdas))
- Sébastien Lorber ([@slorber](https://github.com/slorber))

## 2.0.0-beta.10 (2021-12-09)

#### :rocket: New Feature

- `create-docusaurus`, `docusaurus-types`, `docusaurus`
  - [#5930](https://github.com/facebook/docusaurus/pull/5930) feat: shorthands for themes/plugins/presets configuration ([@fsmaia](https://github.com/fsmaia))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-translations`, `docusaurus-utils`, `docusaurus`
  - [#5830](https://github.com/facebook/docusaurus/pull/5830) feat(content-docs): sidebar category linking to document or auto-generated index page ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-types`, `docusaurus`
  - [#4095](https://github.com/facebook/docusaurus/pull/4095) feat(core): allow sourcing from multiple static directories ([@oriooctopus](https://github.com/oriooctopus))
- `create-docusaurus`
  - [#3458](https://github.com/facebook/docusaurus/pull/3458) feat(create-docusaurus): allow using local folder as template ([@afshinm](https://github.com/afshinm))
- `docusaurus-plugin-content-blog`
  - [#5787](https://github.com/facebook/docusaurus/pull/5787) feat(content-blog): allow sorting posts in ascending order ([@cerkiewny](https://github.com/cerkiewny))
- `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus`
  - [#3104](https://github.com/facebook/docusaurus/pull/3104) feat(core): Add React ErrorBoundary component + theme default boundaries ([@spyke01](https://github.com/spyke01))

#### :boom: Breaking Change

- `docusaurus-plugin-content-blog`
  - [#6061](https://github.com/facebook/docusaurus/pull/6061) fix(content-blog): make post ID unique ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-migrate`, `docusaurus-plugin-content-docs`
  - [#6065](https://github.com/facebook/docusaurus/pull/6065) refactor: remove deprecated docs homePageId option ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`
  - [#6056](https://github.com/facebook/docusaurus/pull/6056) refactor: remove unused metadata field for homepage ([@lex111](https://github.com/lex111))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-translations`, `docusaurus-utils`, `docusaurus`
  - [#5830](https://github.com/facebook/docusaurus/pull/5830) feat(content-docs): sidebar category linking to document or auto-generated index page ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-preset-classic`
  - [#5832](https://github.com/facebook/docusaurus/pull/5832) refactor(ganalytics, gtag): move options out of themeConfig ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus-utils`
  - [#5871](https://github.com/facebook/docusaurus/pull/5871) misc: replace all "Metadatas" with "Metadata" ([@swalahamani](https://github.com/swalahamani))

#### :bug: Bug Fix

- `docusaurus-theme-common`
  - [#6070](https://github.com/facebook/docusaurus/pull/6070) fix(theme-common): useLocationChange fire un-necessarily twice ([@slorber](https://github.com/slorber))
  - [#6040](https://github.com/facebook/docusaurus/pull/6040) fix: browser storage (localStorage) is unreliable: api should fail-safe ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#6047](https://github.com/facebook/docusaurus/pull/6047) fix: make Docusaurus PnP strict mode compatible ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus`
  - [#6052](https://github.com/facebook/docusaurus/pull/6052) fix(core): fix error boundary import disrupting CSS order ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`
  - [#6061](https://github.com/facebook/docusaurus/pull/6061) fix(content-blog): make post ID unique ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#5983](https://github.com/facebook/docusaurus/pull/5983) fix(core): do not apply theme-init alias to user component ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5798](https://github.com/facebook/docusaurus/pull/5798) fix(cli): update notifier should be shown if current is less than latest ([@semoal](https://github.com/semoal))
  - [#5864](https://github.com/facebook/docusaurus/pull/5864) fix: respect base URL when serving content by webpack dev server ([@lex111](https://github.com/lex111))
- `docusaurus-module-type-aliases`
  - [#5945](https://github.com/facebook/docusaurus/pull/5945) fix(module-type-aliases): add svg declaration ([@MisterFISHUP](https://github.com/MisterFISHUP))
- `docusaurus-theme-classic`
  - [#5873](https://github.com/facebook/docusaurus/pull/5873) fix(theme-classic): fix announcementBar css ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#6003](https://github.com/facebook/docusaurus/pull/6003) fix(theme-classic): make nav dropdowns focusable ([@robinmetral](https://github.com/robinmetral))
  - [#6000](https://github.com/facebook/docusaurus/pull/6000) fix(theme-classic): make hash link in heading not selectable ([@JararvisQ](https://github.com/JararvisQ))
  - [#5944](https://github.com/facebook/docusaurus/pull/5944) fix: translate all remaining english sentence in French ([@StanKocken](https://github.com/StanKocken))
- `docusaurus-theme-classic`, `docusaurus`
  - [#6048](https://github.com/facebook/docusaurus/pull/6048) refactor: capitalize locales when creating i18n config ([@lex111](https://github.com/lex111))
- `docusaurus-theme-translations`
  - [#5976](https://github.com/facebook/docusaurus/pull/5976) feat(theme-translations): add extra Korean translation, fix typo ([@revi](https://github.com/revi))
  - [#6060](https://github.com/facebook/docusaurus/pull/6060) chore(theme-translations): complete Chinese translations ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-migrate`, `docusaurus-plugin-content-docs`
  - [#6065](https://github.com/facebook/docusaurus/pull/6065) refactor: remove deprecated docs homePageId option ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`
  - [#6056](https://github.com/facebook/docusaurus/pull/6056) refactor: remove unused metadata field for homepage ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#6049](https://github.com/facebook/docusaurus/pull/6049) refactor: simplify Toggle component ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-types`
  - [#5981](https://github.com/facebook/docusaurus/pull/5981) refactor: minor ESLint improvements ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-pwa`
  - [#5995](https://github.com/facebook/docusaurus/pull/5995) chore(plugin-pwa): change core-js version in package.json to v3 ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-theme-translations`, `docusaurus-utils`
  - [#5849](https://github.com/facebook/docusaurus/pull/5849) refactor: define own translations in other themes ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-types`
  - [#5959](https://github.com/facebook/docusaurus/pull/5959) refactor(types): correct HtmlTags types ([@armano2](https://github.com/armano2))
- `docusaurus`
  - [#5829](https://github.com/facebook/docusaurus/pull/5829) refactor: optimize clone and checkout in deploy command ([@sivapalan](https://github.com/sivapalan))
  - [#5899](https://github.com/facebook/docusaurus/pull/5899) feat(core): give more hints when plugins have duplicate IDs ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-preset-classic`
  - [#5832](https://github.com/facebook/docusaurus/pull/5832) refactor(ganalytics, gtag): move options out of themeConfig ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus`
  - [#5840](https://github.com/facebook/docusaurus/pull/5840) feat: allow GIT_USER env var to be unset if SSH is used ([@wpyoga](https://github.com/wpyoga))
- `create-docusaurus`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus-utils`
  - [#5871](https://github.com/facebook/docusaurus/pull/5871) misc: replace all "Metadatas" with "Metadata" ([@swalahamani](https://github.com/swalahamani))

#### :memo: Documentation

- Other
  - [#6063](https://github.com/facebook/docusaurus/pull/6063) docs: add moja global to showcase ([@sohamsshah](https://github.com/sohamsshah))
  - [#6069](https://github.com/facebook/docusaurus/pull/6069) docs: update CONTRIBUTING for website ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6062](https://github.com/facebook/docusaurus/pull/6062) refactor(website): improve wording in comments of showcase data ([@sohamsshah](https://github.com/sohamsshah))
  - [#6045](https://github.com/facebook/docusaurus/pull/6045) docs: add "discord resources" to showcase ([@dexbiobot](https://github.com/dexbiobot))
  - [#6026](https://github.com/facebook/docusaurus/pull/6026) docs(deployment): add cost-benefit analysis with different options ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5955](https://github.com/facebook/docusaurus/pull/5955) docs: add Pearl UI website to showcase ([@agrawal-rohit](https://github.com/agrawal-rohit))
  - [#5989](https://github.com/facebook/docusaurus/pull/5989) misc: update CONTRIBUTING to reflect status quo ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5845](https://github.com/facebook/docusaurus/pull/5845) docs(admin): update repo testing instructions to reflect v2 ([@wpyoga](https://github.com/wpyoga))
  - [#6019](https://github.com/facebook/docusaurus/pull/6019) docs: update Netlify url config option in deployment instructions ([@rsapkf](https://github.com/rsapkf))
  - [#6015](https://github.com/facebook/docusaurus/pull/6015) docs: add Tremor website to showcase page ([@skoech](https://github.com/skoech))
  - [#5997](https://github.com/facebook/docusaurus/pull/5997) refactor(website): various fixes and improvements on Showcase page ([@lex111](https://github.com/lex111))
  - [#6008](https://github.com/facebook/docusaurus/pull/6008) docs: improve algolia integration instructions ([@shafy](https://github.com/shafy))
  - [#6006](https://github.com/facebook/docusaurus/pull/6006) docs: improve explanation for url config in GH Pages ([@Martinsos](https://github.com/Martinsos))
  - [#6001](https://github.com/facebook/docusaurus/pull/6001) docs: add Dime.Scheduler SDK to showcase ([@hbulens](https://github.com/hbulens))
  - [#5984](https://github.com/facebook/docusaurus/pull/5984) docs: add PREFS website to showcase ([@Patitotective](https://github.com/Patitotective))
  - [#5967](https://github.com/facebook/docusaurus/pull/5967) docs(website): Add docsearch migration blog post ([@slorber](https://github.com/slorber))
  - [#5968](https://github.com/facebook/docusaurus/pull/5968) refactor(website): shadow on showcase toggle ([@dsmmcken](https://github.com/dsmmcken))
  - [#5979](https://github.com/facebook/docusaurus/pull/5979) docs: update links to default translations dir ([@lex111](https://github.com/lex111))
  - [#5969](https://github.com/facebook/docusaurus/pull/5969) refactor(website): polish on Showcase page ([@slorber](https://github.com/slorber))
  - [#5966](https://github.com/facebook/docusaurus/pull/5966) docs: add Darklang to showcase ([@pbiggar](https://github.com/pbiggar))
  - [#5970](https://github.com/facebook/docusaurus/pull/5970) docs: add Remirror to showcase ([@ronnyroeller](https://github.com/ronnyroeller))
  - [#5971](https://github.com/facebook/docusaurus/pull/5971) docs: add Webiny docs to showcase page ([@swapnilmmane](https://github.com/swapnilmmane))
  - [#5953](https://github.com/facebook/docusaurus/pull/5953) docs: fix BrowserOnly return statement ([@MorookaKotaro](https://github.com/MorookaKotaro))
  - [#5949](https://github.com/facebook/docusaurus/pull/5949) docs: update Signoz showcase details ([@pal-sig](https://github.com/pal-sig))
  - [#5948](https://github.com/facebook/docusaurus/pull/5948) fix(website): fix APITable anchor ID having extra hash ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5947](https://github.com/facebook/docusaurus/pull/5947) fix(website): fix APITable anchor link ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5925](https://github.com/facebook/docusaurus/pull/5925) docs: add Froggit site to showcase page ([@cchaudier](https://github.com/cchaudier))
  - [#5928](https://github.com/facebook/docusaurus/pull/5928) docs: Add Shotstack showcase user ([@jeffski](https://github.com/jeffski))
  - [#5934](https://github.com/facebook/docusaurus/pull/5934) docs: fix a typo in CHANGELOG ([@KonstHardy](https://github.com/KonstHardy))
  - [#5921](https://github.com/facebook/docusaurus/pull/5921) docs: add Signoz site to showcase site ([@pal-sig](https://github.com/pal-sig))
  - [#5891](https://github.com/facebook/docusaurus/pull/5891) docs: new APITable comp to render large tables ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5917](https://github.com/facebook/docusaurus/pull/5917) docs: make API sidebar partially autogenerated ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5903](https://github.com/facebook/docusaurus/pull/5903) docs: refer to deployed branch as deployment rather than target ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5902](https://github.com/facebook/docusaurus/pull/5902) fix(website): fix i18n routes for Canny board ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5900](https://github.com/facebook/docusaurus/pull/5900) docs: document global variables in MDX scope ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#4409](https://github.com/facebook/docusaurus/pull/4409) docs: add example for GitHub Pages deployment; rewrite deployment section ([@polarathene](https://github.com/polarathene))
  - [#5888](https://github.com/facebook/docusaurus/pull/5888) docs: update GitHub deployment instructions ([@rootwork](https://github.com/rootwork))
  - [#5895](https://github.com/facebook/docusaurus/pull/5895) docs: Add juffalow.com to Docusaurus showcase ([@juffalow](https://github.com/juffalow))
  - [#5881](https://github.com/facebook/docusaurus/pull/5881) docs: fix wrong code sample in docusaurus-core ([@matthijsgroen](https://github.com/matthijsgroen))
  - [#5875](https://github.com/facebook/docusaurus/pull/5875) docs: add patrikmasiar website showcase ([@patrikmasiar](https://github.com/patrikmasiar))
  - [#5876](https://github.com/facebook/docusaurus/pull/5876) docs: '5 minutes tutorial' -> '5-minute tutorial' ([@molly](https://github.com/molly))
  - [#5759](https://github.com/facebook/docusaurus/pull/5759) docs: create SEO documentation page ([@cerkiewny](https://github.com/cerkiewny))
  - [#5869](https://github.com/facebook/docusaurus/pull/5869) docs: remove duplicated appId property ([@juzhiyuan](https://github.com/juzhiyuan))
  - [#5868](https://github.com/facebook/docusaurus/pull/5868) docs: fix a typo in using-themes.md ([@fishmandev](https://github.com/fishmandev))
  - [#5862](https://github.com/facebook/docusaurus/pull/5862) misc: show only latest archive alpha/beta versions dropdown ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#5742](https://github.com/facebook/docusaurus/pull/5742) feat(website): redesign of showcase page ([@chimailo](https://github.com/chimailo))

#### :house: Internal

- `create-docusaurus`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-theme-common`, `docusaurus-theme-translations`, `docusaurus-utils-validation`, `docusaurus`
  - [#6071](https://github.com/facebook/docusaurus/pull/6071) refactor: add blank lines below all copyright headers ([@Josh-Cena](https://github.com/Josh-Cena))
- Other
  - [#6068](https://github.com/facebook/docusaurus/pull/6068) chore: add prefix to needs triage label; separate Windows test workflow ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6031](https://github.com/facebook/docusaurus/pull/6031) chore: upgrade netlify-cli ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6012](https://github.com/facebook/docusaurus/pull/6012) chore(website): enable strict compiler option ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#6002](https://github.com/facebook/docusaurus/pull/6002) chore(ci): add GitHub action for showcase testing ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5977](https://github.com/facebook/docusaurus/pull/5977) chore: generate dogfooding test for long pathname during CI ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5950](https://github.com/facebook/docusaurus/pull/5950) misc(codeowners): add @Josh-Cena to CODEOWNERS ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5919](https://github.com/facebook/docusaurus/pull/5919) misc(workflow): E2E tests should not be run with website changes ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5907](https://github.com/facebook/docusaurus/pull/5907) chore(workflow): merge jobs into one workflow & give each job a name ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5889](https://github.com/facebook/docusaurus/pull/5889) chore(website): enable eslint in website ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5870](https://github.com/facebook/docusaurus/pull/5870) chore(README): fix broken GitHub Actions Workflow Status icon ([@HemantSachdeva](https://github.com/HemantSachdeva))
- `docusaurus-module-type-aliases`, `docusaurus-types`, `docusaurus`
  - [#6064](https://github.com/facebook/docusaurus/pull/6064) refactor(core): fix types for client code ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-theme-translations`, `docusaurus-utils`, `docusaurus`
  - [#6055](https://github.com/facebook/docusaurus/pull/6055) chore: clean up dev dependency declarations ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus-plugin-ideal-image`, `docusaurus-theme-classic`
  - [#6010](https://github.com/facebook/docusaurus/pull/6010) chore: upgrade prettier; rename prettier scripts as format ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`, `docusaurus`
  - [#5958](https://github.com/facebook/docusaurus/pull/5958) chore: update @svgr/webpack to version 6 ([@ludofischer](https://github.com/ludofischer))
- `docusaurus`
  - [#5998](https://github.com/facebook/docusaurus/pull/5998) chore: upgrade webpack-dev-server to v4.5.0 ([@lex111](https://github.com/lex111))
  - [#5965](https://github.com/facebook/docusaurus/pull/5965) fix(core): apply staticDirectories to base webpack config ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-ideal-image`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils-common`, `docusaurus-utils`, `docusaurus`
  - [#5985](https://github.com/facebook/docusaurus/pull/5985) chore: cleanup dependency declaration in package.json ([@armano2](https://github.com/armano2))
- `create-docusaurus`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-utils`, `docusaurus`, `lqip-loader`, `stylelint-copyright`
  - [#5963](https://github.com/facebook/docusaurus/pull/5963) chore: upgrade TypeScript & other ESLint related deps ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`
  - [#5962](https://github.com/facebook/docusaurus/pull/5962) refactor(content-docs): move isCategoriesShorthand to utils ([@armano2](https://github.com/armano2))
  - [#5906](https://github.com/facebook/docusaurus/pull/5906) fix(content-docs): do not echo git history to console ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5905](https://github.com/facebook/docusaurus/pull/5905) misc(plugin-docs): fix Windows test snapshot for git history retrieval ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5904](https://github.com/facebook/docusaurus/pull/5904) refactor(content-docs): use shelljs instead of execa ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-ideal-image`
  - [#5940](https://github.com/facebook/docusaurus/pull/5940) refactor(plugin-ideal-image): migrate package to TS ([@armano2](https://github.com/armano2))
- `docusaurus-plugin-pwa`, `docusaurus-theme-classic`
  - [#5941](https://github.com/facebook/docusaurus/pull/5941) refactor(plugin-pwa): migrate package to TS ([@armano2](https://github.com/armano2))
- `docusaurus-plugin-ideal-image`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`
  - [#5935](https://github.com/facebook/docusaurus/pull/5935) refactor(theme-search-algolia): migrate package to TS ([@armano2](https://github.com/armano2))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`
  - [#5946](https://github.com/facebook/docusaurus/pull/5946) refactor: move deps declarations into src ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-utils-common`, `docusaurus-utils`, `docusaurus`
  - [#5914](https://github.com/facebook/docusaurus/pull/5914) refactor: improve setup of type declaration files ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5922](https://github.com/facebook/docusaurus/pull/5922) refactor(theme-classic): move some logic of CodeBlock to theme-common ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-remark-plugin-npm2yarn`
  - [#5931](https://github.com/facebook/docusaurus/pull/5931) refactor(remark-plugin-npm2yarn): migrate package to TS ([@duanwilliam](https://github.com/duanwilliam))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-utils`
  - [#5806](https://github.com/facebook/docusaurus/pull/5806) refactor: use js-yaml to parse both JSON and YAML ([@Josh-Cena](https://github.com/Josh-Cena))

#### Committers: 48

- Afshin Mehrabani ([@afshinm](https://github.com/afshinm))
- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Armano ([@armano2](https://github.com/armano2))
- Brennan Kinney ([@polarathene](https://github.com/polarathene))
- Can Olcer ([@shafy](https://github.com/shafy))
- Christophe Chaudier ([@cchaudier](https://github.com/cchaudier))
- Devtato ([@cerkiewny](https://github.com/cerkiewny))
- Dmitriy Fishman ([@fishmandev](https://github.com/fishmandev))
- Don ([@dsmmcken](https://github.com/dsmmcken))
- FISH UP ([@MisterFISHUP](https://github.com/MisterFISHUP))
- Fernando Maia ([@fsmaia](https://github.com/fsmaia))
- Hemant Sachdeva ([@HemantSachdeva](https://github.com/HemantSachdeva))
- Hendrik Bulens ([@hbulens](https://github.com/hbulens))
- Ivan Boothe ([@rootwork](https://github.com/rootwork))
- Jarar ([@JararvisQ](https://github.com/JararvisQ))
- Jeff Shillitto ([@jeffski](https://github.com/jeffski))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Konstantin Popov ([@KonstHardy](https://github.com/KonstHardy))
- Ludovico Fischer ([@ludofischer](https://github.com/ludofischer))
- Martin Šošić ([@Martinsos](https://github.com/Martinsos))
- Matej Jellus ([@juffalow](https://github.com/juffalow))
- Matthijs Groen ([@matthijsgroen](https://github.com/matthijsgroen))
- Molly White ([@molly](https://github.com/molly))
- Morooka Kotaro ([@MorookaKotaro](https://github.com/MorookaKotaro))
- Oliver Ullman ([@oriooctopus](https://github.com/oriooctopus))
- Paden Clayton ([@spyke01](https://github.com/spyke01))
- Patitotective ([@Patitotective](https://github.com/Patitotective))
- Patrik Mäsiar ([@patrikmasiar](https://github.com/patrikmasiar))
- Paul Biggar ([@pbiggar](https://github.com/pbiggar))
- Rey ([@rsapkf](https://github.com/rsapkf))
- Robin Métral ([@robinmetral](https://github.com/robinmetral))
- Rohit Agrawal ([@agrawal-rohit](https://github.com/agrawal-rohit))
- Ronny Roeller ([@ronnyroeller](https://github.com/ronnyroeller))
- Sergio Moreno ([@semoal](https://github.com/semoal))
- Sharon Koech ([@skoech](https://github.com/skoech))
- Shoaib Sajid ([@dexbiobot](https://github.com/dexbiobot))
- Soham Shah ([@sohamsshah](https://github.com/sohamsshah))
- Stan Kocken ([@StanKocken](https://github.com/StanKocken))
- Swalah Amani ([@swalahamani](https://github.com/swalahamani))
- Swapnil M Mane ([@swapnilmmane](https://github.com/swapnilmmane))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Varun Sivapalan ([@sivapalan](https://github.com/sivapalan))
- William Poetra Yoga ([@wpyoga](https://github.com/wpyoga))
- Yongmin Hong ([@revi](https://github.com/revi))
- [@duanwilliam](https://github.com/duanwilliam)
- [@pal-sig](https://github.com/pal-sig)
- chima ilo ([@chimailo](https://github.com/chimailo))
- 琚致远 ([@juzhiyuan](https://github.com/juzhiyuan))

## 2.0.0-beta.9 (2021-11-02)

#### :rocket: New Feature

- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5770](https://github.com/facebook/docusaurus/pull/5770) feat(theme-classic): allow specifying width/height in logo ([@cerkiewny](https://github.com/cerkiewny))
- `docusaurus-types`, `docusaurus`
  - [#5841](https://github.com/facebook/docusaurus/pull/5841) feat: allow user to specify deploymentBranch property in docusaurus.config.js ([@wpyoga](https://github.com/wpyoga))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`
  - [#5795](https://github.com/facebook/docusaurus/pull/5795) feat(search-algolia): algolia externalUrl regex to navigate with window.href ([@semoal](https://github.com/semoal))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-types`, `docusaurus`
  - [#5814](https://github.com/facebook/docusaurus/pull/5814) feat: Support Node 17 ([@slorber](https://github.com/slorber))
  - [#5420](https://github.com/facebook/docusaurus/pull/5420) feat(core): upgrade to webpack-dev-server@4 ([@AviVahl](https://github.com/AviVahl))
- `docusaurus-theme-classic`
  - [#5791](https://github.com/facebook/docusaurus/pull/5791) feat(theme-classic): add Serbian Cyrillic translation ([@utajum](https://github.com/utajum))

#### :boom: Breaking Change

- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#5812](https://github.com/facebook/docusaurus/pull/5812) chore: require Node 14 ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-plugin-content-blog`
  - [#5835](https://github.com/facebook/docusaurus/pull/5835) fix(content-blog): Fix blog feeds not generated ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#5828](https://github.com/facebook/docusaurus/pull/5828) fix: include all branch tips for shallow clone in deploy command ([@sivapalan](https://github.com/sivapalan))
  - [#5824](https://github.com/facebook/docusaurus/pull/5824) fix: baseUrl passed to sortConfig ([@semoal](https://github.com/semoal))
  - [#5813](https://github.com/facebook/docusaurus/pull/5813) fix: handle SIGTERM in build command ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`, `docusaurus`
  - [#5819](https://github.com/facebook/docusaurus/pull/5819) fix: use @docusaurus/react-loadable as package alias + include types ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-preset-classic`
  - [#5831](https://github.com/facebook/docusaurus/pull/5831) feat(preset-classic): guard against unknown keys in options ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#5815](https://github.com/facebook/docusaurus/pull/5815) refactor: some improvements for webpack-dev-server ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils`, `docusaurus`
  - [#5788](https://github.com/facebook/docusaurus/pull/5788) refactor: fix a few type inconsistencies ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#5781](https://github.com/facebook/docusaurus/pull/5781) refactor: Vietnamese translations ([@datlechin](https://github.com/datlechin))

#### :memo: Documentation

- Other
  - [#5853](https://github.com/facebook/docusaurus/pull/5853) docs: Fix a typo in CONTRIBUTING.md ([@fishmandev](https://github.com/fishmandev))
  - [#5852](https://github.com/facebook/docusaurus/pull/5852) docs: Fix a typo in versioning.md ([@fishmandev](https://github.com/fishmandev))
  - [#5847](https://github.com/facebook/docusaurus/pull/5847) docs: add InfraQL product docs website to showcase ([@jeffreyaven](https://github.com/jeffreyaven))
  - [#5843](https://github.com/facebook/docusaurus/pull/5843) docs: fix i18n routes to feature requests ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5766](https://github.com/facebook/docusaurus/pull/5766) docs: elaborate on the usage of MDX plugins ([@cerkiewny](https://github.com/cerkiewny))
  - [#5826](https://github.com/facebook/docusaurus/pull/5826) docs: fix lint issue ([@slorber](https://github.com/slorber))
  - [#5801](https://github.com/facebook/docusaurus/pull/5801) docs: Update Drone Deployment docs ([@gabrielfalcao](https://github.com/gabrielfalcao))
  - [#5821](https://github.com/facebook/docusaurus/pull/5821) docs: include navbar item type in the API table ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5820](https://github.com/facebook/docusaurus/pull/5820) docs: add @Josh-Cena to the team ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5818](https://github.com/facebook/docusaurus/pull/5818) doc: fix typo in "create a doc" ([@dominikmeyersap](https://github.com/dominikmeyersap))
  - [#5797](https://github.com/facebook/docusaurus/pull/5797) docs: use "npx create-docusaurus" for init ([@slorber](https://github.com/slorber))
  - [#5771](https://github.com/facebook/docusaurus/pull/5771) docs: Minor update to grammar in plugins overview page ([@robbieaverill](https://github.com/robbieaverill))
  - [#5774](https://github.com/facebook/docusaurus/pull/5774) docs: update ssrTemplate ([@juzhiyuan](https://github.com/juzhiyuan))
  - [#5784](https://github.com/facebook/docusaurus/pull/5784) docs: fix link for apply to DocSearch program ([@lex111](https://github.com/lex111))
- `create-docusaurus`
  - [#5792](https://github.com/facebook/docusaurus/pull/5792) docs: fix typo ([@wingclover](https://github.com/wingclover))

#### :house: Internal

- Other
  - [#5842](https://github.com/facebook/docusaurus/pull/5842) misc: add "name" field for root package.json ([@wpyoga](https://github.com/wpyoga))
  - [#5836](https://github.com/facebook/docusaurus/pull/5836) chore: switch to GitHub issue forms ([@lex111](https://github.com/lex111))
  - [#5834](https://github.com/facebook/docusaurus/pull/5834) chore(issue templ): add "self service" section in templates ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5833](https://github.com/facebook/docusaurus/pull/5833) chore(workflow): remove v2 prefix from titles ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5697](https://github.com/facebook/docusaurus/pull/5697) chore(workflow): add cache to workflows using actions/setup-node ([@oscard0m](https://github.com/oscard0m))
  - [#5825](https://github.com/facebook/docusaurus/pull/5825) chore: fix Crowdin again ([@slorber](https://github.com/slorber))
  - [#5823](https://github.com/facebook/docusaurus/pull/5823) chore: replace doc sample .pdf file by .xlsx to solve Crowdin issue ([@slorber](https://github.com/slorber))
  - [#5763](https://github.com/facebook/docusaurus/pull/5763) chore: update examples for beta.8 ([@slorber](https://github.com/slorber))
- `create-docusaurus`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#5812](https://github.com/facebook/docusaurus/pull/5812) chore: require Node 14 ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus`
  - [#5807](https://github.com/facebook/docusaurus/pull/5807) refactor: remove a few Lodash usages & ESLint enforcement ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils`, `docusaurus`
  - [#5808](https://github.com/facebook/docusaurus/pull/5808) refactor: clear a few ESLint warnings ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `lqip-loader`
  - [#5779](https://github.com/facebook/docusaurus/pull/5779) refactor: migrate lqip-loader to TS, fix typing for Webpack Loaders ([@Josh-Cena](https://github.com/Josh-Cena))

#### Committers: 18

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Avi Vahl ([@AviVahl](https://github.com/AviVahl))
- Devtato ([@cerkiewny](https://github.com/cerkiewny))
- Dmitriy Fishman ([@fishmandev](https://github.com/fishmandev))
- Dominik Meyer ([@dominikmeyersap](https://github.com/dominikmeyersap))
- Gabriel Falcão ([@gabrielfalcao](https://github.com/gabrielfalcao))
- Jeffrey Aven ([@jeffreyaven](https://github.com/jeffreyaven))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Ngô Quốc Đạt ([@datlechin](https://github.com/datlechin))
- Oscar Dominguez ([@oscard0m](https://github.com/oscard0m))
- Robbie Averill ([@robbieaverill](https://github.com/robbieaverill))
- Sergio Moreno ([@semoal](https://github.com/semoal))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Varun Sivapalan ([@sivapalan](https://github.com/sivapalan))
- Vladimir Tasic ([@utajum](https://github.com/utajum))
- William Poetra Yoga ([@wpyoga](https://github.com/wpyoga))
- Ying Wang ([@wingclover](https://github.com/wingclover))
- 琚致远 ([@juzhiyuan](https://github.com/juzhiyuan))

## 2.0.0-beta.8 (2021-10-21)

#### :rocket: New Feature

- `docusaurus-plugin-content-blog`
  - [#5702](https://github.com/facebook/docusaurus/pull/5702) feat(content-blog): new readingTime plugin option ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#5740](https://github.com/facebook/docusaurus/pull/5740) feat(core): write-heading-ids options maintainCasing, overwrite ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`
  - [#5705](https://github.com/facebook/docusaurus/pull/5705) feat(content-docs): new front matter options to customize pagination ([@Josh-Cena](https://github.com/Josh-Cena))

#### :boom: Breaking Change

- `docusaurus-theme-search-algolia`
  - [#5751](https://github.com/facebook/docusaurus/pull/5751) fix: stable callbacks in useSearchQuery + refactor ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-plugin-ideal-image`
  - [#5760](https://github.com/facebook/docusaurus/pull/5760) fix(ideal-image): fix IdealImage in dev not handling ES import images properly ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#5732](https://github.com/facebook/docusaurus/pull/5732) fix(theme-classic): allow tabs with number as value ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5721](https://github.com/facebook/docusaurus/pull/5721) fix: handle rubber band scrolling in hideable navbar ([@lex111](https://github.com/lex111))
- `docusaurus-theme-search-algolia`
  - [#5751](https://github.com/facebook/docusaurus/pull/5751) fix: stable callbacks in useSearchQuery + refactor ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#5717](https://github.com/facebook/docusaurus/pull/5717) refactor: Polish de translation ([@philipp985](https://github.com/philipp985))
  - [#5725](https://github.com/facebook/docusaurus/pull/5725) refactor: add missing Turkish translations to theme-classic ([@canercanbaz](https://github.com/canercanbaz))
  - [#5723](https://github.com/facebook/docusaurus/pull/5723) refactor(v2): update Vietnamese translations ([@datlechin](https://github.com/datlechin))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-ideal-image`, `docusaurus-theme-classic`, `docusaurus`
  - [#5726](https://github.com/facebook/docusaurus/pull/5726) refactor(module-type-aliases): remove fallback aliases ([@Josh-Cena](https://github.com/Josh-Cena))

#### :memo: Documentation

- Other
  - [#5755](https://github.com/facebook/docusaurus/pull/5755) docs: rename docusaurus.config.js route + redirects cleanup ([@slorber](https://github.com/slorber))
  - [#5750](https://github.com/facebook/docusaurus/pull/5750) docs(v2): Fix typo in using-plugins.md ([@thanasis00](https://github.com/thanasis00))
  - [#5727](https://github.com/facebook/docusaurus/pull/5727) docs(v2): Add Fenghua Frontend Developer site to showcase page ([@zxuqian](https://github.com/zxuqian))
  - [#5746](https://github.com/facebook/docusaurus/pull/5746) docs: Add plugin-image-zoom ([@ataft](https://github.com/ataft))
  - [#5728](https://github.com/facebook/docusaurus/pull/5728) docs: add h4 into toc on certain pages ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5737](https://github.com/facebook/docusaurus/pull/5737) docs: Add Apex FP to showcase ([@ipavlic](https://github.com/ipavlic))
- `docusaurus-plugin-content-blog`
  - [#5753](https://github.com/facebook/docusaurus/pull/5753) fix(content-blog): temporarily swallow feed mdxToHtml errors + feed refactor ([@slorber](https://github.com/slorber))

#### :house: Internal

- `docusaurus`
  - [#5761](https://github.com/facebook/docusaurus/pull/5761) chore: upgrade html-webpack-plugin, remove terser 4 ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#5714](https://github.com/facebook/docusaurus/pull/5714) chore: Enable ESLint rules of hooks + fix new lint errors ([@slorber](https://github.com/slorber))
- Other
  - [#5722](https://github.com/facebook/docusaurus/pull/5722) chore: fix gen script to support TS template ([@lex111](https://github.com/lex111))
  - [#5730](https://github.com/facebook/docusaurus/pull/5730) chore: fix typos / casing in issue template ([@johnnyreilly](https://github.com/johnnyreilly))
  - [#5720](https://github.com/facebook/docusaurus/pull/5720) chore: regenerate beta.7 examples ([@lex111](https://github.com/lex111))
  - [#5719](https://github.com/facebook/docusaurus/pull/5719) chore: remove beta.5 docs ([@lex111](https://github.com/lex111))

#### :running_woman: Performance

- `docusaurus`
  - [#5748](https://github.com/facebook/docusaurus/pull/5748) refactor: perform shallow clone during deploy ([@nlfurniss](https://github.com/nlfurniss))

#### Committers: 13

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Andrew Taft ([@ataft](https://github.com/ataft))
- Caner Canbaz ([@canercanbaz](https://github.com/canercanbaz))
- Dimi Mikadze ([@DimiMikadze](https://github.com/DimiMikadze))
- Ilija Pavlic ([@ipavlic](https://github.com/ipavlic))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Nathaniel Furniss ([@nlfurniss](https://github.com/nlfurniss))
- Ngô Quốc Đạt ([@datlechin](https://github.com/datlechin))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Thanasis Katsadas ([@thanasis00](https://github.com/thanasis00))
- Xuqian ([@zxuqian](https://github.com/zxuqian))
- [@philipp985](https://github.com/philipp985)

## 2.0.0-beta.7 (2021-10-15)

#### :rocket: New Feature

- `docusaurus-module-type-aliases`, `docusaurus`
  - [#5683](https://github.com/facebook/docusaurus/pull/5683) feat: make Translate children optional ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5674](https://github.com/facebook/docusaurus/pull/5674) polish(theme-classic): guard against potential definition mistakes in Tabs ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5618](https://github.com/facebook/docusaurus/pull/5618) feat: maintain page position for clicked grouped tabs ([@Shrugsy](https://github.com/Shrugsy))
- `docusaurus-plugin-content-blog`, `docusaurus-utils`
  - [#4330](https://github.com/facebook/docusaurus/pull/4330) feat(content-blog): add full blog post html into RSS/Atom feeds ([@moonrailgun](https://github.com/moonrailgun))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5642](https://github.com/facebook/docusaurus/pull/5642) feat(theme-classic, plugin-docs): sidebar item level-specific className + allow customization ([@Josh-Cena](https://github.com/Josh-Cena))
- `create-docusaurus`
  - [#5635](https://github.com/facebook/docusaurus/pull/5635) feat: npm init docusaurus, yarn create docusaurus ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`
  - [#5589](https://github.com/facebook/docusaurus/pull/5589) feat: properly type-check the Docusaurus config of new sites ([@bmiddha](https://github.com/bmiddha))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus-utils-validation`
  - [#5578](https://github.com/facebook/docusaurus/pull/5578) feat(v2): allow specifying TOC max depth (themeConfig + frontMatter) ([@erickzhao](https://github.com/erickzhao))
- `docusaurus`
  - [#5498](https://github.com/facebook/docusaurus/pull/5498) feat: make Webpack url-loader limit configurable (env variable) ([@stnor](https://github.com/stnor))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`
  - [#5545](https://github.com/facebook/docusaurus/pull/5545) feat: make tags route path configurable ([@lex111](https://github.com/lex111))

#### :boom: Breaking Change

- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5674](https://github.com/facebook/docusaurus/pull/5674) polish(theme-classic): guard against potential definition mistakes in Tabs ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5618](https://github.com/facebook/docusaurus/pull/5618) feat: maintain page position for clicked grouped tabs ([@Shrugsy](https://github.com/Shrugsy))
- `docusaurus-init`, `docusaurus-preset-bootstrap`, `docusaurus-theme-bootstrap`
  - [#5634](https://github.com/facebook/docusaurus/pull/5634) chore: remove unused Bootstrap theme ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus-utils-validation`
  - [#5578](https://github.com/facebook/docusaurus/pull/5578) feat(v2): allow specifying TOC max depth (themeConfig + frontMatter) ([@erickzhao](https://github.com/erickzhao))
- `docusaurus-theme-classic`
  - [#5592](https://github.com/facebook/docusaurus/pull/5592) refactor: use CSS Modules for toggle styles ([@lex111](https://github.com/lex111))

#### :bug: Bug Fix

- `docusaurus-theme-common`
  - [#5694](https://github.com/facebook/docusaurus/pull/5694) fix: proper collapsing of long element ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#5684](https://github.com/facebook/docusaurus/pull/5684) fix: use realpath for site dir to resolve symlink ([@lex111](https://github.com/lex111))
  - [#5645](https://github.com/facebook/docusaurus/pull/5645) fix: place root route at the end ([@lex111](https://github.com/lex111))
  - [#5629](https://github.com/facebook/docusaurus/pull/5629) fix: text/link hydration bug ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5699](https://github.com/facebook/docusaurus/pull/5699) fix: apply announcement bar class if only needed ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#5667](https://github.com/facebook/docusaurus/pull/5667) fix: expand tag column on truncated post ([@lex111](https://github.com/lex111))
  - [#5668](https://github.com/facebook/docusaurus/pull/5668) fix: preserve line breaks when copy code in Firefox ([@lex111](https://github.com/lex111))
  - [#5647](https://github.com/facebook/docusaurus/pull/5647) feat(theme-classic): make first tab the default tab ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5652](https://github.com/facebook/docusaurus/pull/5652) fix: restore duplicate Tabs rendering to fix hydration issue ([@slorber](https://github.com/slorber))
  - [#5643](https://github.com/facebook/docusaurus/pull/5643) fix(theme-classic): reset default style for task lists ([@EkaterinaMozheiko](https://github.com/EkaterinaMozheiko))
  - [#5571](https://github.com/facebook/docusaurus/pull/5571) fix: highlight active item in recent post list ([@lex111](https://github.com/lex111))
  - [#5481](https://github.com/facebook/docusaurus/pull/5481) fix: use heading itself as anchor for better crawling ([@lex111](https://github.com/lex111))
- `docusaurus-theme-live-codeblock`
  - [#5677](https://github.com/facebook/docusaurus/pull/5677) fix: Don't ignore options.transforms for buble ([@ntucker](https://github.com/ntucker))
  - [#5556](https://github.com/facebook/docusaurus/pull/5556) fix: pin react-live due to possible mismatch React ([@lex111](https://github.com/lex111))
- `docusaurus-mdx-loader`
  - [#5690](https://github.com/facebook/docusaurus/pull/5690) fix: preserve hash in asset link ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-ideal-image`
  - [#5540](https://github.com/facebook/docusaurus/pull/5540) fix: do not use ideal image plugin in dev env ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`
  - [#5606](https://github.com/facebook/docusaurus/pull/5606) fix(docs): create tags route if only tags exists ([@lex111](https://github.com/lex111))
- `docusaurus-init`, `docusaurus-module-type-aliases`, `docusaurus-types`
  - [#5601](https://github.com/facebook/docusaurus/pull/5601) fix(module-type-aliases): move @type packages to dependencies ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-utils`
  - [#5495](https://github.com/facebook/docusaurus/pull/5495) fix: ignore code block lines when creating excerpt ([@lex111](https://github.com/lex111))
- `docusaurus-init`
  - [#5490](https://github.com/facebook/docusaurus/pull/5490) fix: install deps for new project via Yarn on Windows properly ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-utils-validation`
  - [#5479](https://github.com/facebook/docusaurus/pull/5479) fix: add docs tag validation to solve #5478 ([@sw-yx](https://github.com/sw-yx))

#### :nail_care: Polish

- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5709](https://github.com/facebook/docusaurus/pull/5709) refactor: cleanup scroll handlers ([@lex111](https://github.com/lex111))
  - [#5627](https://github.com/facebook/docusaurus/pull/5627) refactor: various TOC improvements ([@lex111](https://github.com/lex111))
  - [#5469](https://github.com/facebook/docusaurus/pull/5469) refactor: Adjust styling of back top top button ([@dsmmcken](https://github.com/dsmmcken))
- `docusaurus-theme-classic`
  - [#5708](https://github.com/facebook/docusaurus/pull/5708) refactor: hide hash link from crawlers ([@lex111](https://github.com/lex111))
  - [#5649](https://github.com/facebook/docusaurus/pull/5649) refactor: improve pt-BR translation for classic theme ([@printf-ana](https://github.com/printf-ana))
  - [#5646](https://github.com/facebook/docusaurus/pull/5646) refactor: complete missing and fix ES translations ([@caleeli](https://github.com/caleeli))
  - [#5640](https://github.com/facebook/docusaurus/pull/5640) style: update Persian language translations ([@MrTechHunter](https://github.com/MrTechHunter))
  - [#5630](https://github.com/facebook/docusaurus/pull/5630) refactor: standardize using media queries ([@lex111](https://github.com/lex111))
  - [#5487](https://github.com/facebook/docusaurus/pull/5487) refactor: use only one close SVG icon ([@lex111](https://github.com/lex111))
  - [#5592](https://github.com/facebook/docusaurus/pull/5592) refactor: use CSS Modules for toggle styles ([@lex111](https://github.com/lex111))
  - [#5485](https://github.com/facebook/docusaurus/pull/5485) polish: prevent pop navigation on back if navbar sidebar is open ([@slorber](https://github.com/slorber))
  - [#5472](https://github.com/facebook/docusaurus/pull/5472) polish(theme-classic): add Chinese translations ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus`
  - [#5636](https://github.com/facebook/docusaurus/pull/5636) refactor: make all Props defined as interface + readonly ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus`
  - [#5560](https://github.com/facebook/docusaurus/pull/5560) polish: remove unused eslint-disable ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#5580](https://github.com/facebook/docusaurus/pull/5580) refactor(core): type improvements for `PendingNavigation` ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus`
  - [#5496](https://github.com/facebook/docusaurus/pull/5496) refactor: remove deprecated createRequireFromPath ([@lex111](https://github.com/lex111))

#### :memo: Documentation

- [#5681](https://github.com/facebook/docusaurus/pull/5681) docs(v2): Add CountryStateCityAPI site to showcase page ([@dr5hn](https://github.com/dr5hn))
- [#5661](https://github.com/facebook/docusaurus/pull/5661) docs: updated cloudywithachanceofbigdata.com blog showcase ([@jeffreyaven](https://github.com/jeffreyaven))
- [#5658](https://github.com/facebook/docusaurus/pull/5658) docs: Algolia plugin must be enabled before crawling the site ([@slorber](https://github.com/slorber))
- [#5654](https://github.com/facebook/docusaurus/pull/5654) docs: Add Warrant Docs site to showcase page ([@akajla09](https://github.com/akajla09))
- [#5655](https://github.com/facebook/docusaurus/pull/5655) docs: Added cloudywithachanceofbigdata.com showcase blog ([@jeffreyaven](https://github.com/jeffreyaven))
- [#5648](https://github.com/facebook/docusaurus/pull/5648) docs: add ory documentation to showcase ([@vinckr](https://github.com/vinckr))
- [#5644](https://github.com/facebook/docusaurus/pull/5644) docs: add djamaile blog to site showcase ([@djamaile](https://github.com/djamaile))
- [#5641](https://github.com/facebook/docusaurus/pull/5641) docs: add Lux Algo to showcase ([@Josh-Cena](https://github.com/Josh-Cena))
- [#5638](https://github.com/facebook/docusaurus/pull/5638) docs: add nanos world docs to showcase ([@gtnardy](https://github.com/gtnardy))
- [#5610](https://github.com/facebook/docusaurus/pull/5610) docs: Add IOTA wiki to showcase ([@Dr-Electron](https://github.com/Dr-Electron))
- [#5489](https://github.com/facebook/docusaurus/pull/5489) docs: add additional search options, typesense and local search ([@jasonbosco](https://github.com/jasonbosco))
- [#5590](https://github.com/facebook/docusaurus/pull/5590) docs(website): document npm2yarn plugin + use new Tabs API everywhere ([@Josh-Cena](https://github.com/Josh-Cena))
- [#5591](https://github.com/facebook/docusaurus/pull/5591) docs: Add whirl.codes to showcase ([@Whirl21](https://github.com/Whirl21))
- [#5574](https://github.com/facebook/docusaurus/pull/5574) docs: add Pipeline UI to showcase ([@headline-design](https://github.com/headline-design))
- [#5585](https://github.com/facebook/docusaurus/pull/5585) docs: fix more references to Discord channels ([@Josh-Cena](https://github.com/Josh-Cena))
- [#5572](https://github.com/facebook/docusaurus/pull/5572) docs: add Blogasaurus to showcase ([@BattleOfPlassey](https://github.com/BattleOfPlassey))
- [#5575](https://github.com/facebook/docusaurus/pull/5575) docs: clarify MDX version used ([@lex111](https://github.com/lex111))
- [#5581](https://github.com/facebook/docusaurus/pull/5581) docs(website): update all Discord links ([@Josh-Cena](https://github.com/Josh-Cena))
- [#5566](https://github.com/facebook/docusaurus/pull/5566) docs: fix code example ([@ChrisChinchilla](https://github.com/ChrisChinchilla))
- [#5559](https://github.com/facebook/docusaurus/pull/5559) docs: minor grammatical correction ([@jkhaui](https://github.com/jkhaui))
- [#5543](https://github.com/facebook/docusaurus/pull/5543) docs: add note about files being ignored when prefixed with an unders… ([@KyrietS](https://github.com/KyrietS))
- [#5549](https://github.com/facebook/docusaurus/pull/5549) docs: Add Mint Metrics site to the Showcase ([@kingo55](https://github.com/kingo55))
- [#5546](https://github.com/facebook/docusaurus/pull/5546) docs: add unleash to showcase ([@ivarconr](https://github.com/ivarconr))
- [#5539](https://github.com/facebook/docusaurus/pull/5539) docs: improve escape pipe in Markdown tables ([@forresst](https://github.com/forresst))
- [#5486](https://github.com/facebook/docusaurus/pull/5486) docs: mention Netlify ignore build setting ([@slorber](https://github.com/slorber))
- [#5482](https://github.com/facebook/docusaurus/pull/5482) docs: update docusaurus-plugin-relative-paths description ([@ohkimur](https://github.com/ohkimur))

#### :house: Internal

- `create-docusaurus`, `docusaurus-plugin-content-docs`
  - [#5678](https://github.com/facebook/docusaurus/pull/5678) refactor(content-docs): refactor sidebars, Joi validation, generator rework, expose config types ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#5666](https://github.com/facebook/docusaurus/pull/5666) chore: upgrade Infima to alpha.34 ([@lex111](https://github.com/lex111))
  - [#5639](https://github.com/facebook/docusaurus/pull/5639) misc: update base translation + remove extra char ([@lex111](https://github.com/lex111))
- Other
  - [#5669](https://github.com/facebook/docusaurus/pull/5669) fix: allow ColorGenerator to parse colors with prefix `#` ([@Andrewnt219](https://github.com/Andrewnt219))
  - [#5632](https://github.com/facebook/docusaurus/pull/5632) chore: prepare Algolia migration ([@slorber](https://github.com/slorber))
  - [#5628](https://github.com/facebook/docusaurus/pull/5628) chore: fix warning after build ([@lex111](https://github.com/lex111))
  - [#5573](https://github.com/facebook/docusaurus/pull/5573) misc: fix ungrammatical sentence about 5-min tutorial ([@hughlilly](https://github.com/hughlilly))
  - [#5499](https://github.com/facebook/docusaurus/pull/5499) chore: set up CodeQL ([@zpao](https://github.com/zpao))
  - [#5474](https://github.com/facebook/docusaurus/pull/5474) chore: remove beta.4 docs (already archived) ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus-preset-bootstrap`, `docusaurus-theme-bootstrap`
  - [#5634](https://github.com/facebook/docusaurus/pull/5634) chore: remove unused Bootstrap theme ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#5611](https://github.com/facebook/docusaurus/pull/5611) chore: upgrade Prettier + regenerate lock file ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-pwa`, `docusaurus`
  - [#5609](https://github.com/facebook/docusaurus/pull/5609) chore: upgrade Terser-related dependencies ([@lex111](https://github.com/lex111))
- `docusaurus-cssnano-preset`, `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#5608](https://github.com/facebook/docusaurus/pull/5608) chore: upgrade dependencies ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#5605](https://github.com/facebook/docusaurus/pull/5605) refactor(core): enforce noImplicitAny ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-preset-classic`
  - [#5603](https://github.com/facebook/docusaurus/pull/5603) fix(preset-classic): fix TS build issue ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-preset-classic`
  - [#5561](https://github.com/facebook/docusaurus/pull/5561) refactor(plugin-google-gtag, plugin-google-analytics): migrate packages to TS ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-sitemap`, `docusaurus-preset-classic`
  - [#5579](https://github.com/facebook/docusaurus/pull/5579) refactor(preset-classic): migrate preset-classic to TypeScript ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-init`
  - [#5484](https://github.com/facebook/docusaurus/pull/5484) chore: regenerate beta.6 examples + fix regen script ([@slorber](https://github.com/slorber))

#### Committers: 36

- Aditya Kajla ([@akajla09](https://github.com/akajla09))
- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Ana Carolina ([@printf-ana](https://github.com/printf-ana))
- Andrew Nguyen ([@Andrewnt219](https://github.com/Andrewnt219))
- Bharat Middha ([@bmiddha](https://github.com/bmiddha))
- Chris Chinchilla ([@ChrisChinchilla](https://github.com/ChrisChinchilla))
- Daniel Costrasel ([@ohkimur](https://github.com/ohkimur))
- Darshan Gada ([@dr5hn](https://github.com/dr5hn))
- David Callizaya ([@caleeli](https://github.com/caleeli))
- Don ([@dsmmcken](https://github.com/dsmmcken))
- Ekaterina Mozheiko ([@EkaterinaMozheiko](https://github.com/EkaterinaMozheiko))
- Erick Zhao ([@erickzhao](https://github.com/erickzhao))
- Forresst ([@forresst](https://github.com/forresst))
- Gabriel T. Nardy ([@gtnardy](https://github.com/gtnardy))
- Hugh Lilly ([@hughlilly](https://github.com/hughlilly))
- Ivar Conradi Østhus ([@ivarconr](https://github.com/ivarconr))
- Jason Bosco ([@jasonbosco](https://github.com/jasonbosco))
- Jeffrey Aven ([@jeffreyaven](https://github.com/jeffreyaven))
- Jordan Lee ([@jkhaui](https://github.com/jkhaui))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Kyriet ([@KyrietS](https://github.com/KyrietS))
- Mahdi Hamldar ([@MrTechHunter](https://github.com/MrTechHunter))
- Nathaniel Tucker ([@ntucker](https://github.com/ntucker))
- Palash Shrivastava ([@BattleOfPlassey](https://github.com/BattleOfPlassey))
- Paul O’Shannessy ([@zpao](https://github.com/zpao))
- Robert Kingston ([@kingo55](https://github.com/kingo55))
- Stefan Norberg ([@stnor](https://github.com/stnor))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Vincent ([@vinckr](https://github.com/vinckr))
- Whirl ([@Whirl21](https://github.com/Whirl21))
- [@Dr-Electron](https://github.com/Dr-Electron)
- [@Shrugsy](https://github.com/Shrugsy)
- [@djamaile](https://github.com/djamaile)
- [@headline-design](https://github.com/headline-design)
- moonrailgun ([@moonrailgun](https://github.com/moonrailgun))
- swyx ([@sw-yx](https://github.com/sw-yx))

## 2.0.0-beta.6 (2021-09-02)

#### :rocket: New Feature

- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`
  - [#5428](https://github.com/facebook/docusaurus/pull/5428) feat: adds blog archive route ([@gabrielcsapo](https://github.com/gabrielcsapo))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5462](https://github.com/facebook/docusaurus/pull/5462) feat: on back navigation, close mobile sidebar ([@slorber](https://github.com/slorber))
  - [#5445](https://github.com/facebook/docusaurus/pull/5445) feat: Add docs-related stable classnames ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#5460](https://github.com/facebook/docusaurus/pull/5460) feat: infima 33 + navbar-sidebar close button ([@slorber](https://github.com/slorber))
  - [#5442](https://github.com/facebook/docusaurus/pull/5442) feat(theme-classic): allow passing tab label and default value through TabItem ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#5454](https://github.com/facebook/docusaurus/pull/5454) feat: new docs options: versions.{badge,className} ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#5444](https://github.com/facebook/docusaurus/pull/5444) fix: fix some theme UI issues (blockquotes, navbar-sidebar font) with Infima alpha.32 ([@slorber](https://github.com/slorber))
  - [#5431](https://github.com/facebook/docusaurus/pull/5431) fix: some beta.5 bugfixes ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#5437](https://github.com/facebook/docusaurus/pull/5437) fix: fix a few TS errors ([@Josh-Cena](https://github.com/Josh-Cena))

#### :nail_care: Polish

- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#5459](https://github.com/facebook/docusaurus/pull/5459) refactor(theme-classic): completely migrate package to TypeScript ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#5453](https://github.com/facebook/docusaurus/pull/5453) refactor: use SVG for closable button in announcement bar ([@lex111](https://github.com/lex111))
  - [#5430](https://github.com/facebook/docusaurus/pull/5430) refactor: switch to Flexbox in announcement bar ([@lex111](https://github.com/lex111))
  - [#5434](https://github.com/facebook/docusaurus/pull/5434) refactor: update Arabic and Persian translations ([@3alisaki](https://github.com/3alisaki))
  - [#5410](https://github.com/facebook/docusaurus/pull/5410) refactor: add missing translations in fa.json ([@farshidinanloo](https://github.com/farshidinanloo))

#### :memo: Documentation

- [#5471](https://github.com/facebook/docusaurus/pull/5471) docs: Add docusaurus-plugin-relative-paths ([@ohkimur](https://github.com/ohkimur))
- [#5464](https://github.com/facebook/docusaurus/pull/5464) docs: add mapillary-js to showcase ([@oscarlorentzon](https://github.com/oscarlorentzon))
- [#5433](https://github.com/facebook/docusaurus/pull/5433) docs: document doc tags + refinements ([@Josh-Cena](https://github.com/Josh-Cena))
- [#5435](https://github.com/facebook/docusaurus/pull/5435) docs: Add netboot.xyz to site showcase ([@antonym](https://github.com/antonym))
- [#5436](https://github.com/facebook/docusaurus/pull/5436) docs: add Redocusaurus in community plugin list ([@rohit-gohri](https://github.com/rohit-gohri))

#### :house: Internal

- [#5455](https://github.com/facebook/docusaurus/pull/5455) fix: website bad version name in docusaurus.config.js ([@slorber](https://github.com/slorber))

#### Committers: 10

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Ali Saki ([@3alisaki](https://github.com/3alisaki))
- Antony Messerli ([@antonym](https://github.com/antonym))
- Daniel Costrasel ([@ohkimur](https://github.com/ohkimur))
- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Oscar Lorentzon ([@oscarlorentzon](https://github.com/oscarlorentzon))
- Rohit Gohri ([@rohit-gohri](https://github.com/rohit-gohri))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- farshid ([@farshidinanloo](https://github.com/farshidinanloo))

## 2.0.0-beta.5 (2021-08-26)

#### :rocket: New Feature

- `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-utils-validation`
  - [#5396](https://github.com/facebook/docusaurus/pull/5396) feat(plugin-blog): multi-authors support + authors.yml global configuration ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`
  - [#5371](https://github.com/facebook/docusaurus/pull/5371) feat: make blog config options and navbar versions dropdown label translatable ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5375](https://github.com/facebook/docusaurus/pull/5375) feat: add metatags support for seo / blogposts #5373 ([@johnnyreilly](https://github.com/johnnyreilly))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils-validation`, `docusaurus-utils`
  - [#3646](https://github.com/facebook/docusaurus/pull/3646) feat: doc tags (same as blog tags) ([@isaac-philip](https://github.com/isaac-philip))
- `docusaurus-plugin-content-blog`
  - [#5354](https://github.com/facebook/docusaurus/pull/5354) feat(plugin-blog): allow `'ALL'` as `postsPerPage` option value ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#5330](https://github.com/facebook/docusaurus/pull/5330) feat: Markdown page-specific head metadatas ([@slorber](https://github.com/slorber))
  - [#5322](https://github.com/facebook/docusaurus/pull/5322) feat: structured data for blog posts ([@johnnyreilly](https://github.com/johnnyreilly))
  - [#5314](https://github.com/facebook/docusaurus/pull/5314) feat(v2): add cs (Czech) translations for docusaurus-theme-classic ([@michalsanger](https://github.com/michalsanger))
- `docusaurus-init`
  - [#5233](https://github.com/facebook/docusaurus/pull/5233) feat: new init template classic-typescript ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`
  - [#5309](https://github.com/facebook/docusaurus/pull/5309) feat: blog posts support /YYYY/MM/DD/blog-post/index.md pattern + blog frontmatter can reference relative images ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus`
  - [#5299](https://github.com/facebook/docusaurus/pull/5299) feat: mdx loader fallback, allow importing mdx docs from anywhere ([@slorber](https://github.com/slorber))

#### :boom: Breaking Change

- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils-validation`, `docusaurus-utils`
  - [#3646](https://github.com/facebook/docusaurus/pull/3646) feat: doc tags (same as blog tags) ([@isaac-philip](https://github.com/isaac-philip))
- `docusaurus-init`, `docusaurus-migrate`, `docusaurus-plugin-content-docs`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus`
  - [#5345](https://github.com/facebook/docusaurus/pull/5345) refactor: rename Git master branch to main ([@zpao](https://github.com/zpao))
- `docusaurus-module-type-aliases`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-types`, `docusaurus`
  - [#5349](https://github.com/facebook/docusaurus/pull/5349) refactor(core): replace useDocusaurusContext().isClient by useIsBrowser() ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#5264](https://github.com/facebook/docusaurus/pull/5264) fix: apply proper class for active doc item on mobiles + avoid duplicated classes ([@lex111](https://github.com/lex111))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#5425](https://github.com/facebook/docusaurus/pull/5425) fix: toc does not highlight clicked anchor + use scroll-margin-top ([@slorber](https://github.com/slorber))
  - [#5424](https://github.com/facebook/docusaurus/pull/5424) refactor: make dynamic authors layout via CSS only ([@lex111](https://github.com/lex111))
  - [#5422](https://github.com/facebook/docusaurus/pull/5422) fix: make tags wrapping properly ([@lex111](https://github.com/lex111))
  - [#5419](https://github.com/facebook/docusaurus/pull/5419) fix: various fixes back-to-top button ([@lex111](https://github.com/lex111))
  - [#5361](https://github.com/facebook/docusaurus/pull/5361) fix: refactor TOC highlighting + handle edge cases ([@slorber](https://github.com/slorber))
  - [#5357](https://github.com/facebook/docusaurus/pull/5357) fix: code blocks should scroll in RTL direction ([@slorber](https://github.com/slorber))
  - [#5346](https://github.com/facebook/docusaurus/pull/5346) fix: author/image adjustments in BlogPosting schema ([@lex111](https://github.com/lex111))
  - [#5240](https://github.com/facebook/docusaurus/pull/5240) fix: remove top margin only from directly first element ([@lex111](https://github.com/lex111))
  - [#5317](https://github.com/facebook/docusaurus/pull/5317) fix: make proper highlighting doc link if no sidebar ([@hamzahamidi](https://github.com/hamzahamidi))
  - [#5316](https://github.com/facebook/docusaurus/pull/5316) fix: avoid extra default active class on doc sidebar item ([@lex111](https://github.com/lex111))
  - [#5319](https://github.com/facebook/docusaurus/pull/5319) fix: unbreak highlighting regular navbar links ([@lex111](https://github.com/lex111))
  - [#5264](https://github.com/facebook/docusaurus/pull/5264) fix: apply proper class for active doc item on mobiles + avoid duplicated classes ([@lex111](https://github.com/lex111))
  - [#5275](https://github.com/facebook/docusaurus/pull/5275) fix: improve spanish translation ([@faloi](https://github.com/faloi))
  - [#5262](https://github.com/facebook/docusaurus/pull/5262) fix: show secondary menu if even there is no main one ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#5426](https://github.com/facebook/docusaurus/pull/5426) fix: Make update-notifier fail-safe if no permission to read configStore ([@slorber](https://github.com/slorber))
  - [#5398](https://github.com/facebook/docusaurus/pull/5398) fix: fix write-translations warning for theme-common translations ([@slorber](https://github.com/slorber))
  - [#5381](https://github.com/facebook/docusaurus/pull/5381) fix: canary releases should ignore notifier updates ([@slorber](https://github.com/slorber))
  - [#5339](https://github.com/facebook/docusaurus/pull/5339) fix: add admonitions support to mdx partials loaded through the fallback mdx loader ([@slorber](https://github.com/slorber))
  - [#5311](https://github.com/facebook/docusaurus/pull/5311) fix: docusaurus serve logs wrong port if 3000 is taken ([@wan-nyan-wan](https://github.com/wan-nyan-wan))
  - [#5308](https://github.com/facebook/docusaurus/pull/5308) fix: remove unexpected whitespaces in CSS bundle ([@lex111](https://github.com/lex111))
  - [#5268](https://github.com/facebook/docusaurus/pull/5268) fix: fix wrong regex that removes extra letters from swizzled component names ([@Josh-Cena](https://github.com/Josh-Cena))
- Other
  - [#5399](https://github.com/facebook/docusaurus/pull/5399) fix: fix site unlocalized 404 pages + aggressive Netlify /assets caching ([@slorber](https://github.com/slorber))
  - [#5249](https://github.com/facebook/docusaurus/pull/5249) fix: fix Crowdin mapping for pt-BR ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus`
  - [#5383](https://github.com/facebook/docusaurus/pull/5383) fix: fix Locale Dropdown RTL icon + Webpack aliases ordering ([@slorber](https://github.com/slorber))
- `docusaurus-init`
  - [#5370](https://github.com/facebook/docusaurus/pull/5370) fix(init): fix links to feature images in classic-typescript ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-common`
  - [#5364](https://github.com/facebook/docusaurus/pull/5364) fix: unbreak Details component ([@lex111](https://github.com/lex111))
  - [#5297](https://github.com/facebook/docusaurus/pull/5297) fix: fix constant value import ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-ideal-image`
  - [#5334](https://github.com/facebook/docusaurus/pull/5334) fix: plugin ideal-image should generate filename with a hash even in development ([@Pierre-Gilles](https://github.com/Pierre-Gilles))
- `docusaurus-theme-search-algolia`
  - [#5290](https://github.com/facebook/docusaurus/pull/5290) fix: make successful build if missing favicon ([@lex111](https://github.com/lex111))
- `docusaurus-utils`
  - [#5270](https://github.com/facebook/docusaurus/pull/5270) fix: ability to link md files with relative paths when paths contain space ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-types`
  - [#5261](https://github.com/facebook/docusaurus/pull/5261) fix: fix various TS errors ([@Josh-Cena](https://github.com/Josh-Cena))

#### :nail_care: Polish

- `docusaurus-theme-common`
  - [#5402](https://github.com/facebook/docusaurus/pull/5402) refactor: improve styles of Details component ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#5386](https://github.com/facebook/docusaurus/pull/5386) refactor: various tags improvements ([@lex111](https://github.com/lex111))
  - [#5377](https://github.com/facebook/docusaurus/pull/5377) refactor: make main heading font size changeable via CSS var ([@lex111](https://github.com/lex111))
  - [#5355](https://github.com/facebook/docusaurus/pull/5355) refactor: add blog microdata in markup instead of use JSON-LD ([@lex111](https://github.com/lex111))
  - [#5365](https://github.com/facebook/docusaurus/pull/5365) refactor(v2): improved Farsi default translations ([@massoudmaboudi](https://github.com/massoudmaboudi))
  - [#5280](https://github.com/facebook/docusaurus/pull/5280) refactor(v2): improved Farsi default translations ([@massoudmaboudi](https://github.com/massoudmaboudi))
- Other
  - [#5389](https://github.com/facebook/docusaurus/pull/5389) refactor: clean Canny integration + rename 'Feedback' to 'Feature Requests' + improve TS doc page ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5242](https://github.com/facebook/docusaurus/pull/5242) refactor: reduce ESLint warnings / better typing ([@Josh-Cena](https://github.com/Josh-Cena))

#### :memo: Documentation

- [#5423](https://github.com/facebook/docusaurus/pull/5423) docs: clarify using custom attributes for navbar link ([@lex111](https://github.com/lex111))
- [#5421](https://github.com/facebook/docusaurus/pull/5421) docs: add Indent to showcase ([@fouad](https://github.com/fouad))
- [#5405](https://github.com/facebook/docusaurus/pull/5405) docs: add Gotenberg to showcase ([@gulien](https://github.com/gulien))
- [#5406](https://github.com/facebook/docusaurus/pull/5406) docs: specify proper min Node.js version for Travis CI example ([@BattleOfPlassey](https://github.com/BattleOfPlassey))
- [#5390](https://github.com/facebook/docusaurus/pull/5390) docs(v2): showcase BoxyHQ ([@deepakprabhakara](https://github.com/deepakprabhakara))
- [#5376](https://github.com/facebook/docusaurus/pull/5376) docs(v2): Update Datagit site to showcase page ([@massoudmaboudi](https://github.com/massoudmaboudi))
- [#5372](https://github.com/facebook/docusaurus/pull/5372) docs: remove docusaurus-preset-name from preset doc ([@slorber](https://github.com/slorber))
- [#5366](https://github.com/facebook/docusaurus/pull/5366) docs: Add drayman to showcase ([@jansivans](https://github.com/jansivans))
- [#5369](https://github.com/facebook/docusaurus/pull/5369) docs(v2): Add Nocalhost website to showcase page ([@neaped](https://github.com/neaped))
- [#5351](https://github.com/facebook/docusaurus/pull/5351) docs(website): bump announcement bar + include Twitter link + refactor site colors ([@slorber](https://github.com/slorber))
- [#5352](https://github.com/facebook/docusaurus/pull/5352) docs: update `docusaurus-plugin-sass` instructions ([@erickzhao](https://github.com/erickzhao))
- [#5332](https://github.com/facebook/docusaurus/pull/5332) docs(v2): add mdx-mermaid to resources ([@sjwall](https://github.com/sjwall))
- [#5331](https://github.com/facebook/docusaurus/pull/5331) docs: Changelog page should display TOC with releases ([@slorber](https://github.com/slorber))
- [#5329](https://github.com/facebook/docusaurus/pull/5329) docs: add Haochen to showcase page ([@HaochenQ](https://github.com/HaochenQ))
- [#5313](https://github.com/facebook/docusaurus/pull/5313) docs: try to make plugin/preset config less confusing ([@slorber](https://github.com/slorber))
- [#5296](https://github.com/facebook/docusaurus/pull/5296) docs: update canary doc ([@slorber](https://github.com/slorber))
- [#5219](https://github.com/facebook/docusaurus/pull/5219) docs: refactor API documentation ([@Josh-Cena](https://github.com/Josh-Cena))
- [#5271](https://github.com/facebook/docusaurus/pull/5271) Add Plausible Analytics docs to showcase page ([@metmarkosaric](https://github.com/metmarkosaric))
- [#5283](https://github.com/facebook/docusaurus/pull/5283) docs: fix broken link to syncing tab choices section ([@lex111](https://github.com/lex111))
- [#5259](https://github.com/facebook/docusaurus/pull/5259) docs(v2): update Remotion website picture in showcase ([@JonnyBurger](https://github.com/JonnyBurger))
- [#5260](https://github.com/facebook/docusaurus/pull/5260) docs(v2): add Dart Code Metrics site to showcase page ([@incendial](https://github.com/incendial))
- [#5253](https://github.com/facebook/docusaurus/pull/5253) docs: Fix typo `2-resources.md` ([@forresst](https://github.com/forresst))
- [#5248](https://github.com/facebook/docusaurus/pull/5248) docs(v2): add docusaurus-prince-pdf to resources ([@sparanoid](https://github.com/sparanoid))
- [#5239](https://github.com/facebook/docusaurus/pull/5239) docs(v2): Add unmand site to showcase page ([@dbseal](https://github.com/dbseal))

#### :house: Internal

- Other
  - [#5397](https://github.com/facebook/docusaurus/pull/5397) chore: rename docusaurus-2-website package + refactor scripts ([@slorber](https://github.com/slorber))
  - [#5342](https://github.com/facebook/docusaurus/pull/5342) chore: fix e2e yarn berry tests ([@slorber](https://github.com/slorber))
  - [#5328](https://github.com/facebook/docusaurus/pull/5328) refactor(website): convert website to TypeScript ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5336](https://github.com/facebook/docusaurus/pull/5336) chore: bump url-parse from 1.5.1 to 1.5.3 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#5312](https://github.com/facebook/docusaurus/pull/5312) fix: fix changelog page mdx import for i18n ([@slorber](https://github.com/slorber))
  - [#5295](https://github.com/facebook/docusaurus/pull/5295) fix: fix canary release versions ([@slorber](https://github.com/slorber))
  - [#5285](https://github.com/facebook/docusaurus/pull/5285) fix: fix canary version names ([@slorber](https://github.com/slorber))
  - [#5269](https://github.com/facebook/docusaurus/pull/5269) misc: enable pt-BR + archive older versions ([@slorber](https://github.com/slorber))
  - [#5237](https://github.com/facebook/docusaurus/pull/5237) chore: enable pt-BR i18n locale on staging ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus-migrate`, `docusaurus-plugin-content-docs`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus`
  - [#5345](https://github.com/facebook/docusaurus/pull/5345) refactor: rename Git master branch to main ([@zpao](https://github.com/zpao))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5341](https://github.com/facebook/docusaurus/pull/5341) polish: bind key listener to light/dark toggle + a11y lint fixes ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus`
  - [#5347](https://github.com/facebook/docusaurus/pull/5347) chore(mdx-loader): migrate package to TypeScript ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus`
  - [#5335](https://github.com/facebook/docusaurus/pull/5335) refactor: better typing + remove unnecessary eslint-disable ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-blog`
  - [#5338](https://github.com/facebook/docusaurus/pull/5338) refactor(plugin-blog): style improvements in blogUtils ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`
  - [#5256](https://github.com/facebook/docusaurus/pull/5256) chore: upgrade Infima to alpha.30 ([@lex111](https://github.com/lex111))
- `docusaurus-init`
  - [#5315](https://github.com/facebook/docusaurus/pull/5315) refactor(init): share common files between templates ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5284](https://github.com/facebook/docusaurus/pull/5284) refactor: properly type docs version ([@Josh-Cena](https://github.com/Josh-Cena))

#### :running_woman: Performance

- `docusaurus-module-type-aliases`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-types`, `docusaurus`
  - [#5349](https://github.com/facebook/docusaurus/pull/5349) refactor(core): replace useDocusaurusContext().isClient by useIsBrowser() ([@slorber](https://github.com/slorber))

#### Committers: 27

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- David Seal ([@dbseal](https://github.com/dbseal))
- Deepak Prabhakara ([@deepakprabhakara](https://github.com/deepakprabhakara))
- Dmitry Zhifarsky ([@incendial](https://github.com/incendial))
- Erick Zhao ([@erickzhao](https://github.com/erickzhao))
- Federico Aloi ([@faloi](https://github.com/faloi))
- Forresst ([@forresst](https://github.com/forresst))
- Fouad Matin ([@fouad](https://github.com/fouad))
- Garry ([@neaped](https://github.com/neaped))
- Hamza Hamidi ([@hamzahamidi](https://github.com/hamzahamidi))
- Isaac Philip ([@isaac-philip](https://github.com/isaac-philip))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Jonny Burger ([@JonnyBurger](https://github.com/JonnyBurger))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Julien Neuhart ([@gulien](https://github.com/gulien))
- Marko Saric ([@metmarkosaric](https://github.com/metmarkosaric))
- Massoud Maboudi ([@massoudmaboudi](https://github.com/massoudmaboudi))
- Michal Sänger ([@michalsanger](https://github.com/michalsanger))
- Palash Shrivastava ([@BattleOfPlassey](https://github.com/BattleOfPlassey))
- Paul O’Shannessy ([@zpao](https://github.com/zpao))
- Pierre-Gilles Leymarie ([@Pierre-Gilles](https://github.com/Pierre-Gilles))
- Sam Wall ([@sjwall](https://github.com/sjwall))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tunghsiao Liu ([@sparanoid](https://github.com/sparanoid))
- Yan Ivan Evdokimov ([@jansivans](https://github.com/jansivans))
- [@HaochenQ](https://github.com/HaochenQ)
- wan-nyan-wan ([@wan-nyan-wan](https://github.com/wan-nyan-wan))

## 2.0.0-beta.4 (2021-07-28)

#### :rocket: New Feature

- `docusaurus-theme-classic`
  - [#4912](https://github.com/facebook/docusaurus/pull/4912) feat(v2): add back to top button ([@lex111](https://github.com/lex111))
- `docusaurus-init`
  - [#5235](https://github.com/facebook/docusaurus/pull/5235) feat: docusaurus.new + improve StackBlitz playground integration ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5203](https://github.com/facebook/docusaurus/pull/5203) feat: docs plugin options sidebarCollapsible + sidebarCollapsed ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus`
  - [#5207](https://github.com/facebook/docusaurus/pull/5207) feat: multiple playground choices ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus`
  - [#4273](https://github.com/facebook/docusaurus/pull/4273) feat(v2): redesign mobile UX: inline TOC + doc sidebar in main menu ([@lex111](https://github.com/lex111))

#### :boom: Breaking Change

- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5203](https://github.com/facebook/docusaurus/pull/5203) feat: docs plugin options sidebarCollapsible + sidebarCollapsed ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-utils`, `docusaurus`
  - [#5173](https://github.com/facebook/docusaurus/pull/5173) feat(v2): generalize usage of \_ prefix convention to exclude content files/folders ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus`
  - [#4273](https://github.com/facebook/docusaurus/pull/4273) feat(v2): redesign mobile UX: inline TOC + doc sidebar in main menu ([@lex111](https://github.com/lex111))

#### :bug: Bug Fix

- `docusaurus-plugin-content-blog`
  - [#5232](https://github.com/facebook/docusaurus/pull/5232) fix(v2): blog should parse frontMatter.date even when time is present ([@wenerme](https://github.com/wenerme))
- `docusaurus-theme-classic`
  - [#5230](https://github.com/facebook/docusaurus/pull/5230) fix(v2): remove top margin from first element inside doc article ([@lex111](https://github.com/lex111))
  - [#5229](https://github.com/facebook/docusaurus/pull/5229) fix(v2): keep mobile TOC after hydration ([@lex111](https://github.com/lex111))
  - [#5179](https://github.com/facebook/docusaurus/pull/5179) fix(v2): wrap dropdown item to missing li element + remove extra attributes ([@lex111](https://github.com/lex111))
  - [#5183](https://github.com/facebook/docusaurus/pull/5183) fix(v2): pass all props to CodeBlock component ([@lex111](https://github.com/lex111))
  - [#5176](https://github.com/facebook/docusaurus/pull/5176) fix(v2): Fix type for navlink label ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5172](https://github.com/facebook/docusaurus/pull/5172) fix(v2): hide mobile collapsible doc toc if no headings ([@slorber](https://github.com/slorber))
  - [#5161](https://github.com/facebook/docusaurus/pull/5161) fix(v2): disable default behavior when click on collapsible item ([@lex111](https://github.com/lex111))
  - [#5151](https://github.com/facebook/docusaurus/pull/5151) fix(v2): add missing french translations for mobile ([@forresst](https://github.com/forresst))
  - [#5104](https://github.com/facebook/docusaurus/pull/5104) fix(v2): fix SkipToContent programmatic focus when updating querystring ([@slorber](https://github.com/slorber))
- `docusaurus-theme-search-algolia`
  - [#5214](https://github.com/facebook/docusaurus/pull/5214) fix: upgrade Docsearch to avoid layout shift ([@slorber](https://github.com/slorber))
  - [#5135](https://github.com/facebook/docusaurus/pull/5135) chore(v2): update @docsearch/react ([@shortcuts](https://github.com/shortcuts))
- `docusaurus`
  - [#5204](https://github.com/facebook/docusaurus/pull/5204) fix: cli upgrade helper fail when no `package.dependencies` ([@mweststrate](https://github.com/mweststrate))
  - [#5164](https://github.com/facebook/docusaurus/pull/5164) fix(v2): revert webpack.resolve.symlinks = false ([@slorber](https://github.com/slorber))
  - [#5126](https://github.com/facebook/docusaurus/pull/5126) fix(v2): remove webpackConfig.resolve.symlinks: true ([@slorber](https://github.com/slorber))
  - [#5110](https://github.com/facebook/docusaurus/pull/5110) fix(v2): Fix update-notifier not run at first and not notifying consistently ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-utils`
  - [#5199](https://github.com/facebook/docusaurus/pull/5199) fix(v2): Fix MDX docs being considered as partials when siteDir match the \_ prefix convention ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-pwa`
  - [#5185](https://github.com/facebook/docusaurus/pull/5185) fix(v2): add base URL to content attribute of head tags PWA ([@lex111](https://github.com/lex111))
  - [#5169](https://github.com/facebook/docusaurus/pull/5169) refactor(v2): automatically add base URL to PWA head tags ([@lex111](https://github.com/lex111))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-utils`, `docusaurus`
  - [#5173](https://github.com/facebook/docusaurus/pull/5173) feat(v2): generalize usage of \_ prefix convention to exclude content files/folders ([@slorber](https://github.com/slorber))
- `docusaurus-theme-common`
  - [#5159](https://github.com/facebook/docusaurus/pull/5159) fix(v2): Fix Collapsible hydration layout shift ([@slorber](https://github.com/slorber))
  - [#5146](https://github.com/facebook/docusaurus/pull/5146) fix(v2): improve work of useCollapsible hook with multiple clicks ([@lex111](https://github.com/lex111))
- `docusaurus-types`
  - [#5129](https://github.com/facebook/docusaurus/pull/5129) fix(v2): fix d.ts lint error ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5116](https://github.com/facebook/docusaurus/pull/5116) fix(v2): introduce useCollapsible to fix collapsible animation perf issues ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-client-redirects`
  - [#5102](https://github.com/facebook/docusaurus/pull/5102) fix(v2): fix redirect plugin when trailingSlash=false for .html extension ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#5228](https://github.com/facebook/docusaurus/pull/5228) refactor(v2): fix small typo in Russian translation ([@antonvasilev52](https://github.com/antonvasilev52))
  - [#5222](https://github.com/facebook/docusaurus/pull/5222) chore(v2): update Infima to alpha 28 ([@lex111](https://github.com/lex111))
  - [#5224](https://github.com/facebook/docusaurus/pull/5224) refactor(v2): update Russian translation ([@lex111](https://github.com/lex111))
  - [#5217](https://github.com/facebook/docusaurus/pull/5217) refactor(v2): improved Farsi default translations ([@massoudmaboudi](https://github.com/massoudmaboudi))
  - [#5171](https://github.com/facebook/docusaurus/pull/5171) refactor(v2): increase content area if blog sidebar is off ([@lex111](https://github.com/lex111))
  - [#5154](https://github.com/facebook/docusaurus/pull/5154) refactor(v2): Hindi translation for semantic doc sidebar ([@pranabdas](https://github.com/pranabdas))
  - [#5145](https://github.com/facebook/docusaurus/pull/5145) refactor(v2): use Collapsible for mobile nav items ([@lex111](https://github.com/lex111))
  - [#5138](https://github.com/facebook/docusaurus/pull/5138) refactor(v2): Update Hebrew translations ([@nirtamir2](https://github.com/nirtamir2))
  - [#5140](https://github.com/facebook/docusaurus/pull/5140) refactor(v2): bn translation improvements for semantic doc sidebar ([@pranabdas](https://github.com/pranabdas))
  - [#5139](https://github.com/facebook/docusaurus/pull/5139) feat(v2): complete Chinese code translations ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5118](https://github.com/facebook/docusaurus/pull/5118) refactor(v2): pt-BR translations improve semantic doc sidebar and tags ([@marssaljr](https://github.com/marssaljr))
- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#5215](https://github.com/facebook/docusaurus/pull/5215) refactor: make code block shadows consistent with new admonitions ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`
  - [#5193](https://github.com/facebook/docusaurus/pull/5193) refactor: redesign admonitions/callouts/quotes ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5168](https://github.com/facebook/docusaurus/pull/5168) refactor(v2): mobile dropdown navbar: expand when subitem become active ([@slorber](https://github.com/slorber))

#### :memo: Documentation

- [#5236](https://github.com/facebook/docusaurus/pull/5236) docs: add Verdaccio.org to showcase ([@semoal](https://github.com/semoal))
- [#5218](https://github.com/facebook/docusaurus/pull/5218) docs(v2): remove vector.dev from showcase ([@lex111](https://github.com/lex111))
- [#5212](https://github.com/facebook/docusaurus/pull/5212) docs: mention Link can be used for external links ([@slorber](https://github.com/slorber))
- [#5210](https://github.com/facebook/docusaurus/pull/5210) docs(v2): Elaboration of raw-loader in markdown react component ([@pranabdas](https://github.com/pranabdas))
- [#5191](https://github.com/facebook/docusaurus/pull/5191) docs: user should restart docusaurus after adding prism additionalLanguage ([@tohidnateghi](https://github.com/tohidnateghi))
- [#5175](https://github.com/facebook/docusaurus/pull/5175) docs: update API docs on navbar behavior ([@Josh-Cena](https://github.com/Josh-Cena))
- [#5189](https://github.com/facebook/docusaurus/pull/5189) docs(v2): Add orbitjs site to showcase page ([@dgeb](https://github.com/dgeb))
- [#5177](https://github.com/facebook/docusaurus/pull/5177) docs(v2): add easyjwt to users ([@dbrrt](https://github.com/dbrrt))
- [#5187](https://github.com/facebook/docusaurus/pull/5187) docs(v2): Add quickwit to user.js and png. ([@fmassot](https://github.com/fmassot))
- [#5184](https://github.com/facebook/docusaurus/pull/5184) docs(v2): Add react-complex-tree to users.js ([@lukasbach](https://github.com/lukasbach))
- [#5178](https://github.com/facebook/docusaurus/pull/5178) docs(v2): Update tutorial link ([@slorber](https://github.com/slorber))
- [#5158](https://github.com/facebook/docusaurus/pull/5158) docs(v2): Update deploy with Qovery docs for V2 ([@arnaudjnn](https://github.com/arnaudjnn))
- [#5152](https://github.com/facebook/docusaurus/pull/5152) docs(v2): Indent code example to improve readability ([@rluvaton](https://github.com/rluvaton))
- [#5133](https://github.com/facebook/docusaurus/pull/5133) docs(v2): GIF format is not suported ([@NazarStreletskyi](https://github.com/NazarStreletskyi))
- [#5117](https://github.com/facebook/docusaurus/pull/5117) docs(v2): Add Prismatic docs page to showcase. ([@taylorreece](https://github.com/taylorreece))
- [#5115](https://github.com/facebook/docusaurus/pull/5115) docs(v2): Add LiveKit to showcase ([@davidzhao](https://github.com/davidzhao))
- [#5114](https://github.com/facebook/docusaurus/pull/5114) docs(v2): add Blink Shell Documentation to Showcase ([@pcho](https://github.com/pcho))
- [#5112](https://github.com/facebook/docusaurus/pull/5112) docs(v2): clarify how to disable edit links entirely ([@lennartkoopmann](https://github.com/lennartkoopmann))
- [#5113](https://github.com/facebook/docusaurus/pull/5113) docs(v2): Add CryptoDevHub to Showcase ([@pmuens](https://github.com/pmuens))

#### :house: Internal

- `docusaurus-theme-classic`
  - [#5234](https://github.com/facebook/docusaurus/pull/5234) chore: Upgrade infima 29 ([@slorber](https://github.com/slorber))
  - [#5130](https://github.com/facebook/docusaurus/pull/5130) test(v2): dogfooding: add huge sidebar for testing purposes ([@slorber](https://github.com/slorber))
- Other
  - [#5223](https://github.com/facebook/docusaurus/pull/5223) chore: fix iframe background color in dark mode ([@lex111](https://github.com/lex111))
  - [#5206](https://github.com/facebook/docusaurus/pull/5206) misc: add script to keep starters branch/repos up-to-date ([@slorber](https://github.com/slorber))
  - [#5167](https://github.com/facebook/docusaurus/pull/5167) fix(v2): fix website PWA icon hrefs ([@slorber](https://github.com/slorber))
  - [#5166](https://github.com/facebook/docusaurus/pull/5166) fix(v2): fix yarn clear command ([@slorber](https://github.com/slorber))
  - [#5137](https://github.com/facebook/docusaurus/pull/5137) chore: upgrade crowdin ([@slorber](https://github.com/slorber))
  - [#5111](https://github.com/facebook/docusaurus/pull/5111) misc: monitor site global data with build size bot ([@slorber](https://github.com/slorber))

#### :running_woman: Performance

- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5136](https://github.com/facebook/docusaurus/pull/5136) perf(v2): lazy sidebar categories / collapsibles, reduce html output / build times ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#5130](https://github.com/facebook/docusaurus/pull/5130) test(v2): dogfooding: add huge sidebar for testing purposes ([@slorber](https://github.com/slorber))

#### Committers: 28

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Arijit Kundu ([@covalentbond](https://github.com/covalentbond))
- Arnaud Jeannin ([@arnaudjnn](https://github.com/arnaudjnn))
- Christian Flach ([@cmfcmf](https://github.com/cmfcmf))
- Clément Vannicatte ([@shortcuts](https://github.com/shortcuts))
- Dan Gebhardt ([@dgeb](https://github.com/dgeb))
- David Barrat ([@dbrrt](https://github.com/dbrrt))
- David Zhao ([@davidzhao](https://github.com/davidzhao))
- Forresst ([@forresst](https://github.com/forresst))
- François Massot ([@fmassot](https://github.com/fmassot))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Lennart Koopmann ([@lennartkoopmann](https://github.com/lennartkoopmann))
- Lukas Bach ([@lukasbach](https://github.com/lukasbach))
- Marçal Junior ([@marssaljr](https://github.com/marssaljr))
- Massoud Maboudi ([@massoudmaboudi](https://github.com/massoudmaboudi))
- Michel Weststrate ([@mweststrate](https://github.com/mweststrate))
- Nazar ([@NazarStreletskyi](https://github.com/NazarStreletskyi))
- Philipp Muens ([@pmuens](https://github.com/pmuens))
- Pranab Das ([@pranabdas](https://github.com/pranabdas))
- Przemysław Chojecki ([@pcho](https://github.com/pcho))
- Raz Luvaton ([@rluvaton](https://github.com/rluvaton))
- Sergio Moreno ([@semoal](https://github.com/semoal))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Taylor Reece ([@taylorreece](https://github.com/taylorreece))
- [@antonvasilev52](https://github.com/antonvasilev52)
- [@nirtamir2](https://github.com/nirtamir2)
- tohid nateghi ([@tohidnateghi](https://github.com/tohidnateghi))
- 陈杨文 ([@wenerme](https://github.com/wenerme))

## 2.0.0-beta.3 (2021-06-30)

#### :rocket: New Feature

- `docusaurus-theme-classic`
  - [#5092](https://github.com/facebook/docusaurus/pull/5092) feat(v2): add icon to external footer links ([@lex111](https://github.com/lex111))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#5080](https://github.com/facebook/docusaurus/pull/5080) fix(v2): classic theme - semantic correct anchors links ([@AuHau](https://github.com/AuHau))
  - [#5081](https://github.com/facebook/docusaurus/pull/5081) fix(v2): restore previous scroll position on back button click ([@lex111](https://github.com/lex111))
  - [#5063](https://github.com/facebook/docusaurus/pull/5063) fix(v2): restore responsive menu ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#5094](https://github.com/facebook/docusaurus/pull/5094) fix(v2): fix typos in swizzle command ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#5095](https://github.com/facebook/docusaurus/pull/5095) fix(v2): fix swizzle readComponent ([@slorber](https://github.com/slorber))
  - [#5059](https://github.com/facebook/docusaurus/pull/5059) fix(v2): fix webpack SSG plugin error thrown due to new URL() / \_\_filename ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`
  - [#5097](https://github.com/facebook/docusaurus/pull/5097) fix(v2): fix useEffect infinite loop in blogOnly mode ([@slorber](https://github.com/slorber))
  - [#5074](https://github.com/facebook/docusaurus/pull/5074) fix(v2): allow negative sidebar positions ([@kdrag0n](https://github.com/kdrag0n))
- `docusaurus-plugin-client-redirects`
  - [#5093](https://github.com/facebook/docusaurus/pull/5093) fix(v2): redirect from should work with trailingSlash: true ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-client-redirects`, `docusaurus-utils`
  - [#5085](https://github.com/facebook/docusaurus/pull/5085) fix(v2): redirect plugin should emit redirect files with lower precedence than redirect target ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-sitemap`, `docusaurus-types`, `docusaurus-utils-common`, `docusaurus`
  - [#5082](https://github.com/facebook/docusaurus/pull/5082) fix(v2): never remove trailing slash from site root like '/baseUrl/' ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-sitemap`
  - [#5068](https://github.com/facebook/docusaurus/pull/5068) fix(v2): sitemap should respect the global trailingSlash config option. ([@taylorreece](https://github.com/taylorreece))
- `docusaurus-types`
  - [#5058](https://github.com/facebook/docusaurus/pull/5058) fix(v2): fix bad @docusaurus/types Plugin type generics ([@jsamr](https://github.com/jsamr))

#### :memo: Documentation

- [#5064](https://github.com/facebook/docusaurus/pull/5064) docs(v2): Rewrite markdown images section ([@ramiy](https://github.com/ramiy))
- [#5086](https://github.com/facebook/docusaurus/pull/5086) docs(v2): Add SQL Frames to the showcase ([@dirslashls](https://github.com/dirslashls))
- [#5073](https://github.com/facebook/docusaurus/pull/5073) docs(v2): update installation docs ([@iamayushdas](https://github.com/iamayushdas))
- [#5061](https://github.com/facebook/docusaurus/pull/5061) docs(v2:) Divide `markdown-features/code-blocks` to smaller sections ([@ramiy](https://github.com/ramiy))
- [#5066](https://github.com/facebook/docusaurus/pull/5066) docs(v2): correct typo ([@bperlmutter](https://github.com/bperlmutter))

#### :house: Internal

- `docusaurus-types`
  - [#5067](https://github.com/facebook/docusaurus/pull/5067) chore: unstable yarn.lock ([@slorber](https://github.com/slorber))
- Other
  - [#5057](https://github.com/facebook/docusaurus/pull/5057) chore(v2): upgrade examples to beta.2 ([@slorber](https://github.com/slorber))

#### Committers: 11

- Adam Uhlíř ([@AuHau](https://github.com/AuHau))
- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Ayush das ([@iamayushdas](https://github.com/iamayushdas))
- Danny Lin ([@kdrag0n](https://github.com/kdrag0n))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Jules Sam. Randolph ([@jsamr](https://github.com/jsamr))
- Rami Yushuvaev ([@ramiy](https://github.com/ramiy))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Taylor Reece ([@taylorreece](https://github.com/taylorreece))
- [@bperlmutter](https://github.com/bperlmutter)
- [@dirslashls](https://github.com/dirslashls)

## 2.0.0-beta.2 (2021-06-24)

#### :rocket: New Feature

- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#5052](https://github.com/facebook/docusaurus/pull/5052) feat(v2): docs version banner configuration option ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-types`, `docusaurus`
  - [#5037](https://github.com/facebook/docusaurus/pull/5037) feat(v2): plugins injectHtmlTags + configureWebpack should receive content loaded ([@slorber](https://github.com/slorber))

#### :boom: Breaking Change

- `docusaurus-plugin-content-docs`
  - [#5053](https://github.com/facebook/docusaurus/pull/5053) refactor(v2): remove deprecated docs option excludeNextVersionDocs ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#5052](https://github.com/facebook/docusaurus/pull/5052) feat(v2): docs version banner configuration option ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-plugin-content-blog`, `docusaurus-types`, `docusaurus`
  - [#5054](https://github.com/facebook/docusaurus/pull/5054) fix(v2): allow undefined favicon ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`
  - [#5048](https://github.com/facebook/docusaurus/pull/5048) fix(v2): read last update from inner git repositories ([@felipecrs](https://github.com/felipecrs))
- `docusaurus-theme-classic`
  - [#5050](https://github.com/facebook/docusaurus/pull/5050) fix(v2): add shadow to skip link on focus only ([@lex111](https://github.com/lex111))
  - [#5035](https://github.com/facebook/docusaurus/pull/5035) fix(v2): fix some docs container/sidebar layout issues ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#5047](https://github.com/facebook/docusaurus/pull/5047) fix(v2): Fix Webpack persistent caching (evict on swizzle/alias/config change) ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5040](https://github.com/facebook/docusaurus/pull/5040) fix(v2): Fix announcementBar layout shifts ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#5034](https://github.com/facebook/docusaurus/pull/5034) fix(v2): dev css modules classnames should include filename ([@slorber](https://github.com/slorber))
  - [#5016](https://github.com/facebook/docusaurus/pull/5016) fix(v2): add missing quote in build command output ([@manuelmeurer](https://github.com/manuelmeurer))
- `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#5023](https://github.com/facebook/docusaurus/pull/5023) fix(v2): ignore hash changes in useChangeRoute hook ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-utils-validation`
  - [#5032](https://github.com/facebook/docusaurus/pull/5032) fix(v2): less strict blog/docs uri frontmatter validation ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-plugin-content-docs`
  - [#5053](https://github.com/facebook/docusaurus/pull/5053) refactor(v2): remove deprecated docs option excludeNextVersionDocs ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`, `docusaurus-plugin-ideal-image`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#4993](https://github.com/facebook/docusaurus/pull/4993) style(v2): reduce number of ESLint warnings ([@Josh-Cena](https://github.com/Josh-Cena))
- Other
  - [#5017](https://github.com/facebook/docusaurus/pull/5017) chore(v2): remove badge for v1 tests ([@loozhengyuan](https://github.com/loozhengyuan))

#### :memo: Documentation

- Other
  - [#5049](https://github.com/facebook/docusaurus/pull/5049) docs(v2): Fix Gatsby theme name for docs site - Docz ([@ramiy](https://github.com/ramiy))
  - [#5030](https://github.com/facebook/docusaurus/pull/5030) docs(v2): typo in deployment.mdx ([@eshantri](https://github.com/eshantri))
  - [#5022](https://github.com/facebook/docusaurus/pull/5022) docs(v2): Add React Native Render HTML site to showcase page ([@jsamr](https://github.com/jsamr))
  - [#5027](https://github.com/facebook/docusaurus/pull/5027) docs(v2): Add Buddy to deployment doc ([@tomekpapiernik](https://github.com/tomekpapiernik))
  - [#5021](https://github.com/facebook/docusaurus/pull/5021) docs(v2): fix incorrect anchor links in website ([@teikjun](https://github.com/teikjun))
  - [#5007](https://github.com/facebook/docusaurus/pull/5007) docs(v2): wrap mdx usage in mdx-code-block ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#5033](https://github.com/facebook/docusaurus/pull/5033) docs(v2): GH pages: recommend using trailingSlash ([@slorber](https://github.com/slorber))

#### :house: Internal

- [#5005](https://github.com/facebook/docusaurus/pull/5005) chore: add archived versions system + archive alpha.73-75 ([@slorber](https://github.com/slorber))

#### Committers: 11

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Eshan Tripathi ([@eshantri](https://github.com/eshantri))
- Felipe Santos ([@felipecrs](https://github.com/felipecrs))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Jules Sam. Randolph ([@jsamr](https://github.com/jsamr))
- Manuel Meurer ([@manuelmeurer](https://github.com/manuelmeurer))
- Rami Yushuvaev ([@ramiy](https://github.com/ramiy))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Teik Jun ([@teikjun](https://github.com/teikjun))
- Tomasz Papiernik ([@tomekpapiernik](https://github.com/tomekpapiernik))
- ZhengYuan Loo ([@loozhengyuan](https://github.com/loozhengyuan))

## 2.0.0-beta.1 (2021-06-18)

#### :rocket: New Feature

- `docusaurus-plugin-content-docs`
  - [#4982](https://github.com/facebook/docusaurus/pull/4982) feat(v2): add docs pagination_label frontmatter ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#4949](https://github.com/facebook/docusaurus/pull/4949) feat(v2): add icon to external navbar links ([@lex111](https://github.com/lex111))
  - [#4939](https://github.com/facebook/docusaurus/pull/4939) feat(v2): theme default translations Bengali ([@Neilblaze](https://github.com/Neilblaze))
  - [#4811](https://github.com/facebook/docusaurus/pull/4811) feat(v2): Add hebrew translations ([@slorber](https://github.com/slorber))
  - [#4798](https://github.com/facebook/docusaurus/pull/4798) feat(v2): add theme Danish translation ([@PsychTechApS](https://github.com/PsychTechApS))
- `docusaurus-init`
  - [#4968](https://github.com/facebook/docusaurus/pull/4968) feat(v2): add code block theming in init template ([@Josh-Cena](https://github.com/Josh-Cena))
- `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus`
  - [#4908](https://github.com/facebook/docusaurus/pull/4908) feat(v2): add trailingSlash config option ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`
  - [#4796](https://github.com/facebook/docusaurus/pull/4796) feat(v2): exhaustive docs frontmatter schema ([@nam-hle](https://github.com/nam-hle))
- `docusaurus-types`, `docusaurus`
  - [#4618](https://github.com/facebook/docusaurus/pull/4618) feat(v2): allow config plugins as functions or [function,options] ([@besemuna](https://github.com/besemuna))
- `docusaurus-plugin-content-blog`, `docusaurus-utils-validation`
  - [#4759](https://github.com/facebook/docusaurus/pull/4759) feat(v2): exhaustive BlogPostFrontMatter schema validation ([@nam-hle](https://github.com/nam-hle))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#5001](https://github.com/facebook/docusaurus/pull/5001) chore(v2): update Infima to alpha 26 ([@lex111](https://github.com/lex111))
  - [#4986](https://github.com/facebook/docusaurus/pull/4986) fix(v2): fix UX for docsVersionDropdown on mobile for single version ([@slorber](https://github.com/slorber))
  - [#4980](https://github.com/facebook/docusaurus/pull/4980) fix(v2): make proper data type for prependBaseUrlToHref field ([@lex111](https://github.com/lex111))
  - [#4943](https://github.com/facebook/docusaurus/pull/4943) fix(v2): improve accessibility of code blocks ([@lex111](https://github.com/lex111))
  - [#4917](https://github.com/facebook/docusaurus/pull/4917) fix(v2): tidy up Markdown page layout ([@lex111](https://github.com/lex111))
  - [#4906](https://github.com/facebook/docusaurus/pull/4906) fix(v2): fix minor a11y issues ([@lex111](https://github.com/lex111))
  - [#4900](https://github.com/facebook/docusaurus/pull/4900) fix(v2): adjust margin after content title ([@lex111](https://github.com/lex111))
  - [#4855](https://github.com/facebook/docusaurus/pull/4855) chore(v2): update infima to alpha 24 ([@lex111](https://github.com/lex111))
  - [#4819](https://github.com/facebook/docusaurus/pull/4819) fix(v2): Amend Hebrew translations ([@liorheber](https://github.com/liorheber))
  - [#4815](https://github.com/facebook/docusaurus/pull/4815) fix(v2): Fix Hebrew translations ([@nirtamir2](https://github.com/nirtamir2))
  - [#4792](https://github.com/facebook/docusaurus/pull/4792) fix(v2): fix minor a11y issue with headings ([@lex111](https://github.com/lex111))
  - [#4793](https://github.com/facebook/docusaurus/pull/4793) fix(v2): unbreak enhanced width of doc item wrapper ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-utils-common`
  - [#5000](https://github.com/facebook/docusaurus/pull/5000) fix(v2): fix theme array deduplication bug ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-client-redirects`, `docusaurus-utils-common`, `docusaurus-utils`, `docusaurus`
  - [#4988](https://github.com/facebook/docusaurus/pull/4988) fix(v2): redirect plugin should use siteConfig.trailingSlash ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`
  - [#4983](https://github.com/facebook/docusaurus/pull/4983) fix(v2): always use UTC when dealing with blog dates ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#4962](https://github.com/facebook/docusaurus/pull/4962) fix(v2): respect base url in RSS feeds ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#4985](https://github.com/facebook/docusaurus/pull/4985) fix(v2): navbar doc item fallback: search doc in lastVersion ([@slorber](https://github.com/slorber))
- `docusaurus-remark-plugin-npm2yarn`
  - [#4964](https://github.com/facebook/docusaurus/pull/4964) fix(v2): avoid duplicated imports in npm2yarn plugin ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`
  - [#4970](https://github.com/facebook/docusaurus/pull/4970) fix(v2): sidebar_label should be used to compute next/previous button labels ([@slorber](https://github.com/slorber))
  - [#4861](https://github.com/facebook/docusaurus/pull/4861) fix(v2): allow relative sidebar path resolution in docs:version command ([@lex111](https://github.com/lex111))
  - [#4859](https://github.com/facebook/docusaurus/pull/4859) fix(v2): use frontmatter title at first for paginated links ([@lex111](https://github.com/lex111))
  - [#4775](https://github.com/facebook/docusaurus/pull/4775) fix(v2): improve dx sidebar config, ability to have no sidebars file ([@nam-hle](https://github.com/nam-hle))
- `docusaurus-plugin-sitemap`, `docusaurus-utils-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#4950](https://github.com/facebook/docusaurus/pull/4950) fix(v2): sitemap plugin should handle siteConfig.trailingSlash automatically ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#4924](https://github.com/facebook/docusaurus/pull/4924) fix(v2): respect baseUrl in serving command ([@lex111](https://github.com/lex111))
  - [#4935](https://github.com/facebook/docusaurus/pull/4935) fix(v2): render children in BrowserOnly after client is ready ([@lex111](https://github.com/lex111))
  - [#4894](https://github.com/facebook/docusaurus/pull/4894) fix(v2): escape HTML entities in user tags attributes ([@lex111](https://github.com/lex111))
  - [#4789](https://github.com/facebook/docusaurus/pull/4789) fix(v2): transpile libs with too recent syntax with babel ([@slorber](https://github.com/slorber))
  - [#4784](https://github.com/facebook/docusaurus/pull/4784) fix(v2): update notifier should never suggest to downgrade ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-utils`
  - [#4882](https://github.com/facebook/docusaurus/pull/4882) fix(v2): fix contentTitle issues when markdown h1 title contains code blocks ([@slorber](https://github.com/slorber))
- `docusaurus-utils`
  - [#4862](https://github.com/facebook/docusaurus/pull/4862) fix(v2): remove Markdown heading id from excerpt ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#4871](https://github.com/facebook/docusaurus/pull/4871) fix(v2): unbreak adding of custom HTML metadatas ([@lex111](https://github.com/lex111))
  - [#4797](https://github.com/facebook/docusaurus/pull/4797) fix(v2): do not focus on skip link if page refreshed ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`
  - [#4856](https://github.com/facebook/docusaurus/pull/4856) fix(v2): adjust padding when custom search box location ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`
  - [#4830](https://github.com/facebook/docusaurus/pull/4830) fix(v2): pin prism-react-renderer version to 1.1.1 ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-ideal-image`, `lqip-loader`
  - [#4806](https://github.com/facebook/docusaurus/pull/4806) chore(v2): update sharp to 0.28.2 ([@lex111](https://github.com/lex111))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#4995](https://github.com/facebook/docusaurus/pull/4995) refactor(v2): reduce top padding in doc content container ([@lex111](https://github.com/lex111))
  - [#4918](https://github.com/facebook/docusaurus/pull/4918) refactor(v2): readjust footer of blog item ([@lex111](https://github.com/lex111))
  - [#4959](https://github.com/facebook/docusaurus/pull/4959) refactor(v2): minor cleanups ([@lex111](https://github.com/lex111))
  - [#4945](https://github.com/facebook/docusaurus/pull/4945) refactor(v2): remove extra padding from doc item container ([@lex111](https://github.com/lex111))
  - [#4940](https://github.com/facebook/docusaurus/pull/4940) refactor(v2): improve semantic doc sidebar markup ([@lex111](https://github.com/lex111))
  - [#4961](https://github.com/facebook/docusaurus/pull/4961) refactor(v2): improve semantic blog sidebar markup ([@lex111](https://github.com/lex111))
  - [#4903](https://github.com/facebook/docusaurus/pull/4903) refactor(v2): make doc item layout more semantic ([@lex111](https://github.com/lex111))
  - [#4877](https://github.com/facebook/docusaurus/pull/4877) refactor(v2): reduce vertical space in doc content container ([@lex111](https://github.com/lex111))
  - [#4914](https://github.com/facebook/docusaurus/pull/4914) refactor(v2): use SVG for external link icon ([@lex111](https://github.com/lex111))
  - [#4916](https://github.com/facebook/docusaurus/pull/4916) refactor(v2): replace strong with b in UI components ([@lex111](https://github.com/lex111))
  - [#4926](https://github.com/facebook/docusaurus/pull/4926) refactor(v2): hide decorative SVGs from screen readers ([@lex111](https://github.com/lex111))
  - [#4865](https://github.com/facebook/docusaurus/pull/4865) refactor(v2): make little better doc update block UI ([@lex111](https://github.com/lex111))
  - [#4795](https://github.com/facebook/docusaurus/pull/4795) refactor(v2): remove transition on body element ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`
  - [#4989](https://github.com/facebook/docusaurus/pull/4989) refactor(v2): blog/docs: add more context in error messages ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#4979](https://github.com/facebook/docusaurus/pull/4979) refactor(v2): cleanup console output ([@lex111](https://github.com/lex111))
- `docusaurus-utils-validation`, `docusaurus`
  - [#4977](https://github.com/facebook/docusaurus/pull/4977) polish(v2): url-subpath config validation warning ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`
  - [#4969](https://github.com/facebook/docusaurus/pull/4969) refactor(v2): include path in error about non-existent ids ([@lex111](https://github.com/lex111))
  - [#4863](https://github.com/facebook/docusaurus/pull/4863) refactor(v2): remove sidebar_label filed from doc metadata file ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus`
  - [#4907](https://github.com/facebook/docusaurus/pull/4907) refactor(v2): remove type attribute from link and script tags ([@lex111](https://github.com/lex111))
- `docusaurus-theme-search-algolia`
  - [#4919](https://github.com/facebook/docusaurus/pull/4919) refactor(v2): improve markup and styling on search page ([@lex111](https://github.com/lex111))
  - [#4867](https://github.com/facebook/docusaurus/pull/4867) chore(v2): update @docsearch/react ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-blog`
  - [#4905](https://github.com/facebook/docusaurus/pull/4905) refactor(v2): do not generate RSS files for empty feed ([@lex111](https://github.com/lex111))
  - [#4860](https://github.com/facebook/docusaurus/pull/4860) refactor(v2): use aliased path for blog list sidebar file ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#4870](https://github.com/facebook/docusaurus/pull/4870) refactor(v2): add exception handling if external command is fails ([@lex111](https://github.com/lex111))
  - [#4875](https://github.com/facebook/docusaurus/pull/4875) refactor(v2): make even better SSR error notify and add tip ([@lex111](https://github.com/lex111))
  - [#4866](https://github.com/facebook/docusaurus/pull/4866) refactor(v2): output URL to console only if it has changed ([@lex111](https://github.com/lex111))
- `docusaurus-utils`
  - [#4814](https://github.com/facebook/docusaurus/pull/4814) refactor(v2): purify normalizeUrl ([@nam-hle](https://github.com/nam-hle))

#### :memo: Documentation

- Other
  - [#4987](https://github.com/facebook/docusaurus/pull/4987) docs(v2): document canary releases ([@slorber](https://github.com/slorber))
  - [#4981](https://github.com/facebook/docusaurus/pull/4981) docs(v2): minor tweaks ([@lex111](https://github.com/lex111))
  - [#4976](https://github.com/facebook/docusaurus/pull/4976) docs(v2): mention to install the algolia package in search doc ([@slorber](https://github.com/slorber))
  - [#4953](https://github.com/facebook/docusaurus/pull/4953) docs(v2): add Flagsmith to showcase ([@dabeeeenster](https://github.com/dabeeeenster))
  - [#4942](https://github.com/facebook/docusaurus/pull/4942) docs(v2): add info about `DefaultValue` prop in `Tabs` ([@ArtFlag](https://github.com/ArtFlag))
  - [#4898](https://github.com/facebook/docusaurus/pull/4898) docs(v2): add ClarityChallenge to showcase ([@jonbarker68](https://github.com/jonbarker68))
  - [#4896](https://github.com/facebook/docusaurus/pull/4896) docs(v2): fix incorrect link to plugin-ideal-image ([@phwt](https://github.com/phwt))
  - [#4893](https://github.com/facebook/docusaurus/pull/4893) docs(v2): presets: fix typo in bootstrap preset ([@silva-nick](https://github.com/silva-nick))
  - [#4887](https://github.com/facebook/docusaurus/pull/4887) docs(v2): Add Aide Jeune website to Docusaurus site showcase ([@l0u1sg](https://github.com/l0u1sg))
  - [#4821](https://github.com/facebook/docusaurus/pull/4821) docs(v2): New doc page for math equations ([@pranabdas](https://github.com/pranabdas))
  - [#4885](https://github.com/facebook/docusaurus/pull/4885) docs(v2): v2 migration guide: mention Algolia config update ([@slorber](https://github.com/slorber))
  - [#4876](https://github.com/facebook/docusaurus/pull/4876) docs(v2): update steps in the github-actions section ([@wise-introvert](https://github.com/wise-introvert))
  - [#4880](https://github.com/facebook/docusaurus/pull/4880) docs(v2): grammar typo in migration-overview.md ([@jmazin](https://github.com/jmazin))
  - [#4879](https://github.com/facebook/docusaurus/pull/4879) docs(v2): Added FireCMS to the showcase ([@fgatti675](https://github.com/fgatti675))
  - [#4849](https://github.com/facebook/docusaurus/pull/4849) docs(v2): fix Java syntax highlight in website ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#4818](https://github.com/facebook/docusaurus/pull/4818) docs(v2): add mr-pdf to resources ([@antonygibbs](https://github.com/antonygibbs))
  - [#4835](https://github.com/facebook/docusaurus/pull/4835) docs(v2): fix grammar typo on Creating pages ([@Christopher-Hsieh](https://github.com/Christopher-Hsieh))
  - [#4837](https://github.com/facebook/docusaurus/pull/4837) docs(v2): fix missing closing bracket ([@pmqueiroz](https://github.com/pmqueiroz))
  - [#4820](https://github.com/facebook/docusaurus/pull/4820) docs(v2): Fix typo in doc: sidebar.md ([@pranabdas](https://github.com/pranabdas))
  - [#4813](https://github.com/facebook/docusaurus/pull/4813) docs(v2): fix css snipped with missing color ([@slorber](https://github.com/slorber))
  - [#4803](https://github.com/facebook/docusaurus/pull/4803) docs(v2): Add i18n tag and fix typo ([@HunteRoi](https://github.com/HunteRoi))
  - [#4786](https://github.com/facebook/docusaurus/pull/4786) docs(v2): Add tinaeldevresse.eu to Docusaurus' gallery ([@HunteRoi](https://github.com/HunteRoi))
  - [#4780](https://github.com/facebook/docusaurus/pull/4780) docs(v2): remove docs for alpha 71 + 72 ([@slorber](https://github.com/slorber))
  - [#4779](https://github.com/facebook/docusaurus/pull/4779) docs(v2): beta blog post edits ([@slorber](https://github.com/slorber))
- `docusaurus-init`
  - [#4973](https://github.com/facebook/docusaurus/pull/4973) docs(v2): replace `diff` codeblocks with line highlight ([@Josh-Cena](https://github.com/Josh-Cena))
  - [#4756](https://github.com/facebook/docusaurus/pull/4756) docs(v2): Docusaurus 2 beta blog post ([@slorber](https://github.com/slorber))

#### :house: Internal

- Other
  - [#4994](https://github.com/facebook/docusaurus/pull/4994) misc: more issue template improvements ([@slorber](https://github.com/slorber))
  - [#4951](https://github.com/facebook/docusaurus/pull/4951) misc: disable google-gtag plugin in Netlify deploys ([@lex111](https://github.com/lex111))
  - [#4901](https://github.com/facebook/docusaurus/pull/4901) misc: optimize showcase images ([@lex111](https://github.com/lex111))
  - [#4897](https://github.com/facebook/docusaurus/pull/4897) chore: fail CI if yarn.lock is modified on install ([@slorber](https://github.com/slorber))
  - [#4858](https://github.com/facebook/docusaurus/pull/4858) chore(v2): add external link to community sidebar ([@lex111](https://github.com/lex111))
  - [#4889](https://github.com/facebook/docusaurus/pull/4889) misc: issue template config typo ([@slorber](https://github.com/slorber))
  - [#4886](https://github.com/facebook/docusaurus/pull/4886) misc: add github issue template config ([@slorber](https://github.com/slorber))
  - [#4878](https://github.com/facebook/docusaurus/pull/4878) misc: improve bug report issue template ([@lex111](https://github.com/lex111))
  - [#4791](https://github.com/facebook/docusaurus/pull/4791) chore: fix canary version name ([@slorber](https://github.com/slorber))
  - [#4777](https://github.com/facebook/docusaurus/pull/4777) chore: regenerate examples on 2.0.0-beta.0 ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus-migrate`, `docusaurus`
  - [#4944](https://github.com/facebook/docusaurus/pull/4944) chore: lockfile cleanup ([@slorber](https://github.com/slorber))
- `docusaurus-1.x`, `docusaurus-init-1.x`
  - [#4902](https://github.com/facebook/docusaurus/pull/4902) chore: remove docusaurus v1 from master branch (moved to docusaurus-v1 branch) ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-ideal-image`
  - [#4915](https://github.com/facebook/docusaurus/pull/4915) chore(v2): bump react-waypoint from 9.0.2 to 10.1.0 ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`
  - [#4834](https://github.com/facebook/docusaurus/pull/4834) chore(v2): unlock prism-react-renderer version ([@lex111](https://github.com/lex111))
- `docusaurus-cssnano-preset`, `docusaurus`
  - [#4833](https://github.com/facebook/docusaurus/pull/4833) chore(v2): bump cssnano packages ([@lex111](https://github.com/lex111))
- `docusaurus-cssnano-preset`, `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-debug`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#4816](https://github.com/facebook/docusaurus/pull/4816) chore(v2): upgrade dependencies ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#4790](https://github.com/facebook/docusaurus/pull/4790) chore(v2): TypeScript, use isolatedModules ([@slorber](https://github.com/slorber))

#### Committers: 31

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Arthur ([@ArtFlag](https://github.com/ArtFlag))
- Ben Rometsch ([@dabeeeenster](https://github.com/dabeeeenster))
- Christopher Hsieh ([@Christopher-Hsieh](https://github.com/Christopher-Hsieh))
- Fardeen Panjwani ([@wise-introvert](https://github.com/wise-introvert))
- Joel ([@Joelpo](https://github.com/Joelpo))
- Jon Barker ([@jonbarker68](https://github.com/jonbarker68))
- Jonathan Mazin ([@jmazin](https://github.com/jmazin))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Lior Heber ([@liorheber](https://github.com/liorheber))
- Louis Gallet ([@l0u1sg](https://github.com/l0u1sg))
- Louis Grenard ([@louistiti](https://github.com/louistiti))
- Lucas Correia ([@tsirlucas](https://github.com/tsirlucas))
- Nam Hoang Le ([@nam-hle](https://github.com/nam-hle))
- Pablo Vidal ([@limkinZero](https://github.com/limkinZero))
- Pedro Queiroz ([@pmqueiroz](https://github.com/pmqueiroz))
- Pranab Das ([@pranabdas](https://github.com/pranabdas))
- Pratyay Banerjee ([@Neilblaze](https://github.com/Neilblaze))
- PsychTech ([@PsychTechApS](https://github.com/PsychTechApS))
- Sam Zhou ([@SamChou19815](https://github.com/SamChou19815))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tinaël Devresse ([@HunteRoi](https://github.com/HunteRoi))
- [@Massibian](https://github.com/Massibian)
- [@antonygibbs](https://github.com/antonygibbs)
- [@besemuna](https://github.com/besemuna)
- [@e271828-](https://github.com/e271828-)
- [@fgatti675](https://github.com/fgatti675)
- [@nirtamir2](https://github.com/nirtamir2)
- [@silva-nick](https://github.com/silva-nick)
- mg ([@tiny-dancer](https://github.com/tiny-dancer))
- phwt.smwt ([@phwt](https://github.com/phwt))

## 2.0.0-beta.0 (2021-05-12)

Read the [2.0.0 beta blog post](https://docusaurus.io/blog/2021/05/12/announcing-docusaurus-two-beta)!

**Note**: this first beta release does not contain any new major feature. We are removing the alpha label, as we are confident Docusaurus 2 is stable enough.

#### :rocket: New Feature

- `docusaurus-theme-classic`
  - [#4762](https://github.com/facebook/docusaurus/pull/4762) feat(v2): add es translations for docusaurus-theme-classic ([@rodmoreno](https://github.com/rodmoreno))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#4750](https://github.com/facebook/docusaurus/pull/4750) fix(v2): improve french translation for theme-classic ([@forresst](https://github.com/forresst))
- `docusaurus-mdx-loader`, `docusaurus-utils`
  - [#4736](https://github.com/facebook/docusaurus/pull/4736) fix(v2): fix encoding of markdown image/file inline file-loaders ([@slorber](https://github.com/slorber))
- `docusaurus-utils`
  - [#4735](https://github.com/facebook/docusaurus/pull/4735) fix(v2): markdown title parser should ignore all forms of MDX import statements ([@nam-hle](https://github.com/nam-hle))
  - [#4729](https://github.com/facebook/docusaurus/pull/4729) fix(v2): optimize markdown parser regex (Closes [#4726](https://github.com/facebook/docusaurus/issues/4726)) ([@nam-hle](https://github.com/nam-hle))

#### :memo: Documentation

- [#4770](https://github.com/facebook/docusaurus/pull/4770) docs(v2): Improve intro doc ([@slorber](https://github.com/slorber))
- [#4773](https://github.com/facebook/docusaurus/pull/4773) docs(v2): fix i18n doc: bad i18n page plugin path in code sample ([@KostyaTretyak](https://github.com/KostyaTretyak))
- [#4758](https://github.com/facebook/docusaurus/pull/4758) docs(v2): add browsers support documentation ([@Josh-Cena](https://github.com/Josh-Cena))
- [#4757](https://github.com/facebook/docusaurus/pull/4757) docs(v2): Add Netdata to showcase ([@joelhans](https://github.com/joelhans))
- [#4754](https://github.com/facebook/docusaurus/pull/4754) docs(v2): fix Jest showcase screenshot ([@slorber](https://github.com/slorber))
- [#4747](https://github.com/facebook/docusaurus/pull/4747) docs(v2): Update showcase page ([@slorber](https://github.com/slorber))
- [#4734](https://github.com/facebook/docusaurus/pull/4734) docs(v2): Added MediaMachine.io to showcase ([@gianu](https://github.com/gianu))
- [#4731](https://github.com/facebook/docusaurus/pull/4731) docs(v2): add CodeYourFuture to showcase ([@ChrisOwen101](https://github.com/ChrisOwen101))
- [#4703](https://github.com/facebook/docusaurus/pull/4703) docs(v2): specify google-analytics and gtag plugins ([@yiliansource](https://github.com/yiliansource))
- [#4727](https://github.com/facebook/docusaurus/pull/4727) docs(v2): fix doc lint ([@slorber](https://github.com/slorber))
- [#4725](https://github.com/facebook/docusaurus/pull/4725) docs(v2): emphasize subset of markdown supported languages ([@Josh-Cena](https://github.com/Josh-Cena))
- [#4711](https://github.com/facebook/docusaurus/pull/4711) docs(v2): showcase personal site evantay ([@DigiPie](https://github.com/DigiPie))

#### :house: Internal

- [#4746](https://github.com/facebook/docusaurus/pull/4746) chore(v2): attempt to fix crowdin dl again ([@slorber](https://github.com/slorber))
- [#4743](https://github.com/facebook/docusaurus/pull/4743) chore(v2): fix prod deployment due to bad image path ([@slorber](https://github.com/slorber))
- [#4740](https://github.com/facebook/docusaurus/pull/4740) chore(v2): delay i18n-staging deployment to avoid Crowdin 409 errors ([@slorber](https://github.com/slorber))
- [#4739](https://github.com/facebook/docusaurus/pull/4739) chore(v2): Fix Crowdin 409 issues in CI ([@slorber](https://github.com/slorber))

#### Committers: 11

- Chris Owen ([@ChrisOwen101](https://github.com/ChrisOwen101))
- Evan ([@DigiPie](https://github.com/DigiPie))
- Forresst ([@forresst](https://github.com/forresst))
- Ian Hornik ([@yiliansource](https://github.com/yiliansource))
- Joel Hans ([@joelhans](https://github.com/joelhans))
- Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena))
- Nam Hoang Le ([@nam-hle](https://github.com/nam-hle))
- Rodrigo Moreno ([@rodmoreno](https://github.com/rodmoreno))
- Sergio Rafael Gianazza ([@gianu](https://github.com/gianu))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Костя Третяк ([@KostyaTretyak](https://github.com/KostyaTretyak))

## 2.0.0-alpha.75 (2021-04-30)

#### :boom: Breaking Change

- `docusaurus-cssnano-preset`, `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-types`, `docusaurus`, `lqip-loader`
  - [#4089](https://github.com/facebook/docusaurus/pull/4089) feat(v2): Webpack 5, PostCSS 8 ([@RDIL](https://github.com/RDIL))

#### :memo: Documentation

- [#4704](https://github.com/facebook/docusaurus/pull/4704) docs(v2): showcase meli ([@gempain](https://github.com/gempain))
- [#4699](https://github.com/facebook/docusaurus/pull/4699) docs(v2): Add Kosko to showcase ([@tommy351](https://github.com/tommy351))

#### Committers: 4

- Geoffroy Empain ([@gempain](https://github.com/gempain))
- Reece Dunham ([@RDIL](https://github.com/RDIL))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tommy Chen ([@tommy351](https://github.com/tommy351))

## 2.0.0-alpha.74 (2021-04-27)

#### :rocket: New Feature

- Other
  - [#4515](https://github.com/facebook/docusaurus/pull/4515) feat(v2): add tag filters to showcase page ([@lisa761](https://github.com/lisa761))
- `docusaurus-plugin-content-docs`
  - [#4658](https://github.com/facebook/docusaurus/pull/4658) feat(v2): allow user to customize/enhance the default sidebar items generator ([@slorber](https://github.com/slorber))
  - [#4655](https://github.com/facebook/docusaurus/pull/4655) feat(v2): docs, make numberPrefixParser configurable, better defaults, minor breaking-changes ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus-utils`, `docusaurus`
  - [#4688](https://github.com/facebook/docusaurus/pull/4688) fix(v2): fix title logic (meta vs heading) + ignore fixed anchor id syntax ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#4689](https://github.com/facebook/docusaurus/pull/4689) chore(v2): update infima to alpha 23 ([@slorber](https://github.com/slorber))
  - [#4667](https://github.com/facebook/docusaurus/pull/4667) fix(v2): Unbreak blog post title by handling title fallback in `LayoutHead` ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-plugin-content-docs`
  - [#4687](https://github.com/facebook/docusaurus/pull/4687) fix(v2): accept empty/null custom_edit_url docs frontmatter for retrocompat ([@slorber](https://github.com/slorber))
  - [#4651](https://github.com/facebook/docusaurus/pull/4651) fix(v2): sidebar autogen from subfolder should read category metadata correctly ([@slorber](https://github.com/slorber))
  - [#4629](https://github.com/facebook/docusaurus/pull/4629) fix(v2): fix validation rejecting admonitions false ([@kazk](https://github.com/kazk))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-utils-validation`
  - [#4654](https://github.com/facebook/docusaurus/pull/4654) fix(v2): fix too strict markdown frontmatter validation ([@johnnyreilly](https://github.com/johnnyreilly))
- `docusaurus-utils`
  - [#4646](https://github.com/facebook/docusaurus/pull/4646) fix(v2): ignore imports when h1 heading parsing ([@lex111](https://github.com/lex111))
  - [#4641](https://github.com/facebook/docusaurus/pull/4641) fix(v2): parse headings directly after h1 properly ([@lex111](https://github.com/lex111))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#4682](https://github.com/facebook/docusaurus/pull/4682) refactor(v2): align external icon on right ([@lex111](https://github.com/lex111))

#### :memo: Documentation

- [#4496](https://github.com/facebook/docusaurus/pull/4496) docs(v2): Add Qovery to deployment doc ([@arnaudjnn](https://github.com/arnaudjnn))
- [#4680](https://github.com/facebook/docusaurus/pull/4680) docs(v2): Fix urls in deployment.md ([@luism3861](https://github.com/luism3861))
- [#4668](https://github.com/facebook/docusaurus/pull/4668) docs(v2): Add Hostman to deployment doc ([@alena-ko](https://github.com/alena-ko))
- [#4676](https://github.com/facebook/docusaurus/pull/4676) docs(v2): Add Daily Digest - COVID-19 IN FRANCE to showcase ([@MisterFISHUP](https://github.com/MisterFISHUP))
- [#4643](https://github.com/facebook/docusaurus/pull/4643) docs(v2): Fix typo in installation.md ([@react-learner](https://github.com/react-learner))
- [#4649](https://github.com/facebook/docusaurus/pull/4649) docs(v2): Add new showcase user ([@JeremyDolle](https://github.com/JeremyDolle))

#### :house: Internal

- Other
  - [#4670](https://github.com/facebook/docusaurus/pull/4670) chore: add some redirects to v1.docusaurus.io ([@slorber](https://github.com/slorber))
- `docusaurus-init`
  - [#4631](https://github.com/facebook/docusaurus/pull/4631) chore(v2): update examples to use alpha73 ([@slorber](https://github.com/slorber))

#### Committers: 12

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Arnaud Jeannin ([@arnaudjnn](https://github.com/arnaudjnn))
- DOLLE ([@JeremyDolle](https://github.com/JeremyDolle))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Lisa Chandra ([@lisa761](https://github.com/lisa761))
- Luis Medina Huerta ([@luism3861](https://github.com/luism3861))
- Sam Zhou ([@SamChou19815](https://github.com/SamChou19815))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tommy ([@react-learner](https://github.com/react-learner))
- [@MisterFISHUP](https://github.com/MisterFISHUP)
- [@alena-ko](https://github.com/alena-ko)
- kazk ([@kazk](https://github.com/kazk))

## 2.0.0-alpha.73 (2021-04-16)

#### :rocket: New Feature

- `docusaurus-theme-classic`
  - [#4624](https://github.com/facebook/docusaurus/pull/4624) feat(v2): Add Filipino default translations to theme ([@gumacahin](https://github.com/gumacahin))
  - [#4596](https://github.com/facebook/docusaurus/pull/4596) feat(v2): theme default translations hindi ([@lisa761](https://github.com/lisa761))
  - [#4536](https://github.com/facebook/docusaurus/pull/4536) feat(v2): add pt-PT translations for docusaurus-theme-classic ([@tiago-rr](https://github.com/tiago-rr))
  - [#4525](https://github.com/facebook/docusaurus/pull/4525) feat(v2): add Brazilian Portuguese translation for docusaurus-theme-classic ([@thiagog3](https://github.com/thiagog3))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#4511](https://github.com/facebook/docusaurus/pull/4511) feat(v2): add unique page/wrapper className to each theme pages ([@ShinteiMai](https://github.com/ShinteiMai))
- `docusaurus-init`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#4582](https://github.com/facebook/docusaurus/pull/4582) feat(v2): auto-generated sidebars, frontmatter-less sites ([@slorber](https://github.com/slorber))
- `docusaurus-types`, `docusaurus`
  - [#4545](https://github.com/facebook/docusaurus/pull/4545) feat(v2): docusaurus deploy: ability to configure port in git url ([@talesporto](https://github.com/talesporto))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-utils`
  - [#4590](https://github.com/facebook/docusaurus/pull/4590) feat(v2): various markdown string parsing improvements/fixes ([@slorber](https://github.com/slorber))
  - [#4485](https://github.com/facebook/docusaurus/pull/4485) feat(v2): frontmatter-less: read first heading as title and use it in front-matter ([@armano2](https://github.com/armano2))
- `docusaurus-utils`
  - [#4581](https://github.com/facebook/docusaurus/pull/4581) feat(v2): default theme translations: locale "pt" should load "pt-BR" translations ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-docs`
  - [#4495](https://github.com/facebook/docusaurus/pull/4495) feat(v2): include frontmatter in loadedContent doc metadatas ([@kaytwo](https://github.com/kaytwo))
  - [#4500](https://github.com/facebook/docusaurus/pull/4500) feat(v2): provide doc sidebar_label through sidebars.js ([@besemuna](https://github.com/besemuna))
- `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus`
  - [#4449](https://github.com/facebook/docusaurus/pull/4449) feat(v2): infer default i18n locale config from locale code ([@slorber](https://github.com/slorber))

#### :boom: Breaking Change

- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#4619](https://github.com/facebook/docusaurus/pull/4619) refactor(v2): rename class main-docs-wrapper to docs-wrapper ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#4582](https://github.com/facebook/docusaurus/pull/4582) feat(v2): auto-generated sidebars, frontmatter-less sites ([@slorber](https://github.com/slorber))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#4627](https://github.com/facebook/docusaurus/pull/4627) chore(v2): update Infima to alpha.22 ([@slorber](https://github.com/slorber))
  - [#4621](https://github.com/facebook/docusaurus/pull/4621) fix(v2): center align content if no sidebar exists ([@lex111](https://github.com/lex111))
  - [#4620](https://github.com/facebook/docusaurus/pull/4620) fix(v2): restore toggle responsive sidebar button ([@lex111](https://github.com/lex111))
  - [#4598](https://github.com/facebook/docusaurus/pull/4598) fix(v2): render escaped HTML entities inside code properly ([@lex111](https://github.com/lex111))
  - [#4554](https://github.com/facebook/docusaurus/pull/4554) fix: DocNavbarItem error message ([@serut](https://github.com/serut))
  - [#4468](https://github.com/facebook/docusaurus/pull/4468) fix(v2): select correct tab when items are incorrectly ordered ([@armano2](https://github.com/armano2))
  - [#4461](https://github.com/facebook/docusaurus/pull/4461) fix(v2): Fix i18n staging deployment due to json typo ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#4541](https://github.com/facebook/docusaurus/pull/4541) fix(v2): fix code block title parsing, support multiple metastring attributes ([@duanwilliam](https://github.com/duanwilliam))
  - [#4600](https://github.com/facebook/docusaurus/pull/4600) fix(v2): use page title from config if not set ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#4501](https://github.com/facebook/docusaurus/pull/4501) fix(v2): fail-safe usage of browser storage (localStorage/sessionStorage) when access is denied ([@jknoxville](https://github.com/jknoxville))
- `docusaurus-plugin-content-docs`, `docusaurus-types`, `docusaurus`
  - [#4593](https://github.com/facebook/docusaurus/pull/4593) fix(v2): i18n perf issue: getTranslationFile() should not load content again ([@slorber](https://github.com/slorber))
- Other
  - [#4574](https://github.com/facebook/docusaurus/pull/4574) fix(v2): examples should use Node 14 by default on CodeSandbox + regen with alpha72 ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#4547](https://github.com/facebook/docusaurus/pull/4547) feat(v2) : use symbols to denote swizzle safety ([@besemuna](https://github.com/besemuna))
  - [#4575](https://github.com/facebook/docusaurus/pull/4575) fix(v2): fix i18n isLastLocale bug preventing docusaurus from building some locales ([@slorber](https://github.com/slorber))
  - [#4506](https://github.com/facebook/docusaurus/pull/4506) fix(v2): remove no longer used postcss-present-env from dependencies ([@armano2](https://github.com/armano2))
  - [#4444](https://github.com/facebook/docusaurus/pull/4444) fix(v2): Fix writeHeadingIds on Windows due to non-posix paths ([@slorber](https://github.com/slorber))
- `docusaurus-utils`
  - [#4507](https://github.com/facebook/docusaurus/pull/4507) fix(v2): do not warn about duplicated title for pages ([@armano2](https://github.com/armano2))
- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus`
  - [#4466](https://github.com/facebook/docusaurus/pull/4466) fix(v2): i18n fixes ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-utils-validation`, `docusaurus`
  - [#4459](https://github.com/facebook/docusaurus/pull/4459) fix(v2): Export Joi from validation-utils package ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#4626](https://github.com/facebook/docusaurus/pull/4626) refactor(v2): toggleResponsiveSidebar => more stable callback ([@slorber](https://github.com/slorber))
  - [#4617](https://github.com/facebook/docusaurus/pull/4617) refactor(v2): simplify and optimize sidebar ([@slorber](https://github.com/slorber))
  - [#4608](https://github.com/facebook/docusaurus/pull/4608) refactor(v2): replace react-toggle with own implementation ([@lex111](https://github.com/lex111))
  - [#4601](https://github.com/facebook/docusaurus/pull/4601) refactor(v2): increase heading anchor offset ([@lex111](https://github.com/lex111))
  - [#4467](https://github.com/facebook/docusaurus/pull/4467) refactor(v2): add missing types to theme-classic useTheme ([@armano2](https://github.com/armano2))
  - [#4448](https://github.com/facebook/docusaurus/pull/4448) polish(v2): Add german translations ([@miku86](https://github.com/miku86))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#4619](https://github.com/facebook/docusaurus/pull/4619) refactor(v2): rename class main-docs-wrapper to docs-wrapper ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`, `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`, `docusaurus`
  - [#4451](https://github.com/facebook/docusaurus/pull/4451) refactor(v2): correct client types and type aliases ([@armano2](https://github.com/armano2))
- `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#4450](https://github.com/facebook/docusaurus/pull/4450) chore(v2): Fix more linter warnings ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils`, `docusaurus`
  - [#4442](https://github.com/facebook/docusaurus/pull/4442) chore(v2): Fix linter warnings ([@SamChou19815](https://github.com/SamChou19815))
- `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`
  - [#4375](https://github.com/facebook/docusaurus/pull/4375) refactor(v2): TS config update: reduce the size of npm modules ([@RDIL](https://github.com/RDIL))

#### :memo: Documentation

- Other
  - [#4616](https://github.com/facebook/docusaurus/pull/4616) docs(v2): add showcase: kubevela ([@sunny0826](https://github.com/sunny0826))
  - [#4612](https://github.com/facebook/docusaurus/pull/4612) docs(v2): Added IntelAGENT website to showcase. ([@akepecs](https://github.com/akepecs))
  - [#4609](https://github.com/facebook/docusaurus/pull/4609) docs(v2): add clarity to tip in versioned using-themes page ([@dickwyn](https://github.com/dickwyn))
  - [#4606](https://github.com/facebook/docusaurus/pull/4606) docs(v2): heading typo ([@arturcarvalho](https://github.com/arturcarvalho))
  - [#4604](https://github.com/facebook/docusaurus/pull/4604) docs(v2): add clarity to tip in using-themes page ([@dickwyn](https://github.com/dickwyn))
  - [#4602](https://github.com/facebook/docusaurus/pull/4602) docs(v2): Add "PptxGenJS" to showcase ([@gitbrent](https://github.com/gitbrent))
  - [#4599](https://github.com/facebook/docusaurus/pull/4599) docs(v2): i18n site: enable ko + zh-CN locales ([@slorber](https://github.com/slorber))
  - [#4595](https://github.com/facebook/docusaurus/pull/4595) docs(v2): fix typo theme-configuration.md ([@forresst](https://github.com/forresst))
  - [#4594](https://github.com/facebook/docusaurus/pull/4594) docs(v2): Include docusaurus-protobuffet to community plugins ([@AnthonyBobsin](https://github.com/AnthonyBobsin))
  - [#4558](https://github.com/facebook/docusaurus/pull/4558) docs(v2): fixed broken link in i18n-tutorial.md ([@covalentbond](https://github.com/covalentbond))
  - [#4573](https://github.com/facebook/docusaurus/pull/4573) docs: update README badges ([@slorber](https://github.com/slorber))
  - [#4559](https://github.com/facebook/docusaurus/pull/4559) docs(v2): fixed the directory of index.js ([@covalentbond](https://github.com/covalentbond))
  - [#4568](https://github.com/facebook/docusaurus/pull/4568) docs(v2): add social-embed to showcase ([@tony](https://github.com/tony))
  - [#4570](https://github.com/facebook/docusaurus/pull/4570) docs(v2): Add Redis Labs Developer Site to docusaurus showcase page ([@ajeetraina](https://github.com/ajeetraina))
  - [#4543](https://github.com/facebook/docusaurus/pull/4543) docs(v2): fix run-on sentence ([@duanwilliam](https://github.com/duanwilliam))
  - [#4539](https://github.com/facebook/docusaurus/pull/4539) docs(v2): fix typo deployment.mdx ([@forresst](https://github.com/forresst))
  - [#4538](https://github.com/facebook/docusaurus/pull/4538) Add Tuist to the list of projects that use Docusaurus ([@pepibumur](https://github.com/pepibumur))
  - [#4531](https://github.com/facebook/docusaurus/pull/4531) docs(v2): remove duplicate line on v1 docs ([@loozhengyuan](https://github.com/loozhengyuan))
  - [#4524](https://github.com/facebook/docusaurus/pull/4524) docs(v2): config for self-hosted docsearch crawler ([@loozhengyuan](https://github.com/loozhengyuan))
  - [#4526](https://github.com/facebook/docusaurus/pull/4526) docs(v2): fix markdown headings level 4 ([@forresst](https://github.com/forresst))
  - [#4505](https://github.com/facebook/docusaurus/pull/4505) docs(v2): add more links to v1: announcementBar, versionDropdown, homepage ([@slorber](https://github.com/slorber))
  - [#4497](https://github.com/facebook/docusaurus/pull/4497) docs: fix link to issue template ([@forresst](https://github.com/forresst))
  - [#4481](https://github.com/facebook/docusaurus/pull/4481) docs(v2): fix grammar and improve wording ([@aehrea](https://github.com/aehrea))
  - [#4472](https://github.com/facebook/docusaurus/pull/4472) docs(v2): fixed broken link in sidebar documentation ([@covalentbond](https://github.com/covalentbond))
  - [#4470](https://github.com/facebook/docusaurus/pull/4470) docs(v2): Add missing i18n docs: API lifecycles + Crowdin migration guide ([@slorber](https://github.com/slorber))
  - [#4460](https://github.com/facebook/docusaurus/pull/4460) docs(v2): use explicit heading IDs ([@lex111](https://github.com/lex111))
  - [#4446](https://github.com/facebook/docusaurus/pull/4446) docs(v2): Add blog.johnnyreilly.com to showcase ([@johnnyreilly](https://github.com/johnnyreilly))
  - [#4430](https://github.com/facebook/docusaurus/pull/4430) docs(v2): add Deploy with QuandCDN ([@steveworley](https://github.com/steveworley))
  - [#4441](https://github.com/facebook/docusaurus/pull/4441) docs(v2): add stylable site to users showcase list ([@tomrav](https://github.com/tomrav))
- `docusaurus-init`
  - [#4561](https://github.com/facebook/docusaurus/pull/4561) docs(v2): add a missing slug from the initial template ([@Foxeye-Rinx](https://github.com/Foxeye-Rinx))
  - [#4560](https://github.com/facebook/docusaurus/pull/4560) docs(v2): fixed typos ([@covalentbond](https://github.com/covalentbond))
  - [#4546](https://github.com/facebook/docusaurus/pull/4546) docs(v2): add a missing "export" from the initial template ([@Foxeye-Rinx](https://github.com/Foxeye-Rinx))
  - [#4320](https://github.com/facebook/docusaurus/pull/4320) feat(v2): Improve the initial templates #4302 ([@besemuna](https://github.com/besemuna))
- `docusaurus-migrate`, `docusaurus`
  - [#4479](https://github.com/facebook/docusaurus/pull/4479) docs(v2): fixed typos ([@covalentbond](https://github.com/covalentbond))

#### :house: Internal

- `docusaurus-theme-classic`
  - [#4627](https://github.com/facebook/docusaurus/pull/4627) chore(v2): update Infima to alpha.22 ([@slorber](https://github.com/slorber))
  - [#4463](https://github.com/facebook/docusaurus/pull/4463) chore: fb json header commit typo ([@slorber](https://github.com/slorber))
- Other
  - [#4613](https://github.com/facebook/docusaurus/pull/4613) chore(v2): fix yarn2 end2end test by using lerna publish --exact ([@slorber](https://github.com/slorber))
  - [#4611](https://github.com/facebook/docusaurus/pull/4611) chore(v2): CI: do not build all locales when monitoring build time perf ([@slorber](https://github.com/slorber))
  - [#4486](https://github.com/facebook/docusaurus/pull/4486) ci: enable yarn install cache ([@armano2](https://github.com/armano2))
  - [#4508](https://github.com/facebook/docusaurus/pull/4508) ci: change default actions timeout from 6h to 30m ([@armano2](https://github.com/armano2))
  - [#4488](https://github.com/facebook/docusaurus/pull/4488) chore(v2): fix typo in classic init template ([@clarus](https://github.com/clarus))
  - [#4471](https://github.com/facebook/docusaurus/pull/4471) chore: fix GH actions lint problem matchers issue in PR ([@slorber](https://github.com/slorber))
  - [#4458](https://github.com/facebook/docusaurus/pull/4458) chore(v2): enable staging locales: ko ja ([@slorber](https://github.com/slorber))
  - [#4457](https://github.com/facebook/docusaurus/pull/4457) chore(v2): remove docs for alpha v70 ([@lex111](https://github.com/lex111))
  - [#4452](https://github.com/facebook/docusaurus/pull/4452) chore(v2): update typescript-eslint to v4.18.0 ([@armano2](https://github.com/armano2))
- `docusaurus`
  - [#4516](https://github.com/facebook/docusaurus/pull/4516) ci(v2): fail CI if build takes too much time ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-bootstrap`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#4490](https://github.com/facebook/docusaurus/pull/4490) chore: rename v2.docusaurus.io urls after domain switch + redirect + cleanups ([@slorber](https://github.com/slorber))
- `docusaurus-1.x`
  - [#4475](https://github.com/facebook/docusaurus/pull/4475) chore: prepare v1-v2 domain switch ([@slorber](https://github.com/slorber))
  - [#4447](https://github.com/facebook/docusaurus/pull/4447) chore: simplify CI setup ([@slorber](https://github.com/slorber))
- `docusaurus-1.x`, `docusaurus-init`
  - [#4453](https://github.com/facebook/docusaurus/pull/4453) chore(v2): migrate babel-eslint to @babel/eslint-parser ([@armano2](https://github.com/armano2))
- `docusaurus-utils-validation`
  - [#4464](https://github.com/facebook/docusaurus/pull/4464) chore(v2): Joi cyclic dep warning ([@slorber](https://github.com/slorber))
- `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-ideal-image`, `docusaurus-theme-common`, `docusaurus-utils`, `docusaurus`
  - [#4462](https://github.com/facebook/docusaurus/pull/4462) chore: json files should be linted ([@slorber](https://github.com/slorber))

#### :running_woman: Performance

- `docusaurus-theme-classic`
  - [#4626](https://github.com/facebook/docusaurus/pull/4626) refactor(v2): toggleResponsiveSidebar => more stable callback ([@slorber](https://github.com/slorber))
  - [#4603](https://github.com/facebook/docusaurus/pull/4603) perf(v2): avoid rerender of sidebar items while scrolling ([@lex111](https://github.com/lex111))
  - [#4473](https://github.com/facebook/docusaurus/pull/4473) perf(v2): reduce amount of component updates while scrolling ([@armano2](https://github.com/armano2))

#### Committers: 37

- Ajeet Singh Raina, Docker Captain, RedisLabs ([@ajeetraina](https://github.com/ajeetraina))
- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Anthony Bobsin ([@AnthonyBobsin](https://github.com/AnthonyBobsin))
- Arijit Kundu ([@covalentbond](https://github.com/covalentbond))
- Armano ([@armano2](https://github.com/armano2))
- Artur Carvalho ([@arturcarvalho](https://github.com/arturcarvalho))
- Brent Ely ([@gitbrent](https://github.com/gitbrent))
- Chris Kanich ([@kaytwo](https://github.com/kaytwo))
- Dennis Thompson ([@atomicpages](https://github.com/atomicpages))
- Dick Wyn Yong ([@dickwyn](https://github.com/dickwyn))
- Forresst ([@forresst](https://github.com/forresst))
- Guillaume Claret ([@clarus](https://github.com/clarus))
- John Knox ([@jknoxville](https://github.com/jknoxville))
- John Reilly ([@johnnyreilly](https://github.com/johnnyreilly))
- Lisa Chandra ([@lisa761](https://github.com/lisa761))
- Lucas Alves ([@lucalves](https://github.com/lucalves))
- Marco Enrico ([@gumacahin](https://github.com/gumacahin))
- Pedro Piñera Buendía ([@pepibumur](https://github.com/pepibumur))
- Reece Dunham ([@RDIL](https://github.com/RDIL))
- Sam Zhou ([@SamChou19815](https://github.com/SamChou19815))
- Steve ([@steveworley](https://github.com/steveworley))
- Steven Hansel ([@ShinteiMai](https://github.com/ShinteiMai))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Tales Porto ([@talesporto](https://github.com/talesporto))
- Thiago Sciotta ([@thiagog3](https://github.com/thiagog3))
- Tiago Ribeiro ([@tiago-rr](https://github.com/tiago-rr))
- Tom Raviv ([@tomrav](https://github.com/tomrav))
- Tony Narlock ([@tony](https://github.com/tony))
- ZhengYuan Loo ([@loozhengyuan](https://github.com/loozhengyuan))
- [@Foxeye-Rinx](https://github.com/Foxeye-Rinx)
- [@aehrea](https://github.com/aehrea)
- [@akepecs](https://github.com/akepecs)
- [@besemuna](https://github.com/besemuna)
- [@duanwilliam](https://github.com/duanwilliam)
- [@miku86](https://github.com/miku86)
- [@serut](https://github.com/serut)
- guoxudong ([@sunny0826](https://github.com/sunny0826))

## 2.0.0-alpha.72 (2021-03-16)

#### :boom: Breaking Change

Starting with this release for a proper work of i18n functionality, you need to either use Node v14+ or in case of using earlier version of Node.js install [`full-icu` package](https://www.npmjs.com/package/full-icu) and set `NODE_ICU_DATA` environment variable in your npm scripts, for example:

```json
"scripts": {
  "start": "cross-env NODE_ICU_DATA=node_modules/full-icu docusaurus start"
}
```

#### :rocket: New Feature

- `docusaurus-init`
  - [#4302](https://github.com/facebook/docusaurus/pull/4302) feat(v2): Improve the initial templates ([@ShinteiMai](https://github.com/ShinteiMai))
- `docusaurus-theme-classic`
  - [#4390](https://github.com/facebook/docusaurus/pull/4390) feat(v2): Add korean default translations ([@koko8829](https://github.com/koko8829))

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#4429](https://github.com/facebook/docusaurus/pull/4429) chore(v2): upgrade Infima to v0.2.0-alpha.21 ([@lex111](https://github.com/lex111))
  - [#4428](https://github.com/facebook/docusaurus/pull/4428) fix(v2): allow using pre tag in Markdown directly ([@lex111](https://github.com/lex111))
  - [#4381](https://github.com/facebook/docusaurus/pull/4381) fix(v2): specify proper TS path in classic theme ([@lex111](https://github.com/lex111))
  - [#4383](https://github.com/facebook/docusaurus/pull/4383) fix(v2): set theme color mode for SSR ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-pwa`
  - [#4424](https://github.com/facebook/docusaurus/pull/4424) fix(v2): add missing peer dep on @babel/core ([@SimenB](https://github.com/SimenB))
  - [#4377](https://github.com/facebook/docusaurus/pull/4377) fix(v2): PWA issues + improve docs ([@slorber](https://github.com/slorber))
- `docusaurus`
  - [#4407](https://github.com/facebook/docusaurus/pull/4407) fix(v2): broken link checker should not report false positives when using encoded chars ([@Harvtronix](https://github.com/Harvtronix))
- Other
  - [#4410](https://github.com/facebook/docusaurus/pull/4410) fix(v1): Fix v1 site deployment with Crowdin again... ([@slorber](https://github.com/slorber))
  - [#4396](https://github.com/facebook/docusaurus/pull/4396) fix(v1): Temp fix v1 site deployment: fail-safe on Crowdin upload translations error ([@slorber](https://github.com/slorber))
  - [#4395](https://github.com/facebook/docusaurus/pull/4395) fix(v1): fix v1 site deploy issues ([@slorber](https://github.com/slorber))

#### :nail_care: Polish

- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus`
  - [#4418](https://github.com/facebook/docusaurus/pull/4418) refactor(v2): correct plugin types ([@armano2](https://github.com/armano2))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-theme-common`, `docusaurus-utils`, `docusaurus`
  - [#4405](https://github.com/facebook/docusaurus/pull/4405) refactor(v2): i18n cleanups / refactors ([@longlho](https://github.com/longlho))
- `docusaurus-module-type-aliases`
  - [#4387](https://github.com/facebook/docusaurus/pull/4387) refactor(v2): add ExecutionEnvironment, BrowserOnly, isInternalUrl to type aliases ([@armano2](https://github.com/armano2))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-utils`
  - [#4402](https://github.com/facebook/docusaurus/pull/4402) refactor(v2): merge linkify function used in blog and docs and align properties ([@armano2](https://github.com/armano2))
- `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-docs`, `docusaurus-theme-common`, `docusaurus-utils-validation`, `docusaurus`
  - [#4382](https://github.com/facebook/docusaurus/pull/4382) refactor(v2): correct some of type errors reported by eslint ([@armano2](https://github.com/armano2))
- `docusaurus-theme-bootstrap`, `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#4385](https://github.com/facebook/docusaurus/pull/4385) refactor(v2): add missing theme-classic types ([@armano2](https://github.com/armano2))

#### :memo: Documentation

- [#4416](https://github.com/facebook/docusaurus/pull/4416) docs(v2): add Realtime Web Applications Workshop to showcase ([@lowenhere](https://github.com/lowenhere))
- [#4408](https://github.com/facebook/docusaurus/pull/4408) docs(v2): add gladysassistant.com to showcase ([@Pierre-Gilles](https://github.com/Pierre-Gilles))
- [#4386](https://github.com/facebook/docusaurus/pull/4386) docs(v2): Showcase the pnpm docs ([@zkochan](https://github.com/zkochan))
- [#4367](https://github.com/facebook/docusaurus/pull/4367) docs(v2): releasing i18n blog post ([@slorber](https://github.com/slorber))

#### :house: Internal

- `docusaurus-1.x`
  - [#4401](https://github.com/facebook/docusaurus/pull/4401) chore(v1): fix CircleCI v1 site deploy ([@slorber](https://github.com/slorber))
- Other
  - [#4399](https://github.com/facebook/docusaurus/pull/4399) chore(v2): upgrade example projects ([@slorber](https://github.com/slorber))
  - [#4398](https://github.com/facebook/docusaurus/pull/4398) chore(v1): trigger v1 site deploy through CI ([@slorber](https://github.com/slorber))
- `docusaurus-utils`
  - [#4384](https://github.com/facebook/docusaurus/pull/4384) chore(v2): avoid bad publish of intl-locales-supported ([@lex111](https://github.com/lex111))

#### Committers: 14

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Armano ([@armano2](https://github.com/armano2))
- Harvtronix ([@Harvtronix](https://github.com/Harvtronix))
- Joon-Ha Lee ([@koko8829](https://github.com/koko8829))
- Leandro Oriente ([@leandrooriente](https://github.com/leandrooriente))
- Long Ho ([@longlho](https://github.com/longlho))
- Lowen ([@lowenhere](https://github.com/lowenhere))
- Pierre-Gilles Leymarie ([@Pierre-Gilles](https://github.com/Pierre-Gilles))
- Quan ([@quanengineering](https://github.com/quanengineering))
- Simen Bekkhus ([@SimenB](https://github.com/SimenB))
- Steven Hansel ([@ShinteiMai](https://github.com/ShinteiMai))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Zoltan Kochan ([@zkochan](https://github.com/zkochan))
- [@Rhodanthe1116](https://github.com/Rhodanthe1116)

## 2.0.0-alpha.71 (2021-03-09)

#### :rocket: New Feature

- `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-utils`, `docusaurus`
  - [#4222](https://github.com/facebook/docusaurus/pull/4222) feat(v2): add ability to set custom heading id ([@lex111](https://github.com/lex111))
- `docusaurus-theme-live-codeblock`
  - [#4328](https://github.com/facebook/docusaurus/pull/4328) feat(v2): Add playgroundPosition config for live codeblock ([@tokarchyn](https://github.com/tokarchyn))
- `docusaurus-theme-classic`
  - [#4209](https://github.com/facebook/docusaurus/pull/4209) feat(v2): auto focus to tab if it is outside viewport ([@lex111](https://github.com/lex111))
  - [#4329](https://github.com/facebook/docusaurus/pull/4329) feat(v2): add arabic translation ([@3alisaki](https://github.com/3alisaki))
  - [#4325](https://github.com/facebook/docusaurus/pull/4325) feat(v2): [theme-classic] add Polish translation ([@Simek](https://github.com/Simek))
  - [#4312](https://github.com/facebook/docusaurus/pull/4312) feat(v2): Add Turkish translations for theme labels ([@caglarturali](https://github.com/caglarturali))
  - [#4271](https://github.com/facebook/docusaurus/pull/4271) feat(v2): add Farsi default translations ([@slorber](https://github.com/slorber))
  - [#4261](https://github.com/facebook/docusaurus/pull/4261) feat(v2): add icon to generic sidebar link ([@lex111](https://github.com/lex111))
  - [#4109](https://github.com/facebook/docusaurus/pull/4109) feat(v2): default canonical urls ([@slorber](https://github.com/slorber))
- `docusaurus-types`, `docusaurus`
  - [#4308](https://github.com/facebook/docusaurus/pull/4308) feat(v2): add --config option to CLI ([@longlho](https://github.com/longlho))
  - [#4185](https://github.com/facebook/docusaurus/pull/4185) feat(v2): allow extend PostCSS config ([@lex111](https://github.com/lex111))
  - [#4021](https://github.com/facebook/docusaurus/pull/4021) feat(v2): Allow plugins to consume webpack stats ([@RDIL](https://github.com/RDIL))
- `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`
  - [#4303](https://github.com/facebook/docusaurus/pull/4303) feat(v2): add japanese translations ([@ykzts](https://github.com/ykzts))
- `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus`
  - [#4295](https://github.com/facebook/docusaurus/pull/4295) feat(v2): Add Interpolate / interpolate APIs + complete theme translations ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`
  - [#4278](https://github.com/facebook/docusaurus/pull/4278) feat(v2): ability to "escape" JSX in MDX files as code blocks ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`
  - [#4232](https://github.com/facebook/docusaurus/pull/4232) feat(v2): editUrl functions should receive md doc permalink ([@slorber](https://github.com/slorber))
  - [#4121](https://github.com/facebook/docusaurus/pull/4121) feat(v2): editUrl function for advanced use-cases ([@slorber](https://github.com/slorber))
- `docusaurus-1.x`, `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-bootstrap`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#4218](https://github.com/facebook/docusaurus/pull/4218) feat(v2): support/use React v17 by default ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus-utils`, `docusaurus`
  - [#4215](https://github.com/facebook/docusaurus/pull/4215) feat(v2): Add i18n default code translation bundles ([@slorber](https://github.com/slorber))
- `docusaurus-module-type-aliases`, `docusaurus-theme-classic`, `docusaurus-types`, `docusaurus`
  - [#4140](https://github.com/facebook/docusaurus/pull/4140) feat(v2): add support for RTL direction ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#4199](https://github.com/facebook/docusaurus/pull/4199) feat(v2): allow to change location of search bar ([@lex111](https://github.com/lex111))
  - [#3993](https://github.com/facebook/docusaurus/pull/3993) feat(v2): themed logo in footer ([@natac13](https://github.com/natac13))
- `docusaurus`
  - [#4198](https://github.com/facebook/docusaurus/pull/4198) feat(v2): add fonts loaders + webpack resolve.roots ([@slorber](https://github.com/slorber))
  - [#3998](https://github.com/facebook/docusaurus/pull/3998) feat(v2): Cache hashed assets to dedicated folders ([@kumaraditya303](https://github.com/kumaraditya303))
  - [#3979](https://github.com/facebook/docusaurus/pull/3979) feat(v2): better error message for invalid plugin config ([@9oelM](https://github.com/9oelM))
- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`, `docusaurus`
  - [#4168](https://github.com/facebook/docusaurus/pull/4168) feat(v2): Extract/translate hardcoded labels from classic theme ([@slorber](https://github.com/slorber))
- `docusaurus-init`
  - [#4098](https://github.com/facebook/docusaurus/pull/4098) feat(v2): improve templates, use JSDoc type annotation, improve `docusaurus.config.js` autocompletion ([@LittleboyHarry](https://github.com/LittleboyHarry))
- `docusaurus-init`, `docusaurus-migrate`
  - [#3986](https://github.com/facebook/docusaurus/pull/3986) feat(v2): skip dependency install on docusaurus init ([@kumaraditya303](https://github.com/kumaraditya303))
- `docusaurus-plugin-content-docs`
  - [#3949](https://github.com/facebook/docusaurus/pull/3949) feat(v2): new docs edit options: editCurrentVersion + editLocalizedDocs ([@slorber](https://github.com/slorber))

#### :boom: Breaking Change

- `docusaurus-1.x`, `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-bootstrap`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#4223](https://github.com/facebook/docusaurus/pull/4223) chore(v2): upgrade dependencies + require Node 12 ([@lex111](https://github.com/lex111))

#### :bug: Bug Fix

- `docusaurus`
  - [#4366](https://github.com/facebook/docusaurus/pull/4366) fix(v2): align installed core-js version with babel config ([@armano2](https://github.com/armano2))
  - [#4345](https://github.com/facebook/docusaurus/pull/4345) fix(v2): always extract translations from site/src ([@slorber](https://github.com/slorber))
  - [#4342](https://github.com/facebook/docusaurus/pull/4342) chore(v2): bump clean-css to 5.1.1 ([@lex111](https://github.com/lex111))
  - [#4212](https://github.com/facebook/docusaurus/pull/4212) fix(v2): typo in resolve.roots ([@slorber](https://github.com/slorber))
  - [#4155](https://github.com/facebook/docusaurus/pull/4155) fix(v2): BaseUrl issue banner insertion should be prevented if JS can load ([@slorber](https://github.com/slorber))
  - [#4137](https://github.com/facebook/docusaurus/pull/4137) fix(v2): escape apostrophes in route paths ([@lex111](https://github.com/lex111))
  - [#4136](https://github.com/facebook/docusaurus/pull/4136) fix(v2): fix navigation from homepage ([@lex111](https://github.com/lex111))
  - [#4125](https://github.com/facebook/docusaurus/pull/4125) fix(v2): baseUrl help banner should not be indexed by Google / SEO ([@slorber](https://github.com/slorber))
  - [#4080](https://github.com/facebook/docusaurus/pull/4080) fix(v2): chokidar reloading debounced ([@semoal](https://github.com/semoal))
  - [#3965](https://github.com/facebook/docusaurus/pull/3965) fix(v2): fix svg loader for CSS files ([@apurvaojas](https://github.com/apurvaojas))
  - [#3943](https://github.com/facebook/docusaurus/pull/3943) fix(v2): disables all inlining in CleanCSS ([@lex111](https://github.com/lex111))
  - [#3941](https://github.com/facebook/docusaurus/pull/3941) fix(v2): fix i18n build logging. ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`
  - [#4349](https://github.com/facebook/docusaurus/pull/4349) fix(v2): fix update code translations script + update some translations ([@slorber](https://github.com/slorber))
  - [#4311](https://github.com/facebook/docusaurus/pull/4311) fix(v2): fit footer in viewport when content area is too small ([@lex111](https://github.com/lex111))
  - [#4340](https://github.com/facebook/docusaurus/pull/4340) fix(v2): prevent useless blog pages to be in search results ([@slorber](https://github.com/slorber))
  - [#4274](https://github.com/facebook/docusaurus/pull/4274) fix(v2): theme classic should have lib-next prettified ([@slorber](https://github.com/slorber))
  - [#4267](https://github.com/facebook/docusaurus/pull/4267) fix(v2): Allow null as valid for title of item in footer links. ([@ben-qnimble](https://github.com/ben-qnimble))
  - [#4254](https://github.com/facebook/docusaurus/pull/4254) fix(v2): fix LTR PostCSS bug on Netlify and monorepo symlinks ([@slorber](https://github.com/slorber))
  - [#4247](https://github.com/facebook/docusaurus/pull/4247) fix(v2): make doc container full width when hidden sidebar ([@lex111](https://github.com/lex111))
  - [#4241](https://github.com/facebook/docusaurus/pull/4241) fix(v2): avoid horizontal scrolling when long lines of code ([@lex111](https://github.com/lex111))
  - [#4200](https://github.com/facebook/docusaurus/pull/4200) fix(v2): various minor bugs with location hash ([@lex111](https://github.com/lex111))
  - [#4195](https://github.com/facebook/docusaurus/pull/4195) fix(v2): restore hamburger menu ([@lex111](https://github.com/lex111))
  - [#4189](https://github.com/facebook/docusaurus/pull/4189) fix(v2): prevent click on item menu with children on mobiles ([@lex111](https://github.com/lex111))
  - [#4176](https://github.com/facebook/docusaurus/pull/4176) fix(v2): make locale dropdown accessible from keyboard ([@lex111](https://github.com/lex111))
  - [#4163](https://github.com/facebook/docusaurus/pull/4163) fix(v2): fix warning and improve styling inline TOC ([@lex111](https://github.com/lex111))
  - [#4162](https://github.com/facebook/docusaurus/pull/4162) fix(v2): make more accessible skip link ([@lex111](https://github.com/lex111))
  - [#4160](https://github.com/facebook/docusaurus/pull/4160) fix(v2): fix hreflang headers ([@slorber](https://github.com/slorber))
  - [#4147](https://github.com/facebook/docusaurus/pull/4147) fix(v2): avoid misuse section tag in blog posts ([@lex111](https://github.com/lex111))
  - [#4146](https://github.com/facebook/docusaurus/pull/4146) fix(v2): use current color for language icon ([@lex111](https://github.com/lex111))
  - [#4118](https://github.com/facebook/docusaurus/pull/4118) fix(v2): navbar dropdown subitems should be translated properly ([@slorber](https://github.com/slorber))
  - [#4011](https://github.com/facebook/docusaurus/pull/4011) fix(v2): fix accessibility issue with IconArrow ([@natac13](https://github.com/natac13))
  - [#3968](https://github.com/facebook/docusaurus/pull/3968) fix(v2): fix blog only contextual search ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-live-codeblock`
  - [#4315](https://github.com/facebook/docusaurus/pull/4315) fix(v2): make code blocks more standalone ([@lex111](https://github.com/lex111))
  - [#4277](https://github.com/facebook/docusaurus/pull/4277) fix(v2): Code blocks should be LTR by default ([@slorber](https://github.com/slorber))
- `docusaurus-theme-live-codeblock`
  - [#4318](https://github.com/facebook/docusaurus/pull/4318) fix(v2): evaluate code in live editor on client only ([@lex111](https://github.com/lex111))
  - [#3954](https://github.com/facebook/docusaurus/pull/3954) fix(v2): allow async/await in live code editor ([@9oelM](https://github.com/9oelM))
- `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`
  - [#4339](https://github.com/facebook/docusaurus/pull/4339) fix(v2): search page results localization ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`, `docusaurus-theme-search-algolia`, `docusaurus`
  - [#4304](https://github.com/facebook/docusaurus/pull/4304) fix(v2): fix bad theme pluralization rules for some labels ([@slorber](https://github.com/slorber))
- `docusaurus-cssnano-preset`
  - [#4240](https://github.com/facebook/docusaurus/pull/4240) fix(v2): remove PostCSS plugin for combine duplicated selectors ([@lex111](https://github.com/lex111))
- Other
  - [#4234](https://github.com/facebook/docusaurus/pull/4234) fix(v2): fix website versions page ([@slorber](https://github.com/slorber))
  - [#4233](https://github.com/facebook/docusaurus/pull/4233) fix(v2): website editUrl should target upstream docs ([@slorber](https://github.com/slorber))
  - [#4067](https://github.com/facebook/docusaurus/pull/4067) fix(v2): Fix blog post url/date ([@slorber](https://github.com/slorber))
  - [#3952](https://github.com/facebook/docusaurus/pull/3952) docs(v2): Fix invalid json ([@oze4](https://github.com/oze4))
- `docusaurus-theme-search-algolia`
  - [#4188](https://github.com/facebook/docusaurus/pull/4188) fix(v2): prepend docsearch modal to body element ([@lex111](https://github.com/lex111))
  - [#4154](https://github.com/facebook/docusaurus/pull/4154) fix(v2): add base url to opensearch.xml ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-ideal-image`
  - [#4166](https://github.com/facebook/docusaurus/pull/4166) fix(v2): ideal image assets should be served under ./assets ([@slorber](https://github.com/slorber))
- `docusaurus-theme-classic`, `docusaurus-theme-common`
  - [#4092](https://github.com/facebook/docusaurus/pull/4092) fix(v2): fix/enhance minor i18n issues reported ([@slorber](https://github.com/slorber))
  - [#3940](https://github.com/facebook/docusaurus/pull/3940) fix(v2): i18n should not crash theme without footer ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-sitemap`
  - [#4004](https://github.com/facebook/docusaurus/pull/4004) fix(v2): Fix double trailingSlash in sitemap.xml ([@ntbosscher](https://github.com/ntbosscher))
- `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-utils`
  - [#3970](https://github.com/facebook/docusaurus/pull/3970) fix(v2): fix multi-instance mdx loaders not sandboxed correctly ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-client-redirects`
  - [#3903](https://github.com/facebook/docusaurus/pull/3903) fix(v2): fix redirect toUrl (windows + trailing slash) ([@saydo17](https://github.com/saydo17))
- `docusaurus-utils`
  - [#3944](https://github.com/facebook/docusaurus/pull/3944) fix(v2): ignore style imports in excerpt ([@lex111](https://github.com/lex111))

#### :nail_care: Polish

- `docusaurus-theme-classic`
  - [#4371](https://github.com/facebook/docusaurus/pull/4371) refactor(v2): update Russian translation in classic theme ([@lex111](https://github.com/lex111))
  - [#4359](https://github.com/facebook/docusaurus/pull/4359) polish(v2): [theme-classic] slightly improve Japanese translation ([@MisterFISHUP](https://github.com/MisterFISHUP))
  - [#4350](https://github.com/facebook/docusaurus/pull/4350) polish(v2): Updated theme label translations for Turkish ([@caglarturali](https://github.com/caglarturali))
  - [#4351](https://github.com/facebook/docusaurus/pull/4351) polish(v2): add japanese translation for #4304 ([@ykzts](https://github.com/ykzts))
  - [#4309](https://github.com/facebook/docusaurus/pull/4309) polish(v2): improved Farsi translation ([@massoudmaboudi](https://github.com/massoudmaboudi))
  - [#4279](https://github.com/facebook/docusaurus/pull/4279) polish(v2): theme default translations for language de / german ([@philipp985](https://github.com/philipp985))
  - [#4275](https://github.com/facebook/docusaurus/pull/4275) polish(v2): Add more tags translations ([@slorber](https://github.com/slorber))
  - [#4246](https://github.com/facebook/docusaurus/pull/4246) refactor(v2): add Russian translation for classic theme ([@lex111](https://github.com/lex111))
  - [#4242](https://github.com/facebook/docusaurus/pull/4242) refactor(v2): use Link component for external links ([@lex111](https://github.com/lex111))
  - [#4244](https://github.com/facebook/docusaurus/pull/4244) refactor(v2): clean-ups and fixes ([@lex111](https://github.com/lex111))
  - [#4193](https://github.com/facebook/docusaurus/pull/4193) refactor(v2): update tabs to follow WAI-ARIA spec ([@lex111](https://github.com/lex111))
  - [#4194](https://github.com/facebook/docusaurus/pull/4194) refactor(v2): use transform instead of top position for hideable navbar ([@lex111](https://github.com/lex111))
  - [#4167](https://github.com/facebook/docusaurus/pull/4167) refactor(v2): minor styling improvements ([@lex111](https://github.com/lex111))
  - [#4169](https://github.com/facebook/docusaurus/pull/4169) refactor(v2): remove delay after skip link pressed ([@lex111](https://github.com/lex111))
  - [#4086](https://github.com/facebook/docusaurus/pull/4086) style(v2): add className to tab container ([@ArtFlag](https://github.com/ArtFlag))
- `docusaurus-plugin-content-docs`, `docusaurus-theme-classic`
  - [#4352](https://github.com/facebook/docusaurus/pull/4352) refactor(v2): format last updated date using Intl ([@lex111](https://github.com/lex111))
  - [#4243](https://github.com/facebook/docusaurus/pull/4243) refactor(v2): introduce Seo component for internal using ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-content-blog`, `docusaurus-theme-classic`, `docusaurus-utils`
  - [#4344](https://github.com/facebook/docusaurus/pull/4344) refactor(v2): format post date using Intl ([@lex111](https://github.com/lex111))
- `docusaurus`
  - [#4257](https://github.com/facebook/docusaurus/pull/4257) refactor(v2): improve notifier message ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-pwa`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`
  - [#4219](https://github.com/facebook/docusaurus/pull/4219) refactor(v2): add more translatable strings ([@lex111](https://github.com/lex111))
- Other
  - [#4074](https://github.com/facebook/docusaurus/pull/4074) polish(v2): improve codesandbox template package.json ([@slorber](https://github.com/slorber))
- `docusaurus-plugin-debug`
  - [#3953](https://github.com/facebook/docusaurus/pull/3953) refactor(v2): fix debug plugin name ([@RDIL](https://github.com/RDIL))
- `docusaurus-plugin-debug`, `docusaurus-theme-classic`
  - [#3946](https://github.com/facebook/docusaurus/pull/3946) refactor(v2): minor a11y tweaks ([@lex111](https://github.com/lex111))

#### :memo: Documentation

- Other
  - [#4369](https://github.com/facebook/docusaurus/pull/4369) docs(v2): various improvements ([@lex111](https://github.com/lex111))
  - [#4362](https://github.com/facebook/docusaurus/pull/4362) docs(v2): Add stryker-mutator.io to showcase ([@nicojs](https://github.com/nicojs))
  - [#4354](https://github.com/facebook/docusaurus/pull/4354) docs(v2): add trpgengine showcase ([@moonrailgun](https://github.com/moonrailgun))
  - [#4346](https://github.com/facebook/docusaurus/pull/4346) docs(v1): update phrasing for website dir relative to docs dir ([@aukokyong](https://github.com/aukokyong))
  - [#4338](https://github.com/facebook/docusaurus/pull/4338) docs(v2): update showcase instruction regarding tags + fix site tags ([@slorber](https://github.com/slorber))
  - [#4331](https://github.com/facebook/docusaurus/pull/4331) docs(v2): add ocpeasy to users ([@dbrrt](https://github.com/dbrrt))
  - [#4307](https://github.com/facebook/docusaurus/pull/4307) docs(v2): Add RactivePlayer to showcase ([@ysulyma](https://github.com/ysulyma))
  - [#4297](https://github.com/facebook/docusaurus/pull/4297) docs(v2): Fix examples by importing React ([@roydukkey](https://github.com/roydukkey))
  - [#4296](https://github.com/facebook/docusaurus/pull/4296) docs(v2): move migrated sites from v1 to v2 showcase ([@lisa761](https://github.com/lisa761))
  - [#4293](https://github.com/facebook/docusaurus/pull/4293) docs(v2): Added React Native ARIA to showcase ([@theankurkedia](https://github.com/theankurkedia))
  - [#4284](https://github.com/facebook/docusaurus/pull/4284) docs(v2): Add AttoBot website to showcase page ([@wolf20482](https://github.com/wolf20482))
  - [#4285](https://github.com/facebook/docusaurus/pull/4285) docs(v2): escape more jsx in mdx files for Crowdin ([@slorber](https://github.com/slorber))
  - [#4283](https://github.com/facebook/docusaurus/pull/4283) docs(v2): Add Postgres.ai to showcase ([@NikolayS](https://github.com/NikolayS))
  - [#4282](https://github.com/facebook/docusaurus/pull/4282) docs: update Netlify deploy status badge ([@slorber](https://github.com/slorber))
  - [#4259](https://github.com/facebook/docusaurus/pull/4259) docs(v2): improve cli docs ([@massoudmaboudi](https://github.com/massoudmaboudi))
  - [#4266](https://github.com/facebook/docusaurus/pull/4266) docs(v2): update agilets banner ([@bennodev19](https://github.com/bennodev19))
  - [#4263](https://github.com/facebook/docusaurus/pull/4263) docs(v2): remove npx and use github action to configure ssh key ([@MatanBobi](https://github.com/MatanBobi))
  - [#4262](https://github.com/facebook/docusaurus/pull/4262) docs(v2): Added kotest to showcase ([@sksamuel](https://github.com/sksamuel))
  - [#4256](https://github.com/facebook/docusaurus/pull/4256) docs(v2): Add docusaurus2-graphql-doc-generator to community resources ([@edno](https://github.com/edno))
  - [#4252](https://github.com/facebook/docusaurus/pull/4252) docs(v2): Added mailgo to showcase ([@manzinello](https://github.com/manzinello))
  - [#4251](https://github.com/facebook/docusaurus/pull/4251) docs(v2): Add Axioms to showcase ([@limkinZero](https://github.com/limkinZero))
  - [#4237](https://github.com/facebook/docusaurus/pull/4237) docs(v2): Replace mbt-bundle by sicope-model ([@tienvx](https://github.com/tienvx))
  - [#4236](https://github.com/facebook/docusaurus/pull/4236) docs(v2): v2 migration should mention RSS feed url change ([@slorber](https://github.com/slorber))
  - [#4230](https://github.com/facebook/docusaurus/pull/4230) docs(v2): fix npm/yarn command example for swizzling TypeScript theme components ([@YashTotale](https://github.com/YashTotale))
  - [#4229](https://github.com/facebook/docusaurus/pull/4229) docs(v2): Fix link to slash introduction svg ([@SamChou19815](https://github.com/SamChou19815))
  - [#4226](https://github.com/facebook/docusaurus/pull/4226) docs(v2): Removing wrong parenthesis on image variable ([@juancarlosjr97](https://github.com/juancarlosjr97))
  - [#4225](https://github.com/facebook/docusaurus/pull/4225) docs(v2): added Apache APISIX ([@juzhiyuan](https://github.com/juzhiyuan))
  - [#4224](https://github.com/facebook/docusaurus/pull/4224) docs(v2): Add MikroORM site to showcase page ([@B4nan](https://github.com/B4nan))
  - [#4220](https://github.com/facebook/docusaurus/pull/4220) Add WebdriverIO docs page as showcase ([@christian-bromann](https://github.com/christian-bromann))
  - [#4210](https://github.com/facebook/docusaurus/pull/4210) misc: add requirements for sites being added to showcase ([@lex111](https://github.com/lex111))
  - [#4207](https://github.com/facebook/docusaurus/pull/4207) docs(v2): Added Console Table Documentation Site to showcase ([@ayonious](https://github.com/ayonious))
  - [#4204](https://github.com/facebook/docusaurus/pull/4204) docs(v1): fixing a broken link in blog posts ([@ayonious](https://github.com/ayonious))
  - [#4178](https://github.com/facebook/docusaurus/pull/4178) docs(v2): localize 404 page with Netlify + docs ([@slorber](https://github.com/slorber))
  - [#4177](https://github.com/facebook/docusaurus/pull/4177) docs(v2): Add docusaurus-plugin-remote-content to resources list ([@RDIL](https://github.com/RDIL))
  - [#4172](https://github.com/facebook/docusaurus/pull/4172) docs(v2): Add react-hooks.org to showcase ([@imbhargav5](https://github.com/imbhargav5))
  - [#4173](https://github.com/facebook/docusaurus/pull/4173) docs(v2): typo fixing double colon ([@ayonious](https://github.com/ayonious))
  - [#4164](https://github.com/facebook/docusaurus/pull/4164) docs(v2): add a note for images not rendered on dev server ([@yuval-hazaz](https://github.com/yuval-hazaz))
  - [#4161](https://github.com/facebook/docusaurus/pull/4161) docs(v2): Add docusaurus-theme-github-codeblock ([@christian-bromann](https://github.com/christian-bromann))
  - [#4158](https://github.com/facebook/docusaurus/pull/4158) docs(v2): improve bad static assets doc + remove some useless useBaseUrl usage ([@slorber](https://github.com/slorber))
  - [#4144](https://github.com/facebook/docusaurus/pull/4144) docs(v2): community docs typo fix ([@ayonious](https://github.com/ayonious))
  - [#4143](https://github.com/facebook/docusaurus/pull/4143) docs(v2): guide docs typo fix ([@ayonious](https://github.com/ayonious))
  - [#4141](https://github.com/facebook/docusaurus/pull/4141) docs(v2): plugins docs typo fix ([@ayonious](https://github.com/ayonious))
  - [#4139](https://github.com/facebook/docusaurus/pull/4139) docs(v2): Add Rematch site to showcase page ([@semoal](https://github.com/semoal))
  - [#4128](https://github.com/facebook/docusaurus/pull/4128) docs(v2): remove duplicate link from docs about Docusaurus1 ([@ayonious](https://github.com/ayonious))
  - [#4129](https://github.com/facebook/docusaurus/pull/4129) docs(v2): typo fix in Migration Docs ([@ayonious](https://github.com/ayonious))
  - [#4127](https://github.com/facebook/docusaurus/pull/4127) docs(v2): remove unnecessary brace from installation doc ([@ayonious](https://github.com/ayonious))
  - [#4130](https://github.com/facebook/docusaurus/pull/4130) docs(v2): typo in i18n docs ([@ayonious](https://github.com/ayonious))
  - [#4112](https://github.com/facebook/docusaurus/pull/4112) docs(v2): Do not encourage using the permalink prop ([@slorber](https://github.com/slorber))
  - [#4106](https://github.com/facebook/docusaurus/pull/4106) docs(v2): update broken link on resources page ([@eric-hc](https://github.com/eric-hc))
  - [#4084](https://github.com/facebook/docusaurus/pull/4084) docs(v2): Use the TOCInline component in config doc ([@slorber](https://github.com/slorber))
  - [#4020](https://github.com/facebook/docusaurus/pull/4020) docs(v2): 2020 recap blog post ([@slorber](https://github.com/slorber))
  - [#4009](https://github.com/facebook/docusaurus/pull/4009) docs(v2): add hideableSidebar option to config demo ([@natac13](https://github.com/natac13))
  - [#4062](https://github.com/facebook/docusaurus/pull/4062) docs(v2): Add codesandbox integration ([@sammychinedu2ky](https://github.com/sammychinedu2ky))
  - [#4058](https://github.com/facebook/docusaurus/pull/4058) docs(v2): Include new.docusaurus.io CodeSandbox in issue templates + README ([@slorber](https://github.com/slorber))
  - [#4053](https://github.com/facebook/docusaurus/pull/4053) docs(v2): Add Eightshift Docs site to showcase page ([@iruzevic](https://github.com/iruzevic))
  - [#4048](https://github.com/facebook/docusaurus/pull/4048) docs(v1): Docker: remind the user to use the --host flag ([@tomsfernandez](https://github.com/tomsfernandez))
  - [#4047](https://github.com/facebook/docusaurus/pull/4047) docs(v1): version page should recommend v2 ([@slorber](https://github.com/slorber))
  - [#4046](https://github.com/facebook/docusaurus/pull/4046) docs(v2): add sciwp to showcase ([@edulazaro](https://github.com/edulazaro))
  - [#4036](https://github.com/facebook/docusaurus/pull/4036) docs(v2): Add Nodify to showcase ([@miroiu](https://github.com/miroiu))
  - [#4038](https://github.com/facebook/docusaurus/pull/4038) docs(v1): suggest to use Docusaurus 2 even for non-FB websites ([@slorber](https://github.com/slorber))
  - [#4026](https://github.com/facebook/docusaurus/pull/4026) docs(v2): Add FlexIt to showcase ([@ataft](https://github.com/ataft))
  - [#4022](https://github.com/facebook/docusaurus/pull/4022) docs: fix typo from 'dissapear' to 'disappear' ([@vamsi3](https://github.com/vamsi3))
  - [#4002](https://github.com/facebook/docusaurus/pull/4002) docs(v2): Add how to run your own DocSearch ([@TheodoreChu](https://github.com/TheodoreChu))
  - [#3997](https://github.com/facebook/docusaurus/pull/3997) docs(v2): Add Datagit site to showcase page ([@massoudmaboudi](https://github.com/massoudmaboudi))
  - [#3990](https://github.com/facebook/docusaurus/pull/3990) docs(v2): Add wiki-powerto site showcase ([@linyuxuanlin](https://github.com/linyuxuanlin))
  - [#3991](https://github.com/facebook/docusaurus/pull/3991) docs(v2): add overwriting css variables for dark mode ([@natac13](https://github.com/natac13))
  - [#3987](https://github.com/facebook/docusaurus/pull/3987) docs(v2): Add AgileTs site to showcase page ([@bennodev19](https://github.com/bennodev19))
  - [#3978](https://github.com/facebook/docusaurus/pull/3978) docs(v2): Add documentation for docs multi-instance support ([@slorber](https://github.com/slorber))
  - [#3977](https://github.com/facebook/docusaurus/pull/3977) docs(v2): nudge users to add site to showcase ([@slorber](https://github.com/slorber))
  - [#3975](https://github.com/facebook/docusaurus/pull/3975) docs(v2): Reorganize/split the guides doc / markdown sections ([@slorber](https://github.com/slorber))
  - [#3976](https://github.com/facebook/docusaurus/pull/3976) docs(v2): Add AI-Speaker site to showcase page ([@asystentka-jolka](https://github.com/asystentka-jolka))
  - [#3974](https://github.com/facebook/docusaurus/pull/3974) docs(v2): doc typo on sidebar admonition ([@slorber](https://github.com/slorber))
  - [#3962](https://github.com/facebook/docusaurus/pull/3962) docs(v2): Add migration info doc regarding docs folder location ([@slorber](https://github.com/slorber))
  - [#3950](https://github.com/facebook/docusaurus/pull/3950) docs(v2): update GitHub entreprise deployment doc ([@samhrncir](https://github.com/samhrncir))
  - [#3945](https://github.com/facebook/docusaurus/pull/3945) docs(v2): Added information about setting `/` in routeBasePath ([@Siemienik](https://github.com/Siemienik))
- `docusaurus-theme-classic`
  - [#4356](https://github.com/facebook/docusaurus/pull/4356) polish(v2): [theme-classic] add Chinese translations (zh-Hant & zh-Hans) ([@MisterFISHUP](https://github.com/MisterFISHUP))
- `docusaurus`
  - [#4126](https://github.com/facebook/docusaurus/pull/4126) docs(v2): do not recommend using useBaseUrl() hook in most cases ([@slorber](https://github.com/slorber))
  - [#4049](https://github.com/facebook/docusaurus/pull/4049) docs(v1): version page should recommend v2 (bis) ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus-theme-classic`, `docusaurus`
  - [#4014](https://github.com/facebook/docusaurus/pull/4014) docs(v2): i18n doc + polish ([@slorber](https://github.com/slorber))
- `docusaurus-cssnano-preset`, `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-module-type-aliases`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-google-analytics`, `docusaurus-plugin-google-gtag`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-pwa`, `docusaurus-plugin-sitemap`, `docusaurus-preset-bootstrap`, `docusaurus-preset-classic`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-theme-bootstrap`, `docusaurus-theme-common`, `docusaurus-theme-live-codeblock`, `docusaurus-theme-search-algolia`, `docusaurus-types`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`, `stylelint-copyright`
  - [#4034](https://github.com/facebook/docusaurus/pull/4034) docs(v2): Add READMEs to v2 packages ([@RDIL](https://github.com/RDIL))
- `docusaurus-init`
  - [#3881](https://github.com/facebook/docusaurus/pull/3881) docs(v2): update FB OSS logo ([@Simek](https://github.com/Simek))

#### :house: Internal

- Other
  - [#4372](https://github.com/facebook/docusaurus/pull/4372) chore(v1): release docusaurus v1.14.7 ([@slorber](https://github.com/slorber))
  - [#4368](https://github.com/facebook/docusaurus/pull/4368) chore(deps): bump elliptic from 6.5.3 to 6.5.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - [#4365](https://github.com/facebook/docusaurus/pull/4365) chore: unstable yarnlock ([@slorber](https://github.com/slorber))
  - [#4337](https://github.com/facebook/docusaurus/pull/4337) misc: restore build size bot ([@slorber](https://github.com/slorber))
  - [#4289](https://github.com/facebook/docusaurus/pull/4289) chore(v2): remove docs for alpha v69 ([@lex111](https://github.com/lex111))
  - [#4253](https://github.com/facebook/docusaurus/pull/4253) chore(v2): remove docs for alpha v68 ([@lex111](https://github.com/lex111))
  - [#4248](https://github.com/facebook/docusaurus/pull/4248) chore(v2): Fix build size bot ([@slorber](https://github.com/slorber))
  - [#4214](https://github.com/facebook/docusaurus/pull/4214) chore(v2): setup for i18n staging deployment ([@slorber](https://github.com/slorber))
  - [#4159](https://github.com/facebook/docusaurus/pull/4159) chore(v2): fix build size bot again ([@slorber](https://github.com/slorber))
  - [#4156](https://github.com/facebook/docusaurus/pull/4156) chore(v2): fix build size bot monitoring of js/css assets ([@slorber](https://github.com/slorber))
  - [#4100](https://github.com/facebook/docusaurus/pull/4100) chore(v2): remove docs for alpha v66 ([@lex111](https://github.com/lex111))
  - [#4077](https://github.com/facebook/docusaurus/pull/4077) chore(v2): fix unstable master yarn.lock ([@slorber](https://github.com/slorber))
  - [#4063](https://github.com/facebook/docusaurus/pull/4063) chore(v2): Regen codesandbox templates + add template: "docusaurus" ([@slorber](https://github.com/slorber))
  - [#4056](https://github.com/facebook/docusaurus/pull/4056) chore(v2): update codesandbox redirect ([@slorber](https://github.com/slorber))
  - [#4041](https://github.com/facebook/docusaurus/pull/4041) chore(v1): revert v1 netlify.toml ([@slorber](https://github.com/slorber))
  - [#4040](https://github.com/facebook/docusaurus/pull/4040) chore(v1): upgrade v1 Crowdin cli + CI config ([@slorber](https://github.com/slorber))
  - [#4030](https://github.com/facebook/docusaurus/pull/4030) chore(v2): install Crowdin cli through npm package ([@slorber](https://github.com/slorber))
  - [#4003](https://github.com/facebook/docusaurus/pull/4003) chore: add DevContainer config for GitHub codespaces ([@kumaraditya303](https://github.com/kumaraditya303))
  - [#4001](https://github.com/facebook/docusaurus/pull/4001) chore(v2): Upgrade crowdin ([@slorber](https://github.com/slorber))
  - [#3995](https://github.com/facebook/docusaurus/pull/3995) chore(v2): remove docs for alpha v65 ([@lex111](https://github.com/lex111))
  - [#3960](https://github.com/facebook/docusaurus/pull/3960) fix(v2): remove duplicate section on Versions page ([@lex111](https://github.com/lex111))
- `docusaurus-theme-classic`
  - [#4370](https://github.com/facebook/docusaurus/pull/4370) chore(v2): update infima ([@slorber](https://github.com/slorber))
- `docusaurus-init`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#4361](https://github.com/facebook/docusaurus/pull/4361) refactor(v2): remove duplicated lodash dependencies and import only what needed ([@armano2](https://github.com/armano2))
- `docusaurus-1.x`, `docusaurus`
  - [#4270](https://github.com/facebook/docusaurus/pull/4270) chore(v2): upgrade react-dev-utils ([@yangshun](https://github.com/yangshun))
- `docusaurus-init`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-ideal-image`, `docusaurus-types`, `docusaurus`
  - [#4264](https://github.com/facebook/docusaurus/pull/4264) chore(v2): bump/align deps in monorepo: commander, semver, fs-extra ([@Simek](https://github.com/Simek))
- `docusaurus`
  - [#4265](https://github.com/facebook/docusaurus/pull/4265) chore(v2): PostCSS peer dep fix ([@RDIL](https://github.com/RDIL))
  - [#4091](https://github.com/facebook/docusaurus/pull/4091) refactor(v2): Switch from inquirer to prompts ([@RDIL](https://github.com/RDIL))
  - [#4066](https://github.com/facebook/docusaurus/pull/4066) chore(v2): Update a few dependencies ([@RDIL](https://github.com/RDIL))
- `docusaurus-init`, `docusaurus-mdx-loader`, `docusaurus-migrate`, `docusaurus-plugin-client-redirects`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-plugin-ideal-image`, `docusaurus-plugin-sitemap`, `docusaurus-theme-classic`, `docusaurus-theme-search-algolia`, `docusaurus-utils-validation`, `docusaurus-utils`, `docusaurus`, `lqip-loader`
  - [#4148](https://github.com/facebook/docusaurus/pull/4148) chore(v2): upgrade dependencies ([@lex111](https://github.com/lex111))
- `docusaurus-plugin-pwa`
  - [#4120](https://github.com/facebook/docusaurus/pull/4120) chore(v2): Update workbox to v6 ([@RDIL](https://github.com/RDIL))
- `docusaurus-utils`, `docusaurus`
  - [#4081](https://github.com/facebook/docusaurus/pull/4081) chore(v2): Update webpack-related dependencies, pre-work to migrate to Webpack 5 ([@RDIL](https://github.com/RDIL))
- `docusaurus-init`, `docusaurus`
  - [#4012](https://github.com/facebook/docusaurus/pull/4012) chore(v2): docusaurus-init: switch from inquirer to prompts ([@RDIL](https://github.com/RDIL))
- `docusaurus-plugin-sitemap`
  - [#4005](https://github.com/facebook/docusaurus/pull/4005) chore(v2): prettier fixes ([@slorber](https://github.com/slorber))
- `docusaurus-migrate`
  - [#3988](https://github.com/facebook/docusaurus/pull/3988) chore(v2): fix date-sensitive test fixture ([@slorber](https://github.com/slorber))
- `docusaurus-mdx-loader`, `docusaurus-plugin-content-blog`, `docusaurus-plugin-content-docs`, `docusaurus-plugin-content-pages`, `docusaurus-plugin-debug`, `docusaurus-remark-plugin-npm2yarn`, `docusaurus-utils`, `docusaurus`, `stylelint-copyright`
  - [#3959](https://github.com/facebook/docusaurus/pull/3959) chore(v2): fix windows Jest tests ([@slorber](https://github.com/slorber))

#### :running_woman: Performance

- `docusaurus-cssnano-preset`, `docusaurus-plugin-content-blog`, `docusaurus`
  - [#4355](https://github.com/facebook/docusaurus/pull/4355) perf(v2): improve blog mdx-loader and postcss loader ([@lex111](https://github.com/lex111))

#### Committers: 70

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))
- Ali Saki ([@3alisaki](https://github.com/3alisaki))
- Andrew Taft ([@ataft](https://github.com/ataft))
- Ankur Kedia ([@theankurkedia](https://github.com/theankurkedia))
- Apurva Ojas ([@apurvaojas](https://github.com/apurvaojas))
- Armano ([@armano2](https://github.com/armano2))
- Arthur ([@ArtFlag](https://github.com/ArtFlag))
- Bartosz Kaszubowski ([@Simek](https://github.com/Simek))
- Ben ([@ben-qnimble](https://github.com/ben-qnimble))
- BennoDev ([@bennodev19](https://github.com/bennodev19))
- Bhargav Ponnapalli ([@imbhargav5](https://github.com/imbhargav5))
- Christian Bromann ([@christian-bromann](https://github.com/christian-bromann))
- David Barrat ([@dbrrt](https://github.com/dbrrt))
- Eduardo Lázaro ([@edulazaro](https://github.com/edulazaro))
- Eric Carboni ([@eric-hc](https://github.com/eric-hc))
- Grégory Heitz ([@edno](https://github.com/edno))
- Ivan Ružević ([@iruzevic](https://github.com/iruzevic))
- Jessica Lin ([@jlin27](https://github.com/jlin27))
- Joel M ([@9oelM](https://github.com/9oelM))
- Joel Marcey ([@JoelMarcey](https://github.com/JoelMarcey))
- Jola ([@asystentka-jolka](https://github.com/asystentka-jolka))
- Juan Carlos Blanco Delgado ([@juancarlosjr97](https://github.com/juancarlosjr97))
- Kevin Viglucci ([@viglucci](https://github.com/viglucci))
- Kumar Aditya ([@kumaraditya303](https://github.com/kumaraditya303))
- Lisa Chandra ([@lisa761](https://github.com/lisa761))
- LittleboyHarry ([@LittleboyHarry](https://github.com/LittleboyHarry))
- Long Ho ([@longlho](https://github.com/longlho))
- Martin Adámek ([@B4nan](https://github.com/B4nan))
- Massoud Maboudi ([@massoudmaboudi](https://github.com/massoudmaboudi))
- Matan Borenkraout ([@MatanBobi](https://github.com/MatanBobi))
- Matt Oestreich ([@oze4](https://github.com/oze4))
- Matteo Manzinello ([@manzinello](https://github.com/manzinello))
- Miroiu Emanuel ([@miroiu](https://github.com/miroiu))
- Mohd Shad Mirza ([@iamshadmirza](https://github.com/iamshadmirza))
- Nahiyan Kamal ([@ayonious](https://github.com/ayonious))
- Nathan Bosscher ([@ntbosscher](https://github.com/ntbosscher))
- Nico Jansen ([@nicojs](https://github.com/nicojs))
- Nikolay Samokhvalov ([@NikolayS](https://github.com/NikolayS))
- Pablo Vidal ([@limkinZero](https://github.com/limkinZero))
- Power Lin ([@linyuxuanlin](https://github.com/linyuxuanlin))
- Reece Dunham ([@RDIL](https://github.com/RDIL))
- Saihajpreet Singh ([@saihaj](https://github.com/saihaj))
- Sam Hrncir ([@samhrncir](https://github.com/samhrncir))
- Sam Sam ([@sksamuel](https://github.com/sksamuel))
- Sam Zhou ([@SamChou19815](https://github.com/SamChou19815))
- Sean Campbell ([@natac13](https://github.com/natac13))
- Sergio Moreno ([@semoal](https://github.com/semoal))
- Siemienik Pawel ([@Siemienik](https://github.com/Siemienik))
- Sébastien Lorber ([@slorber](https://github.com/slorber))
- Theodore Chu ([@TheodoreChu](https://github.com/TheodoreChu))
- Tien Vo Xuan ([@tienvx](https://github.com/tienvx))
- Tomas Fernandez ([@tomsfernandez](https://github.com/tomsfernandez))
- Vamsi Krishna Reddy Satti ([@vamsi3](https://github.com/vamsi3))
- Welly ([@wellyshen](https://github.com/wellyshen))
- Yamagishi Kazutoshi ([@ykzts](https://github.com/ykzts))
- Yangshun Tay ([@yangshun](https://github.com/yangshun))
- Yash Totale ([@YashTotale](https://github.com/YashTotale))
- Yuri Sulyma ([@ysulyma](https://github.com/ysulyma))
- Yuval Hazaz ([@yuval-hazaz](https://github.com/yuval-hazaz))
- [@MisterFISHUP](https://github.com/MisterFISHUP)
- [@aukokyong](https://github.com/aukokyong)
- [@philipp985](https://github.com/philipp985)
- [@roydukkey](https://github.com/roydukkey)
- [@sammychinedu2ky](https://github.com/sammychinedu2ky)
- [@saydo17](https://github.com/saydo17)
- [@tokarchyn](https://github.com/tokarchyn)
- [@wolf20482](https://github.com/wolf20482)
- moonrailgun ([@moonrailgun](https://github.com/moonrailgun))
- Çağlar Turalı ([@caglarturali](https://github.com/caglarturali))
- 琚致远 ([@juzhiyuan](https://github.com/juzhiyuan))

## 2.0.0-alpha.70 (2020-12-17)

#### :rocket: New Feature

- `docusaurus`
  - [#3932](https://github.com/facebook/docusaurus/pull/3932) feat(v2): Add Root theme element ([@slorber](https://github.com/slorber))
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
- [#3871](https://github.com/facebook/docusaurus/pull/3871) docs(v2): missing `<ColorGenerator/>` mdx import ([@slorber](https://github.com/slorber))
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
  - [#3744](https://github.com/facebook/docusaurus/pull/3744) chore(v2): add build size bot workflow GitHub CI workflow ([@jcs98](https://github.com/jcs98))
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
  - [#3565](https://github.com/facebook/docusaurus/pull/3565) docs(v2): deployment, add required GitHub token scope infos ([@russtaylor](https://github.com/russtaylor))
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
- Xuqian ([@zxuqian](https://github.com/zxuqian))

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

## 2.0.0-alpha.58 (2020-06-18)

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

## 2.0.0-alpha.57 (2020-06-18)

Bad release, check ## 2.0.0-alpha.58

## 2.0.0-alpha.56 (2020-05-28)

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

## 2.0.0-alpha.55 (2020-05-19)

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
  - [#2693](https://github.com/facebook/docusaurus/pull/2693) fix(v2): add support ES Module to lqip-loader ([@ykzts](https://github.com/ykzts))
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

## 2.0.0-alpha.54 (2020-04-28)

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

## 2.0.0-alpha.53 (2020-04-27)

**HOTFIX for 2.0.0-alpha.51**.

#### :bug: Bug Fix

- `docusaurus-theme-classic`
  - [#2676](https://github.com/facebook/docusaurus/pull/2676) fix(v2): allow build website without custom css ([@lex111](https://github.com/lex111))

#### Committers: 1

- Alexey Pyltsyn ([@lex111](https://github.com/lex111))

## 2.0.0-alpha.51 (2020-04-27)

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
  - [#2221](https://github.com/facebook/docusaurus/pull/2221) feat(v2): allow for TypeScript pages and components ([@jonathanrdelgado](https://github.com/jonathanrdelgado))

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

## 2.0.0-alpha.39 (2019-12-07)

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

## 2.0.0-alpha.38 (2019-12-06)

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

## 2.0.0-alpha.37 (2019-12-01)

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

## 2.0.0-alpha.36 (2019-11-22)

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

## 2.0.0-alpha.35 (2019-11-17)

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

## 2.0.0-alpha.34 (2019-11-11)

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

## 2.0.0-alpha.33 (2019-11-08)

#### Features

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

#### Fixes

- Fix babel/env not picking the correct browserslist configuration during development. When running `docusaurus start`, `process.env.NODE_ENV` is now consistently set to `development`.
- Ensure routes config generation to be more consistent in ordering. Nested routes should be placed last in routes.js. This will allow user to create `src/pages/docs.js` to create custom docs page for `/docs` or even `src/pages/docs/super.js` to create page for `/docs/super/`;
- Fix watcher does not trigger reload on windows.
- Fix build compilation error if exists only one code tab.
- Add minor padding to docs container so that hash-link won't be cut off.

#### Others

- Misc dependency upgrades.
- Stability improvement (more tests) & refactoring on docs plugin to prevent regression.

## 2.0.0-alpha.32 (2019-11-04)

#### Features

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

#### Bug Fixes

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

#### Performance Improvement

- Reduce memory usage consumption. ([#1900](https://github.com/facebook/Docusaurus/issues/1900))
- Significantly reduce main bundle size and initial HTML payload on production build. Generated files from webpack is also shorter in name. ([#1898](https://github.com/facebook/Docusaurus/issues/1898))
- Simplify blog metadata. Previously, accessing `/blog/post-xxx` will request for next and prev blog post metadata too aside from target post metadata. We should only request target post metadata. ([#1908](https://github.com/facebook/Docusaurus/issues/1908))

#### Others

- Convert sitemap plugin to TypeScript. ([#1894](https://github.com/facebook/Docusaurus/issues/1894))
- Refactor dark mode toggle into a hook. ([#1899](https://github.com/facebook/Docusaurus/issues/1899))

## 2.0.0-alpha.31 (2019-10-26)

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

## 2.0.0-alpha.30 (2019-10-22)

- Fix babel transpilation include/exclude logic to be more efficient. This also fix a very weird bug `TypeError: Cannot assign to read only property 'exports' of object '#<Object>'`.([#1868](https://github.com/facebook/docusaurus/pull/1868))

If you are still encountering the error. Please check whether you use `module.exports` for your `.js` file instead of doing `export` (mixing CJS and ES). See https://github.com/webpack/webpack/issues/4039#issuecomment-477779322 and https://github.com/webpack/webpack/issues/4039#issuecomment-273804003 for more context.

## 2.0.0-alpha.29 (2019-10-21)

**HOTFIX for 2.0.0-alpha.28**.

- Fix missing `core-js` dependencies on `@docusaurus/core`.
- Fix wrong `@babel/env` preset configuration that causes build compilation error.
- New UI for webpack compilation progress bar.

## 2.0.0-alpha.28 (2019-10-21)

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

## 2.0.0-alpha.27 (2019-10-14)

- Add `@theme/Tabs` which can be used to implement multi-language code tabs.
- Implement `custom_edit_url` and `hide_title` markdown header for docusaurus v1 feature parity.
- Reduce memory usage and slightly faster production build.
- Misc dependency upgrades.

## 2.0.0-alpha.26 (2019-10-12)

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

## 2.0.0-alpha.25 (2019-10-01)

- Blog plugin is rewritten in TypeScript and can now support CJK
- Upgrade key direct dependencies such as webpack, mdx and babel to latest
- Do not escape html and body attributes
- For devices with very small viewport width, the searchbar is replaced with a search icon. On tap of the search icon the searchbar is expanded and the text beside the logo is hidden and remains hidden while the search bar is expanded.
- Add `date` frontMatter support for blog plugin
- Add `truncateMarker` option to blog plugin, support string or regex.
- Webpack `optimization.removeAvailableModules` is now disabled for performance gain. See https://github.com/webpack/webpack/releases/tag/v4.38.0 for more context.

## 2.0.0-alpha.24 (2019-07-24)

- Remove unused metadata for pages. This minimize number of http request & smaller bundle size.
- Upgrade dependencies of css-loader from 2.x to 3.x. CSS modules localIdentName hash now only use the last 4 characters instead of 8.
- Fix broken markdown linking replacement for mdx files
- Fix potential security vulnerability because we're exposing the directory structure of the host machine. Instead of absolute path, we use relative path from site directory. Resulting in shorter webpack chunk naming and smaller bundle size.
- Use contenthash instead of chunkhash for better long term caching
- Allow user to customize generated heading from MDX. Swizzle `@theme/Heading`

## 2.0.0-alpha.23 (2019-07-21)

- Fix docusaurus route config generation for certain edge case

## 2.0.0-alpha.22 (2019-07-20)

- Add missing dependencies on `@docusaurus/preset-classic`
- New plugin `@docusaurus/plugin-ideal-image` to generate an almost ideal image (responsive, lazy-loading, and low quality placeholder)
- Better Twitter/discord image preview. Previously the size is too zoomed
- Allow prism syntax highlighting theme customization. Refer to https://docusaurus.io/docs/markdown-features#syntax-highlighting
- CSS is now autoprefixed using postcss
- Faster, lighter webpack bundle size
- `@docusaurus/theme-live-codeblock` is now much smaller in size and no longer only load on viewport
- Blog markdown files now support using the id field to specify the path

## 2.0.0-alpha.21 (2019-07-14)

- Fix babel-loader not transpiling docusaurus package

## 2.0.0-alpha.20 (2019-07-14)

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

## 2.0.0-alpha.19 (2019-06-07)

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

## V2 Changelog (2019-04-10)

### `siteConfig.js` changes

- `siteConfig.js` renamed to `docusaurus.config.js`.
- Remove the following config options:
  - `docsUrl`. Use the plugin option on `docusaurus-plugin-content-docs` instead.
  - `customDocsPath`. Use the plugin option on `docusaurus-plugin-content-docs` instead.
  - `sidebars.json` now has to be explicitly loaded by users and passed into the plugin option on `docusaurus-plugin-content-docs`.
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

### Migration Guide

_Work in Progress_

### Presets

- Add presets for plugins that follow the [Babel preset convention](https://babeljs.io/docs/en/presets).
