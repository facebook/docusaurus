/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useRef} from 'react';
import {useEvent} from '../utils/reactUtils';

/**
 * Scroll the docs sidebar to the active item on direct-link navigation.
 *
 * Uses MutationObserver as a bounded retry for lazily-rendered collapsible
 * categories. The observer is stopped after: a successful scroll, a max of 10
 * attempts, a 1000ms timeout, or on cleanup — whichever comes first.
 *
 * @param containerRef - Ref to the sidebar container element.
 * @param activePath - The current sidebar active path.
 * @param enabled - Whether scrolling is currently enabled. The caller passes
 *   whether the sidebar is visible (desktop: always true; mobile: pass
 *   mobileSidebar.shown).
 */
export function useScrollToActiveItem(
  containerRef: React.RefObject<HTMLElement | null>,
  activePath: string,
  enabled: boolean = true,
): void {
  const hasScrolledRef = useRef(false);

  const stableTryScroll = useEvent(() => {
    if (!enabled) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Bail out if the container is not laid out yet.
    // clientHeight is valid even for position:fixed elements, unlike
    // offsetParent which is null for fixed elements on mobile.
    if (container.clientHeight === 0) {
      return false;
    }

    // Find the scrollable menu wrapper
    const menu = container.closest('.menu');
    if (!menu) {
      return false;
    }

    // Prefer [aria-current="page"], fall back to the last active link in
    // document order (deepest nested item selected via querySelectorAll)
    const activeItem: HTMLElement | null =
      (menu.querySelector('[aria-current="page"]') as HTMLElement) ??
      (() => {
        const links = menu.querySelectorAll('.menu__link--active');
        return links[links.length - 1] as HTMLElement | undefined;
      })();

    if (!activeItem) {
      return false;
    }

    // Check that the item is actually laid out
    if (activeItem.clientHeight === 0) {
      return false;
    }

    const itemRect = activeItem.getBoundingClientRect();
    if (itemRect.width === 0 && itemRect.height === 0) {
      return false;
    }

    const containerRect = menu.getBoundingClientRect();
    const itemTop = itemRect.top - containerRect.top + menu.scrollTop;
    const itemBottom = itemTop + itemRect.height;

    // Only scroll if the item is above or below the visible area
    if (itemTop < menu.scrollTop) {
      menu.scrollTop = itemTop;
    } else if (itemBottom > menu.scrollTop + containerRect.height) {
      menu.scrollTop = itemBottom - containerRect.height;
    }

    hasScrolledRef.current = true;
    return true;
  });

  useEffect(() => {
    // Reset flag on navigation so scroll runs for the new path. Guard:
    // re-scrolling repeatedly for the same activePath (e.g. on DOM
    // mutations after the first scroll) is still prevented by the flag.
    hasScrolledRef.current = false;

    if (!enabled) {
      return () => {};
    }

    const container = containerRef.current;
    if (!container) {
      return () => {};
    }

    const maxAttempts = 10;
    let attempts = 0;
    let observer: MutationObserver | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    function cleanup() {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    }

    function tryScroll(): boolean {
      if (hasScrolledRef.current) {
        cleanup();
        return true;
      }
      const success = stableTryScroll();
      if (success) {
        cleanup();
        return true;
      }
      return false;
    }

    // First attempt — synchronous, DOM is already rendered
    if (tryScroll()) {
      return cleanup;
    }

    // Bounded retry via MutationObserver for lazy-rendered categories
    const menu = container.closest('.menu');
    if (!menu) {
      return cleanup;
    }

    observer = new MutationObserver(() => {
      attempts += 1;
      if (tryScroll() || attempts >= maxAttempts) {
        cleanup();
      }
    });

    observer.observe(menu, {
      childList: true,
      subtree: true,
    });

    // Timeout safety net — stop observing even if item never appears
    timeoutId = setTimeout(() => {
      cleanup();
    }, 1000);

    return () => {
      cleanup();
    };
  }, [containerRef, activePath, enabled, stableTryScroll]);
}
