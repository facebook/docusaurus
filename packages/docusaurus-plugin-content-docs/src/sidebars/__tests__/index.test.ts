/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {
  loadNormalizedSidebars,
  DefaultSidebars,
  DisabledSidebars,
} from '../index';
import type {NormalizeSidebarsParams, VersionMetadata} from '../../types';

describe('loadNormalizedSidebars', () => {
  const fixtureDir = path.join(__dirname, '__fixtures__', 'sidebars');
  const options: NormalizeSidebarsParams = {
    sidebarCollapsed: true,
    sidebarCollapsible: true,
    version: {
      versionName: 'version',
      versionPath: 'versionPath',
    } as VersionMetadata,
  };
  test('sidebars with known sidebar item type', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars.json');
    const result = await loadNormalizedSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars with deep level of category', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-category.js');
    const result = await loadNormalizedSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars shorthand and longform lead to exact same sidebar', async () => {
    const sidebarPath1 = path.join(fixtureDir, 'sidebars-category.js');
    const sidebarPath2 = path.join(
      fixtureDir,
      'sidebars-category-shorthand.js',
    );
    const sidebar1 = await loadNormalizedSidebars(sidebarPath1, options);
    const sidebar2 = await loadNormalizedSidebars(sidebarPath2, options);
    expect(sidebar1).toEqual(sidebar2);
  });

  test('sidebars with category but category.items is not an array', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-category-wrong-items.json',
    );
    await expect(() => loadNormalizedSidebars(sidebarPath, options)).rejects
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
    await expect(() => loadNormalizedSidebars(sidebarPath, options)).rejects
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
    await expect(() => loadNormalizedSidebars(sidebarPath, options)).rejects
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
    const result = await loadNormalizedSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars link', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link.json');
    const result = await loadNormalizedSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars link wrong label', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link-wrong-label.json');
    await expect(() => loadNormalizedSidebars(sidebarPath, options)).rejects
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
    await expect(() => loadNormalizedSidebars(sidebarPath, options)).rejects
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
    await expect(() => loadNormalizedSidebars(sidebarPath, options)).rejects
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
    await expect(() => loadNormalizedSidebars(sidebarPath, options)).rejects
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

  test('unexisting path', async () => {
    await expect(loadNormalizedSidebars('badpath', options)).resolves.toEqual(
      DisabledSidebars,
    );
  });

  test('undefined path', async () => {
    await expect(loadNormalizedSidebars(undefined, options)).resolves.toEqual(
      DefaultSidebars,
    );
  });

  test('literal false path', async () => {
    await expect(loadNormalizedSidebars(false, options)).resolves.toEqual(
      DisabledSidebars,
    );
  });

  test('sidebars with category.collapsed property', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-collapsed.json');
    const result = await loadNormalizedSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars with category.collapsed property at first level', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-collapsed-first-level.json',
    );
    const result = await loadNormalizedSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });
});
