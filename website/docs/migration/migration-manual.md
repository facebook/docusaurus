---
id: migration-manual
title: Manual migration
slug: /migration/manual
---

This manual migration process should be run after the [automated migration prcess](./migration-automated.md), to complete the missing parts, or debug issues in the migration CLI output.

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
    "docusaurus": "docusaurus",
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy",
    "serve": "docusaurus serve",
    "clear": "docusaurus clear"
  },
  "dependencies": {
    "@docusaurus/core": "^2.0.0-alpha.66",
    "@docusaurus/preset-classic": "^2.0.0-alpha.66",
    "clsx": "^1.1.1",
    "react": "^16.8.4",
    "react-dom": "^16.8.4"
  },
  "browserslist": {
    "production": [">0.5%", "not dead", "not op_mini all"],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

### Update references to the `build` directory

In Docusaurus 1, all the build artifacts are located within `website/build/<PROJECT_NAME>`.

In Docusaurus 2, it is now moved to just `website/build`. Make sure that you update your deployment configuration to read the generated files from the correct `build` directory.

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

### `README`

The D1 website may have an existing README file. You can modify it to reflect the D2 changes, or copy the default [Docusaurus v2 README](https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-init/templates/classic/README.md).

## Site configurations

### `docusaurus.config.js`

Rename `siteConfig.js` to `docusaurus.config.js`.

In Docusaurus 2, we split each functionality (blog, docs, pages) into plugins for modularity. Presets are bundles of plugins and for backward compatibility we built a `@docusaurus/preset-classic` preset which bundles most of the essential plugins present in Docusaurus 1.

Add the following preset configuration to your `docusaurus.config.js`.

```jsx title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // Docs folder path relative to website dir.
          path: '../docs',
          // Sidebars file relative to website dir.
          sidebarPath: require.resolve('./sidebars.json'),
        },
        // ...
      },
    ],
  ],
};
```

We recommend moving the `docs` folder into the `website` folder and that is also the default directory structure in v2. [Now](https://zeit.co/now) supports [Docusaurus project deployments out-of-the-box](https://github.com/zeit/now-examples/tree/master/docusaurus) if the `docs` directory is within the `website`. It is also generally better for the docs to be within the website so that the docs and the rest of the website code are co-located within one `website` directory.

If you are migrating your Docusaurus v1 website, and there are pending documentation pull requests, you can temporarily keep the `/docs` folder to its original place, to avoid producing conflicts.

Refer to migration guide below for each field in `siteConfig.js`.

### Updated fields

#### `baseUrl`, `tagline`, `title`, `url`, `favicon`, `organizationName`, `projectName`, `githubHost`, `scripts`, `stylesheets`

No actions needed, these configuration fields were not modified.

#### `colors`

Deprecated. We wrote a custom CSS framework for Docusaurus 2 called [Infima](https://facebookincubator.github.io/infima/) which uses CSS variables for theming. The docs are not quite ready yet and we will update here when it is. To overwrite Infima's CSS variables, create your own CSS file (e.g. `./src/css/custom.css`) and import it globally by passing it as an option to `@docusaurus/preset-classic`:

```js {7-9} title="docusaurus.config.js"
module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: [require.resolve('./src/css/custom.css')],
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

import ColorGenerator from '@site/src/components/ColorGenerator';

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
        src: 'https://docusaurus.io/img/oss_logo.png',
        href: 'https://opensource.facebook.com/',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`, // You can also put own HTML here.
    },
    image: 'img/docusaurus.png',
    // Equivalent to `docsSideNavCollapsible`.
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
      items: [
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
      algoliaOptions: { //... },
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

**BREAKING**: `editUrl` should point to (website) Docusaurus project instead of `docs` directory.

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
          // Equivalent to `editUrl` but should point to `website` dir instead of `website/docs`.
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

## Urls

In v1, all pages were available with or without the `.html` extension.

For example, these 2 pages exist:

- [https://docusaurus.io/docs/en/installation](https://docusaurus.io/docs/en/installation)
- [https://docusaurus.io/docs/en/installation.html](https://docusaurus.io/docs/en/installation.html)

If [`cleanUrl`](https://docusaurus.io/docs/en/site-config#cleanurl-boolean) was:

- `true`: links would target `/installation`
- `false`: links would target `/installation.html`

In v2, by default, the canonical page is `/installation`, and not `/installation.html`.

If you had `cleanUrl: false` in v1, it's possible that people published links to `/installation.html`.

For SEO reasons, and avoiding breaking links, you should configure server-side redirect rules on your hosting provider.

As an escape hatch, you could use [@docusaurus/plugin-client-redirects](./using-plugins.md#docusaurusplugin-client-redirects) to create client-side redirects from `/installation.html` to `/installation`.

```js
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html'],
      },
    ],
  ],
};
```

If you want to keep the `.html` extension as the canonical url of a page, docs can declare a `slug: installation.html` frontmatter.

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

Do not swizzle the Footer just to add the logo on the left. The logo is intentionally removed in v2 and moved to the bottom. Just configure the footer in `docusaurus.config.js` with `themeConfig.footer`:

```js
module.exports = {
  themeConfig: {
    footer: {
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'img/oss_logo.png',
        href: 'https://opensource.facebook.com',
      },
    },
  },
};
```

### Pages

Please refer to [creating pages](guides/creating-pages.md) to learn how Docusaurus 2 pages work. After reading that, notice that you have to move `pages/en` files in v1 to `src/pages` instead.

In Docusaurus v1, pages received the `siteConfig` object as props.

In Docusaurus v2, get the `siteConfig` object from `useDocusaurusContext` instead.

In v2, you have to apply the theme layout around each page. The Layout component takes metadata props (`permalink` is important, as it defines the canonical url of your page).

`CompLibrary` is deprecated in v2, so you have to write your own React component or use Infima styles (Docs will be available soon, sorry about that! In the meanwhile, inspect the V2 website or view https://facebookincubator.github.io/infima/ to see what styles are available).

You can migrate CommonJS to ES6 imports/exports.

Here's a typical Docusaurus v2 page:

```jsx
import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

const MyPage = () => {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      permalink="/"
      title={siteConfig.title}
      description={siteConfig.tagline}>
      <div className="hero text--center">
        <div className="container ">
          <div className="padding-vert--md">
            <h1 className="hero__title">{siteConfig.title}</h1>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
          </div>
          <div>
            <Link
              to={useBaseUrl('/docs/get-started')}
              className="button button--lg button--outline button--primary">
              Get started
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyPage;
```

The following code could be helpful for migration of various pages:

- Index page - [Flux](https://github.com/facebook/flux/blob/master/website/src/pages/index.js/) (recommended), [Docusaurus 2](https://github.com/facebook/docusaurus/blob/master/website/src/pages/index.js/), [Hermes](https://github.com/facebook/hermes/blob/master/website/src/pages/index.js/)
- Help/Support page - [Docusaurus 2](https://github.com/facebook/docusaurus/blob/master/website/src/pages/help.js/), [Flux](http://facebook.github.io/flux/support)

## Content

### Replace AUTOGENERATED_TABLE_OF_CONTENTS

This feature is replaced by [inline table of content](../markdown-features.mdx#inline-table-of-contents)

### Update Markdown syntax to be MDX-compatible

In Docusaurus 2, the markdown syntax has been changed to [MDX](https://mdxjs.com/). Hence there might be some broken syntax in the existing docs which you would have to update. A common example is self-closing tags like `<img>` and `<br>` which are valid in HTML would have to be explicitly closed now ( `<img/>` and `<br/>`). All tags in MDX documents have to be valid JSX.

Frontmatter is parsed by [gray-matter](https://github.com/jonschlinkert/gray-matter). If your frontmatter use special characters like `:`, you now need to quote it: `title: Part 1: my part1 title` -> `title: Part 1: "my part1 title"`.

**Tips**: You might want to use some online tools like [HTML to JSX](https://transform.tools/html-to-jsx) to make the migration easier.

### Language-specific code tabs

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

Start the development server and fix any errors:

```bash
cd website
yarn start
```

You can also try to build the site for production:

```bash
yarn build
```
