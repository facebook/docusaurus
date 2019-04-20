/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Navbar from '@theme/Navbar'; // eslint-disable-line

import './styles.css';

function Layout({children}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
