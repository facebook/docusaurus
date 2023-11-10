/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, useContext} from 'react';
import type {AnchorsCollector} from '@docusaurus/useAnchor';

type StatefulAnchorsCollector = AnchorsCollector & {
  getCollectedAnchors: () => string[];
};

export const createStatefulAnchorsCollector = (): StatefulAnchorsCollector => {
  // Set to dedup, as it's not useful to collect multiple times the same link
  const allAnchors = new Set<string>();
  return {
    collectAnchor: (link: string): void => {
      allAnchors.add(link);
    },
    getCollectedAnchors: (): string[] => [...allAnchors],
  };
};

const Context = React.createContext<AnchorsCollector>({
  collectAnchor: () => {
    // No-op for client. We only use the broken links checker server-side.
  },
});

export const useAnchorsCollector = (): AnchorsCollector => useContext(Context);

export function AnchorsCollectorProvider({
  children,
  anchorsCollector,
}: {
  children: ReactNode;
  anchorsCollector: AnchorsCollector;
}): JSX.Element {
  return (
    <Context.Provider value={anchorsCollector}>{children}</Context.Provider>
  );
}
