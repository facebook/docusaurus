import React from 'react';
import Helmet from 'react-helmet';
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
        <Helmet title="Homepage" />
        <h2> Available Urls </h2>
        <ul>{routeLinks}</ul>
      </div>
    );
  }
}
