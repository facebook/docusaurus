/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import flatMap from 'lodash.flatmap';
import {RouteConfig} from '@docusaurus/types';

// Recursively get the final routes (routes with no subroutes)
export function getAllFinalRoutes(routeConfig: RouteConfig[]): RouteConfig[] {
  function getFinalRoutes(route: RouteConfig): RouteConfig[] {
    return route.routes ? flatMap(route.routes, getFinalRoutes) : [route];
  }
  return flatMap(routeConfig, getFinalRoutes);
}
