---
id: migrating-from-v1-to-v2
title: Migrating from v1 to v2
---

import ColorGenerator from '@site/src/components/ColorGenerator';

:::caution

This migration guide is targeted at Docusaurus users without translation and/or versioning features.

:::

This doc guides you through migrating an existing Docusaurus 1 site to Docusaurus 2. Your Docusaurus 1 site should have the following structure:

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

## Project setup

### `package.json`

#### Scoped package names

In Docusaurus 2, we use scoped package names:

- `docusaurus` -> `@docusaurus/core`

This provides a clear distinction between Docusaurus' official packages and community maintained packages. In another words, all Docusaurus' official packages are namespaced under `@docusaurus/`.

Meanwhile, the default doc site functionalities provided by Docusaurus 1 are now provided by `@docusaurus/preset-classic`. Therefore, we need to add this dependency as well:

```diff title="package.json"
{
  dependencies: {
-   "docusaurus": "^1.x.x",
+   "@docusaurus/core": "^2.0.0-alpha.48",
+   "@docusaurus/preset-classic": "^2.0.0-alpha.48",
  }
}
```

:::tip

Please use the most recent Docusaurus 2 alpha version, which you can check out [here](https://www.npmjs.com/package/@docusaurus/core) (it's tagged `next`).

:::

#### CLI commands

Meanwhile, CLI commands are renamed to `docusaurus <command>` (instead of `docusaurus-command`).

The `"scripts"` section of your `package.json` should be updated as follows:

```json {3-6} title="package.json"
{
  "scripts": {
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy"
    // ...
  }
}
```

A typical Docusaurus 2 `package.json` may look like this:

```json title="package.json"
{
  "scripts": {
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy"
  },
  "dependencies": {
    "@docusaurus/core": "^2.0.0-alpha.40",
    "@docusaurus/preset-classic": "^2.0.0-alpha.40",
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

### Update references to the `build` directory

In Docusaurus 1, all the build artifacts are located within `website/build/<PROJECT_NAME>`. However, in Docusaurus 2, it is now moved to just `website/build`. Make sure that you update your deployment configuration to read the generated files from the correct `build` directory.

If you are deploying to GitHub pages, make sure to run `yarn deploy` instead of `yarn publish-gh-pages` script.

### `.gitignore`

The `.gitignore` in your `website` should contain:

```bash title=".gitignore"
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

## Site configurations

### `docusaurus.config.js`

Rename `siteConfig.js` to `docusaurus.config.js`. In Docusaurus 2, we split each functionality (blog, docs, pages) into plugins for modularity. Presets are bundles of plugins and for backward compatibility we built a `@docusaurus/preset-classic` preset which bundles most of the essential plugins present in Docusaurus 1.

Add the following preset configuration to your `docusaurus.config.js`.

```jsx title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // docs folder path relative to website dir.
          path: '../docs',
          // sidebars file relative to website dir.
          sidebarPath: require.resolve('./sidebars.json'),
        },
        // ...
      },
    ],
  ],
};
```

We recommend moving the `docs` folder into the `website` folder and that is also the default directory structure in v2. [Now](https://zeit.co/now) supports [Docusaurus project deployments out-of-the-box](https://github.com/zeit/now-examples/tree/master/docusaurus) if the `docs` directory is within the `website`. It is also generally better for the docs to be within the website so that the docs and the rest of the website code are co-located within one `website` directory.

Refer to migration guide below for each field in `siteConfig.js`.

### Updated fields

#### `baseUrl`, `tagline`, `title`, `url`, `favicon`, `organizationName`, `projectName`, `githubHost`, `scripts`, `stylesheets`

No actions needed.

#### `colors`

Deprecated. We wrote a custom CSS framework for Docusaurus 2 called Infima which uses CSS variables for theming. The docs are not quite ready yet and we will update here when it is. To overwrite Infima's CSS variables, create your own CSS file (e.g. `./src/css/custom.css`) and import it globally by passing it as an option to `@docusaurus/preset-classic`:

```js {7-9} title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
```

Infima uses 7 shades of each color.

```css title="/src/css/custom.css"
/**
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

We recommend using [ColorBox](https://www.colorbox.io/) to find the different shades of colors for your chosen primary color.

Alteratively, use the following tool to generate the different shades for your website and copy the variables into `src/css/custom.css`.

<ColorGenerator/>

#### `footerIcon`, `copyright`, `ogImage`, `twitterImage`, `docsSideNavCollapsible`

Site meta info such as assets, SEO, copyright info are now handled by themes. To customize them, use the `themeConfig` field in your `docusaurus.config.js`:

```jsx title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    footer: {
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'https://docusaurus.io/img/oss_logo.webp',
        href: 'https://opensource.facebook.com/',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`, // You can also put own HTML here
    },
    image: 'img/docusaurus.png',
    // Equivalent to `docsSideNavCollapsible`
    sidebarCollapsible: false,
    // ...
  },
};
```

#### `headerIcon`, `headerLinks`

In Docusaurus 1, header icon and header links were root fields in `siteConfig`:

```js title="siteConfig.js"
headerIcon: 'img/docusaurus.svg',
headerLinks: [
  { doc: "doc1", label: "Getting Started" },
  { page: "help", label: "Help" },
  { href: "https://github.com/", label: "GitHub" },
  { blog: true, label: "Blog" },
],
```

Now, these two fields are both handled by the theme:

```jsx {6-19} title="docusaurus.config.js"
module.exports = {
  // ...
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
    // ...
  },
};
```

#### `algolia`

```jsx {4-8} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    algolia: {
      apiKey: '47ecd3b21be71c5822571b9f59e52544',
      indexName: 'docusaurus-2',
      algoliaOptions: { ... },
    },
    // ...
  },
};
```

#### `blogSidebarCount`

Deprecated. Pass it as a blog option to `@docusaurus/preset-classic` instead:

```jsx {8} title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        blog: {
          postsPerPage: 10,
        },
        // ...
      },
    ],
  ],
};
```

#### `cname`

Deprecated. Create a `CNAME` file in your `static` folder instead with your custom domain. Files in the `static` folder will be copied into the root of the `build` folder during execution of the build command.

#### `customDocsPath`, `docsUrl`, `editUrl`, `enableUpdateBy`, `enableUpdateTime`

**BREAKING**: `editUrl` should point to (website) docusaurus project instead of `docs` directory.

Deprecated. Pass it as an option to `@docusaurus/preset-classic` docs instead:

```jsx {8-20} title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // Equivalent to `customDocsPath`.
          path: 'docs',
          // Equivalent to `editUrl` but should point to `website` dir instead of `website/docs`
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/website',
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
        // ...
      },
    ],
  ],
};
```

#### `gaTrackingId`

```jsx {5} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    googleAnalytics: {
      trackingID: 'UA-141789564-1',
    },
    // ...
  },
};
```

#### `gaGtag`

```jsx {5} title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig: {
    gtag: {
      trackingID: 'UA-141789564-1',
    },
    // ...
  },
};
```

### Removed fields

The following fields are all deprecated, you may remove from your configuration file.

- `blogSidebarTitle`
- `cleanUrl` - Clean URL is used by default now.
- `defaultVersionShown` - Versioning is not ported yet. You'd be unable to migration to Docusaurus 2 if you are using versioning. Stay tuned.
- `disableHeaderTitle`
- `disableTitleTagline`
- `docsSideNavCollapsible` is available at `themeConfig.sidebarCollapsible`, and this is turned on by default now.
- `facebookAppId`
- `facebookComments`
- `facebookPixelId`
- `fonts`
- `highlight` - We now use [Prism](https://prismjs.com/) instead of [highlight.js](https://highlightjs.org/).
- `markdownOptions` - We use MDX in v2 instead of Remarkable. Your markdown options have to be converted to Remark/Rehype plugins.
- `markdownPlugins` - We use MDX in v2 instead of Remarkable. Your markdown plugins have to be converted to Remark/Rehype plugins.
- `manifest`
- `noIndex`
- `onPageNav` - This is turned on by default now.
- `separateCss` - It can imported in the same manner as `custom.css` mentioned above.
- `scrollToTop`
- `scrollToTopOptions`
- `translationRecruitingLink`
- `twitter`
- `twitterUsername`
- `useEnglishUrl`
- `users`
- `usePrism` - We now use [Prism](https://prismjs.com/) instead of [highlight.js](https://highlightjs.org/)
- `wrapPagesHTML`

We intend to implement many of the deprecated config fields as plugins in future. Help will be appreciated!

## Components

### Sidebar

In previous version, nested sidebar category is not allowed and sidebar category can only contain doc id. However, v2 allows infinite nested sidebar and we have many types of [Sidebar Item](docs.md#sidebar-item) other than document.

You'll have to migrate your sidebar if it contains category type. Rename `subcategory` to `category` and `ids` to `items`.

```diff title="sidebars.json"
{
- type: 'subcategory',
+ type: 'category',
  label: 'My Example Subcategory',
+ items: ['doc1'],
- ids: ['doc1']
},
```

### Footer

`website/core/Footer.js` is no longer needed. If you want to modify the default footer provided by Docusaurus, [swizzle](using-themes.md#swizzling-theme-components) it:

```bash npm2yarn
npm run swizzle @docusaurus/theme-classic Footer
```

This will copy the current `<Footer />` component used by the theme to a `src/theme/Footer` directory under the root of your site, you may then edit this component for customization.

### Pages

Please refer to [creating pages](creating-pages.md) to learn how Docusaurus 2 pages work. After reading that, notice that you have to move `pages/en` files in v1 to `src/pages` instead.

`CompLibrary` is deprecated in v2, so you have to write your own React component or use Infima styles (Docs will be available soon, sorry about that! In the meanwhile, inspect the V2 website or view https://facebookincubator.github.io/infima/ to see what styles are available).

The following code could be helpful for migration of various pages:

- Index page - [Flux](https://github.com/facebook/flux/blob/master/website/src/pages/index.js) (recommended), [Docusaurus 2](https://github.com/facebook/docusaurus/blob/master/website/src/pages/index.js), [Hermes](https://github.com/facebook/hermes/blob/master/website/src/pages/index.js)
- Help/Support page - [Docusaurus 2](https://github.com/facebook/docusaurus/blob/master/website/src/pages/help.js), [Flux](http://facebook.github.io/flux/support)

## Content

### Remove AUTOGENERATED_TABLE_OF_CONTENTS

This feature is deprecated. You may read more about it in [this issue](https://github.com/facebook/docusaurus/issues/1549). If you need the feature, use [remark-toc](https://github.com/remarkjs/remark-toc) instead and pass it to docs plugin's `remarkPlugins` option.

### Update Markdown syntax to be MDX-compatible

In Docusaurus 2, the markdown syntax has been changed to [MDX](https://mdxjs.com/). Hence there might be some broken syntax in the existing docs which you would have to update. A common example is self-closing tags like `<img>` and `<br>` which are valid in HTML would have to be explicitly closed now ( `<img/>` and `<br/>`). All tags in MDX documents have to be valid JSX.

**Tips**: You might want to use some online tools like [HTML to JSX](https://transform.tools/html-to-jsx) to make the migration easier.

### Language-specific Code Tabs

Refer to the [multi-language support code blocks](markdown-features.mdx#multi-language-support-code-blocks) section.

### Front matter

The Docusaurus front matter fields for the blog have been changed from camelCase to snake_case to be consistent with the docs.

The fields `authorFBID` and `authorTwitter` have been deprecated. They are only used for generating the profile image of the author which can be done via the `author_image_url` field.

## Test your site

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

## Example migration PRs

You might want to refer to our migration PRs for [Create React App](https://github.com/facebook/create-react-app/pull/7785) and [Flux](https://github.com/facebook/flux/pull/471) as examples of how a migration for a basic Docusaurus v1 site can be done.

## Support

For any questions, you can ask in the [`#docusaurus-1-to-2-migration` Discord channel](https://discordapp.com/invite/kYaNd6V). Feel free to tag [@yangshun](https://github.com/yangshun) in any migration PRs if you would like us to have a look.

## Versioned Site

:::caution

The versioning feature is a work in progress! Although we've implemented docs versioning since `2.0.0-alpha.37`, we'd like to test it out for v2 users first before we recommend v1 users to migrate to v2. There are some changes in how v2 versioning works compared to v1. In the future, we might create a script to migrate your versioned docs easier. However, if you are adventurous enough to manually migrate, feel free to do so. Be warned though, the manual migration requires lot of work.

:::

## Changes from v1

Read up https://v2.docusaurus.io/blog/2018/09/11/Towards-Docusaurus-2#versioning first for problems in v1's approach.

### Migrate your `versioned_docs` front matter

Unlike v1, The markdown header for each versioned doc is no longer altered by using `version-${version}-${original_id}` as the value for the actual id field. See scenario below for better explanation.

For example, if you have a `docs/hello.md`.

```md
---
id: hello
title: Hello, World !
---

Hi, Endilie here :)
```

When you cut a new version 1.0.0, in Docusaurus v1, `website/versioned_docs/version-1.0.0/hello.md` looks like this:

```md
---
id: version-1.0.0-hello
title: Hello, World !
original_id: hello
---

Hi, Endilie here :)
```

In comparison, Docusaurus 2 `website/versioned_docs/version-1.0.0/hello.md` looks like this (exactly same as original)

```md
---
id: hello
title: Hello, World !
---

Hi, Endilie here :)
```

Since we're going for snapshot and allow people to move (and edit) docs easily inside version. The `id` frontmatter is no longer altered and will remain the same. Internally, it is set as `version-${version}/${id}`.

Essentially, here are the necessary changes in each versioned_docs file:

```diff {2-3,5}
---
- id: version-1.0.0-hello
+ id: hello
title: Hello, World !
- original_id: hello
---
Hi, Endilie here :)
```

### Migrate your `versioned_sidebars`

- Refer to `versioned_docs` id as `version-${version}/${id}` (v2) instead of `version-${version}-${original_id}` (v1).

Because in v1 there is a good chance someone created a new file with front matter id `"version-${version}-${id}"` that can conflict with `versioned_docs` id.

For example, Docusaurus 1 can't differentiate `docs/xxx.md`

```md
---
id: version-1.0.0-hello
---

Another content
```

vs `website/versioned_docs/version-1.0.0/hello.md`

```md
---
id: version-1.0.0-hello
title: Hello, World !
original_id: hello
---

Hi, Endilie here :)
```

Since we don't allow `/` in v1 & v2 for frontmatter, conflicts are less likely to occur.

So v1 users need to migrate their versioned_sidebars file

Example `versioned_sidebars/version-1.0.0-sidebars.json`:

```diff {2-3,5-6,9-10}  title="versioned_sidebars/version-1.0.0-sidebars.json"
{
+ "version-1.0.0/docs": {
- "version-1.0.0-docs": {
    "Test": [
+    "version-1.0.0/foo/bar",
-    "version-1.0.0-foo/bar",
    ],
    "Guides": [
+    "version-1.0.0/hello",
-    "version-1.0.0-hello"
    ]
  }
}
```

### Populate your `versioned_sidebars` and `versioned_docs`

In v2, we use snapshot approach for documentation versioning. **Every versioned docs does not depends on other version**. It is possible to have `foo.md` in `version-1.0.0` but it doesn't exist in `version-1.2.0`. This is not possible in previous version due to Docusaurus v1 fallback functionality (https://docusaurus.io/docs/en/versioning#fallback-functionality).

For example, if your `versions.json` looks like this in v1

```json title="versions.json"
["1.1.0", "1.0.0"]
```

Docusaurus v1 creates versioned docs **if and only if the doc content is different**. Your docs structure might look like this if the only doc changed from v1.0.0 to v1.1.0 is `hello.md`.

```shell
website
├── versioned_docs
│   ├── version-1.1.0
│   │   └── hello.md
│   └── version-1.0.0
│       ├── foo
│       │   └── bar.md
│       └── hello.md
├── versioned_sidebars
│   └── version-1.0.0-sidebars.json
```

In v2, you have to populate the missing `versioned_docs` and `versioned_sidebars` (with the right frontmatter and id reference too).

```shell {3-5,12}
website
├── versioned_docs
│   ├── version-1.1.0
│   │   ├── foo
│   │   │   └── bar.md
│   │   └── hello.md
│   └── version-1.0.0
│       ├── foo
│       │   └── bar.md
│       └── hello.md
├── versioned_sidebars
│   ├── version-1.1.0-sidebars.json
│   └── version-1.0.0-sidebars.json
```

### Convert style attributes to style objects in MDX

Docusaurus 2 uses JSX for doc files. If you have any style attributes in your Docusaurus 1 docs, convert them to style objects, like this:

```diff
---
id: demo
title: Demo
---

## Section

hello world

- pre style="background: black">zzz</pre>
+ pre style={{background: 'black'}}>zzz</pre>
```
