/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext} from 'react';

import Head from '@docusaurus/Head';
import Layout from '@theme/Layout'; // eslint-disable-line
import Footer from '@theme/Footer'; // eslint-disable-line
import DocusaurusContext from '@docusaurus/context';
import Post from '../Post';

function BlogPost(props) {
  const {metadata: contextMetadata = {}, siteConfig = {}} = useContext(
    DocusaurusContext,
  );
  const {baseUrl, favicon} = siteConfig;
  const {language, title} = contextMetadata;
  const {modules, metadata} = props;
  const BlogPostContents = modules[0];

  return (
    <Layout>
      <Head defaultTitle={siteConfig.title}>
        {title && <title>{title}</title>}
        {favicon && <link rel="shortcut icon" href={baseUrl + favicon} />}
        {language && <html lang={language} />}
      </Head>
      {BlogPostContents && (
        <div className="container margin-vert-xl">
          <div className="row">
            <div className="col col-6 col-offset-3">
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
