---
id: migration
title: Migration
---

This doc guides you through migrating an existing Docusaurus 1 site to Docusaurus 2.

This migration guide is targeted to Docusaurus user with translation and/or versioning features disabled and assumes the following structure:

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

## Step 1 - Update package.json

### Scoped package names

In Docusaurus 2, we use scoped package names:

- `docusaurus` -> `@docusaurus/core`

This provides a clear distinction between Docusaurus' official packages and community maintained packages. In another words, all Docusaurus' official packages are namespaced under `@docusaurus/`.

Meanwhile, the default doc site functionalities provided by Docusaurus 1 is now provided by `@docusaurus/preset-classic`. Therefore, we need to add this dependency as well:

```diff
// package.json
{
  dependencies: {
-    "docusaurus": "^1.x.x",
+    "@docusaurus/core": "^2.0.0-alpha.25",
+    "@docusaurus/preset-classic": "^2.0.0-alpha.25",
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
    "@docusaurus/core": "^2.0.0-alpha.25",
    "@docusaurus/preset-classic": "^2.0.0-alpha.25",
    "classnames": "^2.2.6",
    "react": "^16.8.4",
    "react-dom": "^16.8.4"
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

Rename `siteConfig.js` to `docusaurus.config.js`. Then, add the preset configuration to your `docusaurus.config.js`'s default export:

```jsx
// docusaurus.config.js
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // docs folder path relative to site dir
          path: '../docs',
          // sidebars file relative to site dir
          sidebarPath: require.resolve('./sidebars.json'),
        },
      },
    ],
  ],
};
```

Refer to migration guide below for each field:

- `baseUrl`
- `tagline`
- `title`
- `url`
- `favico`
- `organizationName`
- `projectName`
- `githubHost`

No actions needed

- `colors`

Deprecated. To overwrite Docusaurus' CSS variables, create your own CSS file (e.g. /src/css/custom.css) and import it globally by passing it as an option in preset:

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

- `footerIcon`
- `copyright`
- `ogImage`
- `twitterImage`

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
  },
};
```

- `headerIcon`
- `headerLinks`

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

Now, these two fields are both handled by theme:

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
  },
};
```

- `algolia`

```jsx
// docusaurus.config.js
module.exports = {
  themeConfig: {
    algolia: {
      apiKey: '47ecd3b21be71c5822571b9f59e52544',
      indexName: 'docusaurus-2',
      algoliaOptions: {},
    },
  },
};
```

- `blogSidebarCount`

Deprecated. Pass it as blog option to `@docusaurus/preset-classic` instead:

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
      },
    ],
  ],
};
```

- `cname`

Deprecated. Create a `CNAME` file in your `static` folder instead.

- `customDocsPath` 
- `docsUrl`

Deprecated. Pass it as an option to `@docusaurus/preset-classic` docs instead:

```jsx
// docusaurus.config.js
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // equivalent to customDocsPath
          path: 'docs',
          // equivalent to docsUrl
          routeBasePath: 'docs',
          // Remark and Rehype plugins passed to MDX
          remarkPlugins: [],
          rehypePlugins: [],
        },
      },
    ],
  ],
};
```

- `gaTrackingId`

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

- `gaGtag`

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

### Deprecated fields that may be implemented using a plugin

- `enableUpdateBy`
- `editUrl`
- `enableUpdateTime`
- `scripts`
- `stylesheets`

### Removed fields

The following fields are all deprecated, you may remove from your configuration file.

- `highlight` - we now use prismjs instead of highlight.js
- `markdownOptions` - we use MDX in v2 instead of Remarkable that has different plugin and option
- `markdownPlugins` - we use MDX in v2 instead of Remarkable that has different plugin and option
- `cleanUrl`
- `defaultVersionShown`
- `disableHeaderTitle`
- `disableTitleTagline`
- `docsSideNavCollapsible`
- `facebookAppId`
- `facebookComments`
- `facebookPixelId`
- `fonts`
- `separateCss`
- `scrollToTop`
- `scrollToTopOptions`
- `manifest`
- `noIndex`
- `translationRecruitingLink`
- `twitter`
- `twitterUsername`
- `useEnglishUrl`
- `users`
- `usePrism`
- `wrapPagesHTML`
- `onPageNav`
- `blogSidebarTitle`

## Step 3 - Delete footer file

`website/core/Footer.js` is no longer needed. If you want to modify the default footer provided by docusaurus, swizzle it:

```bash
yarn swizzle @docusaurus/theme-classic Footer
```

This will copy the current `<Footer />` component used by the theme to a `src/theme/Footer`directory under the root of your site, you may then edit this component for customization.

## Step 4 - Update your page files

Please refer to [creating pages](creating-pages.md) to learn how Docusaurus 2 pages work. After reading that, you can notice that we have to move `pages/en` files in v1 to `src/pages` instead.

`CompLibrary` is deprecated in v2, so you have to write your own React component.

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

After migration, your folder structure should look like this

```sh
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

In previous version, all the build artifacts is located at `website/build/projectName`. However, in Docusaurus 2, it is now moved to just `website/build`. Make sure that you deploy from the correct build directory.
