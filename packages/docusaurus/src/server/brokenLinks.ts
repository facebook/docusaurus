/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {matchRoutes, RouteConfig as RRRouteConfig} from 'react-router-config';
import resolvePathname from 'resolve-pathname';
import fs from 'fs-extra';
import {mapValues, pickBy, flatten, countBy} from 'lodash';
import {RouteConfig, ReportingSeverity} from '@docusaurus/types';
import {removePrefix, removeSuffix} from '@docusaurus/utils';
import {getAllFinalRoutes, reportMessage} from './utils';
import path from 'path';

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
    return `\n- On source page path = ${pagePath}:\n   -> linking to ${brokenLinks
      .map(brokenLinkMessage)
      .join('\n   -> linking to ')}`;
  }

  // If there's a broken link appearing very often, it is probably a broken link on the layout!
  // Add an additional message in such case to help user figure this out.
  // see https://github.com/facebook/docusaurus/issues/3567#issuecomment-706973805
  function getLayoutBrokenLinksHelpMessage() {
    const flatList = flatten(
      Object.entries(allBrokenLinks).map(([pagePage, brokenLinks]) =>
        brokenLinks.map((brokenLink) => ({pagePage, brokenLink})),
      ),
    );

    const countedBrokenLinks = countBy(
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

    return `\n\nIt looks like some of the broken links we found appear in many pages of your site.\nMaybe those broken links appear on all pages through your site layout?\nWe recommend that you check your theme configuration for such links (particularly, theme navbar and footer).\nFrequent broken links are linking to: \n- ${frequentLinks.join(
      `\n- `,
    )}\n`;
  }

  return (
    `Docusaurus found broken links!\n\nPlease check the pages of your site in the list bellow, and make sure you don't reference any path that does not exist.\nNote: it's possible to ignore broken links with the 'onBrokenLinks' Docusaurus configuration, and let the build pass.${getLayoutBrokenLinksHelpMessage()}` +
    `\n\nExhaustive list of all broken links found:\n${Object.entries(
      allBrokenLinks,
    )
      .map(([pagePath, brokenLinks]) =>
        pageBrokenLinksMessage(pagePath, brokenLinks),
      )
      .join('\n')}
`
  );
}

function isExistingFile(filePath: string) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (e) {
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
  // not easy to make this async :'(
  function linkFileExists(link: string): boolean {
    // /baseUrl/javadoc/ -> /outDir/javadoc
    const baseFilePath = removeSuffix(
      `${outDir}/${removePrefix(link, baseUrl)}`,
      '/',
    );

    // -> /outDir/javadoc
    // -> /outDir/javadoc.html
    // -> /outDir/javadoc/index.html
    const filePathsToTry: string[] = [baseFilePath];
    if (!path.extname(baseFilePath)) {
      filePathsToTry.push(`${baseFilePath}.html`);
      filePathsToTry.push(path.join(baseFilePath, 'index.html'));
    }

    return filePathsToTry.some(isExistingFile);
  }

  return mapValues(allCollectedLinks, (links) => {
    return links.filter((link) => !linkFileExists(link));
  });
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
}) {
  if (onBrokenLinks === 'ignore') {
    return;
  }

  // If we link to a file like /myFile.zip, and the file actually exist for the file system
  // it is not a broken link, it may simply be a link to an existing static file...
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
