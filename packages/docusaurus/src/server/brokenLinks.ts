/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {matchRoutes, RouteConfig as RRRouteConfig} from 'react-router-config';
import resolvePathname from 'resolve-pathname';
import chalk from 'chalk';
import {mapValues, pickBy} from 'lodash';
import {RouteConfig} from '@docusaurus/types';

function toReactRouterRoutes(routes: RouteConfig[]): RRRouteConfig[] {
  // @ts-expect-error: types incompatible???
  return routes as RRRouteConfig[];
}

export function getPageBrokenLinks({
  pagePath,
  pageLinks,
  routes,
}: {
  pagePath: string;
  pageLinks: string[];
  routes: RouteConfig[];
}): string[] {
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
    const matchedRoutes = matchRoutes(
      toReactRouterRoutes(filteredRoutes),
      link,
    );
    return matchedRoutes.length === 0;
  }

  return pageLinks.map(resolveLink).filter(isBrokenLink);
}

export function getAllBrokenLinks({
  allCollectedLinks,
  routes,
}: {
  allCollectedLinks: Record<string, string[]>;
  routes: RouteConfig[];
}): Record<string, string[]> {
  const allBrokenLinks = mapValues(allCollectedLinks, (pageLinks, pagePath) => {
    return getPageBrokenLinks({pageLinks, pagePath, routes});
  });

  // remove pages without any broken link
  return pickBy(allBrokenLinks, (brokenLinks) => brokenLinks.length > 0);
}

export function getBrokenLinksErrorMessage(
  allBrokenLinks: Record<string, string[]>,
): string | undefined {
  if (Object.keys(allBrokenLinks).length === 0) {
    return undefined;
  }

  function pageBrokenLinkMessage(
    pagePath: string,
    brokenLinks: string[],
  ): string {
    return `\n\n- Page path = ${pagePath}:\n  -> link to ${brokenLinks.join(
      '\n   -> link to ',
    )}`;
  }

  return (
    `Broken links found!` +
    `${Object.entries(allBrokenLinks).map(([pagePath, brokenLinks]) =>
      pageBrokenLinkMessage(pagePath, brokenLinks),
    )}
`
  );
}

export function handleBrokenLinks({
  allCollectedLinks,
  failOnBrokenLinks,
  routes,
}: {
  allCollectedLinks: Record<string, string[]>;
  failOnBrokenLinks: boolean;
  routes: RouteConfig[];
}) {
  const allBrokenLinks = getAllBrokenLinks({allCollectedLinks, routes});
  const errorMessage = getBrokenLinksErrorMessage(allBrokenLinks);
  if (errorMessage) {
    // Useful to ensure the CI fails in case of broken link
    if (failOnBrokenLinks) {
      throw new Error(errorMessage);
    } else {
      console.error(chalk.red(errorMessage));
    }
  }
}
