/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import isInternalUrl from '../isInternalUrl';

describe('isInternalUrl', () => {
  it('returns true for empty links', () => {
    expect(isInternalUrl('')).toBeTruthy();
  });

  it('returns true for root relative links', () => {
    expect(isInternalUrl('/foo/bar')).toBeTruthy();
  });

  it('returns true for relative links', () => {
    expect(isInternalUrl('foo/bar')).toBeTruthy();
  });

  it('returns false for HTTP links', () => {
    expect(isInternalUrl('http://foo.com')).toBeFalsy();
  });

  it('returns false for HTTPS links', () => {
    expect(isInternalUrl('https://foo.com')).toBeFalsy();
  });

  it('returns false for whatever protocol links', () => {
    expect(isInternalUrl('//foo.com')).toBeFalsy();
  });

  it('returns false for telephone links', () => {
    expect(isInternalUrl('tel:+1234567890')).toBeFalsy();
  });

  it('returns false for mailto links', () => {
    expect(isInternalUrl('mailto:someone@example.com')).toBeFalsy();
  });

  it('returns false for undefined links', () => {
    expect(isInternalUrl(undefined)).toBeFalsy();
  });
});
