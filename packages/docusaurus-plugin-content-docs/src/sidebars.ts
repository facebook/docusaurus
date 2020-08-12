/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import flatMap from 'lodash.flatmap';
import fs from 'fs-extra';
import importFresh from 'import-fresh';
import {
  Sidebars,
  SidebarItem,
  SidebarItemCategoryRaw,
  SidebarItemRaw,
  SidebarItemLink,
  SidebarItemDoc,
  SidebarCategoryShorthandRaw,
} from './types';

// Sidebar given by user that is not normalized yet. e.g: sidebars.json
export interface SidebarJson {
  [sidebarId: string]: SidebarCategoryShorthandRaw | SidebarItemRaw[];
}

function isCategoryShorthand(
  item: SidebarItemRaw,
): item is SidebarCategoryShorthandRaw {
  return typeof item !== 'string' && !item.type;
}

// categories are collapsed by default, unless user set collapsed = false
const defaultCategoryCollapsedValue = true;

/**
 * Convert {category1: [item1,item2]} shorthand syntax to long-form syntax
 */
function normalizeCategoryShorthand(
  sidebar: SidebarCategoryShorthandRaw,
): SidebarItemCategoryRaw[] {
  return Object.entries(sidebar).map(([label, items]) => ({
    type: 'category',
    collapsed: defaultCategoryCollapsedValue,
    label,
    items,
  }));
}

/**
 * Check that item contains only allowed keys.
 */
function assertItem<K extends string>(
  item: any,
  keys: K[],
): asserts item is Record<K, any> {
  const unknownKeys = Object.keys(item).filter(
    // @ts-expect-error: key is always string
    (key) => !keys.includes(key as string) && key !== 'type',
  );

  if (unknownKeys.length) {
    throw new Error(
      `Unknown sidebar item keys: ${unknownKeys}. Item: ${JSON.stringify(
        item,
      )}`,
    );
  }
}

function assertIsCategory(
  item: unknown,
): asserts item is SidebarItemCategoryRaw {
  assertItem(item, ['items', 'label', 'collapsed']);
  if (typeof item.label !== 'string') {
    throw new Error(
      `Error loading ${JSON.stringify(item)}. "label" must be a string.`,
    );
  }
  if (!Array.isArray(item.items)) {
    throw new Error(
      `Error loading ${JSON.stringify(item)}. "items" must be an array.`,
    );
  }
  // "collapsed" is an optional property
  if (item.hasOwnProperty('collapsed') && typeof item.collapsed !== 'boolean') {
    throw new Error(
      `Error loading ${JSON.stringify(item)}. "collapsed" must be a boolean.`,
    );
  }
}

function assertIsDoc(item: unknown): asserts item is SidebarItemDoc {
  assertItem(item, ['id']);
  if (typeof item.id !== 'string') {
    throw new Error(
      `Error loading ${JSON.stringify(item)}. "id" must be a string.`,
    );
  }
}

function assertIsLink(item: unknown): asserts item is SidebarItemLink {
  assertItem(item, ['href', 'label']);
  if (typeof item.href !== 'string') {
    throw new Error(
      `Error loading ${JSON.stringify(item)}. "href" must be a string.`,
    );
  }
  if (typeof item.label !== 'string') {
    throw new Error(
      `Error loading ${JSON.stringify(item)}. "label" must be a string.`,
    );
  }
}

/**
 * Normalizes recursively item and all its children. Ensures that at the end
 * each item will be an object with the corresponding type.
 */
function normalizeItem(item: SidebarItemRaw): SidebarItem[] {
  if (typeof item === 'string') {
    return [
      {
        type: 'doc',
        id: item,
      },
    ];
  }
  if (isCategoryShorthand(item)) {
    return flatMap(normalizeCategoryShorthand(item), normalizeItem);
  }
  switch (item.type) {
    case 'category':
      assertIsCategory(item);
      return [
        {
          collapsed: defaultCategoryCollapsedValue,
          ...item,
          items: flatMap(item.items, normalizeItem),
        },
      ];
    case 'link':
      assertIsLink(item);
      return [item];
    case 'ref':
    case 'doc':
      assertIsDoc(item);
      return [item];
    default: {
      const extraMigrationError =
        item.type === 'subcategory'
          ? "Docusaurus v2: 'subcategory' has been renamed as 'category'"
          : '';
      throw new Error(
        `Unknown sidebar item type [${
          item.type
        }]. Sidebar item=${JSON.stringify(item)} ${extraMigrationError}`,
      );
    }
  }
}

/**
 * Converts sidebars object to mapping to arrays of sidebar item objects.
 */
function normalizeSidebar(sidebars: SidebarJson): Sidebars {
  return Object.entries(sidebars).reduce(
    (acc: Sidebars, [sidebarId, sidebar]) => {
      const normalizedSidebar: SidebarItemRaw[] = Array.isArray(sidebar)
        ? sidebar
        : normalizeCategoryShorthand(sidebar);

      acc[sidebarId] = flatMap(normalizedSidebar, normalizeItem);

      return acc;
    },
    {},
  );
}

export function loadSidebars(sidebarPaths?: string[]): Sidebars {
  // We don't want sidebars to be cached because of hot reloading.
  const allSidebars: SidebarJson = {};

  if (!sidebarPaths || !sidebarPaths.length) {
    return {} as Sidebars;
  }

  sidebarPaths.forEach((sidebarPath) => {
    if (sidebarPath && fs.existsSync(sidebarPath)) {
      const sidebar = importFresh(sidebarPath) as SidebarJson;
      Object.assign(allSidebars, sidebar);
    }
  });

  return normalizeSidebar(allSidebars);
}
