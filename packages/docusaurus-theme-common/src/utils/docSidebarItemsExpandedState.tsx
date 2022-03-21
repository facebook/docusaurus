/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, useMemo, useState, useContext} from 'react';
import {ReactContextError} from './reactUtils';

const EmptyContext: unique symbol = Symbol('EmptyContext');
const Context = React.createContext<
  DocSidebarItemsExpandedState | typeof EmptyContext
>(EmptyContext);
type DocSidebarItemsExpandedState = {
  expandedItem: number | null;
  setExpandedItem: (a: number | null) => void;
};

export function DocSidebarItemsExpandedStateProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const contextValue = useMemo(
    () => ({expandedItem, setExpandedItem}),
    [expandedItem],
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export function useDocSidebarItemsExpandedState(): DocSidebarItemsExpandedState {
  const contextValue = useContext(Context);
  if (contextValue === EmptyContext) {
    throw new ReactContextError('DocSidebarItemsExpandedStateProvider');
  }
  return contextValue;
}
