/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useEffect, CSSProperties, useRef} from 'react';
import type {
  useCollapseProps,
  useCollapseReturns,
} from '@theme/hooks/useCollapse';

function getAutoHeightDuration(height) {
  const constant = height / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

const useCollapse = ({
  duration,
  easing = 'ease-in-out',
  initiallyExpanded,
  contentRef,
}: useCollapseProps): useCollapseReturns => {
  const [isExpanded, setExpanded] = useState(initiallyExpanded ?? false);
  const collapsedStyles = {
    display: isExpanded ? 'block' : 'none',
    overflow: isExpanded ? 'visible' : 'hidden',
    height: isExpanded ? 'auto' : '0px',
  };
  const [styles, setStyles] = useState<CSSProperties>(collapsedStyles);
  const mounted = useRef(false);
  const getTransitionStyles = () => {
    const height = contentRef.current.scrollHeight;
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
    contentRef,
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
};

export default useCollapse;
