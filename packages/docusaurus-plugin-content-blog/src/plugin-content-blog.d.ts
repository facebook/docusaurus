/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/plugin-content-blog' {
  export type Options = Partial<import('./types').UserPluginOptions>;
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

  export type FrontMatter = import('./blogFrontMatter').BlogPostFrontMatter;
  export type Assets = import('./types').Assets;

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
    readonly authors: import('./types').Author[];
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
