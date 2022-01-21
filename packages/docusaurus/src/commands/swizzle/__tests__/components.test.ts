/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {readComponentNames} from '../components';

describe('readComponentNames', () => {
  test('read theme', () => {
    const themePath = path.join(__dirname, '__fixtures__', 'theme');
    expect(readComponentNames(themePath)).toMatchInlineSnapshot(`
      Array [
        "ComponentInFolder",
        "FirstLevelComponent",
      ]
    `);
  });
});
