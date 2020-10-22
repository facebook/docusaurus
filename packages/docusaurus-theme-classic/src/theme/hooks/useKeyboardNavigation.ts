/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect} from 'react';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import './styles.css';

// This hook detect keyboard focus indicator to not show outline for mouse users
// Inspired by https://hackernoon.com/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2
function useKeyboardNavigation(): void {
  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) {
      return undefined;
    }

    const keyboardFocusedClassName = 'navigation-with-keyboard';

    function handleFirstTab(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        document.body.classList.add(keyboardFocusedClassName);

        document.removeEventListener('keydown', handleFirstTab);
        document.addEventListener('mousedown', handleMouseDown);
      }
    }

    function handleMouseDown() {
      document.body.classList.remove(keyboardFocusedClassName);

      document.removeEventListener('mousedown', handleMouseDown);
      document.addEventListener('keydown', handleFirstTab);
    }

    document.addEventListener('keydown', handleFirstTab);

    return () => {
      document.body.classList.remove(keyboardFocusedClassName);

      document.removeEventListener('keydown', handleFirstTab);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
}

export default useKeyboardNavigation;
