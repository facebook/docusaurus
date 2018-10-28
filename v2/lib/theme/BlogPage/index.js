/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable */
import React from 'react';
import {Link} from 'react-router-dom';
import Helmet from 'react-helmet';
import Loadable from 'react-loadable';
import Layout from '@theme/Layout'; // eslint-disable-line
import BlogPost from '@theme/BlogPost'; // eslint-disable-line
import Loading from '@theme/Loading';

export default class BlogPage extends React.Component {
  render() {
    const {
      metadata,
      blogMetadatas,
      language,
      children,
      siteConfig = {},
    } = this.props;
    const {posts} = metadata;

    const {baseUrl, favicon} = siteConfig;
    return (
      <Layout {...this.props}>
        <Helmet>
          <title>{'Blog'}</title>
          {favicon && <link rel="shortcut icon" href={baseUrl + favicon} />}
          {language && <html lang={language} />}
          {language && <meta name="docsearch:language" content={language} />}
        </Helmet>
        <div>
          <ul>
            {blogMetadatas.map(metadata => (
              <li key={metadata.permalink}>
                <Link to={metadata.permalink}>{metadata.permalink}</Link>
              </li>
            ))}
          </ul>
          {children}
        </div>
      </Layout>
    );
  }
}
