/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {Route} from 'react-router-dom';
import ClientLifecyclesDispatcher from './ClientLifecyclesDispatcher';
import preload from './preload';
import type {Location} from 'history';
import type {ClientModule} from '@docusaurus/types';

type Props = {
  readonly location: Location;
  readonly children: JSX.Element;
};
type State = {
  nextRouteHasLoaded: boolean;
};

class PendingNavigation extends React.Component<Props, State> {
  private previousLocation: Location | null;
  private previousRouteUpdateCallback: (() => void) | null;
  private clientLifecyclesDispatcher: React.RefObject<Required<ClientModule>>;

  constructor(props: Props) {
    super(props);

    // previousLocation doesn't affect rendering, hence not stored in state.
    this.previousLocation = null;
    this.previousRouteUpdateCallback = null;
    this.clientLifecyclesDispatcher = React.createRef();
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
    this.previousRouteUpdateCallback =
      this.clientLifecyclesDispatcher.current?.onRouteUpdate({
        previousLocation: this.previousLocation,
        location: nextLocation,
      }) || null;

    // Load data while the old screen remains.
    preload(nextLocation.pathname)
      .then(() => this.setState({nextRouteHasLoaded: true}))
      .catch((e) => console.warn(e));
    return false;
  }

  override render(): JSX.Element {
    const {children, location} = this.props;
    this.previousRouteUpdateCallback?.();
    // Use a controlled <Route> to trick all descendants into rendering the old
    // location.
    return (
      <ClientLifecyclesDispatcher
        ref={this.clientLifecyclesDispatcher}
        previousLocation={this.previousLocation}
        location={location}>
        <Route location={location} render={() => children} />
      </ClientLifecyclesDispatcher>
    );
  }
}

export default PendingNavigation;
