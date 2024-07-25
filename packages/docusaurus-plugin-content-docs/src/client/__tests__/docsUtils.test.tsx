/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {StaticRouter} from 'react-router-dom';
import {Context} from '@docusaurus/core/src/client/docusaurusContext';
import {
  findFirstSidebarItemLink,
  isActiveSidebarItem,
  useDocById,
  findSidebarCategory,
  useCurrentSidebarCategory,
  useSidebarBreadcrumbs,
  isVisibleSidebarItem,
} from '../docsUtils';
import {DocsSidebarProvider} from '../docsSidebar';
import {DocsVersionProvider} from '../docsVersion';
import type {
  PropSidebar,
  PropSidebarItem,
  PropSidebarItemCategory,
  PropSidebarItemLink,
  PropVersionMetadata,
} from '@docusaurus/plugin-content-docs';
import type {DocusaurusContext} from '@docusaurus/types';

// Make tests more readable with some useful category item defaults
function testCategory(
  data?: Partial<PropSidebarItemCategory>,
): PropSidebarItemCategory {
  return {
    type: 'category',
    href: undefined,
    label: 'Category label',
    items: [],
    collapsed: true,
    collapsible: true,
    ...data,
  };
}

function testLink(data?: Partial<PropSidebarItemLink>): PropSidebarItemLink {
  return {
    type: 'link',
    href: '/testLinkHref',
    label: 'Link label',
    ...data,
  };
}

function testVersion(data?: Partial<PropVersionMetadata>): PropVersionMetadata {
  return {
    version: 'versionName',
    label: 'Version Label',
    className: 'version className',
    badge: true,
    banner: 'unreleased',
    docs: {},
    docsSidebars: {},
    isLast: false,
    pluginId: 'default',
    noIndex: false,
    ...data,
  };
}

describe('useDocById', () => {
  const version = testVersion({
    docs: {
      doc1: {
        id: 'doc1',
        title: 'Doc 1',
        description: 'desc1',
        sidebar: 'sidebar1',
      },
      doc2: {
        id: 'doc2',
        title: 'Doc 2',
        description: 'desc2',
        sidebar: 'sidebar2',
      },
    },
  });

  function mockUseDocById(docId: string | undefined) {
    const {result} = renderHook(() => useDocById(docId), {
      wrapper: ({children}) => (
        <DocsVersionProvider version={version}>{children}</DocsVersionProvider>
      ),
    });
    return result.current;
  }

  it('accepts undefined', () => {
    expect(mockUseDocById(undefined)).toBeUndefined();
  });

  it('finds doc1', () => {
    expect(mockUseDocById('doc1')).toMatchObject({id: 'doc1'});
  });
  it('finds doc2', () => {
    expect(mockUseDocById('doc2')).toMatchObject({id: 'doc2'});
  });

  it('throws for doc3', () => {
    expect(() => mockUseDocById('doc3')).toThrowErrorMatchingInlineSnapshot(
      `"no version doc found by id=doc3"`,
    );
  });
});

describe('findSidebarCategory', () => {
  it('is able to return undefined', () => {
    expect(findSidebarCategory([], () => false)).toBeUndefined();
    expect(
      findSidebarCategory([testCategory(), testCategory()], () => false),
    ).toBeUndefined();
  });

  it('returns first element matching predicate', () => {
    const first = testCategory();
    const second = testCategory();
    const third = testCategory();
    const sidebar = [first, second, third];
    expect(findSidebarCategory(sidebar, () => true)).toEqual(first);
    expect(findSidebarCategory(sidebar, (item) => item === first)).toEqual(
      first,
    );
    expect(findSidebarCategory(sidebar, (item) => item === second)).toEqual(
      second,
    );
    expect(findSidebarCategory(sidebar, (item) => item === third)).toEqual(
      third,
    );
  });

  it('is able to search in sub items', () => {
    const subsub1 = testCategory();
    const subsub2 = testCategory();
    const sub1 = testCategory({
      items: [subsub1, subsub2],
    });
    const sub2 = testCategory();
    const parent = testCategory({
      items: [sub1, sub2],
    });
    const sidebar = [parent];

    expect(findSidebarCategory(sidebar, () => true)).toEqual(parent);
    expect(findSidebarCategory(sidebar, (item) => item === sub1)).toEqual(sub1);
    expect(findSidebarCategory(sidebar, (item) => item === sub2)).toEqual(sub2);
    expect(findSidebarCategory(sidebar, (item) => item === subsub1)).toEqual(
      subsub1,
    );
    expect(findSidebarCategory(sidebar, (item) => item === subsub2)).toEqual(
      subsub2,
    );
  });
});

