/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useRef, useState} from 'react';
import {useScrollPosition, useSmoothScrollTo} from '../utils/scrollUtils';
import {useLocationChange} from '../utils/useLocationChange';

/** Wires the logic for the back to top button. */
export function useBackToTopButton({
  threshold,
}: {
  /**
   * The minimum vertical scroll position, above which a scroll-up would not
   * cause `shown` to become `true`. This is because BTT is only useful if the
   * user is far down the page.
   */
  threshold: number;
}): {
  /**
   * Whether the button should be displayed. We only show if the user has
   * scrolled up and is on a vertical position greater than `threshold`.
   */
  shown: boolean;
  /**
   * A (memoized) handle for starting the scroll, which you can directly plug
   * into the props.
   */
  scrollToTop: () => void;
} {
  const [shown, setShown] = useState(false);
  const isFocusedAnchor = useRef(false);
  const {startScroll, cancelScroll} = useSmoothScrollTo();

  useScrollPosition(({scrollY: scrollTop}, lastPosition) => {
    const lastScrollTop = lastPosition?.scrollY;
    // Component is just being mounted. Not really a scroll event from the user.
    // Ignore it.
    if (!lastScrollTop) {
      return;
    }
    if (isFocusedAnchor.current) {
      // This scroll position change is triggered by navigating to an anchor.
      // Ignore it.
      isFocusedAnchor.current = false;
    } else if (scrollTop >= lastScrollTop) {
      // The user has scrolled down to "fight against" the animation. Cancel any
      // animation under progress.
      cancelScroll();
      setShown(false);
    } else if (scrollTop < threshold) {
      // Scrolled to the minimum position; hide the button.
      setShown(false);
    } else if (
      scrollTop + window.innerHeight <
      document.documentElement.scrollHeight
    ) {
      setShown(true);
    }
  });

  useLocationChange((locationChangeEvent) => {
    if (locationChangeEvent.location.hash) {
      isFocusedAnchor.current = true;
      setShown(false);
    }
  });

  return {shown, scrollToTop: () => startScroll(0)};
}
