/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useEffect, useRef} from 'react';
import {useLocation} from '@docusaurus/router';
import useScrollPosition from '@theme/hooks/useScrollPosition';
import type {useHideableNavbarReturns} from '@theme/hooks/useHideableNavbar';

const useHideableNavbar = (hideOnScroll: boolean): useHideableNavbarReturns => {
  const location = useLocation();
  const [isNavbarVisible, setIsNavbarVisible] = useState(!hideOnScroll);
  const isFocusedAnchor = useRef(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setNavbarHeight(node.getBoundingClientRect().height);
    }
  }, []);

  useScrollPosition(
    ({scrollY: scrollTop}) => {
      if (!hideOnScroll) {
        return;
      }

      if (scrollTop < navbarHeight) {
        return;
      }

      if (isFocusedAnchor.current) {
        isFocusedAnchor.current = false;
        setIsNavbarVisible(false);
        setLastScrollTop(scrollTop);
        return;
      }

      if (lastScrollTop && scrollTop === 0) {
        setIsNavbarVisible(true);
      }

      const documentHeight =
        document.documentElement.scrollHeight - navbarHeight;
      const windowHeight = window.innerHeight;

      if (lastScrollTop && scrollTop >= lastScrollTop) {
        setIsNavbarVisible(false);
      } else if (scrollTop + windowHeight < documentHeight) {
        setIsNavbarVisible(true);
      }

      setLastScrollTop(scrollTop);
    },
    [lastScrollTop, navbarHeight, isFocusedAnchor],
  );

  useEffect(() => {
    if (!hideOnScroll) {
      return;
    }

    if (!lastScrollTop) {
      return;
    }

    setIsNavbarVisible(true);
  }, [location.pathname]);

  useEffect(() => {
    if (!hideOnScroll) {
      return;
    }

    isFocusedAnchor.current = true;
  }, [location.hash]);

  return {
    navbarRef,
    isNavbarVisible,
  };
};

export default useHideableNavbar;
