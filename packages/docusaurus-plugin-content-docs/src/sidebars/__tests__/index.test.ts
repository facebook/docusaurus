/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadSidebars, DisabledSidebars} from '../index';
import type {SidebarProcessorParams} from '../types';
import {DefaultSidebarItemsGenerator} from '../generator';

describe('loadSidebars', () => {
  const fixtureDir = path.join(__dirname, '__fixtures__', 'sidebars');
  const params: SidebarProcessorParams = {
    sidebarItemsGenerator: DefaultSidebarItemsGenerator,
    numberPrefixParser: (filename) => ({filename}),
    docs: [
      {
        source: '@site/docs/foo/bar.md',
        sourceDirName: 'foo',
        id: 'bar',
        frontMatter: {},
      },
    ],
    version: {contentPath: 'docs/foo', contentPathLocalized: 'docs/foo'},
    categoryLabelSlugger: null,
    sidebarOptions: {sidebarCollapsed: true, sidebarCollapsible: true},
  };
  test('sidebars with known sidebar item type', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars.json');
    const result = await loadSidebars(sidebarPath, params);
    expect(result).toMatchSnapshot();
  });

  test('sidebars with deep level of category', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-category.js');
    const result = await loadSidebars(sidebarPath, params);
    expect(result).toMatchSnapshot();
  });

  test('sidebars shorthand and longform lead to exact same sidebar', async () => {
    const sidebarPath1 = path.join(fixtureDir, 'sidebars-category.js');
    const sidebarPath2 = path.join(
      fixtureDir,
      'sidebars-category-shorthand.js',
    );
    const sidebar1 = await loadSidebars(sidebarPath1, params);
    const sidebar2 = await loadSidebars(sidebarPath2, params);
    expect(sidebar1).toEqual(sidebar2);
  });

  test('sidebars with category but category.items is not an array', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-category-wrong-items.json',
    );
    await expect(() =>
      loadSidebars(sidebarPath, params),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Invalid category {\\"type\\":\\"category\\",\\"label\\":\\"Category Label\\",\\"items\\":\\"doc1\\"}: items must be an array of sidebar items or a category shorthand"`,
    );
  });

  test('sidebars with first level not a category', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-first-level-not-category.js',
    );
    const result = await loadSidebars(sidebarPath, params);
    expect(result).toMatchSnapshot();
  });

  test('sidebars link', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link.json');
    const result = await loadSidebars(sidebarPath, params);
    expect(result).toMatchSnapshot();
  });

  test('unexisting path', async () => {
    await expect(loadSidebars('badpath', params)).resolves.toEqual(
      DisabledSidebars,
    );
  });

  test('undefined path', async () => {
    await expect(loadSidebars(undefined, params)).resolves.toMatchSnapshot();
  });

  test('literal false path', async () => {
    await expect(loadSidebars(false, params)).resolves.toEqual(
      DisabledSidebars,
    );
  });

  test('sidebars with category.collapsed property', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-collapsed.json');
    const result = await loadSidebars(sidebarPath, params);
    expect(result).toMatchSnapshot();
  });

  test('sidebars with category.collapsed property at first level', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-collapsed-first-level.json',
    );
    const result = await loadSidebars(sidebarPath, params);
    expect(result).toMatchSnapshot();
  });
});
