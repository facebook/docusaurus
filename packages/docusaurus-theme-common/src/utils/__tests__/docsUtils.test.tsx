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
} from '../docsUtils';
import {
  PropSidebar,
  PropSidebarItem,
  PropSidebarItemCategory,
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

describe('docsUtils', () => {
  describe('useDocsVersion', () => {
    test('should throw if context provider is missing', () => {
      expect(
        () => renderHook(() => useDocsVersion()).result.current,
      ).toThrowErrorMatchingInlineSnapshot(
        `"This hook requires usage of <DocsVersionProvider>"`,
      );
    });

    test('should read value from context provider', () => {
      const version = testVersion();
      const {result} = renderHook(() => useDocsVersion(), {
        wrapper: ({children}) => (
          <DocsVersionProvider version={version}>
            {children}
          </DocsVersionProvider>
        ),
      });
      expect(result.current).toBe(version);
    });
  });

  describe('useDocsSidebar', () => {
    test('should throw if context provider is missing', () => {
      expect(
        () => renderHook(() => useDocsSidebar()).result.current,
      ).toThrowErrorMatchingInlineSnapshot(
        `"This hook requires usage of <DocsSidebarProvider>"`,
      );
    });

    test('should read value from context provider', () => {
      const sidebar: PropSidebar = [];
      const {result} = renderHook(() => useDocsSidebar(), {
        wrapper: ({children}) => (
          <DocsSidebarProvider sidebar={sidebar}>
            {children}
          </DocsSidebarProvider>
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
          <DocsVersionProvider version={version}>
            {children}
          </DocsVersionProvider>
        ),
      });
      return result.current;
    }

    test('should accept undefined', () => {
      expect(callHook(undefined)).toBeUndefined();
    });

    test('should find doc1', () => {
      expect(callHook('doc1')).toMatchObject({id: 'doc1'});
    });
    test('should find doc2', () => {
      expect(callHook('doc2')).toMatchObject({id: 'doc2'});
    });

    test('should throw for doc3', () => {
      expect(() => callHook('doc3')).toThrowErrorMatchingInlineSnapshot(
        `"no version doc found by id=doc3"`,
      );
    });
  });

  describe('findSidebarCategory', () => {
    test('should be able to return undefined', () => {
      expect(findSidebarCategory([], () => false)).toBeUndefined();
      expect(
        findSidebarCategory([testCategory(), testCategory()], () => false),
      ).toBeUndefined();
    });

    test('should return first element matching predicate', () => {
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

    test('should be able to search in sub items', () => {
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
      expect(findSidebarCategory(sidebar, (item) => item === sub1)).toEqual(
        sub1,
      );
      expect(findSidebarCategory(sidebar, (item) => item === sub2)).toEqual(
        sub2,
      );
      expect(findSidebarCategory(sidebar, (item) => item === subsub1)).toEqual(
        subsub1,
      );
      expect(findSidebarCategory(sidebar, (item) => item === subsub2)).toEqual(
        subsub2,
      );
    });
  });

  describe('findFirstCategoryLink', () => {
    test('category without link nor child', () => {
      expect(
        findFirstCategoryLink(
          testCategory({
            href: undefined,
          }),
        ),
      ).toEqual(undefined);
    });

    test('category with link', () => {
      expect(
        findFirstCategoryLink(
          testCategory({
            href: '/itemPath',
          }),
        ),
      ).toEqual('/itemPath');
    });

    test('category with deeply nested category link', () => {
      expect(
        findFirstCategoryLink(
          testCategory({
            href: undefined,
            items: [
              testCategory({
                href: undefined,
                items: [
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

    test('category with deeply nested link', () => {
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
    test('with link href', () => {
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

    test('with category href', () => {
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

    test('with category nested items', () => {
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
});
