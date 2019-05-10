/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout'; // eslint-disable-line
import BlogPostItem from '@theme/BlogPostItem';

function BlogPostPage(props) {
  const {content: BlogPostContents, metadata} = props;

  return (
    <Layout title={metadata.title} description={metadata.description}>
      {BlogPostContents && (
        <div className="container margin-vert--xl">
          <div className="row">
            <div className="col col--6 col--offset-3">
              <BlogPostItem metadata={metadata}>
                <BlogPostContents />
              </BlogPostItem>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default BlogPostPage;
