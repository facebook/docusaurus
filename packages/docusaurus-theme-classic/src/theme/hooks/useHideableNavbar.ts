/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useRef} from 'react';
import {useLocationChange, useScrollPosition} from '@docusaurus/theme-common';
import type {useHideableNavbarReturns} from '@theme/hooks/useHideableNavbar';

const useHideableNavbar = (hideOnScroll: boolean): useHideableNavbarReturns => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(hideOnScroll);
  const isFocusedAnchor = useRef(false);
  const navbarHeight = useRef(0);
  const navbarRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      navbarHeight.current = node.getBoundingClientRect().height;
    }
  }, []);

  useScrollPosition((currentPosition, lastPosition) => {
    if (!hideOnScroll) {
      return;
    }

    const scrollTop = currentPosition.scrollY;

    // It needed for mostly to handle rubber band scrolling
    if (scrollTop < navbarHeight.current) {
      setIsNavbarVisible(true);
      return;
    }

    if (isFocusedAnchor.current) {
      isFocusedAnchor.current = false;
      return;
    }

    const lastScrollTop = lastPosition?.scrollY;
    const documentHeight =
      document.documentElement.scrollHeight - navbarHeight.current;
    const windowHeight = window.innerHeight;

    if (lastScrollTop && scrollTop >= lastScrollTop) {
      setIsNavbarVisible(false);
    } else if (scrollTop + windowHeight < documentHeight) {
      setIsNavbarVisible(true);
    }
  });

  useLocationChange((locationChangeEvent) => {
    if (!hideOnScroll) {
      return;
    }

    if (locationChangeEvent.location.hash) {
      isFocusedAnchor.current = true;
      setIsNavbarVisible(false);
      return;
    }

    setIsNavbarVisible(true);
  });

  return {
    navbarRef,
    isNavbarVisible,
  };
};

export default useHideableNavbar;
