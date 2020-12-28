/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {
  loadSidebars,
  collectSidebarDocItems,
  collectSidebarsDocIds,
  createSidebarsUtils,
  collectSidebarCategories,
  collectSidebarLinks,
  transformSidebarItems,
} from '../sidebars';
import {Sidebar, Sidebars} from '../types';

/* eslint-disable global-require, import/no-dynamic-require */

describe('loadSidebars', () => {
  const fixtureDir = path.join(__dirname, '__fixtures__', 'sidebars');
  test('sidebars with known sidebar item type', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars.json');
    const result = loadSidebars(sidebarPath);
    expect(result).toMatchSnapshot();
  });

  test('sidebars with deep level of category', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-category.js');
    const result = loadSidebars(sidebarPath);
    expect(result).toMatchSnapshot();
  });

  test('sidebars shorthand and longform lead to exact same sidebar', async () => {
    const sidebarPath1 = path.join(fixtureDir, 'sidebars-category.js');
    const sidebarPath2 = path.join(
      fixtureDir,
      'sidebars-category-shorthand.js',
    );
    const sidebar1 = loadSidebars(sidebarPath1);
    const sidebar2 = loadSidebars(sidebarPath2);
    expect(sidebar1).toEqual(sidebar2);
  });

  test('sidebars with category but category.items is not an array', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-category-wrong-items.json',
    );
    expect(() => loadSidebars(sidebarPath)).toThrowErrorMatchingInlineSnapshot(
      `"Error loading {\\"type\\":\\"category\\",\\"label\\":\\"Category Label\\",\\"items\\":\\"doc1\\"}. \\"items\\" must be an array."`,
    );
  });

  test('sidebars with category but category label is not a string', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-category-wrong-label.json',
    );
    expect(() => loadSidebars(sidebarPath)).toThrowErrorMatchingInlineSnapshot(
      `"Error loading {\\"type\\":\\"category\\",\\"label\\":true,\\"items\\":[\\"doc1\\"]}. \\"label\\" must be a string."`,
    );
  });

  test('sidebars item doc but id is not a string', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-doc-id-not-string.json',
    );
    expect(() => loadSidebars(sidebarPath)).toThrowErrorMatchingInlineSnapshot(
      `"Error loading {\\"type\\":\\"doc\\",\\"id\\":[\\"doc1\\"]}. \\"id\\" must be a string."`,
    );
  });

  test('sidebars with first level not a category', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-first-level-not-category.js',
    );
    const result = loadSidebars(sidebarPath);
    expect(result).toMatchSnapshot();
  });

  test('sidebars link', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link.json');
    const result = loadSidebars(sidebarPath);
    expect(result).toMatchSnapshot();
  });

  test('sidebars link wrong label', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link-wrong-label.json');
    expect(() => loadSidebars(sidebarPath)).toThrowErrorMatchingInlineSnapshot(
      `"Error loading {\\"type\\":\\"link\\",\\"label\\":false,\\"href\\":\\"https://github.com\\"}. \\"label\\" must be a string."`,
    );
  });

  test('sidebars link wrong href', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-link-wrong-href.json');
    expect(() => loadSidebars(sidebarPath)).toThrowErrorMatchingInlineSnapshot(
      `"Error loading {\\"type\\":\\"link\\",\\"label\\":\\"GitHub\\",\\"href\\":[\\"example.com\\"]}. \\"href\\" must be a string."`,
    );
  });

  test('sidebars with unknown sidebar item type', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-unknown-type.json');
    expect(() => loadSidebars(sidebarPath)).toThrowErrorMatchingInlineSnapshot(
      `"Unknown sidebar item type [superman]. Sidebar item={\\"type\\":\\"superman\\"} "`,
    );
  });

  test('sidebars with known sidebar item type but wrong field', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-wrong-field.json');
    expect(() => loadSidebars(sidebarPath)).toThrowErrorMatchingInlineSnapshot(
      `"Unknown sidebar item keys: href. Item: {\\"type\\":\\"category\\",\\"label\\":\\"category\\",\\"href\\":\\"https://github.com\\"}"`,
    );
  });

  test('unexisting path', () => {
    /*
    expect(() => loadSidebars('badpath')).toThrowErrorMatchingInlineSnapshot(
      `"No sidebar file exist at path: badpath"`,
    );
     */
    // See https://github.com/facebook/docusaurus/issues/3366
    expect(loadSidebars('badpath')).toEqual({});
  });

  test('undefined path', () => {
    expect(() =>
      loadSidebars(
        // @ts-expect-error: bad arg
        undefined,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"sidebarFilePath not provided: undefined"`,
    );
  });

  test('null path', () => {
    expect(() =>
      loadSidebars(
        // @ts-expect-error: bad arg
        null,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"sidebarFilePath not provided: null"`,
    );
  });

  test('sidebars with category.collapsed property', async () => {
    const sidebarPath = path.join(fixtureDir, 'sidebars-collapsed.json');
    const result = loadSidebars(sidebarPath);
    expect(result).toMatchSnapshot();
  });

  test('sidebars with category.collapsed property at first level', async () => {
    const sidebarPath = path.join(
      fixtureDir,
      'sidebars-collapsed-first-level.json',
    );
    const result = loadSidebars(sidebarPath);
    expect(result).toMatchSnapshot();
  });
});

