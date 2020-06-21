/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Joi from '@hapi/joi';

export const PluginOptionSchema = Joi.object({
  path: Joi.string().default('blog'),
  routeBasePath: Joi.string().default('blog'),
  include: Joi.array().items(Joi.string()).default(['*.md', '*.mdx']),
  postsPerPage: Joi.number().integer().min(1).default(10),
  blogListComponent: Joi.string().default('@theme/BlogListPage'),
  blogPostComponent: Joi.string().default('@theme/BlogPostPage'),
  blogTagsListComponent: Joi.string().default('@theme/BlogTagsListPage'),
  blogTagsPostsComponent: Joi.string().default('@theme/BlogTagsPostsPage'),
  showReadingTime: Joi.bool().default(true),
  remarkPlugins: Joi.array()
    .items(
      Joi.alternatives().try(
        Joi.function(),
        Joi.array()
          .items(Joi.function().required(), Joi.object().required())
          .length(2),
      ),
    )
    .default([]),
  rehypePlugins: Joi.array().items(Joi.string()).default([]),
  editUrl: Joi.string().uri(),
  truncateMarker: Joi.alternatives()
    .try(Joi.string(), Joi.object())
    .custom((value) => new RegExp(value))
    .default(/<!--\s*(truncate)\s*-->/),
  admonitions: Joi.object().default({}),
  beforeDefaultRemarkPlugins: Joi.array().items(Joi.object()).default([]),
  beforeDefaultRehypePlugins: Joi.array().items(Joi.object()).default([]),
  feedOptions: Joi.object({
    type: Joi.string().equal('all', 'rss', 'atom'),
    title: Joi.string(),
    description: Joi.string(),
    copyright: Joi.string(),
    language: Joi.string(),
  }).default({}),
});

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

export type FeedType = 'rss' | 'atom' | 'all';

export interface PluginOptions {
  path: string;
  routeBasePath: string;
  include: string[];
  postsPerPage: number;
  blogListComponent: string;
  blogPostComponent: string;
  blogTagsListComponent: string;
  blogTagsPostsComponent: string;
  remarkPlugins: ([Function, object] | Function)[];
  rehypePlugins: string[];
  truncateMarker: RegExp;
  showReadingTime: boolean;
  feedOptions: {
    type: FeedType;
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
