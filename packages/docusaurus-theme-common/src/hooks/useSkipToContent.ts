/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type React from 'react';
import {useCallback, useRef} from 'react';
import {useHistory} from '@docusaurus/router';
import {useLocationChange} from '../utils/useLocationChange';
import {ThemeClassNames} from '../utils/ThemeClassNames';

function programmaticFocus(el: HTMLElement) {
  el.setAttribute('tabindex', '-1');
  el.focus();
  el.removeAttribute('tabindex');
}

/** This hook wires the logic for a skip-to-content link. */
export function useSkipToContent(): {
  /**
   * The ref to the container. On page transition, the container will be focused
   * so that keyboard navigators can instantly interact with the link and jump
   * to content. **Note:** the type is `RefObject<HTMLDivElement>` only because
   * the typing for refs don't reflect that the `ref` prop is contravariant, so
   * using `HTMLElement` causes type-checking to fail. You can plug the ref into
   * any HTML element, as long as it can be focused.
   */
  containerRef: React.RefObject<HTMLDivElement>;
  /**
   * Callback fired when the skip to content link has been interacted with. It
   * will programmatically focus the main content.
   */
  handleSkip: (e: React.MouseEvent<HTMLAnchorElement>) => void;
} {
  const containerRef = useRef<HTMLDivElement>(null);
  const {action} = useHistory();
  const handleSkip = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const targetElement: HTMLElement | null =
      document.querySelector('main:first-of-type') ??
      document.querySelector(`.${ThemeClassNames.wrapper.main}`);

    if (targetElement) {
      programmaticFocus(targetElement);
    }
  }, []);

  useLocationChange(({location}) => {
    if (containerRef.current && !location.hash && action === 'PUSH') {
      programmaticFocus(containerRef.current);
    }
  });

  return {containerRef, handleSkip};
}
