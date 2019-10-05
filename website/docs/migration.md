---
id: migration
title: Migration
---

Refer users to this document when upgrading to Docusaurus 2. This migration guide is targeted to Docusaurus user with translation and/or versioning feature disabled and assumes following structure.

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

## Step 1 - Updating package.json

In previous version, we only have two packages `docusaurus` and `docusaurus-init`. However, with the introduction of pluggable architecture in Docusaurus 2, we expect that community will start to publish their own docusaurus plugin package. What is an "official" package and what is a user/community package ? We can get issue reports of people using misnamed or unofficial packages because they assumed it was part of Docusaurus. Hence, we decided to use scoped package from now on.

Examples of the scoped name change:
- docusaurus -> @docusaurus/core
- docusaurus-init -> @docusaurus/init

Also, CLI commands should be using `docusaurus <command>` (instead of `docusaurus-command`) which is more conventional (see Yarn and Git). 

To upgrade to v2, modify your `website/package.json` into this

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
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

## Step 2 - Migrating siteConfig

First of all, rename `siteConfig.js` to `docusaurus.config.js`.Then, add this line first to your siteConfig object.

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

Refer to migration guide below for each field

#### `baseUrl` `tagline` `title` `url` `favicon` `organizationName` `projectName` `githubHost`
No action needed

#### `colors`
Deprecated. Override docusaurus CSS variable instead by creating your own CSS files (e.g. /src/css/custom.css) and import them globally by passing it as an option into the preset.

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

#### `footerIcon` `copyright`

```jsx
// docusaurus.config.js
themeConfig: {
  footer: {
    logo: {
      alt: 'Facebook Open Source Logo',
      src: 'https://docusaurus.io/img/oss_logo.png',
    },
    copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`,
  },
}
```

#### `ogImage` `twitterImage`

```jsx
// docusaurus.config.js
themeConfig: {
  image: 'img/docusaurus.png',
}
```


#### `headerIcon` `headerLinks`

Previously:

```js
headerIcon: 'img/docusaurus.svg',
headerLinks: [
  { doc: "doc1", label: "Getting Started" },
  { page: "help", label: "Help" },
  { href: "https://github.com/", label: "GitHub" },
  { blog: true, label: "Blog" },
],
```

The syntax is now:

```jsx
// docusaurus.config.js
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
}
```

#### `algolia`

```jsx
// docusaurus.config.js
themeConfig: {
  algolia: {
    apiKey: '47ecd3b21be71c5822571b9f59e52544',
    indexName: 'docusaurus-2',
    algoliaOptions: {},
  },
}
```

#### `blogSidebarCount`

Deprecated. Pass it as blog option to `@docusaurus/preset-classic` instead.

```jsx
// docusaurus.config.js
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
```

#### `cname`
Deprecated. Create a `CNAME` file in your `static` folder instead.

#### `customDocsPath` `docsUrl`
Deprecated. Pass it as an option to `@docusaurus/preset-classic` docs instead. 

```jsx
// docusaurus.config.js
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
```

#### `cleanUrl` `defaultVersionShown` `disableHeaderTitle` `disableTitleTagline` `docsSideNavCollapsible` `facebookAppId` `facebookComments` `facebookPixelId` `fonts` `separateCss` `scrollToTop` `scrollToTopOptions` `manifest` `noIndex` `translationRecruitingLink` `twitter` `twitterUsername` `useEnglishUrl` `users` `usePrism` `wrapPagesHTML` `onPageNav` `blogSidebarTitle`
Deprecated

#### `enableUpdateBy` `editUrl` `enableUpdateTime`

Deprecated. In the future maybe available as a plugin.

#### `gaTrackingId`

```jsx
// docusaurus.config.js
module.exports = {
  themeConfig: {
    googleAnalytics: {
      trackingID: 'UA-141789564-1',
    },
  }
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
  }
};
```

#### `highlight`
Deprecated. We now use prismjs instead of highlight.js.

#### `markdownOptions` `markdownPlugins`
Deprecated because we use MDX in v2 instead of Remarkable that has different plugin and option.

#### `scripts` `stylesheets`
Not implemented yet

## Step 3. Delete footer file

`website/core/Footer.js` is no longer needed. If you want to modify the default footer provided by docusaurus, swizzle it

```bash
yarn swizzle @docusaurus/theme-classic Footer
```

This will copy the current `<Footer />` component used by the theme to a `src/theme/Footer `directory under the root of your site, which is where Docusaurus will look for swizzled components.

## Step 4. Update your pages file

Please refer to [creating pages](creating-pages.md) to learn how Docusaurus 2 pages work. After reading that, you can notice that we have to move `pages/en` files in v1 to `src/pages` instead.

`CompLibrary` is deprecated in v2, so you have to write your own React component.

## Step 5. Modify .gitignore

Create `.gitignore` in your `website`
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

## Step 6. Test your site

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