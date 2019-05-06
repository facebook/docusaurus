/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout'; // eslint-disable-line
import BlogPostItem from '@theme/BlogPostItem';

function BlogListPage(props) {
  const {
    metadata: {posts = []},
    entries: BlogPosts,
  } = props;

  return (
    <Layout title="Blog">
      <div className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            {BlogPosts.map((PostContent, index) => (
              <div className="margin-bottom--xl" key={index}>
                <BlogPostItem truncated metadata={posts[index]}>
                  <PostContent />
                </BlogPostItem>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BlogListPage;
