/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import applyTrailingSlash, {
  ApplyTrailingSlashParams,
} from '../applyTrailingSlash';

function params(
  trailingSlash: boolean | undefined,
  baseUrl: string = '/',
): ApplyTrailingSlashParams {
  return {trailingSlash, baseUrl};
}

describe('applyTrailingSlash', () => {
  test('should apply to empty', () => {
    expect(applyTrailingSlash('', params(true))).toEqual('/');
    expect(applyTrailingSlash('', params(false))).toEqual('');
    expect(applyTrailingSlash('', params(undefined))).toEqual('');
  });

  test('should not apply to /', () => {
    expect(applyTrailingSlash('/', params(true))).toEqual('/');
    expect(applyTrailingSlash('/', params(false))).toEqual('/');
    expect(applyTrailingSlash('/', params(undefined))).toEqual('/');

    expect(applyTrailingSlash('/?query#anchor', params(true))).toEqual(
      '/?query#anchor',
    );
    expect(applyTrailingSlash('/?query#anchor', params(false))).toEqual(
      '/?query#anchor',
    );
    expect(applyTrailingSlash('/?query#anchor', params(undefined))).toEqual(
      '/?query#anchor',
    );
  });

  test('should not apply to /baseUrl/', () => {
    const baseUrl = '/baseUrl/';
    expect(applyTrailingSlash('/baseUrl/', params(true, baseUrl))).toEqual(
      '/baseUrl/',
    );
    expect(applyTrailingSlash('/baseUrl/', params(false, baseUrl))).toEqual(
      '/baseUrl/',
    );
    expect(applyTrailingSlash('/baseUrl/', params(undefined, baseUrl))).toEqual(
      '/baseUrl/',
    );

    expect(
      applyTrailingSlash('/baseUrl/?query#anchor', params(true, baseUrl)),
    ).toEqual('/baseUrl/?query#anchor');
    expect(
      applyTrailingSlash('/baseUrl/?query#anchor', params(false, baseUrl)),
    ).toEqual('/baseUrl/?query#anchor');
    expect(
      applyTrailingSlash('/baseUrl/?query#anchor', params(undefined, baseUrl)),
    ).toEqual('/baseUrl/?query#anchor');
  });

  test('should not apply to #anchor links ', () => {
    expect(applyTrailingSlash('#', params(true))).toEqual('#');
    expect(applyTrailingSlash('#', params(false))).toEqual('#');
    expect(applyTrailingSlash('#', params(undefined))).toEqual('#');
    expect(applyTrailingSlash('#anchor', params(true))).toEqual('#anchor');
    expect(applyTrailingSlash('#anchor', params(false))).toEqual('#anchor');
    expect(applyTrailingSlash('#anchor', params(undefined))).toEqual('#anchor');
  });

  test('should apply to simple paths', () => {
    expect(applyTrailingSlash('abc', params(true))).toEqual('abc/');
    expect(applyTrailingSlash('abc', params(false))).toEqual('abc');
    expect(applyTrailingSlash('abc', params(undefined))).toEqual('abc');
    expect(applyTrailingSlash('abc/', params(true))).toEqual('abc/');
    expect(applyTrailingSlash('abc/', params(false))).toEqual('abc');
    expect(applyTrailingSlash('abc/', params(undefined))).toEqual('abc/');
    expect(applyTrailingSlash('/abc', params(true))).toEqual('/abc/');
    expect(applyTrailingSlash('/abc', params(false))).toEqual('/abc');
    expect(applyTrailingSlash('/abc', params(undefined))).toEqual('/abc');
    expect(applyTrailingSlash('/abc/', params(true))).toEqual('/abc/');
    expect(applyTrailingSlash('/abc/', params(false))).toEqual('/abc');
    expect(applyTrailingSlash('/abc/', params(undefined))).toEqual('/abc/');
  });

  test('should apply to path with #anchor', () => {
    expect(applyTrailingSlash('/abc#anchor', params(true))).toEqual(
      '/abc/#anchor',
    );
    expect(applyTrailingSlash('/abc#anchor', params(false))).toEqual(
      '/abc#anchor',
    );
    expect(applyTrailingSlash('/abc#anchor', params(undefined))).toEqual(
      '/abc#anchor',
    );
    expect(applyTrailingSlash('/abc/#anchor', params(true))).toEqual(
      '/abc/#anchor',
    );
    expect(applyTrailingSlash('/abc/#anchor', params(false))).toEqual(
      '/abc#anchor',
    );
    expect(applyTrailingSlash('/abc/#anchor', params(undefined))).toEqual(
      '/abc/#anchor',
    );
  });

  test('should apply to path with ?search', () => {
    expect(applyTrailingSlash('/abc?search', params(true))).toEqual(
      '/abc/?search',
    );
    expect(applyTrailingSlash('/abc?search', params(false))).toEqual(
      '/abc?search',
    );
    expect(applyTrailingSlash('/abc?search', params(undefined))).toEqual(
      '/abc?search',
    );
    expect(applyTrailingSlash('/abc/?search', params(true))).toEqual(
      '/abc/?search',
    );
    expect(applyTrailingSlash('/abc/?search', params(false))).toEqual(
      '/abc?search',
    );
    expect(applyTrailingSlash('/abc/?search', params(undefined))).toEqual(
      '/abc/?search',
    );
  });

  test('should apply to path with ?search#anchor', () => {
    expect(applyTrailingSlash('/abc?search#anchor', params(true))).toEqual(
      '/abc/?search#anchor',
    );
    expect(applyTrailingSlash('/abc?search#anchor', params(false))).toEqual(
      '/abc?search#anchor',
    );
    expect(applyTrailingSlash('/abc?search#anchor', params(undefined))).toEqual(
      '/abc?search#anchor',
    );
    expect(applyTrailingSlash('/abc/?search#anchor', params(true))).toEqual(
      '/abc/?search#anchor',
    );
    expect(applyTrailingSlash('/abc/?search#anchor', params(false))).toEqual(
      '/abc?search#anchor',
    );
    expect(
      applyTrailingSlash('/abc/?search#anchor', params(undefined)),
    ).toEqual('/abc/?search#anchor');
  });

  test('should apply to fully qualified urls', () => {
    expect(
      applyTrailingSlash('https://xyz.com/abc?search#anchor', params(true)),
    ).toEqual('https://xyz.com/abc/?search#anchor');
    expect(
      applyTrailingSlash('https://xyz.com/abc?search#anchor', params(false)),
    ).toEqual('https://xyz.com/abc?search#anchor');
    expect(
      applyTrailingSlash(
        'https://xyz.com/abc?search#anchor',
        params(undefined),
      ),
    ).toEqual('https://xyz.com/abc?search#anchor');
    expect(
      applyTrailingSlash('https://xyz.com/abc/?search#anchor', params(true)),
    ).toEqual('https://xyz.com/abc/?search#anchor');
    expect(
      applyTrailingSlash('https://xyz.com/abc/?search#anchor', params(false)),
    ).toEqual('https://xyz.com/abc?search#anchor');
    expect(
      applyTrailingSlash(
        'https://xyz.com/abc/?search#anchor',
        params(undefined),
      ),
    ).toEqual('https://xyz.com/abc/?search#anchor');
  });
});
