/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import BlogPostItem from '@theme/BlogPostItem';

function BlogPostPage(props) {
  const {content: BlogPostContents} = props;
  const {frontMatter, metadata} = BlogPostContents;

  return (
    <div className="container-fluid my-5">
      <div className="row row-cols-1 row-cols-sm-1">
        <div
          key={metadata.permalink}
          className="col col-md-6 offset-md-3 col-xs-6 mb-5">
          <BlogPostItem
            frontMatter={frontMatter}
            metadata={metadata}
            isBlogPostPage>
            <BlogPostContents />
          </BlogPostItem>
        </div>
      </div>
    </div>
  );
}

export default BlogPostPage;
