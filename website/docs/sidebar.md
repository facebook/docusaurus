---
id: sidebar
title: Sidebar
---

To generate a sidebar to your Docusaurus site, you need to define a file that exports a JS module and pass that into the `@docusaurus/plugin-docs` plugin directly or via `@docusaurus/preset-classic`. If you are using the classic preset, you can find the `sidebars.js` under the root directory already created for you, so you may edit it directly for customization.

<!-- TODO: change classic template to use `sidebars.js` from json -->

```bash
website # root directory of your site
├── docs
│   └── greeting.md
├── docusaurus.config.js
├── sidebars.js
.
```

To add a doc to the sidebar, add the `id` specified in the frontmatter of the doc into its category.

```diff
module.exports = {
  docs: {
+   "Getting started": ["greeting"],
    "Docusaurus": ["doc1"],
    "First Category": ["doc2"],
    "Second Category": ["doc3"],
  }
};
```

The `docs` key in the exported object is just the name of that particular sidebar hierarchy, and can be renamed to something else. You can have multiple sidebars for different Markdown files by adding more top-level keys to the exported object.

## Subcategories

_This section is a work in progress. [Welcoming PRs](https://github.com/facebook/docusaurus/issues/1640)._

<!--

Note: We're implementing a new sidebar, this following links to the legacy sidebar as a reference
[source code](packages/docusaurus-theme-classic/src/theme/DocLegacySidebar/index.js)

If you are interested in this section, please follow up on our progress

-->
