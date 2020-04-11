/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import isInternalUrl from '../isInternalUrl';

describe('isInternalUrl', () => {
  test('should be true for root relative links', () => {
    expect(isInternalUrl('/foo/bar')).toBeTruthy();
  });

  test('should be true for relative links', () => {
    expect(isInternalUrl('foo/bar')).toBeTruthy();
  });

  test('should be false for HTTP links', () => {
    expect(isInternalUrl('http://foo.com')).toBeFalsy();
  });

  test('should be false for HTTPS links', () => {
    expect(isInternalUrl('https://foo.com')).toBeFalsy();
  });

  test('should be false for whatever protocol links', () => {
    expect(isInternalUrl('//foo.com')).toBeFalsy();
  });

  test('should be false for telephone links', () => {
    expect(isInternalUrl('tel:+1234567890')).toBeFalsy();
  });

  test('should be false for mailto links', () => {
    expect(isInternalUrl('mailto:someone@example.com')).toBeFalsy();
  });
});
