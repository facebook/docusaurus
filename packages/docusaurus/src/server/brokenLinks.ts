/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import logger from '@docusaurus/logger';
import {matchRoutes} from 'react-router-config';
import {resolvePathname} from '@docusaurus/utils';
import {getAllFinalRoutes} from './utils';
import type {RouteConfig, ReportingSeverity} from '@docusaurus/types';

type BrokenLink = {
  link: string;
  resolvedLink: string;
  anchor: boolean;
};

type BrokenLinksByLocation = {[location: string]: BrokenLink[]};

type CollectedLinks = {
  [location: string]: {links: string[]; anchors: string[]};
};

// matchRoutes does not support qs/anchors, so we remove it!
function onlyPathname(link: string) {
  return link.split('#')[0]!.split('?')[0]!;
}

function parseLocalPath(localUrl: string, base?: string | URL): URL {
  try {
    return new URL(localUrl, base ?? 'https://example.com');
  } catch (e) {
    throw new Error(`Can't parse local path: ${localUrl}`);
  }
}

function parseLink(link: string, from: string): URL {
  const base = parseLocalPath(from);
  return parseLocalPath(link, base);
}

function getRouteAndAnchor(link: string, fromPath: string) {
  const url = parseLink(link, fromPath);
  const [, splitAnchor] = link.split('#');

  const route = url.pathname;
  const anchor = url.hash.slice(1) || undefined;

  if (splitAnchor === '') {
    // rejects valid link with empty broken anchor
    // new URL will return an empty string /docs# and /docs
    return {route, anchor: ''};
  }

  return {route, anchor};
}

function checkAnchorsInOtherRoutes(allCollectedCorrectLinks: CollectedLinks): {
  [location: string]: BrokenLink[];
} {
  const brokenLinksByLocation: BrokenLinksByLocation = {};

  const linkCollection = Object.entries(allCollectedCorrectLinks);

  linkCollection.forEach(([path, collection]) => {
    const brokenLinks = collection.links.flatMap((link) => {
      const {route, anchor} = getRouteAndAnchor(link, path);
      if (anchor !== undefined) {
        const targetRoute = allCollectedCorrectLinks[route];

        if (targetRoute) {
          // means we have a link to an internal or external page that exists
          if (route === path && !targetRoute.anchors.includes(anchor)) {
            // internal page
            return [
              {
                link: `${route}#${anchor}`,
                resolvedLink: link,
                anchor: true,
              },
            ];
          }
          if (route !== path && !targetRoute.anchors.includes(anchor)) {
            // external page
            return [
              {
                link: `${route}#${anchor}`,
                resolvedLink: link,
                anchor: true,
              },
            ];
          }
        } else {
          // means we have link to an EXTERNAL not collected
          // (means no anchor or link)
          // but we have a link to this page with an anchor
          return [
            {
              link: `${route}#${anchor}`,
              resolvedLink: link,
              anchor: true,
            },
          ];
        }
      }

      return [];
    });

    if (brokenLinks.length > 0) {
      brokenLinksByLocation[path] = brokenLinks;
    }
  });

  return brokenLinksByLocation;
}

function getPageBrokenLinks({
  pagePath,
  pageLinks,
  pageAnchors,
  routes,
}: {
  pagePath: string;
  pageLinks: string[];
  pageAnchors: string[];
  routes: RouteConfig[];
}): BrokenLink[] {
  // ReactRouter is able to support links like ./../somePath but `matchRoutes`
  // does not do this resolution internally. We must resolve the links before
  // using `matchRoutes`. `resolvePathname` is used internally by React Router
  function resolveLink(link: string) {
    const resolvedLink = resolvePathname(onlyPathname(link), pagePath);
    return resolvedLink;
  }

  function isPathBrokenLink(link: string) {
    const matchedRoutes = [link, decodeURI(link)]
      // @ts-expect-error: React router types RouteConfig with an actual React
      // component, but we load route components with string paths.
      // We don't actually access component here, so it's fine.
      .map((l) => matchRoutes(routes, l))
      .flat();
    return matchedRoutes.length === 0;
  }

  function isAnchorBrokenLink(link: string) {
    const [urlPath, urlHash] = link.split('#');

    // ignore anchors that are not on the current page
    if (urlHash === undefined || pageAnchors.length === 0 || urlPath !== '') {
      return false;
    }

    const brokenAnchors = pageAnchors.filter((anchor) => anchor !== urlHash);

    return brokenAnchors.length > 0;
  }

  const brokenLinks = pageLinks.flatMap((pageLink) => {
    const resolvedLink = resolveLink(pageLink);
    if (isPathBrokenLink(resolvedLink)) {
      return [{link: pageLink, resolvedLink, anchor: false}];
    }
    if (isAnchorBrokenLink(pageLink)) {
      return [{link: pageLink, resolvedLink, anchor: true}];
    }
    return [];
  });

  return brokenLinks;
}

/**
 * The route defs can be recursive, and have a parent match-all route. We don't
 * want to match broken links like /docs/brokenLink against /docs/*. For this
 * reason, we only consider the "final routes" that do not have subroutes.
 * We also need to remove the match-all 404 route
 */
function filterIntermediateRoutes(routesInput: RouteConfig[]): RouteConfig[] {
  const routesWithout404 = routesInput.filter((route) => route.path !== '*');
  return getAllFinalRoutes(routesWithout404);
}

