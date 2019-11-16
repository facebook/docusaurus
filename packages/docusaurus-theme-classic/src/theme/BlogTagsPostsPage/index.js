/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';
import BlogPostItem from '@theme/BlogPostItem';
import Link from '@docusaurus/Link';

function BlogTagsPostPage(props) {
  const {metadata, items} = props;
  const {allTagsPath, name: tagName, count} = metadata;

  return (
    <Layout
      title={`Blog | Tagged "${tagName}"`}
      description={`Blog | Tagged "${tagName}"`}>
      <div className="container margin-vert--xl">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>
              {count} post(s) tagged with &quot;{tagName}&quot;
            </h1>
            <Link href={allTagsPath}>View All Tags</Link>
            <div className="margin-vert--xl">
              {items.map(
                ({content: BlogPostContent, metadata: blogPostMetadata}) => (
                  <BlogPostItem
                    className="margin-vert--xl"
                    key={blogPostMetadata.permalink}
                    frontMatter={BlogPostContent.frontMatter}
                    metadata={blogPostMetadata}
                    truncated>
                    <BlogPostContent />
                  </BlogPostItem>
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
