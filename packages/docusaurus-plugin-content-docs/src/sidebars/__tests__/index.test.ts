/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {
  loadSidebars,
  processSidebars,
  DefaultSidebars,
  DisabledSidebars,
} from '../index';
import {
  SidebarItem,
  SidebarItemsGenerator,
  Sidebars,
  UnprocessedSidebars,
  SidebarOptions,
} from '../../types';
import {DefaultSidebarItemsGenerator} from '../generator';

describe('loadSidebars', () => {
  const fixtureDir = path.join(__dirname, '__fixtures__', 'sidebars');
  const options: SidebarOptions = {
    sidebarCollapsed: true,
    sidebarCollapsible: true,
  };
  test('sidebars with known sidebar item type', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars.json');
    const result = loadSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars with deep level of category', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-category.js');
    const result = loadSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars shorthand and longform lead to exact same sidebar', async () => {
    const sidebarPath1 = path.join(fixtureDir, 'sidebars-category.js');
    const sidebarPath2 = path.join(
      fixtureDir,
      'sidebars-category-shorthand.js',
    );
    const sidebar1 = loadSidebars(sidebarPath1, options);
    const sidebar2 = loadSidebars(sidebarPath2, options);
    expect(sidebar1).toEqual(sidebar2);
  });

  test('sidebars with category but category.items is not an array', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-category-wrong-items.json',
    );
    expect(() =>
      loadSidebars(sidebarPath, options),
    ).toThrowErrorMatchingInlineSnapshot();
  });

  test('sidebars with category but category label is not a string', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-category-wrong-label.json',
    );
    expect(() =>
      loadSidebars(sidebarPath, options),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error loading {\\"type\\":\\"category\\",\\"label\\":true,\\"items\\":[\\"doc1\\"]}: \\"label\\" must be a string."`,
    );
  });

  test('sidebars item doc but id is not a string', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-doc-id-not-string.json',
    );
    expect(() =>
      loadSidebars(sidebarPath, options),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error loading {\\"type\\":\\"doc\\",\\"id\\":[\\"doc1\\"]}: \\"id\\" must be a string."`,
    );
  });

  test('sidebars with first level not a category', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-first-level-not-category.js',
    );
    const result = loadSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars link', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link.json');
    const result = loadSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars link wrong label', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link-wrong-label.json');
    expect(() =>
      loadSidebars(sidebarPath, options),
    ).toThrowErrorMatchingInlineSnapshot();
  });

  test('sidebars link wrong href', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link-wrong-href.json');
    expect(() =>
      loadSidebars(sidebarPath, options),
    ).toThrowErrorMatchingInlineSnapshot();
  });

  test('sidebars with unknown sidebar item type', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-unknown-type.json');
    expect(() =>
      loadSidebars(sidebarPath, options),
    ).toThrowErrorMatchingInlineSnapshot();
  });

  test('sidebars with known sidebar item type but wrong field', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-wrong-field.json');
    expect(() =>
      loadSidebars(sidebarPath, options),
    ).toThrowErrorMatchingInlineSnapshot();
  });

  test('unexisting path', () => {
    expect(loadSidebars('badpath', options)).toEqual(DisabledSidebars);
  });

  test('undefined path', () => {
    expect(loadSidebars(undefined, options)).toEqual(DefaultSidebars);
  });

  test('literal false path', () => {
    expect(loadSidebars(false, options)).toEqual(DisabledSidebars);
  });

  test('sidebars with category.collapsed property', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-collapsed.json');
    const result = loadSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });

  test('sidebars with category.collapsed property at first level', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-collapsed-first-level.json',
    );
    const result = loadSidebars(sidebarPath, options);
    expect(result).toMatchSnapshot();
  });
});

