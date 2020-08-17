/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DebugLayout from '../DebugLayout';

// import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function DebugMetadata() {
  return (
    <DebugLayout>
      <h2>Docusaurus Debug</h2>
      <div>Config:</div>
      <div>Metadata:</div>
      <div>Registry:</div>
      <div>Route:</div>
      <div>Content:</div>
    </DebugLayout>
  );
}

export default DebugMetadata;
