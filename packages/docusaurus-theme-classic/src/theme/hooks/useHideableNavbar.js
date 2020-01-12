/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useEffect} from 'react';

const useHideableNavbar = hideOnScroll => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useCallback(node => {
    if (node !== null) {
      setNavbarHeight(node.getBoundingClientRect().height);
    }
  }, []);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop < navbarHeight) {
      return;
    }

    const focusedElement = document.activeElement;

    if (focusedElement && /^#/.test(window.location.hash)) {
      setIsNavbarVisible(false);
      focusedElement.blur();
      return;
    }

    const documentHeight = document.documentElement.scrollHeight - navbarHeight;
    const windowHeight = window.innerHeight;

    if (lastScrollTop && scrollTop > lastScrollTop) {
      setIsNavbarVisible(false);
    } else if (scrollTop + windowHeight < documentHeight) {
      setIsNavbarVisible(true);
    }

    setLastScrollTop(scrollTop);
  };

  useEffect(() => {
    if (!hideOnScroll) {
      return undefined;
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop, navbarHeight]);

  return {
    navbarRef,
    isNavbarVisible,
  };
};

export default useHideableNavbar;
