/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useEffect} from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import type {ScrollPosition} from '@theme/hooks/useScrollPosition';

const getScrollPosition = (): ScrollPosition => ({
  scrollX: ExecutionEnvironment.canUseDOM ? window.pageXOffset : 0,
  scrollY: ExecutionEnvironment.canUseDOM ? window.pageYOffset : 0,
});

const useScrollPosition = (
  effect?: (position: ScrollPosition) => void,
  deps = [],
): ScrollPosition => {
  const [scrollPosition, setScrollPosition] = useState(getScrollPosition());

  const handleScroll = () => {
    const currentScrollPosition = getScrollPosition();

    setScrollPosition(currentScrollPosition);

    if (effect) {
      effect(currentScrollPosition);
    }
  };

  useEffect(() => {
    const opts: AddEventListenerOptions & EventListenerOptions = {
      passive: true,
    };

    window.addEventListener('scroll', handleScroll, opts);

    return () => window.removeEventListener('scroll', handleScroll, opts);
  }, deps);

  return scrollPosition;
};

export default useScrollPosition;
