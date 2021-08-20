/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Seo from '@theme/Seo';
import BlogLayout from '@theme/BlogLayout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import type {Props} from '@theme/BlogPostPage';
import {ThemeClassNames} from '@docusaurus/theme-common';

function BlogPostPage(props: Props): JSX.Element {
  const {content: BlogPostContents, sidebar} = props;
  const {frontMatter, frontMatterAssets, metadata} = BlogPostContents;
  const {title, description, nextItem, prevItem, date, tags} = metadata;
  const {
    hide_table_of_contents: hideTableOfContents,
    keywords,
    image,
  } = frontMatter;

  const authorURL = frontMatter.author_url || frontMatter.authorURL;

  return (
    <>
      <Seo
        title={title}
        description={description}
        keywords={keywords}
        image={image}>
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={date} />
        {authorURL && <meta property="article:author" content={authorURL} />}
        {tags.length > 0 && (
          <meta
            property="article:tag"
            content={tags.map((tag) => tag.label).join(',')}
          />
        )}
      </Seo>
      <BlogLayout
        wrapperClassName={ThemeClassNames.wrapper.blogPages}
        pageClassName={ThemeClassNames.page.blogPostPage}
        sidebar={sidebar}
        toc={
          !hideTableOfContents && BlogPostContents.toc
            ? BlogPostContents.toc
            : undefined
        }>
        <BlogPostItem
          frontMatter={frontMatter}
          frontMatterAssets={frontMatterAssets}
          metadata={metadata}
          isBlogPostPage>
          <BlogPostContents />
        </BlogPostItem>
        {(nextItem || prevItem) && (
          <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
        )}
      </BlogLayout>
    </>
  );
}

export default BlogPostPage;
