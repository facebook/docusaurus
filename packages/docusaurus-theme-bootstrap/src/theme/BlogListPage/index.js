/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import BlogPostCard from '@theme/BlogPostItem';
import Footer from '@theme/Footer';

function BlogListPage(props) {
  const {items} = props;

  return (
    <div className="container-fluid p-0">
      <div className="row row-cols-1 row-cols-sm-1">
        {items.map(({content: BlogPostContent}) => (
          <div
            key={BlogPostContent.metadata.permalink}
            className="col col-xl-4 offset-xl-4 col-xs-6 mb-5">
            <BlogPostCard
              frontMatter={BlogPostContent.frontMatter}
              metadata={BlogPostContent.metadata}
              truncated={BlogPostContent.metadata.truncated}>
              <BlogPostContent />
            </BlogPostCard>
          </div>
        ))}
        <Footer />
      </div>
    </div>
  );
}

export default BlogListPage;
