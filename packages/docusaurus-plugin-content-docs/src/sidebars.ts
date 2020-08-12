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
  SidebarItemLink,
  SidebarItemDoc,
  Sidebar,
} from './types';
import {mapValues, flatten} from 'lodash';
import {getElementsAround} from '@docusaurus/utils';

type SidebarItemCategoryJSON = {
  type: 'category';
  label: string;
  items: SidebarItemJSON[];
  collapsed?: boolean;
};

type SidebarItemJSON =
  | string
  | SidebarCategoryShorthandJSON
  | SidebarItemDoc
  | SidebarItemLink
  | SidebarItemCategoryJSON
  | {
      type: string;
      [key: string]: unknown;
    };

type SidebarCategoryShorthandJSON = {
  [sidebarCategory: string]: SidebarItemJSON[];
};

type SidebarJSON = SidebarCategoryShorthandJSON | SidebarItemJSON[];

// Sidebar given by user that is not normalized yet. e.g: sidebars.json
type SidebarsJSON = {
  [sidebarId: string]: SidebarJSON;
};

function isCategoryShorthand(
  item: SidebarItemJSON,
): item is SidebarCategoryShorthandJSON {
  return typeof item !== 'string' && !item.type;
}

// categories are collapsed by default, unless user set collapsed = false
const defaultCategoryCollapsedValue = true;

/**
 * Convert {category1: [item1,item2]} shorthand syntax to long-form syntax
 */
function normalizeCategoryShorthand(
  sidebar: SidebarCategoryShorthandJSON,
): SidebarItemCategoryJSON[] {
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
): asserts item is SidebarItemCategoryJSON {
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
function normalizeItem(item: SidebarItemJSON): SidebarItem[] {
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

function normalizeSidebar(sidebar: SidebarJSON) {
  const normalizedSidebar: SidebarItemJSON[] = Array.isArray(sidebar)
    ? sidebar
    : normalizeCategoryShorthand(sidebar);

  return flatMap(normalizedSidebar, normalizeItem);
}

function normalizeSidebars(sidebars: SidebarsJSON): Sidebars {
  return mapValues(sidebars, normalizeSidebar);
}

// TODO refactor: make async
export function loadSidebars(sidebarFilePath: string): Sidebars {
  if (!sidebarFilePath) {
    throw new Error(`sidebarFilePath not provided: ${sidebarFilePath}`);
  }
  if (!fs.existsSync(sidebarFilePath)) {
    throw new Error(`No sidebar file exist at path: ${sidebarFilePath}`);
  }
  // We don't want sidebars to be cached because of hot reloading.
  const sidebarJson = importFresh(sidebarFilePath) as SidebarsJSON;
  return normalizeSidebars(sidebarJson);
}

// traverse the sidebar tree in depth to find all doc items, in correct order
export function collectSidebarDocItems(sidebar: Sidebar): SidebarItemDoc[] {
  function collectRecursive(item: SidebarItem): SidebarItemDoc[] {
    if (item.type === 'doc') {
      return [item];
    }
    if (item.type === 'category') {
      return flatten(item.items.map(collectRecursive));
    }
    // Refs and links should not be shown in navigation.
    if (item.type === 'ref' || item.type === 'link') {
      return [];
    }
    throw new Error(`unknown sidebar item type = ${item.type}`);
  }

  return flatten(sidebar.map(collectRecursive));
}

export function collectSidebarsDocIds(
  sidebars: Sidebars,
): Record<string, string[]> {
  return mapValues(sidebars, (sidebar) => {
    return collectSidebarDocItems(sidebar).map((docItem) => docItem.id);
  });
}

export function createSidebarsUtils(sidebars: Sidebars) {
  const sidebarNameToDocIds = collectSidebarsDocIds(sidebars);

  function getFirstDocIdOfFirstSidebar(): string | undefined {
    return Object.values(sidebarNameToDocIds)[0]?.[0];
  }

  function getSidebarNameByDocId(docId: string): string | undefined {
    // TODO lookup speed can be optimized
    const entry = Object.entries(
      sidebarNameToDocIds,
    ).find(([_sidebarName, docIds]) => docIds.includes(docId));

    return entry?.[0];
  }

  function getDocNavigation(
    docId: string,
  ): {
    sidebarName: string | undefined;
    previousId: string | undefined;
    nextId: string | undefined;
  } {
    const sidebarName = getSidebarNameByDocId(docId);
    if (sidebarName) {
      const docIds = sidebarNameToDocIds[sidebarName];
      const currentIndex = docIds.indexOf(docId);
      const {previous, next} = getElementsAround(docIds, currentIndex);
      return {
        sidebarName,
        previousId: previous,
        nextId: next,
      };
    } else {
      return {
        sidebarName: undefined,
        previousId: undefined,
        nextId: undefined,
      };
    }
  }

  return {getFirstDocIdOfFirstSidebar, getSidebarNameByDocId, getDocNavigation};
}
