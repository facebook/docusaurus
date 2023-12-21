/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizePluginOptions} from '@docusaurus/utils-validation';
import {validateOptions, DEFAULT_OPTIONS} from '../options';
import type {Options, PluginOptions} from '@docusaurus/plugin-content-blog';
import type {Validate} from '@docusaurus/types';

function testValidate(options?: Options) {
  return validateOptions({
    validate: normalizePluginOptions as Validate<
      Options | undefined,
      PluginOptions
    >,
    options,
  });
}

// The type of remark/rehype plugins can be either function, object or array
const markdownPluginsFunctionStub = () => {};
const markdownPluginsObjectStub = {};

const defaultOptions = {...DEFAULT_OPTIONS, id: 'default'};

describe('validateOptions', () => {
  it('returns default options for undefined user options', () => {
    expect(testValidate(undefined)).toEqual(defaultOptions);
  });

  it('returns default options for empty user options', () => {
    expect(testValidate({})).toEqual(defaultOptions);
  });

  it('accepts correctly defined user options', () => {
    const userOptions = {
      ...defaultOptions,
      feedOptions: {type: 'rss' as const, title: 'myTitle'},
      path: 'not_blog',
      routeBasePath: '/myBlog',
      postsPerPage: 5,
      include: ['api/*', 'docs/*'],
    };
    expect(testValidate(userOptions)).toEqual({
      ...userOptions,
      feedOptions: {type: ['rss'], title: 'myTitle', copyright: '', limit: 20},
    });
  });

  it('accepts valid user options', () => {
    const userOptions: Options = {
      ...defaultOptions,
      routeBasePath: '/myBlog',
      beforeDefaultRemarkPlugins: [],
      beforeDefaultRehypePlugins: [markdownPluginsFunctionStub],
      remarkPlugins: [[markdownPluginsFunctionStub, {option1: '42'}]],
      rehypePlugins: [
        markdownPluginsObjectStub,
        [markdownPluginsFunctionStub, {option1: '42'}],
      ],
    };
    expect(testValidate(userOptions)).toEqual(userOptions);
  });

  it('throws Error in case of invalid options', () => {
    expect(() =>
      testValidate({
        path: 'not_blog',
        postsPerPage: -1,
        include: ['api/*', 'docs/*'],
        routeBasePath: 'not_blog',
      }),
    ).toThrowErrorMatchingSnapshot();
  });

  it('throws Error in case of invalid feed type', () => {
    expect(() =>
      testValidate({
        feedOptions: {
          // @ts-expect-error: test
          type: 'none',
        },
      }),
    ).toThrowErrorMatchingSnapshot();
  });

  it('converts all feed type to array with other feed type', () => {
    expect(
      testValidate({
        feedOptions: {type: 'all'},
      }),
    ).toEqual({
      ...defaultOptions,
      feedOptions: {type: ['rss', 'atom', 'json'], copyright: '', limit: 20},
    });
  });

  it('accepts null type and return same', () => {
    expect(
      testValidate({
        feedOptions: {type: null},
      }),
    ).toEqual({
      ...defaultOptions,
      feedOptions: {type: null, limit: 20},
    });
  });

  it('contains array with rss + atom for missing feed type', () => {
    expect(
      testValidate({
        feedOptions: {},
      }),
    ).toEqual(defaultOptions);
  });

  it('has array with rss + atom, title for missing feed type', () => {
    expect(
      testValidate({
        feedOptions: {title: 'title'},
      }),
    ).toEqual({
      ...defaultOptions,
      feedOptions: {
        type: ['rss', 'atom'],
        title: 'title',
        copyright: '',
        limit: 20,
      },
    });
  });

  it('accepts 0 sidebar count', () => {
    const userOptions = {blogSidebarCount: 0};
    expect(testValidate(userOptions)).toEqual({
      ...defaultOptions,
      ...userOptions,
    });
  });

  it('accepts "ALL" sidebar count', () => {
    const userOptions = {blogSidebarCount: 'ALL' as const};
    expect(testValidate(userOptions)).toEqual({
      ...defaultOptions,
      ...userOptions,
    });
  });

  it('rejects "abcdef" sidebar count', () => {
    const userOptions = {blogSidebarCount: 'abcdef'};
    // @ts-expect-error: test
    expect(() => testValidate(userOptions)).toThrowErrorMatchingInlineSnapshot(
      `""blogSidebarCount" must be one of [ALL, number]"`,
    );
  });

  it('accepts "all posts" sidebar title', () => {
    const userOptions = {blogSidebarTitle: 'all posts'};
    expect(testValidate(userOptions)).toEqual({
      ...defaultOptions,
      ...userOptions,
    });
  });

  it('rejects 42 sidebar title', () => {
    const userOptions = {blogSidebarTitle: 42};
    // @ts-expect-error: test
    expect(() => testValidate(userOptions)).toThrowErrorMatchingInlineSnapshot(
      `""blogSidebarTitle" must be a string"`,
    );
  });
});
