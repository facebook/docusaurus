/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/plugin-content-blog' {
  import type {RemarkAndRehypePluginOptions} from '@docusaurus/mdx-loader';
  import type {FrontMatterTag} from '@docusaurus/utils';
  import type {Overwrite} from 'utility-types';

  export interface Assets {
    image?: string;
    authorsImageUrls: (string | undefined)[]; // Array of same size as the original MetaData.authors array
  }

  // We allow passing custom fields to authors, e.g., twitter
  export interface Author extends Record<string, unknown> {
    name?: string;
    imageURL?: string;
    url?: string;
    title?: string;
  }

  export type BlogPostFrontMatter = {
    id?: string;
    title?: string;
    description?: string;
    tags?: FrontMatterTag[];
    slug?: string;
    draft?: boolean;
    date?: Date | string; // Yaml automatically convert some string patterns as Date, but not all

    authors?: BlogPostFrontMatterAuthors;

    // We may want to deprecate those older author front matter fields later:
    author?: string;
    author_title?: string;
    author_url?: string;
    author_image_url?: string;

    /** @deprecated */
    authorTitle?: string;
    /** @deprecated */
    authorURL?: string;
    /** @deprecated */
    authorImageURL?: string;

    image?: string;
    keywords?: string[];
    hide_table_of_contents?: boolean;
    toc_min_heading_level?: number;
    toc_max_heading_level?: number;
  };

  export type BlogPostFrontMatterAuthor = Record<string, unknown> & {
    key?: string;
    name?: string;
    imageURL?: string;
    url?: string;
    title?: string;
  };

  // All the possible variants that the user can use for convenience
  export type BlogPostFrontMatterAuthors =
    | string
    | BlogPostFrontMatterAuthor
    | (string | BlogPostFrontMatterAuthor)[];

  export type EditUrlFunction = (editUrlParams: {
    blogDirPath: string;
    blogPath: string;
    permalink: string;
    locale: string;
  }) => string | undefined;

  export type FeedType = 'rss' | 'atom' | 'json';
  export type FeedOptions = {
    type?: FeedType[] | null;
    title?: string;
    description?: string;
    copyright: string;
    language?: string;
  };
  // Feed options, as provided by user config
  export type UserFeedOptions = Overwrite<
    Partial<FeedOptions>,
    {type?: FeedOptions['type'] | 'all'} // Handle the type: "all" shortcut
  >;

  // Duplicate from ngryman/reading-time to keep stability of API
  type ReadingTimeOptions = {
    wordsPerMinute?: number;
    wordBound?: (char: string) => boolean;
  };

  export type ReadingTimeFunction = (params: {
    content: string;
    frontMatter?: BlogPostFrontMatter & Record<string, unknown>;
    options?: ReadingTimeOptions;
  }) => number;

  export type ReadingTimeFunctionOption = (
    params: Required<Omit<Parameters<ReadingTimeFunction>[0], 'options'>> & {
      defaultReadingTime: ReadingTimeFunction;
    },
  ) => number | undefined;

  export type PluginOptions = RemarkAndRehypePluginOptions & {
    id?: string;
    path: string;
    routeBasePath: string;
    tagsBasePath: string;
    archiveBasePath: string | null;
    include: string[];
    exclude: string[];
    postsPerPage: number | 'ALL';
    blogListComponent: string;
    blogPostComponent: string;
    blogTagsListComponent: string;
    blogTagsPostsComponent: string;
    blogTitle: string;
    blogDescription: string;
    blogSidebarCount: number | 'ALL';
    blogSidebarTitle: string;
    truncateMarker: RegExp;
    showReadingTime: boolean;
    feedOptions: {
      type?: FeedType[] | null;
      title?: string;
      description?: string;
      copyright: string;
      language?: string;
    };
    editUrl?: string | EditUrlFunction;
    editLocalizedFiles?: boolean;
    admonitions: Record<string, unknown>;
    authorsMapPath: string;
    readingTime: ReadingTimeFunctionOption;
    sortPosts: 'ascending' | 'descending';
  };
  // Options, as provided in the user config (before normalization)
  export type Options = Overwrite<
    Partial<PluginOptions>,
    {feedOptions?: UserFeedOptions}
  >;
}

