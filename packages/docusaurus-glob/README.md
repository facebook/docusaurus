# `@docusaurus/glob`

File globbing, glob matching and file watching utilities for Docusaurus packages.

This package is mostly designed for internal usage and is undocumented. Its APIs should remain mostly retro-compatible within a major version.

## `watch()` path patterns

The `watch()` function is currently implemented with Chokidar v3, which supports glob patterns. Chokidar v4+ removed glob support, so we must make sure the path patterns below keep working as expected (or provide clear upgrade instructions).

All these patterns are covered by FS watch tests in [`watchUtils.test.ts`](./src/__tests__/watchUtils.test.ts).

### How Docusaurus core calls `watch()`

In `docusaurus start` ([`watcher.ts`](../docusaurus/src/commands/start/watcher.ts)), one watcher is created for the site and one for each plugin, with these options:

- `cwd: siteDir`: event paths are relative to `siteDir`
- `ignoreInitial: true`
- `usePolling` and `interval`: from the `--poll [interval]` CLI option

Plugin paths returned by `getPathsToWatch()` are normalized before being passed to `watch()`:

- empty values are filtered out
- absolute paths are made relative to `siteDir` (`/site/docs/**/*.md` → `docs/**/*.md`, `/other/file.yml` → `../other/file.yml`)
- paths are converted to POSIX separators (`docs\**\*.md` → `docs/**/*.md`)
- negated patterns are not absolute paths, so they are kept as is (`!/site/**/_*.md`)

Docusaurus reloads the site (or plugin) on any watcher event. Which event is emitted matters less than whether one is emitted.

### Docusaurus core patterns

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

### Ecosystem patterns

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
| `docusaurus-plugin-structurizr` | `<dir>/**/*.dsl`, `!<siteDir>/**/include.*.dsl` | Absolute globs, negated absolute glob |
| `docusaurus-plugin-moonwave` | `<codePath>/**/*.{lua,luau}` | Relative or absolute glob, often outside `siteDir` |
| `docusaurus-plugin-copy` | `<contentPath>/<include>`, `include` defaults to `**/*.{png,jpg,jpeg,svg}` | Glob |
| `@cbnventures/docusaurus-preset-nova` | `<pkgDir>/blocks`, `<pkgDir>/lib`, `<siteDir>/{docs,blog,src}/**/*.{md,mdx,ts,tsx,js,jsx}` | Absolute directories, absolute globs |
| `docusaurus-plugin-asyncapi` | `path.resolve(spec)` | Absolute file |

Other notable usages:

- `@octanejs/docusaurus` consumes `getPathsToWatch()` return values and passes them to Vite's `addWatchFile()`
- `@joshcena/docusaurus-plugin-utils` uses its own `chokidar@^3.5.2` dependency directly (plugin authors dev CLI), so it is not affected by our upgrade

### Pattern kinds and Chokidar v3 behaviors

| Pattern kind | Example | Chokidar v3 behavior |
| --- | --- | --- |
| Absolute file | `/abs/site/docusaurus.config.js` | ✅ |
| Relative file | `sidebars.json` | ✅ |
| Missing file, existing parent dir | `docs/tags.yml` | ✅ Creation detected |
| Missing file, missing parent dir | `blog/authors.yml` | ⚠️ Creation only detected with macOS FSEvents |
| File outside `siteDir` | `../api/openapi.yaml` | ✅ |
| File in `node_modules` | `node_modules/pkg/theme/SearchPage/index.js` | ✅ |
| Directory (absolute or relative) | `/abs/site/i18n`, `api` | ✅ Watched recursively, emits `addDir`/`unlinkDir` |
| Missing directory, existing parent dir | `/abs/site/i18n` | ✅ Creation detected |
| Glob with `**`, `*` and braces | `docs/**/*.{md,mdx}`, `docs/*.md` | ✅ |
| Glob with extglobs and char classes | `docs/**/@(foo\|bar).md`, `docs/**/[0-9]*.md` | ✅ |
| Glob matching dotfiles and `_` files | `docs/**/*.md` matches `docs/.dotfile.md`, `docs/_partial.md` | ✅ |
| Absolute glob | `/abs/site/docs/**/*.{md,mdx}` | ✅ |
| Glob outside `siteDir` | `../docs/**/*.{md,mdx}` | ✅ |
| Glob with missing base dir | `i18n/fr/docusaurus-plugin-content-docs/current/**/*.{md,mdx}` | ⚠️ Creation only detected with macOS FSEvents |
| Negated relative glob | `!docs/**/_*.md` | ✅ Ignored |
| Negated absolute glob | `!/abs/site/**/include.*.dsl` | ❌ Not ignored when using the `cwd` option (always the case in core) |
| Overlapping patterns | `docs/**/*.md`, `docs/**/*.{md,mdx}`, `docs` | ✅ |

Chokidar v3 uses macOS FSEvents by default. Chokidar v4+ removed FSEvents, so macOS behaves like Linux and Windows, and like polling mode (`--poll`) on all platforms.
