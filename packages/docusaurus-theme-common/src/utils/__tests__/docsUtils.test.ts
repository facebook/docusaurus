/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {findFirstCategoryLink, isActiveSidebarItem} from '../docsUtils';
import {
  PropSidebarItem,
  PropSidebarItemCategory,
} from '@docusaurus/plugin-content-docs';

// Make tests more readable with some useful category item defaults
function category(
  item: Partial<PropSidebarItemCategory>,
): PropSidebarItemCategory {
  return {
    type: 'category',
    href: undefined,
    label: 'Category label',
    items: [],
    collapsed: true,
    collapsible: true,
    ...item,
  };
}

describe('docsUtils', () => {
  describe('findFirstCategoryLink', () => {
    test('category without link nor child', () => {
      expect(
        findFirstCategoryLink(
          category({
            href: undefined,
          }),
        ),
      ).toEqual(undefined);
    });

    test('category with link', () => {
      expect(
        findFirstCategoryLink(
          category({
            href: '/itemPath',
          }),
        ),
      ).toEqual('/itemPath');
    });

    test('category with deeply nested category link', () => {
      expect(
        findFirstCategoryLink(
          category({
            href: undefined,
            items: [
              category({
                href: undefined,
                items: [
                  category({
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
          category({
            href: undefined,
            items: [
              category({
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
      const item: PropSidebarItem = category({
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
      const item: PropSidebarItem = category({
        href: '/category-path',
        items: [
          {
            type: 'link',
            href: '/sub-link-path',
            label: 'Label',
          },
          category({
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
