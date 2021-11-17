/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {
  loadUnprocessedSidebars,
  DefaultSidebars,
  DisabledSidebars,
} from '../index';
import type {SidebarOptions} from '../../types';

describe('loadUnprocessedSidebars', () => {
  const fixtureDir = path.join(__dirname, '__fixtures__', 'sidebars');
  const options: SidebarOptions = {
    sidebarCollapsed: true,
    sidebarCollapsible: true,
  };
  test('sidebars with known sidebar item type', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars.json');
    const result = loadUnprocessedSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars with deep level of category', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-category.js');
    const result = loadUnprocessedSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars shorthand and longform lead to exact same sidebar', async () => {
    const sidebarPath1 = path.join(fixtureDir, 'sidebars-category.js');
    const sidebarPath2 = path.join(
      fixtureDir,
      'sidebars-category-shorthand.js',
    );
    const sidebar1 = loadUnprocessedSidebars(sidebarPath1, options);
    const sidebar2 = loadUnprocessedSidebars(sidebarPath2, options);
    expect(sidebar1).toEqual(sidebar2);
  });

  test('sidebars with category but category.items is not an array', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-category-wrong-items.json',
    );
    expect(() => loadUnprocessedSidebars(sidebarPath, options))
      .toThrowErrorMatchingInlineSnapshot(`
      "{
        \\"type\\": \\"category\\",
        \\"label\\": \\"Category Label\\",
        \\"items\\" [31m[1][0m: \\"doc1\\"
      }
      [31m
      [1] \\"items\\" must be an array[0m"
    `);
  });

  test('sidebars with category but category label is not a string', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-category-wrong-label.json',
    );
    expect(() => loadUnprocessedSidebars(sidebarPath, options))
      .toThrowErrorMatchingInlineSnapshot(`
      "{
        \\"type\\": \\"category\\",
        \\"items\\": [
          \\"doc1\\"
        ],
        \\"label\\" [31m[1][0m: true
      }
      [31m
      [1] \\"label\\" must be a string[0m"
    `);
  });

  test('sidebars item doc but id is not a string', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-doc-id-not-string.json',
    );
    expect(() => loadUnprocessedSidebars(sidebarPath, options))
      .toThrowErrorMatchingInlineSnapshot(`
      "{
        \\"type\\": \\"doc\\",
        \\"id\\" [31m[1][0m: [
          \\"doc1\\"
        ]
      }
      [31m
      [1] \\"id\\" must be a string[0m"
    `);
  });

  test('sidebars with first level not a category', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-first-level-not-category.js',
    );
    const result = loadUnprocessedSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars link', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link.json');
    const result = loadUnprocessedSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars link wrong label', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link-wrong-label.json');
    expect(() => loadUnprocessedSidebars(sidebarPath, options))
      .toThrowErrorMatchingInlineSnapshot(`
      "{
        \\"type\\": \\"link\\",
        \\"href\\": \\"https://github.com\\",
        \\"label\\" [31m[1][0m: false
      }
      [31m
      [1] \\"label\\" must be a string[0m"
    `);
  });

  test('sidebars link wrong href', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link-wrong-href.json');
    expect(() => loadUnprocessedSidebars(sidebarPath, options))
      .toThrowErrorMatchingInlineSnapshot(`
      "{
        \\"type\\": \\"link\\",
        \\"label\\": \\"GitHub\\",
        \\"href\\" [31m[1][0m: [
          \\"example.com\\"
        ]
      }
      [31m
      [1] \\"href\\" contains an invalid value[0m"
    `);
  });

  test('sidebars with unknown sidebar item type', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-unknown-type.json');
    expect(() => loadUnprocessedSidebars(sidebarPath, options))
      .toThrowErrorMatchingInlineSnapshot(`
      "{
        \\"type\\": \\"superman\\",
        [41m\\"undefined\\"[0m[31m [1]: -- missing --[0m
      }
      [31m
      [1] Unknown sidebar item type \\"superman\\".[0m"
    `);
  });

  test('sidebars with known sidebar item type but wrong field', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-wrong-field.json');
    expect(() => loadUnprocessedSidebars(sidebarPath, options))
      .toThrowErrorMatchingInlineSnapshot(`
      "{
        \\"type\\": \\"category\\",
        \\"label\\": \\"category\\",
        \\"href\\": \\"https://github.com\\",
        [41m\\"items\\"[0m[31m [1]: -- missing --[0m
      }
      [31m
      [1] \\"items\\" is required[0m"
    `);
  });

  test('unexisting path', () => {
    expect(loadUnprocessedSidebars('badpath', options)).toEqual(
      DisabledSidebars,
    );
  });

  test('undefined path', () => {
    expect(loadUnprocessedSidebars(undefined, options)).toEqual(
      DefaultSidebars,
    );
  });

  test('literal false path', () => {
    expect(loadUnprocessedSidebars(false, options)).toEqual(DisabledSidebars);
  });

  test('sidebars with category.collapsed property', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-collapsed.json');
    const result = loadUnprocessedSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars with category.collapsed property at first level', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-collapsed-first-level.json',
    );
    const result = loadUnprocessedSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });
});
