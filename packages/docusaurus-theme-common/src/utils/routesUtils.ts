/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import generatedRoutes from '@generated/routes';
import {useMemo} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {Route} from '@docusaurus/types';

/**
 * Note that sites don't always have a homepage in practice, so we can't assume
 * that linking to '/' is always safe.
 * @see https://github.com/facebook/docusaurus/pull/6517#issuecomment-1048709116
 */
export function findHomePageRoute({
  baseUrl,
  routes: initialRoutes,
}: {
  routes: Route[];
  baseUrl: string;
}): Route | undefined {
  function isHomePageRoute(route: Route): boolean {
    return route.path === baseUrl && route.exact === true;
  }

  function isHomeParentRoute(route: Route): boolean {
    return route.path === baseUrl && !route.exact;
  }

  function doFindHomePageRoute(routes: Route[]): Route | undefined {
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
    return doFindHomePageRoute(indexSubRoutes);
  }

  return doFindHomePageRoute(initialRoutes);
}

export function useHomePageRoute(): Route | undefined {
  const {baseUrl} = useDocusaurusContext().siteConfig;
  return useMemo(
    () =>
      findHomePageRoute({
        routes: generatedRoutes,
        baseUrl,
      }),
    [baseUrl],
  );
}
