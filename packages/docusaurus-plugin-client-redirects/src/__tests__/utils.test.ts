/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  addTrailingSlash,
  removeTrailingSlash,
  removeSuffix,
  getFilePathForRoutePath,
} from '../utils';

describe('addTrailingSlash', () => {
  test('should no-op', () => {
    expect(addTrailingSlash('/abcd/')).toEqual('/abcd/');
  });
  test('should add /', () => {
    expect(addTrailingSlash('/abcd')).toEqual('/abcd/');
  });
});

describe('removeTrailingSlash', () => {
  test('should no-op', () => {
    expect(removeTrailingSlash('/abcd')).toEqual('/abcd');
  });
  test('should remove /', () => {
    expect(removeTrailingSlash('/abcd/')).toEqual('/abcd');
  });
});

describe('removeSuffix', () => {
  test('should no-op 1', () => {
    expect(removeSuffix('abcdef', 'ijk')).toEqual('abcdef');
  });
  test('should no-op 2', () => {
    expect(removeSuffix('abcdef', 'abc')).toEqual('abcdef');
  });
  test('should no-op 3', () => {
    expect(removeSuffix('abcdef', '')).toEqual('abcdef');
  });
  test('should remove suffix', () => {
    expect(removeSuffix('abcdef', 'ef')).toEqual('abcd');
  });
});

describe('getFilePathForRoutePath', () => {
  test('works for /', () => {
    expect(getFilePathForRoutePath('/')).toEqual('/index.html');
  });
  test('works for /somePath', () => {
    expect(getFilePathForRoutePath('/somePath')).toEqual(
      '/somePath/index.html',
    );
  });
  test('works for /somePath/', () => {
    expect(getFilePathForRoutePath('/somePath/')).toEqual(
      '/somePath/index.html',
    );
  });
});
