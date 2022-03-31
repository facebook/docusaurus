/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {toggleListItem} from '../jsUtils';

describe('toggleListItem', () => {
  it('removes item already in list', () => {
    expect(toggleListItem([1, 2, 3], 2)).toEqual([1, 3]);
  });
  it('appends item not in list', () => {
    expect(toggleListItem([1, 2], 3)).toEqual([1, 2, 3]);
  });
});
