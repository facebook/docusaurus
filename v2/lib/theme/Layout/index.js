import React from 'react';
import Helmet from 'react-helmet';

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
        <Helmet>
          <link rel="stylesheet" type="text/css" href="/css/main.css" />
        </Helmet>
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
