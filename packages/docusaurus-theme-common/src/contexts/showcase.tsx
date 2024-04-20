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

// duplicated from theme classic showcase
type Props = {
  items: ShowcaseItem[];
  tags: TagsOption;
  screenshotApi: string;
  children: ReactNode;
};

const ItemsContext = React.createContext<ShowcaseItem[] | null>(null);
const ApiContext = React.createContext<string | null>(null);
const TagsContext = React.createContext<TagsOption | null>(null);

function useItemsContextValue(content: ShowcaseItem[]): ShowcaseItem[] {
  return useMemo(() => content, [content]);
}

function useApiScreenshotContextValue(content: string): string {
  return useMemo(() => content, [content]);
}

function useTagsContextValue(tags: TagsOption): TagsOption {
  return useMemo(() => tags, [tags]);
}

function ItemsProvider({
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

function ApiScreenshotProvider({
  children,
  api,
}: {
  children: ReactNode;
  api: string;
}): JSX.Element {
  const contextValue = useApiScreenshotContextValue(api);
  return (
    <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
  );
}

function TagsProvider({
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

export function ShowcaseProvider({
  items,
  tags,
  screenshotApi,
  children,
}: Props): JSX.Element {
  return (
    <ItemsProvider items={items}>
      <TagsProvider tags={tags}>
        <ApiScreenshotProvider api={screenshotApi}>
          {children}
        </ApiScreenshotProvider>
      </TagsProvider>
    </ItemsProvider>
  );
}

export function useShowcaseItems(): ShowcaseItem[] {
  const showcaseItems = useContext(ItemsContext);
  if (showcaseItems === null) {
    throw new ReactContextError('ItemsProvider');
  }
  return showcaseItems;
}

export function useShowcaseApiScreenshot(): string {
  const showcaseItems = useContext(ApiContext);
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
