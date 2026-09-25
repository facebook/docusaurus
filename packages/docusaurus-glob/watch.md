# `watch()` path patterns

The `watch()` function is currently implemented with Chokidar v3, which supports glob patterns. Chokidar v4+ removed glob support, so we must make sure the path patterns below keep working as expected (or provide clear upgrade instructions).

All these patterns are covered by file system tests in [`watchUtils.test.ts`](./src/__tests__/watchUtils.test.ts).

## How Docusaurus core calls `watch()`

`watch()` always ignores existing files: it only emits events for changes happening after the watcher is created (Chokidar's `ignoreInitial: true` is hardcoded).

In `docusaurus start` ([`watcher.ts`](../docusaurus/src/commands/start/watcher.ts)), one watcher is created for the site and one for each plugin, with these options:

- `cwd: siteDir`: event paths are relative to `siteDir`
- `usePolling` and `interval`: from the `--poll [interval]` CLI option

Plugin paths returned by `getPathsToWatch()` are normalized before being passed to `watch()`:

- empty values are filtered out
- absolute paths are made relative to `siteDir` (`/site/docs/**/*.md` → `docs/**/*.md`, `/other/file.yml` → `../other/file.yml`)
- paths are converted to POSIX separators (`docs\**\*.md` → `docs/**/*.md`)
- negated patterns are not absolute paths, so they are kept as is (`!/site/**/_*.md`)

Docusaurus reloads the site (or plugin) on any watcher event. Which event is emitted matters less than whether one is emitted.

## Docusaurus core patterns

| Source | Example pattern received by `watch()` | Kind |
| --- | --- | --- |
| Site: `siteConfigPath` | `/abs/site/docusaurus.config.js` | Absolute file |
| Site: `localizationDir` | `/abs/site/i18n` | Absolute directory, often missing |
| Docs: `sidebarPath` | `sidebars.js` | Relative file |
| Docs: versioned sidebars | `versioned_sidebars/version-1.0.0-sidebars.json` | Relative file |
| Docs: `include` | `docs/**/*.{md,mdx}` | Glob |
| Docs: `include` (versioned) | `versioned_docs/version-1.0.0/**/*.{md,mdx}` | Glob |
| Docs: `include` (localized) | `i18n/fr/docusaurus-plugin-content-docs/current/**/*.{md,mdx}` | Glob, base dir often missing |
| Docs: `tags` | `docs/tags.yml`, `i18n/fr/docusaurus-plugin-content-docs/current/tags.yml` | Relative file, often missing |
| Docs: category metadata | `docs/**/_category_.{json,yml,yaml}` | Glob |
| Blog: `authorsMapPath` | `blog/authors.yml`, `i18n/fr/docusaurus-plugin-content-blog/authors.yml` | Relative file (only if it exists) |
| Blog: `tags` | `blog/tags.yml` | Relative file, often missing |
| Blog: `include` | `blog/**/*.{md,mdx}`, `i18n/fr/docusaurus-plugin-content-blog/**/*.{md,mdx}` | Glob |
| Pages: `include` | `src/pages/**/*.{js,jsx,ts,tsx,md,mdx}` | Glob |

Users can customize some of these patterns:

- the content plugins `path` option can point outside the site: `../docs/**/*.{md,mdx}`
- the content plugins `include` option accepts any glob: `**/*.md`, `*.md`, `**/index.md`, `**/[0-9]*.md`, `**/@(foo|bar).md`...
- the content plugins `exclude` option is **not** applied to watched paths: `_partial.md` and `.dotfile.md` files are watched

## Ecosystem patterns

We checked the top 50 npm packages related to Docusaurus (by monthly downloads, September 2026, excluding `@docusaurus/*` packages).

None of them depend on Chokidar directly. These implement `getPathsToWatch()`:

| Package | `getPathsToWatch()` return value | Kind |
| --- | --- | --- |
| `@easyops-cn/docusaurus-search-local` (#1) | `<pkgDir>/dist/client/theme/SearchPage/index.js` | Absolute file, in `node_modules` |
| `docusaurus-plugin-redoc` (#8) / `redocusaurus` (#7) | `path.resolve(spec)`, Redocly config file, spec file dependencies | Absolute files |
| `docusaurus-plugin-openapi` (#33) / `docusaurus-preset-openapi` (#40) | `path.resolve(siteDir, options.path)` (`[]` for URLs) | Absolute file or directory |

Packages ranked #51 to #150 that implement `getPathsToWatch()` or use Chokidar:

| Package | `getPathsToWatch()` return value | Kind |
| --- | --- | --- |
| `@aldridged/docusaurus-plugin-lunr` | `<docsDir>/**/*.{md,mdx}`, `<versionedDir>/<version>/**/*.{md,mdx}` | Absolute globs |
| `docusaurus-plugin-glossary` | `<siteDir>/glossary/glossary.json` | Absolute file |
| `docusaurus-plugin-search-local`, `@yang1666204/docusaurus-search-local` | Same as `@easyops-cn/docusaurus-search-local` (forks) | Absolute file, in `node_modules` |
| `@apify/docusaurus-plugin-typedoc-api` | `__dirname` (only if `TYPEDOC_PLUGIN_DEV` is set) | Absolute directory |
| `@supersuit/docusaurus-preset-wiki` | `path.join(docsDir, '**/*.md')`, `path.join(docsDir, '**/*.mdx')` | Absolute globs, with `\` on Windows |
| `@vantagecompute/docusaurus-theme` | `<pkgDir>/src/theme/**/*.{js,jsx,ts,tsx,css}` | Absolute glob, outside `siteDir` |
| `@docusaurus-plugin-ai/core` | `<siteDir>/docs` | Absolute directory |
| `docusaurus-plugin-structurizr` | `<dir>/**/*.dsl`, `!<siteDir>/**/include.*.dsl` | Absolute globs, negated absolute glob (does not work, see below) |
| `docusaurus-plugin-moonwave` | `<codePath>/**/*.{lua,luau}` | Relative or absolute glob, often outside `siteDir` |
| `docusaurus-plugin-copy` | `<contentPath>/<include>`, `include` defaults to `**/*.{png,jpg,jpeg,svg}` | Glob |
| `@cbnventures/docusaurus-preset-nova` | `<pkgDir>/blocks`, `<pkgDir>/lib`, `<siteDir>/{docs,blog,src}/**/*.{md,mdx,ts,tsx,js,jsx}` | Absolute directories, absolute globs |
| `docusaurus-plugin-asyncapi` | `path.resolve(spec)` | Absolute file |

Other notable usages:

- `@octanejs/docusaurus` consumes `getPathsToWatch()` return values and passes them to Vite's `addWatchFile()`
- `@joshcena/docusaurus-plugin-utils` uses its own `chokidar@^3.5.2` dependency directly (plugin authors dev CLI), so it is not affected by our upgrade

## Chokidar v3 behaviors

Chokidar v3 uses macOS FSEvents by default. On Linux and Windows, and with `--poll` on all platforms, it uses Node.js `fs.watch()` or `fs.watchFile()` instead. Chokidar v4+ removed FSEvents, so macOS will behave like the other platforms.

Legend:

- ✅ Works on all platforms, with and without polling
- ⚠️ Inconsistent: works on some platforms only, see details
- ❌ Does not work on any platform

Test names are relative to the `watch()` test suite, which runs each test with and without polling.

| Pattern kind | Example | Chokidar v3 behavior | Tests |
| --- | --- | --- | --- |
| Absolute file | `/abs/site/docusaurus.config.js` | ✅ Change, atomic change (editors), remove, rename | `file paths > absolute paths` |
| Relative file | `docs/tags.yml` | ✅ Change, atomic change (editors), remove, rename | `file paths > relative paths` |
| Missing file, existing parent dir | `docs/tags.yml` | ✅ Creation detected | `watches missing file` |
| Missing file, missing parent dir | `blog/authors.yml` | ⚠️ Creation only detected with FSEvents | `watches missing file in missing dir` |
| File, parent dir removed and re-created | `docs/tags.yml` | ⚠️ Re-creation only detected with FSEvents | `watches file - remove parent dir` |
| File removed and re-created, watcher with multiple paths | `[docusaurus.config.js, i18n]`, `[sidebars.js, docs/**/*.md]` | ⚠️ Re-creation only detected with FSEvents (works with a single path, and for files matched by globs) | `multiple paths > watches site paths - re-create file`, `multiple paths > watches file and glob paths - re-create file` |
| File outside `siteDir` | `../api/openapi.yaml` | ✅ | `watches file outside siteDir` |
| File in `node_modules` | `node_modules/pkg/theme/SearchPage/index.js` | ✅ | `watches file in node_modules` |
| Directory | `/abs/site/i18n`, `api` | ✅ Watched recursively, emits `addDir`/`unlinkDir`, including renames and moves | `directory paths` |
| Missing directory, existing parent dir | `/abs/site/i18n` | ✅ Creation detected | `watches missing dir` |
| Directory removed and re-created | `/abs/site/i18n` | ⚠️ Re-creation only detected with FSEvents | `watches dir - remove and re-create` |
| Glob with `**`, `*` and braces | `docs/**/*.{md,mdx}`, `docs/*.md` | ✅ Add, change, atomic change, remove, rename | `glob patterns > relative globs` |
| Glob with extglobs and char classes | `docs/**/@(foo\|bar).md`, `docs/**/[0-9]*.md` | ✅ | `watches other "include" glob syntaxes` |
| Glob matching dotfiles and `_` files | `docs/**/*.md` matches `docs/.dotfile.md`, `docs/_partial.md` | ✅ | `watches docs/**/*.{md,mdx} - add` |
| Glob, renamed or moved dirs | `docs/sub` → `docs/sub2` | ⚠️ Not reported by FSEvents | `watches docs/**/*.{md,mdx} - rename dirs` |
| Glob, removed dirs | `docs/sub` | ⚠️ `unlinkDir` not emitted by FSEvents | `watches docs/**/*.{md,mdx} - remove` |
| Glob, base dir removed and re-created | `docs` | ⚠️ Removal not always reported by FSEvents, re-creation detected everywhere | `watches docs/**/*.{md,mdx} - remove base dir` |
| Glob with missing base dir | `i18n/fr/docusaurus-plugin-content-docs/current/**/*.{md,mdx}` | ⚠️ Creation only detected with FSEvents | `watches glob with missing base dir` |
| Absolute glob | `/abs/site/docs/**/*.{md,mdx}` | ✅ | `glob patterns > absolute globs` |
| Glob outside `siteDir` | `../docs/**/*.{md,mdx}` | ✅ Same as relative globs | `glob patterns > globs outside siteDir` |
| Negated relative glob | `!docs/**/_*.md` | ✅ Matching files are ignored | `ignores negated relative globs` |
| Negated absolute glob, without `cwd` | `!/abs/site/**/include.*.dsl` | ✅ Matching files are ignored | `ignores negated absolute globs without cwd` |
| Negated absolute glob, with `cwd` | `!/abs/site/**/include.*.dsl` | ❌ Has no effect: matching files still emit events. Chokidar resolves it against `cwd`, and core always passes `cwd` | `does not ignore negated absolute globs with cwd` |
| Overlapping paths | `docs/**/*.md`, `docs/**/*.{md,mdx}`, `docs` | ✅ | `multiple paths > watches overlapping paths` |
