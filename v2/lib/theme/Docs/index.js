/* eslint-disable */
import React from 'react';
import {Link} from 'react-router-dom';
import Helmet from 'react-helmet';

import DocsPaginator from '@theme/DocsPaginator'; // eslint-disable-line
import Layout from '@theme/Layout'; // eslint-disable-line
import Sidebar from '@theme/Sidebar'; // eslint-disable-line

import styles from './styles.css';

export default class Docs extends React.Component {
  render() {
    const {
      route,
      siteConfig,
      docsMetadatas,
      docsSidebars,
      metadata,
    } = this.props;
    const {language, version} = metadata;
    return (
      <Layout {...this.props}>
        <Helmet>
          <title>{(metadata && metadata.title) || siteConfig.title}</title>
          {language && <html lang={language} />}
          {language && <meta name="docsearch:language" content={language} />}
          {version && <meta name="docsearch:version" content={version} />}
        </Helmet>
        <div className={styles.mainContainer}>
          <Sidebar
            docsMetadatas={docsMetadatas}
            docsSidebars={docsSidebars}
            metadata={metadata}
          />
          <div className={styles.docContainer}>
            <div className={styles.docContent}>{this.props.children}</div>
            <div className={styles.paginatorContainer}>
              <DocsPaginator
                docsMetadatas={docsMetadatas}
                metadata={metadata}
              />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
