/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';

function Error({error, tryAgain}) {
  return (
    <Layout title="Page Error">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '20px',
        }}>
        <h1>This page crashed.</h1>
        <p>{error.message}</p>
        <button type="button" onClick={tryAgain}>
          Try again
        </button>
      </div>
    </Layout>
  );
}

export default Error;
