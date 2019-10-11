/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import loadSidebars from '../sidebars';

/* eslint-disable global-require, import/no-dynamic-require */

describe('loadSidebars', () => {
  test('sidebars with known sidebar item type', async () => {
    const sidebarPath = path.join(
      __dirname,
      '__fixtures__',
      'website',
      'sidebars.json',
    );
    const result = loadSidebars(sidebarPath);
    expect(result).toMatchSnapshot();
  });

  test('sidebars with deep level of category', async () => {
    const sidebarPath = path.join(
      __dirname,
      '__fixtures__',
      'website',
      'sidebars-category.js',
    );
    const result = loadSidebars(sidebarPath);
    expect(result).toMatchSnapshot();
  });

  test('sidebars with unknown sidebar item type', async () => {
    const sidebarPath = path.join(
      __dirname,
      '__fixtures__',
      'website',
      'bad-sidebars.json',
    );
    expect(() => loadSidebars(sidebarPath)).toThrowErrorMatchingInlineSnapshot(
      `"Unknown sidebar item type: superman"`,
    );
  });

  test('no sidebars', () => {
    const result = loadSidebars(null);
    expect(result).toEqual({});
  });
});
