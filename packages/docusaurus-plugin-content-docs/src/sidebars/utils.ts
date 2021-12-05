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

import {mapValues, difference, uniq} from 'lodash';
import {getElementsAround, toMessageRelativeFilePath} from '@docusaurus/utils';
import {DocMetadataBase, DocNavLink} from '../types';
import {
  SidebarItemCategoryWithGeneratedIndex,
  SidebarItemCategoryWithLink,
  SidebarNavigationItem,
} from './types';

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

export function collectSidebarNavigation(
  sidebar: Sidebar,
): SidebarNavigationItem[] {
  return flattenSidebarItems(sidebar).flatMap((item) => {
    if (item.type === 'category' && item.link) {
      return [item as SidebarNavigationItem];
    }
    if (item.type === 'doc') {
      return [item];
    }
    return [];
  });
}

export function collectSidebarsDocIds(
  sidebars: Sidebars,
): Record<string, string[]> {
  return mapValues(sidebars, collectSidebarDocIds);
}

export function collectSidebarsNavigations(
  sidebars: Sidebars,
): Record<string, SidebarNavigationItem[]> {
  return mapValues(sidebars, collectSidebarNavigation);
}

export type SidebarNavigation = {
  sidebarName: string | undefined;
  previous: SidebarNavigationItem | undefined;
  next: SidebarNavigationItem | undefined;
};

// A convenient and performant way to query the sidebars content
export type SidebarsUtils = {
  sidebars: Sidebars;
  getFirstDocIdOfFirstSidebar: () => string | undefined;
  getSidebarNameByDocId: (docId: string) => string | undefined;
  getDocNavigation: (
    unversionedId: string,
    versionedId: string,
  ) => SidebarNavigation;
  getCategoryGeneratedIndexList: () => SidebarItemCategoryWithGeneratedIndex[];
  getCategoryGeneratedIndexNavigation: (
    categoryGeneratedIndexPermalink: string,
  ) => SidebarNavigation;

  checkSidebarsDocIds: (validDocIds: string[], sidebarFilePath: string) => void;
};

export function createSidebarsUtils(sidebars: Sidebars): SidebarsUtils {
  const sidebarNameToDocIds = collectSidebarsDocIds(sidebars);
  const sidebarNameToNavigationItems = collectSidebarsNavigations(sidebars);

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

  function emptySidebarNavigation(): SidebarNavigation {
    return {
      sidebarName: undefined,
      previous: undefined,
      next: undefined,
    };
  }

  function getDocNavigation(
    unversionedId: string,
    versionedId: string,
  ): SidebarNavigation {
    // TODO legacy id retro-compatibility!
    let docId = unversionedId;
    let sidebarName = getSidebarNameByDocId(docId);
    if (!sidebarName) {
      docId = versionedId;
      sidebarName = getSidebarNameByDocId(docId);
    }

    if (sidebarName) {
      const navigationItems = sidebarNameToNavigationItems[sidebarName];
      const currentItemIndex = navigationItems.findIndex((item) => {
        if (item.type === 'doc') {
          return item.id === docId;
        }
        if (item.type === 'category' && item.link.type === 'doc') {
          return item.link.id === docId;
        }
        return false;
      });

      const {previous, next} = getElementsAround(
        navigationItems,
        currentItemIndex,
      );
      return {sidebarName, previous, next};
    } else {
      return emptySidebarNavigation();
    }
  }

  function getCategoryGeneratedIndexList(): SidebarItemCategoryWithGeneratedIndex[] {
    return Object.values(sidebarNameToNavigationItems)
      .flat()
      .flatMap((item) => {
        if (item.type === 'category' && item.link.type === 'generated-index') {
          return [item as SidebarItemCategoryWithGeneratedIndex];
        }
        return [];
      });
  }

  // We identity the category generated index by its permalink (should be unique)
  // More reliable than using object identity
  function getCategoryGeneratedIndexNavigation(
    categoryGeneratedIndexPermalink: string,
  ): SidebarNavigation {
    function isCurrentCategoryGeneratedIndexItem(
      item: SidebarNavigationItem,
    ): boolean {
      return (
        item.type === 'category' &&
        item.link?.type === 'generated-index' &&
        item.link.permalink === categoryGeneratedIndexPermalink
      );
    }

    const sidebarName = Object.entries(sidebarNameToNavigationItems).find(
      ([, navigationItems]) =>
        navigationItems.find(isCurrentCategoryGeneratedIndexItem),
    )?.[0];

    if (sidebarName) {
      const navigationItems = sidebarNameToNavigationItems[sidebarName];
      const currentItemIndex = navigationItems.findIndex(
        isCurrentCategoryGeneratedIndexItem,
      );
      const {previous, next} = getElementsAround(
        navigationItems,
        currentItemIndex,
      );
      return {sidebarName, previous, next};
    } else {
      return emptySidebarNavigation();
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
- ${uniq(validDocIds).sort().join('\n- ')}`,
      );
    }
  }

  return {
    sidebars,
    getFirstDocIdOfFirstSidebar,
    getSidebarNameByDocId,
    getDocNavigation,
    getCategoryGeneratedIndexList,
    getCategoryGeneratedIndexNavigation,
    checkSidebarsDocIds,
  };
}

export function toDocNavigationLink(doc: DocMetadataBase): DocNavLink {
  const {
    title,
    permalink,
    frontMatter: {
      pagination_label: paginationLabel,
      sidebar_label: sidebarLabel,
    },
  } = doc;
  return {title: paginationLabel ?? sidebarLabel ?? title, permalink};
}

export function toNavigationLink(
  navigationItem: SidebarNavigationItem | undefined,
  docsById: Record<string, DocMetadataBase>,
): DocNavLink | undefined {
  function getDocById(docId: string) {
    const doc = docsById[docId];
    if (!doc) {
      throw new Error(
        `Can't create navigation link: no doc found with id=${docId}`,
      );
    }
    return doc;
  }

  function handleCategory(category: SidebarItemCategoryWithLink): DocNavLink {
    if (category.link.type === 'doc') {
      return toDocNavigationLink(getDocById(category.link.id));
    } else if (category.link.type === 'generated-index') {
      return {
        title: category.label,
        permalink: category.link.permalink,
      };
    } else {
      throw new Error('unexpected category link type');
    }
  }
  if (!navigationItem) {
    return undefined;
  }

  if (navigationItem.type === 'doc') {
    return toDocNavigationLink(getDocById(navigationItem.id));
  } else if (navigationItem.type === 'category') {
    return handleCategory(navigationItem);
  } else {
    throw new Error('unexpected navigation item');
  }
}
