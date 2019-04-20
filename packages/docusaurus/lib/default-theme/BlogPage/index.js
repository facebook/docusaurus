/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext} from 'react';
import Head from '@docusaurus/Head';
import Footer from '@theme/Footer'; // eslint-disable-line
import Layout from '@theme/Layout'; // eslint-disable-line
import DocusaurusContext from '@docusaurus/context';
import Post from '../Post';

function BlogPage(props) {
  const context = useContext(DocusaurusContext);
  const {language, siteConfig = {}} = context;
  const {baseUrl, favicon} = siteConfig;
  const {
    metadata: {posts = []},
    entries: BlogPosts,
  } = props;

  return (
    <Layout>
      <Head>
        <title>Blog</title>
        {favicon && <link rel="shortcut icon" href={baseUrl + favicon} />}
        {language && <html lang={language} />}
        {language && <meta name="docsearch:language" content={language} />}
      </Head>
      <div className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            {BlogPosts.map((PostContent, index) => (
              <div className="margin-bottom--xl" key={index}>
                <Post truncated metadata={posts[index]}>
                  <PostContent />
                </Post>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
}

export default BlogPage;
