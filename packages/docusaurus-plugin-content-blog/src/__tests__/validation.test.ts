/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema} from '../types';

const defaultOptions = {
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

test('normalize options', () => {
  const {value} = PluginOptionSchema.validate({});
  expect(value).toEqual(defaultOptions);
});

test('validate options', () => {
  const {value} = PluginOptionSchema.validate({
    path: 'not_blog',
    postsPerPage: 5,
    include: ['api/*', 'docs/*'],
    routeBasePath: 'not_blog',
  });
  expect(value).toEqual({
    ...defaultOptions,
    postsPerPage: 5,
    include: ['api/*', 'docs/*'],
    routeBasePath: 'not_blog',
    path: 'not_blog',
  });
});

test('throw Error in case of invalid options', () => {
  const {error} = PluginOptionSchema.validate({
    path: 'not_blog',
    postsPerPage: -1,
    include: ['api/*', 'docs/*'],
    routeBasePath: 'not_blog',
  });

  expect(error).toMatchSnapshot();
});

test('throw Error in case of invalid feedtype', () => {
  const {error} = PluginOptionSchema.validate({
    feedOptions: {
      type: 'none',
    },
  });

  expect(error).toMatchSnapshot();
});

test('conversion of truncateMarker to Regex', () => {
  const {value} = PluginOptionSchema.validate({
    truncateMarker: 'tag',
  });
  expect(value).toEqual({
    ...defaultOptions,
    truncateMarker: /tag/,
  });
});
