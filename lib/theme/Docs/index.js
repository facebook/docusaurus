/* eslint-disable */
import React from 'react';
import Helmet from 'react-helmet';
import styles from './styles.css';
import Layout from '@theme/Layout'; // eslint-disable-line

export default class Docs extends React.Component {
  render() {
    const {route, siteConfig, docsMetadata, metadata} = this.props;
    return (
      <Layout {...this.props}>
        <Helmet>
          <title>{(metadata && metadata.title) || siteConfig.title}</title>
        </Helmet>
        <div className="docs-prevnext">
          {metadata.previous &&
            docsMetadata[metadata.previous] && (
              <a
                className="docs-prev button"
                href={docsMetadata[metadata.previous].permalink}>
                <span className="arrow-prev">← </span>
                <span>{metadata.previous_title}</span>
              </a>
            )}
        </div>
        <div className="docs-prevnext">
          {metadata.next &&
            docsMetadata[metadata.next] && (
              <a
                className="docs-prev button"
                href={docsMetadata[metadata.next].permalink}>
                <span>{metadata.next_title}</span>
                <span className="arrow-prev">→ </span>
              </a>
            )}
        </div>
        <div className={styles.mainContainer}>
        {this.props.children}
        </div>
      </Layout>
    );
  }
}
