/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  addTrailingSlash,
  removeTrailingSlash,
  getFilePathForRoutePath,
} from '../utils';

describe('addTrailingSlash', () => {
  test('should noop', () => {
    expect(addTrailingSlash('/abcd/')).toEqual('/abcd/');
  });
  test('should add /', () => {
    expect(addTrailingSlash('/abcd')).toEqual('/abcd/');
  });
});

describe('removeTrailingSlash', () => {
  test('should noop', () => {
    expect(removeTrailingSlash('/abcd')).toEqual('/abcd');
  });
  test('should remove /', () => {
    expect(removeTrailingSlash('/abcd/')).toEqual('/abcd');
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
