/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Joi from '@hapi/joi';

export const DefaultOptions = {
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
  path: Joi.string().default(DefaultOptions.path),
  routeBasePath: Joi.string().default(DefaultOptions.routeBasePath),
  include: Joi.array().items(Joi.string()).default(DefaultOptions.include),
  postsPerPage: Joi.number()
    .integer()
    .min(1)
    .default(DefaultOptions.postsPerPage),
  blogListComponent: Joi.string().default(DefaultOptions.blogListComponent),
  blogPostComponent: Joi.string().default(DefaultOptions.blogPostComponent),
  blogTagsListComponent: Joi.string().default(
    DefaultOptions.blogTagsListComponent,
  ),
  blogTagsPostsComponent: Joi.string().default(
    DefaultOptions.blogTagsPostsComponent,
  ),
  showReadingTime: Joi.bool().default(DefaultOptions.showReadingTime),
  remarkPlugins: Joi.array()
    .items(
      Joi.alternatives().try(
        Joi.function(),
        Joi.array()
          .items(Joi.function().required(), Joi.object().required())
          .length(2),
      ),
    )
    .default(DefaultOptions.remarkPlugins),
  rehypePlugins: Joi.array()
    .items(Joi.string())
    .default(DefaultOptions.rehypePlugins),
  editUrl: Joi.string().uri(),
  truncateMarker: Joi.object().default(DefaultOptions.truncateMarker),
  admonitions: Joi.object().default(DefaultOptions.admonitions),
  beforeDefaultRemarkPlugins: Joi.array()
    .items(Joi.object())
    .default(DefaultOptions.beforeDefaultRemarkPlugins),
  beforeDefaultRehypePlugins: Joi.array()
    .items(Joi.object())
    .default(DefaultOptions.beforeDefaultRehypePlugins),
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
  }).default(DefaultOptions.feedOptions),
});
