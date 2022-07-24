/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {isSocialCardString} from '@docusaurus/utils-common';

describe('isSocialCardString', () => {
  it('correctly identifies social card service url generator', () => {
    expect(
      isSocialCardString({
        getUrl: () => 'a social card service url',
        options: {},
      }),
    ).toBe(false);
  });

  it('correctly identifies social card string', () => {
    expect(isSocialCardString('a social card url')).toBe(true);
  });
});
