/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Link from '@docusaurus/Link';
import BlogLayout from '@theme/BlogLayout';
import BlogPostItem from '@theme/BlogPostItem';
import type {Props} from '@theme/BlogTagsPostsPage';
import Translate, {translate} from '@docusaurus/Translate';
import {ThemeClassNames, usePluralForm} from '@docusaurus/theme-common';

// Very simple pluralization: probably good enough for now
function useBlogPostsPlural() {
  const {selectMessage} = usePluralForm();
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          id: 'theme.blog.post.plurals',
          description:
            'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: 'One post|{count} posts',
        },
        {count},
      ),
    );
}

export default function BlogTagsPostsPage(props: Props): JSX.Element {
  const {metadata, items, sidebar} = props;
  const {allTagsPath, name: tagName, count} = metadata;
  const blogPostsPlural = useBlogPostsPlural();
  const title = translate(
    {
      id: 'theme.blog.tagTitle',
      description: 'The title of the page for a blog tag',
      message: '{nPosts} tagged with "{tagName}"',
    },
    {nPosts: blogPostsPlural(count), tagName},
  );

  return (
    <BlogLayout
      title={title}
      wrapperClassName={ThemeClassNames.wrapper.blogPages}
      pageClassName={ThemeClassNames.page.blogTagPostListPage}
      searchMetadata={{
        // assign unique search tag to exclude this page from search results!
        tag: 'blog_tags_posts',
      }}
      sidebar={sidebar}>
      <header className="margin-bottom--xl">
        <h1>{title}</h1>

        <Link href={allTagsPath}>
          <Translate
            id="theme.tags.tagsPageLink"
            description="The label of the link targeting the tag list page">
            View All Tags
          </Translate>
        </Link>
      </header>

      {items.map(({content: BlogPostContent}) => (
        <BlogPostItem
          key={BlogPostContent.metadata.permalink}
          frontMatter={BlogPostContent.frontMatter}
          assets={BlogPostContent.assets}
          metadata={BlogPostContent.metadata}
          truncated>
          <BlogPostContent />
        </BlogPostItem>
      ))}
    </BlogLayout>
  );
}
