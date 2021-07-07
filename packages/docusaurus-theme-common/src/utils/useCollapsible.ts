/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  RefObject,
  Dispatch,
  SetStateAction,
  TransitionEvent,
} from 'react';

/*
Lex111: Dynamic transition duration is used in Material deisign, this technique is good for a large number of items.
https://material.io/archive/guidelines/motion/duration-easing.html#duration-easing-dynamic-durations
https://github.com/mui-org/material-ui/blob/e724d98eba018e55e1a684236a2037e24bcf050c/packages/material-ui/src/styles/createTransitions.js#L40-L43
 */
function getAutoHeightDuration(height: number) {
  const constant = height / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

type CollapsibleAnimationConfig = {
  duration?: number;
  easing?: string;
};

const DefaultAnimationEasing = 'ease-in-out';

export type UseCollapsibleConfig = {
  initialState: boolean | (() => boolean);
  animation?: CollapsibleAnimationConfig;
};

export type UseCollapsibleReturns = {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  toggleCollapsed: () => void;

  getToggleProps(): {
    onClick?: () => void;
  };

  getCollapsibleProps(): {
    ref: RefObject<any>; // any because TS is a pain for HTML element refs, see https://twitter.com/sebastienlorber/status/1412784677795110914
    onTransitionEnd: (e: TransitionEvent) => void;
  };
};

const CollapsedStyles = {
  display: 'none',
  overflow: 'hidden',
  height: '0px',
} as const;

const ExpandedStyles = {
  display: 'block',
  overflow: 'visible',
  height: 'auto',
} as const;

function applyCollapsedStyle(el: HTMLElement, collapsed: boolean) {
  const collapsedStyles = collapsed ? CollapsedStyles : ExpandedStyles;
  el.style.display = collapsedStyles.display;
  el.style.overflow = collapsedStyles.overflow;
  el.style.height = collapsedStyles.height;
}

function useCollapseAnimation({
  collapsibleRef,
  collapsed,
  animation,
}: {
  collapsibleRef: RefObject<HTMLElement>;
  collapsed: boolean;
  animation?: CollapsibleAnimationConfig;
}) {
  const mounted = useRef(false);

  useEffect(() => {
    const el = collapsibleRef.current!;

    function getTransitionStyles() {
      const height = el.scrollHeight;
      const duration = animation?.duration ?? getAutoHeightDuration(height);
      const easing = animation?.easing ?? DefaultAnimationEasing;
      return {
        transition: `height ${duration}ms ${easing}`,
        height: `${height}px`,
      };
    }

    function applyTransitionStyles() {
      const transitionStyles = getTransitionStyles();
      el.style.transition = transitionStyles.transition;
      el.style.height = transitionStyles.height;
    }

    // On mount, we just apply styles, no animated transition
    if (!mounted.current) {
      applyCollapsedStyle(el, collapsed);
      mounted.current = true;
      return undefined;
    }

    el.style.willChange = 'height';

    function startAnimation(): () => void {
      // When collapsing
      if (collapsed) {
        applyTransitionStyles();
        const animationFrame = requestAnimationFrame(() => {
          el.style.height = CollapsedStyles.height;
          el.style.overflow = CollapsedStyles.overflow;
        });
        return () => cancelAnimationFrame(animationFrame);
      }
      // When expanding
      else {
        el.style.display = 'block';
        const animationFrame = requestAnimationFrame(() => {
          applyTransitionStyles();
        });
        return () => cancelAnimationFrame(animationFrame);
      }
    }

    return startAnimation();
  }, [collapsibleRef, collapsed, animation]);
}

/*
This hook encapsulate the animated collapsible behavior
You have to apply the getToggleProps + getCollapsibleProps wire everything
Similar to other solutions in the React ecosystem, like Downshift for Selects
 */
export function useCollapsible({
  initialState,
  animation,
}: UseCollapsibleConfig): UseCollapsibleReturns {
  const collapsibleRef = useRef<HTMLElement>(null);

  const [collapsed, setCollapsed] = useState(initialState ?? false);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((expanded) => !expanded);
  }, []);

  useCollapseAnimation({collapsibleRef, collapsed, animation});

  return {
    collapsed,
    setCollapsed,
    toggleCollapsed,

    getToggleProps: () => ({
      onClick: toggleCollapsed,
    }),

    getCollapsibleProps: () => ({
      ref: collapsibleRef,
      onTransitionEnd: (e) => {
        if (e.propertyName === 'height') {
          applyCollapsedStyle(collapsibleRef.current!, collapsed);
        }
      },
    }),
  };
}
