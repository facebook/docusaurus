/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect} from 'react';
import Perimeter from 'react-perimeter';
import {NavLink} from 'react-router-dom';

const internalRegex = /^\/(?!\/)/;

// Set up IntersectionObserver
const handleIntersection = (el, cb) => {
  const io = new window.IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (el === entry.target) {
        // Check if element is within viewport, remove listener, destroy observer, and run link callback.
        // MSEdge doesn't currently support isIntersecting, so also test for  an intersectionRatio > 0
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          io.unobserve(el);
          io.disconnect();
          cb();
        }
      }
    });
  });
  // Add element to the observer
  io.observe(el);
};

function Link(props) {
  const {to, href, preloadProximity = 20} = props;
  const targetLink = to || href;
  const isInternal = internalRegex.test(targetLink);

  const IOSupported =
    typeof window !== 'undefined' && 'IntersectionObserver' in window;

  const handleRef = ref => {
    if (IOSupported && ref) {
      // If IO supported and element reference found, setup Observer functionality
      handleIntersection(ref, () => {
        if (isInternal) {
          window.__docusaurus.prefetch(targetLink);
        }
      });
    }
  };

  useEffect(() => {
    // If IO is not supported. We prefetch by default
    if (!IOSupported && isInternal) {
      window.__docusaurus.prefetch(targetLink);
    }
  }, []);

  return !targetLink || !isInternal ? (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a {...props} href={targetLink} />
  ) : (
    <Perimeter
      padding={preloadProximity}
      onBreach={() => window.__docusaurus.preload(targetLink)}
      once>
      <NavLink {...props} innerRef={handleRef} to={targetLink} />
    </Perimeter>
  );
}

export default Link;
