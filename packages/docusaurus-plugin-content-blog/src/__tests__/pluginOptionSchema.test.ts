/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema, DEFAULT_OPTIONS} from '../pluginOptionSchema';

// the type of remark/rehype plugins can be either function, object or array
const markdownPluginsFunctionStub = () => {};
const markdownPluginsObjectStub = {};

test('should normalize options', () => {
  const {value, error} = PluginOptionSchema.validate({});
  expect(value).toEqual(DEFAULT_OPTIONS);
  expect(error).toBe(undefined);
});

test('should accept correctly defined user options', () => {
  const userOptions = {
    ...DEFAULT_OPTIONS,
    feedOptions: {type: 'rss', title: 'myTitle'},
    path: 'not_blog',
    routeBasePath: '',
    postsPerPage: 5,
    include: ['api/*', 'docs/*'],
  };
  const {value, error} = PluginOptionSchema.validate(userOptions);
  expect(value).toEqual({
    ...userOptions,
    feedOptions: {type: ['rss'], title: 'myTitle'},
  });
  expect(error).toBe(undefined);
});

test('should accept valid user options', async () => {
  const userOptions = {
    ...DEFAULT_OPTIONS,
    routeBasePath: '',
    beforeDefaultRemarkPlugins: [],
    beforeDefaultRehypePlugins: [markdownPluginsFunctionStub],
    remarkPlugins: [[markdownPluginsFunctionStub, {option1: '42'}]],
    rehypePlugins: [
      markdownPluginsObjectStub,
      [markdownPluginsFunctionStub, {option1: '42'}],
    ],
  };
  const {value, error} = await PluginOptionSchema.validate(userOptions);
  expect(value).toEqual(userOptions);
  expect(error).toBe(undefined);
});

test('should throw Error in case of invalid options', () => {
  const {error} = PluginOptionSchema.validate({
    path: 'not_blog',
    postsPerPage: -1,
    include: ['api/*', 'docs/*'],
    routeBasePath: 'not_blog',
  });

  expect(error).toMatchSnapshot();
});

test('should throw Error in case of invalid feedtype', () => {
  const {error} = PluginOptionSchema.validate({
    feedOptions: {
      type: 'none',
    },
  });

  expect(error).toMatchSnapshot();
});

test('should convert all feed type to array with other feed type', () => {
  const {value} = PluginOptionSchema.validate({
    feedOptions: {type: 'all'},
  });
  expect(value).toEqual({
    ...DEFAULT_OPTIONS,
    feedOptions: {type: ['rss', 'atom']},
  });
});
