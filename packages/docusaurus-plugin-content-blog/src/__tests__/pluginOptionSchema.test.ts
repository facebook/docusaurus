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

describe('blog plugin options schema', () => {
  it('normalizes options', () => {
    const {value, error} = PluginOptionSchema.validate({});
    expect(value).toEqual(DEFAULT_OPTIONS);
    expect(error).toBeUndefined();
  });

  it('accepts correctly defined user options', () => {
    const userOptions = {
      ...DEFAULT_OPTIONS,
      feedOptions: {type: 'rss', title: 'myTitle'},
      path: 'not_blog',
      routeBasePath: 'myBlog',
      postsPerPage: 5,
      include: ['api/*', 'docs/*'],
    };
    const {value, error} = PluginOptionSchema.validate(userOptions);
    expect(value).toEqual({
      ...userOptions,
      feedOptions: {type: ['rss'], title: 'myTitle', copyright: ''},
    });
    expect(error).toBeUndefined();
  });

  it('accepts valid user options', async () => {
    const userOptions = {
      ...DEFAULT_OPTIONS,
      routeBasePath: 'myBlog',
      beforeDefaultRemarkPlugins: [],
      beforeDefaultRehypePlugins: [markdownPluginsFunctionStub],
      remarkPlugins: [[markdownPluginsFunctionStub, {option1: '42'}]],
      rehypePlugins: [
        markdownPluginsObjectStub,
        [markdownPluginsFunctionStub, {option1: '42'}],
      ],
    };
    const {value, error} = PluginOptionSchema.validate(userOptions);
    expect(value).toEqual(userOptions);
    expect(error).toBeUndefined();
  });

  it('throws Error in case of invalid options', () => {
    const {error} = PluginOptionSchema.validate({
      path: 'not_blog',
      postsPerPage: -1,
      include: ['api/*', 'docs/*'],
      routeBasePath: 'not_blog',
    });

    expect(error).toMatchSnapshot();
  });

  it('throws Error in case of invalid feed type', () => {
    const {error} = PluginOptionSchema.validate({
      feedOptions: {
        type: 'none',
      },
    });

    expect(error).toMatchSnapshot();
  });

  it('converts all feed type to array with other feed type', () => {
    const {value} = PluginOptionSchema.validate({
      feedOptions: {type: 'all'},
    });
    expect(value).toEqual({
      ...DEFAULT_OPTIONS,
      feedOptions: {type: ['rss', 'atom', 'json'], copyright: ''},
    });
  });

  it('accepts null type and return same', () => {
    const {value, error} = PluginOptionSchema.validate({
      feedOptions: {type: null},
    });
    expect(value).toEqual({
      ...DEFAULT_OPTIONS,
      feedOptions: {type: null},
    });
    expect(error).toBeUndefined();
  });

  it('contains array with rss + atom for missing feed type', () => {
    const {value} = PluginOptionSchema.validate({
      feedOptions: {},
    });
    expect(value).toEqual(DEFAULT_OPTIONS);
  });

  it('has array with rss + atom, title for missing feed type', () => {
    const {value} = PluginOptionSchema.validate({
      feedOptions: {title: 'title'},
    });
    expect(value).toEqual({
      ...DEFAULT_OPTIONS,
      feedOptions: {type: ['rss', 'atom'], title: 'title', copyright: ''},
    });
  });
});

describe('blog sidebar', () => {
  it('accepts 0 sidebar count', () => {
    const userOptions = {blogSidebarCount: 0};
    const {value, error} = PluginOptionSchema.validate(userOptions);
    expect(value).toEqual({...DEFAULT_OPTIONS, ...userOptions});
    expect(error).toBeUndefined();
  });

  it('accepts "ALL" sidebar count', () => {
    const userOptions = {blogSidebarCount: 'ALL'};
    const {value, error} = PluginOptionSchema.validate(userOptions);
    expect(value).toEqual({...DEFAULT_OPTIONS, ...userOptions});
    expect(error).toBeUndefined();
  });

  it('rejects "abcdef" sidebar count', () => {
    const userOptions = {blogSidebarCount: 'abcdef'};
    const {error} = PluginOptionSchema.validate(userOptions);
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: "blogSidebarCount" must be one of [ALL, number]]`,
    );
  });

  it('accepts "all posts" sidebar title', () => {
    const userOptions = {blogSidebarTitle: 'all posts'};
    const {value, error} = PluginOptionSchema.validate(userOptions);
    expect(value).toEqual({...DEFAULT_OPTIONS, ...userOptions});
    expect(error).toBeUndefined();
  });

  it('rejects 42 sidebar title', () => {
    const userOptions = {blogSidebarTitle: 42};
    const {error} = PluginOptionSchema.validate(userOptions);
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: "blogSidebarTitle" must be a string]`,
    );
  });
});
