/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import routes from '@generated/routes';
import DebugLayout from '@theme/DebugLayout';
import DebugJsonView from '@theme/DebugJsonView';
import styles from './styles.module.css';

export default function DebugRoutes(): ReactNode {
  return (
    <DebugLayout>
      <h2>Routes</h2>
      <ul className="clean-list">
        {routes.map(({path, children}) => (
          <li key={path} className={styles.listItem}>
            <div className={styles.route}>
              <code className={styles.routeName}>{path}</code>
            </div>
            {children && (
              <div>
                Child Routes:
                <DebugJsonView src={children} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </DebugLayout>
  );
}
