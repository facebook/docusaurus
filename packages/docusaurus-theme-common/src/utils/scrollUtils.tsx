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
  useLayoutEffect,
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
        console.log('enable');
        scrollEventsEnabledRef.current = true;
      },
      disableScrollEvents: () => {
        console.log('disable');
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

type UseScrollPositionSaver = {
  /**
   * Measure the top of an element, and store the details
   */
  save: (elem: HTMLElement) => void;
  /**
   * Restore the page position to keep the stored element's position from
   * the top of the viewport, and remove the stored details
   * @return boolean true if a scroll
   */
  restore: () => boolean;
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
      return false;
    }
    const newTop = elem.getBoundingClientRect().top;
    const heightDiff = newTop - top;
    if (heightDiff) {
      window.scrollBy({left: 0, top: heightDiff});
    }
    lastElementRef.current = {elem: null, top: 0};

    return heightDiff !== 0;
  }, []);

  return useMemo(() => ({save, restore}), []);
}

type UseScrollPositionBlockerReturn = {
  blockElementScrollPositionUntilNextRender: (el: HTMLElement) => void;
};
export function useScrollPositionBlocker(): UseScrollPositionBlockerReturn {
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
        const restored = scrollPositionSaver.restore();
        console.log({restored});
        nextLayoutEffectCallbackRef.current = undefined;

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
    [scrollController],
  );

  useLayoutEffect(() => {
    nextLayoutEffectCallbackRef.current?.();
  });

  return {
    blockElementScrollPositionUntilNextRender,
  };
}
