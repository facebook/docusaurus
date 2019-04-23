/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import {Route, withRouter} from 'react-router-dom';
import preload from './preload';

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

// wrap in withRouter
export default withRouter(PendingNavigation);
