/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  matchRoutes,
  type RouteConfig as RRRouteConfig,
} from 'react-router-config';
import fs from 'fs-extra';
import _ from 'lodash';
import type {RouteConfig, ReportingSeverity} from '@docusaurus/types';
import {
  removePrefix,
  removeSuffix,
  reportMessage,
  resolvePathname,
} from '@docusaurus/utils';
import {getAllFinalRoutes} from './utils';
import path from 'path';
import combinePromises from 'combine-promises';
import logger from '@docusaurus/logger';

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
  return link.split('#')[0]!.split('?')[0]!;
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
    const matchedRoutes = [link, decodeURI(link)]
      .map((l) => matchRoutes(toReactRouterRoutes(routes), l))
      .reduce((prev, cur) => prev.concat(cur));
    return matchedRoutes.length === 0;
  }

  return pageLinks.map(resolveLink).filter((l) => isBrokenLink(l.resolvedLink));
}

/**
 * The route defs can be recursive, and have a parent match-all route. We don't
 * want to match broken links like /docs/brokenLink against /docs/*. For this
 * reason, we only consider the "final routes", that do not have subroutes.
 * We also need to remove the match all 404 route
 */
function filterIntermediateRoutes(routesInput: RouteConfig[]): RouteConfig[] {
  const routesWithout404 = routesInput.filter((route) => route.path !== '*');
  return getAllFinalRoutes(routesWithout404);
}

export function getAllBrokenLinks({
  allCollectedLinks,
  routes,
}: {
  allCollectedLinks: Record<string, string[]>;
  routes: RouteConfig[];
}): Record<string, BrokenLink[]> {
  const filteredRoutes = filterIntermediateRoutes(routes);

  const allBrokenLinks = _.mapValues(allCollectedLinks, (pageLinks, pagePath) =>
    getPageBrokenLinks({pageLinks, pagePath, routes: filteredRoutes}),
  );

  // remove pages without any broken link
  return _.pickBy(allBrokenLinks, (brokenLinks) => brokenLinks.length > 0);
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
    return `
- On source page path = ${pagePath}:
   -> linking to ${brokenLinks
     .map(brokenLinkMessage)
     .join('\n   -> linking to ')}`;
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
Frequent broken links are linking to:${frequentLinks}
`;
  }

  return `Docusaurus found broken links!

Please check the pages of your site in the list below, and make sure you don't reference any path that does not exist.
Note: it's possible to ignore broken links with the 'onBrokenLinks' Docusaurus configuration, and let the build pass.${getLayoutBrokenLinksHelpMessage()}

Exhaustive list of all broken links found:
${Object.entries(allBrokenLinks)
  .map(([pagePath, brokenLinks]) =>
    pageBrokenLinksMessage(pagePath, brokenLinks),
  )
  .join('\n')}
`;
}

async function isExistingFile(filePath: string) {
  try {
    return (await fs.stat(filePath)).isFile();
  } catch {
    return false;
  }
}

// If a file actually exist on the file system, we know the link is valid
// even if docusaurus does not know about this file, so we don't report it
export async function filterExistingFileLinks({
  baseUrl,
  outDir,
  allCollectedLinks,
}: {
  baseUrl: string;
  outDir: string;
  allCollectedLinks: Record<string, string[]>;
}): Promise<Record<string, string[]>> {
  async function linkFileExists(link: string) {
    // /baseUrl/javadoc/ -> /outDir/javadoc
    const baseFilePath = onlyPathname(
      removeSuffix(`${outDir}/${removePrefix(link, baseUrl)}`, '/'),
    );

    // -> /outDir/javadoc
    // -> /outDir/javadoc.html
    // -> /outDir/javadoc/index.html
    const filePathsToTry: string[] = [baseFilePath];
    if (!path.extname(baseFilePath)) {
      filePathsToTry.push(`${baseFilePath}.html`);
      filePathsToTry.push(path.join(baseFilePath, 'index.html'));
    }

    for (const file of filePathsToTry) {
      if (await isExistingFile(file)) {
        return true;
      }
    }
    return false;
  }

  return combinePromises(
    _.mapValues(allCollectedLinks, async (links) =>
      (
        await Promise.all(
          links.map(async (link) => ((await linkFileExists(link)) ? '' : link)),
        )
      ).filter(Boolean),
    ),
  );
}

export async function handleBrokenLinks({
  allCollectedLinks,
  onBrokenLinks,
  routes,
  baseUrl,
  outDir,
}: {
  allCollectedLinks: Record<string, string[]>;
  onBrokenLinks: ReportingSeverity;
  routes: RouteConfig[];
  baseUrl: string;
  outDir: string;
}): Promise<void> {
  if (onBrokenLinks === 'ignore') {
    return;
  }

  // If we link to a file like /myFile.zip, and the file actually exist for the
  // file system. It is not a broken link, it may simply be a link to an
  // existing static file...
  const allCollectedLinksFiltered = await filterExistingFileLinks({
    allCollectedLinks,
    baseUrl,
    outDir,
  });

  const allBrokenLinks = getAllBrokenLinks({
    allCollectedLinks: allCollectedLinksFiltered,
    routes,
  });

  const errorMessage = getBrokenLinksErrorMessage(allBrokenLinks);
  if (errorMessage) {
    reportMessage(errorMessage, onBrokenLinks);
  }
}
