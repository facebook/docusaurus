/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {createContext, useMemo, type ReactNode} from 'react';
import type {
  ShowcaseItem,
  TagsOption,
  ShowcaseContextType,
} from '@docusaurus/plugin-content-showcase';

const ShowcaseContext = createContext<ShowcaseContextType | null>(null);

export function ShowcaseProvider({
  items,
  tags,
  screenshotApi,
  children,
}: {
  items: ShowcaseItem[];
  tags: TagsOption;
  screenshotApi: string;
  children: ReactNode;
}): JSX.Element {
  const contextValue = useMemo(
    () => ({items, tags, screenshotApi}),
    [items, tags, screenshotApi],
  );

  return (
    <ShowcaseContext.Provider value={contextValue}>
      {children}
    </ShowcaseContext.Provider>
  );
}
