/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useRef, useEffect} from 'react';
import {useLocation} from 'react-router-dom';

export default function RouteAnnouncer(): JSX.Element {
  const {pathname} = useLocation();
  const [routeAnnouncement, setRouteAnnouncement] = useState('');

  // Only announce the path change, but not for the first load because screen
  // reader will do that automatically.
  const previouslyLoadedPath = useRef(pathname);

  // Every time the path changes, announce the new page’s title following this
  // priority: first the document title (from head), otherwise the first h1, or
  // if none of these exist, then the pathname from the URL. This methodology is
  // inspired by Marcy Sutton’s accessible client routing user testing. More
  // information can be found here:
  // https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
  useEffect(() => {
    // If the path hasn't change, we do nothing.
    if (previouslyLoadedPath.current === pathname) {
      return undefined;
    }
    previouslyLoadedPath.current = pathname;

    const pageHeader = document.querySelector('h1');
    const content = pageHeader?.innerText ?? pageHeader?.textContent;

    // NOTE: when setTimeout isn't used it will keep the previous page's title,
    // which may be annoying to some screen-reader users (in my testing).
    // Similar issue regarding this is https://github.com/vercel/next.js/issues/32610
    const timeout = window.setTimeout(() => {
      setRouteAnnouncement(document.title ?? content ?? pathname);
    }, 50);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

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
