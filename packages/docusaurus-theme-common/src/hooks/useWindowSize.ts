/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useState} from 'react';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const windowSizes = {
  desktop: 'desktop',
  mobile: 'mobile',
  ssr: 'ssr',
} as const;

type WindowSize = keyof typeof windowSizes;

const DesktopThresholdWidth = 996;

function getWindowSize() {
  if (!ExecutionEnvironment.canUseDOM) {
    return windowSizes.ssr;
  }
  return window.innerWidth > DesktopThresholdWidth
    ? windowSizes.desktop
    : windowSizes.mobile;
}

/**
 * Gets the current window size as an enum value. We don't want it to return the
 * actual width value, so that it only re-renders once a breakpoint is crossed.
 *
 * It may return `"ssr"`, which is very important to handle hydration FOUC or
 * layout shifts. You have to handle it explicitly upfront. On the server, you
 * may need to render BOTH the mobile/desktop elements (and hide one of them
 * with mediaquery). We don't return `undefined` on purpose, to make it more
 * explicit.
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(
    () =>
      // super important to return a constant value to avoid hydration mismatch
      // see https://github.com/facebook/docusaurus/issues/9379
      'ssr',
  );

  useEffect(() => {
    function updateWindowSize() {
      setWindowSize(getWindowSize());
    }

    updateWindowSize();

    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);

  return windowSize;
}
