/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {RemarkAndRehypePluginOptions} from '@docusaurus/mdx-loader';
import type {Tag} from '@docusaurus/utils';
import type {
  BrokenMarkdownLink,
  ContentPaths,
} from '@docusaurus/utils/lib/markdownLinks';

export type BlogContentPaths = ContentPaths;

export interface BlogContent {
  blogSidebarTitle: string;
  blogPosts: BlogPost[];
  blogListPaginated: BlogPaginated[];
  blogTags: BlogTags;
  blogTagsListPath: string | null;
}

export type FeedType = 'rss' | 'atom';

export type EditUrlFunction = (editUrlParams: {
  blogDirPath: string;
  blogPath: string;
  permalink: string;
  locale: string;
}) => string | undefined;

export interface PluginOptions extends RemarkAndRehypePluginOptions {
  id?: string;
  path: string;
  routeBasePath: string;
  archiveBasePath: string;
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
}

export interface BlogTags {
  [key: string]: BlogTag;
}

export interface BlogTag {
  name: string;
  items: string[];
  permalink: string;
}

export interface BlogPost {
  id: string;
  metadata: MetaData;
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
  items: string[];
}

// We allow passing custom fields to authors, e.g., twitter
export interface Author extends Record<string, unknown> {
  name?: string;
  imageURL?: string;
  url?: string;
  title?: string;
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
}

export interface Assets {
  image?: string;
  authorsImageUrls: (string | undefined)[]; // Array of same size as the original MetaData.authors array
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
