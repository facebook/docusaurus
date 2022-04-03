/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {Portal} from './exports/Portal';

type Props = {
  // Force an update on route transition
  location: string;
  children: React.ReactNode;
};

type State = {
  routeAnnouncement: string;
};

class RouteAnnouncerWrapper extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      routeAnnouncement: '',
    };
  }

  override componentDidUpdate(): void {
    const {routeAnnouncement} = this.state;
    const {location} = this.props;

    requestAnimationFrame(() => {
      const firstHeading = document.querySelectorAll(`#__docusaurus h1`)[0];
      const pageName =
        firstHeading?.textContent ??
        document.title ??
        `new page at ${location}`;
      const newAnnouncement = `Navigated to ${pageName}`;
      const oldAnnouncement = routeAnnouncement;
      if (oldAnnouncement !== newAnnouncement) {
        this.setState({
          routeAnnouncement: newAnnouncement,
        });
      }
    });
  }

  override render(): JSX.Element {
    const {children} = this.props;
    const {routeAnnouncement} = this.state;
    return (
      <>
        {children}
        <Portal type="docusaurus-route-announcer">
          <p
            aria-live="assertive" // Make the announcement immediately.
            id="__docusaurus-route-announcer__"
            role="alert"
            style={{
              border: 0,
              clip: 'rect(0 0 0 0)',
              height: '1px',
              margin: '-1px',
              overflow: 'hidden',
              padding: 0,
              position: 'absolute',
              width: '1px',
              // https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
              whiteSpace: 'nowrap',
              wordWrap: 'normal',
            }}>
            {routeAnnouncement}
          </p>
        </Portal>
      </>
    );
  }
}

export default RouteAnnouncerWrapper;
