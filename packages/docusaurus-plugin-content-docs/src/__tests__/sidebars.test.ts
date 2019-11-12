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
  const fixtureDir = path.join(__dirname, '__fixtures__', 'sidebars');
  test('sidebars with known sidebar item type', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars.json');
    const result = loadSidebars([sidebarPath]);
    expect(result).toMatchSnapshot();
  });

  test('sidebars with deep level of category', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-category.js');
    const result = loadSidebars([sidebarPath]);
    expect(result).toMatchSnapshot();
  });

  test('sidebars with category but category.items is not an array', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-category-wrong-items.json',
    );
    expect(() =>
      loadSidebars([sidebarPath]),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error loading \\"Category Label\\" category. Category items must be array."`,
    );
  });

  test('sidebars with unknown sidebar item type', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-unknown-type.json');
    expect(() =>
      loadSidebars([sidebarPath]),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unknown sidebar item type: superman"`,
    );
  });

  test('sidebars with known sidebar item type but wrong field', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-wrong-field.json');
    expect(() =>
      loadSidebars([sidebarPath]),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unknown sidebar item keys: href. Item: {\\"type\\":\\"category\\",\\"label\\":\\"category\\",\\"href\\":\\"https://github.com\\"}"`,
    );
  });

  test('no sidebars', () => {
    const result = loadSidebars(null);
    expect(result).toEqual({});
  });
});
