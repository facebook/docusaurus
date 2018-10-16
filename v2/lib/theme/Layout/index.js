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
