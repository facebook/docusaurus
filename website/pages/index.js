import React from 'react';
import Helmet from 'react-helmet';
import Layout from '@theme/Layout';
import Todo from '@site/components/Todo';

export default class Home extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        <Helmet>
          <title>Homepage</title>
        </Helmet>
        <Todo />
      </Layout>
    );
  }
}
