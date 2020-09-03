/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Joi from '@hapi/joi';
import {
  RemarkPluginsSchema,
  RehypePluginsSchema,
  AdmonitionsSchema,
  URISchema,
} from '@docusaurus/utils-validation';

export const DEFAULT_OPTIONS = {
  feedOptions: {},
  beforeDefaultRehypePlugins: [],
  beforeDefaultRemarkPlugins: [],
  admonitions: {},
  truncateMarker: /<!--\s*(truncate)\s*-->/,
  rehypePlugins: [],
  remarkPlugins: [],
  showReadingTime: true,
  blogTagsPostsComponent: '@theme/BlogTagsPostsPage',
  blogTagsListComponent: '@theme/BlogTagsListPage',
  blogPostComponent: '@theme/BlogPostPage',
  blogListComponent: '@theme/BlogListPage',
  blogDescription: 'Blog',
  postsPerPage: 10,
  include: ['*.md', '*.mdx'],
  routeBasePath: 'blog',
  path: 'blog',
};

export const PluginOptionSchema = Joi.object({
  path: Joi.string().default(DEFAULT_OPTIONS.path),
  routeBasePath: Joi.string()
    // '' not allowed, see https://github.com/facebook/docusaurus/issues/3374
    // .allow('')
    .default(DEFAULT_OPTIONS.routeBasePath),
  include: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.include),
  postsPerPage: Joi.number()
    .integer()
    .min(1)
    .default(DEFAULT_OPTIONS.postsPerPage),
  blogListComponent: Joi.string().default(DEFAULT_OPTIONS.blogListComponent),
  blogPostComponent: Joi.string().default(DEFAULT_OPTIONS.blogPostComponent),
  blogTagsListComponent: Joi.string().default(
    DEFAULT_OPTIONS.blogTagsListComponent,
  ),
  blogTagsPostsComponent: Joi.string().default(
    DEFAULT_OPTIONS.blogTagsPostsComponent,
  ),
  blogDescription: Joi.string()
    .allow('')
    .default(DEFAULT_OPTIONS.blogDescription),
  showReadingTime: Joi.bool().default(DEFAULT_OPTIONS.showReadingTime),
  remarkPlugins: RemarkPluginsSchema.default(DEFAULT_OPTIONS.remarkPlugins),
  rehypePlugins: RehypePluginsSchema.default(DEFAULT_OPTIONS.rehypePlugins),
  admonitions: AdmonitionsSchema.default(DEFAULT_OPTIONS.admonitions),
  editUrl: URISchema,
  truncateMarker: Joi.object().default(DEFAULT_OPTIONS.truncateMarker),
  beforeDefaultRemarkPlugins: RemarkPluginsSchema.default(
    DEFAULT_OPTIONS.beforeDefaultRemarkPlugins,
  ),
  beforeDefaultRehypePlugins: RehypePluginsSchema.default(
    DEFAULT_OPTIONS.beforeDefaultRehypePlugins,
  ),
  feedOptions: Joi.object({
    type: Joi.alternatives().conditional(
      Joi.string().equal('all', 'rss', 'atom'),
      {
        then: Joi.custom((val) => (val === 'all' ? ['rss', 'atom'] : [val])),
      },
    ),
    title: Joi.string().allow(''),
    description: Joi.string().allow(''),
    copyright: Joi.string(),
    language: Joi.string(),
  }).default(DEFAULT_OPTIONS.feedOptions),
});
