/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useEffect, useRef} from 'react';
import {useLocation} from '@docusaurus/router';
import useLocationHash from '@theme/hooks/useLocationHash';
import useScrollPosition from '@theme/hooks/useScrollPosition';
import type {useHideableNavbarReturns} from '@theme/hooks/useHideableNavbar';

const useHideableNavbar = (hideOnScroll: boolean): useHideableNavbarReturns => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isFocusedAnchor, setIsFocusedAnchor] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const isFocusedAnchor1 = useRef(false);
  const navbarRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setNavbarHeight(node.getBoundingClientRect().height);
    }
  }, []);
  const location = useLocation();
  const [hash, setHash] = useLocationHash(location.hash);

  useScrollPosition(
    ({scrollY: scrollTop}) => {
      if (!hideOnScroll) {
        return;
      }

      console.log(scrollTop, isFocusedAnchor, isFocusedAnchor1);

      if (scrollTop === 0) {
        console.log(11);
        setIsNavbarVisible(true);
      }

      console.log(1);

      if (scrollTop < navbarHeight) {
        console.log(2);
        return;
      }

      if (isFocusedAnchor1.current) {
        console.log(3);
        isFocusedAnchor1.current = false;
        setIsFocusedAnchor(false);
        setIsNavbarVisible(false);
        setLastScrollTop(scrollTop);
        return;
      }

      console.log(4);

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
    [lastScrollTop, navbarHeight, isFocusedAnchor, isFocusedAnchor1],
  );

  useEffect(() => {
    if (!hideOnScroll) {
      return;
    }

    // if (location.hash !== hash) {
    //   console.log(222);
    //   setIsFocusedAnchor(true);
    //   test.current = true;
    // } else {
    setIsNavbarVisible(true);
    // }

    setHash(location.hash);
  }, [location, hash]);

  useEffect(() => {
    if (!hideOnScroll) {
      return;
    }

    console.log(hash);

    if (!hash) {
      return;
    }

    // setIsFocusedAnchor(true);
    isFocusedAnchor1.current = true;
    setIsNavbarVisible(false);
  }, [hash]);

  return {
    navbarRef,
    isNavbarVisible,
  };
};

export default useHideableNavbar;
