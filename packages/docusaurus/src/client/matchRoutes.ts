/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {matchPath as reactRouterMatchPath} from 'react-router';

// React Router v6+ removed `react-router-config` (`renderRoutes`/`matchRoutes`)
// and changed `matchPath`'s signature/return shape. Docusaurus' route config is
// string-based, recursive (`routes`), and order-based (first-match-wins), so we
// keep two thin helpers on top of React Router's own `matchPath`:
// - a v5-compatible `matchPath(pathname, {path, exact, strict})` (also the
//   public `@docusaurus/router` API), and
// - a `matchRoutes` that walks the recursive route config.

export type Match = {
  /** The route path pattern that was matched. */
  path: string | undefined;
  /** The matched portion of the URL. */
  url: string;
  /** Whether the match consumed the whole pathname. */
  isExact: boolean;
  /** The values of the dynamic params declared in the path pattern. */
  params: {[paramName: string]: string | undefined};
};

export type MatchPathOptions = {
  path?: string | string[];
  exact?: boolean;
  // Trailing-slash sensitivity. React Router v6+ `matchPath` has no `strict`
  // option and tolerates trailing slashes; kept for API compatibility.
  strict?: boolean;
  sensitive?: boolean;
};

/**
 * React Router v5-compatible `matchPath`, implemented on top of React Router's
 * own `matchPath`. Kept for the public `@docusaurus/router` API and internal
 * usage: `matchPath(pathname, {path, exact, strict, sensitive})`.
 */
export function matchPath(
  pathname: string,
  options: MatchPathOptions | string = {},
): Match | null {
  const {
    path,
    exact = false,
    strict = false,
    sensitive = false,
  } = typeof options === 'string' ? {path: options} : options;

  const patterns = ([] as (string | undefined)[]).concat(path);
  for (const pattern of patterns) {
    // A route without a path always matches (it inherits the parent match).
    if (pattern === undefined || pattern === null) {
      return {path: pattern, url: pathname, isExact: true, params: {}};
    }
    const match = reactRouterMatchPath(
      {path: pattern, end: exact, caseSensitive: sensitive},
      pathname,
    );
    // React Router's matchPath is tolerant of trailing slashes and has no
    // `strict` option, so we re-enforce trailing-slash sensitivity ourselves:
    // a strict pattern ending with "/" only matches a pathname that has it.
    if (match && strict && pattern.endsWith('/') && pattern !== '/') {
      const actual = sensitive ? pathname : pathname.toLowerCase();
      const expected = sensitive ? pattern : pattern.toLowerCase();
      if (!actual.startsWith(expected)) {
        continue;
      }
    }
    if (match) {
      return {
        path: pattern,
        url: match.pathname,
        isExact: match.pathname === pathname,
        params: match.params,
      };
    }
  }
  return null;
}

// Minimal structural route type, kept generic so callers preserve their richer
// route type (e.g. the runtime `component` with its `.preload()` method).
type RouteLike = {
  path?: string;
  exact?: boolean;
  strict?: boolean;
  routes?: unknown;
};

export type MatchedRoute<Route> = {route: Route; match: Match};

/**
 * Walks the recursive route config in order (first-match-wins, like the v5
 * `<Switch>` / removed `react-router-config`), recursing into the `routes` of
 * the first matching route. Returns the matched branch.
 */
export function matchRoutes<Route extends RouteLike>(
  routes: Route[],
  pathname: string,
  branch: Array<MatchedRoute<Route>> = [],
): Array<MatchedRoute<Route>> {
  routes.some((route) => {
    let match: Match | null;
    if (route.path) {
      match = matchPath(pathname, route);
    } else if (branch.length) {
      match = branch[branch.length - 1]!.match;
    } else {
      match = {path: '/', url: '/', params: {}, isExact: pathname === '/'};
    }

    if (match) {
      branch.push({route, match});
      if (Array.isArray(route.routes)) {
        matchRoutes(route.routes as Route[], pathname, branch);
      }
    }
    return Boolean(match);
  });
  return branch;
}
