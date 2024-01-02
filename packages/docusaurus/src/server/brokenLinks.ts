/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import logger from '@docusaurus/logger';
import {matchRoutes} from 'react-router-config';
import {parseURLPath, serializeURLPath, type URLPath} from '@docusaurus/utils';
import {getAllFinalRoutes} from './utils';
import type {RouteConfig, ReportingSeverity} from '@docusaurus/types';

type BrokenLink = {
  link: string;
  resolvedLink: string;
  anchor: boolean;
};

type BrokenLinksMap = {[pathname: string]: BrokenLink[]};

// The linking data that has been collected on Docusaurus pages during SSG
// {rendered page pathname => links and anchors collected on that page}
type CollectedLinks = {
  [pathname: string]: {links: string[]; anchors: string[]};
};

function getBrokenLinksForPage({
  collectedLinks,
  pagePath,
  pageLinks,
  routes,
}: {
  collectedLinks: CollectedLinks;
  pagePath: string;
  pageLinks: string[];
  pageAnchors: string[];
  routes: RouteConfig[];
}): BrokenLink[] {
  // console.log('routes:', routes);
  function isPathBrokenLink(linkPath: URLPath) {
    const matchedRoutes = [linkPath.pathname, decodeURI(linkPath.pathname)]
      // @ts-expect-error: React router types RouteConfig with an actual React
      // component, but we load route components with string paths.
      // We don't actually access component here, so it's fine.
      .map((l) => matchRoutes(routes, l))
      .flat();
    return matchedRoutes.length === 0;
  }

  function isAnchorBrokenLink(linkPath: URLPath) {
    const {pathname, hash} = linkPath;

    // Link has no hash: it can't be a broken anchor link
    if (hash === undefined) {
      return false;
    }

    const targetPage =
      collectedLinks[pathname] || collectedLinks[decodeURI(pathname)];

    // link with anchor to a page that does not exist (or did not collect any
    // link/anchor) is considered as a broken anchor
    if (!targetPage) {
      return true;
    }

    // it's a broken anchor if the target page exists
    // but the anchor does not exist on that page
    return !targetPage.anchors.includes(hash);
  }

  const brokenLinks = pageLinks.flatMap((link) => {
    const linkPath = parseURLPath(link, pagePath);
    if (isPathBrokenLink(linkPath)) {
      return [
        {
          link,
          resolvedLink: serializeURLPath(linkPath),
          anchor: false,
        },
      ];
    }
    if (isAnchorBrokenLink(linkPath)) {
      return [
        {
          link,
          resolvedLink: serializeURLPath(linkPath),
          anchor: true,
        },
      ];
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

function getBrokenLinks({
  collectedLinks,
  routes,
}: {
  collectedLinks: CollectedLinks;
  routes: RouteConfig[];
}): BrokenLinksMap {
  const filteredRoutes = filterIntermediateRoutes(routes);

  return _.mapValues(collectedLinks, (pageCollectedData, pagePath) =>
    getBrokenLinksForPage({
      collectedLinks,
      pageLinks: pageCollectedData.links,
      pageAnchors: pageCollectedData.anchors,
      pagePath,
      routes: filteredRoutes,
    }),
  );
}

function brokenLinkMessage(brokenLink: BrokenLink): string {
  const showResolvedLink = brokenLink.link !== brokenLink.resolvedLink;
  return `${brokenLink.link}${
    showResolvedLink ? ` (resolved as: ${brokenLink.resolvedLink})` : ''
  }`;
}

function createBrokenLinksMessage(
  pagePath: string,
  brokenLinks: BrokenLink[],
): string {
  const type = brokenLinks[0]?.anchor === true ? 'anchor' : 'link';

  const anchorMessage =
    brokenLinks.length > 0
      ? `- Broken ${type} on source page path = ${pagePath}:
   -> linking to ${brokenLinks
     .map(brokenLinkMessage)
     .join('\n   -> linking to ')}`
      : '';

  return `${anchorMessage}`;
}

function createBrokenAnchorsMessage(
  brokenAnchors: BrokenLinksMap,
): string | undefined {
  if (Object.keys(brokenAnchors).length === 0) {
    return undefined;
  }

  return `Docusaurus found broken anchors!

Please check the pages of your site in the list below, and make sure you don't reference any anchor that does not exist.
Note: it's possible to ignore broken anchors with the 'onBrokenAnchors' Docusaurus configuration, and let the build pass.

Exhaustive list of all broken anchors found:
${Object.entries(brokenAnchors)
  .map(([pagePath, brokenLinks]) =>
    createBrokenLinksMessage(pagePath, brokenLinks),
  )
  .join('\n')}
`;
}

function createBrokenPathsMessage(
  brokenPathsMap: BrokenLinksMap,
): string | undefined {
  if (Object.keys(brokenPathsMap).length === 0) {
    return undefined;
  }

  /**
   * If there's a broken link appearing very often, it is probably a broken link
   * on the layout. Add an additional message in such case to help user figure
   * this out. See https://github.com/facebook/docusaurus/issues/3567#issuecomment-706973805
   */
  function getLayoutBrokenLinksHelpMessage() {
    const flatList = Object.entries(brokenPathsMap).flatMap(
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
${Object.entries(brokenPathsMap)
  .map(([pagePath, brokenPaths]) =>
    createBrokenLinksMessage(pagePath, brokenPaths),
  )
  .join('\n')}
`;
}

function splitBrokenLinks(brokenLinks: BrokenLinksMap): {
  brokenPaths: BrokenLinksMap;
  brokenAnchors: BrokenLinksMap;
} {
  const brokenPaths: BrokenLinksMap = {};
  const brokenAnchors: BrokenLinksMap = {};

  Object.entries(brokenLinks).forEach(([pathname, pageBrokenLinks]) => {
    const [anchorBrokenLinks, pathBrokenLinks] = _.partition(
      pageBrokenLinks,
      (link) => link.anchor,
    );

    if (pathBrokenLinks.length > 0) {
      brokenPaths[pathname] = pathBrokenLinks;
    }
    if (anchorBrokenLinks.length > 0) {
      brokenAnchors[pathname] = anchorBrokenLinks;
    }
  });

  return {brokenPaths, brokenAnchors};
}

function reportBrokenLinks({
  brokenLinks,
  onBrokenLinks,
  onBrokenAnchors,
}: {
  brokenLinks: BrokenLinksMap;
  onBrokenLinks: ReportingSeverity;
  onBrokenAnchors: ReportingSeverity;
}) {
  // We need to split the broken links reporting in 2 for better granularity
  // This is because we need to report broken path/anchors independently
  // For v3.x retro-compatibility, we can't throw by default for broken anchors
  // TODO Docusaurus v4: make onBrokenAnchors throw by default?
  const {brokenPaths, brokenAnchors} = splitBrokenLinks(brokenLinks);

  const pathErrorMessage = createBrokenPathsMessage(brokenPaths);
  if (pathErrorMessage) {
    logger.report(onBrokenLinks)(pathErrorMessage);
  }

  const anchorErrorMessage = createBrokenAnchorsMessage(brokenAnchors);
  if (anchorErrorMessage) {
    logger.report(onBrokenAnchors)(anchorErrorMessage);
  }
}

export async function handleBrokenLinks({
  collectedLinks,
  onBrokenLinks,
  onBrokenAnchors,
  routes,
}: {
  collectedLinks: CollectedLinks;
  onBrokenLinks: ReportingSeverity;
  onBrokenAnchors: ReportingSeverity;
  routes: RouteConfig[];
}): Promise<void> {
  if (onBrokenLinks === 'ignore' && onBrokenAnchors === 'ignore') {
    return;
  }
  const brokenLinks = getBrokenLinks({routes, collectedLinks});
  reportBrokenLinks({brokenLinks, onBrokenLinks, onBrokenAnchors});
}
