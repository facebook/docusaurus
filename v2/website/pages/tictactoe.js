import React from 'react';
import Helmet from 'react-helmet';
import Tictactoe from '@site/components/Tictactoe';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Tic Tac Toe</title>
        </Helmet>
        <Tictactoe />
      </div>
    );
  }
}
