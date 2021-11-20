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
import type {DocMetadataBase} from '../types';

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
  return mapValues(sidebars, (sidebar) =>
    collectSidebarDocItems(sidebar).map((docItem) => docItem.id),
  );
}

export function createSidebarsUtils(
  sidebars: Sidebars,
  docsById: Record<string, DocMetadataBase>,
): {
  getFirstDocIdOfFirstSidebar: () => string | undefined;
  getSidebarNameByDocId: (docId: string) => string | null | undefined;
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

  function getSidebarNameByDocId(docId: string): string | null | undefined {
    const {
      frontMatter: {
        displayed_sidebar: displayedSidebar = docIdToSidebarName[docId],
      },
    } = docsById[docId];
    return displayedSidebar;
  }

  function getDocNavigation(docId: string): {
    sidebarName: string | undefined;
    previousId: string | undefined;
    nextId: string | undefined;
  } {
    const sidebarName = getSidebarNameByDocId(docId);
    if (!sidebarName) {
      return {
        sidebarName: undefined,
        previousId: undefined,
        nextId: undefined,
      };
    }
    if (!Object.keys(sidebars).includes(sidebarName)) {
      throw new Error(
        `Doc with ID ${docId} wants to display sidebar ${sidebarName} but a sidebar with this name doesn't exist`,
      );
    }
    const docIds = sidebarNameToDocIds[sidebarName];
    const currentIndex = docIds.indexOf(docId);
    if (currentIndex === -1) {
      return {
        sidebarName,
        previousId: undefined,
        nextId: undefined,
      };
    }
    const {previous, next} = getElementsAround(docIds, currentIndex);
    return {
      sidebarName,
      previousId: previous,
      nextId: next,
    };
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
