/* eslint-disable */
import React from 'react';
import Helmet from 'react-helmet';
import styles from './styles.css';
import Layout from '@theme/Layout'; // eslint-disable-line

export default class Docs extends React.Component {
  render() {
    const {route, siteConfig, metadata} = this.props;
    return (
      <Layout {...this.props}>
        <Helmet>
          <title>{(metadata && metadata.title) || siteConfig.title}</title>
        </Helmet>
        <div className={styles.mainContainer}>{this.props.children}</div>
      </Layout>
    );
  }
}
