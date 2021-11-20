/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  createSidebarsUtils,
  collectSidebarDocItems,
  collectSidebarCategories,
  collectSidebarLinks,
  transformSidebarItems,
  collectSidebarsDocIds,
} from '../utils';
import type {Sidebar, Sidebars} from '../types';

describe('createSidebarsUtils', () => {
  const sidebar1: Sidebar = [
    {
      type: 'category',
      collapsed: false,
      collapsible: true,
      label: 'Category1',
      items: [
        {
          type: 'category',
          collapsed: false,
          collapsible: true,
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
      collapsible: true,
      label: 'Category2',
      items: [
        {type: 'doc', id: 'doc3'},
        {type: 'doc', id: 'doc4'},
      ],
    },
  ];

  const sidebars: Sidebars = {sidebar1, sidebar2};

  const {getFirstDocIdOfFirstSidebar, getSidebarNameByDocId, getDocNavigation} =
    createSidebarsUtils(sidebars);

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

describe('collectSidebarDocItems', () => {
  test('can collect docs', async () => {
    const sidebar: Sidebar = [
      {
        type: 'category',
        collapsed: false,
        collapsible: true,
        label: 'Category1',
        items: [
          {
            type: 'category',
            collapsed: false,
            collapsible: true,
            label: 'Subcategory 1',
            items: [{type: 'doc', id: 'doc1'}],
          },
          {
            type: 'category',
            collapsed: false,
            collapsible: true,
            label: 'Subcategory 2',
            items: [
              {type: 'doc', id: 'doc2'},
              {
                type: 'category',
                collapsed: false,
                collapsible: true,
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
        collapsible: true,
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
        collapsible: true,
        label: 'Category1',
        items: [
          {
            type: 'category',
            collapsed: false,
            collapsible: true,
            label: 'Subcategory 1',
            items: [{type: 'doc', id: 'doc1'}],
          },
          {
            type: 'category',
            collapsed: false,
            collapsible: true,
            label: 'Subcategory 2',
            items: [
              {type: 'doc', id: 'doc2'},
              {
                type: 'category',
                collapsed: false,
                collapsible: true,
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
        collapsible: true,
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
        collapsible: true,
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
            collapsible: true,
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
        collapsible: true,
        label: 'Category1',
        items: [
          {
            type: 'category',
            collapsed: false,
            collapsible: true,
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
        collapsible: true,
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
        collapsible: true,
        label: 'Category1',
        items: [
          {
            type: 'category',
            collapsed: false,
            collapsible: true,
            label: 'Subcategory 1',
            items: [{type: 'doc', id: 'doc1'}],
            customProps: {fakeProp: false},
          },
          {
            type: 'category',
            collapsed: false,
            collapsible: true,
            label: 'Subcategory 2',
            items: [
              {type: 'doc', id: 'doc2'},
              {
                type: 'category',
                collapsed: false,
                collapsible: true,
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
        collapsible: true,
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
        collapsible: true,
        label: 'MODIFIED LABEL: Category1',
        items: [
          {
            type: 'category',
            collapsed: false,
            collapsible: true,
            label: 'MODIFIED LABEL: Subcategory 1',
            items: [{type: 'doc', id: 'doc1'}],
            customProps: {fakeProp: false},
          },
          {
            type: 'category',
            collapsed: false,
            collapsible: true,
            label: 'MODIFIED LABEL: Subcategory 2',
            items: [
              {type: 'doc', id: 'doc2'},
              {
                type: 'category',
                collapsed: false,
                collapsible: true,
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
        collapsible: true,
        label: 'MODIFIED LABEL: Category2',
        items: [
          {type: 'doc', id: 'doc4'},
          {type: 'doc', id: 'doc5'},
        ],
      },
    ]);
  });
});
