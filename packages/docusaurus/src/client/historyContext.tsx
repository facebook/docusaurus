/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {createContext, useContext, type ReactNode} from 'react';
import type {History} from 'history';

const Context = createContext<History | null>(null);

export function HistoryProvider({
  children,
  history,
}: {
  children: ReactNode;
  history: History;
}): ReactNode {
  return <Context.Provider value={history}>{children}</Context.Provider>;
}

export function useHistory(): History {
  const history = useContext(Context);
  if (!history) {
    throw new Error('Unexpected: no Docusaurus history context found');
  }
  return history;
}