function getAllBrokenLinks({
  allCollectedLinks,
  routes,
}: {
  allCollectedLinks: CollectedLinks;
  routes: RouteConfig[];
}): {brokenLinks: BrokenLinksByLocation; brokenAnchors: BrokenLinksByLocation} {
  const filteredRoutes = filterIntermediateRoutes(routes);

  const allBrokenLinks = _.mapValues(
    allCollectedLinks,
    (pageCollectedData, pagePath) =>
      getPageBrokenLinks({
        pageLinks: pageCollectedData.links,
        pageAnchors: pageCollectedData.anchors,
        pagePath,
        routes: filteredRoutes,
      }),
  );
  const brokenLinks = Object.fromEntries(
    Object.entries(allBrokenLinks).filter(([, value]) => value.length > 0),
  );

  const brokenAnchors = checkAnchorsInOtherRoutes(allCollectedLinks);

  return {brokenLinks, brokenAnchors};
}

function brokenLinkMessage(brokenLink: BrokenLink): string {
  const showResolvedLink = brokenLink.link !== brokenLink.resolvedLink;
  return `${brokenLink.link}${
    showResolvedLink ? ` (resolved as: ${brokenLink.resolvedLink})` : ''
  }`;
}

function createBrokenLinksMessage(
  type: 'link' | 'anchor',
  pagePath: string,
  allBrokenLinks: BrokenLink[],
): string {
  const brokenLinks =
    type === 'anchor'
      ? allBrokenLinks.filter((link) => link.anchor)
      : allBrokenLinks.filter((link) => !link.anchor);

  const anchorMessage =
    brokenLinks.length > 0
      ? `- Broken ${type} on source page path = ${pagePath}:
   -> linking to ${brokenLinks
     .map(brokenLinkMessage)
     .join('\n   -> linking to ')}`
      : '';

  return `${anchorMessage}`;
}

function getAnchorBrokenLinksErrorMessage(allBrokenLinks: {
  [location: string]: BrokenLink[];
}): string | undefined {
  if (Object.keys(allBrokenLinks).length === 0) {
    return undefined;
  }

  return `Docusaurus found broken anchors!

Please check the pages of your site in the list below, and make sure you don't reference any anchor that does not exist.
Note: it's possible to ignore broken anchors with the 'onBrokenAnchors' Docusaurus configuration, and let the build pass.

Exhaustive list of all broken anchors found:
${Object.entries(allBrokenLinks)
  .map(([pagePath, brokenLinks]) =>
    createBrokenLinksMessage('anchor', pagePath, brokenLinks),
  )
  .join('\n')}
`;
}

function getPathBrokenLinksErrorMessage(allBrokenLinks: {
  [location: string]: BrokenLink[];
}): string | undefined {
  if (Object.keys(allBrokenLinks).length === 0) {
    return undefined;
  }

  /**
   * If there's a broken link appearing very often, it is probably a broken link
   * on the layout. Add an additional message in such case to help user figure
   * this out. See https://github.com/facebook/docusaurus/issues/3567#issuecomment-706973805
   */
  function getLayoutBrokenLinksHelpMessage() {
    const flatList = Object.entries(allBrokenLinks).flatMap(
      ([pagePage, brokenLinks]) =>
        brokenLinks.map((brokenLink) => ({pagePage, brokenLink})),
    );

    const countedBrokenLinks = _.countBy(
      flatList,
      (item) => item.brokenLink.link,
    );

    const FrequencyThreshold = 5; // Is this a good value?
    const frequentLinks = Object.entries(countedBrokenLinks)
      .filter(([, count]) => count >= FrequencyThreshold)
      .map(([link]) => link);

    if (frequentLinks.length === 0) {
      return '';
    }

    return logger.interpolate`

It looks like some of the broken links we found appear in many pages of your site.
Maybe those broken links appear on all pages through your site layout?
We recommend that you check your theme configuration for such links (particularly, theme navbar and footer).
Frequent broken links are linking to:${frequentLinks}`;
  }

  return `Docusaurus found broken links!

Please check the pages of your site in the list below, and make sure you don't reference any path that does not exist.
Note: it's possible to ignore broken links with the 'onBrokenLinks' Docusaurus configuration, and let the build pass.${getLayoutBrokenLinksHelpMessage()}

Exhaustive list of all broken links found:
${Object.entries(allBrokenLinks)
  .map(([pagePath, brokenLinks]) =>
    createBrokenLinksMessage('link', pagePath, brokenLinks),
  )
  .join('\n')}
`;
}

export async function handleBrokenLinks({
  allCollectedLinks,
  onBrokenLinks,
  onBrokenAnchors,
  routes,
}: {
  allCollectedLinks: CollectedLinks;
  onBrokenLinks: ReportingSeverity;
  onBrokenAnchors: ReportingSeverity;
  routes: RouteConfig[];
}): Promise<void> {
  if (onBrokenLinks === 'ignore' && onBrokenAnchors === 'ignore') {
    return;
  }

  const {brokenLinks, brokenAnchors} = getAllBrokenLinks({
    allCollectedLinks,
    routes,
  });

  const pathErrorMessage = getPathBrokenLinksErrorMessage(brokenLinks);
  if (pathErrorMessage) {
    logger.report(onBrokenLinks)(pathErrorMessage);
  }

  const anchorErrorMessage = getAnchorBrokenLinksErrorMessage(brokenAnchors);
  if (anchorErrorMessage) {
    logger.report(onBrokenAnchors)(anchorErrorMessage);
  }
}
