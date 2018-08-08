import React from 'react';
import TicTacToe from './tictactoe';
import {Link} from 'react-router-dom';

export default class Home extends React.Component {
  render() {
    const {pagesData, docsData} = this.props;
    const routeLinks = [...pagesData, ...docsData].map(data => (
      <li key={data.path}>
        <Link to={data.path}>{data.path}</Link>
      </li>
    ));
    return (
      <div>
        <h2> Available Urls </h2>
        <ul>{routeLinks}</ul>
        <h2> Play some TicTacToe </h2>
        <TicTacToe />
      </div>
    );
  }
}
