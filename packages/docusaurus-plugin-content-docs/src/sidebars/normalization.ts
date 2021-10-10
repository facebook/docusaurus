/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  SidebarOptions,
  UnprocessedSidebarItem,
  UnprocessedSidebar,
  UnprocessedSidebars,
} from '../types';
import {
  SidebarCategoriesShorthand,
  SidebarItemCategoryConfig,
  SidebarItemConfig,
  isCategoriesShorthand,
  SidebarConfig,
  SidebarsConfig,
} from './validation';
import {flatMap, mapValues} from 'lodash';

function normalizeCategoriesShorthand(
  sidebar: SidebarCategoriesShorthand,
  options: SidebarOptions,
): SidebarItemCategoryConfig[] {
  return Object.entries(sidebar).map(([label, items]) => ({
    type: 'category',
    collapsed: options.sidebarCollapsed,
    collapsible: options.sidebarCollapsible,
    label,
    items,
  }));
}

/**
 * Normalizes recursively item and all its children. Ensures that at the end
 * each item will be an object with the corresponding type.
 */
function normalizeItem(
  item: SidebarItemConfig,
  options: SidebarOptions,
): UnprocessedSidebarItem[] {
  if (typeof item === 'string') {
    return [
      {
        type: 'doc',
        id: item,
      },
    ];
  }
  if (isCategoriesShorthand(item)) {
    return flatMap(normalizeCategoriesShorthand(item, options), (subitem) =>
      normalizeItem(subitem, options),
    );
  }
  return item.type === 'category'
    ? [
        {
          ...item,
          items: flatMap(item.items, (subItem) =>
            normalizeItem(subItem, options),
          ),
          collapsible: item.collapsible ?? options.sidebarCollapsible,
          collapsed: item.collapsed ?? options.sidebarCollapsed,
        },
      ]
    : [item];
}

function normalizeSidebar(
  sidebar: SidebarConfig,
  options: SidebarOptions,
): UnprocessedSidebar {
  const normalizedSidebar = Array.isArray(sidebar)
    ? sidebar
    : normalizeCategoriesShorthand(sidebar, options);

  return flatMap(normalizedSidebar, (subitem) =>
    normalizeItem(subitem, options),
  );
}

export function normalizeSidebars(
  sidebars: SidebarsConfig,
  options: SidebarOptions,
): UnprocessedSidebars {
  return mapValues(sidebars, (subitem) => normalizeSidebar(subitem, options));
}
