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
  CSSProperties,
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

export type UseCollapsibleConfig = {
  initialState: boolean | (() => boolean);
  duration?: number;
  easing?: string;
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
    style: CSSProperties;
    onTransitionEnd: (e: TransitionEvent) => void;
  };
};

const CollapsedStyles: CSSProperties = {
  display: 'none',
  overflow: 'hidden',
  height: '0px',
};

const ExpandedStyles: CSSProperties = {
  display: 'block',
  overflow: 'visible',
  height: 'auto',
};

function getCollapsedStyle(collapsed: boolean): CSSProperties {
  return collapsed ? CollapsedStyles : ExpandedStyles;
}

/*
This hook encapsulate the animated collapsible behavior
You have to apply the getToggleProps + getCollapsibleProps wire everything
Similar to other solutions in the React ecosystem, like Downshift for Selects
 */
export function useCollapsible({
  initialState,
  duration,
  easing = 'ease-in-out',
}: UseCollapsibleConfig): UseCollapsibleReturns {
  const contentRef = useRef<HTMLElement>(null);

  const [collapsed, setCollapsed] = useState(initialState ?? false);

  const [styles, setStyles] = useState<CSSProperties>(() =>
    getCollapsedStyle(collapsed),
  );
  const mounted = useRef(false);

  const getTransitionStyles = () => {
    const height = contentRef.current!.scrollHeight;
    const _duration = duration || getAutoHeightDuration(height);

    return {
      transition: `height ${_duration}ms ${easing}`,
      height: `${height}px`,
    };
  };

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    if (collapsed) {
      requestAnimationFrame(() => {
        setStyles(getTransitionStyles());

        requestAnimationFrame(() => {
          setStyles((oldStyles) => ({
            ...oldStyles,
            height: '0px',
            overflow: 'hidden',
          }));
        });
      });
    } else {
      requestAnimationFrame(() => {
        setStyles((oldStyles) => ({
          ...oldStyles,
          display: 'block',
          willChange: 'height',
        }));

        requestAnimationFrame(() => {
          setStyles((oldStyles) => ({
            ...oldStyles,
            ...getTransitionStyles(),
          }));
        });
      });
    }
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((expanded) => !expanded);
  }, []);

  return {
    collapsed,
    setCollapsed,
    toggleCollapsed,

    getToggleProps: () => ({
      onClick: toggleCollapsed,
    }),

    getCollapsibleProps: () => ({
      ref: contentRef,
      style: styles,
      onTransitionEnd: (e) => {
        if (e.propertyName === 'height') {
          setStyles(getCollapsedStyle(collapsed));
        }
      },
    }),
  };
}
