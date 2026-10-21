/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ViewTransition, type ReactNode} from 'react';
import {Route} from 'react-router-dom';
import siteConfig from '@generated/docusaurus.config';
import ClientLifecyclesDispatcher, {
  dispatchLifecycleAction,
} from './ClientLifecyclesDispatcher';
import ExecutionEnvironment from './exports/ExecutionEnvironment';
import preload from './preload';
import type {Location} from 'history';
import './viewTransition.css';

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

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
  if (!previousLocation) {
    return false;
  }
  if (prefersReducedMotion()) {
    return false;
  }
  return previousLocation.pathname !== nextLocation.pathname;
}

type Props = {
  readonly location: Location;
  readonly children: ReactNode;
  readonly viewTransitions?: boolean;
};
type State = {
  nextRouteHasLoaded: boolean;
};

class PendingNavigation extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    viewTransitions: undefined,
  };

  private previousLocation: Location | null;
  private routeUpdateCleanupCb: () => void;

  constructor(props: Props) {
    super(props);

    // previousLocation doesn't affect rendering, hence not stored in state.
    this.previousLocation = null;
    this.routeUpdateCleanupCb = ExecutionEnvironment.canUseDOM
      ? dispatchLifecycleAction('onRouteUpdate', {
          previousLocation: null,
          location: this.props.location,
        })
      : () => {};
    this.state = {
      nextRouteHasLoaded: true,
    };
  }

  private isViewTransitionsEnabled(): boolean {
    if (typeof this.props.viewTransitions === 'boolean') {
      return this.props.viewTransitions;
    }
    return Boolean(siteConfig?.future?.experimental_viewTransitions);
  }

  // Intercept location update and still show current route until next route
  // is done loading.
  override shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    if (nextProps.location === this.props.location) {
      // `nextRouteHasLoaded` is false means there's a pending route transition.
      // Don't update until it's done.
      return nextState.nextRouteHasLoaded;
    }

    // props.location being different means the router is trying to navigate to
    // a new route. We will preload the new route.
    const nextLocation = nextProps.location;
    // Save the location first.
    this.previousLocation = this.props.location;
    this.setState({nextRouteHasLoaded: false});
    this.routeUpdateCleanupCb = dispatchLifecycleAction('onRouteUpdate', {
      previousLocation: this.previousLocation,
      location: nextLocation,
    });

    // Load data while the old screen remains. Force preload instead of using
    // `window.docusaurus`, because we want to avoid loading screen even when
    // user is on saveData
    preload(nextLocation.pathname)
      .then(() => {
        this.routeUpdateCleanupCb();
        const shouldAnimate =
          this.isViewTransitionsEnabled() &&
          shouldAnimateRouteTransition({
            previousLocation: this.previousLocation,
            nextLocation,
          });

        if (shouldAnimate) {
          React.startTransition(() => {
            this.setState({nextRouteHasLoaded: true});
          });
        } else {
          this.setState({nextRouteHasLoaded: true});
        }
      })
      .catch((e: unknown) => {
        console.warn(e);
        // If chunk loading failed, it could be because the path to a chunk
        // no longer exists due to a new deployment. Force refresh the page
        // instead of just not navigating.
        window.location.reload();
      });
    return false;
  }

  override render(): ReactNode {
    const {children, location} = this.props;
    // Use a controlled <Route> to trick all descendants into rendering the old
    // location.
    const route = <Route location={location} render={() => children} />;

    return (
      <ClientLifecyclesDispatcher
        previousLocation={this.previousLocation}
        location={location}>
        {this.isViewTransitionsEnabled() ? (
          <ViewTransition>{route}</ViewTransition>
        ) : (
          route
        )}
      </ClientLifecyclesDispatcher>
    );
  }
}

export default PendingNavigation;
