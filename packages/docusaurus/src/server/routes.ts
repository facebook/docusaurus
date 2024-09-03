/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import {normalizeUrl, flattenRoutes} from '@docusaurus/utils';
import type {RouteConfig, ReportingSeverity} from '@docusaurus/types';

export function handleDuplicateRoutes(
  routes: RouteConfig[],
  onDuplicateRoutes: ReportingSeverity,
): void {
  if (onDuplicateRoutes === 'ignore') {
    return;
  }
  const allRoutes: string[] = flattenRoutes(routes).map(
    (routeConfig) => routeConfig.path,
  );
  const seenRoutes = new Set<string>();
  const duplicatePaths = allRoutes.filter((route) => {
    if (seenRoutes.has(route)) {
      return true;
    }
    seenRoutes.add(route);
    return false;
  });
  if (duplicatePaths.length > 0) {
    logger.report(
      onDuplicateRoutes,
    )`Duplicate routes found!${duplicatePaths.map(
      (duplicateRoute) =>
        logger.interpolate`Attempting to create page at url=${duplicateRoute}, but a page already exists at this route.`,
    )}
This could lead to non-deterministic routing behavior.`;
  }
}

/**
 * Old stuff
 * As far as I understand, this is what permits to SSG the 404.html file
 * This is rendered through the catch-all ComponentCreator("*") route
 * Note CDNs only understand the 404.html file by convention
 * The extension probably permits to avoid emitting "/404/index.html"
 *
 * TODO we should probably deprecate/remove "postBuild({routesPaths})
 *  The 404 generation handling can be moved to the SSG code
 *  We only need getAllFinalRoutes() utils IMHO
 *  This would be a plugin lifecycle breaking change :/
 *  Although not many plugins probably use this
 *
 */
const NotFoundRoutePath = '/404.html';

export function getRoutesPaths(
  routeConfigs: RouteConfig[],
  baseUrl: string,
): string[] {
  return [
    normalizeUrl([baseUrl, NotFoundRoutePath]),
    ...flattenRoutes(routeConfigs).map((r) => r.path),
  ];
}
