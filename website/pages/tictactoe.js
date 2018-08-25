import React from 'react';
import Helmet from 'react-helmet';
import Layout from '@theme/Layout';
import Tictactoe from '@site/components/Tictactoe';

export default class Home extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        <Helmet>
          <title>Tic Tac Toe</title>
        </Helmet>
        <Tictactoe />
      </Layout>
    );
  }
}
