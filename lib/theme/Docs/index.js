/* eslint-disable */
import React from 'react';
import {Link} from 'react-router-dom';
import Helmet from 'react-helmet';
import styles from './styles.css';
import Layout from '@theme/Layout'; // eslint-disable-line

export default class Docs extends React.Component {
  render() {
    const {route, siteConfig, docsMetadatas, metadata} = this.props;
    return (
      <Layout {...this.props}>
        <Helmet>
          <title>{(metadata && metadata.title) || siteConfig.title}</title>
        </Helmet>
        <div>
          {metadata.previous &&
            docsMetadatas[metadata.previous] && (
              <Link to={docsMetadatas[metadata.previous].permalink}>
                <span>← {metadata.previous_title}</span>
              </Link>
            )}
        </div>
        <div>
          {metadata.next &&
            docsMetadatas[metadata.next] && (
              <Link to={docsMetadatas[metadata.next].permalink}>
                <span>{metadata.next_title} →</span>
              </Link>
            )}
        </div>
        <div className={styles.mainContainer}>{this.props.children}</div>
      </Layout>
    );
  }
}
