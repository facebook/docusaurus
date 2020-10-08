/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {isSamePath} from '../utils';

describe('isSamePath', () => {
  test('should be true for compared path without trailing slash', () => {
    expect(isSamePath('/docs', '/docs')).toBeTruthy();
  });

  test('should be true for compared path with trailing slash', () => {
    expect(isSamePath('/docs', '/docs')).toBeTruthy();
  });

  test('should be false for compared path with double trailing slash', () => {
    expect(isSamePath('/docs', '/docs//')).toBeFalsy();
  });
});
