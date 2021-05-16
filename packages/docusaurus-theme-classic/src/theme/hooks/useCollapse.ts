/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

// TODO: most likely needs refactor this
function useCollapse(
  initialCollapsed: boolean,
  elemRef: MutableRefObject<any>,
): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed);
  const styleOptions = {
    timing: 0.2,
    ease: 'ease-out',
  };

  const mounted = useRef(false);

  const collapse = () => {
    const element = elemRef.current;
    const elementHeight = element.scrollHeight;
    const elementTransition = element.style.transition;
    element.style.transition = '';

    window.requestAnimationFrame(() => {
      element.style.height = `${elementHeight}px`;
      element.style.transition = elementTransition;

      window.requestAnimationFrame(() => {
        element.style.height = '0px';
      });
    });
  };
  const expand = () => {
    const element = elemRef.current;
    function handler() {
      element.style.height = 'auto';
    }

    const elementHeight = element.scrollHeight;
    element.style.height = `${elementHeight}px`;

    element.addEventListener('transitionend', handler);
    window.requestAnimationFrame(() => {
      element.removeEventListener('transitionend', handler);
    });
  };

  useEffect(() => {
    const element = elemRef.current;

    if (!element) {
      return;
    }

    element.style.overflow = 'hidden';
    element.style.transition = `height ${styleOptions.timing}s ${styleOptions.ease}`;

    if (initialCollapsed) {
      element.style.height = 0;
    }
  }, [initialCollapsed]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    if (collapsed) {
      collapse();
    } else {
      expand();
    }
  }, [collapsed]);

  return [collapsed, setCollapsed];
}

export default useCollapse;
