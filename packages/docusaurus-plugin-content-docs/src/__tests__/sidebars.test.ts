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
      `"Error loading {\\"type\\":\\"category\\",\\"label\\":\\"Category Label\\",\\"items\\":\\"doc1\\"}. \\"items\\" must be array."`,
    );
  });

  test('sidebars with category but category label is not a string', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-category-wrong-label.json',
    );
    expect(() =>
      loadSidebars([sidebarPath]),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error loading {\\"type\\":\\"category\\",\\"label\\":true,\\"items\\":[\\"doc1\\"]}. \\"label\\" should have been a string."`,
    );
  });

  test('sidebars item doc but id is not a string', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-doc-id-not-string.json',
    );
    expect(() =>
      loadSidebars([sidebarPath]),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error loading {\\"type\\":\\"doc\\",\\"id\\":[\\"doc1\\"]}. \\"id\\" should have been a string."`,
    );
  });

  test('sidebars with first level not a category', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-first-level-not-category.js',
    );
    const result = loadSidebars([sidebarPath]);
    expect(result).toMatchSnapshot();
  });

  test('sidebars link', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link.json');
    const result = loadSidebars([sidebarPath]);
    expect(result).toMatchSnapshot();
  });

  test('sidebars link wrong label', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link-wrong-label.json');
    expect(() =>
      loadSidebars([sidebarPath]),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error loading {\\"type\\":\\"link\\",\\"label\\":false,\\"href\\":\\"https://github.com\\"}. \\"id\\" should have been a string."`,
    );
  });

  test('sidebars link wrong href', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link-wrong-href.json');
    expect(() =>
      loadSidebars([sidebarPath]),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error loading {\\"type\\":\\"link\\",\\"label\\":\\"GitHub\\",\\"href\\":[\\"example.com\\"]}. \\"href\\" should have been a string."`,
    );
  });

  test('sidebars with invalid sidebar item', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-invalid-item.json');
    expect(() =>
      loadSidebars([sidebarPath]),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unknown sidebar item \\"{\\"a\\":\\"b\\",\\"c\\":\\"d\\"}\\"."`,
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
