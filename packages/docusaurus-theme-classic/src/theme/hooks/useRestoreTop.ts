/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback, useRef} from 'react';
import {UseRestoreTopReturn} from '@theme/hooks/useRestoreTop';

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
