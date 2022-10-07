/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {toMessageRelativeFilePath} from '@docusaurus/utils';
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
  SidebarItemCategoryWithGeneratedIndex,
  SidebarNavigationItem,
} from './types';
import type {
  DocMetadataBase,
  PropNavigationLink,
} from '@docusaurus/plugin-content-docs';

export function isCategoriesShorthand(
  item: SidebarItemConfig,
): item is SidebarCategoriesShorthand {
  return typeof item === 'object' && !item.type;
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

/**
 * Flatten sidebar items into a single flat array (containing categories/docs on
 * the same level). Order matters (useful for next/prev nav), top categories
 * appear before their child elements
 */
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
export function collectSidebarRefs(sidebar: Sidebar): SidebarItemDoc[] {
  return collectSidebarItemsOfType('ref', sidebar);
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

export function collectSidebarsDocIds(sidebars: Sidebars): {
  [sidebarId: string]: string[];
} {
  return _.mapValues(sidebars, collectSidebarDocIds);
}

export function collectSidebarsNavigations(sidebars: Sidebars): {
  [sidebarId: string]: SidebarNavigationItem[];
} {
  return _.mapValues(sidebars, collectSidebarNavigation);
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
    displayedSidebar: string | null | undefined,
  ) => SidebarNavigation;
  getCategoryGeneratedIndexList: () => SidebarItemCategoryWithGeneratedIndex[];
  getCategoryGeneratedIndexNavigation: (
    categoryGeneratedIndexPermalink: string,
  ) => SidebarNavigation;
  /**
   * This function may return undefined. This is usually a user mistake, because
   * it means this sidebar will never be displayed; however, we can still use
   * `displayed_sidebar` to make it displayed. Pretty weird but valid use-case
   */
  getFirstLink: (sidebarId: string) =>
    | {
        type: 'doc';
        id: string;
        label: string;
      }
    | {
        type: 'generated-index';
        permalink: string;
        label: string;
      }
    | undefined;

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
    displayedSidebar: string | null | undefined,
  ): SidebarNavigation {
    // TODO legacy id retro-compatibility!
    let docId = unversionedId;
    let sidebarName =
      displayedSidebar === undefined
        ? getSidebarNameByDocId(docId)
        : displayedSidebar;
    if (sidebarName === undefined) {
      docId = versionedId;
      sidebarName = getSidebarNameByDocId(docId);
    }

    if (!sidebarName) {
      return emptySidebarNavigation();
    }
    const navigationItems = sidebarNameToNavigationItems[sidebarName];
    if (!navigationItems) {
      throw new Error(
        `Doc with ID ${docId} wants to display sidebar ${sidebarName} but a sidebar with this name doesn't exist`,
      );
    }
    const currentItemIndex = navigationItems.findIndex((item) => {
      if (item.type === 'doc') {
        return item.id === docId;
      }
      if (item.type === 'category' && item.link.type === 'doc') {
        return item.link.id === docId;
      }
      return false;
    });
    if (currentItemIndex === -1) {
      return {sidebarName, next: undefined, previous: undefined};
    }

    return {
      sidebarName,
      previous: navigationItems[currentItemIndex - 1],
      next: navigationItems[currentItemIndex + 1],
    };
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

  /**
   * We identity the category generated index by its permalink (should be
   * unique). More reliable than using object identity
   */
  function getCategoryGeneratedIndexNavigation(
    categoryGeneratedIndexPermalink: string,
  ): SidebarNavigation {
    function isCurrentCategoryGeneratedIndexItem(
      item: SidebarNavigationItem,
    ): boolean {
      return (
        item.type === 'category' &&
        item.link.type === 'generated-index' &&
        item.link.permalink === categoryGeneratedIndexPermalink
      );
    }

    const sidebarName = Object.entries(sidebarNameToNavigationItems).find(
      ([, navigationItems]) =>
        navigationItems.find(isCurrentCategoryGeneratedIndexItem),
    )![0];
    const navigationItems = sidebarNameToNavigationItems[sidebarName]!;
    const currentItemIndex = navigationItems.findIndex(
      isCurrentCategoryGeneratedIndexItem,
    );
    return {
      sidebarName,
      previous: navigationItems[currentItemIndex - 1],
      next: navigationItems[currentItemIndex + 1],
    };
  }

  function checkSidebarsDocIds(validDocIds: string[], sidebarFilePath: string) {
    const allSidebarDocIds = Object.values(sidebarNameToDocIds).flat();
    const invalidSidebarDocIds = _.difference(allSidebarDocIds, validDocIds);
    if (invalidSidebarDocIds.length > 0) {
      throw new Error(
        `Invalid sidebar file at "${toMessageRelativeFilePath(
          sidebarFilePath,
        )}".
These sidebar document ids do not exist:
- ${invalidSidebarDocIds.sort().join('\n- ')}

Available document ids are:
- ${_.uniq(validDocIds).sort().join('\n- ')}`,
      );
    }
  }

  function getFirstLink(sidebar: Sidebar):
    | {
        type: 'doc';
        id: string;
        label: string;
      }
    | {
        type: 'generated-index';
        permalink: string;
        label: string;
      }
    | undefined {
    for (const item of sidebar) {
      if (item.type === 'doc') {
        return {
          type: 'doc',
          id: item.id,
          label: item.label ?? item.id,
        };
      } else if (item.type === 'category') {
        if (item.link?.type === 'doc') {
          return {
            type: 'doc',
            id: item.link.id,
            label: item.label,
          };
        } else if (item.link?.type === 'generated-index') {
          return {
            type: 'generated-index',
            permalink: item.link.permalink,
            label: item.label,
          };
        }
        const firstSubItem = getFirstLink(item.items);
        if (firstSubItem) {
          return firstSubItem;
        }
      }
    }
    return undefined;
  }

  return {
    sidebars,
    getFirstDocIdOfFirstSidebar,
    getSidebarNameByDocId,
    getDocNavigation,
    getCategoryGeneratedIndexList,
    getCategoryGeneratedIndexNavigation,
    checkSidebarsDocIds,
    getFirstLink: (id) => getFirstLink(sidebars[id]!),
  };
}

export function toDocNavigationLink(doc: DocMetadataBase): PropNavigationLink {
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
  docsById: {[docId: string]: DocMetadataBase},
): PropNavigationLink | undefined {
  function getDocById(docId: string) {
    const doc = docsById[docId];
    if (!doc) {
      throw new Error(
        `Can't create navigation link: no doc found with id=${docId}`,
      );
    }
    return doc;
  }

  if (!navigationItem) {
    return undefined;
  }

  if (navigationItem.type === 'category') {
    return navigationItem.link.type === 'doc'
      ? toDocNavigationLink(getDocById(navigationItem.link.id))
      : {
          title: navigationItem.label,
          permalink: navigationItem.link.permalink,
        };
  }
  return toDocNavigationLink(getDocById(navigationItem.id));
}
