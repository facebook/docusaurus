import React from 'react';
import Helmet from 'react-helmet';

export default class World extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>World</title>
          <link rel="stylesheet" type="text/css" href="/css/basic.css" />
        </Helmet>
        <div>Hello World </div>
      </div>
    );
  }
}
