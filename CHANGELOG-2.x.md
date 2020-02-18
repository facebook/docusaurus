# Docusaurus 2 Changelog

## 2.0.0-alpha.42 (2020-02-18)

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
