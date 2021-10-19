/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DebugLayout from '../DebugLayout';
import DebugJsonView from '../DebugJsonView';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function DebugMetadata() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <DebugLayout>
      <h2>Site config</h2>
      <DebugJsonView src={siteConfig} collapseDepth="3" />
    </DebugLayout>
  );
}

export default DebugMetadata;
