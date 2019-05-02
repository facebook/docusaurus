/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout'; // eslint-disable-line
import Post from '../Post';

function BlogPost(props) {
  const {content, metadata} = props;
  const BlogPostContents = content;
  return (
    <Layout title={metadata.title}>
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
    </Layout>
  );
}

export default BlogPost;
