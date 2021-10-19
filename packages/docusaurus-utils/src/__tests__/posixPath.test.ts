/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {posixPath} from '../posixPath';

describe('posixPath', () => {
  test('posixPath works', () => {
    const asserts: Record<string, string> = {
      'c:/aaaa\\bbbb': 'c:/aaaa/bbbb',
      'c:\\aaaa\\bbbb\\★': 'c:\\aaaa\\bbbb\\★',
      '\\\\?\\c:\\aaaa\\bbbb': '\\\\?\\c:\\aaaa\\bbbb',
      'c:\\aaaa\\bbbb': 'c:/aaaa/bbbb',
      'foo\\bar': 'foo/bar',
      'foo\\bar/lol': 'foo/bar/lol',
      'website\\docs/**/*.{md,mdx}': 'website/docs/**/*.{md,mdx}',
    };
    Object.keys(asserts).forEach((file) => {
      expect(posixPath(file)).toBe(asserts[file]);
    });
  });
});
