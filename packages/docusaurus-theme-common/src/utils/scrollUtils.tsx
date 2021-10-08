/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

/**
 * We need a way to update the scroll position while ignoring scroll events
 * Permits to update the scroll position without changing Navbar/BackToTop button visibility
 * This API is motivated by https://github.com/facebook/docusaurus/pull/5618
 */
type ScrollController = {
  /**
   * A boolean ref tracking whether scroll events are enabled
   */
  scrollEventsEnabledRef: React.MutableRefObject<boolean>;
  /**
   * Enables scroll events in `useScrollPosition`
   */
  enableScrollEvents: () => void;
  /**
   * Disables scroll events in `useScrollPosition`
   */
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

const ScrollMonitorContext = createContext<ScrollController | undefined>(
  undefined,
);

export function ScrollControllerProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <ScrollMonitorContext.Provider value={useScrollControllerContextValue()}>
      {children}
    </ScrollMonitorContext.Provider>
  );
}

export function useScrollController(): ScrollController {
  const context = useContext(ScrollMonitorContext);
  if (context == null) {
    throw new Error(
      '"useScrollController" is used but no context provider was found in the React tree.',
    );
  }
  return context;
}

const getScrollPosition = (): ScrollPosition | null => {
  return ExecutionEnvironment.canUseDOM
    ? {
        scrollX: window.pageXOffset,
        scrollY: window.pageYOffset,
      }
    : null;
};

type ScrollPosition = {scrollX: number; scrollY: number};

export function useScrollPosition(
  effect: (
    position: ScrollPosition,
    lastPosition: ScrollPosition | null,
  ) => void,
  deps: unknown[] = [],
): void {
  const {scrollEventsEnabledRef} = useScrollController();
  const lastPositionRef = useRef<ScrollPosition | null>(getScrollPosition());

  const handleScroll = () => {
    if (!scrollEventsEnabledRef.current) {
      return;
    }
    const currentPosition = getScrollPosition()!;

    if (effect) {
      effect(currentPosition, lastPositionRef.current);
    }

    lastPositionRef.current = currentPosition;
  };

  useEffect(() => {
    const opts: AddEventListenerOptions & EventListenerOptions = {
      passive: true,
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, opts);

    return () => window.removeEventListener('scroll', handleScroll, opts);
  }, deps);
}

type UseRestoreTopReturn = {
  /**
   * Measure the top of an element, and store the details
   */
  measureTop: (elem: HTMLElement) => void;
  /**
   * Restore the page position to keep the stored element's position from
   * the top of the viewport, and remove the stored details
   */
  restoreTop: () => void;
};

export const useRestoreTop = (): UseRestoreTopReturn => {
  const lastElementRef = useRef<{elem: HTMLElement | null; top: number}>({
    elem: null,
    top: 0,
  });

  const measureTop = useCallback((elem: HTMLElement) => {
    lastElementRef.current = {
      elem,
      top: elem.getBoundingClientRect().top,
    };
  }, []);

  const restoreTop = useCallback(() => {
    const {
      current: {elem, top},
    } = lastElementRef;
    if (!elem) {
      return;
    }
    const newTop = elem.getBoundingClientRect().top;
    const heightDiff = newTop - top;
    if (heightDiff) {
      window.scrollBy({left: 0, top: heightDiff});
    }
    lastElementRef.current = {elem: null, top: 0};
  }, []);

  return {measureTop, restoreTop};
};
