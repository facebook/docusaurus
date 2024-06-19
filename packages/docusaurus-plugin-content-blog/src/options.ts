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
  RouteBasePathSchema,
  URISchema,
} from '@docusaurus/utils-validation';
import {GlobExcludeDefault} from '@docusaurus/utils';
import type {
  PluginOptions,
  Options,
  FeedType,
} from '@docusaurus/plugin-content-blog';
import type {OptionValidationContext} from '@docusaurus/types';

export const DEFAULT_OPTIONS: PluginOptions = {
  feedOptions: {type: ['rss', 'atom'], copyright: '', limit: 20},
  beforeDefaultRehypePlugins: [],
  beforeDefaultRemarkPlugins: [],
  admonitions: true,
  truncateMarker: /<!--\s*truncate\s*-->|\{\/\*\s*truncate\s*\*\/\}/,
  rehypePlugins: [],
  remarkPlugins: [],
  showReadingTime: true,
  blogTagsPostsComponent: '@theme/BlogTagsPostsPage',
  blogTagsListComponent: '@theme/BlogTagsListPage',
  blogPostComponent: '@theme/BlogPostPage',
  blogListComponent: '@theme/BlogListPage',
  blogArchiveComponent: '@theme/BlogArchivePage',
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
  pageBasePath: 'page',
  path: 'blog',
  editLocalizedFiles: false,
  authorsMapPath: 'authors.yml',
  readingTime: ({content, defaultReadingTime}) => defaultReadingTime({content}),
  sortPosts: 'descending',
  showLastUpdateTime: false,
  showLastUpdateAuthor: false,
  processBlogPosts: async () => undefined,
  onInlineTags: 'warn',
  tags: undefined,
};

const PluginOptionSchema = Joi.object<PluginOptions>({
  path: Joi.string().default(DEFAULT_OPTIONS.path),
  archiveBasePath: Joi.string()
    .default(DEFAULT_OPTIONS.archiveBasePath)
    .allow(null),
  routeBasePath: RouteBasePathSchema.default(DEFAULT_OPTIONS.routeBasePath),
  tagsBasePath: Joi.string().default(DEFAULT_OPTIONS.tagsBasePath),
  pageBasePath: Joi.string().default(DEFAULT_OPTIONS.pageBasePath),
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
  blogArchiveComponent: Joi.string().default(
    DEFAULT_OPTIONS.blogArchiveComponent,
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
        Joi.array().items(Joi.string().equal('rss', 'atom', 'json')),
        Joi.alternatives().conditional(
          Joi.string().equal('all', 'rss', 'atom', 'json'),
          {
            then: Joi.custom((val: FeedType | 'all') =>
              val === 'all' ? ['rss', 'atom', 'json'] : [val],
            ),
          },
        ),
      )
      .allow(null)
      .default(DEFAULT_OPTIONS.feedOptions.type),
    title: Joi.string().allow(''),
    description: Joi.string().allow(''),
    // Only add default value when user actually wants a feed (type is not null)
    copyright: Joi.when('type', {
      is: Joi.any().valid(null),
      then: Joi.string().optional(),
      otherwise: Joi.string()
        .allow('')
        .default(DEFAULT_OPTIONS.feedOptions.copyright),
    }),
    language: Joi.string(),
    createFeedItems: Joi.function(),
    limit: Joi.alternatives()
      .try(Joi.number(), Joi.valid(null), Joi.valid(false))
      .default(DEFAULT_OPTIONS.feedOptions.limit),
  }).default(DEFAULT_OPTIONS.feedOptions),
  authorsMapPath: Joi.string().default(DEFAULT_OPTIONS.authorsMapPath),
  readingTime: Joi.function().default(() => DEFAULT_OPTIONS.readingTime),
  sortPosts: Joi.string()
    .valid('descending', 'ascending')
    .default(DEFAULT_OPTIONS.sortPosts),
  showLastUpdateTime: Joi.bool().default(DEFAULT_OPTIONS.showLastUpdateTime),
  showLastUpdateAuthor: Joi.bool().default(
    DEFAULT_OPTIONS.showLastUpdateAuthor,
  ),
  processBlogPosts: Joi.function()
    .optional()
    .default(() => DEFAULT_OPTIONS.processBlogPosts),
  onInlineTags: Joi.string()
    .equal('ignore', 'log', 'warn', 'throw')
    .default(DEFAULT_OPTIONS.onInlineTags),
  tags: Joi.string()
    .disallow('')
    .allow(null, false)
    .default(() => DEFAULT_OPTIONS.tags),
}).default(DEFAULT_OPTIONS);

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options | undefined, PluginOptions>): PluginOptions {
  const validatedOptions = validate(PluginOptionSchema, options);
  return validatedOptions;
}
