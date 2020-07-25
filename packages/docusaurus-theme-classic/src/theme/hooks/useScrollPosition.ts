/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useEffect} from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

type ScrollPosition = {scrollX: number; scrollY: number};

const getScrollPosition = (): ScrollPosition => ({
  scrollX: ExecutionEnvironment.canUseDOM ? window.pageXOffset : 0,
  scrollY: ExecutionEnvironment.canUseDOM ? window.pageYOffset : 0,
});

const useScrollPosition = (
  effect?: (position: ScrollPosition) => void,
  deps: unknown[] = [],
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
    window.addEventListener('scroll', handleScroll);

    return () =>
      window.removeEventListener('scroll', handleScroll, {
        // @ts-expect-error: See https://github.com/microsoft/TypeScript/issues/32912
        passive: true,
      });
  }, deps);

  return scrollPosition;
};

export default useScrollPosition;
