/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  applyTrailingSlash,
  type ApplyTrailingSlashParams,
} from '@docusaurus/utils-common';
import type {RouteConfig} from '@docusaurus/types';

/** Recursively applies trailing slash config to all nested routes. */
export function applyRouteTrailingSlash(
  route: RouteConfig,
  params: ApplyTrailingSlashParams,
): RouteConfig {
  return {
    ...route,
    path: applyTrailingSlash(route.path, params),
    ...(route.routes && {
      routes: route.routes.map((subroute) =>
        applyRouteTrailingSlash(subroute, params),
      ),
    }),
  };
}

export function sortConfig(
  routeConfigs: RouteConfig[],
  baseUrl: string = '/',
): void {
  // Sort the route config. This ensures that route with nested
  // routes is always placed last.
  routeConfigs.sort((a, b) => {
    // Root route should get placed last.
    if (a.path === baseUrl && b.path !== baseUrl) {
      return 1;
    }
    if (a.path !== baseUrl && b.path === baseUrl) {
      return -1;
    }

    if (a.routes && !b.routes) {
      return 1;
    }
    if (!a.routes && b.routes) {
      return -1;
    }
    // Higher priority get placed first.
    if (a.priority || b.priority) {
      const priorityA = a.priority ?? 0;
      const priorityB = b.priority ?? 0;
      const score = priorityB - priorityA;

      if (score !== 0) {
        return score;
      }
    }

    return a.path.localeCompare(b.path);
  });

  routeConfigs.forEach((routeConfig) => {
    if (routeConfig.routes) {
      sortConfig(routeConfig.routes, baseUrl);
    }
  });
}
