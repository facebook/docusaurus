/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  Sidebars,
  Sidebar,
  SidebarItem,
  SidebarItemCategory,
  SidebarItemLink,
  SidebarItemDoc,
  SidebarItemType,
  SidebarCategoriesShorthand,
  SidebarItemConfig,
} from './types';
import {mapValues, difference} from 'lodash';
import {getElementsAround, toMessageRelativeFilePath} from '@docusaurus/utils';

export function isCategoriesShorthand(
  item: SidebarItemConfig,
): item is SidebarCategoriesShorthand {
  return typeof item !== 'string' && !item.type;
}

export function transformSidebarItems(
  sidebar: Sidebar,
  updateFn: (item: SidebarItem) => SidebarItem,
): Sidebar {
  function transformRecursive(item: SidebarItem): SidebarItem {
    if (item.type === 'category') {
      return updateFn({
        ...item,
        items: item.items.map(transformRecursive),
      });
    }
    return updateFn(item);
  }
  return sidebar.map(transformRecursive);
}

// Flatten sidebar items into a single flat array (containing categories/docs on the same level)
// /!\ order matters (useful for next/prev nav), top categories appear before their child elements
function flattenSidebarItems(items: SidebarItem[]): SidebarItem[] {
  function flattenRecursive(item: SidebarItem): SidebarItem[] {
    return item.type === 'category'
      ? [item, ...item.items.flatMap(flattenRecursive)]
      : [item];
  }
  return items.flatMap(flattenRecursive);
}

function collectSidebarItemsOfType<
  Type extends SidebarItemType,
  Item extends SidebarItem & {type: SidebarItemType},
>(type: Type, sidebar: Sidebar): Item[] {
  return flattenSidebarItems(sidebar).filter(
    (item) => item.type === type,
  ) as Item[];
}

export function collectSidebarDocItems(sidebar: Sidebar): SidebarItemDoc[] {
  return collectSidebarItemsOfType('doc', sidebar);
}
export function collectSidebarCategories(
  sidebar: Sidebar,
): SidebarItemCategory[] {
  return collectSidebarItemsOfType('category', sidebar);
}
export function collectSidebarLinks(sidebar: Sidebar): SidebarItemLink[] {
  return collectSidebarItemsOfType('link', sidebar);
}

// /!\ docId order matters for navigation!
export function collectSidebarDocIds(sidebar: Sidebar): string[] {
  return flattenSidebarItems(sidebar).flatMap((item) => {
    if (item.type === 'category') {
      return item.link?.type === 'doc' ? [item.link.id] : [];
    }
    if (item.type === 'doc') {
      return [item.id];
    }
    return [];
  });
}

export function collectSidebarsDocIds(
  sidebars: Sidebars,
): Record<string, string[]> {
  return mapValues(sidebars, collectSidebarDocIds);
}

export function createSidebarsUtils(sidebars: Sidebars): {
  getFirstDocIdOfFirstSidebar: () => string | undefined;
  getSidebarNameByDocId: (docId: string) => string | undefined;
  getDocNavigation: (docId: string) => {
    sidebarName: string | undefined;
    previousId: string | undefined;
    nextId: string | undefined;
  };
  checkSidebarsDocIds: (validDocIds: string[], sidebarFilePath: string) => void;
} {
  const sidebarNameToDocIds = collectSidebarsDocIds(sidebars);
  // Reverse mapping
  const docIdToSidebarName = Object.fromEntries(
    Object.entries(sidebarNameToDocIds).flatMap(([sidebarName, docIds]) =>
      docIds.map((docId) => [docId, sidebarName]),
    ),
  );

  function getFirstDocIdOfFirstSidebar(): string | undefined {
    return Object.values(sidebarNameToDocIds)[0]?.[0];
  }

  function getSidebarNameByDocId(docId: string): string | undefined {
    return docIdToSidebarName[docId];
  }

  function getDocNavigation(docId: string): {
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

  function checkSidebarsDocIds(validDocIds: string[], sidebarFilePath: string) {
    const allSidebarDocIds = Object.values(sidebarNameToDocIds).flat();
    const invalidSidebarDocIds = difference(allSidebarDocIds, validDocIds);
    if (invalidSidebarDocIds.length > 0) {
      throw new Error(
        `Invalid sidebar file at "${toMessageRelativeFilePath(
          sidebarFilePath,
        )}".
These sidebar document ids do not exist:
- ${invalidSidebarDocIds.sort().join('\n- ')}

Available document ids are:
- ${validDocIds.sort().join('\n- ')}`,
      );
    }
  }

  return {
    getFirstDocIdOfFirstSidebar,
    getSidebarNameByDocId,
    getDocNavigation,
    checkSidebarsDocIds,
  };
}
