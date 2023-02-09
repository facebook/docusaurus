/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/plugin-content-blog' {
  import type {LoadedMDXContent} from '@docusaurus/mdx-loader';
  import type {MDXOptions} from '@docusaurus/mdx-loader';
  import type {FrontMatterTag, Tag} from '@docusaurus/utils';
  import type {DocusaurusConfig, Plugin, LoadContext} from '@docusaurus/types';
  import type {Item as FeedItem} from 'feed';
  import type {Overwrite} from 'utility-types';

  export type Assets = {
    /**
     * If `metadata.yarn workspace website typecheck
4
yarn workspace v1.22.19yarn workspace website typecheck
4
yarn workspace v1.22.19yarn workspace website typecheck
4
yarn workspace v1.22.19image` is a collocated image path, this entry will be the
     * bundler-generated image path. Otherwise, it's empty, and the image URL
     * should be accessed through `frontMatter.image`.
     */
    image?: string;
    /**
     * Array where each item is 1-1 correlated with the `metadata.authors` array
     * so that client can render the correct author images. If the author's
     * image is a local file path, the slot will be filled with the bundler-
     * generated image path; otherwise, it's empty, and the author's image URL
     * should be accessed through `authors.imageURL`.
     */
    authorsImageUrls: (string | undefined)[];
  };

  export type Author = {
    /**
     * If `name` doesn't exist, an `imageURL` is expected.
     */
    name?: string;
    /**
     * The image path could be collocated, in which case
     * `metadata.assets.authorsImageUrls` should be used instead. If `imageURL`
     * doesn't exist, a `name` is expected.
     */
    imageURL?: string;
    /**
     * Used to generate the author's link.
     */
    url?: string;
    /**
     * Used as a subtitle for the author, e.g. "maintainer of Docusaurus"
     */
    title?: string;
    /**
     * Mainly used for RSS feeds; if `url` doesn't exist, `email` can be used
     * to generate a fallback `mailto:` URL.
     */
    email?: string;
    /**
     * Unknown keys are allowed, so that we can pass custom fields to authors,
     * e.g., `twitter`.
     */
    [key: string]: unknown;
  };

  /**
   * Everything is partial/unnormalized, because front matter is always
   * preserved as-is. Default values will be applied when generating metadata
   */
  export type BlogPostFrontMatter = {
    /**
     * @deprecated Use `slug` instead.
     */
    id?: string;
    /**
     * Will override the default title collected from h1 heading.
     * @see {@link BlogPostMetadata.title}
     */
    title?: string;
    /**
     * Will override the default excerpt.
     * @see {@link BlogPostMetadata.description}
     */
    description?: string;
    /**
     * Front matter tags, unnormalized.
     * @see {@link BlogPostMetadata.tags}
     */
    tags?: FrontMatterTag[];
    /** Custom slug appended after `/<baseUrl>/<routeBasePath>/` */
    slug?: string;
    /**
     * Marks the post as draft and excludes it from the production build.
     */
    draft?: boolean;
    /**
     * Will override the default publish date inferred from git/filename. Yaml
     * only converts standard yyyy-MM-dd format to dates, so this may stay as a
     * plain string.
     * @see {@link BlogPostMetadata.date}
     */
    date?: Date | string;
    /**
     * Authors, unnormalized.
     * @see {@link BlogPostMetadata.authors}
     */
    authors?: BlogPostFrontMatterAuthors;
    /**
     * To be deprecated
     * @see {@link BlogPostFrontMatterAuthor.name}
     */
    author?: string;
    /**
     * To be deprecated
     * @see {@link BlogPostFrontMatterAuthor.title}
     */
    author_title?: string;
    /**
     * To be deprecated
     * @see {@link BlogPostFrontMatterAuthor.url}
     */
    author_url?: string;
    /**
     * To be deprecated
     * @see {@link BlogPostFrontMatterAuthor.imageURL}
     */
    author_image_url?: string;

    /** @deprecated v1 legacy */
    authorTitle?: string;
    /** @deprecated v1 legacy */
    authorURL?: string;
    /** @deprecated v1 legacy */
    authorImageURL?: string;

    /** Used in the head meta. Should use `assets.image` in priority. */
    image?: string;
    /** Used in the head meta. */
    keywords?: string[];
    /** Hide the right TOC. */
    hide_table_of_contents?: boolean;
    /**
     * Minimum TOC heading level. Must be between 2 and 6 and lower or equal to
     * the max value.
     */
    toc_min_heading_level?: number;
    /** Maximum TOC heading level. Must be between 2 and 6. */
    toc_max_heading_level?: number;
  };

  export type BlogPostFrontMatterAuthor = Author & {
    /**
     * Will be normalized into the `imageURL` prop.
     */
    image_url?: string;
    /**
     * References an existing author in the authors map.
     */
    key?: string;
  };

  /**
   * Blog post authors can be declared in front matter as a string key
   * (referencing an author in authors map), an object (partially overriding the
   * data in authors map, or a completely new author), or an array of a mix of
   * both.
   */
  export type BlogPostFrontMatterAuthors =
    | string
    | BlogPostFrontMatterAuthor
    | (string | BlogPostFrontMatterAuthor)[];

  export type BlogPostMetadata = {
    /** Path to the Markdown source, with `@site` alias. */
    readonly source: string;
    /**
     * Used to generate the page h1 heading, tab title, and pagination title.
     */
    readonly title: string;
    /**
     * The publish date of the post. On client side, this will be serialized
     * into a string.
     */
    readonly date: Date;
    /**
     * Publish date formatted according to the locale, so that the client can
     * render the date regardless of the existence of `Intl.DateTimeFormat`.
     */
    readonly formattedDate: string;
    /** Full link including base URL. */
    readonly permalink: string;
    /**
     * Description used in the meta. Could be an empty string (empty content)
     */
    readonly description: string;
    /**
     * Absolute URL to the editing page of the post. Undefined if the post
     * shouldn't be edited.
     */
    readonly editUrl?: string;
    /**
     * Reading time in minutes calculated based on word count.
     */
    readonly readingTime?: number;
    /**
     * Whether the truncate marker exists in the post's content.
     */
    readonly hasTruncateMarker: boolean;
    /**
     * Used in pagination. Generated after the other metadata, so not readonly.
     * Content is just a subset of another post's metadata.
     */
    nextItem?: {readonly title: string; readonly permalink: string};
    /**
     * Used in pagination. Generated after the other metadata, so not readonly.
     * Content is just a subset of another post's metadata.
     */
    prevItem?: {readonly title: string; readonly permalink: string};
    /**
     * Author metadata, normalized. Should be used in joint with
     * `assets.authorsImageUrls` on client side.
     */
    readonly authors: Author[];
    /** Front matter, as-is. */
    readonly frontMatter: BlogPostFrontMatter & {[key: string]: unknown};
    /** Tags, normalized. */
    readonly tags: Tag[];
  };
  /**
   * @returns The edit URL that's directly plugged into metadata.
   */
  export type EditUrlFunction = (editUrlParams: {
    /**
     * The root content directory containing this post file, relative to the
     * site path. Usually the same as `options.path` but can be localized
     */
    blogDirPath: string;
    /** Path to this post file, relative to `blogDirPath`. */
    blogPath: string;
    /** @see {@link BlogPostMetadata.permalink} */
    permalink: string;
    /** Locale name. */
    locale: string;
  }) => string | undefined;

  export type FeedType = 'rss' | 'atom' | 'json';
  /**
   * Normalized feed options used within code.
   */
  export type FeedOptions = {
    /** If `null`, no feed is generated. */
    type?: FeedType[] | null;
    /** Title of generated feed. */
    title?: string;
    /** Description of generated feed. */
    description?: string;
    /** Copyright notice. Required because the feed library marked it that. */
    copyright: string;
    /** Language of the feed. */
    language?: string;
    /** Allow control over the construction of BlogFeedItems */
    createFeedItems?: CreateFeedItemsFn;
  };

  type DefaultCreateFeedItemsParams = {
    blogPosts: BlogPost[];
    siteConfig: DocusaurusConfig;
    outDir: string;
  };

  type CreateFeedItemsFn = (
    params: CreateFeedItemsParams,
  ) => Promise<BlogFeedItem[]>;

  type CreateFeedItemsParams = DefaultCreateFeedItemsParams & {
    defaultCreateFeedItems: (
      params: DefaultCreateFeedItemsParams,
    ) => Promise<BlogFeedItem[]>;
  };

  /**
   * Duplicate from ngryman/reading-time to keep stability of API.
   */
  type ReadingTimeOptions = {
    wordsPerMinute?: number;
    /**
     * @param char The character to be matched.
     * @returns `true` if this character is a word bound.
     */
    wordBound?: (char: string) => boolean;
  };

  /**
   * Represents the default reading time implementation.
   * @returns The reading time directly plugged into metadata.
   */
  export type ReadingTimeFunction = (params: {
    /** Markdown content. */
    content: string;
    /** Front matter. */
    frontMatter?: BlogPostFrontMatter & {[key: string]: unknown};
    /** Options accepted by ngryman/reading-time. */
    options?: ReadingTimeOptions;
  }) => number;

  /**
   * @returns The reading time directly plugged into metadata. `undefined` to
   * hide reading time for a specific post.
   */
  export type ReadingTimeFunctionOption = (
    /**
     * The `options` is not provided by the caller; the user can inject their
     * own option values into `defaultReadingTime`
     */
    params: Required<Omit<Parameters<ReadingTimeFunction>[0], 'options'>> & {
      /**
       * The default reading time implementation from ngryman/reading-time.
       */
      defaultReadingTime: ReadingTimeFunction;
    },
  ) => number | undefined;
  /**
   * Plugin options after normalization.
   */
  export type PluginOptions = MDXOptions & {
    /** Plugin ID. */
    id?: string;
    /**
     * Path to the blog content directory on the file system, relative to site
     * directory.
     */
    path: string;
    /**
     * URL route for the blog section of your site. **DO NOT** include a
     * trailing slash. Use `/` to put the blog at root path.
     */
    routeBasePath: string;
    /**
     * URL route for the tags section of your blog. Will be appended to
     * `routeBasePath`. **DO NOT** include a trailing slash.
     */
    tagsBasePath: string;
    /**
     * URL route for the archive section of your blog. Will be appended to
     * `routeBasePath`. **DO NOT** include a trailing slash. Use `null` to
     * disable generation of archive.
     */
    archiveBasePath: string | null;
    /**
     * Array of glob patterns matching Markdown files to be built, relative to
     * the content path.
     */
    include: string[];
    /**
     * Array of glob patterns matching Markdown files to be excluded. Serves as
     * refinement based on the `include` option.
     */
    exclude: string[];
    /**
     *  Number of posts to show per page in the listing page. Use `'ALL'` to
     * display all posts on one listing page.
     */
    postsPerPage: number | 'ALL';
    /** Root component of the blog listing page. */
    blogListComponent: string;
    /** Root component of each blog post page. */
    blogPostComponent: string;
    /** Root component of the tags list page. */
    blogTagsListComponent: string;
    /** Root component of the "posts containing tag" page. */
    blogTagsPostsComponent: string;
    /** Root component of the blog archive page. */
    blogArchiveComponent: string;
    /** Blog page title for better SEO. */
    blogTitle: string;
    /** Blog page meta description for better SEO. */
    blogDescription: string;
    /**
     * Number of blog post elements to show in the blog sidebar. `'ALL'` to show
     * all blog posts; `0` to disable.
     */
    blogSidebarCount: number | 'ALL';
    /** Title of the blog sidebar. */
    blogSidebarTitle: string;
    /** Truncate marker marking where the summary ends. */
    truncateMarker: RegExp;
    /** Show estimated reading time for the blog post. */
    showReadingTime: boolean;
    /** Blog feed. */
    feedOptions: FeedOptions;
    /**
     * Base URL to edit your site. The final URL is computed by `editUrl +
     * relativePostPath`. Using a function allows more nuanced control for each
     * file. Omitting this variable entirely will disable edit links.
     */
    editUrl?: string | EditUrlFunction;
    /**
     * The edit URL will target the localized file, instead of the original
     * unlocalized file. Ignored when `editUrl` is a function.
     */
    editLocalizedFiles?: boolean;
    /** Path to the authors map file, relative to the blog content directory. */
    authorsMapPath: string;
    /** A callback to customize the reading time number displayed. */
    readingTime: ReadingTimeFunctionOption;
    /** Governs the direction of blog post sorting. */
    sortPosts: 'ascending' | 'descending';
  };

  /**
   * Feed options, as provided by user config. `type` accepts `all` as shortcut
   */
  export type UserFeedOptions = Overwrite<
    Partial<FeedOptions>,
    {
      /** Type of feed to be generated. Use `null` to disable generation. */
      type?: FeedOptions['type'] | 'all' | FeedType;
    }
  >;
  /**
   * Options as provided in the user config (before normalization)
   */
  export type Options = Overwrite<
    Partial<PluginOptions>,
    {
      /** Blog feed. */
      feedOptions?: UserFeedOptions;
    }
  >;

  export type BlogSidebar = {
    title: string;
    items: {title: string; permalink: string}[];
  };

  export type BlogContent = {
    blogSidebarTitle: string;
    blogPosts: BlogPost[];
    blogListPaginated: BlogPaginated[];
    blogTags: BlogTags;
    blogTagsListPath: string;
  };

  export type BlogTags = {
    [permalink: string]: BlogTag;
  };

  export type BlogTag = Tag & {
    /** Blog post permalinks. */
    items: string[];
    pages: BlogPaginated[];
  };

  export type BlogPost = {
    id: string;
    metadata: BlogPostMetadata;
    content: string;
  };

  export type BlogFeedItem = FeedItem;

  export type BlogPaginatedMetadata = {
    /** Title of the entire blog. */
    readonly blogTitle: string;
    /** Blog description. */
    readonly blogDescription: string;
    /** Permalink to the next list page. */
    readonly nextPage?: string;
    /** Permalink of the current page. */
    readonly permalink: string;
    /** Permalink to the previous list page. */
    readonly previousPage?: string;
    /** Index of the current page, 1-based. */
    readonly page: number;
    /** Posts displayed on each list page. */
    readonly postsPerPage: number;
    /** Total number of posts in the entire blog. */
    readonly totalCount: number;
    /** Total number of list pages. */
    readonly totalPages: number;
  };

  export type BlogPaginated = {
    metadata: BlogPaginatedMetadata;
    /** Blog post permalinks. */
    items: string[];
  };

  type PropBlogPostMetadata = Overwrite<
    BlogPostMetadata,
    {
      /** The publish date of the post. Serialized from the `Date` object. */
      date: string;
    }
  >;

  export type PropBlogPostContent = LoadedMDXContent<
    BlogPostFrontMatter,
    PropBlogPostMetadata,
    Assets
  >;

  export default function pluginContentBlog(
    context: LoadContext,
    options: PluginOptions,
  ): Promise<Plugin<BlogContent>>;
}

