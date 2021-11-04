/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';

function ErrorDisplay({error, tryAgain}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        width: '100%',
        fontSize: '20px',
      }}>
      <h1>This page crashed.</h1>
      <p>{error.message}</p>
      <button type="button" onClick={tryAgain}>
        Try again
      </button>
    </div>
  );
}

function Error({error, tryAgain}) {
  return (
    <Layout title="Page Error">
      <ErrorDisplay error={error} tryAgain={tryAgain} />
    </Layout>
  );
}

export default Error;
