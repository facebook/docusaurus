/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useRef} from 'react';

import {NavLink, Link as RRLink} from 'react-router-dom';
import isInternalUrl from './isInternalUrl';
import ExecutionEnvironment from './ExecutionEnvironment';

declare global {
  interface Window {
    docusaurus: any;
  }
}

interface Props {
  readonly isNavLink?: boolean;
  readonly to?: string;
  readonly href: string;
}

function Link({isNavLink, ...props}: Props) {
  const {to, href} = props;
  const targetLink = to || href;
  const isInternal = isInternalUrl(targetLink);
  const preloaded = useRef(false);
  const LinkComponent = isNavLink ? NavLink : RRLink;

  const IOSupported = ExecutionEnvironment.canUseIntersectionObserver;

  let io;
  const handleIntersection = (el, cb) => {
    io = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (el === entry.target) {
          // If element is in viewport, stop listening/observing and run callback.
          // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            io.unobserve(el);
            io.disconnect();
            cb();
          }
        }
      });
    });

    // Add element to the observer.
    io.observe(el);
  };

  const handleRef = (ref) => {
    if (IOSupported && ref && isInternal) {
      // If IO supported and element reference found, setup Observer functionality.
      handleIntersection(ref, () => {
        window.docusaurus.prefetch(targetLink);
      });
    }
  };

  const onMouseEnter = () => {
    if (!preloaded.current) {
      window.docusaurus.preload(targetLink);
      preloaded.current = true;
    }
  };

  useEffect(() => {
    // If IO is not supported. We prefetch by default (only once).
    if (!IOSupported && isInternal) {
      window.docusaurus.prefetch(targetLink);
    }

    // When unmounting, stop intersection observer from watching.
    return () => {
      if (IOSupported && io) {
        io.disconnect();
      }
    };
  }, [targetLink, IOSupported, isInternal]);

  return !targetLink || !isInternal || targetLink.startsWith('#') ? (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      href={targetLink}
      {...(!isInternal && {target: '_blank', rel: 'noopener noreferrer'})}
      {...props}
    />
  ) : (
    <LinkComponent
      {...props}
      onMouseEnter={onMouseEnter}
      innerRef={handleRef}
      to={targetLink}
    />
  );
}

export default Link;
