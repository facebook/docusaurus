/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {simpleHash, docuHash} from '../hashUtils';

describe('hashUtils', () => {
  test('simpleHash', () => {
    const asserts: Record<string, string> = {
      '': 'd41',
      '/foo-bar': '096',
      '/foo/bar': '1df',
      '/endi/lie': '9fa',
      '/endi-lie': 'fd3',
      '/yangshun/tay': '48d',
      '/yangshun-tay': 'f3b',
      '/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar':
        'd46',
      '/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/test1-test2':
        '787',
    };
    Object.keys(asserts).forEach((str) => {
      expect(simpleHash(str, 3)).toBe(asserts[str]);
    });
  });
});

describe('docuHash', () => {
  test('docuHash works', () => {
    const asserts: Record<string, string> = {
      '': '-d41',
      '/': 'index',
      '/foo-bar': 'foo-bar-096',
      '/foo/bar': 'foo-bar-1df',
      '/endi/lie': 'endi-lie-9fa',
      '/endi-lie': 'endi-lie-fd3',
      '/yangshun/tay': 'yangshun-tay-48d',
      '/yangshun-tay': 'yangshun-tay-f3b',
      '/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar':
        'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo--d46',
      '/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/test1-test2':
        'foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-foo-bar-test-1-test--787',
    };
    Object.keys(asserts).forEach((file) => {
      expect(docuHash(file)).toBe(asserts[file]);
    });
  });
});
