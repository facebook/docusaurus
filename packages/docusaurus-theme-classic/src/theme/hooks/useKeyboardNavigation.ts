/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect} from 'react';

import './styles.css';

// This hook detect keyboard focus indicator to not show outline for mouse users
// Inspired by https://hackernoon.com/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2
function useKeyboardNavigation(): void {
  useEffect(() => {
    const keyboardFocusedClassName = 'navigation-with-keyboard';

    function handleOutlineStyles(e: MouseEvent | KeyboardEvent) {
      document.body.classList.toggle(keyboardFocusedClassName, e.key === 'Tab');
    }

    document.addEventListener('keydown', handleOutlineStyles);
    document.addEventListener('mousedown', handleOutlineStyles);

    return () => {
      document.body.classList.remove(keyboardFocusedClassName);
      document.removeEventListener('keydown', handleOutlineStyles);
      document.removeEventListener('mousedown', handleOutlineStyles);
    };
  }, []);
}

export default useKeyboardNavigation;
