/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {withRouter} from 'react-router-dom';
import {Portal} from './exports/Portal';
import type {RouteComponentProps} from 'react-router-dom';

/* eslint-disable @typescript-eslint/ban-ts-comment */

class RouteAnnouncerWrapper extends React.Component {
  constructor({
    children,
    location,
  }: {
    children: React.ReactNode;
  } & RouteComponentProps) {
    super({children, location});
    this.state = {
      routeAnnouncement: '',
    };
  }

  override componentDidUpdate(): void {
    // @ts-ignore
    const {pathname} = this.props.location; // @ts-ignore
    const {routeAnnouncement} = this.state;

    requestAnimationFrame(() => {
      let pageName = `new page at ${pathname}`;
      if (document.title) {
        pageName = document.title;
      }
      const pageHeadings = document.querySelectorAll(`#__docusaurus h1`);
      if (pageHeadings?.length) {
        pageName = (pageHeadings[0] as Node).textContent as string;
      }
      const newAnnouncement = `Navigated to ${pageName}`;
      if (routeAnnouncement) {
        const oldAnnouncement = routeAnnouncement;
        if (!Object.is(oldAnnouncement, newAnnouncement)) {
          this.setState({
            routeAnnouncement: newAnnouncement,
          });
        }
      }
    });
  }

  override render() {
    const {children} = this.props; // @ts-ignore
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

// @ts-ignore
export default withRouter(RouteAnnouncerWrapper);