describe('collectSidebarDocItems', () => {
  test('can collect docs', async () => {
    const sidebar: Sidebar = [
      {
        type: 'category',
        collapsed: false,
        label: 'Category1',
        items: [
          {
            type: 'category',
            collapsed: false,
            label: 'Subcategory 1',
            items: [{type: 'doc', id: 'doc1'}],
          },
          {
            type: 'category',
            collapsed: false,
            label: 'Subcategory 2',
            items: [
              {type: 'doc', id: 'doc2'},
              {
                type: 'category',
                collapsed: false,
                label: 'Sub sub category 1',
                items: [{type: 'doc', id: 'doc3'}],
              },
            ],
          },
        ],
      },
      {
        type: 'category',
        collapsed: false,
        label: 'Category2',
        items: [
          {type: 'doc', id: 'doc4'},
          {type: 'doc', id: 'doc5'},
        ],
      },
    ];

    expect(collectSidebarDocItems(sidebar).map((doc) => doc.id)).toEqual([
      'doc1',
      'doc2',
      'doc3',
      'doc4',
      'doc5',
    ]);
  });
});

describe('collectSidebarCategories', () => {
  test('can collect categories', async () => {
    const sidebar: Sidebar = [
      {
        type: 'category',
        collapsed: false,
        label: 'Category1',
        items: [
          {
            type: 'category',
            collapsed: false,
            label: 'Subcategory 1',
            items: [{type: 'doc', id: 'doc1'}],
          },
          {
            type: 'category',
            collapsed: false,
            label: 'Subcategory 2',
            items: [
              {type: 'doc', id: 'doc2'},
              {
                type: 'category',
                collapsed: false,
                label: 'Sub sub category 1',
                items: [{type: 'doc', id: 'doc3'}],
              },
            ],
          },
        ],
      },
      {
        type: 'category',
        collapsed: false,
        label: 'Category2',
        items: [
          {type: 'doc', id: 'doc4'},
          {type: 'doc', id: 'doc5'},
        ],
      },
    ];

    expect(
      collectSidebarCategories(sidebar).map((category) => category.label),
    ).toEqual([
      'Category1',
      'Subcategory 1',
      'Subcategory 2',
      'Sub sub category 1',
      'Category2',
    ]);
  });
});

describe('collectSidebarLinks', () => {
  test('can collect links', async () => {
    const sidebar: Sidebar = [
      {
        type: 'category',
        collapsed: false,
        label: 'Category1',
        items: [
          {
            type: 'link',
            href: 'https://google.com',
            label: 'Google',
          },
          {
            type: 'category',
            collapsed: false,
            label: 'Subcategory 2',
            items: [
              {
                type: 'link',
                href: 'https://facebook.com',
                label: 'Facebook',
              },
            ],
          },
        ],
      },
    ];

    expect(collectSidebarLinks(sidebar).map((link) => link.href)).toEqual([
      'https://google.com',
      'https://facebook.com',
    ]);
  });
});

describe('collectSidebarsDocIds', () => {
  test('can collect sidebars doc items', async () => {
    const sidebar1: Sidebar = [
      {
        type: 'category',
        collapsed: false,
        label: 'Category1',
        items: [
          {
            type: 'category',
            collapsed: false,
            label: 'Subcategory 1',
            items: [{type: 'doc', id: 'doc1'}],
          },
          {type: 'doc', id: 'doc2'},
        ],
      },
    ];

    const sidebar2: Sidebar = [
      {
        type: 'category',
        collapsed: false,
        label: 'Category2',
        items: [
          {type: 'doc', id: 'doc3'},
          {type: 'doc', id: 'doc4'},
        ],
      },
    ];

    const sidebar3: Sidebar = [
      {type: 'doc', id: 'doc5'},
      {type: 'doc', id: 'doc6'},
    ];
    expect(collectSidebarsDocIds({sidebar1, sidebar2, sidebar3})).toEqual({
      sidebar1: ['doc1', 'doc2'],
      sidebar2: ['doc3', 'doc4'],
      sidebar3: ['doc5', 'doc6'],
    });
  });
});

