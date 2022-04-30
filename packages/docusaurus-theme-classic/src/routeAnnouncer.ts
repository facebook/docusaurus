/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {translate} from '@docusaurus/Translate';
import type {ClientModule} from '@docusaurus/types';
import './routeAnnouncer.css';

const clientModule: ClientModule = {
  onRouteDidUpdate({location, previousLocation}) {
    if (!previousLocation || location.pathname === previousLocation.pathname) {
      return undefined;
    }
    const announcerContainer = document.createElement(
      'docusaurus-route-announcer',
    );
    const announcement = document.createElement('p');
    Object.assign(announcement, {
      ariaLive: 'assertive', // Make the announcement immediately.
      id: 'docusaurus-route-announcer-content',
      role: 'alert',
    });
    const firstHeading = document.querySelectorAll(`#__docusaurus h1`)[0];
    const pageName = firstHeading?.textContent ?? document.title;
    announcement.innerText = translate(
      {
        message: 'Navigated to {pageName}',
        id: 'theme.RouteAnnouncer.content',
        description:
          'The text announced by screen reader when the user has navigated to a new page',
      },
      {pageName},
    );
    announcerContainer.appendChild(announcement);
    document.body.appendChild(announcerContainer);
    return () => document.body.removeChild(announcerContainer);
  },
};

export default clientModule;
