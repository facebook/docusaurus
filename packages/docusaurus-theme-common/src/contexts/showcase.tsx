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

const Context = React.createContext<{
  showcaseItems: ShowcaseItem[];
  tags: TagsOption;
} | null>(null);

function useContextValue(
  content: ShowcaseItem[],
  tags: TagsOption,
): {showcaseItems: ShowcaseItem[]; tags: TagsOption} {
  return useMemo(() => ({showcaseItems: content, tags}), [content, tags]);
}

export function ShowcaseProvider({
  children,
  content,
  tags,
}: {
  children: ReactNode;
  content: ShowcaseItem[];
  tags: TagsOption;
}): JSX.Element {
  const contextValue = useContextValue(content, tags);
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export function useShowcase(): {
  showcaseItems: ShowcaseItem[];
  tags: TagsOption;
} {
  const showcase = useContext(Context);
  if (showcase === null) {
    throw new ReactContextError('ShowcaseProvider');
  }
  return showcase;
}
