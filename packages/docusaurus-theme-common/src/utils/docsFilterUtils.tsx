/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, useMemo, useState, useContext} from 'react';
import {ReactContextError} from './reactUtils';
import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';

type DocsFilterContextValue = {
  filterTerm: string | undefined;
  setFilterTerm: (value: string) => void;
};

const DocsFilterContext = React.createContext<
  DocsFilterContextValue | undefined
>(undefined);

function useDocsFilterContextValue(): DocsFilterContextValue {
  const [filterTerm, setFilterTerm] = useState<string | undefined>(undefined);

  return useMemo(() => ({filterTerm, setFilterTerm}), [filterTerm]);
}

export function DocsFilterProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const contextValue = useDocsFilterContextValue();
  return (
    <DocsFilterContext.Provider value={contextValue}>
      {children}
    </DocsFilterContext.Provider>
  );
}

export function useDocsFilter(): DocsFilterContextValue {
  const context = useContext<DocsFilterContextValue | undefined>(
    DocsFilterContext,
  );
  if (context == null) {
    throw new ReactContextError('DocsFilterProvider');
  }
  return context;
}

export function filterDocsSidebar(
  sidebar: PropSidebarItem[],
  filterTerm: string | undefined,
): PropSidebarItem[] {
  if (!filterTerm) {
    return sidebar;
  }

  return sidebar.reduce((acc, item) => {
    if (!('label' in item)) {
      return acc;
    }

    const isLabelMatch = new RegExp(filterTerm, 'i').test(item.label);

    if (item.type !== 'category') {
      return isLabelMatch ? acc.concat(item) : acc;
    }

    const filteredItems = filterDocsSidebar(item.items, filterTerm);
    const isCategoryMatch = isLabelMatch || filteredItems.length > 0;
    const filteredItem = {
      ...item,
      items: filteredItems, // or it's to worth showing items even they do not meet the filter criteria?
      collapsed: !isCategoryMatch, // todo: fix bug with auto collapse category feature
      collapsible: filteredItems.length > 0, // or disable it at all?
    };

    return isCategoryMatch ? acc.concat(filteredItem) : acc;
  }, [] as PropSidebarItem[]);
}
