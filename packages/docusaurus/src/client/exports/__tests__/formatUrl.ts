/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import formatUrl from '../formatUrl';

describe('formatUrl', () => {
  test('should return suffixed with a slash', () => {
    expect(formatUrl('https://foo.com')).toBe('https://foo.com/');
  });

  test('should keep URL params intact', () => {
    expect(formatUrl('https://foo.com?a=1')).toBe('https://foo.com/?a=1');
  });

  test('should not format invalid strings', () => {
    expect(formatUrl('foobar')).toBe('foobar');
  });
});
