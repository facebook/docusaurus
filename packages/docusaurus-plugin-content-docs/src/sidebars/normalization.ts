/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  NormalizedSidebarItem,
  NormalizedSidebar,
  NormalizedSidebars,
  SidebarCategoriesShorthand,
  SidebarItemCategoryConfig,
  SidebarItemConfig,
  SidebarConfig,
  SidebarsConfig,
  NormalizedSidebarItemCategory,
} from './types';
import {isCategoriesShorthand} from './utils';
import _ from 'lodash';

function normalizeCategoriesShorthand(
  sidebar: SidebarCategoriesShorthand,
): SidebarItemCategoryConfig[] {
  return Object.entries(sidebar).map(([label, items]) => ({
    type: 'category',
    label,
    items,
  }));
}

/**
 * Normalizes recursively item and all its children. Ensures that at the end
 * each item will be an object with the corresponding type.
 */
export function normalizeItem(
  item: SidebarItemConfig,
): NormalizedSidebarItem[] {
  if (typeof item === 'string') {
    return [
      {
        type: 'doc',
        id: item,
      },
    ];
  }
  if (isCategoriesShorthand(item)) {
    return normalizeCategoriesShorthand(item).flatMap((subItem) =>
      normalizeItem(subItem),
    );
  }
  if (item.type === 'category') {
    if (typeof item.items !== 'undefined' && typeof item.items !== 'object') {
      throw new Error(
        `Invalid category ${JSON.stringify(
          item,
        )}: items must be an array of sidebar items or a category shorthand`,
      );
    }
    const normalizedCategory: NormalizedSidebarItemCategory = {
      ...item,
      items: Array.isArray(item.items)
        ? item.items.flatMap((subItem) => normalizeItem(subItem))
        : normalizeCategoriesShorthand(item.items).flatMap((subItem) =>
            normalizeItem(subItem),
          ),
    };
    return [normalizedCategory];
  }
  return [item];
}

function normalizeSidebar(sidebar: SidebarConfig): NormalizedSidebar {
  const normalizedSidebar = Array.isArray(sidebar)
    ? sidebar
    : normalizeCategoriesShorthand(sidebar);

  return normalizedSidebar.flatMap((subItem) => normalizeItem(subItem));
}

export function normalizeSidebars(
  sidebars: SidebarsConfig,
): NormalizedSidebars {
  return _.mapValues(sidebars, normalizeSidebar);
}
