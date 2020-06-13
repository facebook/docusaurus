/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';

import registry from '@generated/registry';
import routes from '@generated/routes';

import styles from './styles.module.css';

function Debug() {
  return (
    <Layout permalink="__docusaurus/debug" title="Debug">
      <main className={styles.Container}>
        <section>
          <h2>Registry</h2>
          <ul>
            {Object.values(registry).map(([, aliasedPath, resolved]) => (
              <li key={aliasedPath}>
                <div>Aliased Path: {aliasedPath}</div>
                <div>Resolved Path: {resolved}</div>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Routes</h2>
          <ul>
            {routes.map(({path, exact}) => (
              <li key={path}>
                <div>Route: {path}</div>
                <div>Is exact: {Boolean(exact)}</div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}

export default Debug;
