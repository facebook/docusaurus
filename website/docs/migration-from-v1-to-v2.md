---
id: migration-from-v1-to-v2
title: Migration from v1 to v2
---

This doc guides you through migrating an existing Docusaurus 1 site to Docusaurus 2.

**Note: This migration guide is targeted at Docusaurus users without translation and/or versioning features and assumes the following structure:**

```sh
├── docs
└── website
    ├── blog
    ├── core
    │   └── Footer.js
    ├── package.json
    ├── pages
    ├── sidebars.json
    ├── siteConfig.js
    └── static
```

## Step 1 - Update `package.json`

### Scoped package names

In Docusaurus 2, we use scoped package names:

- `docusaurus` -> `@docusaurus/core`

This provides a clear distinction between Docusaurus' official packages and community maintained packages. In another words, all Docusaurus' official packages are namespaced under `@docusaurus/`.

Meanwhile, the default doc site functionalities provided by Docusaurus 1 are now provided by `@docusaurus/preset-classic`. Therefore, we need to add this dependency as well:

```diff
// package.json
{
  dependencies: {
-    "docusaurus": "^1.x.x",
+    "@docusaurus/core": "^2.0.0-alpha.26",
+    "@docusaurus/preset-classic": "^2.0.0-alpha.26",
  }
}
```

### CLI commands

Meanwhile, CLI commands are renamed to `docusaurus <command>` (instead of `docusaurus-command`).

The `"scripts"` section of your `package.json` should be updated as follows:

```json
{
  "scripts": {
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy"
  }
}
```

A typical Docusaurus 2 `package.json` may look like this:

```json
{
  "scripts": {
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy"
  },
  "dependencies": {
    "@docusaurus/core": "^2.0.0-alpha.26",
    "@docusaurus/preset-classic": "^2.0.0-alpha.26",
    "classnames": "^2.2.6",
    "react": "^16.10.2",
    "react-dom": "^16.10.2"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

## Step 2 - Migrate `siteConfig` to `docusaurus.config.js`

Rename `siteConfig.js` to `docusaurus.config.js`. In Docusaurus 2, we split each functionality (blog, docs, pages) into plugins for modularity. Presets are bundles of plugins and for backward compatibility we built a `@docusaurus/preset-classic` preset which bundles most of the essential plugins present in Docusaurus 1.

Add the following preset configuration to your `docusaurus.config.js`.

```jsx
// docusaurus.config.js
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // docs folder path relative to site dir.
          path: '../docs',
          // sidebars file relative to site dir.
          sidebarPath: require.resolve('./sidebars.json'),
        },
        ...
      },
    ],
  ],
};
```

Refer to migration guide below for each field in `siteConfig.js`.

#### `baseUrl`, `tagline`, `title`, `url`, `favicon`, `organizationName`, `projectName`, `githubHost`, `scripts`, `stylesheets`

No actions needed.

#### `colors`

Deprecated. We wrote a custom CSS framework for Docusaurus 2 called Infima which uses CSS variables for theming. The docs are not quite ready yet and we will update here when it is. To overwrite Infima' CSS variables, create your own CSS file (e.g. `./src/css/custom.css`) and import it globally by passing it as an option to `@docusaurus/preset-classic`:

```diff
// docusaurus.config.js
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
+       theme: {
+         customCss: require.resolve('./src/css/custom.css'),
+       },
      },
    ],
  ],
};
```

Infima uses 7 shades of each color. We recommend using [ColorBox](https://www.colorbox.io/) to find the different shades of colors for your chosen primary color.

```css
/**
 * /src/css/custom.css
 * You can override the default Infima variables here.
 * Note: this is not a complete list of --ifm- variables.
 */
