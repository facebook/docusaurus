/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as yup from 'yup';

export const PluginOptionSchema = yup
  .object()
  .shape({
    path: yup.string().default('blog'),
    routeBasePath: yup.string().default('blog'),
    include: yup.array().of(yup.string()).default(['*.md', '*.mdx']),
    postsPerPage: yup.number().integer().moreThan(0).default(10),
    blogListComponent: yup.string().default('@theme/BlogListPage'),
    blogPostComponent: yup.string().default('@theme/BlogPostPage'),
    blogTagsListComponent: yup.string().default('@theme/BlogPostPage'),
    blogTagsPostsComponent: yup.string().default('@theme/BlogTagsPostsPage'),
    showReadingTime: yup.bool().default(true),
    remarkPlugins: yup.array().of(yup.object()).default([]),
    rehypePlugins: yup.array().of(yup.string()).default([]),
    editUrl: yup.string().url(),
    truncateMarker: yup
      .mixed()
      .transform((val) => new RegExp(val))
      .default(/<!--\s*(truncate)\s*-->/),
    admonitions: yup.object().default({}),
    beforeDefaultRemarkPlugins: yup.array().of(yup.object()).default([]),
    beforeDefaultRehypePlugins: yup.array().of(yup.object()).default([]),
    feedOptions: yup.object().shape({
      type: yup.string().oneOf(['rss', 'all', 'atom']),
      title: yup.string(),
      description: yup.string().default(''),
      copyright: yup.string().default(''),
      language: yup.string().default('en'),
    }),
  })
  .defined();

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

export interface ValidationResult {
  options?: yup.InferType<typeof PluginOptionSchema>;
  errors?: yup.ValidationError;
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
