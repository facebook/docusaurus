/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useContext} from 'react';

import ScrollMonitorContext from '@theme/ScrollMonitorContext';
import type {ScrollMonitorContextProps} from '@theme/hooks/useScrollMonitorContext';

function useScrollMonitorContext(): ScrollMonitorContextProps {
  const context = useContext<ScrollMonitorContextProps | undefined>(
    ScrollMonitorContext,
  );
  if (context == null) {
    throw new Error(
      '"useScrollMonitorContext" is used outside of "Layout" component.',
    );
  }
  return context;
}

export default useScrollMonitorContext;
