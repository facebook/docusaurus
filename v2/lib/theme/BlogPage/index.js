/* eslint-disable */
import React from 'react';
import {Link} from 'react-router-dom';
import Helmet from 'react-helmet';
import Layout from '@theme/Layout'; // eslint-disable-line

export default class BlogPage extends React.Component {
  render() {
    const {blogMetadatas, children, siteConfig} = this.props;
    return (
      <Layout {...this.props}>
        <Helmet defaultTitle={siteConfig.title} />
        <ul>
          {blogMetadatas.map(metadata => (
            <li key={metadata.permalink}>
              <Link to={metadata.permalink}>{metadata.permalink}</Link>
            </li>
          ))}
        </ul>
      </Layout>
    );
  }
}
