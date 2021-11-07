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
import {Overwrite} from 'utility-types';
import {BlogPostFrontMatter} from './blogFrontMatter';

export type BlogContentPaths = ContentPaths;

export interface BlogContent {
  blogSidebarTitle: string;
  blogPosts: BlogPost[];
  blogListPaginated: BlogPaginated[];
  blogTags: BlogTags;
  blogTagsListPath: string | null;
}

export type FeedType = 'rss' | 'atom';

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

export type EditUrlFunction = (editUrlParams: {
  blogDirPath: string;
  blogPath: string;
  permalink: string;
  locale: string;
}) => string | undefined;

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
  readingTime: ReadingTimeFunctionOption;
};

// Options, as provided in the user config (before normalization)
export type UserPluginOptions = Overwrite<
  Partial<PluginOptions>,
  {feedOptions?: UserFeedOptions}
>;

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
