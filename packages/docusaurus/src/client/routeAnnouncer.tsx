/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import {useLocation} from 'react-router-dom';

export function RouteAnnouncer() {
  const {pathname} = useLocation();
  const [routeAnnouncement, setRouteAnnouncement] = React.useState('');

  // Only announce the path change, but not for the first load because screen
  // reader will do that automatically.
  const previouslyLoadedPath = React.useRef(pathname);

  // Every time the path changes, announce the new page’s title following this
  // priority: first the document title (from head), otherwise the first h1, or
  // if none of these exist, then the pathname from the URL. This methodology is
  // inspired by Marcy Sutton’s accessible client routing user testing. More
  // information can be found here:
  // https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
  React.useEffect(
    () => {
      // If the path hasn't change, we do nothing.
      if (previouslyLoadedPath.current === pathname) {
        return;
      }
      previouslyLoadedPath.current = pathname;

      if (document.title) {
        setTimeout(() => {
          setRouteAnnouncement(document.title);
        }, 50);
      } else {
        const pageHeader = document.querySelector('h1');
        const content = pageHeader?.innerText ?? pageHeader?.textContent;
        setTimeout(() => {
          setRouteAnnouncement(content || pathname);
        }, 50);
      }
    },
    // TODO: switch to pathname + query object of dynamic route requirements
    [pathname],
  );

  return (
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
  );
}

export default RouteAnnouncer;
