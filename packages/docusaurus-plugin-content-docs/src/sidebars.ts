/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import importFresh from 'import-fresh';
import {
  SidebarItemCategory,
  Sidebar,
  SidebarRaw,
  SidebarItem,
  SidebarItemCategoryRaw,
} from './types';

/**
 * Check that item contains only allowed keys
 */
function assertItem(item: Object, keys: string[]): void {
  const unknownKeys = Object.keys(item).filter(
    key => !keys.includes(key) && key !== 'type',
  );

  if (unknownKeys.length) {
    throw new Error(
      `Unknown sidebar item keys: ${unknownKeys}. Item: ${JSON.stringify(
        item,
      )}`,
    );
  }
}

/**
 * Normalizes recursively category and all its children. Ensures, that at the end
 * each item will be an object with the corresponding type
 */
function normalizeCategory(
  category: SidebarItemCategoryRaw,
  level = 0,
): SidebarItemCategory {
  if (level === 0 && category.type !== 'category') {
    throw new Error(
      `Error loading ${JSON.stringify(
        category,
      )}. First level item of a sidebar must be a category`,
    );
  }
  assertItem(category, ['items', 'label']);

  if (!Array.isArray(category.items)) {
    throw new Error(
      `Error loading "${category.label}" category. Category items must be array.`,
    );
  }

  const items: SidebarItem[] = category.items.map(item => {
    if (typeof item === 'string') {
      return {
        type: 'doc',
        id: item,
      };
    }
    switch (item.type) {
      case 'category':
        return normalizeCategory(item as SidebarItemCategoryRaw, level + 1);
      case 'link':
        assertItem(item, ['href', 'label']);
        break;
      case 'ref':
      case 'doc':
        assertItem(item, ['id']);
        break;
      default:
        throw new Error(`Unknown sidebar item type: ${item.type}`);
    }

    return item as SidebarItem;
  });

  return {...category, items};
}

/**
 * Converts sidebars object to mapping to arrays of sidebar item objects
 */
function normalizeSidebar(sidebars: SidebarRaw): Sidebar {
  return Object.entries(sidebars).reduce(
    (acc: Sidebar, [sidebarId, sidebar]) => {
      let normalizedSidebar: SidebarItemCategoryRaw[];

      if (!Array.isArray(sidebar)) {
        // convert sidebar to a more generic structure
        normalizedSidebar = Object.entries(sidebar).map(([label, items]) => ({
          type: 'category',
          label,
          items,
        }));
      } else {
        normalizedSidebar = sidebar;
      }

      acc[sidebarId] = normalizedSidebar.map(item => normalizeCategory(item));

      return acc;
    },
    {},
  );
}

export default function loadSidebars(sidebarPath: string): Sidebar {
  // We don't want sidebars to be cached because of hotreloading.
  let allSidebars: SidebarRaw = {};
  if (sidebarPath) {
    allSidebars = importFresh(sidebarPath) as SidebarRaw;
  }
  return normalizeSidebar(allSidebars);
}
