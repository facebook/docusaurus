/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext} from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout'; // eslint-disable-line
import DocusaurusContext from '@docusaurus/context';
import Post from '../Post';

function BlogPage(props) {
  const context = useContext(DocusaurusContext);
  const {language, siteConfig = {}} = context;
  const {baseUrl, favicon} = siteConfig;
  const {
    metadata: {posts = []},
    modules: BlogPosts,
  } = props;

  return (
    <Layout>
      <Head>
        <title>Blog</title>
        {favicon && <link rel="shortcut icon" href={baseUrl + favicon} />}
        {language && <html lang={language} />}
        {language && <meta name="docsearch:language" content={language} />}
      </Head>
      <div>
        {BlogPosts.map((PostContent, index) => (
          <Post key={index} truncated metadata={posts[index]}>
            <PostContent />
          </Post>
        ))}
      </div>
    </Layout>
  );
}

export default BlogPage;
