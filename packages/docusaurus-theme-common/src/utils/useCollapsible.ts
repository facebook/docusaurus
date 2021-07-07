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
  RefObject,
  Dispatch,
  SetStateAction,
  CSSProperties,
  TransitionEvent,
  MouseEvent,
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
  duration?: number;
  easing?: string;
  initiallyExpanded?: boolean;
  contentRef: RefObject<Element>;
};

export type UseCollapsibleReturns = {
  isExpanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
  getCollapseProps(): {
    style: CSSProperties;
    onTransitionEnd: (e: TransitionEvent) => void;
  };
  getToggleProps: (params: {
    onClick?: () => void;
  }) => {
    onClick: (e: MouseEvent) => void;
  };
};

export function useCollapsible({
  duration,
  easing = 'ease-in-out',
  initiallyExpanded,
  contentRef,
}: UseCollapsibleConfig): UseCollapsibleReturns {
  const [isExpanded, setExpanded] = useState(initiallyExpanded ?? false);
  const collapsedStyles = {
    display: isExpanded ? 'block' : 'none',
    overflow: isExpanded ? 'visible' : 'hidden',
    height: isExpanded ? 'auto' : '0px',
  };
  const [styles, setStyles] = useState<CSSProperties>(collapsedStyles);
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

    if (isExpanded) {
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
    } else {
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
    }
  }, [isExpanded]);

  return {
    getCollapseProps: () => ({
      style: styles,
      onTransitionEnd: (e) => {
        if (e.propertyName === 'height') {
          setStyles(collapsedStyles);
        }
      },
    }),
    getToggleProps: ({onClick = (): void => {}}) => ({
      onClick: () => {
        onClick();
        setExpanded((expanded) => !expanded);
      },
    }),
    isExpanded,
    setExpanded,
  };
}