:root {
  --ifm-color-primary: #25c2a0;
  --ifm-color-primary-dark: rgb(33, 175, 144);
  --ifm-color-primary-darker: rgb(31, 165, 136);
  --ifm-color-primary-darkest: rgb(26, 136, 112);
  --ifm-color-primary-light: rgb(70, 203, 174);
  --ifm-color-primary-lighter: rgb(102, 212, 189);
  --ifm-color-primary-lightest: rgb(146, 224, 208);
}
```

#### `footerIcon`, `copyright`, `ogImage`, `twitterImage`

Site meta info such as assets, SEO, copyright info are now handled by themes. To customize them, use the `themeConfig` field in your `docusaurus.config.js`:

```jsx
// docusaurus.config.js
module.exports = {
  themeConfig: {
    footer: {
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'https://docusaurus.io/img/oss_logo.png',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`,
    },
    image: 'img/docusaurus.png',
    ...
  },
};
```

#### `headerIcon`, `headerLinks`

In Docusaurus 1, header icon and header links were root fields in `siteConfig`:

```js
headerIcon: 'img/docusaurus.svg',
headerLinks: [
  { doc: "doc1", label: "Getting Started" },
  { page: "help", label: "Help" },
  { href: "https://github.com/", label: "GitHub" },
  { blog: true, label: "Blog" },
],
```

Now, these two fields are both handled by the theme:

```jsx
// docusaurus.config.js
module.exports = {
  themeConfig: {
    navbar: {
      title: 'Docusaurus',
      logo: {
        alt: 'Docusaurus Logo',
        src: 'img/docusaurus.svg',
      },
      links: [
        {to: 'docs/doc1', label: 'Getting Started', position: 'left'},
        {to: 'help', label: 'Help', position: 'left'},
        {
          href: 'https://github.com/',
          label: 'GitHub',
          position: 'right',
        },
        {to: 'blog', label: 'Blog', position: 'left'},
      ],
    },
    ...
  },
};
```

#### `algolia`

```jsx
// docusaurus.config.js
module.exports = {
  themeConfig: {
    algolia: {
      apiKey: '47ecd3b21be71c5822571b9f59e52544',
      indexName: 'docusaurus-2',
      algoliaOptions: { ... },
    },
    ...
  },
};
```

#### `blogSidebarCount`

Deprecated. Pass it as a blog option to `@docusaurus/preset-classic` instead:

```jsx
// docusaurus.config.js
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        blog: {
          postsPerPage: 10,
        },
        ...
      },
    ],
  ],
};
```

#### `cname`

Deprecated. Create a `CNAME` file in your `static` folder instead. Files in the `static` folder will be copied into the root of the `build` folder during execution of the build command.

#### `customDocsPath`, `docsUrl`, `editUrl`, `enableUpdateBy`, `enableUpdateTime`

Deprecated. Pass it as an option to `@docusaurus/preset-classic` docs instead:

```jsx
// docusaurus.config.js
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // Equivalent to `customDocsPath`.
          path: 'docs',
          // Equivalent to `editUrl`
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/docs/',
          // Equivalent to `docsUrl`.
          routeBasePath: 'docs',
          // Remark and Rehype plugins passed to MDX. Replaces `markdownOptions` and `markdownPlugins`.
          remarkPlugins: [],
          rehypePlugins: [],
          // Equivalent to `enableUpdateBy`.
          showLastUpdateAuthor: true,
          // Equivalent to `enableUpdateTime`.
          showLastUpdateTime: true,
        },
        ...
      },
    ],
  ],
};
```

#### `gaTrackingId`

```jsx
// docusaurus.config.js
module.exports = {
  themeConfig: {
    googleAnalytics: {
      trackingID: 'UA-141789564-1',
    },
  },
};
```

#### `gaGtag`

```jsx
// docusaurus.config.js
module.exports = {
  themeConfig: {
    gtag: {
      trackingID: 'UA-141789564-1',
    },
  },
};
```

### Removed fields

The following fields are all deprecated, you may remove from your configuration file.

- `blogSidebarTitle`
- `cleanUrl`
- `defaultVersionShown`
- `disableHeaderTitle`
- `disableTitleTagline`
- `docsSideNavCollapsible`
- `facebookAppId`
- `facebookComments`
- `facebookPixelId`
- `fonts`
- `highlight` - We now use [Prism](https://prismjs.com/) instead of [highlight.js](https://highlightjs.org/).
- `markdownOptions` - We use MDX in v2 instead of Remarkable. Your markdown options have to be converted to Remark/Rehype plugins.
- `markdownPlugins` - We use MDX in v2 instead of Remarkable. Your markdown plugins have to be converted to Remark/Rehype plugins.
- `separateCss` - It can imported in the same manner as `custom.css` mentioned above.
- `scrollToTop`
- `scrollToTopOptions`
- `manifest`
- `noIndex`
- `onPageNav`
- `translationRecruitingLink`
- `twitter`
- `twitterUsername`
- `useEnglishUrl`
- `users`
- `usePrism` - We now use [Prism](https://prismjs.com/) instead of [highlight.js](https://highlightjs.org/)
- `wrapPagesHTML`

We intend to implement many of the deprecated config fields as plugins in future. Help will be appreciated!

## Step 3 - Delete footer file

`website/core/Footer.js` is no longer needed. If you want to modify the default footer provided by docusaurus, [swizzle](using-themes.md#swizzling-theme-components) it:

```bash
yarn swizzle @docusaurus/theme-classic Footer
```

This will copy the current `<Footer />` component used by the theme to a `src/theme/Footer` directory under the root of your site, you may then edit this component for customization.

## Step 4 - Update your page files

Please refer to [creating pages](creating-pages.md) to learn how Docusaurus 2 pages work. After reading that, you can notice that we have to move `pages/en` files in v1 to `src/pages` instead.

`CompLibrary` is deprecated in v2, so you have to write your own React component or use Infima styles (Docs will be available soon, sorry about that! In the meanwhile, inspect the V2 website to see what styles are available).

## Step 5 - Modify `.gitignore`

The `.gitignore` in your `website` should contain:

```
# dependencies
/node_modules

# production
/build

# generated files
.docusaurus
.cache-loader

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

## Step 6 - Test your site

After migration, your folder structure should look like this:

```sh
my-project
├── docs
└── website
    ├── blog
    ├── src
    │   ├── css
    │   │   └── custom.css
    │   └── pages
    │       └── index.js
    ├── package.json
    ├── sidebars.json
    ├── .gitignore
    ├── docusaurus.config.js
    └── static
```

Start the development server and fix any errors

```bash
cd website
yarn start
```

## Step 7 - Configure your build directory

In Docusaurus 1, all the build artifacts are located within `website/build/<PROJECT_NAME>`. However, in Docusaurus 2, it is now moved to just `website/build`. Make sure that you update your deployment configuration to read the generated files from the correct `build` directory.
