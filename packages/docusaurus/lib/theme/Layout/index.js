/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Head from '@docusaurus/Head'; // eslint-disable-line
import Navbar from '@theme/Navbar'; // eslint-disable-line

import './styles.css';

function Layout({children}) {
  return (
    <div>
      <Head>
        <link
          crossOrigin="anonymous"
          href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
          integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf"
          preload
          rel="stylesheet"
        />
        <link
          href="https://infima-dev.netlify.com/css/default/default.min.css"
          preload
          rel="stylesheet"
          type="text/css"
        />
      </Head>
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
