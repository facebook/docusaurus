/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Footer from '@theme/Footer'; // eslint-disable-line
import Navbar from '@theme/Navbar'; // eslint-disable-line

import './styles.css';

/* eslint-disable react/prefer-stateless-function */
export default class Layout extends React.Component {
  render() {
    const {
      children,
      pagesMetadatas = [],
      docsMetadatas = {},
      location,
    } = this.props;
    return (
      <div>
        <Navbar docsMetadatas={docsMetadatas} />
        {children}
        <Footer
          docsMetadatas={docsMetadatas}
          location={location}
          pagesMetadatas={pagesMetadatas}
        />
      </div>
    );
  }
}
