/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {createContext, ReactNode, useContext} from 'react';
import {useAllDocsData} from '@theme/hooks/useDocs';
import {
  PropSidebar,
  PropSidebarItem,
  PropSidebarItemCategory,
} from '@docusaurus/plugin-content-docs';
import type {PropCategoryGeneratedIndex} from '@docusaurus/plugin-content-docs';

// TODO not ideal, see also "useDocs"
export const isDocsPluginEnabled: boolean = !!useAllDocsData;

// Using a Symbol because null is a valid  context value (a doc can have no sidebar)
// Inspired by https://github.com/jamiebuilds/unstated-next/blob/master/src/unstated-next.tsx
const EmptyContextValue: unique symbol = Symbol('EmptyContext');

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
    throw new Error('This hook requires usage of <DocSidebarContextProvider>');
  }
  return sidebar;
}

// Use the components props and the sidebar in context
// to get back the related sidebar category that we want to render
export function useCategoryGeneratedIndexSidebarItem(
  categoryGeneratedIndex: PropCategoryGeneratedIndex,
): PropSidebarItemCategory {
  const sidebar = useDocsSidebar();
  if (!sidebar) {
    throw new Error(
      `unexpected: a category index should have a sidebar: ${JSON.stringify(
        categoryGeneratedIndex,
      )}`,
    );
  }

  // TODO more performant algo returning single element
  function collectCategoriesMatch(
    items: PropSidebarItem[],
  ): PropSidebarItemCategory[] {
    return items.flatMap((item) => {
      if (item.type === 'category') {
        if (item.href === categoryGeneratedIndex.permalink) {
          return [item];
        }
        return collectCategoriesMatch(item.items);
      }
      return [];
    });
  }

  const [sidebarCategory] = collectCategoriesMatch(sidebar);

  if (!sidebarCategory) {
    throw new Error(
      `Unexpected: sidebar category could not be found for categoryIndex=${JSON.stringify(
        categoryGeneratedIndex,
      )}`,
    );
  }

  return sidebarCategory;
}
