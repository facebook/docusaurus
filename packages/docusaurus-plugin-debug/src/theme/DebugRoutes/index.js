/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DebugLayout from '../DebugLayout';
import routes from '@generated/routes';

function DebugRoutes() {
  return (
    <DebugLayout>
      <h2>Routes</h2>
      <ul>
        {routes.map(({path, exact}) => (
          <li key={path}>
            <div>Route: {path}</div>
            <div>Is exact: {String(Boolean(exact))}</div>
          </li>
        ))}
      </ul>
    </DebugLayout>
  );
}

export default DebugRoutes;
