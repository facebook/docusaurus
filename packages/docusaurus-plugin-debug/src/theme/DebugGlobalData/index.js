/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DebugLayout from '../DebugLayout';
import DebugJsonView from '../DebugJsonView';
import useGlobalData from '@docusaurus/useGlobalData';

function DebugMetadata() {
  const globalData = useGlobalData();
  return (
    <DebugLayout>
      <h2>Global data</h2>
      <DebugJsonView src={globalData} collapseDepth="3" />
    </DebugLayout>
  );
}

export default DebugMetadata;
