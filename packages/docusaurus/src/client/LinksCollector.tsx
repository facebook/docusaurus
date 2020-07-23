/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ReactNode, useContext, createContext} from 'react';

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
    getCollectedLinks: (): string[] => {
      return [...allLinks];
    },
  };
};

const Context = createContext<LinksCollector>({
  collectLink: () => {
    // noop by default for client
    // we only use the broken links checker server-side
  },
});

export const useLinksCollector = () => {
  return useContext(Context);
};

export const ProvideLinksCollector = ({
  children,
  linksCollector,
}: {
  children: ReactNode;
  linksCollector: LinksCollector;
}) => {
  return <Context.Provider value={linksCollector}>{children}</Context.Provider>;
};
