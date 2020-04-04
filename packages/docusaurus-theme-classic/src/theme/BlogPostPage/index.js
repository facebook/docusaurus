/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import EditPage from '@theme/EditPage';

function BlogPostPage(props) {
  const {content: BlogPostContents} = props;
  const {frontMatter, metadata} = BlogPostContents;
  const {title, description, nextItem, prevItem, editBlogUrl} = metadata;

  return (
    <Layout title={title} description={description}>
      {BlogPostContents && (
        <div className="container margin-vert--xl">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <BlogPostItem
                frontMatter={frontMatter}
                metadata={metadata}
                isBlogPostPage>
                <BlogPostContents />
              </BlogPostItem>
              <EditPage editUrl={editBlogUrl} />
              {(nextItem || prevItem) && (
                <div className="margin-vert--xl">
                  <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default BlogPostPage;
