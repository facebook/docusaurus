/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import ChangelogItem from '@theme/ChangelogItem';
import ChangelogPaginator from '@theme/ChangelogPaginator';
import TOC from '@theme/TOC';
import type {Props} from '@theme/BlogPostPage';

function ChangelogPageMetadata(props: Props): JSX.Element {
  const {content: BlogPostContents} = props;
  const {assets, metadata} = BlogPostContents;
  const {title, description, date, tags, authors, frontMatter} = metadata;
  const {keywords} = frontMatter;

  const image = assets.image ?? frontMatter.image;
  return (
    <PageMetadata
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
    </PageMetadata>
  );
}

function ChangelogPageContent(props: Props): JSX.Element {
  const {content: BlogPostContents, sidebar} = props;
  const {assets, metadata} = BlogPostContents;
  const {
    nextItem,
    prevItem,
    frontMatter,
    // @ts-expect-error: we injected this
    listPageLink,
  } = metadata;
  const {
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter;

  return (
    <>
      <PageMetadata />
      <BlogLayout
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
        <Link to={listPageLink}>
          <Translate id="changelog.backLink">← Back to index page</Translate>
        </Link>

        <ChangelogItem
          frontMatter={frontMatter}
          assets={assets}
          metadata={metadata}
          isBlogPostPage>
          <BlogPostContents />
        </ChangelogItem>

        {(nextItem || prevItem) && (
          <ChangelogPaginator nextItem={nextItem} prevItem={prevItem} />
        )}
      </BlogLayout>
    </>
  );
}

// This page doesn't change anything. It's just swapping BlogPostItem with our
// own ChangelogItem. We don't want to apply the swizzled item to the actual
// blog.
export default function ChangelogPage(props: Props): JSX.Element {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogPostPage,
      )}>
      <ChangelogPageMetadata {...props} />
      <ChangelogPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
