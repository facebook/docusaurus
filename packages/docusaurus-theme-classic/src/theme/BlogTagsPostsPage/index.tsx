/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';
import BlogPostItem from '@theme/BlogPostItem';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/BlogTagsPostsPage';
import BlogSidebar from '@theme/BlogSidebar';
import Translate, {translate} from '@docusaurus/Translate';

// Very simple pluralization: probably good enough for now
function pluralizePosts(count: number): string {
  return count === 1
    ? translate(
        {
          id: 'theme.blog.post.onePost',
          description: 'Label to describe one blog post',
          message: 'One post',
        },
        {count},
      )
    : translate(
        {
          id: 'theme.blog.post.nPosts',
          description: 'Label to describe multiple blog posts',
          message: '{count} posts',
        },
        {count},
      );
}

function BlogTagsPostPage(props: Props): JSX.Element {
  const {metadata, items, sidebar} = props;
  const {allTagsPath, name: tagName, count} = metadata;

  return (
    <Layout
      title={`Posts tagged "${tagName}"`}
      description={`Blog | Tagged "${tagName}"`}
      wrapperClassName="blog-wrapper">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--2">
            <BlogSidebar sidebar={sidebar} />
          </div>
          <main className="col col--8">
            <h1>
              <Translate
                id="theme.blog.tagTitle"
                description="The title of the page for a blog tag"
                values={{nPosts: pluralizePosts(count), tagName}}>
                {'{nPosts} tagged with "{tagName}"'}
              </Translate>
            </h1>
            <Link href={allTagsPath}>
              <Translate
                id="theme.tags.tagsPageLink"
                description="The label of the link targeting the tag list page">
                View All Tags
              </Translate>
            </Link>
            <div className="margin-vert--xl">
              {items.map(({content: BlogPostContent}) => (
                <BlogPostItem
                  key={BlogPostContent.metadata.permalink}
                  frontMatter={BlogPostContent.frontMatter}
                  metadata={BlogPostContent.metadata}
                  truncated>
                  <BlogPostContent />
                </BlogPostItem>
              ))}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default BlogTagsPostPage;
