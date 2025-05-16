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

function ExampleRow({name, children}: {name: string; children: ReactNode}) {
  return (
    <tr>
      <td>{name}</td>
      <td>{children}</td>
      <td>{React.cloneElement(children, {className: styles.isolated})}</td>
    </tr>
  );
}

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
        <ExampleRow name="h1">
          <h1>title</h1>
        </ExampleRow>

        <ExampleRow name="Nested h1">
          <div>
            <h1>title</h1>
          </div>
        </ExampleRow>

        <ExampleRow name="Unordered list">
          <ul>
            <li>item1</li>
            <li>item2</li>
          </ul>
        </ExampleRow>

        <ExampleRow name="Ordered list">
          <ol>
            <li>item1</li>
            <li>item2</li>
          </ol>
        </ExampleRow>

        <ExampleRow name="kbd">
          <kbd>kbd</kbd>
        </ExampleRow>

        <ExampleRow name="table">
          <table>
            <thead>
              <tr>
                <th>Col1</th>
                <th>Col2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cell1</td>
                <td>Cell2</td>
              </tr>
              <tr>
                <td>Cell3</td>
                <td>Cell3</td>
              </tr>
            </tbody>
          </table>
        </ExampleRow>
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
