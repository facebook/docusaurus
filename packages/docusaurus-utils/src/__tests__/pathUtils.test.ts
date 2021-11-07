/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {isNameTooLong, shortName} from '../pathUtils';

describe('pathUtils', () => {
  test('isNameTooLong', () => {
    const asserts: Record<string, boolean> = {
      '': false,
      'foo-bar-096': false,
      'foo-bar-1df': false,
      'endi-lie-9fa': false,
      'endi-lie-fd3': false,
      'yangshun-tay-48d': false,
      'yangshun-tay-f3b': false,
      'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-d46':
        true,
      'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-test-1-test-2-787':
        true,
    };
    Object.keys(asserts).forEach((path) => {
      expect(isNameTooLong(path)).toBe(asserts[path]);
    });
  });

  describe('shortName', () => {
    test('works', () => {
      const asserts: Record<string, string> = {
        '': '',
        'foo-bar': 'foo-bar',
        'endi-lie': 'endi-lie',
        'yangshun-tay': 'yangshun-tay',
        'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar':
          'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-',
        'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-test-1-test-2':
          'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-test-1-test-',
      };
      Object.keys(asserts).forEach((file) => {
        expect(shortName(file)).toBe(asserts[file]);
      });
    });

    // Based on https://github.com/gatsbyjs/gatsby/pull/21518/files

    const SHORT_PATH = `/short/path/without/trailing/slash`;
    const VERY_LONG_PATH = `/${`x`.repeat(256)}/`;
    const VERY_LONG_PATH_NON_LATIN = `/${`あ`.repeat(255)}/`;

    it(`Truncates long paths correctly`, () => {
      const truncatedPathLatin = shortName(VERY_LONG_PATH);
      const truncatedPathNonLatin = shortName(VERY_LONG_PATH_NON_LATIN);
      expect(truncatedPathLatin.length).toBeLessThanOrEqual(255);
      expect(truncatedPathNonLatin.length).toBeLessThanOrEqual(255);
    });

    it(`Does not truncate short paths`, () => {
      const truncatedPath = shortName(SHORT_PATH);
      expect(truncatedPath).toEqual(SHORT_PATH);
    });
  });
});
