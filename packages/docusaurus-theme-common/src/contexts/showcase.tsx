/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useMemo, type ReactNode, useContext} from 'react';
import {ReactContextError} from '../utils/reactUtils';
import type {
  ShowcaseItem,
  TagsOption,
} from '@docusaurus/plugin-content-showcase';

const ItemsContext = React.createContext<ShowcaseItem[] | null>(null);
const TagsContext = React.createContext<TagsOption | null>(null);

function useItemsContextValue(content: ShowcaseItem[]): ShowcaseItem[] {
  return useMemo(() => content, [content]);
}

function useTagsContextValue(tags: TagsOption): TagsOption {
  return useMemo(() => tags, [tags]);
}

export function ItemsProvider({
  children,
  items,
}: {
  children: ReactNode;
  items: ShowcaseItem[];
}): JSX.Element {
  const contextValue = useItemsContextValue(items);
  return (
    <ItemsContext.Provider value={contextValue}>
      {children}
    </ItemsContext.Provider>
  );
}

export function TagsProvider({
  children,
  tags,
}: {
  children: ReactNode;
  tags: TagsOption;
}): JSX.Element {
  const contextValue = useTagsContextValue(tags);
  return (
    <TagsContext.Provider value={contextValue}>{children}</TagsContext.Provider>
  );
}

export function useShowcaseItems(): ShowcaseItem[] {
  const showcaseItems = useContext(ItemsContext);
  if (showcaseItems === null) {
    throw new ReactContextError('ItemsProvider');
  }
  return showcaseItems;
}

export function useShowcaseTags(): TagsOption {
  const tags = useContext(TagsContext);
  if (tags === null) {
    throw new ReactContextError('TagsProvider');
  }
  return tags;
}
