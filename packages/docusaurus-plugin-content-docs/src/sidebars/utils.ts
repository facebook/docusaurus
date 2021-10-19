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
} from './types';
import {mapValues, difference} from 'lodash';
import {getElementsAround, toMessageRelativeFilePath} from '@docusaurus/utils';

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

function collectSidebarItemsOfType<
  Type extends SidebarItemType,
  Item extends SidebarItem & {type: SidebarItemType},
>(type: Type, sidebar: Sidebar): Item[] {
  function collectRecursive(item: SidebarItem): Item[] {
    const currentItemsCollected: Item[] =
      item.type === type ? [item as Item] : [];

    const childItemsCollected: Item[] =
      item.type === 'category' ? item.items.flatMap(collectRecursive) : [];

    return [...currentItemsCollected, ...childItemsCollected];
  }

  return sidebar.flatMap(collectRecursive);
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

export function collectSidebarsDocIds(
  sidebars: Sidebars,
): Record<string, string[]> {
  return mapValues(sidebars, (sidebar) => {
    return collectSidebarDocItems(sidebar).map((docItem) => docItem.id);
  });
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
