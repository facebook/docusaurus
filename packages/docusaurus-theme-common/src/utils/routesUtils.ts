/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import GeneratedRoutes, {type Route} from '@generated/routes';
import {useMemo} from 'react';

function isHomePageRoute(route: Route): boolean {
  return route.path === '/' && route.exact === true;
}

function isHomeParentRoute(route: Route): boolean {
  return route.path === '/' && route.exact === false;
}

// Note that all sites don't always have a homepage in practice
// See https://github.com/facebook/docusaurus/pull/6517#issuecomment-1048709116
export function findHomePageRoute(
  routes: Route[] = GeneratedRoutes,
): Route | undefined {
  if (routes.length === 0) {
    return undefined;
  }
  const homePage = routes.find(isHomePageRoute);
  if (homePage) {
    return homePage;
  }
  const indexSubRoutes = routes
    .filter(isHomeParentRoute)
    .flatMap((route) => route.routes ?? []);
  return findHomePageRoute(indexSubRoutes);
}

export function useHomePageRoute(): Route | undefined {
  return useMemo(() => findHomePageRoute(), []);
}
