/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {isActiveSidebarItem} from '../docsUtils';
import {PropSidebarItem} from '@docusaurus/plugin-content-docs';

describe('docsUtils', () => {
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
      const item: PropSidebarItem = {
        type: 'category',
        href: '/itemPath',
        label: 'Label',
        items: [],
        collapsed: true,
        collapsible: true,
      };

      expect(isActiveSidebarItem(item, '/unexistingPath')).toEqual(false);

      expect(isActiveSidebarItem(item, '/itemPath')).toEqual(true);

      // Ensure it's not trailing slash sensitive:
      expect(isActiveSidebarItem(item, '/itemPath/')).toEqual(true);
      expect(
        isActiveSidebarItem({...item, href: '/itemPath/'}, '/itemPath'),
      ).toEqual(true);
    });

    test('with category nested items', () => {
      const item: PropSidebarItem = {
        type: 'category',
        href: '/category-path',
        label: 'Label',
        items: [
          {
            type: 'link',
            href: '/sub-link-path',
            label: 'Label',
          },
          {
            type: 'category',
            href: '/sub-category-path',
            label: 'Label',
            items: [
              {
                type: 'link',
                href: '/sub-sub-link-path',
                label: 'Label',
              },
            ],
            collapsed: true,
            collapsible: true,
          },
        ],
        collapsed: true,
        collapsible: true,
      };

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
