# `@docusaurus/plugin-llms-txt`

A Docusaurus plugin that automatically generates an `llms.txt` file for your documentation site. The `llms.txt` standard helps AI assistants and Language Learning Models better understand and navigate your site's content.

## What is llms.txt?

`llms.txt` is a simple text file that provides context about your website's content structure and key pages. It helps AI tools understand your site's organization and purpose, making it easier for users to get relevant information through AI assistants.

## Installation

```bash
npm install @docusaurus/plugin-llms-txt
```

Or if you prefer Yarn:

```bash
yarn add @docusaurus/plugin-llms-txt
```

## Usage

Add the plugin to your `docusaurus.config.js`:

```js
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-llms-txt',
      {
        // Plugin options (see below)
      },
    ],
  ],
};
```

## Configuration

All options are optional and have sensible defaults:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `filename` | `string` | `'llms.txt'` | The filename for the generated file |
| `siteTitle` | `string` | `siteConfig.title` | The title to include in the llms.txt file |
| `siteDescription` | `string` | `siteConfig.tagline` | The description to include in the llms.txt file |
| `includeBlog` | `boolean` | `true` | Include blog posts in the file |
| `includeDocs` | `boolean` | `true` | Include documentation pages in the file |
| `includePages` | `boolean` | `true` | Include static pages in the file |
| `maxDepth` | `number` | `3` | Maximum depth of content hierarchy to include |
| `excludeRoutes` | `string[]` | `[]` | Route patterns to exclude from the file |
| `customContent` | `string` | `undefined` | Additional custom content to include |
| `includeFullContent` | `boolean` | `false` | Include page content excerpts (experimental) |

### Example Configuration

```js
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-llms-txt',
      {
        filename: 'llms.txt',
        siteTitle: 'My Awesome Documentation',
        siteDescription:
          'Comprehensive guides and API documentation for developers',
        includeBlog: true,
        includeDocs: true,
        includePages: false,
        maxDepth: 2,
        excludeRoutes: ['/admin', '/internal'],
        customContent: `
## Additional Information

This documentation is maintained by our team and updated regularly.
For questions or contributions, please visit our GitHub repository.
        `,
      },
    ],
  ],
};
```

## Generated File Format

The plugin generates a structured text file with the following format:

```
# Site Title

Site description here

Site URL: https://yoursite.com
Last updated: 2024-01-15

## Content

### Documentation
- [Getting Started](https://yoursite.com/docs/getting-started)
- [API Reference](https://yoursite.com/docs/api)

### Blog Posts
- [New Features in v2.0](https://yoursite.com/blog/v2-features)
- [Best Practices Guide](https://yoursite.com/blog/best-practices)

### Pages
- [About Us](https://yoursite.com/about)
- [Contact](https://yoursite.com/contact)
```

## Features

- **Automatic Generation**: The file is generated during the build process
- **Smart Filtering**: Automatically excludes utility routes and error pages
- **Hierarchical Organization**: Content is organized by type (docs, blog, pages)
- **Configurable**: Extensive options to customize what content is included
- **Multi-language Support**: Works with Docusaurus internationalization
- **Hash Router Compatible**: Gracefully disables for hash router configurations

## Limitations

- **Hash Router**: This plugin is disabled when using hash router since static files cannot be generated
- **Dynamic Content**: Only static routes are included; dynamically generated content is not captured
- **Content Extraction**: Full content extraction is experimental and may not work for all page types

## TypeScript Support

This plugin is written in TypeScript and includes full type definitions. If you're using TypeScript in your Docusaurus configuration, you'll get full IntelliSense support for the plugin options.

## Contributing

This plugin is part of the Docusaurus monorepo. Please see the [contributing guidelines](https://github.com/facebook/docusaurus/blob/main/CONTRIBUTING.md) for more information.

## License

MIT
