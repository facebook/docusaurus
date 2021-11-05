/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {NormalizeSidebarsParams, SidebarOptions} from '../types';
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
  SidebarItemCategoryLink,
  NormalizedSidebarItemCategory,
} from './types';
import {mapValues} from 'lodash';
import {NormalizeSidebarParams} from '../types';
import {createSlugger, normalizeUrl} from '@docusaurus/utils';

function normalizeCategoryLink(
  category: SidebarItemCategoryConfig,
  params: NormalizeSidebarParams,
): SidebarItemCategoryLink | undefined {
  if (category.link?.type === 'generated-index') {
    // default slug logic can be improved
    function getDefaultSlug() {
      const categoryLabelSlug = params.slugger.slug(category.label);
      return `${params.sidebarName}/category/${categoryLabelSlug}`;
    }
    const slug = category.link.slug ?? getDefaultSlug();
    const permalink = normalizeUrl([params.version.versionPath, slug]);
    return {
      ...category.link,
      slug,
      permalink,
    };
  }
  return category.link;
}

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
  options: NormalizeSidebarParams,
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
    return normalizeCategoriesShorthand(item, options).flatMap((subItem) =>
      normalizeItem(subItem, options),
    );
  }
  if (item.type === 'category') {
    const link = normalizeCategoryLink(item, options);
    const normalizedCategory: NormalizedSidebarItemCategory = {
      ...item,
      link,
      items: item.items.flatMap((subItem) => normalizeItem(subItem, options)),
      collapsible: item.collapsible ?? options.sidebarCollapsible,
      collapsed: item.collapsed ?? options.sidebarCollapsed,
    };
    return [normalizedCategory];
  }
  return [item];
}

function normalizeSidebar(
  sidebar: SidebarConfig,
  options: NormalizeSidebarParams,
): NormalizedSidebar {
  const normalizedSidebar = Array.isArray(sidebar)
    ? sidebar
    : normalizeCategoriesShorthand(sidebar, options);

  return normalizedSidebar.flatMap((subItem) =>
    normalizeItem(subItem, options),
  );
}

export function normalizeSidebars(
  sidebars: SidebarsConfig,
  params: NormalizeSidebarsParams,
): NormalizedSidebars {
  const slugger = createSlugger();

  return mapValues(sidebars, (items, sidebarName) => {
    return normalizeSidebar(items, {
      ...params,
      sidebarName,
      slugger,
    });
  });
}
