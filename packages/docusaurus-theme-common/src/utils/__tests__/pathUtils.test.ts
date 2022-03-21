/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {isSamePath} from '../pathUtils';

describe('isSamePath', () => {
  it('returns true for compared path without trailing slash', () => {
    expect(isSamePath('/docs', '/docs')).toBeTruthy();
  });

  it('returns true for compared path with trailing slash', () => {
    expect(isSamePath('/docs', '/docs/')).toBeTruthy();
  });

  it('returns true for compared path with different case', () => {
    expect(isSamePath('/doCS', '/DOcs')).toBeTruthy();
  });

  it('returns true for compared path with different case + trailing slash', () => {
    expect(isSamePath('/doCS', '/DOcs/')).toBeTruthy();
  });

  it('returns false for compared path with double trailing slash', () => {
    expect(isSamePath('/docs', '/docs//')).toBeFalsy();
  });

  it('returns true for twice undefined/null', () => {
    expect(isSamePath(undefined, undefined)).toBeTruthy();
    expect(isSamePath(undefined, undefined)).toBeTruthy();
  });

  it('returns false when one undefined', () => {
    expect(isSamePath('/docs', undefined)).toBeFalsy();
    expect(isSamePath(undefined, '/docs')).toBeFalsy();
  });
});
