/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

/* eslint-disable @docusaurus/prefer-docusaurus-heading */

function ExamplesTable() {
  return (
    <table className="table-auto border-collapse border border-gray-300">
      <thead>
        <tr>
          <th>Example</th>
          <th>Normal</th>
          <th>Isolated</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>h1</td>
          <td>
            <h1>title</h1>
          </td>
          <td>
            <h1 className={styles.isolated}>title</h1>
          </td>
        </tr>

        <tr>
          <td>nested h1</td>
          <td>
            <div>
              <h1>title</h1>
            </div>
          </td>
          <td>
            <div className={styles.isolated}>
              <h1>title</h1>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default function StyleIsolation(): ReactNode {
  return (
    <Layout>
      <main style={{padding: 30}}>
        <Heading as="h1">Style Isolation tests</Heading>

        <p>
          This shows how to isolate your components from Docusaurus global
          styles. A workaround for{' '}
          <Link
            target="_blank"
            href="https://github.com/facebook/docusaurus/issues/6032">
            this issue
          </Link>
          .
        </p>
        <ExamplesTable />
      </main>
    </Layout>
  );
}
