/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {
  findFirstCategoryLink,
  isActiveSidebarItem,
  DocsVersionProvider,
  useDocsVersion,
  useDocById,
  useDocsSidebar,
  DocsSidebarProvider,
  findSidebarCategory,
  useCurrentSidebarCategory,
  useSidebarBreadcrumbs,
} from '../docsUtils';
import {StaticRouter} from 'react-router-dom';
import {Context} from '@docusaurus/docusaurusContext';
import type {
  PropSidebar,
  PropSidebarItem,
  PropSidebarItemCategory,
  PropSidebarItemLink,
  PropVersionMetadata,
} from '@docusaurus/plugin-content-docs';

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
    ...data,
  };
}

describe('useDocsVersion', () => {
  it('throws if context provider is missing', () => {
    expect(
      () => renderHook(() => useDocsVersion()).result.current,
    ).toThrowErrorMatchingInlineSnapshot(
      `"Hook useDocsVersion is called outside the <DocsVersionProvider>. "`,
    );
  });

  it('reads value from context provider', () => {
    const version = testVersion();
    const {result} = renderHook(() => useDocsVersion(), {
      wrapper: ({children}) => (
        <DocsVersionProvider version={version}>{children}</DocsVersionProvider>
      ),
    });
    expect(result.current).toBe(version);
  });
});

describe('useDocsSidebar', () => {
  it('throws if context provider is missing', () => {
    expect(
      () => renderHook(() => useDocsSidebar()).result.current,
    ).toThrowErrorMatchingInlineSnapshot(
      `"Hook useDocsSidebar is called outside the <DocsSidebarProvider>. "`,
    );
  });

  it('reads value from context provider', () => {
    const sidebar: PropSidebar = [];
    const {result} = renderHook(() => useDocsSidebar(), {
      wrapper: ({children}) => (
        <DocsSidebarProvider sidebar={sidebar}>{children}</DocsSidebarProvider>
      ),
    });
    expect(result.current).toBe(sidebar);
  });
});

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
  it('works with category without link nor child', () => {
    expect(
      findFirstCategoryLink(
        testCategory({
          href: undefined,
        }),
      ),
    ).toBeUndefined();
  });

  it('works with category with link', () => {
    expect(
      findFirstCategoryLink(
        testCategory({
          href: '/itemPath',
        }),
      ),
    ).toBe('/itemPath');
  });

  it('works with category with deeply nested category link', () => {
    expect(
      findFirstCategoryLink(
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
                }),
              ],
            }),
          ],
        }),
      ),
    ).toBe('/itemPath');
  });

  it('works with category with deeply nested link', () => {
    expect(
      findFirstCategoryLink(
        testCategory({
          href: undefined,
          items: [
            testCategory({
              href: undefined,
              items: [{type: 'link', href: '/itemPath', label: 'Label'}],
            }),
          ],
        }),
      ),
    ).toBe('/itemPath');
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

describe('useSidebarBreadcrumbs', () => {
  const createUseSidebarBreadcrumbsMock =
    (sidebar: PropSidebar, breadcrumbsOption?: boolean) => (location: string) =>
      renderHook(() => useSidebarBreadcrumbs(), {
        wrapper: ({children}) => (
          <StaticRouter location={location}>
            <Context.Provider
              // eslint-disable-next-line react/jsx-no-constructed-context-values
              value={{
                globalData: {
                  'docusaurus-plugin-content-docs': {
                    default: {path: '/', breadcrumbs: breadcrumbsOption},
                  },
                },
              }}>
              <DocsSidebarProvider sidebar={sidebar}>
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
    expect(createUseSidebarBreadcrumbsMock(null, false)('/foo')).toBeNull();
  });
});

describe('useCurrentSidebarCategory', () => {
  const createUseCurrentSidebarCategoryMock =
    (sidebar?: PropSidebar) => (location: string) =>
      renderHook(() => useCurrentSidebarCategory(), {
        wrapper: ({children}) => (
          <DocsSidebarProvider sidebar={sidebar}>
            <StaticRouter location={location}>{children}</StaticRouter>
          </DocsSidebarProvider>
        ),
      }).result.current;
  it('works', () => {
    const category = {
      type: 'category',
      href: '/cat',
      items: [
        {type: 'link', href: '/cat/foo', label: 'Foo'},
        {type: 'link', href: '/cat/bar', label: 'Bar'},
        {type: 'link', href: '/baz', label: 'Baz'},
      ],
    };
    const mockUseCurrentSidebarCategory = createUseCurrentSidebarCategoryMock([
      {type: 'link', href: '/cat/fake', label: 'Fake'},
      category,
    ]);
    expect(mockUseCurrentSidebarCategory('/cat')).toEqual(category);
  });

  it('throws for non-category index page', () => {
    const category = {
      type: 'category',
      items: [
        {type: 'link', href: '/cat/foo', label: 'Foo'},
        {type: 'link', href: '/cat/bar', label: 'Bar'},
        {type: 'link', href: '/baz', label: 'Baz'},
      ],
    };
    const mockUseCurrentSidebarCategory = createUseCurrentSidebarCategoryMock([
      category,
    ]);
    expect(() => mockUseCurrentSidebarCategory('/cat'))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unexpected: sidebar category could not be found for pathname='/cat'.
      Hook useCurrentSidebarCategory() should only be used on Category pages"
    `);
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
