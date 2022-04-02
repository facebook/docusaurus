/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {BrokenMarkdownLink, ContentPaths} from '@docusaurus/utils';
import type {BlogPostMetadata} from '@docusaurus/plugin-content-blog';
import type {Metadata as BlogPaginatedMetadata} from '@theme/BlogListPage';

export type BlogContentPaths = ContentPaths;

export type BlogContent = {
  blogSidebarTitle: string;
  blogPosts: BlogPost[];
  blogListPaginated: BlogPaginated[];
  blogTags: BlogTags;
  blogTagsListPath: string | null;
};

export type BlogTags = {
  // TODO, the key is the tag slug/permalink
  // This is due to legacy frontmatter: tags:
  // [{label: "xyz", permalink: "/1"}, {label: "xyz", permalink: "/2"}]
  // Soon we should forbid declaring permalink through frontmatter
  [tagKey: string]: BlogTag;
};

export type BlogTag = {
  name: string;
  /** Blog post permalinks. */
  items: string[];
  permalink: string;
  pages: BlogPaginated[];
};

export type BlogPost = {
  id: string;
  metadata: BlogPostMetadata;
  content: string;
};

export type BlogPaginated = {
  metadata: BlogPaginatedMetadata;
  /** Blog post permalinks. */
  items: string[];
};

export type BlogBrokenMarkdownLink = BrokenMarkdownLink<BlogContentPaths>;
export type BlogMarkdownLoaderOptions = {
  siteDir: string;
  contentPaths: BlogContentPaths;
  truncateMarker: RegExp;
  sourceToPermalink: {[aliasedPath: string]: string};
  onBrokenMarkdownLink: (brokenMarkdownLink: BlogBrokenMarkdownLink) => void;
};
