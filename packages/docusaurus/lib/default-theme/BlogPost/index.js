/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'; // eslint-disable-line

import Layout from '@theme/Layout'; // eslint-disable-line
import Footer from '@theme/Footer'; // eslint-disable-line

import Post from '../Post';

function BlogPost(props) {
  const {
    metadata: contextMetadata = {},
    siteConfig = {},
  } = useDocusaurusContext();
  const {baseUrl, favicon} = siteConfig;
  const {language, title} = contextMetadata;
  const {content, metadata} = props;
  const BlogPostContents = content;

  return (
    <Layout>
      <Head defaultTitle={siteConfig.title}>
        {title && <title>{title}</title>}
        {favicon && <link rel="shortcut icon" href={baseUrl + favicon} />}
        {language && <html lang={language} />}
      </Head>
      {BlogPostContents && (
        <div className="container margin-vert--xl">
          <div className="row">
            <div className="col col--6 col--offset-3">
              <Post metadata={metadata}>
                <BlogPostContents />
              </Post>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </Layout>
  );
}

export default BlogPost;
