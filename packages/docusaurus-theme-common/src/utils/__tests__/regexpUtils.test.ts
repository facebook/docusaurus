/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {isRegexpStringMatch} from '../regexpUtils';

describe('isRegexpStringMatch', () => {
  it('works', () => {
    expect(isRegexpStringMatch(undefined, 'foo')).toEqual(false);
    expect(isRegexpStringMatch('bar', undefined)).toEqual(false);
    expect(isRegexpStringMatch('foo', 'bar')).toEqual(false);
    expect(isRegexpStringMatch('foo', 'foo')).toEqual(true);
    expect(isRegexpStringMatch('fooooooooooo', 'foo')).toEqual(false);
    expect(isRegexpStringMatch('foo', 'fooooooo')).toEqual(true);
    expect(isRegexpStringMatch('f.*o', 'fggo')).toEqual(true);
    expect(isRegexpStringMatch('FOO', 'foo')).toEqual(true);
  });
});
