/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DebugLayout from '../DebugLayout';
import routes from '@generated/routes';
import styles from './styles.module.css';

function DebugRoutes() {
  return (
    <DebugLayout>
      <h2>Routes</h2>
      <ul className={styles.list}>
        {routes.map(({path, exact}) => (
          <li key={path} className={styles.listItem}>
            <div className={styles.route}>
              <code className={styles.routeName}>{path}</code>
            </div>
            <div>
              Is exact: <code>{String(Boolean(exact))}</code>
            </div>
          </li>
        ))}
      </ul>
    </DebugLayout>
  );
}

export default DebugRoutes;
