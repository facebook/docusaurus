/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';
import withBaseUrl from '@docusaurus/withBaseUrl';
import './index.css';

/* Note that this is only temporary. TODO: better welcome screen */
function Home() {
  return (
    <Layout title="Hello">
      <div className="App">
        <header className="App-header">
          <img
            src={withBaseUrl('img/logo.svg')}
            className="App-logo"
            alt="logo"
          />
          <p>
            Edit <code>pages/index.js</code> and save to reload.
          </p>
        </header>
      </div>
    </Layout>
  );
}

export default Home;
