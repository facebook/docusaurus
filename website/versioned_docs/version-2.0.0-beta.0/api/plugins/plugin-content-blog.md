---
id: plugin-content-blog
title: '📦 plugin-content-blog'
slug: '/api/plugins/@docusaurus/plugin-content-blog'
---

Provides the [Blog](blog.md) feature and is the default blog plugin for Docusaurus.

## Installation {#installation}

```bash npm2yarn
npm install --save @docusaurus/plugin-content-blog
```

:::tip

If you have installed `@docusaurus/preset-classic`, you don't need to install it as a dependency. You can also configure it through the [classic preset options](presets.md#docusauruspreset-classic) instead of doing it like below.

:::

## Configuration {#configuration}

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: 'blog',
        /**
         * Base url to edit your site.
         * Docusaurus will compute the final editUrl with "editUrl + relativeDocPath"
         */
        editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
        /**
         * For advanced cases, compute the edit url for each markdown file yourself.
         */
        editUrl: ({locale, blogDirPath, blogPath, permalink}) => {
          return `https://github.com/facebook/docusaurus/edit/master/website/${blogDirPath}/${blogPath}`;
        },
        /**
         * Useful if you commit localized files to git.
         * When markdown files are localized, the edit url will target the localized file,
         * instead of the original unlocalized file.
         * Note: this option is ignored when editUrl is a function
         */
        editLocalizedFiles: false,
        /**
         * Blog page title for better SEO
         */
        blogTitle: 'Blog title',
        /**
         * Blog page meta description for better SEO
         */
        blogDescription: 'Blog',
        /**
         * Number of blog post elements to show in the blog sidebar
         * 'ALL' to show all blog posts
         * 0 to disable
         */
        blogSidebarCount: 5,
        /**
         * Title of the blog sidebar
         */
        blogSidebarTitle: 'All our posts',
        /**
         * URL route for the blog section of your site.
         * *DO NOT* include a trailing slash.
         */
        routeBasePath: 'blog',
        include: ['*.md', '*.mdx'],
        postsPerPage: 10,
        /**
         * Theme components used by the blog pages.
         */
        blogListComponent: '@theme/BlogListPage',
        blogPostComponent: '@theme/BlogPostPage',
        blogTagsListComponent: '@theme/BlogTagsListPage',
        blogTagsPostsComponent: '@theme/BlogTagsPostsPage',
        /**
         * Remark and Rehype plugins passed to MDX.
         */
        remarkPlugins: [
          /* require('remark-math') */
        ],
        rehypePlugins: [],
        /**
         * Custom Remark and Rehype plugins passed to MDX before
         * the default Docusaurus Remark and Rehype plugins.
         */
        beforeDefaultRemarkPlugins: [],
        beforeDefaultRehypePlugins: [],
        /**
         * Truncate marker, can be a regex or string.
         */
        truncateMarker: /<!--\s*(truncate)\s*-->/,
        /**
         * Show estimated reading time for the blog post.
         */
        showReadingTime: true,
        /**
         * Blog feed.
         * If feedOptions is undefined, no rss feed will be generated.
         */
        feedOptions: {
          type: '', // required. 'rss' | 'feed' | 'all'
          title: '', // default to siteConfig.title
          description: '', // default to  `${siteConfig.title} Blog`
          copyright: '',
          language: undefined, // possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        },
      },
    ],
  ],
};
```

## i18n {#i18n}

Read the [i18n introduction](../../i18n/i18n-introduction.md) first.

### Translation files location {#translation-files-location}

- **Base path**: `website/i18n/<locale>/docusaurus-plugin-content-blog`
- **Multi-instance path**: `website/i18n/<locale>/docusaurus-plugin-content-blog-<pluginId>`
- **JSON files**: N/A
- **Markdown files**: `website/i18n/<locale>/docusaurus-plugin-content-blog`

### Example file-system structure {#example-file-system-structure}

```bash
website/i18n/<locale>/docusaurus-plugin-content-blog
│
│ # translations for website/blog
├── first-blog-post.md
└── second-blog-post.md
```
