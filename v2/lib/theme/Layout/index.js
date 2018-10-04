import React from 'react';
import Footer from '@theme/Footer'; // eslint-disable-line

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