declare module '@theme/BlogPostPage' {
  import type {
    BlogPostFrontMatter,
    BlogSidebar,
    PropBlogPostContent,
  } from '@docusaurus/plugin-content-blog';

  export type FrontMatter = BlogPostFrontMatter;

  export type Content = PropBlogPostContent;

  export interface Props {
    /** Blog sidebar. */
    readonly sidebar: BlogSidebar;
    /** Content of this post as an MDX component, with useful metadata. */
    readonly content: Content;
  }

  export default function BlogPostPage(props: Props): JSX.Element;
}

declare module '@theme/BlogPostPage/Metadata' {
  export default function BlogPostPageMetadata(): JSX.Element;
}

declare module '@theme/BlogListPage' {
  import type {Content} from '@theme/BlogPostPage';
  import type {
    BlogSidebar,
    BlogPaginatedMetadata,
  } from '@docusaurus/plugin-content-blog';

  export interface Props {
    /** Blog sidebar. */
    readonly sidebar: BlogSidebar;
    /** Metadata of the current listing page. */
    readonly metadata: BlogPaginatedMetadata;
    /**
     * Array of blog posts included on this page. Every post's metadata is also
     * available.
     */
    readonly items: readonly {readonly content: Content}[];
  }

  export default function BlogListPage(props: Props): JSX.Element;
}

