/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {SidebarOptions} from '../types';
import {
  NormalizedSidebarItem,
  NormalizedSidebar,
  NormalizedSidebars,
  SidebarCategoriesShorthand,
  SidebarItemCategoryConfig,
  SidebarItemConfig,
  SidebarConfig,
  SidebarsConfig,
  isCategoriesShorthand,
} from './types';
import {mapValues} from 'lodash';

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
    return normalizeCategoriesShorthand(item, options).flatMap((subitem) =>
      normalizeItem(subitem, options),
    );
  }
  return item.type === 'category'
    ? [
        {
          ...item,
          items: item.items.flatMap((subItem) =>
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
): NormalizedSidebar {
  const normalizedSidebar = Array.isArray(sidebar)
    ? sidebar
    : normalizeCategoriesShorthand(sidebar, options);

  return normalizedSidebar.flatMap((subitem) =>
    normalizeItem(subitem, options),
  );
}

export function normalizeSidebars(
  sidebars: SidebarsConfig,
  options: SidebarOptions,
): NormalizedSidebars {
  return mapValues(sidebars, (subitem) => normalizeSidebar(subitem, options));
}
