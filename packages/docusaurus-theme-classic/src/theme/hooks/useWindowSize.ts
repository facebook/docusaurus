/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useState} from 'react';

const desktopThresholdWidth = 996;

const windowSizes = {
  desktop: 'desktop',
  mobile: 'mobile',
} as const;

function useWindowSize(): 'desktop' | 'mobile' | undefined {
  const isClient = typeof window !== 'undefined';

  function getSize() {
    if (!isClient) {
      return undefined;
    }
    return window.innerWidth > desktopThresholdWidth
      ? windowSizes.desktop
      : windowSizes.mobile;
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return undefined;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export {windowSizes};
export default useWindowSize;
