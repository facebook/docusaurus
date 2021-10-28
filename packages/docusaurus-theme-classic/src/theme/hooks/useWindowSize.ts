/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useState} from 'react';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import type {WindowSize} from '@theme/hooks/useWindowSize';

const windowSizes = {
  desktop: 'desktop',
  mobile: 'mobile',

  // This "ssr" value is very important to handle hydration FOUC / layout shifts
  // You have to handle server-rendering explicitly on the call-site
  // On the server, you may need to render BOTH the mobile/desktop elements (and hide one of them with mediaquery)
  // We don't return "undefined" on purpose, to make it more explicit
  ssr: 'ssr',
} as const;

const DesktopThresholdWidth = 996;

function getWindowSize() {
  if (!ExecutionEnvironment.canUseDOM) {
    return windowSizes.ssr;
  }
  return window.innerWidth > DesktopThresholdWidth
    ? windowSizes.desktop
    : windowSizes.mobile;
}

// Simulate the SSR window size in dev, so that potential hydration FOUC/layout shift problems can be seen in dev too!
const DevSimulateSSR = process.env.NODE_ENV === 'development' && true;

// This hook returns an enum value on purpose!
// We don't want it to return the actual width value, for resize perf reasons
// We only want to re-render once a breakpoint is crossed
function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (DevSimulateSSR) {
      return 'ssr';
    }
    return getWindowSize();
  });

  useEffect(() => {
    function updateWindowSize() {
      setWindowSize(getWindowSize());
    }

    const timeout = DevSimulateSSR
      ? window.setTimeout(updateWindowSize, 1000)
      : undefined;

    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
      clearTimeout(timeout);
    };
  }, []);

  return windowSize;
}

export default useWindowSize;
