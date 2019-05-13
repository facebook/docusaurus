/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout'; // eslint-disable-line
import BlogPostItem from '@theme/BlogPostItem';

function BlogTagsPostPage(props) {
  const {metadata, items} = props;
  const {tag} = metadata;

  return (
    <Layout title={`Blog | Tagged ${tag}`} description={`Blog | Tagged ${tag}`}>
      <div className="container margin-vert--xl">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>
              {items.length} post(s) tagged with &quot;{tag}&quot;
            </h1>
            <div className="margin-vert--lg">
              {items.map(
                ({content: BlogPostContent, metadata: blogPostMetadata}) => (
                  <div key={blogPostMetadata.permalink}>
                    <BlogPostItem
                      frontMatter={BlogPostContent.frontMatter}
                      metadata={blogPostMetadata}
                      truncated>
                      <BlogPostContent />
                    </BlogPostItem>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BlogTagsPostPage;
