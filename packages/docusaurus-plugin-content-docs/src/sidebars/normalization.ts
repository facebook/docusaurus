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
    return [{type: 'doc', id: item}];
  }
  if (isCategoriesShorthand(item)) {
    return normalizeSidebar(item);
  }
  if (item.type === 'category') {
    const normalizedCategory: NormalizedSidebarItemCategory = {
      ...item,
      items: normalizeSidebar(item.items),
    };
    return [normalizedCategory];
  }
  return [item];
}

function normalizeSidebar(sidebar: SidebarConfig): NormalizedSidebar {
  if (!Array.isArray(sidebar) && !isCategoriesShorthand(sidebar)) {
    throw new Error(
      `Invalid sidebar items collection ${JSON.stringify(
        sidebar,
      )}: it must either be an array of sidebar items or a shorthand notation (which doesn't contain a "type" property). See https://docusaurus.io/docs/sidebar/items for all valid syntax.`,
    );
  }

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
