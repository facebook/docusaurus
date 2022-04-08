/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';

export default function NotFound(): JSX.Element {
  return (
    <>
      <Head>
        <title>Page Not Found</title>
      </Head>
      <Layout>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            fontSize: '20px',
          }}>
          <h1>Oops, page not found </h1>
        </div>
      </Layout>
    </>
  );
}
