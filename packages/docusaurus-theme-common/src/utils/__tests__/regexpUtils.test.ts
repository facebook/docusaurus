/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {isRegexpStringMatch} from '../regexpUtils';

describe('isRegexpStringMatch', () => {
  it('works', () => {
    expect(isRegexpStringMatch(undefined, 'foo')).toBe(false);
    expect(isRegexpStringMatch('bar', undefined)).toBe(false);
    expect(isRegexpStringMatch('foo', 'bar')).toBe(false);
    expect(isRegexpStringMatch('foo', 'foo')).toBe(true);
    expect(isRegexpStringMatch('fooooooooooo', 'foo')).toBe(false);
    expect(isRegexpStringMatch('foo', 'fooooooo')).toBe(true);
    expect(isRegexpStringMatch('f.*o', 'fggo')).toBe(true);
    expect(isRegexpStringMatch('FOO', 'foo')).toBe(true);
  });
});
