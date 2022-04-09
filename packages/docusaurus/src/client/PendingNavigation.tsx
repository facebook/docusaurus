/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {Route} from 'react-router-dom';
import nprogress from 'nprogress';

import clientLifecyclesDispatcher from './clientLifecyclesDispatcher';
import preload from './preload';
import type {Location} from 'history';

import './nprogress.css';

nprogress.configure({showSpinner: false});

type Props = {
  readonly delay: number;
  readonly location: Location;
  readonly children: JSX.Element;
};
type State = {
  nextRouteHasLoaded: boolean;
};

class PendingNavigation extends React.Component<Props, State> {
  private previousLocation: Location | null;
  private progressBarTimeout: number | null;

  constructor(props: Props) {
    super(props);

    // previousLocation doesn't affect rendering, hence not stored in state.
    this.previousLocation = null;
    this.progressBarTimeout = null;
    this.state = {
      nextRouteHasLoaded: true,
    };
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
    this.startProgressBar(this.props.delay);

    // Load data while the old screen remains.
    preload(nextLocation.pathname)
      .then(() => {
        clientLifecyclesDispatcher.onRouteUpdate({
          previousLocation: this.previousLocation,
          location: nextLocation,
        });
        this.setState({nextRouteHasLoaded: true}, this.stopProgressBar);
        const {hash} = nextLocation;
        if (!hash) {
          window.scrollTo(0, 0);
        } else {
          const id = decodeURIComponent(hash.substring(1));
          const element = document.getElementById(id);
          element?.scrollIntoView();
        }
      })
      .catch((e) => console.warn(e));
    return false;
  }

  private clearProgressBarTimeout() {
    if (this.progressBarTimeout) {
      window.clearTimeout(this.progressBarTimeout);
      this.progressBarTimeout = null;
    }
  }

  private startProgressBar(delay: number) {
    this.clearProgressBarTimeout();
    this.progressBarTimeout = window.setTimeout(() => {
      clientLifecyclesDispatcher.onRouteUpdateDelayed({
        location: this.props.location,
      });
      nprogress.start();
    }, delay);
  }

  private stopProgressBar() {
    this.clearProgressBarTimeout();
    nprogress.done();
  }

  override render(): JSX.Element {
    const {children, location} = this.props;
    // Use a controlled <Route> to trick all descendants into rendering the old
    // location.
    return <Route location={location} render={() => children} />;
  }
}

export default PendingNavigation;
