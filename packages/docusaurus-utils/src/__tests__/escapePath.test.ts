/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {escapePath} from '../escapePath';

describe('escapePath', () => {
  test('escapePath works', () => {
    const asserts: Record<string, string> = {
      'c:/aaaa\\bbbb': 'c:/aaaa\\\\bbbb',
      'c:\\aaaa\\bbbb\\★': 'c:\\\\aaaa\\\\bbbb\\\\★',
      '\\\\?\\c:\\aaaa\\bbbb': '\\\\\\\\?\\\\c:\\\\aaaa\\\\bbbb',
      'c:\\aaaa\\bbbb': 'c:\\\\aaaa\\\\bbbb',
      'foo\\bar': 'foo\\\\bar',
      'foo\\bar/lol': 'foo\\\\bar/lol',
      'website\\docs/**/*.{md,mdx}': 'website\\\\docs/**/*.{md,mdx}',
    };
    Object.keys(asserts).forEach((file) => {
      expect(escapePath(file)).toBe(asserts[file]);
    });
  });
});
