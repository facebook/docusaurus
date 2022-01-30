/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Seo from '@theme/Seo';
import BlogLayout from '@theme/BlogLayout';
import ChangelogItem from '@theme/ChangelogItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import type {Props} from '@theme/BlogPostPage';
import {ThemeClassNames} from '@docusaurus/theme-common';
import TOC from '@theme/TOC';
import Link from '@docusaurus/Link';

// This page doesn't change anything. It's just swapping BlogPostItem with our
// own ChangelogItem. We don't want to apply the swizzled item to the actual
// blog.
function BlogPostPage(props: Props): JSX.Element {
  const {content: BlogPostContents, sidebar} = props;
  const {assets, metadata} = BlogPostContents;
  const {
    title,
    description,
    nextItem,
    prevItem,
    date,
    tags,
    authors,
    frontMatter,
    // @ts-expect-error: we injected this
    listPageLink,
  } = metadata;
  const {
    hide_table_of_contents: hideTableOfContents,
    keywords,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter;

  const image = assets.image ?? frontMatter.image;

  return (
    <BlogLayout
      wrapperClassName={ThemeClassNames.wrapper.blogPages}
      pageClassName={ThemeClassNames.page.blogPostPage}
      sidebar={sidebar}
      toc={
        !hideTableOfContents &&
        BlogPostContents.toc &&
        BlogPostContents.toc.length > 0 ? (
          <TOC
            toc={BlogPostContents.toc}
            minHeadingLevel={tocMinHeadingLevel}
            maxHeadingLevel={tocMaxHeadingLevel}
          />
        ) : undefined
      }>
      <Seo
        title={title}
        description={description}
        keywords={keywords}
        image={image}>
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={date} />

        {authors.some((author) => author.url) && (
          <meta
            property="article:author"
            content={authors
              .map((author) => author.url)
              .filter(Boolean)
              .join(',')}
          />
        )}
        {tags.length > 0 && (
          <meta
            property="article:tag"
            content={tags.map((tag) => tag.label).join(',')}
          />
        )}
      </Seo>

      <Link to={listPageLink}>← Back to index page</Link>

      <ChangelogItem
        frontMatter={frontMatter}
        assets={assets}
        metadata={metadata}
        isBlogPostPage>
        <BlogPostContents />
      </ChangelogItem>

      {(nextItem || prevItem) && (
        <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
      )}
    </BlogLayout>
  );
}

export default BlogPostPage;
