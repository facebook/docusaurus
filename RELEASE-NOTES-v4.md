# Docusaurus 4.0 release notes (unreleased)

These notes describe upcoming changes. They are kept separate from the dated changelog entries published on the website.

## Breaking Changes

- Admonitions now compile to `<Admonition title={...} type="...">` using standard MDX JSX nodes. Custom `@theme/MDXComponents` mappings must provide the `Admonition` key instead of `admonition`. Plugins inspecting admonition AST nodes must handle MDX JSX nodes instead of container directives or `mdxAdmonitionTitle` nodes. The documented Markdown syntax and `@theme/Admonition` props are unchanged; rich titles are now passed directly through `title`. The legacy `processAdmonitionProps` helper remains available for swizzled components.