describe('findFirstCategoryLink', () => {
  it('works with html item', () => {
    const htmlItem = {type: 'html', value: '<div/>'} as const;
    expect(findFirstSidebarItemLink(htmlItem)).toBeUndefined();
    expect(findFirstSidebarItemLink(htmlItem)).toBeUndefined();
  });

  it('works with link item', () => {
    const linkItem = {
      type: 'link',
      href: '/linkHref',
      label: 'Label',
    } as const;

    expect(findFirstSidebarItemLink(linkItem)).toBe('/linkHref');
    expect(
      findFirstSidebarItemLink({
        ...linkItem,
        unlisted: true,
      }),
    ).toBeUndefined();
  });

  it('works with category without link nor child', () => {
    expect(
      findFirstSidebarItemLink(
        testCategory({
          href: undefined,
        }),
      ),
    ).toBeUndefined();
  });

  it('works with category with link', () => {
    expect(
      findFirstSidebarItemLink(
        testCategory({
          href: '/itemPath',
        }),
      ),
    ).toBe('/itemPath');
  });

  it('works with deeply nested category', () => {
    expect(
      findFirstSidebarItemLink(
        testCategory({
          href: '/category1',
          linkUnlisted: true,
          items: [
            {type: 'html', value: '<p>test1</p>'},
            testCategory({
              href: '/category2',
              linkUnlisted: true,
              items: [
                {type: 'html', value: '<p>test2</p>'},
                testCategory({
                  href: '/category3',
                  items: [
                    {type: 'html', value: '<p>test2</p>'},
                    testCategory({
                      href: '/category4',
                      linkUnlisted: true,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ),
    ).toBe('/category3');
  });

  it('works with deeply nested link', () => {
    expect(
      findFirstSidebarItemLink(
        testCategory({
          href: '/category1',
          linkUnlisted: true,
          items: [
            {
              type: 'link',
              href: '/itemPathUnlisted',
              label: 'Label',
              unlisted: true,
            },
            testCategory({
              href: '/category2',
              linkUnlisted: true,
              items: [
                testCategory({
                  href: '/category3',
                  linkUnlisted: true,
                  items: [
                    {
                      type: 'link',
                      href: '/itemPathUnlisted2',
                      label: 'Label',
                      unlisted: true,
                    },
                    testCategory({
                      href: '/category4',
                      linkUnlisted: true,
                    }),
                    {
                      type: 'link',
                      href: '/itemPathListed1',
                      label: 'Label',
                    },
                    testCategory({
                      href: '/category5',
                    }),
                    {
                      type: 'link',
                      href: '/itemPathListed2',
                      label: 'Label',
                      unlisted: true,
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
      ),
    ).toBe('/itemPathListed1');
  });

  it('works with category with deeply nested category link unlisted', () => {
    expect(
      findFirstSidebarItemLink(
        testCategory({
          href: undefined,
          items: [
            {type: 'html', value: '<p>test1</p>'},
            testCategory({
              href: undefined,
              items: [
                {type: 'html', value: '<p>test2</p>'},
                testCategory({
                  href: '/itemPath',
                  linkUnlisted: true,
                }),
              ],
            }),
          ],
        }),
      ),
    ).toBeUndefined();
  });

  it('works with category with deeply nested link unlisted', () => {
    expect(
      findFirstSidebarItemLink(
        testCategory({
          href: undefined,
          items: [
            testCategory({
              href: undefined,
              items: [
                {
                  type: 'link',
                  href: '/itemPath',
                  label: 'Label',
                  unlisted: true,
                },
              ],
            }),
          ],
        }),
      ),
    ).toBeUndefined();
  });
});

describe('isActiveSidebarItem', () => {
  it('works with link href', () => {
    const item: PropSidebarItem = {
      type: 'link',
      href: '/itemPath',
      label: 'Label',
    };

    expect(isActiveSidebarItem(item, '/nonexistentPath')).toBe(false);

    expect(isActiveSidebarItem(item, '/itemPath')).toBe(true);

    // Ensure it's not trailing slash sensitive:
    expect(isActiveSidebarItem(item, '/itemPath/')).toBe(true);
    expect(
      isActiveSidebarItem({...item, href: '/itemPath/'}, '/itemPath'),
    ).toBe(true);
  });

  it('works with category href', () => {
    const item: PropSidebarItem = testCategory({
      href: '/itemPath',
    });

    expect(isActiveSidebarItem(item, '/nonexistentPath')).toBe(false);

    expect(isActiveSidebarItem(item, '/itemPath')).toBe(true);

    // Ensure it's not trailing slash sensitive:
    expect(isActiveSidebarItem(item, '/itemPath/')).toBe(true);
    expect(
      isActiveSidebarItem({...item, href: '/itemPath/'}, '/itemPath'),
    ).toBe(true);
  });

  it('works with category nested items', () => {
    const item: PropSidebarItem = testCategory({
      href: '/category-path',
      items: [
        {
          type: 'link',
          href: '/sub-link-path',
          label: 'Label',
        },
        testCategory({
          href: '/sub-category-path',
          items: [
            {
              type: 'link',
              href: '/sub-sub-link-path',
              label: 'Label',
            },
          ],
        }),
      ],
    });

    expect(isActiveSidebarItem(item, '/nonexistentPath')).toBe(false);

    expect(isActiveSidebarItem(item, '/category-path')).toBe(true);
    expect(isActiveSidebarItem(item, '/sub-link-path')).toBe(true);
    expect(isActiveSidebarItem(item, '/sub-category-path')).toBe(true);
    expect(isActiveSidebarItem(item, '/sub-sub-link-path')).toBe(true);

    // Ensure it's not trailing slash sensitive:
    expect(isActiveSidebarItem(item, '/category-path/')).toBe(true);
    expect(isActiveSidebarItem(item, '/sub-link-path/')).toBe(true);
    expect(isActiveSidebarItem(item, '/sub-category-path/')).toBe(true);
    expect(isActiveSidebarItem(item, '/sub-sub-link-path/')).toBe(true);
  });
});

describe('isVisibleSidebarItem', () => {
  it('works with item', () => {
    const item: PropSidebarItem = {
      type: 'link',
      href: '/itemPath',
      label: 'Label',
    };

    expect(isVisibleSidebarItem(item, item.href)).toBe(true);
    expect(isVisibleSidebarItem(item, '/nonexistentPath/')).toBe(true);

    expect(isVisibleSidebarItem({...item, unlisted: false}, item.href)).toBe(
      true,
    );
    expect(
      isVisibleSidebarItem({...item, unlisted: undefined}, item.href),
    ).toBe(true);

    expect(isVisibleSidebarItem({...item, unlisted: true}, item.href)).toBe(
      true,
    );
    expect(
      isVisibleSidebarItem({...item, unlisted: true}, '/nonexistentPath/'),
    ).toBe(false);
  });

  it('works with category', () => {
    const subCategoryAllUnlisted = testCategory({
      href: '/sub-category-path',
      items: [
        {
          type: 'link',
          href: '/sub-sub-link-path',
          label: 'Label',
          unlisted: true,
        },
        {
          type: 'link',
          href: '/sub-sub-link-path',
          label: 'Label',
          unlisted: true,
        },
        testCategory({
          href: '/sub-sub-category-path',
          items: [
            {
              type: 'link',
              href: '/sub-sub-sub-link-path',
              label: 'Label',
              unlisted: true,
            },
          ],
        }),
      ],
    });

    expect(
      isVisibleSidebarItem(subCategoryAllUnlisted, '/nonexistentPath'),
    ).toBe(false);
    expect(
      isVisibleSidebarItem(
        subCategoryAllUnlisted,
        subCategoryAllUnlisted.href!,
      ),
    ).toBe(true);
    expect(
      isVisibleSidebarItem(subCategoryAllUnlisted, '/sub-sub-link-path'),
    ).toBe(true);
    expect(
      isVisibleSidebarItem(subCategoryAllUnlisted, '/sub-sub-sub-link-path'),
    ).toBe(true);

    const categorySomeUnlisted = testCategory({
      href: '/category-path',
      items: [
        {
          type: 'link',
          href: '/sub-link-path',
          label: 'Label',
        },
        subCategoryAllUnlisted,
      ],
    });
    expect(isVisibleSidebarItem(categorySomeUnlisted, '/nonexistentPath')).toBe(
      true,
    );
    expect(
      isVisibleSidebarItem(categorySomeUnlisted, categorySomeUnlisted.href!),
    ).toBe(true);
  });
});

describe('useSidebarBreadcrumbs', () => {
  const createUseSidebarBreadcrumbsMock =
    (sidebar: PropSidebar | undefined, breadcrumbsOption?: boolean) =>
    (location: string) =>
      renderHook(() => useSidebarBreadcrumbs(), {
        wrapper: ({children}) => (
          <StaticRouter location={location}>
            <Context.Provider
              value={
                {
                  globalData: {
                    'docusaurus-plugin-content-docs': {
                      default: {path: '/', breadcrumbs: breadcrumbsOption},
                    },
                  },
                } as unknown as DocusaurusContext
              }>
              <DocsSidebarProvider name="sidebarName" items={sidebar}>
                {children}
              </DocsSidebarProvider>
            </Context.Provider>
          </StaticRouter>
        ),
      }).result.current;
  it('returns empty for empty sidebar', () => {
    expect(createUseSidebarBreadcrumbsMock([])('/doesNotExist')).toEqual([]);
  });

  it('returns empty for sidebar but unknown pathname', () => {
    const sidebar = [testCategory(), testLink()];
    expect(createUseSidebarBreadcrumbsMock(sidebar)('/doesNotExist')).toEqual(
      [],
    );
  });

  it('returns first level category', () => {
    const pathname = '/somePathName';
    const sidebar = [testCategory({href: pathname}), testLink()];

    expect(createUseSidebarBreadcrumbsMock(sidebar)(pathname)).toEqual([
      sidebar[0],
    ]);
  });

  it('returns first level link', () => {
    const pathname = '/somePathName';
    const sidebar = [testCategory(), testLink({href: pathname})];

    expect(createUseSidebarBreadcrumbsMock(sidebar)(pathname)).toEqual([
      sidebar[1],
    ]);
  });

  it('returns nested category', () => {
    const pathname = '/somePathName';

    const categoryLevel3 = testCategory({
      href: pathname,
    });

    const categoryLevel2 = testCategory({
      items: [
        testCategory(),
        categoryLevel3,
        testLink({href: pathname}),
        testLink(),
      ],
    });

    const categoryLevel1 = testCategory({
      items: [testLink(), categoryLevel2],
    });

    const sidebar = [
      testLink(),
      testCategory(),
      categoryLevel1,
      testLink(),
      testCategory(),
    ];

    expect(createUseSidebarBreadcrumbsMock(sidebar)(pathname)).toEqual([
      categoryLevel1,
      categoryLevel2,
      categoryLevel3,
    ]);
  });

  it('returns nested link', () => {
    const pathname = '/somePathName';

    const link = testLink({href: pathname});

    const categoryLevel3 = testCategory({
      items: [testLink(), link, testLink()],
    });

    const categoryLevel2 = testCategory({
      items: [
        testCategory(),
        categoryLevel3,
        testLink({href: pathname}),
        testLink(),
      ],
    });

    const categoryLevel1 = testCategory({
      items: [testLink(), categoryLevel2],
    });

    const sidebar = [
      testLink(),
      testCategory(),
      categoryLevel1,
      testLink(),
      testCategory(),
    ];

    expect(createUseSidebarBreadcrumbsMock(sidebar)(pathname)).toEqual([
      categoryLevel1,
      categoryLevel2,
      categoryLevel3,
      link,
    ]);
  });

  it('returns null when breadcrumbs disabled', () => {
    expect(createUseSidebarBreadcrumbsMock([], false)('/foo')).toBeNull();
  });

  it('returns null when there is no sidebar', () => {
    expect(
      createUseSidebarBreadcrumbsMock(undefined, false)('/foo'),
    ).toBeNull();
  });
});

describe('useCurrentSidebarCategory', () => {
  const createUseCurrentSidebarCategoryMock =
    (sidebar?: PropSidebar) => (location: string) =>
      renderHook(() => useCurrentSidebarCategory(), {
        wrapper: ({children}) => (
          <DocsSidebarProvider name="sidebarName" items={sidebar}>
            <StaticRouter location={location}>{children}</StaticRouter>
          </DocsSidebarProvider>
        ),
      }).result.current;

  it('works for sidebar category', () => {
    const category: PropSidebarItemCategory = testCategory({
      href: '/cat',
    });
    const sidebar: PropSidebar = [
      testLink(),
      testLink(),
      category,
      testCategory(),
    ];

    const mockUseCurrentSidebarCategory =
      createUseCurrentSidebarCategoryMock(sidebar);

    expect(mockUseCurrentSidebarCategory('/cat')).toEqual(category);
  });

  it('works for nested sidebar category', () => {
    const category2: PropSidebarItemCategory = testCategory({
      href: '/cat2',
    });
    const category1: PropSidebarItemCategory = testCategory({
      href: '/cat1',
      items: [testLink(), testLink(), category2, testCategory()],
    });
    const sidebar: PropSidebar = [
      testLink(),
      testLink(),
      category1,
      testCategory(),
    ];

    const mockUseCurrentSidebarCategory =
      createUseCurrentSidebarCategoryMock(sidebar);

    expect(mockUseCurrentSidebarCategory('/cat2')).toEqual(category2);
  });

  it('works for category link item', () => {
    const link = testLink({href: '/my/link/path'});
    const category: PropSidebarItemCategory = testCategory({
      href: '/cat1',
      items: [testLink(), testLink(), link, testCategory()],
    });
    const sidebar: PropSidebar = [
      testLink(),
      testLink(),
      category,
      testCategory(),
    ];

    const mockUseCurrentSidebarCategory =
      createUseCurrentSidebarCategoryMock(sidebar);

    expect(mockUseCurrentSidebarCategory('/my/link/path')).toEqual(category);
  });

  it('works for nested category link item', () => {
    const link = testLink({href: '/my/link/path'});
    const category2: PropSidebarItemCategory = testCategory({
      href: '/cat2',
      items: [testLink(), testLink(), link, testCategory()],
    });
    const category1: PropSidebarItemCategory = testCategory({
      href: '/cat1',
      items: [testLink(), testLink(), category2, testCategory()],
    });
    const sidebar: PropSidebar = [
      testLink(),
      testLink(),
      category1,
      testCategory(),
    ];

    const mockUseCurrentSidebarCategory =
      createUseCurrentSidebarCategoryMock(sidebar);

    expect(mockUseCurrentSidebarCategory('/my/link/path')).toEqual(category2);
  });

  it('throws for non-category index page', () => {
    const category: PropSidebarItemCategory = {
      type: 'category',
      label: 'Category',
      collapsible: true,
      collapsed: false,
      items: [
        {type: 'link', href: '/cat/foo', label: 'Foo'},
        {type: 'link', href: '/cat/bar', label: 'Bar'},
        {type: 'link', href: '/baz', label: 'Baz'},
      ],
    };
    const mockUseCurrentSidebarCategory = createUseCurrentSidebarCategoryMock([
      category,
    ]);
    expect(() =>
      mockUseCurrentSidebarCategory('/cat'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"/cat is not associated with a category. useCurrentSidebarCategory() should only be used on category index pages."`,
    );
  });

  it('throws when sidebar is missing', () => {
    const mockUseCurrentSidebarCategory = createUseCurrentSidebarCategoryMock();
    expect(() =>
      mockUseCurrentSidebarCategory('/cat'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected: cant find current sidebar in context"`,
    );
  });
});