declare module '@theme/BlogTagsListPage' {
  import type {BlogSidebar} from '@docusaurus/plugin-content-blog';
  import type {TagsListItem} from '@docusaurus/utils';

  export interface Props {
    /** Blog sidebar. */
    readonly sidebar: BlogSidebar;
    /** All tags declared in this blog. */
    readonly tags: TagsListItem[];
  }

  export default function BlogTagsListPage(props: Props): JSX.Element;
}

declare module '@theme/BlogTagsPostsPage' {
  import type {Content} from '@theme/BlogPostPage';
  import type {
    BlogSidebar,
    BlogPaginatedMetadata,
  } from '@docusaurus/plugin-content-blog';
  import type {TagModule} from '@docusaurus/utils';

  export interface Props {
    /** Blog sidebar. */
    readonly sidebar: BlogSidebar;
    /** Metadata of this tag. */
    readonly tag: TagModule;
    /** Looks exactly the same as the posts list page */
    readonly listMetadata: BlogPaginatedMetadata;
    /**
     * Array of blog posts included on this page. Every post's metadata is also
     * available.
     */
    readonly items: readonly {readonly content: Content}[];
  }

  export default function BlogTagsPostsPage(props: Props): JSX.Element;
}

declare module '@theme/BlogArchivePage' {
  import type {Content} from '@theme/BlogPostPage';

  /** We may add extra metadata or prune some metadata from here */
  export type ArchiveBlogPost = Content;

  export interface Props {
    /** The entirety of the blog's data. */
    readonly archive: {
      /** All posts. Can select any useful data/metadata to render. */
      readonly blogPosts: readonly ArchiveBlogPost[];
    };
  }

  export default function BlogArchivePage(props: Props): JSX.Element;
}