describe('processSidebars', () => {
  const StaticGeneratedSidebarSlice: SidebarItem[] = [
    {type: 'doc', id: 'doc-generated-id-1'},
    {type: 'doc', id: 'doc-generated-id-2'},
  ];

  const StaticSidebarItemsGenerator: SidebarItemsGenerator = jest.fn(
    async () => {
      return StaticGeneratedSidebarSlice;
    },
  );

  async function testProcessSidebars(unprocessedSidebars: UnprocessedSidebars) {
    return processSidebars({
      sidebarItemsGenerator: StaticSidebarItemsGenerator,
      unprocessedSidebars,
      docs: [],
      // @ts-expect-error: useless for this test
      version: {},
    });
  }

  test('let sidebars without autogenerated items untouched', async () => {
    const unprocessedSidebars: UnprocessedSidebars = {
      someSidebar: [
        {type: 'doc', id: 'doc1'},
        {
          type: 'category',
          collapsed: false,
          collapsible: true,
          items: [{type: 'doc', id: 'doc2'}],
          label: 'Category',
        },
        {type: 'link', href: 'https://facebook.com', label: 'FB'},
      ],
      secondSidebar: [
        {type: 'doc', id: 'doc3'},
        {type: 'link', href: 'https://instagram.com', label: 'IG'},
        {
          type: 'category',
          collapsed: false,
          collapsible: true,
          items: [{type: 'doc', id: 'doc4'}],
          label: 'Category',
        },
      ],
    };

    const processedSidebar = await testProcessSidebars(unprocessedSidebars);
    expect(processedSidebar).toEqual(unprocessedSidebars);
  });

  test('replace autogenerated items by generated sidebars slices', async () => {
    const unprocessedSidebars: UnprocessedSidebars = {
      someSidebar: [
        {type: 'doc', id: 'doc1'},
        {
          type: 'category',
          collapsed: false,
          collapsible: true,
          items: [
            {type: 'doc', id: 'doc2'},
            {type: 'autogenerated', dirName: 'dir1'},
          ],
          label: 'Category',
        },
        {type: 'link', href: 'https://facebook.com', label: 'FB'},
      ],
      secondSidebar: [
        {type: 'doc', id: 'doc3'},
        {type: 'autogenerated', dirName: 'dir2'},
        {type: 'link', href: 'https://instagram.com', label: 'IG'},
        {type: 'autogenerated', dirName: 'dir3'},
        {
          type: 'category',
          collapsed: false,
          collapsible: true,
          items: [{type: 'doc', id: 'doc4'}],
          label: 'Category',
        },
      ],
    };

    const processedSidebar = await testProcessSidebars(unprocessedSidebars);

    expect(StaticSidebarItemsGenerator).toHaveBeenCalledTimes(3);
    expect(StaticSidebarItemsGenerator).toHaveBeenCalledWith({
      defaultSidebarItemsGenerator: DefaultSidebarItemsGenerator,
      item: {type: 'autogenerated', dirName: 'dir1'},
      docs: [],
      version: {},
    });
    expect(StaticSidebarItemsGenerator).toHaveBeenCalledWith({
      defaultSidebarItemsGenerator: DefaultSidebarItemsGenerator,
      item: {type: 'autogenerated', dirName: 'dir2'},
      docs: [],
      version: {},
    });
    expect(StaticSidebarItemsGenerator).toHaveBeenCalledWith({
      defaultSidebarItemsGenerator: DefaultSidebarItemsGenerator,
      item: {type: 'autogenerated', dirName: 'dir3'},
      docs: [],
      version: {},
    });

    expect(processedSidebar).toEqual({
      someSidebar: [
        {type: 'doc', id: 'doc1'},
        {
          type: 'category',
          collapsed: false,
          collapsible: true,
          items: [{type: 'doc', id: 'doc2'}, ...StaticGeneratedSidebarSlice],
          label: 'Category',
        },
        {type: 'link', href: 'https://facebook.com', label: 'FB'},
      ],
      secondSidebar: [
        {type: 'doc', id: 'doc3'},
        ...StaticGeneratedSidebarSlice,
        {type: 'link', href: 'https://instagram.com', label: 'IG'},
        ...StaticGeneratedSidebarSlice,
        {
          type: 'category',
          collapsed: false,
          collapsible: true,
          items: [{type: 'doc', id: 'doc4'}],
          label: 'Category',
        },
      ],
    } as Sidebars);
  });
});
