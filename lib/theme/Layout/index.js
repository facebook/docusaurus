import React from 'react';
import {Link} from 'react-router-dom';
import siteConfig from '@site/siteConfig';
import styles from './styles.css';

/* eslint-disable react/prefer-stateless-function */
export default class Layout extends React.Component {
  render() {
    const {children, pagesData, docsData = {}, location} = this.props;
    const docsLinks = Object.values(docsData).map(data => ({
      path: `${siteConfig.baseUrl}${data.permalink}`
    }));
    const routeLinks = [...pagesData, ...docsLinks].map(
      data =>
        data.path !== location.pathname && (
          <li key={data.path}>
            <Link to={data.path}>{data.path}</Link>
          </li>
        )
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
