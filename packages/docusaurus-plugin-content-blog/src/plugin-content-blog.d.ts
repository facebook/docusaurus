/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {FrontMatterTag} from '@docusaurus/utils';
import type {TOCItem} from '@docusaurus/types';

export type Options = Partial<import('./types').UserPluginOptions>;

// We allow passing custom fields to authors, e.g., twitter
export type Author = Record<string, unknown> & {
  name?: string;
  imageURL?: string;
  url?: string;
  title?: string;
};

export type BlogPostFrontMatterAuthor = Author & {
  key?: string;
};

// All the possible variants that the user can use for convenience
export type BlogPostFrontMatterAuthors =
  | string
  | BlogPostFrontMatterAuthor
  | (string | BlogPostFrontMatterAuthor)[];

export type BlogPostFrontMatter = {
  id?: string;
  title?: string;
  description?: string;
  tags?: FrontMatterTag[];
  slug?: string;
  draft?: boolean;
  date?: Date | string; // Yaml automagically convert some string patterns as Date, but not all

  authors?: BlogPostFrontMatterAuthors;

  // We may want to deprecate those older author frontmatter fields later:
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

export type Assets = {
  image?: string;
  authorsImageUrls: (string | undefined)[]; // Array of same size as the original MetaData.authors array
};

export type BlogPostMetadata = {
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
  readonly tags: readonly {
    readonly label: string;
    readonly permalink: string;
  }[];
  readonly frontMatter: BlogPostFrontMatter & Record<string, unknown>;
};

export type BlogPaginatedMetadata = {
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

export type Content = {
  readonly frontMatter: BlogPostFrontMatter;
  readonly assets: Assets;
  readonly metadata: BlogPostMetadata;
  readonly toc: readonly TOCItem[];
  (): JSX.Element;
};

export type PropBlogSidebarItem = {title: string; permalink: string};
export type PropBlogSidebar = {
  title: string;
  items: PropBlogSidebarItem[];
};

export type Tag = {
  permalink: string;
  name: string;
  count: number;
  allTagsPath: string;
  slug: string;
};
