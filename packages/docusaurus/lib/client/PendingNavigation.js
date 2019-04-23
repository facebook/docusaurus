/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {Route, withRouter} from 'react-router-dom';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import preload from './preload';

nprogress.configure({showSpinner: false});

class PendingNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.progressBarTimeout = null;
    this.state = {
      previousLocation: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const navigated = nextProps.location !== this.props.location;
    const {routes, delay = 1000} = this.props;

    if (navigated) {
      window.scrollTo(0, 0);

      this.startProgressBar(delay);
      // save the location so we can render the old screen
      this.setState({
        previousLocation: this.props.location,
      });

      // load data while the old screen remains
      preload(routes, nextProps.location.pathname)
        .then(() => {
          this.setState(
            {
              previousLocation: null,
            },
            this.stopProgressBar,
          );
        })
        .catch(e => console.warn(e));
    }
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
      nprogress.start();
    }, delay);
  }

  stopProgressBar() {
    this.clearProgressBarTimeout();
    nprogress.done();
  }

  render() {
    const {children, location} = this.props;
    const {previousLocation} = this.state;

    // use a controlled <Route> to trick all descendants into
    // rendering the old location
    return (
      <Route location={previousLocation || location} render={() => children} />
    );
  }
}

export default withRouter(PendingNavigation);
