/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import {
  Router,
  Navigate,
  useLocation as useReactRouterLocation,
} from 'react-router';
import {matchPath} from '../matchRoutes';
import ExecutionEnvironment from './ExecutionEnvironment';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';
import type {History, Location, To} from 'history';

// Re-export the v5-compatible matchPath: React Router v6+ changed the matchPath
// signature/return shape, so we keep our own to preserve the public API.
export {matchPath};
export type {History, Location};

/**
 * Holds the `history` (from the `history` package) instance that drives React
 * Router. React Router v6+ no longer exposes a `useHistory()` hook nor a
 * mutable history object, so Docusaurus creates its own and shares it through
 * context.
 * This is what powers `useHistory()`, used for navigation blocking, listening,
 * and querystring updates.
 */
const HistoryContext = createContext<History | null>(null);

/**
 * Lets `<PendingNavigation>` override the location seen by route descendants
 * while a navigation is pending (it keeps rendering the previous location until
 * the next route's code has been preloaded). This replaces React Router v5's
 * controlled `<Route location={...}>` trick, which no longer exists in v6+.
 */
const LocationOverrideContext = createContext<Location | null>(null);

export function useHistory(): History {
  const history = useContext(HistoryContext);
  if (!history) {
    throw new Error(
      'Docusaurus useHistory() was called outside of the Docusaurus router.',
    );
  }
  return history;
}

export function useLocation(): Location {
  const overriddenLocation = useContext(LocationOverrideContext);
  const location = useReactRouterLocation();
  return (overriddenLocation ?? location) as Location;
}

export type RedirectProps = {
  readonly to: To;
  /** When `true`, pushes a new entry instead of replacing the current one. */
  readonly push?: boolean;
  readonly children?: ReactNode;
};

/**
 * Backward-compatible `<Redirect>` (removed in React Router v6+), built on
 * top of `<Navigate>`.
 */
export function Redirect({to, push = false}: RedirectProps): ReactNode {
  return <Navigate to={to as string} replace={!push} />;
}

/**
 * Provides the location override to route descendants. Used by
 * `<PendingNavigation>` to keep showing the current route until the next route
 * has loaded.
 */
export function LocationOverrideProvider({
  location,
  children,
}: {
  location: Location;
  children: ReactNode;
}): ReactNode {
  return (
    <LocationOverrideContext.Provider value={location}>
      {children}
    </LocationOverrideContext.Provider>
  );
}

/**
 * The Docusaurus router. It drives React Router with a `history` instance
 * (browser/hash on the client, memory on the server) using the low-level
 * `<Router>` component, mirroring what React Router's own `BrowserRouter` and
 * (removed) `unstable_HistoryRouter` do internally. This is what allows
 * `useHistory()` to keep returning a real, listenable/blockable history object.
 */
export function DocusaurusRouter({
  history,
  children,
}: {
  history: History;
  children: ReactNode;
}): ReactNode {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });
  useIsomorphicLayoutEffect(() => history.listen(setState), [history]);

  return (
    <HistoryContext.Provider value={history}>
      <Router
        location={state.location}
        navigationType={state.action}
        navigator={
          history as unknown as ComponentProps<typeof Router>['navigator']
        }
        static={!ExecutionEnvironment.canUseDOM}>
        {children}
      </Router>
    </HistoryContext.Provider>
  );
}
