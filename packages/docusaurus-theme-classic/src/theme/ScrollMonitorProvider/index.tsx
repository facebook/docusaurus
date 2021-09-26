/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useMemo, useRef} from 'react';

import ScrollMonitorContext from '@theme/ScrollMonitorContext';
import type {Props} from '@theme/ScrollMonitorProvider';

function ScrollMonitorProvider(props: Props): JSX.Element {
  const isScrollMonitorEnabledRef = useRef(true);

  const handlers = useMemo(
    () => ({
      enableScrollMonitor: () => {
        isScrollMonitorEnabledRef.current = true;
      },
      disableScrollMonitor: () => {
        isScrollMonitorEnabledRef.current = false;
      },
    }),
    [],
  );

  return (
    <ScrollMonitorContext.Provider
      value={{...handlers, isScrollMonitorEnabledRef}}>
      {props.children}
    </ScrollMonitorContext.Provider>
  );
}

export default ScrollMonitorProvider;
