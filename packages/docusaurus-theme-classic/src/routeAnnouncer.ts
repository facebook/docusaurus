/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ClientModule} from '@docusaurus/types';

const clientModule: ClientModule = {
  onRouteDidUpdate({location, previousLocation}) {
    if (!previousLocation || location.pathname !== previousLocation.pathname) {
      return;
    }
    const announcerContainer = document.createElement(
      'docusaurus-route-announcer',
    );
    const announcement = document.createElement('p');
    Object.assign(announcement, {
      'aria-live': 'assertive', // Make the announcement immediately.
      id: '__docusaurus-route-announcer__',
      role: 'alert',
      style: {
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
      },
    });
    const firstHeading = document.querySelectorAll(`#__docusaurus h1`)[0];
    const pageName = firstHeading?.textContent ?? document.title;
    announcement.innerText = `Navigated to ${pageName}`;
    announcerContainer.appendChild(announcement);
    document.body.appendChild(announcerContainer);
  },
};

export default clientModule;
