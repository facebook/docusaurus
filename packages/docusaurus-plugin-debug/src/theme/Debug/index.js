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
import siteMetadata from '@generated/site-metadata';

import styles from './styles.module.css';

function Debug() {
  return (
    <Layout permalink="__docusaurus/debug" title="Debug">
      <main className={styles.Container}>
        <section className={styles.Section}>
          <h2>Site Metadata</h2>
          <div>Docusaurus Version: {siteMetadata.docusaurusVersion}</div>
          <div>
            Site Version: {siteMetadata.siteVersion || 'No version specified'}
          </div>
          <h3>Plugins and themes:</h3>
          <ul>
            {Object.entries(siteMetadata.pluginVersions).map(
              ([name, versionInformation]) => (
                <li key={name}>
                  <div>Name: {name}</div>
                  <div>Type: {versionInformation.type}</div>
                  {versionInformation.version && (
                    <div>Version: {versionInformation.version}</div>
                  )}
                </li>
              ),
            )}
          </ul>
        </section>
        <section className={styles.Section}>
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
        <section className={styles.Section}>
          <h2>Routes</h2>
          <ul>
            {routes.map(({path, exact}) => (
              <li key={path}>
                <div>Route: {path}</div>
                <div>Is exact: {String(Boolean(exact))}</div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}

export default Debug;
