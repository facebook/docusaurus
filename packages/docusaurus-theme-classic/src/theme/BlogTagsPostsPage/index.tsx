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
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
  usePluralForm,
} from '@docusaurus/theme-common';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import clsx from 'clsx';

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
  const {metadata, items, sidebar, listMetadata} = props;
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
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogTagPostListPage,
      )}>
      <PageMetadata title={title} />
      <SearchMetadata tag="blog_tags_posts" />
      <BlogLayout sidebar={sidebar}>
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
        <BlogListPaginator metadata={listMetadata} />
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
