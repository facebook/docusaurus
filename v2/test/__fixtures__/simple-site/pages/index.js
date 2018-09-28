import React from 'react';
import Helmet from 'react-helmet';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Home</title>
          <link rel="stylesheet" type="text/css" href="/css/basic.css" />
        </Helmet>
        <div>Home ... </div>
      </div>
    );
  }
}
