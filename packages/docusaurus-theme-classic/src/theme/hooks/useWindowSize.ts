/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useState} from 'react';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import type {WindowSize} from '@theme/hooks/useWindowSize';

const desktopThresholdWidth = 996;

const windowSizes = {
  desktop: 'desktop',
  mobile: 'mobile',

  // This "ssr" value is very important to handle hydration FOUC / layout shifts
  // You have to handle server-rendering explicitly on the call-site
  // On the server, you may need to render BOTH the mobile/desktop elements (and hide one of them with mediaquery)
  // We don't return "undefined" on purpose, to make it more explicit
  ssr: 'ssr',
} as const;

// This hook returns an enum value on purpose!
// We don't want it to return the actual width value, for resize perf reasons
// We only want to re-render once a breakpoint is crossed
function useWindowSize(): WindowSize {
  const isClient = ExecutionEnvironment.canUseDOM;

  function getWindowSize() {
    if (!isClient) {
      return windowSizes.ssr;
    }
    return window.innerWidth > desktopThresholdWidth
      ? windowSizes.desktop
      : windowSizes.mobile;
  }

  const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize);

  useEffect(() => {
    if (!isClient) {
      return undefined;
    }

    function handleResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default useWindowSize;
