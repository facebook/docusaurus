/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema, DEFAULT_OPTIONS} from '../pluginOptionSchema';

test('normalize options', () => {
  const {value} = PluginOptionSchema.validate({});
  expect(value).toEqual(DEFAULT_OPTIONS);
});

test('validate options', () => {
  const {value} = PluginOptionSchema.validate({
    path: 'not_blog',
    postsPerPage: 5,
    include: ['api/*', 'docs/*'],
    routeBasePath: 'not_blog',
  });
  expect(value).toEqual({
    ...DEFAULT_OPTIONS,
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

test('convert all feed type to array with other feed type', () => {
  const {value} = PluginOptionSchema.validate({
    feedOptions: {type: 'all'},
  });
  expect(value).toEqual({
    ...DEFAULT_OPTIONS,
    feedOptions: {type: ['rss', 'atom']},
  });
});
