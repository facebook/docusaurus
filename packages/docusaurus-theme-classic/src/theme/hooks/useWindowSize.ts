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

function useWindowSize(): WindowSize {
  const getSize = () => window.innerWidth;
  const [windowSize, setWindowSize] = useState(
    ExecutionEnvironment.canUseDOM ? getSize : 0,
  );
  const isDesktop = windowSize > desktopThresholdWidth;

  useEffect(() => {
    const handleResize = () => setWindowSize(getSize());

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    windowSize,
    isDesktop,
    isMobile: !isDesktop,
  };
}

export default useWindowSize;
