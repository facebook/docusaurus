# Breaking Changes

### `siteConfig.js` changes

- `siteConfig.js` renamed to `docusaurus.config.js`.
- Removed the following config options:
  - `docsUrl`. Use the plugin option on `docusaurus-plugin-content-docs` instead.
  - `customDocsPath`. Use the plugin option on `docusaurus-plugin-content-docs` instead.
  - `sidebars.json` now has to be explicitly loaded by users and passed into the the plugin option on `docusaurus-plugin-content-docs`.
  - `headerLinks` doc, page, blog is deprecated. The syntax is now:

```js
headerLinks: [
  // Link to internal page (without baseUrl)
  { url: "help", label: "Help" },
  // Links to href destination/ external page
  { href: "https://github.com/", label: "GitHub" },
  // Determines search bar position among links
  { search: true },
  // Determines language drop down position among links
  { languages: true }
],
```

# Additions

### Presets

- Added presets for plugins that follow the [Babel preset convention](https://babeljs.io/docs/en/presets).
