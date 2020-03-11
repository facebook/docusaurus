/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {Route, withRouter} from 'react-router-dom';
import nprogress from 'nprogress';

import clientLifecyclesDispatcher from './client-lifecycles-dispatcher';
import preload from './preload';
import normalizeLocation from './normalizeLocation';

import 'nprogress/nprogress.css';

nprogress.configure({showSpinner: false});

class PendingNavigation extends React.Component {
  constructor(props) {
    super(props);

    // previousLocation doesn't affect rendering, hence not stored in state.
    this.previousLocation = null;
    this.progressBarTimeout = null;
    this.state = {
      location: normalizeLocation(props.location),
      nextRouteHasLoaded: true,
    };
  }

  // Intercept location update and still show current route until next route
  // is done loading.
  shouldComponentUpdate(nextProps, nextState) {
    const routeDidChange = nextProps.location !== this.props.location;
    const {routes, delay = 1000} = this.props;

    // If `routeDidChange` is true, means the router is trying to navigate to a new
    // route. We will preload the new route.
    if (routeDidChange) {
      const nextLocation = normalizeLocation(nextProps.location);
      this.startProgressBar(delay);
      // Save the location first.
      this.previousLocation = this.state.location;
      this.setState({
        location: nextLocation,
        nextRouteHasLoaded: false,
      });

      // Load data while the old screen remains.
      preload(routes, nextLocation.pathname)
        .then(() => {
          clientLifecyclesDispatcher.onRouteUpdate({
            previousLocation: this.previousLocation,
            location: nextLocation,
          });
          // Route has loaded, we can reset previousLocation.
          this.previousLocation = null;
          this.setState(
            {
              nextRouteHasLoaded: true,
            },
            this.stopProgressBar,
          );
          const {hash} = nextLocation;
          if (!hash) {
            window.scrollTo(0, 0);
          } else {
            const id = hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView();
            }
          }
        })
        .catch(e => console.warn(e));
      return false;
    }

    // There's a pending route transition. Don't update until it's done.
    if (!nextState.nextRouteHasLoaded) {
      return false;
    }

    // Route has loaded, we can update now.
    return true;
  }

  clearProgressBarTimeout() {
    if (this.progressBarTimeout) {
      clearTimeout(this.progressBarTimeout);
      this.progressBarTimeout = null;
    }
  }

  startProgressBar(delay) {
    this.clearProgressBarTimeout();
    this.progressBarTimeout = setTimeout(() => {
      clientLifecyclesDispatcher.onRouteUpdateDelayed({
        location: this.state.location,
      });
      nprogress.start();
    }, delay);
  }

  stopProgressBar() {
    this.clearProgressBarTimeout();
    nprogress.done();
  }

  render() {
    const {children} = this.props;
    const {location} = this.state;
    return <Route location={location} render={() => children} />;
  }
}

export default withRouter(PendingNavigation);
