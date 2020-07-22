/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {matchRoutes, RouteConfig as RRRouteConfig} from 'react-router-config';
import resolvePathname from 'resolve-pathname';
import chalk from 'chalk';
import {mapValues, pickBy, flatMap} from 'lodash';
import {RouteConfig, OnBrokenLinks} from '@docusaurus/types';

function toReactRouterRoutes(routes: RouteConfig[]): RRRouteConfig[] {
  // @ts-expect-error: types incompatible???
  return routes as RRRouteConfig[];
}

type BrokenLink = {
  link: string;
  resolvedLink: string;
};

// matchRoutes does not support qs/anchors, so we remove it!
function onlyPathname(link: string) {
  return link.split('#')[0].split('?')[0];
}

function getPageBrokenLinks({
  pagePath,
  pageLinks,
  routes,
}: {
  pagePath: string;
  pageLinks: string[];
  routes: RouteConfig[];
}): BrokenLink[] {
  // ReactRouter is able to support links like ./../somePath
  // but matchRoutes does not do this resolving internally
  // we must resolve the links before using matchRoutes
  // resolvePathname is used internally by ReactRouter
  function resolveLink(link: string) {
    const resolvedLink = resolvePathname(onlyPathname(link), pagePath);
    return {link, resolvedLink};
  }

  function isBrokenLink(link: string) {
    const matchedRoutes = matchRoutes(toReactRouterRoutes(routes), link);
    return matchedRoutes.length === 0;
  }

  return pageLinks.map(resolveLink).filter((l) => isBrokenLink(l.resolvedLink));
}

// The route defs can be recursive, and have a parent match-all route
// We don't want to match broken links like /docs/brokenLink against /docs/*
// For this reason, we only consider the "final routes", that do not have subroutes
// We also need to remove the match all 404 route
function filterIntermediateRoutes(routesInput: RouteConfig[]): RouteConfig[] {
  function getFinalRoutes(route: RouteConfig): RouteConfig[] {
    return route.routes ? flatMap(route.routes, getFinalRoutes) : [route];
  }

  const routesWithout404 = routesInput.filter((route) => route.path !== '*');
  return flatMap(routesWithout404, getFinalRoutes);
}

export function getAllBrokenLinks({
  allCollectedLinks,
  routes,
}: {
  allCollectedLinks: Record<string, string[]>;
  routes: RouteConfig[];
}): Record<string, BrokenLink[]> {
  const filteredRoutes = filterIntermediateRoutes(routes);

  const allBrokenLinks = mapValues(allCollectedLinks, (pageLinks, pagePath) => {
    return getPageBrokenLinks({pageLinks, pagePath, routes: filteredRoutes});
  });

  // remove pages without any broken link
  return pickBy(allBrokenLinks, (brokenLinks) => brokenLinks.length > 0);
}

export function getBrokenLinksErrorMessage(
  allBrokenLinks: Record<string, BrokenLink[]>,
): string | undefined {
  if (Object.keys(allBrokenLinks).length === 0) {
    return undefined;
  }

  function brokenLinkMessage(brokenLink: BrokenLink): string {
    const showResolvedLink = brokenLink.link !== brokenLink.resolvedLink;
    return `${brokenLink.link}${
      showResolvedLink ? ` (resolved as: ${brokenLink.resolvedLink})` : ''
    }`;
  }

  function pageBrokenLinksMessage(
    pagePath: string,
    brokenLinks: BrokenLink[],
  ): string {
    return `\n\n- Page path = ${pagePath}:\n   -> link to ${brokenLinks
      .map(brokenLinkMessage)
      .join('\n   -> link to ')}`;
  }

  return (
    `Broken links found!` +
    `${Object.entries(allBrokenLinks).map(([pagePath, brokenLinks]) =>
      pageBrokenLinksMessage(pagePath, brokenLinks),
    )}
`
  );
}

export function handleBrokenLinks({
  allCollectedLinks,
  onBrokenLinks,
  routes,
}: {
  allCollectedLinks: Record<string, string[]>;
  onBrokenLinks: OnBrokenLinks;
  routes: RouteConfig[];
}) {
  if (onBrokenLinks === 'ignore') {
    return;
  }
  const allBrokenLinks = getAllBrokenLinks({allCollectedLinks, routes});
  const errorMessage = getBrokenLinksErrorMessage(allBrokenLinks);
  if (errorMessage) {
    // Useful to ensure the CI fails in case of broken link
    if (onBrokenLinks === 'throw') {
      throw new Error(
        `${errorMessage}\nNote: it's possible to ignore broken links with the 'onBrokenLinks' Docusaurus configuration.`,
      );
    } else if (onBrokenLinks === 'error') {
      console.error(chalk.red(errorMessage));
    } else if (onBrokenLinks === 'log') {
      console.log(chalk.blue(errorMessage));
    } else {
      throw new Error(`unexpected onBrokenLinks value=${onBrokenLinks}`);
    }
  }
}
