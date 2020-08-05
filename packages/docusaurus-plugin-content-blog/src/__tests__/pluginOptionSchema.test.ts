/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {PluginOptionSchema, DEFAULT_OPTIONS} from '../pluginOptionSchema';

// the type of remark/rehype plugins is function
const remarkRehypePluginStub = () => {};

test('should normalize options', () => {
  const {value} = PluginOptionSchema.validate({});
  expect(value).toEqual(DEFAULT_OPTIONS);
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
  const {value} = PluginOptionSchema.validate(userOptions);
  expect(value).toEqual({
    ...userOptions,
    feedOptions: {type: ['rss'], title: 'myTitle'},
  });
});

test('should accept valid user options', async () => {
  const userOptions = {
    ...DEFAULT_OPTIONS,
    routebasePath: '',
    beforeDefaultRemarkPlugins: [],
    beforeDefaultRehypePlugins: [remarkRehypePluginStub],
    remarkPlugins: [remarkRehypePluginStub, {option1: '42'}],
    rehypePlugins: [
      remarkRehypePluginStub,
      [remarkRehypePluginStub, {option1: '42'}],
    ],
  };
  const {value} = await PluginOptionSchema.validate(userOptions);
  expect(value).toEqual(userOptions);
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
