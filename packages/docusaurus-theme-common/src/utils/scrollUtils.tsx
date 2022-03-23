/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import {useDynamicCallback, ReactContextError} from './reactUtils';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

type ScrollController = {
  /** A boolean ref tracking whether scroll events are enabled. */
  scrollEventsEnabledRef: React.MutableRefObject<boolean>;
  /** Enable scroll events in `useScrollPosition`. */
  enableScrollEvents: () => void;
  /** Disable scroll events in `useScrollPosition`. */
  disableScrollEvents: () => void;
};

function useScrollControllerContextValue(): ScrollController {
  const scrollEventsEnabledRef = useRef(true);

  return useMemo(
    () => ({
      scrollEventsEnabledRef,
      enableScrollEvents: () => {
        scrollEventsEnabledRef.current = true;
      },
      disableScrollEvents: () => {
        scrollEventsEnabledRef.current = false;
      },
    }),
    [],
  );
}

const ScrollMonitorContext = React.createContext<ScrollController | undefined>(
  undefined,
);

export function ScrollControllerProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const value = useScrollControllerContextValue();
  return (
    <ScrollMonitorContext.Provider value={value}>
      {children}
    </ScrollMonitorContext.Provider>
  );
}

/**
 * We need a way to update the scroll position while ignoring scroll events
 * so as not to toggle Navbar/BackToTop visibility.
 *
 * This API permits to temporarily disable/ignore scroll events. Motivated by
 * https://github.com/facebook/docusaurus/pull/5618
 */
export function useScrollController(): ScrollController {
  const context = useContext(ScrollMonitorContext);
  if (context == null) {
    throw new ReactContextError('ScrollControllerProvider');
  }
  return context;
}

type ScrollPosition = {scrollX: number; scrollY: number};

const getScrollPosition = (): ScrollPosition | null =>
  ExecutionEnvironment.canUseDOM
    ? {
        scrollX: window.pageXOffset,
        scrollY: window.pageYOffset,
      }
    : null;

/**
 * This hook fires an effect when the scroll position changes. The effect will
 * be provided with the before/after scroll positions. Note that the effect may
 * not be always run: if scrolling is disabled through `useScrollController`, it
 * will be a no-op.
 *
 * @see {@link useScrollController}
 */
export function useScrollPosition(
  effect: (
    position: ScrollPosition,
    lastPosition: ScrollPosition | null,
  ) => void,
  deps: unknown[] = [],
): void {
  const {scrollEventsEnabledRef} = useScrollController();
  const lastPositionRef = useRef<ScrollPosition | null>(getScrollPosition());

  const dynamicEffect = useDynamicCallback(effect);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollEventsEnabledRef.current) {
        return;
      }
      const currentPosition = getScrollPosition()!;

      if (dynamicEffect) {
        dynamicEffect(currentPosition, lastPositionRef.current);
      }

      lastPositionRef.current = currentPosition;
    };

    const opts: AddEventListenerOptions & EventListenerOptions = {
      passive: true,
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, opts);

    return () => window.removeEventListener('scroll', handleScroll, opts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicEffect, scrollEventsEnabledRef, ...deps]);
}

type UseScrollPositionSaver = {
  /** Measure the top of an element, and store the details. */
  save: (elem: HTMLElement) => void;
  /**
   * Restore the page position to keep the stored element's position from
   * the top of the viewport, and remove the stored details.
   */
  restore: () => {restored: boolean};
};

function useScrollPositionSaver(): UseScrollPositionSaver {
  const lastElementRef = useRef<{elem: HTMLElement | null; top: number}>({
    elem: null,
    top: 0,
  });

  const save = useCallback((elem: HTMLElement) => {
    lastElementRef.current = {
      elem,
      top: elem.getBoundingClientRect().top,
    };
  }, []);

  const restore = useCallback(() => {
    const {
      current: {elem, top},
    } = lastElementRef;
    if (!elem) {
      return {restored: false};
    }
    const newTop = elem.getBoundingClientRect().top;
    const heightDiff = newTop - top;
    if (heightDiff) {
      window.scrollBy({left: 0, top: heightDiff});
    }
    lastElementRef.current = {elem: null, top: 0};

    return {restored: heightDiff !== 0};
  }, []);

  return useMemo(() => ({save, restore}), [restore, save]);
}

/**
 * This hook permits to "block" the scroll position of a DOM element.
 * The idea is that we should be able to update DOM content above this element
 * but the screen position of this element should not change.
 *
 * Feature motivated by the Tabs groups: clicking on a tab may affect tabs of
 * the same group upper in the tree, yet to avoid a bad UX, the clicked tab must
 * remain under the user mouse.
 *
 * @see https://github.com/facebook/docusaurus/pull/5618
 */
export function useScrollPositionBlocker(): {
  /**
   * Takes an element, and keeps its screen position no matter what's getting
   * rendered above it, until the next render.
   */
  blockElementScrollPositionUntilNextRender: (el: HTMLElement) => void;
} {
  const scrollController = useScrollController();
  const scrollPositionSaver = useScrollPositionSaver();

  const nextLayoutEffectCallbackRef = useRef<(() => void) | undefined>(
    undefined,
  );

  const blockElementScrollPositionUntilNextRender = useCallback(
    (el: HTMLElement) => {
      scrollPositionSaver.save(el);
      scrollController.disableScrollEvents();
      nextLayoutEffectCallbackRef.current = () => {
        const {restored} = scrollPositionSaver.restore();
        nextLayoutEffectCallbackRef.current = undefined;

        // Restoring the former scroll position will trigger a scroll event. We
        // need to wait for next scroll event to happen before enabling the
        // scrollController events again.
        if (restored) {
          const handleScrollRestoreEvent = () => {
            scrollController.enableScrollEvents();
            window.removeEventListener('scroll', handleScrollRestoreEvent);
          };
          window.addEventListener('scroll', handleScrollRestoreEvent);
        } else {
          scrollController.enableScrollEvents();
        }
      };
    },
    [scrollController, scrollPositionSaver],
  );

  useLayoutEffect(() => {
    nextLayoutEffectCallbackRef.current?.();
  });

  return {
    blockElementScrollPositionUntilNextRender,
  };
}
