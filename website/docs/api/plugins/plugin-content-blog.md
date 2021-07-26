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

Accepted fields:

<small>

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `path` | `string` | Path to data on filesystem relative to site dir. | `'blog'` |
| `editUrl` | <code>string &#124; EditUrlFunction</code> | Base URL to edit your site. Docusaurus will compute the final edit URL with `editUrl + relativeDocPath`. When a function is passed, the edit URL will be computed for each Markdown file. Omitting this variable entirely will disable edit links. | `undefined` |
| `editLocalizedFiles` | `boolean` | If localized files are commited to git, the edit URL will target the localized file, instead of the original unlocalized file. Ignored when `editUrl` is a function. | `false` |
| `blogTitle` | `string` | Blog page title for better SEO. | `'Blog'` |
| `blogDescription` | `string` | Blog page meta description for better SEO. | `'Blog'` |
| `blogSidebarCount` | <code>number &#124; 'ALL'</code> | Number of blog post elements to show in the blog sidebar. `'ALL'` to show all blog posts; `0` to disable | `5` |
| `blogDescription` | `string` | Blog page meta description for better SEO. | `'Blog'` |
| `blogDescription` | `string` | Blog page meta description for better SEO. | `'Blog'` |
| `blogSidebarTitle` | `string` | Title of the blog sidebar. | `'Recent posts'` |
| `routeBasePath` | `string` | URL route for the blog section of your site. **DO NOT** include a trailing slash. It is possible to set just `/` to put the blog at root path. | `'blog'` |
| `include` | `string[]` | Matching files will be included and processed. | `['**/*.{md,mdx}']` |
| `exclude` | `string[]` | No route will be created for matching files. | _See example configuration_ |
| `postsPerPage` | `number` | Number of posts to show per page in the listing page. | `10` |
| `blogListComponent` | `string` | Root component of the blog listing page. | `'@theme/BlogListPage'` |
| `blogPostComponent` | `string` | Root component of each blog post page. | `'@theme/BlogPostPage'` |
| `blogTagsListComponent` | `string` | Root component of the tags list page | `'@theme/BlogTagsListPage'` |
| `blogTagsPostsComponent` | `string` | Root component of the "posts containing tag" page. | `'@theme/BlogTagsPostsPage'` |
| `remarkPlugins` | `any[]` | Remark plugins passed to MDX. | `[]` |
| `rehypePlugins` | `any[]` | Rehype plugins passed to MDX. | `[]` |
| `beforeDefaultRemarkPlugins` | `any[]` | Custom Remark plugins passed to MDX before the default Docusaurus Remark plugins. | `[]` |
| `beforeDefaultRehypePlugins` | `any[]` | Custom Rehype plugins passed to MDX before the default Docusaurus Rehype plugins. | `[]` |
| `truncateMarker` | `string` | Truncate marker, can be a regex or string. | `/<!--\s*(truncate)\s*-->/` |
| `showReadingTime` | `boolean` | Show estimated reading time for the blog post. | `true` |
| `feedOptions` | _See below_ | Blog feed. If undefined, no rss feed will be generated. | `{type: ['rss', 'atom']}` |
| `feedOptions.type` | <code>'rss' &#124; 'atom' &#124; 'all'</code> (or array of multiple options) | Type of feed to be generated. | **Required** |
| `feedOptions.title` | `string` | Title of the feed. | `siteConfig.title` |
| `feedOptions.description` | `string` | Description of the feed. | <code>\`${siteConfig.title} Blog\`</code> |
| `feedOptions.copyright` | `string` | Copyright message. | `undefined` |
| `feedOptions.language` | `string` (See [documentation](http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes) for possible values) | Language metadata of the feed. | `undefined` |

</small>

```typescript
type EditUrlFunction = (params: {
  blogDirPath: string;
  blogPath: string;
  permalink: string;
  locale: string;
}) => string | undefined;
```

Example configuration:

```js title="docusaurus.config.js"
module.exports = {
  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        path: 'blog',
        // Simple use-case: string editUrl
        // editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
        // Advanced use-case: functional editUrl
        editUrl: ({locale, blogDirPath, blogPath, permalink}) => {
          return `https://github.com/facebook/docusaurus/edit/master/website/${blogDirPath}/${blogPath}`;
        },
        editLocalizedFiles: false,
        blogTitle: 'Blog title',
        blogDescription: 'Blog',
        blogSidebarCount: 5,
        blogSidebarTitle: 'All our posts',
        routeBasePath: 'blog',
        include: ['*.md', '*.mdx'],
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/_*/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/__tests__/**',
        ],
        postsPerPage: 10,
        blogListComponent: '@theme/BlogListPage',
        blogPostComponent: '@theme/BlogPostPage',
        blogTagsListComponent: '@theme/BlogTagsListPage',
        blogTagsPostsComponent: '@theme/BlogTagsPostsPage',
        remarkPlugins: [require('remark-math')],
        rehypePlugins: [],
        beforeDefaultRemarkPlugins: [],
        beforeDefaultRehypePlugins: [],
        truncateMarker: /<!--\s*(truncate)\s*-->/,
        showReadingTime: true,
        feedOptions: {
          type: '',
          title: '',
          description: '',
          copyright: '',
          language: undefined,
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
