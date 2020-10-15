/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */

declare module '@theme/BlogPostPage' {
  import type {MarkdownRightTableOfContents} from '@docusaurus/types';

  export type FrontMatter = {
    readonly title: string;
    readonly author?: string;
    readonly image?: string;
    readonly tags?: readonly string[];
    readonly keywords?: readonly string[];
    readonly author_url?: string;
    readonly authorURL?: string;
    readonly author_title?: string;
    readonly authorTitle?: string;
    readonly author_image_url?: string;
    readonly authorImageURL?: string;
    readonly hide_table_of_contents?: boolean;
  };

  export type Metadata = {
    readonly title: string;
    readonly date: string;
    readonly permalink: string;
    readonly description?: string;
    readonly editUrl?: string;
    readonly readingTime?: number;
    readonly truncated?: string;
    readonly nextItem?: {readonly title: string; readonly permalink: string};
    readonly prevItem?: {readonly title: string; readonly permalink: string};
    readonly tags: readonly {
      readonly label: string;
      readonly permalink: string;
    }[];
  };

  export type Content = {
    readonly frontMatter: FrontMatter;
    readonly metadata: Metadata;
    readonly rightToc: readonly MarkdownRightTableOfContents[];
    (): JSX.Element;
  };

  export type Props = {
    readonly content: Content;
  };

  const BlogPostPage: (props: Props) => JSX.Element;
  export default BlogPostPage;
}

declare module '@theme/BlogListPage' {
  // eslint-disable-next-line import/no-duplicates
  import type {Content} from '@theme/BlogPostPage';

  export type Item = {
    readonly content: () => JSX.Element;
  };

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

  export type Props = {
    readonly metadata: Metadata;
    readonly items: readonly {readonly content: Content}[];
  };

  const BlogListPage: (props: Props) => JSX.Element;
  export default BlogListPage;
}

declare module '@theme/BlogTagsListPage' {
  export type Tag = {
    permalink: string;
    name: string;
    count: number;
    allTagsPath: string;
    slug: string;
  };

  export type Props = {readonly tags: Readonly<Record<string, Tag>>};

  const BlogTagsListPage: (props: Props) => JSX.Element;
  export default BlogTagsListPage;
}

declare module '@theme/BlogTagsPostsPage' {
  import type {Tag} from '@theme/BlogTagsListPage';
  // eslint-disable-next-line import/no-duplicates
  import type {Content} from '@theme/BlogPostPage';

  export type Props = {
    readonly metadata: Tag;
    readonly items: readonly {readonly content: Content}[];
  };
}
