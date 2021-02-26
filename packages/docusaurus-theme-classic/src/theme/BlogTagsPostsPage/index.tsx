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
import {usePluralFormSector} from '@docusaurus/theme-common';

// Not ideal but good enough!
// See doc of usePluralFormSector for reason!
const BlogPostPlurals = (count) => ({
  one: translate(
    {
      id: 'theme.blog.post.plurals.one',
      description: 'Pluralized label for one blog post',
      message: 'One post (ONE)',
    },
    {count},
  ),
  two: translate(
    {
      id: 'theme.blog.post.plurals.two',
      description: 'Pluralized label for two blog posts',
      message: '{count} posts (TWO)',
    },
    {count},
  ),
  few: translate(
    {
      id: 'theme.blog.post.plurals.few',
      description: 'Pluralized label for few blog posts',
      message: '{count} posts (FEW)',
    },
    {count},
  ),
  many: translate(
    {
      id: 'theme.blog.post.plurals.many',
      description: 'Pluralized label for many blog posts',
      message: '{count} posts (MANY)',
    },
    {count},
  ),
  other: translate(
    {
      id: 'theme.blog.post.plurals.other',
      description: 'Pluralized label for other blog posts',
      message: '{count} posts (OTHER)',
    },
    {count},
  ),
});

// Very simple pluralization: probably good enough for now
function useBlogPostPlural(count: number): string {
  const selectPluralForm = usePluralFormSector();
  const pluralForm = selectPluralForm(count);
  return BlogPostPlurals(count)[pluralForm];
}

function BlogTagsPostPageTitle({
  tagName,
  count,
}: {
  tagName: string;
  count: number;
}) {
  const nPosts = useBlogPostPlural(count);
  return (
    <Translate
      id="theme.blog.tagTitle"
      description="The title of the page for a blog tag"
      values={{nPosts, tagName}}>
      {'{{nPosts}} tagged with "{{tagName}}"'}
    </Translate>
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
              <BlogTagsPostPageTitle count={count} tagName={tagName} />
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
