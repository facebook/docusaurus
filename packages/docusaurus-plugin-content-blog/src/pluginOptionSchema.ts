/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Joi,
  RemarkPluginsSchema,
  RehypePluginsSchema,
  AdmonitionsSchema,
  URISchema,
} from '@docusaurus/utils-validation';
import {GlobExcludeDefault} from '@docusaurus/utils';
import {PluginOptions} from './types';

export const DEFAULT_OPTIONS: PluginOptions = {
  feedOptions: {type: ['rss', 'atom'], copyright: ''},
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
  blogTitle: 'Blog',
  blogSidebarCount: 5,
  blogSidebarTitle: 'Recent posts',
  postsPerPage: 10,
  include: ['**/*.{md,mdx}'],
  exclude: GlobExcludeDefault,
  routeBasePath: 'blog',
  tagsBasePath: 'tags',
  archiveBasePath: 'archive',
  path: 'blog',
  editLocalizedFiles: false,
  authorsMapPath: 'authors.yml',
  readingTime: ({content, defaultReadingTime}) => defaultReadingTime({content}),
  sortPosts: 'descending',
};

export const PluginOptionSchema = Joi.object<PluginOptions>({
  path: Joi.string().default(DEFAULT_OPTIONS.path),
  archiveBasePath: Joi.string().default(DEFAULT_OPTIONS.archiveBasePath),
  routeBasePath: Joi.string()
    // '' not allowed, see https://github.com/facebook/docusaurus/issues/3374
    // .allow('')
    .default(DEFAULT_OPTIONS.routeBasePath),
  tagsBasePath: Joi.string().default(DEFAULT_OPTIONS.tagsBasePath),
  include: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.include),
  exclude: Joi.array().items(Joi.string()).default(DEFAULT_OPTIONS.exclude),
  postsPerPage: Joi.alternatives()
    .try(Joi.equal('ALL').required(), Joi.number().integer().min(1).required())
    .default(DEFAULT_OPTIONS.postsPerPage),
  blogListComponent: Joi.string().default(DEFAULT_OPTIONS.blogListComponent),
  blogPostComponent: Joi.string().default(DEFAULT_OPTIONS.blogPostComponent),
  blogTagsListComponent: Joi.string().default(
    DEFAULT_OPTIONS.blogTagsListComponent,
  ),
  blogTagsPostsComponent: Joi.string().default(
    DEFAULT_OPTIONS.blogTagsPostsComponent,
  ),
  blogTitle: Joi.string().allow('').default(DEFAULT_OPTIONS.blogTitle),
  blogDescription: Joi.string()
    .allow('')
    .default(DEFAULT_OPTIONS.blogDescription),
  blogSidebarCount: Joi.alternatives()
    .try(Joi.equal('ALL').required(), Joi.number().integer().min(0).required())
    .default(DEFAULT_OPTIONS.blogSidebarCount),
  blogSidebarTitle: Joi.string().default(DEFAULT_OPTIONS.blogSidebarTitle),
  showReadingTime: Joi.bool().default(DEFAULT_OPTIONS.showReadingTime),
  remarkPlugins: RemarkPluginsSchema.default(DEFAULT_OPTIONS.remarkPlugins),
  rehypePlugins: RehypePluginsSchema.default(DEFAULT_OPTIONS.rehypePlugins),
  admonitions: AdmonitionsSchema.default(DEFAULT_OPTIONS.admonitions),
  editUrl: Joi.alternatives().try(URISchema, Joi.function()),
  editLocalizedFiles: Joi.boolean().default(DEFAULT_OPTIONS.editLocalizedFiles),
  truncateMarker: Joi.object().default(DEFAULT_OPTIONS.truncateMarker),
  beforeDefaultRemarkPlugins: RemarkPluginsSchema.default(
    DEFAULT_OPTIONS.beforeDefaultRemarkPlugins,
  ),
  beforeDefaultRehypePlugins: RehypePluginsSchema.default(
    DEFAULT_OPTIONS.beforeDefaultRehypePlugins,
  ),
  feedOptions: Joi.object({
    type: Joi.alternatives()
      .try(
        Joi.array().items(Joi.string()),
        Joi.alternatives().conditional(
          Joi.string().equal('all', 'rss', 'atom'),
          {
            then: Joi.custom((val) =>
              val === 'all' ? ['rss', 'atom'] : [val],
            ),
          },
        ),
      )
      .allow(null)
      .default(DEFAULT_OPTIONS.feedOptions.type),
    title: Joi.string().allow(''),
    description: Joi.string().allow(''),
    // only add default value when user actually wants a feed (type is not null)
    copyright: Joi.when('type', {
      is: Joi.any().valid(null),
      then: Joi.string().optional(),
      otherwise: Joi.string()
        .allow('')
        .default(DEFAULT_OPTIONS.feedOptions.copyright),
    }),
    language: Joi.string(),
  }).default(DEFAULT_OPTIONS.feedOptions),
  authorsMapPath: Joi.string().default(DEFAULT_OPTIONS.authorsMapPath),
  readingTime: Joi.function().default(() => DEFAULT_OPTIONS.readingTime),
  sortPosts: Joi.string()
    .valid('descending', 'ascending')
    .default(DEFAULT_OPTIONS.sortPosts),
});
