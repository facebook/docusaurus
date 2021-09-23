# docusaurus-plugin-utils

A utility to build and pack docusaurus plugins, particularly useful for TypeScript plugin authors

## CLI

### `docusaurus-plugin build`

Builds your plugin and transpiles theme components to human-readable JS for swizzling.

Options:

- `--source-dir`: the source directory of your TypeScript plugin. Defaults to `src`.
- `--target-dir`: the target directory of transpilation output. Defaults to `lib`.
- `--theme-dir`: the directory of your theme components, relative to `sourceDir`. If not specified, the theme components would still be transpiled, but human-readable JS code for swizzling would not be produced.
- `--theme-target-dir`: the directory to output the human-readable JS components, relative to `targetDir`. Defaults to `js-theme`.

Usage:

```bash
yarn docusaurus-plugin build --theme-dir theme
```
