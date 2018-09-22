import React from 'react';
import {Link} from 'react-router-dom';
import styles from './styles.css';

/* eslint-disable react/prefer-stateless-function */
export default class Layout extends React.Component {
  render() {
    const {children, pagesMetadatas, docsMetadatas = {}, location} = this.props;
    const docsLinks = Object.values(docsMetadatas).map(data => ({
      path: `${data.permalink}`,
    }));
    const routeLinks = [...pagesMetadatas, ...docsLinks].map(
      data =>
        data.path !== location.pathname && (
          <li key={data.path}>
            <Link to={data.path}>{data.path}</Link>
          </li>
        ),
    );
    return (
      <div>
        {children}
        <div className={styles.footer}>
          <ul className={styles.routeLinks}>{routeLinks}</ul>
        </div>
      </div>
    );
  }
}
