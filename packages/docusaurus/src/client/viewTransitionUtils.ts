/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {flushSync} from 'react-dom';
import siteConfig from '@generated/docusaurus.config';
import ExecutionEnvironment from './exports/ExecutionEnvironment';
import type {Action, Location} from 'history';

/**
 * Docusaurus currently uses the browser View Transition API directly with
 * `flushSync` at the route commit point in `PendingNavigation`.
 *
 * When React's stable `<ViewTransition>` component ships, we may migrate to
 * that built-in orchestration to avoid manual `flushSync` and better integrate
 * with React concurrent features.
 *
 * @see https://react.dev/reference/react/ViewTransition
 */

let activeViewTransition: ViewTransition | null = null;
let viewTransitionStylesLoaded = false;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isViewTransitionApiSupported(): boolean {
  return typeof document.startViewTransition === 'function';
}

export function isViewTransitionsEnabled(): boolean {
  return siteConfig.future.experimental_viewTransitions === true;
}

/**
 * Maps React Router history actions to View Transition types.
 * Sites can target these types in CSS via `:active-view-transition-type()`.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition/types
 */
export function getViewTransitionTypes(action: Action): string[] {
  switch (action) {
    case 'POP':
      return ['navigate', 'navigate-pop'];
    case 'REPLACE':
      return ['navigate', 'navigate-replace'];
    case 'PUSH':
    default:
      return ['navigate', 'navigate-push'];
  }
}

/**
 * Returns whether a view transition should run for this navigation.
 * Only cross-pathname navigations are animated; hash/search-only updates are
 * skipped to avoid jarring micro-animations on in-page anchor jumps.
 */
export function shouldAnimateRouteTransition({
  previousLocation,
  nextLocation,
}: {
  previousLocation: Location | null;
  nextLocation: Location;
}): boolean {
  if (!ExecutionEnvironment.canUseDOM) {
    return false;
  }
  if (!isViewTransitionsEnabled()) {
    return false;
  }
  if (!previousLocation) {
    return false;
  }
  if (!isViewTransitionApiSupported()) {
    return false;
  }
  if (prefersReducedMotion()) {
    return false;
  }
  return previousLocation.pathname !== nextLocation.pathname;
}

function ensureViewTransitionStylesLoaded(): void {
  if (!viewTransitionStylesLoaded) {
    viewTransitionStylesLoaded = true;
    void import('./viewTransition.css');
  }
}

function skipActiveViewTransition(): void {
  if (!activeViewTransition) {
    return;
  }
  try {
    activeViewTransition.skipTransition();
  } catch {
    // The transition may already be finished or skipped.
  }
  activeViewTransition = null;
}

function startSpaViewTransition(
  updateDom: () => void,
  types: string[],
): ViewTransition {
  const runUpdate = () => {
    flushSync(updateDom);
  };

  if (types.length > 0) {
    try {
      return document.startViewTransition({
        update: runUpdate,
        types,
      });
    } catch {
      // Some browsers only support the callback form of startViewTransition().
    }
  }

  return document.startViewTransition(runUpdate);
}

/**
 * Runs a DOM update inside a View Transition when supported and enabled.
 * Falls back to a regular update when view transitions are unavailable.
 *
 * If a transition is already running (e.g. rapid consecutive navigations), the
 * previous transition is skipped via `ViewTransition.skipTransition()`.
 */
export function runRouteUpdateWithViewTransition(
  updateDom: () => void,
  {
    previousLocation,
    nextLocation,
    navigationAction,
  }: {
    previousLocation: Location | null;
    nextLocation: Location;
    navigationAction: Action;
  },
): void {
  if (!shouldAnimateRouteTransition({previousLocation, nextLocation})) {
    skipActiveViewTransition();
    updateDom();
    return;
  }

  ensureViewTransitionStylesLoaded();
  skipActiveViewTransition();

  const types = getViewTransitionTypes(navigationAction);
  const transition = startSpaViewTransition(updateDom, types);
  activeViewTransition = transition;

  void transition.finished.finally(() => {
    if (activeViewTransition === transition) {
      activeViewTransition = null;
    }
  });
}

/** @internal Test helper */
export function resetViewTransitionStateForTesting(): void {
  activeViewTransition = null;
  viewTransitionStylesLoaded = false;
}