describe('transformSidebarItems', () => {
  test('can transform sidebar items', async () => {
    const sidebar: Sidebar = [
      {
        type: 'category',
        collapsed: false,
        label: 'Category1',
        items: [
          {
            type: 'category',
            collapsed: false,
            label: 'Subcategory 1',
            items: [{type: 'doc', id: 'doc1'}],
            customProps: {fakeProp: false},
          },
          {
            type: 'category',
            collapsed: false,
            label: 'Subcategory 2',
            items: [
              {type: 'doc', id: 'doc2'},
              {
                type: 'category',
                collapsed: false,
                label: 'Sub sub category 1',
                items: [
                  {type: 'doc', id: 'doc3', customProps: {lorem: 'ipsum'}},
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'category',
        collapsed: false,
        label: 'Category2',
        items: [
          {type: 'doc', id: 'doc4'},
          {type: 'doc', id: 'doc5'},
        ],
      },
    ];

    expect(
      transformSidebarItems(sidebar, (item) => {
        if (item.type === 'category') {
          return {...item, label: `MODIFIED LABEL: ${item.label}`};
        }
        return item;
      }),
    ).toEqual([
      {
        type: 'category',
        collapsed: false,
        label: 'MODIFIED LABEL: Category1',
        items: [
          {
            type: 'category',
            collapsed: false,
            label: 'MODIFIED LABEL: Subcategory 1',
            items: [{type: 'doc', id: 'doc1'}],
            customProps: {fakeProp: false},
          },
          {
            type: 'category',
            collapsed: false,
            label: 'MODIFIED LABEL: Subcategory 2',
            items: [
              {type: 'doc', id: 'doc2'},
              {
                type: 'category',
                collapsed: false,
                label: 'MODIFIED LABEL: Sub sub category 1',
                items: [
                  {type: 'doc', id: 'doc3', customProps: {lorem: 'ipsum'}},
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'category',
        collapsed: false,
        label: 'MODIFIED LABEL: Category2',
        items: [
          {type: 'doc', id: 'doc4'},
          {type: 'doc', id: 'doc5'},
        ],
      },
    ]);
  });
});

describe('createSidebarsUtils', () => {
  const sidebar1: Sidebar = [
    {
      type: 'category',
      collapsed: false,
      label: 'Category1',
      items: [
        {
          type: 'category',
          collapsed: false,
          label: 'Subcategory 1',
          items: [{type: 'doc', id: 'doc1'}],
        },
        {type: 'doc', id: 'doc2'},
      ],
    },
  ];

  const sidebar2: Sidebar = [
    {
      type: 'category',
      collapsed: false,
      label: 'Category2',
      items: [
        {type: 'doc', id: 'doc3'},
        {type: 'doc', id: 'doc4'},
      ],
    },
  ];

  const sidebars: Sidebars = {sidebar1, sidebar2};

  const {
    getFirstDocIdOfFirstSidebar,
    getSidebarNameByDocId,
    getDocNavigation,
  } = createSidebarsUtils(sidebars);

  test('getSidebarNameByDocId', async () => {
    expect(getFirstDocIdOfFirstSidebar()).toEqual('doc1');
  });

  test('getSidebarNameByDocId', async () => {
    expect(getSidebarNameByDocId('doc1')).toEqual('sidebar1');
    expect(getSidebarNameByDocId('doc2')).toEqual('sidebar1');
    expect(getSidebarNameByDocId('doc3')).toEqual('sidebar2');
    expect(getSidebarNameByDocId('doc4')).toEqual('sidebar2');
    expect(getSidebarNameByDocId('doc5')).toEqual(undefined);
    expect(getSidebarNameByDocId('doc6')).toEqual(undefined);
  });

  test('getDocNavigation', async () => {
    expect(getDocNavigation('doc1')).toEqual({
      sidebarName: 'sidebar1',
      previousId: undefined,
      nextId: 'doc2',
    });
    expect(getDocNavigation('doc2')).toEqual({
      sidebarName: 'sidebar1',
      previousId: 'doc1',
      nextId: undefined,
    });

    expect(getDocNavigation('doc3')).toEqual({
      sidebarName: 'sidebar2',
      previousId: undefined,
      nextId: 'doc4',
    });
    expect(getDocNavigation('doc4')).toEqual({
      sidebarName: 'sidebar2',
      previousId: 'doc3',
      nextId: undefined,
    });
  });
});
