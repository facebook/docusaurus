/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import applyTrailingSlash from '../applyTrailingSlash';

describe('applyTrailingSlash', () => {
  test('should apply to empty', () => {
    expect(applyTrailingSlash('', true)).toEqual('/');
    expect(applyTrailingSlash('', false)).toEqual('');
    expect(applyTrailingSlash('', undefined)).toEqual('');
  });

  test('should not apply to /', () => {
    expect(applyTrailingSlash('/', true)).toEqual('/');
    expect(applyTrailingSlash('/', false)).toEqual('/');
    expect(applyTrailingSlash('/', undefined)).toEqual('/');

    expect(applyTrailingSlash('/?query#anchor', true)).toEqual(
      '/?query#anchor',
    );
    expect(applyTrailingSlash('/?query#anchor', false)).toEqual(
      '/?query#anchor',
    );
    expect(applyTrailingSlash('/?query#anchor', undefined)).toEqual(
      '/?query#anchor',
    );
  });

  test('should not apply to #anchor links ', () => {
    expect(applyTrailingSlash('#', true)).toEqual('#');
    expect(applyTrailingSlash('#', false)).toEqual('#');
    expect(applyTrailingSlash('#', undefined)).toEqual('#');
    expect(applyTrailingSlash('#anchor', true)).toEqual('#anchor');
    expect(applyTrailingSlash('#anchor', false)).toEqual('#anchor');
    expect(applyTrailingSlash('#anchor', undefined)).toEqual('#anchor');
  });

  test('should apply to simple paths', () => {
    expect(applyTrailingSlash('abc', true)).toEqual('abc/');
    expect(applyTrailingSlash('abc', false)).toEqual('abc');
    expect(applyTrailingSlash('abc', undefined)).toEqual('abc');
    expect(applyTrailingSlash('abc/', true)).toEqual('abc/');
    expect(applyTrailingSlash('abc/', false)).toEqual('abc');
    expect(applyTrailingSlash('abc/', undefined)).toEqual('abc/');
    expect(applyTrailingSlash('/abc', true)).toEqual('/abc/');
    expect(applyTrailingSlash('/abc', false)).toEqual('/abc');
    expect(applyTrailingSlash('/abc', undefined)).toEqual('/abc');
    expect(applyTrailingSlash('/abc/', true)).toEqual('/abc/');
    expect(applyTrailingSlash('/abc/', false)).toEqual('/abc');
    expect(applyTrailingSlash('/abc/', undefined)).toEqual('/abc/');
  });

  test('should apply to path with #anchor', () => {
    expect(applyTrailingSlash('/abc#anchor', true)).toEqual('/abc/#anchor');
    expect(applyTrailingSlash('/abc#anchor', false)).toEqual('/abc#anchor');
    expect(applyTrailingSlash('/abc#anchor', undefined)).toEqual('/abc#anchor');
    expect(applyTrailingSlash('/abc/#anchor', true)).toEqual('/abc/#anchor');
    expect(applyTrailingSlash('/abc/#anchor', false)).toEqual('/abc#anchor');
    expect(applyTrailingSlash('/abc/#anchor', undefined)).toEqual(
      '/abc/#anchor',
    );
  });

  test('should apply to path with ?search', () => {
    expect(applyTrailingSlash('/abc?search', true)).toEqual('/abc/?search');
    expect(applyTrailingSlash('/abc?search', false)).toEqual('/abc?search');
    expect(applyTrailingSlash('/abc?search', undefined)).toEqual('/abc?search');
    expect(applyTrailingSlash('/abc/?search', true)).toEqual('/abc/?search');
    expect(applyTrailingSlash('/abc/?search', false)).toEqual('/abc?search');
    expect(applyTrailingSlash('/abc/?search', undefined)).toEqual(
      '/abc/?search',
    );
  });

  test('should apply to path with ?search#anchor', () => {
    expect(applyTrailingSlash('/abc?search#anchor', true)).toEqual(
      '/abc/?search#anchor',
    );
    expect(applyTrailingSlash('/abc?search#anchor', false)).toEqual(
      '/abc?search#anchor',
    );
    expect(applyTrailingSlash('/abc?search#anchor', undefined)).toEqual(
      '/abc?search#anchor',
    );
    expect(applyTrailingSlash('/abc/?search#anchor', true)).toEqual(
      '/abc/?search#anchor',
    );
    expect(applyTrailingSlash('/abc/?search#anchor', false)).toEqual(
      '/abc?search#anchor',
    );
    expect(applyTrailingSlash('/abc/?search#anchor', undefined)).toEqual(
      '/abc/?search#anchor',
    );
  });

  test('should apply to fully qualified urls', () => {
    expect(
      applyTrailingSlash('https://xyz.com/abc?search#anchor', true),
    ).toEqual('https://xyz.com/abc/?search#anchor');
    expect(
      applyTrailingSlash('https://xyz.com/abc?search#anchor', false),
    ).toEqual('https://xyz.com/abc?search#anchor');
    expect(
      applyTrailingSlash('https://xyz.com/abc?search#anchor', undefined),
    ).toEqual('https://xyz.com/abc?search#anchor');
    expect(
      applyTrailingSlash('https://xyz.com/abc/?search#anchor', true),
    ).toEqual('https://xyz.com/abc/?search#anchor');
    expect(
      applyTrailingSlash('https://xyz.com/abc/?search#anchor', false),
    ).toEqual('https://xyz.com/abc?search#anchor');
    expect(
      applyTrailingSlash('https://xyz.com/abc/?search#anchor', undefined),
    ).toEqual('https://xyz.com/abc/?search#anchor');
  });
});
