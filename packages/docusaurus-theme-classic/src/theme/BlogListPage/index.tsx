/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BlogLayout from '@theme/BlogLayout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogListPaginator from '@theme/BlogListPaginator';
import type {Props} from '@theme/BlogListPage';
import {PageMetadata, ThemeClassNames} from '@docusaurus/theme-common';
import SearchMetadata from '@theme/SearchMetadata';

function BlogListPageMetadata(props: Props): JSX.Element {
  const {metadata} = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata
        title={title}
        description={blogDescription}
        htmlClassNames={[
          ThemeClassNames.wrapper.blogPages,
          ThemeClassNames.page.blogListPage,
        ]}
      />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogListPageContent(props: Props): JSX.Element {
  const {metadata, items, sidebar} = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;

  return (
    <>
      <PageMetadata
        title={title}
        description={blogDescription}
        htmlClassNames={[
          ThemeClassNames.wrapper.blogPages,
          ThemeClassNames.page.blogListPage,
        ]}
      />
      <SearchMetadata tag="blog_posts_list" />
      <BlogLayout sidebar={sidebar}>
        {items.map(({content: BlogPostContent}) => (
          <BlogPostItem
            key={BlogPostContent.metadata.permalink}
            frontMatter={BlogPostContent.frontMatter}
            assets={BlogPostContent.assets}
            metadata={BlogPostContent.metadata}
            truncated={BlogPostContent.metadata.truncated}>
            <BlogPostContent />
          </BlogPostItem>
        ))}
        <BlogListPaginator metadata={metadata} />
      </BlogLayout>
    </>
  );
}

export default function BlogListPage(props: Props): JSX.Element {
  return (
    <>
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </>
  );
}
