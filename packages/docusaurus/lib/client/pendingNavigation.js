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

let progressBarTimeout = null;

const clearProgressBarTimeout = () => {
  if (progressBarTimeout) {
    clearTimeout(progressBarTimeout);
    progressBarTimeout = null;
  }
};

const startProgressBar = delay => {
  clearProgressBarTimeout();
  progressBarTimeout = setTimeout(() => {
    nprogress.start();
  }, delay);
};

const stopProgressBar = () => {
  clearProgressBarTimeout();
  nprogress.done();
};

class PendingNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      previousLocation: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const navigated = nextProps.location !== this.props.location;
    const {routes} = this.props;

    if (navigated) {
      window.scrollTo(0, 0);

      // Only show the loading bar if it has passed 1 second
      // see https://www.nngroup.com/articles/response-times-3-important-limits/
      startProgressBar(1000);
      // save the location so we can render the old screen
      this.setState({
        previousLocation: this.props.location,
      });

      // load data while the old screen remains
      preload(routes, nextProps.location.pathname)
        .then(() => {
          this.setState({
            previousLocation: null,
          });
          stopProgressBar();
        })
        .catch(e => console.log(e));
    }
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
