/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useRef, useEffect} from 'react';
import {useLocationChange, useScrollPosition} from '@docusaurus/theme-common';
import type {useHideableNavbarReturns} from '@theme/hooks/useHideableNavbar';

const useHideableNavbar = (hideOnScroll: boolean): useHideableNavbarReturns => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(hideOnScroll);
  // const [isFocusedAnchor, setIsFocusedAnchor] = useState(false);
  const isFocusedAnchor = useRef(false);
  const navbarHeight = useRef(0);
  const navbarRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      navbarHeight.current = node.getBoundingClientRect().height;
    }
  }, []);

  useScrollPosition(
    (currentPosition, lastPosition) => {
      if (!hideOnScroll) {
        return;
      }

      if (isFocusedAnchor.current) {
        console.log('01');
        // setIsFocusedAnchor(false);
        isFocusedAnchor.current = false;
        setIsNavbarVisible(false);
        return;
      }

      console.log('s', isFocusedAnchor.current);

      const scrollTop = currentPosition.scrollY;
      const lastScrollTop = lastPosition?.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - navbarHeight.current;
      const windowHeight = window.innerHeight;

      if (lastScrollTop && scrollTop >= lastScrollTop) {
        setIsNavbarVisible(false);
      } else if (scrollTop + windowHeight < documentHeight) {
        setIsNavbarVisible(true);
      }
    },
    // [isFocusedAnchor],
  );

  // useEffect(() => {
  //   if (!hideOnScroll) {
  //     return;
  //   }

  //   console.log('foc', isFocusedAnchor.current);

  //   if (isFocusedAnchor) {
  //     console.log('0');
  //     // setIsFocusedAnchor(false);
  //     isFocusedAnchor.current = false;
  //     setIsNavbarVisible(false);
  //     return;
  //   }
  // }, [isFocusedAnchor]);

  useLocationChange((locationChangeEvent) => {
    if (!hideOnScroll) {
      return;
    }

    console.log(locationChangeEvent.location.hash);

    if (locationChangeEvent.location.hash) {
      console.log(1);

      // setIsFocusedAnchor(true);
      isFocusedAnchor.current = true;
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
