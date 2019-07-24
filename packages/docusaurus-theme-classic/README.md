# Docusaurus Theme Classic

The classic theme for Docusaurus.

## Installation

Add `docusaurus/theme-classic` to your package:

```bash
npm i @docusaurus/theme-classic
# or
yarn add @docusaurus/theme-classic
```

Modify your `docusaurus.config.js`:

```diff
module.exports = {
  ...
+ themes: ['@docusaurus/theme-classic'],
  ...
}
```

## Swizzling components

```shell
$ npm swizzle @docusaurus/theme-classic [component name]
```

### List of theme components

- BlogListPage
- BlogListPaginator
- BlogPostItem
- BlogPostPage
- BlogPostPaginator
- BlogTagsListPage
- BlogTagsPostsPage
- CodeBlock
- DocLegacyItem
- DocLegacyPage
- DocLegacyPaginator
- DocLegacySidebar
- Footer
- Layout
- MDXComponents
- Navbar
- NotFound.js
- SearchBar.js
