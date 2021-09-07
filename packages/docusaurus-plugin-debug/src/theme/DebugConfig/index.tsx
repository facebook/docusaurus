/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DebugLayout from '@theme/DebugLayout';
import DebugJsonView from '@theme/DebugJsonView';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function DebugMetadata(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <DebugLayout>
      <h2>Site config</h2>
      <DebugJsonView src={siteConfig} collapseDepth={3} />
    </DebugLayout>
  );
}

export default DebugMetadata;
