/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useMemo, type ReactNode, useContext} from 'react';
import {ReactContextError} from '../utils/reactUtils';
import type {ShowcaseItems} from '@docusaurus/plugin-content-showcase';

const Context = React.createContext<ShowcaseItems | null>(null);

function useContextValue(content: ShowcaseItems): ShowcaseItems {
  return useMemo(
    () => ({
      items: content.items,
    }),
    [content],
  );
}

export function ShowcaseProvider({
  children,
  content,
}: {
  children: ReactNode;
  content: ShowcaseItems;
}): JSX.Element {
  const contextValue = useContextValue(content);
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export function useShowcase(): ShowcaseItems {
  const showcase = useContext(Context);
  if (showcase === null) {
    throw new ReactContextError('ShowcaseProvider');
  }
  return showcase;
}
