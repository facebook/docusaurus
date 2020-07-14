/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ReactNode, useContext, createContext} from 'react';
import {matchRoutes, RouteConfig} from 'react-router-config';
import resolvePathname from 'resolve-pathname';

type LinkCollector = {
  collectLink: (link: string) => void;
};

type StatefulLinkCollector = LinkCollector & {
  getCollectedLinks: () => string[];
};

export const createStatefulLinkCollector = (): StatefulLinkCollector => {
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

type ContextValue = {linkCollector: LinkCollector};

const Context = createContext<ContextValue>({
  linkCollector: {
    collectLink: () => {
      // noop by default for client
      // we only use the broken links checker server-side
    },
  },
});

export const useBrokenLinksChecker = () => {
  return useContext(Context);
};

export const ProvideLinkCollector = ({
  children,
  linkCollector,
}: {
  children: ReactNode;
  linkCollector: LinkCollector;
}) => {
  return (
    <Context.Provider value={{linkCollector}}>{children}</Context.Provider>
  );
};

export function getBrokenLinks(
  pagePath: string,
  links: string[],
  routes: RouteConfig[],
): string[] {
  // Remove the generic 404 page match
  const filteredRoutes = routes.filter((route) => route.path !== '*');

  // ReactRouter is able to support links like ./../somePath
  // but matchRoutes does not do this resolving internally
  // we must resolve the links before using matchRoutes
  // resolvePathname is used internally by ReactRouter
  function resolveLink(link: string) {
    return resolvePathname(link, pagePath);
  }

  function isBrokenLink(link: string) {
    const matchedRoutes = matchRoutes(filteredRoutes, link);
    return matchedRoutes.length === 0;
  }

  return links.map(resolveLink).filter(isBrokenLink);
}
