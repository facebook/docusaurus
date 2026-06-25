/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from 'react';
import {matchPath, type Match} from '../matchRoutes';
import {useLocation} from './router';

// React Router v6+ removed `react-router-config` (and its `renderRoutes`).
// Docusaurus relies on a string-based, recursive route config where each route
// component renders its own subroutes via `renderRoutes(route.routes)`. We
// reimplement the v5 `<Switch>` semantics (first-match-wins against the full,
// absolute pathname) on top of our dependency-free `matchPath`.

type RouteToRender = {
  path?: string;
  exact?: boolean;
  strict?: boolean;
  // The route config types `component` as a string (a module path), but at
  // runtime it is a react-loadable component. We keep it `unknown` here so that
  // both the config-time and runtime route shapes can be passed in.
  component?: unknown;
  render?: (props: {[key: string]: unknown}) => ReactNode;
  routes?: RouteToRender[];
  [attribute: string]: unknown;
};

function RenderRoutes({
  routes,
  extraProps,
}: {
  routes: RouteToRender[];
  extraProps: {[propName: string]: unknown};
}): ReactNode {
  const location = useLocation();

  for (const route of routes) {
    const match: Match | null = route.path
      ? matchPath(location.pathname, route)
      : {path: undefined, url: location.pathname, isExact: true, params: {}};

    if (match) {
      const routeProps = {...extraProps, location, match, route};
      if (route.render) {
        return route.render(routeProps);
      }
      const Component = route.component as
        | ComponentType<{[key: string]: unknown}>
        | undefined;
      return Component ? <Component {...routeProps} /> : null;
    }
  }

  return null;
}

/**
 * Renders the first route (in order) whose `path` matches the current location,
 * passing it the `route` config so it can render its own subroutes. Mirrors the
 * `react-router-config` `renderRoutes` signature so existing callers (and
 * swizzled theme components) keep working.
 */
export default function renderRoutes(
  routes: RouteToRender[],
  extraProps: {[propName: string]: unknown} = {},
): ReactElement {
  return <RenderRoutes routes={routes} extraProps={extraProps} />;
}
