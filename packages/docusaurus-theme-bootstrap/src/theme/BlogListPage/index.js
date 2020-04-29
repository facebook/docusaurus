/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BlogPostCard from '@theme/BlogPostItem';
import Layout from '@theme/Layout';

function BlogListPage(props) {
  const {items, metadata} = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const isBlogOnlyMode = metadata.permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : 'Blog';

  return (
    <Layout title={title} description="Blog">
      <div className="container-fluid">
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
        </div>
      </div>
    </Layout>
  );
}

export default BlogListPage;
