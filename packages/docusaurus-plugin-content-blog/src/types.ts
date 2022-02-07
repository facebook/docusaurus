/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Tag} from '@docusaurus/utils';
import type {
  BrokenMarkdownLink,
  ContentPaths,
} from '@docusaurus/utils/lib/markdownLinks';
import type {
  BlogPostFrontMatter,
  Author,
} from '@docusaurus/plugin-content-blog';

export type BlogContentPaths = ContentPaths;

export interface BlogContent {
  blogSidebarTitle: string;
  blogPosts: BlogPost[];
  blogListPaginated: BlogPaginated[];
  blogTags: BlogTags;
  blogTagsListPath: string | null;
}

export interface BlogTags {
  // TODO, the key is the tag slug/permalink
  // This is due to legacy frontmatter: tags:
  // [{label: "xyz", permalink: "/1"}, {label: "xyz", permalink: "/2"}]
  // Soon we should forbid declaring permalink through frontmatter
  [tagKey: string]: BlogTag;
}

export interface BlogTag {
  name: string;
  items: string[]; // blog post permalinks
  permalink: string;
  pages: BlogPaginated[];
}

export interface BlogPost {
  id: string;
  metadata: MetaData;
  content: string;
}

export interface BlogPaginatedMetadata {
  permalink: string;
  page: number;
  postsPerPage: number;
  totalPages: number;
  totalCount: number;
  previousPage: string | null;
  nextPage: string | null;
  blogTitle: string;
  blogDescription: string;
}

export interface BlogPaginated {
  metadata: BlogPaginatedMetadata;
  items: string[]; // blog post permalinks
}

export interface MetaData {
  permalink: string;
  source: string;
  description: string;
  date: Date;
  formattedDate: string;
  tags: Tag[];
  title: string;
  readingTime?: number;
  prevItem?: Paginator;
  nextItem?: Paginator;
  truncated: boolean;
  editUrl?: string;
  authors: Author[];
  frontMatter: BlogPostFrontMatter & Record<string, unknown>;
}

export interface Paginator {
  title: string;
  permalink: string;
}

export interface BlogItemsToMetadata {
  [key: string]: MetaData;
}

export interface TagsModule {
  [key: string]: TagModule;
}

export interface TagModule {
  allTagsPath: string;
  slug: string;
  name: string;
  count: number;
  permalink: string;
}

export type BlogBrokenMarkdownLink = BrokenMarkdownLink<BlogContentPaths>;
export type BlogMarkdownLoaderOptions = {
  siteDir: string;
  contentPaths: BlogContentPaths;
  truncateMarker: RegExp;
  sourceToPermalink: Record<string, string>;
  onBrokenMarkdownLink: (brokenMarkdownLink: BlogBrokenMarkdownLink) => void;
};
