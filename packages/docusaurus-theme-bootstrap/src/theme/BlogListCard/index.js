/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import BlogPostCard from '@theme/BlogPostCard';

function BlogListCard(props) {
  const {items} = props;

  return (
    <div className="container my-5">
      <div className="row row-cols-1">
        {items.map(({content: BlogPostContent}) =>
          <div className="col col-8 offset-2 mb-5">
            <BlogPostCard 
              key={BlogPostContent.metadata.permalink}
              frontMatter={BlogPostContent.frontMatter}
              metadata={BlogPostContent.metadata}
              truncated={BlogPostContent.metadata.truncated}
            />
          </div>
        )}
      </div>
    </div>
  )
}


export default BlogListCard;
