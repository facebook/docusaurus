/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useRef, useState} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';

import styles from './styles.module.css';
import {
  ThemeClassNames,
  useScrollPosition,
  useLocationChange,
} from '@docusaurus/theme-common';

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
  const [show, setShow] = useState(false);
  const isFocusedAnchor = useRef(false);
  const {smoothScrollTop, cancelScrollToTop} = useSmoothScrollToTop();

  useScrollPosition(({scrollY: scrollTop}, lastPosition) => {
    const lastScrollTop = lastPosition?.scrollY;

    // No lastScrollTop means component is just being mounted.
    // Not really a scroll event from the user, so we ignore it
    if (!lastScrollTop) {
      return;
    }

    if (isFocusedAnchor.current) {
      isFocusedAnchor.current = false;
      return;
    }

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
  });

  useLocationChange((locationChangeEvent) => {
    if (locationChangeEvent.location.hash) {
      isFocusedAnchor.current = true;
      setShow(false);
    }
  });

  return (
    <button
      aria-label={translate({
        id: 'theme.BackToTopButton.buttonAriaLabel',
        message: 'Scroll back to top',
        description: 'The ARIA label for the back to top button',
      })}
      className={clsx(
        'clean-btn',
        ThemeClassNames.common.backToTopButton,
        styles.backToTopButton,
        {
          [styles.backToTopButtonShow]: show,
        },
      )}
      type="button"
      onClick={() => smoothScrollTop()}
    />
  );
}

export default BackToTopButton;
