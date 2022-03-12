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
  getBreadcrumbs,
} from '../docsUtils';
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

  function callHook(docId: string | undefined) {
    const {result} = renderHook(() => useDocById(docId), {
      wrapper: ({children}) => (
        <DocsVersionProvider version={version}>{children}</DocsVersionProvider>
      ),
    });
    return result.current;
  }

  it('accepts undefined', () => {
    expect(callHook(undefined)).toBeUndefined();
  });

  it('finds doc1', () => {
    expect(callHook('doc1')).toMatchObject({id: 'doc1'});
  });
  it('finds doc2', () => {
    expect(callHook('doc2')).toMatchObject({id: 'doc2'});
  });

  it('throws for doc3', () => {
    expect(() => callHook('doc3')).toThrowErrorMatchingInlineSnapshot(
      `"no version doc found by id=doc3"`,
    );
  });
});

describe('findSidebarCategory', () => {
  it('os able to return undefined', () => {
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
    ).toEqual(undefined);
  });

  it('works with category with link', () => {
    expect(
      findFirstCategoryLink(
        testCategory({
          href: '/itemPath',
        }),
      ),
    ).toEqual('/itemPath');
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
    ).toEqual('/itemPath');
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
    ).toEqual('/itemPath');
  });
});

describe('isActiveSidebarItem', () => {
  it('works with link href', () => {
    const item: PropSidebarItem = {
      type: 'link',
      href: '/itemPath',
      label: 'Label',
    };

    expect(isActiveSidebarItem(item, '/unexistingPath')).toEqual(false);

    expect(isActiveSidebarItem(item, '/itemPath')).toEqual(true);

    // Ensure it's not trailing slash sensitive:
    expect(isActiveSidebarItem(item, '/itemPath/')).toEqual(true);
    expect(
      isActiveSidebarItem({...item, href: '/itemPath/'}, '/itemPath'),
    ).toEqual(true);
  });

  it('works with category href', () => {
    const item: PropSidebarItem = testCategory({
      href: '/itemPath',
    });

    expect(isActiveSidebarItem(item, '/unexistingPath')).toEqual(false);

    expect(isActiveSidebarItem(item, '/itemPath')).toEqual(true);

    // Ensure it's not trailing slash sensitive:
    expect(isActiveSidebarItem(item, '/itemPath/')).toEqual(true);
    expect(
      isActiveSidebarItem({...item, href: '/itemPath/'}, '/itemPath'),
    ).toEqual(true);
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

    expect(isActiveSidebarItem(item, '/unexistingPath')).toEqual(false);

    expect(isActiveSidebarItem(item, '/category-path')).toEqual(true);
    expect(isActiveSidebarItem(item, '/sub-link-path')).toEqual(true);
    expect(isActiveSidebarItem(item, '/sub-category-path')).toEqual(true);
    expect(isActiveSidebarItem(item, '/sub-sub-link-path')).toEqual(true);

    // Ensure it's not trailing slash sensitive:
    expect(isActiveSidebarItem(item, '/category-path/')).toEqual(true);
    expect(isActiveSidebarItem(item, '/sub-link-path/')).toEqual(true);
    expect(isActiveSidebarItem(item, '/sub-category-path/')).toEqual(true);
    expect(isActiveSidebarItem(item, '/sub-sub-link-path/')).toEqual(true);
  });
});

describe('getBreadcrumbs', () => {
  it('returns empty for empty sidebar', () => {
    expect(
      getBreadcrumbs({
        sidebar: [],
        pathname: '/doesNotExist',
      }),
    ).toEqual([]);
  });

  it('returns empty for sidebar but unknown pathname', () => {
    const sidebar = [testCategory(), testLink()];
    expect(
      getBreadcrumbs({
        sidebar,
        pathname: '/doesNotExist',
      }),
    ).toEqual([]);
  });

  it('returns first level category', () => {
    const pathname = '/somePathName';
    const sidebar = [testCategory({href: pathname}), testLink()];

    expect(
      getBreadcrumbs({
        sidebar,
        pathname,
      }),
    ).toEqual([sidebar[0]]);
  });

  it('returns first level link', () => {
    const pathname = '/somePathName';
    const sidebar = [testCategory(), testLink({href: pathname})];

    expect(
      getBreadcrumbs({
        sidebar,
        pathname,
      }),
    ).toEqual([sidebar[1]]);
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

    expect(
      getBreadcrumbs({
        sidebar,
        pathname,
      }),
    ).toEqual([categoryLevel1, categoryLevel2, categoryLevel3]);
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

    expect(
      getBreadcrumbs({
        sidebar,
        pathname,
      }),
    ).toEqual([categoryLevel1, categoryLevel2, categoryLevel3, link]);
  });
});
