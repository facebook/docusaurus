/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import {
  Navigate,
  matchPath as reactRouterMatchPath,
  useLocation,
  useParams,
  type PathPattern,
} from 'react-router';
import type {Location} from 'history';

type DocusaurusRouteConfig = {
  path: string;
  component: React.ComponentType<any> & {preload?: () => void | Promise<void>};
  exact?: boolean;
  strict?: boolean;
  routes?: DocusaurusRouteConfig[];
  [attributeName: string]: unknown;
};

type DocusaurusRouteMatch = {
  route: DocusaurusRouteConfig;
  match: {
    path: string;
    url: string;
    isExact: boolean;
    params: Record<string, string | undefined>;
  };
};

function RouteElement({route}: {route: DocusaurusRouteConfig}): ReactNode {
  const Component = route.component;
  const location = useLocation();
  const params = useParams();
  const match = {
    path: route.path,
    url: location.pathname,
    isExact: location.pathname === route.path,
    params,
  };
  return <Component route={route} location={location} match={match} />;
}

function RenderRoutes({routes}: {routes: DocusaurusRouteConfig[]}): ReactNode {
  const location = useLocation();
  const route = routes.find((item) =>
    matchPath(location.pathname, {
      path: item.path,
      exact: item.exact,
      strict: item.strict,
    }),
  );

  return route ? <RouteElement route={route} /> : null;
}

export function matchPath(
  pathname: string,
  options: {
    path: string;
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean;
  },
): DocusaurusRouteMatch['match'] | null {
  const match = reactRouterMatchPath(
    {
      path: options.path,
      end: options.exact ?? false,
      caseSensitive: options.sensitive ?? false,
    },
    pathname,
  );

  if (!match) {
    return null;
  }

  return {
    path: options.path,
    url: match.pathname,
    isExact: match.pathname === pathname,
    params: match.params,
  };
}

export function renderRoutes(routes: DocusaurusRouteConfig[]): ReactNode {
  return <RenderRoutes routes={routes} />;
}

function matchRouteBranch(
  route: DocusaurusRouteConfig,
  pathname: string,
): DocusaurusRouteMatch[] | null {
  const routeMatch = matchPath(pathname, {
    path: route.path,
    exact: route.exact,
    strict: route.strict,
  });

  if (!routeMatch) {
    return null;
  }

  const currentMatch = {route, match: routeMatch};
  const childMatches = route.routes
    ?.map((childRoute) => matchRouteBranch(childRoute, pathname))
    .find(Boolean);

  return childMatches ? [currentMatch, ...childMatches] : [currentMatch];
}

export function matchRoutes(
  routes: DocusaurusRouteConfig[],
  pathname: string,
): DocusaurusRouteMatch[] {
  return routes
    .map((route) => matchRouteBranch(route, pathname))
    .find(Boolean) ?? [];
}

export function Redirect({
  push,
  to,
}: {
  push?: boolean;
  to: string | Partial<Location>;
}): ReactNode {
  return <Navigate to={to} replace={!push} />;
}

export type {DocusaurusRouteConfig as RouteConfig, PathPattern};
