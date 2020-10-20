/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type BlogContentPaths = {
  contentPath: string;
  contentPathLocalized: string;
};

export interface BlogContent {
  blogPosts: BlogPost[];
  blogListPaginated: BlogPaginated[];
  blogTags: BlogTags;
  blogTagsListPath: string | null;
}

export interface DateLink {
  date: Date;
  link: string;
}

export type FeedType = 'rss' | 'atom';

export interface PluginOptions {
  id?: string;
  path: string;
  routeBasePath: string;
  include: string[];
  postsPerPage: number;
  blogListComponent: string;
  blogPostComponent: string;
  blogTagsListComponent: string;
  blogTagsPostsComponent: string;
  blogTitle: string;
  blogDescription: string;
  blogSidebarCount: number | 'ALL';
  blogSidebarTitle: string;
  remarkPlugins: ([Function, object] | Function)[];
  beforeDefaultRehypePlugins: ([Function, object] | Function)[];
  beforeDefaultRemarkPlugins: ([Function, object] | Function)[];
  rehypePlugins: string[];
  truncateMarker: RegExp;
  showReadingTime: boolean;
  feedOptions: {
    type: [FeedType];
    title?: string;
    description?: string;
    copyright: string;
    language?: string;
  };
  editUrl?: string;
  admonitions: any;
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

export interface MetaData {
  permalink: string;
  source: string;
  description: string;
  date: Date;
  tags: (Tag | string)[];
  title: string;
  readingTime?: number;
  prevItem?: Paginator;
  nextItem?: Paginator;
  truncated: boolean;
  editUrl?: string;
}

export interface Paginator {
  title: string;
  permalink: string;
}

export interface Tag {
  label: string;
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

export type BlogBrokenMarkdownLink = {
  folderPath: string;
  filePath: string;
  link: string;
};
export type BlogMarkdownLoaderOptions = {
  siteDir: string;
  contentPaths: BlogContentPaths;
  truncateMarker: RegExp;
  blogPosts: BlogPost[];
  onBrokenMarkdownLink: (brokenMarkdownLink: BlogBrokenMarkdownLink) => void;
};
