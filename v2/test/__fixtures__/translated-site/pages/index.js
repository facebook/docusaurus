import React from 'react';
import Helmet from 'react-helmet';
import Layout from '@theme/Layout';

export default class Home extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        <Helmet>
          <title>Home</title>
          <link rel="stylesheet" type="text/css" href="/css/basic.css" />
        </Helmet>
        <div>Home ... </div>
      </Layout>
    );
  }
}
