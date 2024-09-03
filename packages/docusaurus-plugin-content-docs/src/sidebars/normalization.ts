/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import logger from '@docusaurus/logger';
import {isCategoriesShorthand} from './utils';
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
    // This will never throw anyways
    return normalizeSidebar(item, 'sidebar items slice');
  }
  if (
    (item.type === 'doc' || item.type === 'ref') &&
    typeof item.label === 'string'
  ) {
    return [{...item, translatable: true}];
  }
  if (item.type === 'category') {
    const normalizedCategory: NormalizedSidebarItemCategory = {
      ...item,
      items: normalizeSidebar(
        item.items,
        logger.interpolate`code=${'items'} of the category name=${item.label}`,
      ),
    };
    return [normalizedCategory];
  }
  return [item];
}

function normalizeSidebar(
  sidebar: SidebarConfig,
  place: string,
): NormalizedSidebar {
  if (!Array.isArray(sidebar) && !isCategoriesShorthand(sidebar)) {
    throw new Error(
      logger.interpolate`Invalid sidebar items collection code=${JSON.stringify(
        sidebar,
      )} in ${place}: it must either be an array of sidebar items or a shorthand notation (which doesn't contain a code=${'type'} property). See url=${'https://docusaurus.io/docs/sidebar/items'} for all valid syntaxes.`,
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
  return _.mapValues(sidebars, (sidebar, id) =>
    normalizeSidebar(sidebar, logger.interpolate`sidebar name=${id}`),
  );
}
