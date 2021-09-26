/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useRef} from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import type {ScrollPosition} from '@theme/hooks/useScrollPosition';
import useScrollMonitorContext from '@theme/hooks/useScrollMonitorContext';

const getScrollPosition = (): ScrollPosition | null => {
  return ExecutionEnvironment.canUseDOM
    ? {
        scrollX: window.pageXOffset,
        scrollY: window.pageYOffset,
      }
    : null;
};

const useScrollPosition = (
  effect: (
    position: ScrollPosition,
    lastPosition: ScrollPosition | null,
  ) => void,
  deps = [],
): void => {
  const {isScrollMonitorEnabledRef} = useScrollMonitorContext();
  const lastPositionRef = useRef<ScrollPosition | null>(getScrollPosition());

  const handleScroll = () => {
    if (!isScrollMonitorEnabledRef.current) {
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
};

export default useScrollPosition;
