/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {isSocialCardFunction} from '../isSocialCardFunction';

describe('isSocialCardFunction', () => {
  it('correctly identifies social card service url function', () => {
    expect(isSocialCardFunction(() => 'a social card service url')).toBe(true);
  });

  it('correctly identifies social card url string', () => {
    expect(isSocialCardFunction('a social card url')).toBe(false);
  });
});
