/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useEffect, useRef} from 'react';

const useAnnouncementBar = () => {
  const [announcementBarHeight, setAnnouncementBarHeight] = useState(null);
  const navbarRef = useRef();
  const mainWrapperRef = useRef();
  const announcementBarRef = useCallback(
    announcementBar => {
      const measuredAnnouncementBarHeight = announcementBar
        ? announcementBar.getBoundingClientRect().height
        : 0;

      setAnnouncementBarHeight(measuredAnnouncementBarHeight);
    },
    [mainWrapperRef],
  );

  const handleScroll = useCallback(() => {
    const scrollTop =
      document.body.scrollTop || document.documentElement.scrollTop;
    const isAtTop = scrollTop <= announcementBarHeight;
    navbarRef.current.style.marginTop = isAtTop
      ? `${announcementBarHeight}px`
      : null;
  }, [announcementBarHeight]);

  useEffect(() => {
    if (announcementBarHeight === null) {
      return undefined;
    }

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [announcementBarHeight]);

  useEffect(() => {
    if (announcementBarHeight === null) {
      return;
    }

    mainWrapperRef.current.setAttribute(
      'style',
      `padding-top: ${announcementBarHeight}px`,
    );

    if (!announcementBarHeight) {
      navbarRef.current.removeAttribute('style');
    }
  }, [announcementBarHeight]);

  return {
    announcementBarRef,
    navbarRef,
    mainWrapperRef,
  };
};

export default useAnnouncementBar;
