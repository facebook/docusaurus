/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useEffect} from 'react';
import {useLocation} from '@docusaurus/router';
import useLocationHash from '@theme/hooks/useLocationHash';

const useHideableNavbar = hideOnScroll => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isFocusedAnchor, setIsFocusedAnchor] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useCallback(node => {
    if (node !== null) {
      setNavbarHeight(node.getBoundingClientRect().height);
    }
  }, []);
  const location = useLocation();
  const [hash, setHash] = useLocationHash(location.hash);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop === 0) {
      setIsNavbarVisible(true);
    }

    if (scrollTop < navbarHeight) {
      return;
    }

    if (isFocusedAnchor) {
      setIsFocusedAnchor(false);
      setIsNavbarVisible(false);
      setLastScrollTop(scrollTop);
      return;
    }

    const documentHeight = document.documentElement.scrollHeight - navbarHeight;
    const windowHeight = window.innerHeight;

    if (lastScrollTop && scrollTop >= lastScrollTop) {
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

  useEffect(() => {
    if (!hideOnScroll) {
      return;
    }

    setIsNavbarVisible(true);
    setHash(location.hash);
  }, [location]);

  useEffect(() => {
    if (!hideOnScroll) {
      return;
    }

    if (!hash) {
      return;
    }

    setIsFocusedAnchor(true);
  }, [hash]);

  return {
    navbarRef,
    isNavbarVisible,
  };
};

export default useHideableNavbar;
