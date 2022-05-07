/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, useContext} from 'react';

type LinksCollector = {
  collectLink: (link: string) => void;
};

type StatefulLinksCollector = LinksCollector & {
  getCollectedLinks: () => string[];
};

export const createStatefulLinksCollector = (): StatefulLinksCollector => {
  // Set to dedup, as it's not useful to collect multiple times the same link
  const allLinks = new Set<string>();
  return {
    collectLink: (link: string): void => {
      allLinks.add(link);
    },
    getCollectedLinks: (): string[] => [...allLinks],
  };
};

const Context = React.createContext<LinksCollector>({
  collectLink: () => {
    // No-op for client. We only use the broken links checker server-side.
  },
});

export const useLinksCollector = (): LinksCollector => useContext(Context);

export function LinksCollectorProvider({
  children,
  linksCollector,
}: {
  children: ReactNode;
  linksCollector: LinksCollector;
}): JSX.Element {
  return <Context.Provider value={linksCollector}>{children}</Context.Provider>;
}
