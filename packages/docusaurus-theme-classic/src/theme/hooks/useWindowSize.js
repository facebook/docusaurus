/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useState} from 'react';

const desktopThresholdWidth = 996;
const desktopSize = 'desktop';
const mobileSize = 'mobile';

function useWindowSize() {
  const isClient = typeof window === 'object';

  function getSize() {
    return isClient
      ? (window.innerWidth > desktopThresholdWidth && desktopSize) || mobileSize
      : undefined;
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export {desktopSize, mobileSize};
export default useWindowSize;
