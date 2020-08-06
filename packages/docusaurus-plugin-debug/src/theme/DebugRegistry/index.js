/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DebugLayout from '../DebugLayout';
import registry from '@generated/registry';

function DebugRegistry() {
  return (
    <DebugLayout>
      {' '}
      <h2>Registry</h2>
      <ul>
        {Object.values(registry).map(([, aliasedPath, resolved]) => (
          <li key={aliasedPath}>
            <div>Aliased Path: {aliasedPath}</div>
            <div>Resolved Path: {resolved}</div>
          </li>
        ))}
      </ul>
    </DebugLayout>
  );
}

export default DebugRegistry;
