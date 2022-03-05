/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {createContext, type ReactNode, useContext} from 'react';
import {
  useActivePlugin,
  useAllDocsData,
} from '@docusaurus/plugin-content-docs/client';
import type {
  PropSidebar,
  PropSidebarItem,
  PropSidebarItemCategory,
  PropVersionDoc,
  PropVersionMetadata,
  PropSidebarBreadcrumbsItem,
} from '@docusaurus/plugin-content-docs';
import {isSamePath} from './pathUtils';
import {ReactContextError} from './reactUtils';
import {useLocation} from '@docusaurus/router';

// TODO not ideal, see also "useDocs"
export const isDocsPluginEnabled: boolean = !!useAllDocsData;

// Using a Symbol because null is a valid context value (a doc with no sidebar)
// Inspired by https://github.com/jamiebuilds/unstated-next/blob/master/src/unstated-next.tsx
const EmptyContextValue: unique symbol = Symbol('EmptyContext');

const DocsVersionContext = createContext<
  PropVersionMetadata | typeof EmptyContextValue
>(EmptyContextValue);

export function DocsVersionProvider({
  children,
  version,
}: {
  children: ReactNode;
  version: PropVersionMetadata | typeof EmptyContextValue;
}): JSX.Element {
  return (
    <DocsVersionContext.Provider value={version}>
      {children}
    </DocsVersionContext.Provider>
  );
}

export function useDocsVersion(): PropVersionMetadata {
  const version = useContext(DocsVersionContext);
  if (version === EmptyContextValue) {
    throw new ReactContextError('DocsVersionProvider');
  }
  return version;
}

export function useDocById(id: string): PropVersionDoc;
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

const DocsSidebarContext = createContext<
  PropSidebar | null | typeof EmptyContextValue
>(EmptyContextValue);

export function DocsSidebarProvider({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: PropSidebar | null;
}): JSX.Element {
  return (
    <DocsSidebarContext.Provider value={sidebar}>
      {children}
    </DocsSidebarContext.Provider>
  );
}

export function useDocsSidebar(): PropSidebar | null {
  const sidebar = useContext(DocsSidebarContext);
  if (sidebar === EmptyContextValue) {
    throw new ReactContextError('DocsSidebarProvider');
  }
  return sidebar;
}

// Use the components props and the sidebar in context
// to get back the related sidebar category that we want to render
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

// If a category card has no link => link to the first subItem having a link
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
      `Unexpected: sidebar category could not be found for pathname='${pathname}'.
Hook useCurrentSidebarCategory() should only be used on Category pages`,
    );
  }
  return category;
}

function containsActiveSidebarItem(
  items: PropSidebarItem[],
  activePath: string,
): boolean {
  return items.some((subItem) => isActiveSidebarItem(subItem, activePath));
}

export function isActiveSidebarItem(
  item: PropSidebarItem,
  activePath: string,
): boolean {
  const isActive = (testedPath: string | undefined) =>
    typeof testedPath !== 'undefined' && isSamePath(testedPath, activePath);

  if (item.type === 'link') {
    return isActive(item.href);
  }

  if (item.type === 'category') {
    return (
      isActive(item.href) || containsActiveSidebarItem(item.items, activePath)
    );
  }

  return false;
}

export function getBreadcrumbs({
  sidebar,
  pathname,
}: {
  sidebar: PropSidebar;
  pathname: string;
}): PropSidebarBreadcrumbsItem[] {
  const breadcrumbs: PropSidebarBreadcrumbsItem[] = [];

  function extract(items: PropSidebar) {
    for (const item of items) {
      if (
        item.type === 'category' &&
        (isSamePath(item.href, pathname) || extract(item.items))
      ) {
        breadcrumbs.push(item);
        return true;
      } else if (item.type === 'link' && isSamePath(item.href, pathname)) {
        breadcrumbs.push(item);
        return true;
      }
    }

    return false;
  }

  extract(sidebar);

  return breadcrumbs.reverse();
}

export function useSidebarBreadcrumbs(): PropSidebarBreadcrumbsItem[] | null {
  const sidebar = useDocsSidebar();
  const {pathname} = useLocation();
  const breadcrumbsOption = useActivePlugin()?.pluginData.breadcrumbs;

  if (breadcrumbsOption === false || !sidebar) {
    return null;
  }

  return getBreadcrumbs({sidebar, pathname});
}
