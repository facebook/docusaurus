/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Joi from '@hapi/joi';

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
  postsPerPage: 10,
  include: ['*.md', '*.mdx'],
  routeBasePath: 'blog',
  path: 'blog',
};

export const PluginOptionSchema = Joi.object({
  path: Joi.string().default(DEFAULT_OPTIONS.path),
  routeBasePath: Joi.string().default(DEFAULT_OPTIONS.routeBasePath),
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
  showReadingTime: Joi.bool().default(DEFAULT_OPTIONS.showReadingTime),
  remarkPlugins: Joi.array()
    .items(
      Joi.array()
        .items(Joi.function().required(), Joi.object().required())
        .length(2),
      Joi.function(),
    )
    .default(DEFAULT_OPTIONS.remarkPlugins),
  rehypePlugins: Joi.array()
    .items(
      Joi.array()
        .items(Joi.function().required(), Joi.object().required())
        .length(2),
      Joi.function(),
    )
    .default(DEFAULT_OPTIONS.rehypePlugins),
  editUrl: Joi.string().uri(),
  truncateMarker: Joi.object().default(DEFAULT_OPTIONS.truncateMarker),
  admonitions: Joi.object().default(DEFAULT_OPTIONS.admonitions),
  beforeDefaultRemarkPlugins: Joi.array()
    .items(Joi.object())
    .default(DEFAULT_OPTIONS.beforeDefaultRemarkPlugins),
  beforeDefaultRehypePlugins: Joi.array()
    .items(Joi.object())
    .default(DEFAULT_OPTIONS.beforeDefaultRehypePlugins),
  feedOptions: Joi.object({
    type: Joi.alternatives().conditional(
      Joi.string().equal('all', 'rss', 'atom'),
      {
        then: Joi.custom((val) => (val === 'all' ? ['rss', 'atom'] : [val])),
      },
    ),
    title: Joi.string(),
    description: Joi.string(),
    copyright: Joi.string(),
    language: Joi.string(),
  }).default(DEFAULT_OPTIONS.feedOptions),
});
