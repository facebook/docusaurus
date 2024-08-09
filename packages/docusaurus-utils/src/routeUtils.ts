/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {RouteConfig} from '@docusaurus/types';

/**
 * Recursively flatten routes and only return the "leaf routes"
 * Parent routes are filtered out
 */
export function flattenRoutes(routeConfig: RouteConfig[]): RouteConfig[] {
  function flatten(route: RouteConfig): RouteConfig[] {
    return route.routes ? route.routes.flatMap(flatten) : [route];
  }
  return routeConfig.flatMap(flatten);
}
