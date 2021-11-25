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
  SidebarNavigation,
  toDocNavigationLink,
  toNavigationLink,
} from '../utils';
import type {Sidebar, Sidebars} from '../types';
import {DocMetadataBase, DocNavLink} from '../../types';

describe('createSidebarsUtils', () => {
  const sidebar1: Sidebar = [
    {
      type: 'category',
      collapsed: false,
      collapsible: true,
      label: 'S1 Category',
      items: [
        {
          type: 'category',
          collapsed: false,
          collapsible: true,
          label: 'S1 Subcategory',
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
      label: 'S2 Category',
      items: [
        {type: 'doc', id: 'doc3'},
        {type: 'doc', id: 'doc4'},
      ],
    },
  ];

  const sidebar3: Sidebar = [
    {
      type: 'category',
      collapsed: false,
      collapsible: true,
      label: 'S3 Category',
      link: {
        type: 'doc',
        id: 'doc5',
      },
      items: [
        {
          type: 'category',
          collapsed: false,
          collapsible: true,
          label: 'S3 SubCategory',
          link: {
            type: 'generated-index',
            slug: '/s3-subcategory-index-slug',
            permalink: '/s3-subcategory-index-permalink',
          },
          items: [
            {
              type: 'category',
              collapsed: false,
              collapsible: true,
              label: 'S3 SubSubCategory',
              link: {
                type: 'generated-index',
                slug: '/s3-subsubcategory-slug',
                permalink: '/s3-subsubcategory-index-permalink',
              },
              items: [
                {type: 'doc', id: 'doc6'},
                {type: 'doc', id: 'doc7'},
              ],
            },
          ],
        },
      ],
    },
  ];

  const sidebars: Sidebars = {sidebar1, sidebar2, sidebar3};

  const {
    getFirstDocIdOfFirstSidebar,
    getSidebarNameByDocId,
    getDocNavigation,
    getCategoryGeneratedIndexNavigation,
    getCategoryGeneratedIndexList,
  } = createSidebarsUtils(sidebars);

  test('getSidebarNameByDocId', async () => {
    expect(getFirstDocIdOfFirstSidebar()).toEqual('doc1');
  });

  test('getSidebarNameByDocId', async () => {
    expect(getSidebarNameByDocId('doc1')).toEqual('sidebar1');
    expect(getSidebarNameByDocId('doc2')).toEqual('sidebar1');
    expect(getSidebarNameByDocId('doc3')).toEqual('sidebar2');
    expect(getSidebarNameByDocId('doc4')).toEqual('sidebar2');
    expect(getSidebarNameByDocId('doc5')).toEqual('sidebar3');
    expect(getSidebarNameByDocId('doc6')).toEqual('sidebar3');
    expect(getSidebarNameByDocId('doc7')).toEqual('sidebar3');
    expect(getSidebarNameByDocId('unknown_id')).toEqual(undefined);
  });

  test('getDocNavigation', async () => {
    expect(getDocNavigation('doc1')).toEqual({
      sidebarName: 'sidebar1',
      previous: undefined,
      next: {
        type: 'doc',
        id: 'doc2',
      },
    } as SidebarNavigation);
    expect(getDocNavigation('doc2')).toEqual({
      sidebarName: 'sidebar1',
      previous: {
        type: 'doc',
        id: 'doc1',
      },
      next: undefined,
    } as SidebarNavigation);

    expect(getDocNavigation('doc3')).toEqual({
      sidebarName: 'sidebar2',
      previous: undefined,
      next: {
        type: 'doc',
        id: 'doc4',
      },
    } as SidebarNavigation);
    expect(getDocNavigation('doc4')).toEqual({
      sidebarName: 'sidebar2',
      previous: {
        type: 'doc',
        id: 'doc3',
      },
      next: undefined,
    } as SidebarNavigation);

    expect(getDocNavigation('doc5')).toMatchObject({
      sidebarName: 'sidebar3',
      previous: undefined,
      next: {
        type: 'category',
        label: 'S3 SubCategory',
      },
    } as SidebarNavigation);
    expect(getDocNavigation('doc6')).toMatchObject({
      sidebarName: 'sidebar3',
      previous: {
        type: 'category',
        label: 'S3 SubSubCategory',
      },
      next: {
        type: 'doc',
        id: 'doc7',
      },
    } as SidebarNavigation);
    expect(getDocNavigation('doc7')).toMatchObject({
      sidebarName: 'sidebar3',
      previous: {
        type: 'doc',
        id: 'doc6',
      },
      next: undefined,
    } as SidebarNavigation);
  });

  test('getCategoryGeneratedIndexNavigation', async () => {
    expect(
      getCategoryGeneratedIndexNavigation('/s3-subcategory-index-permalink'),
    ).toMatchObject({
      sidebarName: 'sidebar3',
      previous: {
        type: 'category',
        label: 'S3 Category',
      },
      next: {
        type: 'category',
        label: 'S3 SubSubCategory',
      },
    } as SidebarNavigation);

    expect(
      getCategoryGeneratedIndexNavigation('/s3-subsubcategory-index-permalink'),
    ).toMatchObject({
      sidebarName: 'sidebar3',
      previous: {
        type: 'category',
        label: 'S3 SubCategory',
      },
      next: {
        type: 'doc',
        id: 'doc6',
      },
    } as SidebarNavigation);
  });

  test('getCategoryGeneratedIndexList', async () => {
    expect(getCategoryGeneratedIndexList()).toMatchObject([
      {
        type: 'category',
        label: 'S3 SubCategory',
      },
      {
        type: 'category',
        label: 'S3 SubSubCategory',
      },
    ]);
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

describe('toDocNavigationLink', () => {
  type TestDoc = Pick<DocMetadataBase, 'permalink' | 'title' | 'frontMatter'>;
  function testDoc(data: TestDoc) {
    return data as DocMetadataBase;
  }

  test('with no frontmatter', () => {
    expect(
      toDocNavigationLink(
        testDoc({
          title: 'Doc Title',
          permalink: '/docPermalink',
          frontMatter: {},
        }),
      ),
    ).toEqual({
      title: 'Doc Title',
      permalink: '/docPermalink',
    } as DocNavLink);
  });

  test('with pagination_label frontmatter', () => {
    expect(
      toDocNavigationLink(
        testDoc({
          title: 'Doc Title',
          permalink: '/docPermalink',
          frontMatter: {
            pagination_label: 'pagination_label',
          },
        }),
      ),
    ).toEqual({
      title: 'pagination_label',
      permalink: '/docPermalink',
    } as DocNavLink);
  });

  test('with sidebar_label frontmatter', () => {
    expect(
      toDocNavigationLink(
        testDoc({
          title: 'Doc Title',
          permalink: '/docPermalink',
          frontMatter: {
            sidebar_label: 'sidebar_label',
          },
        }),
      ),
    ).toEqual({
      title: 'sidebar_label',
      permalink: '/docPermalink',
    } as DocNavLink);
  });

  test('with pagination_label + sidebar_label frontmatter', () => {
    expect(
      toDocNavigationLink(
        testDoc({
          title: 'Doc Title',
          permalink: '/docPermalink',
          frontMatter: {
            pagination_label: 'pagination_label',
            sidebar_label: 'sidebar_label',
          },
        }),
      ),
    ).toEqual({
      title: 'pagination_label',
      permalink: '/docPermalink',
    } as DocNavLink);
  });
});

describe('toNavigationLink', () => {
  type TestDoc = Pick<DocMetadataBase, 'permalink' | 'title'>;
  function testDoc(data: TestDoc) {
    return {...data, frontMatter: {}} as DocMetadataBase;
  }

  const docsById: Record<string, DocMetadataBase> = {
    doc1: testDoc({
      title: 'Doc 1',
      permalink: '/doc1',
    }),
    doc2: testDoc({
      title: 'Doc 1',
      permalink: '/doc1',
    }),
  };

  test('with doc items', () => {
    expect(toNavigationLink({type: 'doc', id: 'doc1'}, docsById)).toEqual(
      toDocNavigationLink(docsById.doc1),
    );
    expect(toNavigationLink({type: 'doc', id: 'doc2'}, docsById)).toEqual(
      toDocNavigationLink(docsById.doc2),
    );
    expect(() =>
      toNavigationLink({type: 'doc', id: 'doc3'}, docsById),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Can't create navigation link: no doc found with id=doc3"`,
    );
  });

  test('with category item and doc link', () => {
    expect(
      toNavigationLink(
        {
          type: 'category',
          label: 'Category',
          items: [],
          link: {
            type: 'doc',
            id: 'doc1',
          },
          collapsed: true,
          collapsible: true,
        },
        docsById,
      ),
    ).toEqual(toDocNavigationLink(docsById.doc1));
    expect(() =>
      toNavigationLink(
        {
          type: 'category',
          label: 'Category',
          items: [],
          link: {
            type: 'doc',
            id: 'doc3',
          },
          collapsed: true,
          collapsible: true,
        },
        docsById,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Can't create navigation link: no doc found with id=doc3"`,
    );
  });

  test('with category item and generated-index link', () => {
    expect(
      toNavigationLink(
        {
          type: 'category',
          label: 'Category',
          items: [],
          link: {
            type: 'generated-index',
            slug: 'slug',
            permalink: 'generated-index-permalink',
          },
          collapsed: true,
          collapsible: true,
        },
        docsById,
      ),
    ).toEqual({title: 'Category', permalink: 'generated-index-permalink'});
  });
});
