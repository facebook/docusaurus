/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema} from '../types';

test('normalize options', async () => {
  let options = await PluginOptionSchema.validate({});
  expect(options).toEqual({
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
  });
});

test('validate options', async () => {
  let options = await PluginOptionSchema.validate({
    path: 'not_blog',
    postsPerPage: 5,
    include: ['api/*', 'docs/*'],
    routeBasePath: 'not_blog',
  });
  expect(options).toEqual({
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
    postsPerPage: 5,
    include: ['api/*', 'docs/*'],
    routeBasePath: 'not_blog',
    path: 'not_blog',
  });
});

test('throw Error in case of invalid options', () => {
  expect(() => {
    PluginOptionSchema.validateSync({
      path: 'not_blog',
      postsPerPage: -1,
      include: ['api/*', 'docs/*'],
      routeBasePath: 'not_blog',
    });
  }).toThrow();
});

test('throw Error in case of invalid feedtype', () => {
  expect(() => {
    PluginOptionSchema.validateSync({
      feedOptions: {
        type: 'none',
      },
    });
  }).toThrow();
});

test('conversion of truncateMarker to Regex', async () => {
  let options = await PluginOptionSchema.validate({
    truncateMarker: 'tag',
  });
  expect(options).toEqual({
    feedOptions: {},
    beforeDefaultRehypePlugins: [],
    beforeDefaultRemarkPlugins: [],
    admonitions: {},
    truncateMarker: /tag/,
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
  });
});
