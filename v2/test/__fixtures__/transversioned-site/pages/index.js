/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Head from '@docusaurus/head';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Head>
          <title>Home</title>
          <link rel="stylesheet" type="text/css" href="/css/basic.css" />
        </Head>
        <div>Home ... </div>
      </div>
    );
  }
}
