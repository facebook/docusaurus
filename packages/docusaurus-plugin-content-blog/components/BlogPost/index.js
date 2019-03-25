/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout'; // eslint-disable-line

import DocusaurusContext from '@docusaurus/context';
import Post from '../Post';
import styles from './styles.module.css';

class BlogPost extends React.Component {
  render() {
    const {metadata: contextMetadata = {}, siteConfig = {}} = this.context;
    const {baseUrl, favicon} = siteConfig;
    const {language, title} = contextMetadata;
    const {modules, metadata} = this.props;
    const BlogPostContents = modules[0];

    return (
      <Layout>
        <Head defaultTitle={siteConfig.title}>
          {title && <title>{title}</title>}
          {favicon && <link rel="shortcut icon" href={baseUrl + favicon} />}
          {language && <html lang={language} />}
        </Head>
        <div className={styles.blogPostContainer}>
          <Post metadata={metadata}>
            <BlogPostContents />
          </Post>
        </div>
      </Layout>
    );
  }
}

BlogPost.contextType = DocusaurusContext;

export default BlogPost;
