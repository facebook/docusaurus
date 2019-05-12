/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout'; // eslint-disable-line
import BlogPostItem from '@theme/BlogPostItem';
import BlogListPaginator from '@theme/BlogListPaginator';

function BlogListPage(props) {
  const {metadata, items} = props;

  return (
    <Layout title="Blog" description="Blog">
      <div className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            {items.map(
              ({
                content: BlogPostContent,
                frontMatter,
                metadata: blogPostMetadata,
              }) => (
                <div
                  className="margin-bottom--xl"
                  key={blogPostMetadata.permalink}>
                  <BlogPostItem
                    frontMatter={frontMatter}
                    metadata={blogPostMetadata}
                    truncated>
                    <BlogPostContent />
                  </BlogPostItem>
                </div>
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
