/* eslint-disable */
import React from 'react';
import Helmet from 'react-helmet';
import styles from './styles.css';
import Layout from '@theme/Layout'; // eslint-disable-line

export default class Docs extends React.Component {
  render() {
    const {route, docsData, siteConfig} = this.props;
    const currentDoc = docsData.find(data => data.path === route.path);

    const highlight = Object.assign(
      {},
      {
        version: '9.12.0',
        theme: 'default'
      },
      siteConfig.highlight
    );

    // Use user-provided themeUrl if it exists, else construct one from version and theme.
    const highlightThemeURL = highlight.themeUrl
      ? highlight.themeUrl
      : `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${
          highlight.version
        }/styles/${highlight.theme}.min.css`;

    return (
      <Layout {...this.props}>
        <Helmet>
          <title>{(currentDoc && currentDoc.title) || siteConfig.title}</title>
          <link rel="stylesheet" type="text/css" href={highlightThemeURL} />
        </Helmet>
        <div className={styles.mainContainer}>{this.props.children}</div>
      </Layout>
    );
  }
}
