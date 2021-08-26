/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useRef, useState} from 'react';
import clsx from 'clsx';
import {useLocation} from '@docusaurus/router';
import useScrollPosition from '@theme/hooks/useScrollPosition';

import styles from './styles.module.css';

const threshold = 300;

// Not all have support for smooth scrolling (particularly Safari mobile iOS)
// TODO proper detection is currently unreliable!
// see https://github.com/wessberg/scroll-behavior-polyfill/issues/16
const SupportsNativeSmoothScrolling = false;
// const SupportsNativeSmoothScrolling = ExecutionEnvironment.canUseDOM && 'scrollBehavior' in document.documentElement.style;

type CancelScrollTop = () => void;

function smoothScrollTopNative(): CancelScrollTop {
  window.scrollTo({top: 0, behavior: 'smooth'});
  return () => {
    // Nothing to cancel, it's natively cancelled if user tries to scroll down
  };
}

function smoothScrollTopPolyfill(): CancelScrollTop {
  let raf: number | null = null;
  function rafRecursion() {
    const currentScroll = document.documentElement.scrollTop;
    if (currentScroll > 0) {
      raf = requestAnimationFrame(rafRecursion);
      window.scrollTo(0, Math.floor(currentScroll * 0.85));
    }
  }
  rafRecursion();

  // Break the recursion
  // Prevents the user from "fighting" against that recursion producing a weird UX
  return () => raf && cancelAnimationFrame(raf);
}

type UseSmoothScrollTopReturn = {
  // We use a cancel function because the non-native smooth scroll-top implementation must be interrupted if user scroll down
  smoothScrollTop: () => void;
  cancelScrollToTop: CancelScrollTop;
};

function useSmoothScrollToTop(): UseSmoothScrollTopReturn {
  const lastCancelRef = useRef<CancelScrollTop | null>(null);

  function smoothScrollTop(): void {
    lastCancelRef.current = SupportsNativeSmoothScrolling
      ? smoothScrollTopNative()
      : smoothScrollTopPolyfill();
  }

  return {
    smoothScrollTop,
    cancelScrollToTop: () => lastCancelRef.current?.(),
  };
}

function BackToTopButton(): JSX.Element {
  const location = useLocation();
  const {smoothScrollTop, cancelScrollToTop} = useSmoothScrollToTop();
  const [show, setShow] = useState(false);

  useScrollPosition(
    ({scrollY: scrollTop}, lastPosition) => {
      // No lastPosition means component is just being mounted.
      // Not really a scroll event from the user, so we ignore it
      if (!lastPosition) {
        return;
      }
      const lastScrollTop = lastPosition.scrollY;

      const isScrollingUp = scrollTop < lastScrollTop;

      if (!isScrollingUp) {
        cancelScrollToTop();
      }

      if (scrollTop < threshold) {
        setShow(false);
        return;
      }

      if (isScrollingUp) {
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        if (scrollTop + windowHeight < documentHeight) {
          setShow(true);
        }
      } else {
        setShow(false);
      }
    },
    [location],
  );

  return (
    <button
      className={clsx('clean-btn', styles.backToTopButton, {
        [styles.backToTopButtonShow]: show,
      })}
      type="button"
      onClick={() => smoothScrollTop()}>
      <svg viewBox="0 0 24 24" width="28">
        <path
          d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}

export default BackToTopButton;
