/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  useAllDocsData,
  useActivePlugin,
} from '@docusaurus/plugin-content-docs/client';
import type {
  PropSidebar,
  PropSidebarItem,
  PropSidebarItemCategory,
  PropVersionDoc,
  PropSidebarBreadcrumbsItem,
} from '@docusaurus/plugin-content-docs';
import {useDocsVersion} from '../contexts/docsVersion';
import {useDocsSidebar} from '../contexts/docsSidebar';
import {isSamePath} from './routesUtils';
import {useLocation} from '@docusaurus/router';

// TODO not ideal, see also "useDocs"
export const isDocsPluginEnabled: boolean = !!useAllDocsData;

/**
 * A null-safe way to access a doc's data by ID in the active version.
 */
export function useDocById(id: string): PropVersionDoc;
/**
 * A null-safe way to access a doc's data by ID in the active version.
 */
export function useDocById(id: string | undefined): PropVersionDoc | undefined;
export function useDocById(id: string | undefined): PropVersionDoc | undefined {
  const version = useDocsVersion();
  if (!id) {
    return undefined;
  }
  const doc = version.docs[id];
  if (!doc) {
    throw new Error(`no version doc found by id=${id}`);
  }
  return doc;
}

/**
 * Pure function, similar to `Array#find`, but works on the sidebar tree.
 */
export function findSidebarCategory(
  sidebar: PropSidebar,
  predicate: (category: PropSidebarItemCategory) => boolean,
): PropSidebarItemCategory | undefined {
  for (const item of sidebar) {
    if (item.type === 'category') {
      if (predicate(item)) {
        return item;
      }
      const subItem = findSidebarCategory(item.items, predicate);
      if (subItem) {
        return subItem;
      }
    }
  }
  return undefined;
}

/**
 * Best effort to assign a link to a sidebar category. If the category doesn't
 * have a link itself, we link to the first sub item with a link.
 */
export function findFirstCategoryLink(
  item: PropSidebarItemCategory,
): string | undefined {
  if (item.href) {
    return item.href;
  }

  for (const subItem of item.items) {
    if (subItem.type === 'link') {
      return subItem.href;
    } else if (subItem.type === 'category') {
      const categoryLink = findFirstCategoryLink(subItem);
      if (categoryLink) {
        return categoryLink;
      }
    } else if (subItem.type === 'html') {
      // skip
    } else {
      throw new Error(
        `Unexpected category item type for ${JSON.stringify(subItem)}`,
      );
    }
  }
  return undefined;
}

/**
 * Gets the category associated with the current location. Should only be used
 * on category index pages.
 */
export function useCurrentSidebarCategory(): PropSidebarItemCategory {
  const {pathname} = useLocation();
  const sidebar = useDocsSidebar();
  if (!sidebar) {
    throw new Error('Unexpected: cant find current sidebar in context');
  }
  const category = findSidebarCategory(sidebar, (item) =>
    isSamePath(item.href, pathname),
  );
  if (!category) {
    throw new Error(
      `${pathname} is not associated with a category. useCurrentSidebarCategory() should only be used on category index pages.`,
    );
  }
  return category;
}

const isActive = (testedPath: string | undefined, activePath: string) =>
  typeof testedPath !== 'undefined' && isSamePath(testedPath, activePath);
const containsActiveSidebarItem = (
  items: PropSidebarItem[],
  activePath: string,
) => items.some((subItem) => isActiveSidebarItem(subItem, activePath));

/**
 * Checks if a sidebar item should be active, based on the active path.
 */
export function isActiveSidebarItem(
  item: PropSidebarItem,
  activePath: string,
): boolean {
  if (item.type === 'link') {
    return isActive(item.href, activePath);
  }

  if (item.type === 'category') {
    return (
      isActive(item.href, activePath) ||
      containsActiveSidebarItem(item.items, activePath)
    );
  }

  return false;
}

/**
 * Gets the breadcrumbs of the current doc page, based on its sidebar location.
 * Returns `null` if there's no sidebar or breadcrumbs are disabled.
 */
export function useSidebarBreadcrumbs(): PropSidebarBreadcrumbsItem[] | null {
  const sidebar = useDocsSidebar();
  const {pathname} = useLocation();
  const breadcrumbsOption = useActivePlugin()?.pluginData.breadcrumbs;

  if (breadcrumbsOption === false || !sidebar) {
    return null;
  }

  const breadcrumbs: PropSidebarBreadcrumbsItem[] = [];

  function extract(items: PropSidebar) {
    for (const item of items) {
      if (
        (item.type === 'category' &&
          (isSamePath(item.href, pathname) || extract(item.items))) ||
        (item.type === 'link' && isSamePath(item.href, pathname))
      ) {
        breadcrumbs.push(item);
        return true;
      }
    }

    return false;
  }

  extract(sidebar);

  return breadcrumbs.reverse();
}
