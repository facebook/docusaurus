import React from 'react';
import {Link} from 'react-router-dom';
import styles from './styles.css';

/* eslint-disable react/prefer-stateless-function */
export default class Layout extends React.Component {
  render() {
    const {
      children,
      pagesMetadatas = [],
      docsMetadatas = {},
      location,
    } = this.props;
    const docsFlatMetadatas = Object.values(docsMetadatas);
    const routeLinks = [...pagesMetadatas, ...docsFlatMetadatas].map(
      data =>
        data.permalink !== location.pathname && (
          <li key={data.permalink}>
            <Link to={data.permalink}>{data.permalink}</Link>
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