declare module '@theme/BlogSidebar' {
  export type BlogSidebarItem = {title: string; permalink: string};
  export type BlogSidebar = {
    title: string;
    items: BlogSidebarItem[];
  };

  export interface Props {
    readonly sidebar: BlogSidebar;
  }

  const BlogSidebar: (props: Props) => JSX.Element;
  export default BlogSidebar;
}

declare module '@theme/BlogPostPage' {
  import type {BlogSidebar} from '@theme/BlogSidebar';
  import type {TOCItem} from '@docusaurus/types';
  import type {
    BlogPostFrontMatter,
    Author,
    Assets,
  } from '@docusaurus/plugin-content-blog';

  export type FrontMatter = BlogPostFrontMatter;

  export type Metadata = {
    readonly title: string;
    readonly date: string;
    readonly formattedDate: string;
    readonly permalink: string;
    readonly description?: string;
    readonly editUrl?: string;
    readonly readingTime?: number;
    readonly truncated?: string;
    readonly nextItem?: {readonly title: string; readonly permalink: string};
    readonly prevItem?: {readonly title: string; readonly permalink: string};
    readonly authors: Author[];
    readonly frontMatter: FrontMatter & Record<string, unknown>;
    readonly tags: readonly {
      readonly label: string;
      readonly permalink: string;
    }[];
  };

  export type Content = {
    readonly frontMatter: FrontMatter;
    readonly assets: Assets;
    readonly metadata: Metadata;
    readonly toc: readonly TOCItem[];
    (): JSX.Element;
  };

  export interface Props {
    readonly sidebar: BlogSidebar;
    readonly content: Content;
  }

  const BlogPostPage: (props: Props) => JSX.Element;
  export default BlogPostPage;
}

declare module '@theme/BlogListPage' {
  import type {Content} from '@theme/BlogPostPage';
  import type {BlogSidebar} from '@theme/BlogSidebar';

  export type Metadata = {
    readonly blogTitle: string;
    readonly blogDescription: string;
    readonly nextPage?: string;
    readonly page: number;
    readonly permalink: string;
    readonly postsPerPage: number;
    readonly previousPage?: string;
    readonly totalCount: number;
    readonly totalPages: number;
  };

  export interface Props {
    readonly sidebar: BlogSidebar;
    readonly metadata: Metadata;
    readonly items: readonly {readonly content: Content}[];
  }

  const BlogListPage: (props: Props) => JSX.Element;
  export default BlogListPage;
}

declare module '@theme/BlogTagsListPage' {
  import type {BlogSidebar} from '@theme/BlogSidebar';

  export type Tag = {
    permalink: string;
    name: string;
    count: number;
    allTagsPath: string;
    slug: string;
  };

  export interface Props {
    readonly sidebar: BlogSidebar;
    readonly tags: Readonly<Record<string, Tag>>;
  }

  const BlogTagsListPage: (props: Props) => JSX.Element;
  export default BlogTagsListPage;
}

declare module '@theme/BlogTagsPostsPage' {
  import type {BlogSidebar} from '@theme/BlogSidebar';
  import type {Tag} from '@theme/BlogTagsListPage';
  import type {Content} from '@theme/BlogPostPage';

  export interface Props {
    readonly sidebar: BlogSidebar;
    readonly metadata: Tag;
    readonly items: readonly {readonly content: Content}[];
  }

  const BlogTagsPostsPage: (props: Props) => JSX.Element;
  export default BlogTagsPostsPage;
}

declare module '@theme/BlogArchivePage' {
  import type {Content} from '@theme/BlogPostPage';

  export type ArchiveBlogPost = Content;

  export interface Props {
    readonly archive: {
      readonly blogPosts: readonly ArchiveBlogPost[];
    };
  }

  export default function BlogArchivePage(props: Props): JSX.Element;
}
