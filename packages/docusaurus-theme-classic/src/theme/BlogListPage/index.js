/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogListPaginator from '@theme/BlogListPaginator';

function BlogListPage(props) {
  const {metadata, items} = props;

  return (
    <Layout title="Blog" description="Blog">
      <div className="container margin-vert--xl">
        <div className="row">
          <div className="col col--8 col--offset-2">
            {items.map(
              ({content: BlogPostContent, metadata: blogPostMetadata}) => (
                <BlogPostItem
                  className="margin-bottom--xl"
                  key={blogPostMetadata.permalink}
                  frontMatter={BlogPostContent.frontMatter}
                  metadata={blogPostMetadata}
                  truncated>
                  <BlogPostContent />
                </BlogPostItem>
              ),
            )}
            <BlogListPaginator metadata={metadata} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BlogListPage;
