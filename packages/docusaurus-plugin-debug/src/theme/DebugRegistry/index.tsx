/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DebugLayout from '@theme/DebugLayout';
import registry from '@generated/registry';
import styles from './styles.module.css';

function DebugRegistry(): JSX.Element {
  return (
    <DebugLayout>
      <h2>Registry</h2>
      <ul className={styles.list}>
        {Object.values(registry).map(([, aliasedPath, resolved]) => (
          <li key={aliasedPath} className={styles.listItem}>
            <div style={{marginBottom: '10px'}}>
              Aliased Path: <code>{aliasedPath}</code>
            </div>
            <div>
              Resolved Path: <code>{resolved}</code>
            </div>
          </li>
        ))}
      </ul>
    </DebugLayout>
  );
}

export default DebugRegistry;
